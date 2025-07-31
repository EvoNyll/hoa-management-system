from rest_framework import permissions


class IsAdmin(permissions.BasePermission):
    """
    Custom permission to only allow admin users.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'admin'


class IsResident(permissions.BasePermission):
    """
    Custom permission to allow authenticated users (members and admins).
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role in ['member', 'admin']


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object or admins to access it.
    """
    def has_object_permission(self, request, view, obj):
        # Admin can access everything
        if request.user.role == 'admin':
            return True
        
        # Check if object has 'user' field and user owns it
        if hasattr(obj, 'user'):
            return obj.user == request.user
        
        # Check if object has 'author' field and user is the author
        if hasattr(obj, 'author'):
            return obj.author == request.user
            
        # Check if object has 'submitted_by' field and user submitted it
        if hasattr(obj, 'submitted_by'):
            return obj.submitted_by == request.user
            
        # Check if object has 'created_by' field and user created it
        if hasattr(obj, 'created_by'):
            return obj.created_by == request.user
            
        # If none of the above, deny access
        return False


class IsMemberOrAdmin(permissions.BasePermission):
    """
    Custom permission for members and admins only.
    """
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role in ['member', 'admin']
        )