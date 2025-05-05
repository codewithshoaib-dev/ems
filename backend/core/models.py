# core/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class PermissionBasedUser(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('HR', 'HR'),
        ('EMPLOYEE', 'Employee'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
