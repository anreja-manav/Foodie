from django.urls import path
from .views import OrderViewSet
from apps.accounts.permissions import IsVerifiedVendor

place_order = OrderViewSet.as_view({'post':'place_order'})
cancel_order = OrderViewSet.as_view({'patch': 'cancel_order'})
my_orders = OrderViewSet.as_view({'get':'my_orders'})
update_status = OrderViewSet.as_view({'patch':'update_status'}, permission_classes=[IsVerifiedVendor])
capture_payment = OrderViewSet.as_view({'patch':'capture_payment'})

urlpatterns = [
    path('my_orders', my_orders, name='my_orders'),
    path('place_order', place_order, name='place_order'),
    path('<int:pk>/cancel_order', cancel_order, name='cancel_order'),
    path('update/<int:pk>/status', update_status, name='update_status'),
    path('<int:pk>/capture_payment', capture_payment, name='capture_payment'),
]