from django.db import models
from rest_framework.exceptions import ValidationError
from core.models import PermissionBasedUser
from datetime import date

class EmployeeProfile(models.Model):
    user = models.OneToOneField(PermissionBasedUser, on_delete=models.CASCADE, related_name='profile')
    department = models.CharField(max_length=100)
    salary = models.DecimalField(max_digits=10, decimal_places=2)
    contact = models.CharField(max_length=120)
    photo = models.ImageField(upload_to='profile_photos/', null=True, blank=True)


class Attendance(models.Model):
    user = models.ForeignKey(PermissionBasedUser, on_delete=models.CASCADE)
    check_in_time = models.TimeField()
    check_out_time = models.TimeField()
    date = models.DateField(auto_now_add=True)


class LeaveRequest(models.Model):

    class status(models.TextChoices):
        PENDING ="PENDING", "Pending"
        APPROVED = "APPROVED", "Approved"
        REJECTED = "REJECTED", "Rejected"
        CANCELLED = "CANCELLED","Cancelled"

    id = models.IntegerField(primary_key=True)
    employee = models.ForeignKey(PermissionBasedUser, on_delete=models.CASCADE, related_name='leave_request')
    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.TextField()
    status = models.CharField(max_length=20, choices=status.choices, default=status.PENDING)

    def clean(self):
        if self.start_date < date.today():
            raise ValidationError("Date cannot be in the past.")
        
        if self.start_date > self.end_date:
            raise ValidationError("Starting date cannot be after end date.")
        
        if LeaveRequest.objects.filter(employee=self.employee, 
                                       start_date__lte=self.end_date,
                                       end_date__gte=self.start_date).exclude(pk=self.pk).last():
            raise ValidationError("Leave overlaps with an existing request.")
        
    def __str__(self):
        return f"{self.employee} - {self.start_date} to {self.end_date}"
    
    
class LeaveRequestResponse(models.Model):
    class status(models.TextChoices):
        PENDING ="PENDING", "Pending"
        APPROVED = "APPROVED", "Approved"
        REJECTED = "REJECTED", "Rejected"
    
    leave_request = models.OneToOneField(LeaveRequest, on_delete=models.CASCADE, related_name='response')
    responder = models.ForeignKey(PermissionBasedUser, on_delete=models.CASCADE, related_name='responses')
    comment = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=status.choices, default="PENDING")


