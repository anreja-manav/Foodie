from django.contrib import admin
from .models import Product, Restaurant, Category
# Register your models here.
admin.site.register(Product)
admin.site.register(Restaurant)
admin.site.register(Category)