from django.shortcuts import render
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status, viewsets
from django.utils.dateparse import parse_date
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.tokens import RefreshToken
from apps.accounts.permissions import IsAdmin

from apps.accounts.models import Account
from apps.accounts.serializers.auth import VendorRegisterSerializer, CustomerRegisterSerializer, DeliveryRegisterSerializer, AdminRegisterSerializer, LoginSerializer

class AuthViewSet(viewsets.ModelViewSet):
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
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors)

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
        
    #login
    @action(detail=False, methods=['post'], url_path='login')
    def login(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']

            try:
                user = Account.objects.get(email=email)
            except Account.DoesNotExist:
                return Response({
                    'status': status.HTTP_404_NOT_FOUND,
                    'message': 'User not found'
                })

            if not check_password(password, user.password):
                return Response({
                    'status': status.HTTP_400_BAD_REQUEST,
                    'message': 'Invalid Password'
                })

            refresh = RefreshToken.for_user(user)

            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token)
            })

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)