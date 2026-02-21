from rest_framework import serializers
from apps.accounts.models import CustomerProfile


class CustomerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerProfile
        fields = ['profile_pic', 'address']