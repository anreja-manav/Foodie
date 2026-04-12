from rest_framework import serializers
from apps.accounts.models import Account, CustomerProfile, VendorProfile, DeliveryProfile
from django.db import transaction
from django.conf import settings
import random
from datetime import datetime, timedelta
from apps.accounts.utils import send_otp



# Admin Register Serializer
class AdminRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length = settings.MIN_PASS_LENGHT,
        max_length = settings.MAX_PASS_LENGHT,
        error_messages = {
            "error": f"Password lenght must lie between {settings.MIN_PASS_LENGHT} and {settings.MAX_PASS_LENGHT} characters."
        }
    )
    password2 = serializers.CharField(
        write_only=True,
        min_length = settings.MIN_PASS_LENGHT,
        max_length = settings.MAX_PASS_LENGHT,
        error_messages = {
            "error": f"Password lenght must lie between {settings.MIN_PASS_LENGHT} and {settings.MAX_PASS_LENGHT} characters."
        }
    )

    class Meta:
        model = Account
        fields = [
            'email',
            'name',
            'phone',
            'password',
            'password2',
        ]

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords must match.")
        return data

    @transaction.atomic
    def create(self, validated_data):
        otp = random.randint(10000, 99999)
        otp_expiry = datetime.now() + timedelta(minutes=10)
        validated_data.pop('password2')
        password = validated_data.pop('password')

        user = Account.objects.create_user(
            password=password,
            role="admin",
            otp = otp,
            otp_expiry = otp_expiry,
            max_otp_try = settings.MAX_OTP_TRY,
            **validated_data
        )
        try:
            send_otp(user.phone, otp)
        except Exception as e:
            print(f"Failed to send OTP: {e}")
        return user

#Vendor Register Serializer
class VendorRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length = settings.MIN_PASS_LENGHT,
        max_length = settings.MAX_PASS_LENGHT,
        error_messages = {
            "error": f"Password lenght must lie between {settings.MIN_PASS_LENGHT} and {settings.MAX_PASS_LENGHT} characters."
        }
    )
    password2 = serializers.CharField(
        write_only=True,
        min_length = settings.MIN_PASS_LENGHT,
        max_length = settings.MAX_PASS_LENGHT,
        error_messages = {
            "error": f"Password lenght must lie between {settings.MIN_PASS_LENGHT} and {settings.MAX_PASS_LENGHT} characters."
        }
    )

    class Meta:
        model = Account
        fields = [
            'email',
            'name',
            'phone',
            'password',
            'password2',
        ]

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords must match.")
        return data

    @transaction.atomic
    def create(self, validated_data):
        otp = random.randint(10000, 99999)
        otp_expiry = datetime.now() + timedelta(minutes=10)
        validated_data.pop('password2')
        password = validated_data.pop('password')

        user = Account.objects.create_user(
            password=password,
            role="admin",
            otp = otp,
            otp_expiry = otp_expiry,
            max_otp_try = settings.MAX_OTP_TRY,
            is_active = False,
            **validated_data
        )
        try:
            send_otp(user.phone, otp)
        except Exception as e:
            print(f"Failed to send OTP: {e}")

        VendorProfile.objects.create(
            user=user,
            is_verified=False
        )

        return user

#Customer Register Serializer
class CustomerRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length = settings.MIN_PASS_LENGHT,
        max_length = settings.MAX_PASS_LENGHT,
        error_messages = {
            "error": f"Password lenght must lie between {settings.MIN_PASS_LENGHT} and {settings.MAX_PASS_LENGHT} characters."
        }
    )
    password2 = serializers.CharField(
        write_only=True,
        min_length = settings.MIN_PASS_LENGHT,
        max_length = settings.MAX_PASS_LENGHT,
        error_messages = {
            "error": f"Password lenght must lie between {settings.MIN_PASS_LENGHT} and {settings.MAX_PASS_LENGHT} characters."
        }
    )

    class Meta:
        model = Account
        fields = [
            'id',
            'email',
            'name',
            'phone',
            'password',
            'password2'
        ]

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords must match.")
        return data

    @transaction.atomic
    def create(self, validated_data):
        otp = random.randint(10000, 99999)
        otp_expiry = datetime.now() + timedelta(minutes=10)
        validated_data.pop('password2')
        password = validated_data.pop('password')

        user = Account.objects.create_user(
            password=password,
            role="admin",
            otp = otp,
            otp_expiry = otp_expiry,
            max_otp_try = settings.MAX_OTP_TRY,
            is_active = False,
            **validated_data
        )
        try:
            send_otp(user.phone, otp)
        except Exception as e:
            print(f"Failed to send OTP: {e}")

        CustomerProfile.objects.create(
            user=user,
        )

        return user
    

#Deliver Register Serializer

class DeliveryRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length = settings.MIN_PASS_LENGHT,
        max_length = settings.MAX_PASS_LENGHT,
        error_messages = {
            "error": f"Password lenght must lie between {settings.MIN_PASS_LENGHT} and {settings.MAX_PASS_LENGHT} characters."
        }
    )
    password2 = serializers.CharField(
        write_only=True,
        min_length = settings.MIN_PASS_LENGHT,
        max_length = settings.MAX_PASS_LENGHT,
        error_messages = {
            "error": f"Password lenght must lie between {settings.MIN_PASS_LENGHT} and {settings.MAX_PASS_LENGHT} characters."
        }
    )

    vehicle_number = serializers.CharField(write_only = True)

    class Meta:
        model = Account
        fields = [
            'email',
            'name',
            'phone',
            'password',
            'password2',
            'vehicle_number'
        ]

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords must match.")
        return data

    @transaction.atomic
    def create(self, validated_data):
        otp = random.randint(10000, 99999)
        otp_expiry = datetime.now() + timedelta(minutes=10)
        validated_data.pop('password2')
        password = validated_data.pop('password')
        vehicle_number = validated_data.pop('vehicle_number')

        user = Account.objects.create_user(
            password=password,
            role="admin",
            otp = otp,
            otp_expiry = otp_expiry,
            max_otp_try = settings.MAX_OTP_TRY,
            is_active = False,
            **validated_data
        )
        try:
            send_otp(user.phone, otp)
        except Exception as e:
            print(f"Failed to send OTP: {e}")

        DeliveryProfile.objects.create(
            user = user,
            vehicle_number = vehicle_number,
            is_available = True
        )

        return user


class LoginSerializer(serializers.Serializer):
    phone = serializers.IntegerField()
    password = serializers.CharField()