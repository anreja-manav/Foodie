from rest_framework import serializers
from apps.accounts.models import Account, VendorProfile

class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['id', 'email', 'role', 'is_active', 'date_joined']

class PendingVendorSerializer(serializers.ModelSerializer):
    email = serializers.CharField(source='user.email')
    name = serializers.CharField(source='user.name')

    class Meta:
        model = VendorProfile
        fields = [
            'id',
            'restaurant_name',
            'restaurant_address',
            'email',
            'name',
            'is_verified'
        ]