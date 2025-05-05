from datetime import date, timedelta, datetime
import calendar
import json
from io import BytesIO

import qrcode
from django.http import HttpResponse, JsonResponse, Http404
from django.utils import timezone
from django.utils.timezone import make_aware
from django.contrib.auth import get_user_model
from django.db.models import Sum

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Attendance, LeaveRequest
from .serializers import ManualAttendanceSerializer, AttendanceSummarySeriallizer
from .permissions import IsHROrAdmin
from .PayrollService import PayrollService, export_csv


User = get_user_model()



class MonthlyAttendanceSummaryView(APIView):
    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise Http404('User not found')
        
        today = date.today()
        month = today.month
        year = today.year
        
        records = Attendance.objects.filter(user=user, date__year=year, date__month=month)

        total_hours = incomplete_days = 0
        present_days = records.count()

        for record in records:
            if record.check_in_time and record.check_out_time:
                check_in = make_aware(datetime.combine(date.min, record.check_in_time))
                check_out = make_aware(datetime.combine(date.min, record.check_out_time))
                duration = check_out - check_in
                total_hours += duration.total_seconds() / 3600
            else:
                incomplete_days += 1

        _, total_days_in_month = calendar.monthrange(year, month)
        working_days = sum(1 for day in range(1, total_days_in_month + 1)
                           if date(year, month, day).weekday() < 5)
        
        working_days = (date.today() - records.earliest('date').date).days + 1 if records.exists() else 0
        total_leaves = working_days - present_days if working_days > 0 else 0

        total_leaves = working_days - present_days

        data = {
            'user_id': user.id,
            'username': user.username,
            'month': month,
            'year': year,
            'total_hours': round(total_hours, 2),
            'present_days': present_days,
            'incomplete_days': incomplete_days,
            'total_leaves': total_leaves
        }

        return Response(data)


class PayrollView(APIView):
    permission_classes = [IsAuthenticated, IsHROrAdmin]

    def get(self, request, user_id, year, month):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise Http404("User not found")

        records = Attendance.objects.filter(user=user, date__year=year, date__month=month)

        try:
            hourly_rate = float(request.GET.get("hourly_rate", 15))
        except ValueError:
            return Response({"error": "Invalid hourly_rate"}, status=400)

        payroll = PayrollService(user, records, year, month, hourly_rate)
        data = payroll.calculate()

        if request.GET.get("export") == "csv":
            return export_csv(data)

        return Response(data)


class ManualAttendanceView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated, IsHROrAdmin]
    serializer_class = ManualAttendanceSerializer


def generate_qr_code(user_id):
    qr = qrcode.make(user_id)
    qr_image = BytesIO()
    qr.save(qr_image, format='PNG')
    qr_image.seek(0)
    return HttpResponse(qr_image.getvalue(), content_type="image/png")


def scan_qr(request):
    if request.method != "POST":
        return JsonResponse({'error': 'Invalid method'}, status=405)

    try:
        data = json.loads(request.body)
        user_id = data.get('user_id')
        user = User.objects.get(id=user_id)
    except (json.JSONDecodeError, User.DoesNotExist):
        return JsonResponse({'error': 'User not found or invalid JSON'}, status=404)

    current_time = timezone.now()
    attendance, _ = Attendance.objects.get_or_create(user=user, date=current_time.date())

    if not attendance.check_in_time:
        attendance.check_in_time = current_time
        attendance.save()
        return JsonResponse({'message': 'Check-in recorded successfully'})
    elif not attendance.check_out_time:
        attendance.check_out_time = current_time
        attendance.save()
        return JsonResponse({'message': 'Check-out recorded successfully'})
    else:
        return JsonResponse({'error': 'Attendance already recorded for today'}, status=400)



class LiveStatusView(APIView):
    def get(self, request):
        today = date.today()
        employees = User.objects.all()
        data = []

        for emp in employees:
            on_leave = LeaveRequest.objects.filter(
                employee=emp,
                status='APPROVED',
                start_date__lte=today,
                end_date__gte=today
            ).exists()

            if on_leave:
                status = 'On Leave'
            else:
            
                attendance = Attendance.objects.filter(user=emp, date=today).order_by('check_in_time').first()

                if attendance:
                    if attendance.check_in_time and not attendance.check_out_time:
                        status = 'Present'
                    elif attendance.check_in_time and attendance.check_out_time:
                        status = 'Logged'
                    else:
                        status = 'Not Present'
                else:
                    status = 'Not Present'

            data.append({
                'employee_id': emp.id,
                'username': emp.username,
                'status': status,
                'check_in':attendance.check_in_time,
                'check_out': attendance.check_out_time
            })

        return Response(data)


class DashboardStatsView(APIView):
    def get(self, request):
        today = date.today()

        present_today = Attendance.objects.filter(date=today).count()

        total_employees = User.objects.count()


        on_leave_count = LeaveRequest.objects.filter(
            status="APPROVED", 
            start_date__lte=today,
            end_date__gte=today
        ).count()

    
        late_checkins = Attendance.objects.filter(date=today, check_in_time__gt="09:00:00").count()

        stats = {
            "present_today": present_today,
            "total_employees": total_employees,
            "on_leave": on_leave_count,
            "late_checkins": late_checkins,
        }
        return Response(stats)