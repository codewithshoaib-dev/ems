from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet, ViewSet
from rest_framework.exceptions import PermissionDenied
from .models import EmployeeProfile, LeaveRequest, LeaveRequestResponse
from .serializers import EmployeeProfileSerializer, LeaveRequestSerializer, LeaveRequestReponseSerializer
from .permissions import IsHROrAdmin
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404


class EmployeeProfileCreateUpdateView(ModelViewSet):
    permission_classes = [IsAuthenticated, IsHROrAdmin]
    serializer_class = EmployeeProfileSerializer

    def get_queryset(self):
        return EmployeeProfile.objects.all()

    def perform_create(self, serializer):
        user = self.request.user
        if user.role not in ['HR', 'admin']:
            raise PermissionDenied("UnAuthorized")
        serializer.save(user=user)

    def perform_update(self, serializer):
        user = self.request.user
        if user.role not in ['HR', 'Admin']:
            return PermissionDenied("UnAuthorized")
        serializer.save()

class EmployeeProfilReadOnlyView(ReadOnlyModelViewSet):
    serializer_class = EmployeeProfileSerializer
    def get_queryset(self):
        return EmployeeProfile.objects.filter(user=self.request.user)

    
class LeaveRequestView(ModelViewSet):
    serializer_class = LeaveRequestSerializer

    def get_queryset(self):
        return LeaveRequest.objects.filter(employee=self.request.user)
    
    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(employee=user)
    
class LeaveRequestResponseView(ModelViewSet):
    permission_classes = [IsAuthenticated, IsHROrAdmin]
    serializer_class = LeaveRequestReponseSerializer

    def get_queryset(self):
        return LeaveRequestResponse.objects.all()
    
    def perform_create(self, serializer, pk=None):
        leave_request_id = pk
        leave_request = LeaveRequest.objects.get(id=leave_request_id)
        print(leave_request_id)   
        serializer.save(leave_request=leave_request, responder=self.request.user)

        
    
    