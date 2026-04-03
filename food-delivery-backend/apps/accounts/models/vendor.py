from django.db import models
from .user import Account


class VendorProfile(models.Model):
    user = models.OneToOneField(Account, on_delete=models.CASCADE, related_name='vendor_profile')
    is_verified = models.BooleanField(default=False)
    def __str__(self):
        return self.user.name or self.user.email or f"Vendor {self.id}"