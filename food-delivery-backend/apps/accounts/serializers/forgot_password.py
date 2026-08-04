
from rest_framework import serializers
from django.conf import settings
from apps.accounts.utils import send_otp

class ForgotPasswordSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=10)

# Serializer for the final password reset step
class ResetPasswordConfirmSerializer(serializers.Serializer):
    otp = serializers.CharField(max_length=6)
    new_password = serializers.CharField(min_length=settings.MIN_PASS_LENGHT)
    password_confirm = serializers.CharField()

    def validate(self, data):
        if data['new_password'] != data['password_confirm']:
            raise serializers.ValidationError("Passwords do not match.")
        return data

class ResetPasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField()
    new_password = serializers.CharField(
        write_only=True,
        min_length = settings.MIN_PASS_LENGHT,
        max_length = settings.MAX_PASS_LENGHT,
        error_messages = {
            "error": f"Password lenght must lie between {settings.MIN_PASS_LENGHT} and {settings.MAX_PASS_LENGHT} characters."
        }
    )
    confirm_password = serializers.CharField(
        write_only=True,
        min_length = settings.MIN_PASS_LENGHT,
        max_length = settings.MAX_PASS_LENGHT,
        error_messages = {
            "error": f"Password lenght must lie between {settings.MIN_PASS_LENGHT} and {settings.MAX_PASS_LENGHT} characters."
        }
    )

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords must match.")
        return data