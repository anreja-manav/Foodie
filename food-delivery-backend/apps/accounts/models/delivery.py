from django.db import models
from .user import Account


class DeliveryProfile(models.Model):
    user = models.OneToOneField(Account, on_delete=models.CASCADE, related_name='delivery_profile')
    vehicle_number = models.CharField(max_length=20, unique=True)
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return self.user.name or self.user.email or f"Delivery {self.id}"