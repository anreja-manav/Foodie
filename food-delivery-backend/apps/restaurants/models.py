from django.db import models
from apps.accounts.models.vendor import VendorProfile

class Category(models.Model):
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='categories/')

    class Meta:
        verbose_name_plural = "Categories"
    
    def __str__(self):
        return self.name
    
class Restaurant(models.Model):
    vendor = models.OneToOneField(VendorProfile, on_delete=models.CASCADE, related_name='restaurant')
    resturant_pic = models.ImageField(upload_to='restaurants/', null=True, blank=True)
    restaurant_name = models.CharField(max_length=255)
    restaurant_address = models.TextField()
    city = models.CharField(max_length=100)
    pincode = models.CharField(max_length=6)
    contact_number = models.CharField(max_length = 10)
    restaurant_description = models.TextField(null=True, blank=True)
    GST_number = models.CharField(max_length=100)

    Account_number = models.CharField(max_length=100, null=True, blank=True)
    fassai_certificate = models.ImageField(upload_to='restaurants/certificate/', null=True, blank=True)
    is_open = models.BooleanField(default=True)
    opening_time = models.TimeField(null=True, blank=True)
    closing_time = models.TimeField(null=True, blank=True)

    def __str__(self):
        return self.restaurant_name


class Product(models.Model):
    # Dietary Choices
    FOOD_TYPES = [
        ('VEG', 'Vegetarian'),
        ('NON-VEG', 'Non-Vegetarian'),
        ('EGG', 'Contains Egg'),
    ]

    name = models.CharField(max_length=255)
    size = models.CharField(max_length=10, null=True, blank=True)
    description = models.TextField(blank=True, null=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name="products")
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='menu')
    
    
    # Pricing
    price = models.DecimalField(max_digits=10, decimal_places=2)
    old_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    
    # Metadata
    food_type = models.CharField(max_length=10, choices=FOOD_TYPES, default='VEG')
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)
    image = models.ImageField(upload_to='assets/restaurants/product_images/', blank=True, null=True)
    
    # Operational Status
    is_available = models.BooleanField(default=True)
    is_bestseller = models.BooleanField(default=False)
    preparation_time = models.IntegerField(help_text="In minutes", default=20)

    def __str__(self):
        return f"{self.name} - {self.restaurant.restaurant_name}"