from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status, viewsets

from apps.accounts.serializers import UserDetailSerializer, VendorDetailSerializer
from apps.accounts.models import Account
from apps.accounts.permissions import IsVendor
class VendorViewSet(viewsets.ModelViewSet):

    #Profile
    @action(detail=False, methods=['get'], url_path='profile', permission_classes=[IsVendor])
    def vendor_profile(self, request):

        user = (request.user)
        serializer = VendorDetailSerializer(user)
        return Response({"error": False, "data":serializer.data}, status=status.HTTP_200_OK)
    
    #Delete Profile
    @action(detail=False, methods=['delete'], url_path='profile/delete', permission_classes=[IsVendor])
    def delete_vendor(self, request):
        try:
            instance = Account.objects.get(id=request.user.id, role='vendor')
        except Account.DoesNotExist:
            return Response({'error': False, 'message': 'Vendor not found'}, status=status.HTTP_404_NOT_FOUND)

        instance.delete()
        return Response({'error': False, 'message': 'Vendor deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    
    # Update Profile
    @action(detail=False, methods=['patch'], url_path='profile/update', permission_classes=[IsVendor])
    def update_profile(self, request):
        id = request.user.id

        try:
            instance = Account.objects.get(id=id, role='vendor')
        except Account.DoesNotExist:
            return Response({'error': True, 'message': 'Vendor not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = VendorDetailSerializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "error": False,
                "data": serializer.data,
                "message": "Vendor Updated Successfully"
            }, status=status.HTTP_202_ACCEPTED)
        return Response({"error": True, "message":serializer.errors}, status=status.HTTP_400_BAD_REQUEST)