from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager, PermissionsMixin
from django.core.validators import RegexValidator, validate_email
from django.conf import settings

phone_regex = RegexValidator(
    regex=r"^\d{10}", message="phone number must be 10 digits only" 
)

class CustomUserManager(BaseUserManager):
    def create_user(self, phone, password=None, **extra_fields):
        if not phone:
            raise ValueError('The Phone field must be set') 
        user = self.model(phone=phone, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, phone, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin')
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        return self.create_user(phone, password, **extra_fields)

class Account(AbstractUser, PermissionsMixin):
    username = None
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('delivery', 'Delivery'),
        ('customer', 'Customer'),
        ('vendor', 'Vendor'),
    )
    
    email = models.EmailField(max_length=50, null=True, blank=True, validators=[validate_email])
    phone = models.CharField(max_length=10, unique=True, validators=[phone_regex])
    otp = models.CharField(max_length=6)
    otp_expiry = models.DateTimeField(blank=True, null=True)
    max_otp_try = models.CharField(max_length=2, default=settings.MAX_OTP_TRY)
    otp_max_out = models.DateTimeField(max_length=2, blank=True, null=True)
    name = models.CharField(max_length=100, null=True, blank=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='customer')
    profile_pic = models.ImageField(upload_to='assets/users/', null=True, blank=True, default="assests/users/default_user.png")

    USERNAME_FIELD = 'phone'

    objects = CustomUserManager()

    def __str__(self):
        return self.phone