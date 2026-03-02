from django.urls import path, include

urlpatterns = [
    path('', include('apps.accounts.urls.auth')),
    path('admin/', include('apps.accounts.urls.admin')),
    path('customer/', include("apps.accounts.urls.customer")),
]