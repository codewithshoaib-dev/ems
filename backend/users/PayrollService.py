from datetime import date, datetime
import calendar

class PayrollService:
    def __init__(self, user, attendance_records, year, month, hourly_rate=15):
        self.user = user
        self.records = attendance_records
        self.year = year
        self.month = month
        self.hourly_rate = hourly_rate

        self.total_hours = 0
        self.present_days = 0
        self.incomplete_days = 0

    def calculate(self):
        self._calculate_attendance()
        working_days = self._get_working_days()
        total_leaves = working_days - self.present_days

        gross_pay = self.total_hours * self.hourly_rate
        deductions = self.incomplete_days * self.hourly_rate * 2
        net_pay = gross_pay - deductions

        return {
            'user_id': self.user.id,
            'username': self.user.username,
            'month': self.month,
            'year': self.year,
            'working_days': working_days,
            'present_days': self.present_days,
            'incomplete_days': self.incomplete_days,
            'total_hours': round(self.total_hours, 2),
            'hourly_rate': self.hourly_rate,
            'gross_pay': round(gross_pay, 2),
            'deductions': round(deductions, 2),
            'net_pay': round(net_pay, 2),
        }

    def _calculate_attendance(self):
        for record in self.records:
            if record.check_in_time and record.check_out_time:
                duration = datetime.combine(date.min, record.check_out_time) - datetime.combine(date.min, record.check_in_time)
                self.total_hours += duration.total_seconds() / 3600
                self.present_days += 1
            elif record.check_in_time or record.check_out_time:
                self.incomplete_days += 1

    def _get_working_days(self):
        _, total_days = calendar.monthrange(self.year, self.month)
        return sum(1 for day in range(1, total_days + 1)
                   if date(self.year, self.month, day).weekday() < 5)



import csv
from django.http import HttpResponse

def export_csv(data):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = f'attachment; filename=payroll_{data["username"]}_{data["month"]}_{data["year"]}.csv'

    writer = csv.writer(response)
    writer.writerow(data.keys())
    writer.writerow(data.values())

    return response
