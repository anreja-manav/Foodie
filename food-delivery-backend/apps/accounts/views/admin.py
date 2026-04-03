from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status, viewsets
from apps.accounts.permissions import IsAdmin
from django.shortcuts import get_object_or_404

from apps.accounts.serializers import AdminSerializer, PendingVendorSerializer, UserDetailSerializer, UserListSerializer
from apps.accounts.models import Account, VendorProfile

class AdminViewSet(viewsets.ModelViewSet):
    serializer = AdminSerializer
    
    # Admin Dashboard
    @action(detail=False, methods=['get'], url_path='admin/dashboard', permission_classes=[IsAdmin])
    def admin_dashboard(self, request):
        total_users = Account.objects.count()
        total_customers = Account.objects.filter(role='customer').count()
        total_vendors = Account.objects.filter(role='vendor').count()
        total_delivery = Account.objects.filter(role='delivery').count()

        pending_vendors = VendorProfile.objects.filter(is_verified=False).count()
        approved_vendors = VendorProfile.objects.filter(is_verified=True).count()

        return Response({
            "total_users": total_users,
            "total_customers": total_customers,
            "total_vendors": total_vendors,
            "total_delivery": total_delivery,
            "pending_vendors": pending_vendors,
            "approved_vendors": approved_vendors
        })
    
    # Admin Profile
    @action(detail=False, methods=['get'], url_path='admin/profile', permission_classes=[IsAdmin])
    def admin_profile(self, request):
        user = (request.user)
        serializer = UserDetailSerializer(user)
        return Response({
            "ID" : serializer.data['id'],
            "Profile Pic" : serializer.data['profile_pic'],
            "Name" : serializer.data['name'],
            "Phone" : serializer.data['phone'],
            "Email" : serializer.data['email']
        })
    
    # Pending Vendors List
    @action(detail=False, methods=['get'], url_path='pending/vendors', permission_classes=[IsAdmin])
    def pending_vendors(self, request):
        vendors = VendorProfile.objects.filter(is_verified=False)
        serializer = PendingVendorSerializer(vendors, many=True)

        return Response(serializer.data)

    # Verify Vendor
    @action(detail = False, methods=['patch'], url_path = 'verify/vendor', permission_classes=[IsAdmin])
    def verify_vendor(self, request):
        phone = request.data.get("phone")

        if not phone:
            return Response({"error": "Phone Number is required"}, status=400)

        vendor = get_object_or_404(Account, phone=phone, role='vendor')
        vendor_profile = vendor.vendor_profile

        vendor_profile.is_verified = True
        vendor_profile.save(update_fields=["is_verified"])

        return Response({
            "message": f"Vendor {vendor_profile.restaurant_name} approved successfully"
        })
    
    # Update Admin Profile
    @action(detail=False, methods=['patch'], url_path='admin/profile/update', permission_classes=[IsAdmin])
    def update_profile (self, request):
        id = request.user.id

        try:
            instance = Account.objects.get(id=id, role='admin')
        except Account.DoesNotExist:
            return Response({'detail': 'Admin not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = AdminSerializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # Delete Admin
    @action(detail=False, methods=['delete'], url_path='admin/delete', permission_classes=[IsAdmin])
    def delete_admin(self, request):
        try:
            instance = Account.objects.get(id=request.user.id, role='admin')
        except Account.DoesNotExist:
            return Response({'detail': 'Admin not found'}, status=status.HTTP_404_NOT_FOUND)

        instance.delete()
        return Response({'detail': 'Admin deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    
    
    # Delete User
    @action(detail=False, methods=['delete'], url_path='admin/delete/user', permission_classes=[IsAdmin])
    def delete_user(self, request):
        phone = request.data.get('phone')
        if not phone:
            return Response({'detail': 'Phone Number is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            instance = Account.objects.get(phone=phone)
        except Account.DoesNotExist:
            return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        instance.delete()
        return Response({'detail': 'User deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    
    # List All User
    @action(detail=False, method=['get'], url_path='list/users', permission_classes=[IsAdmin])
    def list_users(self, request):
        users = Account.objects.all()
        serializer = UserListSerializer(users, many=True)
        return Response(
            serializer.data
        )
