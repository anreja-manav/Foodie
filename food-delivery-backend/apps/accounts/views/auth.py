from django.shortcuts import render
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.permissions import AllowAny
from django.utils.dateparse import parse_date
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.tokens import RefreshToken
import datetime, random
from django.conf import settings
from django.utils import timezone
from datetime import timedelta

from apps.accounts.permissions import IsAdmin
from apps.accounts.models import Account
from apps.accounts.serializers.auth import VendorRegisterSerializer, CustomerRegisterSerializer, DeliveryRegisterSerializer, AdminRegisterSerializer, LoginSerializer
from apps.accounts.utils import send_otp

class AuthViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.all()
    def get_serializer_class(self):
        if self.action == "register_customer":
            return CustomerRegisterSerializer
        if self.action == "register_vendor":
            return VendorRegisterSerializer
        if self.action == "register_delivery":
            return DeliveryRegisterSerializer
        if self.action == "register_admin":
            return AdminRegisterSerializer
        if self.action == "login":
            return LoginSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        return context

    @action(detail=True, methods=['patch'], url_path='verify_otp')
    def verify_otp(self, request, pk=None):
        instance = self.get_object()
        provided_otp = request.data.get("otp")

        if (not instance.is_active and 
            str(instance.otp) == str(provided_otp) and 
            instance.otp_expiry and 
            timezone.now() < instance.otp_expiry):
            
            instance.is_active = True
            instance.otp_expiry = None
            instance.max_otp_try = settings.MAX_OTP_TRY
            instance.otp_max_out = None
            instance.save()
            return Response({
                "message": "Successfully verified. You can login your account",
                "error": False
            }, status=status.HTTP_200_OK)
            
        return Response({
            "message": "Invalid OTP or expired.",
            "error": True
            }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['patch'], url_path='regenerate_otp')
    def regenerate_otp(self, request, pk=None):
        instance = self.get_object()
        
        # Check lockout
        if int(instance.max_otp_try) <= 0 and instance.otp_max_out and timezone.now() < instance.otp_max_out:
            return Response({
                "message": "Max attempts reached. Try later.",
                "error": True
            }, status=status.HTTP_403_FORBIDDEN)

        otp = random.randint(10000, 99999)
        instance.otp = otp
        instance.otp_expiry = timezone.now() + timedelta(minutes=10)
        instance.max_otp_try = int(instance.max_otp_try) - 1

        if instance.max_otp_try <= 0:
            instance.otp_max_out = timezone.now() + timedelta(hours=1)
        
        instance.save()
        send_otp(instance.phone, otp)

        return Response({
            "message": "New OTP sent.",
            "error": False
        }, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def login(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        phone = serializer.validated_data['phone']
        password = serializer.validated_data['password']

        try:
            user = Account.objects.get(phone=phone)
        except Account.DoesNotExist:
            return Response({
                'message': 'Invalid credentials',
                "error": True
            }, status=status.HTTP_401_UNAUTHORIZED)

        if not user.check_password(password):
            return Response({
                'message': 'Invalid credentials',
                "error": True
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        if not user.is_active:
            return Response({
                'message': 'Please verify your OTP first.',
                "error": True
            }, status=status.HTTP_403_FORBIDDEN)

        refresh = RefreshToken.for_user(user)
        return Response({
            "message": "Success",
            "error": False,
            'refresh': str(refresh),
            'access': str(refresh.access_token)
        })
    #Admin Registration
    @action(detail=False, methods=["post"], url_path="register/admin", permission_classes=[IsAdmin])
    def register_admin(self, request):
        serializer = self.get_serializer(
            data = request.data
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors)
        
    
    # Customer Registration
    @action(detail=False, methods=["post"], url_path="register/customer")
    def register_customer(self, request):
        serializer = self.get_serializer(
            data=request.data,
        )
        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "Otp Sent to your registered number",
                "error": False,
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({
            "message": "User Created",
            "error": True,
            "data":serializer.errors
        }, status=status.HTTP_403_FORBIDDEN)

    #Vendor Registration
    @action(detail=False, methods=["post"], url_path="register/vendor")
    def register_vendor(self, request):
        serializer = self.get_serializer(
            data=request.data,
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors)
    
    #Delivery Man Registration
    @action(detail=False, methods=["post"], url_path="register/delivery", permission_classes=[IsAdmin])
    def register_delivery(self, request):
        
        serializer = self.get_serializer(
            data = request.data
        )
        if serializer.is_valid():
        
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors)
