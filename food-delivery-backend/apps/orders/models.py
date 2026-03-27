from django.db import models
from apps.accounts.models import CustomerProfile, CustomerAddress
from apps.restaurants.models import Product

# Create your models here.
class Orders(models.Model):
    PAYMENT_CHOICES = [
        ('PENDING', 'pending'),
        ('SUCCESS', 'success'),
        ('FAILED', 'failed')
    ]
    STATUS_CHOICES = [
        ('CONFIRMED', 'confirmed'),
        ('PENDING', 'pending'),
        ('DELIVERED', 'delivered'),
        ('SHIPPED', 'shipped'),
        ('CANCELLED', 'cancelled')
    ]
    user = models.ForeignKey(CustomerProfile, on_delete=models.CASCADE, related_name='orders')
    items = models.ForeignKey(Product, on_delete=models.SET_NULL, related_name='orders')
    payment_id = models.CharField(max_length=50, null=True, blank=True)
    payment_status=models.CharField(max_length=10, choices=PAYMENT_CHOICES, default='PENDING')
    total_ammount = models.DecimalField(max_digits=10, decimal_places=2)
    order_status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')
    delivery_address = models.ForeignKey(
        CustomerAddress,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    address = models.TextField()
    city = models.CharField(max_length=100)
    pincode = models.CharField(max_length=6)
    contact_number = models.CharField(max_length=10)

    def save(self, *args, **kwargs):
        if self.delivery_address and not self.address:
            self.address = self.delivery_address.address
            self.city = self.delivery_address.city
            self.pincode = self.delivery_address.pincode
            self.contact_number = self.delivery_address.contact_number
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Order {self.id} - {self.user.user.email}"