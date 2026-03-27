from django.contrib import admin
from apps.accounts.models import Account, CustomerProfile, VendorProfile, DeliveryProfile, CustomerAddress

class CustomerAddressInline(admin.TabularInline):
    model = CustomerAddress
    extra = 1


@admin.register(CustomerProfile)
class CustomerProfileAdmin(admin.ModelAdmin):
    inlines = [CustomerAddressInline]

# Register your models here.
admin.site.register(Account)
# admin.site.register(CustomerProfile)
admin.site.register(VendorProfile)
admin.site.register(DeliveryProfile)
admin.site.register(CustomerAddress)