from django.urls import path
from apps.accounts.views import AuthViewSet

register_customer = AuthViewSet.as_view({'post': 'register_customer'})
register_vendor = AuthViewSet.as_view({'post': 'register_vendor'})
login = AuthViewSet.as_view({'post': 'login'})

urlpatterns = [
    path('register/customer', register_customer, name='register_customer'),
    path('register/vendor', register_vendor, name='register_vendor'),
    path('login/', login, name='login'),
]
