from django.db import models
from .user import Account


class CustomerProfile(models.Model):
    user = models.OneToOneField(Account, on_delete=models.CASCADE, related_name='customer_profile')
    profile_pic = models.ImageField(upload_to='assests/customers/', null=True, blank=True)
    address = models.TextField(blank=True)

    def __str__(self):
        return self.user.email