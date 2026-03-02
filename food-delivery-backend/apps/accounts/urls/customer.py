from django.urls import path
from apps.accounts.views import CustomerViewSet

customer_profile = CustomerViewSet.as_view({'get' : 'customer_profile'})
delete_customer = CustomerViewSet.as_view({'delete': 'delete_customer'})
update_customer = CustomerViewSet.as_view({'patch' : 'update_profile'})
list_addresses = CustomerViewSet.as_view({'get' : 'list_addresses'})
add_address = CustomerViewSet.as_view({'post' : 'add_address'})
update_address = CustomerViewSet.as_view({'patch': 'update_address'})
delete_address = CustomerViewSet.as_view({'delete': 'delete_address'})

urlpatterns = [
    path('profile', customer_profile, name='customer_profile'),
    path('profile/delete', delete_customer, name='delete_customer'),
    path('profile/update', update_customer, name='update_customer'),
    path('profile/address/', list_addresses, name='list_addresses'),
    path('profile/address/add', add_address, name='add_address'),
    path('profile/address/update/<int:pk>/', update_address, name='update_address'),
    path('profile/address/delete/<int:pk>/', delete_address, name='delete_address'),
]
