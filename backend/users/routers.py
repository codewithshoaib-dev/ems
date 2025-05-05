from rest_framework.routers import DefaultRouter
from .viewsets import EmployeeProfileCreateUpdateView, EmployeeProfilReadOnlyView, LeaveRequestResponseView, LeaveRequestView
from django.urls import path, include

router = DefaultRouter()
router.register(r'employee_profile',EmployeeProfileCreateUpdateView, basename='employee_profile')
router.register(r'employee_profile' ,EmployeeProfilReadOnlyView, basename='employee_profile_readonly')
router.register(r'request_leave_rs', LeaveRequestResponseView, basename='leave-request-response')
router.register(r'request_leave', LeaveRequestView, basename='leave-request')


urlpatterns=[
    path('', include(router.urls)),
]
