from django.db import models
from .user import Account


class CustomerProfile(models.Model):
    user = models.OneToOneField(Account, on_delete=models.CASCADE, related_name='customer_profile')

    def __str__(self):
        return self.user.name or self.user.email or f"Customer {self.id}"
    

class CustomerAddress(models.Model):
    customer = models.ForeignKey(
        CustomerProfile,
        on_delete=models.CASCADE,
        related_name='addresses'
    )
    address = models.TextField()
    city = models.CharField(max_length=100)
    pincode = models.CharField(max_length=6)
    contact_number = models.CharField(max_length = 10)
    is_default = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if self.is_default:
            CustomerAddress.objects.filter(
                customer=self.customer,
                is_default=True
            ).update(is_default=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.customer.user.name} - {self.city}"