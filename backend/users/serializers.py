from rest_framework import serializers
from .models import EmployeeProfile , LeaveRequest, LeaveRequestResponse, Attendance
from core.models import PermissionBasedUser

class EmployeeProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True)

    class Meta:
        model = EmployeeProfile
        fields = [
            'username',
            'department',
            'salary',
            'contact',
            'photo'
        ]

    def create(self, validated_data):
        username = validated_data.pop('username')
        validated_data.pop('user', None)
        try:
            user = PermissionBasedUser.objects.get(username=username)
        except PermissionBasedUser.DoesNotExist:
            raise serializers.ValidationError("User not found.")
        
        profile, created = EmployeeProfile.objects.update_or_create(
            user=user,
            defaults=validated_data
        )
        
        return profile
    
class LeaveRequestSerializer(serializers.ModelSerializer):
    status = serializers.CharField(read_only=True)
    class Meta:
        model = LeaveRequest
        fields = [
            'reason',
            'start_date',
            'end_date',
             'status',
        ]

class LeaveRequestReponseSerializer(serializers.ModelSerializer):
    leave_request = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = LeaveRequestResponse
        fields = [
            'id',
            'leave_request',
            'comment',
            'status',
        ]
        

class ManualAttendanceSerializer(serializers.Serializer):
    username = serializers.CharField(write_only=True)
    check_in_time = serializers.TimeField()
    check_out_time = serializers.TimeField()
    date = serializers.DateField()
    class Meta:
       model = Attendance
       fields = [
           'username',
           'check_in_time',
           'check_out_time',
           'date',
       ]

    def validate(self, data):
        username = data.pop('username')
        date = data['date']
        instance_exists = Attendance.objects.filter(user__username=username, date=date).exists()
        if instance_exists:
            raise serializers.ValidationError(f'Attendance for date {date} has been already recorded!')
        user = PermissionBasedUser.objects.filter(username = username).first()
        self.user = user
        return data
    
    def create(self, validated_data):
        return Attendance.objects.create(user=self.user,**validated_data)
    

class AttendanceSummarySeriallizer(serializers.Serializer):
    user_id = serializers.IntegerField()
    username = serializers.CharField()
    total_hours = serializers.FloatField()
    total_days_present = serializers.IntegerField()
    total_leaves = serializers.IntegerField()
