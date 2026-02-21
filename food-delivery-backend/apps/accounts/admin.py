from django.contrib import admin
from apps.accounts.models import Account, CustomerProfile, VendorProfile, DeliveryProfile

# Register your models here.
admin.site.register(Account)
admin.site.register(CustomerProfile)
admin.site.register(VendorProfile)
admin.site.register(DeliveryProfile)