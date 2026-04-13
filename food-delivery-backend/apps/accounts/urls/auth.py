from django.urls import path
from apps.accounts.views import AuthViewSet

register_customer = AuthViewSet.as_view({'post': 'register_customer'})
register_vendor = AuthViewSet.as_view({'post': 'register_vendor'})
login = AuthViewSet.as_view({'post': 'login'})
verify_otp = AuthViewSet.as_view({'patch': 'verify_otp'})
regenerate_otp = AuthViewSet.as_view({'patch': 'regenerate_otp'})
forgot_password = AuthViewSet.as_view({'post': 'forgot_password'})
reset_password_confirm = AuthViewSet.as_view({'patch': 'reset_password_confirm'})


urlpatterns = [
    path('register/customer', register_customer, name='register_customer'),
    path('register/vendor', register_vendor, name='register_vendor'),
    path('<int:pk>/verify_otp', verify_otp, name='verify_otp'),
    path('<int:pk>/regenerate_otp', regenerate_otp, name='regenerate_otp'),
    path('forgot_password/', forgot_password, name='forgot_password'),
    path('forgot_password/<int:pk>/confirm/', reset_password_confirm, name='reset_password_confirm'),
    path('login/', login, name='login'),
]
