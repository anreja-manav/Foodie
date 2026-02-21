from rest_framework import serializers
from apps.accounts.models import Account

class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['id', 'email', 'role', 'is_active', 'date_joined']