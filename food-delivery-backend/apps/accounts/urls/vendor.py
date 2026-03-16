from django.urls import path
from apps.accounts.views import VendorViewSet
from apps.accounts.permissions import IsVerifiedVendor

vendor_profile = VendorViewSet.as_view({'get' : 'vendor_profile'}, permission_classes=[IsVerifiedVendor])
delete_vendor = VendorViewSet.as_view({'delete': 'delete_vendor'}, permission_classes=[IsVerifiedVendor])
update_vendor = VendorViewSet.as_view({'patch' : 'update_profile'}, permission_classes=[IsVerifiedVendor])
# list_addresses = CustomerViewSet.as_view({'get' : 'list_addresses'})
# add_address = CustomerViewSet.as_view({'post' : 'add_address'})
# update_address = CustomerViewSet.as_view({'patch': 'update_address'})
# delete_address = CustomerViewSet.as_view({'delete': 'delete_address'})

urlpatterns = [
    path('profile', vendor_profile, name='customer_profile'),
    path('profile/delete', delete_vendor, name='delete_customer'),
    path('profile/update', update_vendor, name='update_customer'),
    # path('profile/address/', list_addresses, name='list_addresses'),
    # path('profile/address/add', add_address, name='add_address'),
    # path('profile/address/update/<int:pk>/', update_address, name='update_address'),
    # path('profile/address/delete/<int:pk>/', delete_address, name='delete_address'),
]
