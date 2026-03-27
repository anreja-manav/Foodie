from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status, viewsets

from apps.accounts.serializers import UserDetailSerializer
from apps.accounts.models import Account
from apps.accounts.permissions import IsVerifiedVendor
class VendorViewSet(viewsets.ModelViewSet):

    #Profile
    @action(detail=False, methods=['get'], url_path='profile', permission_classes=[IsVerifiedVendor])
    def vendor_profile(self, request):

        user = (request.user)
        serializer = UserDetailSerializer(user)
        return Response({
            "ID" : serializer.data['id'],
            "Name" : serializer.data['name'],
            "Email" : serializer.data['email'],
            "Phone" : serializer.data['phone'],
            "Profile Picture" : serializer.data['profile_pic'],
            "Role" : serializer.data['role'],
            "Resturant Details" : serializer.data['vendor_profile']
        })
    
    #Delete Profile
    @action(detail=False, methods=['delete'], url_path='profile/delete', permission_classes=[IsVerifiedVendor])
    def delete_vendor(self, request):
        try:
            instance = Account.objects.get(id=request.user.id, role='vendor')
        except Account.DoesNotExist:
            return Response({'detail': 'Vendor not found'}, status=status.HTTP_404_NOT_FOUND)

        instance.delete()
        return Response({'detail': 'Vendor deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    
    # Update Profile
    @action(detail=False, methods=['patch'], url_path='profile/update', permission_classes=[IsVerifiedVendor])
    def update_profile(self, request):
        id = request.user.id

        try:
            instance = Account.objects.get(id=id, role='vendor')
        except Account.DoesNotExist:
            return Response({'detail': 'Vendor not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserDetailSerializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "ID" : serializer.data['id'],
                "Name" : serializer.data['name'],
                "Email" : serializer.data['email'],
                "Phone" : serializer.data['phone'],
                "Profile Picture" : serializer.data['profile_pic'],
                "Role" : serializer.data['role'],
                "Resturant Details" : serializer.data['vendor_profile']
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)