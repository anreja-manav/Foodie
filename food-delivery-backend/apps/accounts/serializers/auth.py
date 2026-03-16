from rest_framework import serializers
from apps.accounts.models import Account, CustomerProfile, VendorProfile, DeliveryProfile
from django.db import transaction


# Admin Register Serializer
class AdminRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

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
        validated_data.pop('password2')
        password = validated_data.pop('password')

        user = Account.objects.create_user(
            password=password,
            role="admin",
            **validated_data
        )

        return user

#Vendor Register Serializer
class VendorRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    restaurant_name = serializers.CharField(write_only = True)
    restaurant_address = serializers.CharField(write_only = True)
    resturant_pic = serializers.ImageField(write_only = True)
    restaurant_description = serializers.CharField(write_only = True)
    GST_number = serializers.CharField(write_only = True)
    Account_number = serializers.CharField(write_only = True)
    opening_time = serializers.TimeField(write_only = True)
    closing_time = serializers.TimeField(write_only = True)


    class Meta:
        model = Account
        fields = [
            'email',
            'name',
            'phone',
            'password',
            'password2',
            'restaurant_name',
            'restaurant_address',
            'resturant_pic',
            'restaurant_description',
            'GST_number',
            'Account_number',
            'opening_time',
            'closing_time'
        ]

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords must match.")
        return data

    @transaction.atomic
    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')

        restaurant_name = validated_data.pop('restaurant_name')
        restaurant_address = validated_data.pop('restaurant_address')
        resturant_pic = validated_data.pop('resturant_pic')
        restaurant_description = validated_data.pop('restaurant_description')
        GST_number = validated_data.pop('GST_number')
        Account_number = validated_data.pop('Account_number')
        opening_time = validated_data.pop('opening_time')
        closing_time = validated_data.pop('closing_time')

        user = Account.objects.create_user(
            password=password,
            role="vendor",
            **validated_data
        )

        VendorProfile.objects.create(
            user=user,
            restaurant_name=restaurant_name,
            restaurant_address=restaurant_address,
            resturant_pic=resturant_pic,
            restaurant_description=restaurant_description,
            GST_number=GST_number,
            Account_number=Account_number,
            opening_time=opening_time,
            closing_time=closing_time,
            is_verified=False
        )

        return user

#Customer Register Serializer
class CustomerRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = Account
        fields = [
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
        validated_data.pop('password2')
        password = validated_data.pop('password')

        user = Account.objects.create_user(
            password=password,
            role="customer",
            **validated_data
        )

        CustomerProfile.objects.create(
            user=user,
        )

        return user
    

#Deliver Register Serializer

class DeliveryRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

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
        validated_data.pop('password2')
        password = validated_data.pop('password')
        vehicle_number = validated_data.pop('vehicle_number')

        user = Account.objects.create_user(
            password=password,
            role="delivery",
            **validated_data
        )

        DeliveryProfile.objects.create(
            user = user,
            vehicle_number = vehicle_number,
            is_available = True
        )

        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()