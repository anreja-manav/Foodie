from django.urls import path
from apps.accounts.views import AuthViewSet
from rest_framework_simplejwt.views import TokenRefreshView

register_customer = AuthViewSet.as_view({'post': 'register_customer'})
register_vendor = AuthViewSet.as_view({'post': 'register_vendor'})
login_customer = AuthViewSet.as_view({'post': 'customer_login'})
login_vendor = AuthViewSet.as_view({'post': 'vendor_login'})
login_admin = AuthViewSet.as_view({'post': 'admin_login'})
login_delivery = AuthViewSet.as_view({'post': 'delivery_login'})
verify_otp = AuthViewSet.as_view({'patch': 'verify_otp'})
regenerate_otp = AuthViewSet.as_view({'patch': 'regenerate_otp'})
forgot_password = AuthViewSet.as_view({'post': 'forgot_password'})
reset_password_confirm = AuthViewSet.as_view({'patch': 'reset_password_confirm'})
reset_password = AuthViewSet.as_view({'patch': 'reset_password'})


urlpatterns = [
    path('register/customer', register_customer, name='register_customer'),
    path('register/vendor', register_vendor, name='register_vendor'),
    path('<int:pk>/verify_otp', verify_otp, name='verify_otp'),
    path('<int:pk>/regenerate_otp', regenerate_otp, name='regenerate_otp'),
    path('forgot_password/', forgot_password, name='forgot_password'),
    path('forgot_password/<int:pk>/confirm/', reset_password_confirm, name='reset_password_confirm'),
    path('login/customer', login_customer, name='login_customer'),
    path('login/vendor', login_vendor, name='login_vendor'),
    path('login/admin', login_admin, name='login_admin'),
    path('login/delivery', login_delivery, name='login_delivery'),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path('reset_password/', reset_password, name='reset_password')
]
