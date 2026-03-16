from django.db import models
from .user import Account


class VendorProfile(models.Model):
    user = models.OneToOneField(Account, on_delete=models.CASCADE, related_name='vendor_profile')
    resturant_pic = models.ImageField(upload_to='assests/resturants/', null=True, blank=True)
    restaurant_name = models.CharField(max_length=255)
    restaurant_address = models.TextField()
    restaurant_description = models.TextField(null=True, blank=True)
    GST_number = models.CharField(max_length=100)
    Account_number = models.CharField(max_length=100, null=True, blank=True)
    opening_time = models.TimeField(null=True, blank=True)
    closing_time = models.TimeField(null=True, blank=True)
    is_verified = models.BooleanField(default=False)
    is_open = models.BooleanField(default=True)
    def __str__(self):
        return self.restaurant_name