from rest_framework import permissions

class IsResident(permissions.BasePermission):
    """
    Permission for authenticated users with member or admin role
    """
    def has_permission(self, request, view):
        return (request.user.is_authenticated and 
                request.user.role in ['member', 'admin'])

class IsAdmin(permissions.BasePermission):
    """
    Permission for admin users only
    """
    def has_permission(self, request, view):
        return (request.user.is_authenticated and 
                request.user.role == 'admin')

class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Permission for object owner or admin
    """
    def has_object_permission(self, request, view, obj):
        if request.user.role == 'admin':
            return True
        return obj.user == request.user