from rest_framework import serializers
from apps.accounts.models import Account
from .customer import CustomerAddressSerializer
from .vendor import VendorProfileSerializer
from .delivery import DeliveryProfileSerializer


class UserDetailSerializer(serializers.ModelSerializer):
    customer_addresses = CustomerAddressSerializer(
        source='customer_profile.addresses',
        many=True,
        read_only=True
    )
    vendor_profile = VendorProfileSerializer(read_only=True)
    delivery_profile = DeliveryProfileSerializer(read_only=True)

    class Meta:
        model = Account
        fields = [
            'id',
            'email',
            'name',
            'phone',
            'profile_pic',
            'role',
            'customer_addresses',
            'vendor_profile',
            'delivery_profile',
        ]
class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = [
            'id',
            'email',
            'name',
            'phone',
            'profile_pic',
            'role',
        ]
