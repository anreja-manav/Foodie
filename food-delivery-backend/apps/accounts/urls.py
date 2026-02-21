from django.urls import path
from .views.auth import AuthViewSet
from .permissions import IsAdmin

register_customer = AuthViewSet.as_view({'post': 'register_customer'})
register_vendor = AuthViewSet.as_view({'post': 'register_vendor'})
login = AuthViewSet.as_view({'post': 'login'})
register_delivery = AuthViewSet.as_view({'post': 'register_delivery'}, permission_classes=[IsAdmin])
register_admin = AuthViewSet.as_view({'post': 'register_admin'}, permission_classes=[IsAdmin])


urlpatterns = [
    path('register/customer', register_customer, name='register_customer'),
    path('register/vendor', register_vendor, name='register_vendor'),
    path('login/', login, name='login'),
    path('register/delivery', register_delivery, name='register_delivery'),
    path('register/admin', register_admin, name='register_admin')
]
