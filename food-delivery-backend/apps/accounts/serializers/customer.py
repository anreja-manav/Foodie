from rest_framework import serializers
from apps.accounts.models import CustomerAddress


class CustomerAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerAddress
        fields = '__all__'
        read_only_fields = ['customer']