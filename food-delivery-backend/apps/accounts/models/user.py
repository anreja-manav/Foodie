from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email) 
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        return self.create_user(email, password, **extra_fields)

class Account(AbstractUser):
    username = None
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('delivery', 'Delivery'),
        ('customer', 'Customer'),
        ('vendor', 'Vendor'),
    )
    
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=10)
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='customer')
    profile_pic = models.ImageField(upload_to='assests/users/', null=True, blank=True, default="assests/users/default_user.png")

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'phone']

    objects = CustomUserManager()

    def __str__(self):
        return self.email