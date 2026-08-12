from django.urls import path
from apps.accounts.views import VendorViewSet
from apps.accounts.permissions import IsVendor

vendor_profile = VendorViewSet.as_view({'get' : 'vendor_profile'}, permission_classes=[IsVendor])
delete_vendor = VendorViewSet.as_view({'delete': 'delete_vendor'}, permission_classes=[IsVendor])
update_vendor = VendorViewSet.as_view({'patch' : 'update_profile'}, permission_classes=[IsVendor])

urlpatterns = [
    path('profile', vendor_profile, name='vendor_profile'),
    path('profile/delete', delete_vendor, name='delete_vendor'),
    path('profile/update', update_vendor, name='update_vendor'),
]
