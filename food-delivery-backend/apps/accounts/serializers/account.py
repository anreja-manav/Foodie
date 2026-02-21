from rest_framework import serializers
from apps.accounts.models import Account
from .customer import CustomerProfileSerializer
from .vendor import VendorProfileSerializer
from .delivery import DeliveryProfileSerializer


class UserDetailSerializer(serializers.ModelSerializer):
    customer_profile = CustomerProfileSerializer(read_only=True)
    vendor_profile = VendorProfileSerializer(read_only=True)
    delivery_profile = DeliveryProfileSerializer(read_only=True)

    class Meta:
        model = Account
        fields = [
            'id',
            'email',
            'name',
            'phone',
            'role',
            'customer_profile',
            'vendor_profile',
            'delivery_profile',
        ]