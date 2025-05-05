from django.urls import path
from . import views

urlpatterns = [
    
    path('attendance/monthly/<int:user_id>', views.MonthlyAttendanceSummaryView.as_view()),
    path('payroll_service/<int:user_id>/<int:year>/<int:month>/', views.PayrollView.as_view()),
    path('generate_qr/', views.generate_qr_code, name='generate_qr'),
    path('scan_qr/', views.scan_qr, name='scan_qr'),
    path('manual_attendance/', views.ManualAttendanceView.as_view()),
    path('employee_status/', views.LiveStatusView.as_view()),
    path('admin/dashboard/stats/', views.DashboardStatsView.as_view(), name='dashboard-stats')

]