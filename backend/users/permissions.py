from rest_framework import permissions

class IsHROrAdmin(permissions.BasePermission):
   
    def has_permission(self, request, view):
        user = request.user  
        if user.role in ['HR', 'admin']:
            return True
        return False


          
