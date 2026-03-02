from django.urls import path
from apps.accounts.permissions import IsAdmin
from apps.accounts.views import AdminViewSet, AuthViewSet

register_delivery = AuthViewSet.as_view({'post': 'register_delivery'}, permission_classes=[IsAdmin])
register_admin = AuthViewSet.as_view({'post': 'register_admin'}, permission_classes=[IsAdmin])
verify_vendor = AdminViewSet.as_view({'patch': 'verify_vendor'}, permission_classes=[IsAdmin])
admin_dashboard = AdminViewSet.as_view({'get': 'admin_dashboard'}, permission_classes=[IsAdmin])
pending_vendors = AdminViewSet.as_view({'get': 'pending_vendors'}, permission_classes=[IsAdmin])
admin_profile = AdminViewSet.as_view({'get': 'admin_profile'}, permission_classes=[IsAdmin])
admin_profile_update = AdminViewSet.as_view({'patch': 'update_profile'}, permission_classes=[IsAdmin])
delete_admin = AdminViewSet.as_view({'delete': 'delete_admin'}, permission_classes=[IsAdmin])
delete_user = AdminViewSet.as_view({'delete': 'delete_user'}, permission_classes=[IsAdmin])
list_users = AdminViewSet.as_view({'get': 'list_users'}, permission_classes=[IsAdmin])


urlpatterns = [
    path('register/delivery', register_delivery, name='register_delivery'),
    path('register/admin', register_admin, name='register_admin'),
    path('verify/vendor', verify_vendor, name='verify_vendor'),
    path('dashboard', admin_dashboard, name='admin_dashboard'),
    path('pending/vendors', pending_vendors, name='pending_vendors'),
    path('profile', admin_profile, name='admin_profile'),
    path('profile/update', admin_profile_update, name='admin_profile_update'),
    path('profile/delete', delete_admin, name='delete_admin'),
    path('user/delete', delete_user, name='delete_user'),
    path('users', list_users, name='list_users'),

]
