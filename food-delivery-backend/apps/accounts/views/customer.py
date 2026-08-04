from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.parsers import MultiPartParser, FormParser

from apps.accounts.serializers import UserDetailSerializer, CustomerAddressSerializer
from apps.accounts.models import Account, CustomerProfile, CustomerAddress

class CustomerViewSet(viewsets.ModelViewSet):


    #Profile
    @action(detail=False, methods=['get'], url_path='profile')
    def customer_profile(self, request):

        user = (request.user)
        serializer = UserDetailSerializer(user)
        return Response({
            "ID" : serializer.data['id'],
            "Name" : serializer.data['name'],
            "Email" : serializer.data['email'],
            "Phone" : serializer.data['phone'],
            "ProfilePicture" : serializer.data['profile_pic'],
            "Role" : serializer.data['role'],
            "Addresses" : serializer.data['customer_addresses']
        })
    
    #Delete Profile
    @action(detail=False, methods=['delete'], url_path='profile/delete')
    def delete_customer(self, request):
        try:
            instance = Account.objects.get(id=request.user.id, role='customer')
        except Account.DoesNotExist:
            return Response({'error': True, 'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        instance.delete()
        return Response({'error': False, 'message': 'User deleted successfully'}, status=status.HTTP_200_OK)
    
    # Update Profile
    @action(detail=False, methods=['patch'], url_path='profile/update', parser_classes=[MultiPartParser, FormParser])
    def update_profile(self, request):
        id = request.user.id

        try:
            instance = Account.objects.get(id=id, role='customer')
        except Account.DoesNotExist:
            return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserDetailSerializer(instance, data=request.data, partial=True)
        if serializer.is_valid():

            serializer.save()
            return Response({
                "error": False,
                "message": "Profile Updated Successfully",
                "data": serializer.data,
                "status":status.HTTP_200_OK
            })
        return Response({
                "error": True,
                "message": serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
)
    
    # List All Addresses
    @action(detail=False, methods=['get'], url_path='profile/address')
    def list_addresses(self, request):

        try:
            customer_profile = request.user.customer_profile
        except CustomerProfile.DoesNotExist:
            return Response(
                {"detail": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        addresses = customer_profile.addresses.all()

        serializer = CustomerAddressSerializer(addresses, many=True)

        return Response({
            "count": addresses.count(),
            "addresses": serializer.data
        })
    
    # Add address
    @action(detail=False, methods=['post'], url_path='profile/address/add')
    def add_address(self, request):

        try:
            customer_profile = request.user.customer_profile
        except CustomerProfile.DoesNotExist:
            return Response(
                {"detail": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = CustomerAddressSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(customer=customer_profile)
            return Response({
                "message": "Address Added Successfully",
                "data": serializer.data
            })

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    #Update Address
    @action(detail=True, method=['patch'], url_path='profile/address/update')
    def update_address(self, request, pk=None):

        try:
            customer_profile = request.user.customer_profile
        except CustomerProfile.DoesNotExist:
            return Response(
                {   
                    "error": True,
                    "message": "User not found"
                },
                status=status.HTTP_404_NOT_FOUND
            )
        
        try:
            address = CustomerAddress.objects.get(
                id=pk,
                customer=customer_profile
            )
        except CustomerAddress.DoesNotExist:
            return Response(
                {
                    "error": True,
                    "message": "Address not found"
                },
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = CustomerAddressSerializer(address, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save(customer=customer_profile)
            return Response({
                "error": False,
                "message": "Address Updated Successfully",
                "data": serializer.data
            })

        return Response({
            "error": True,
            "message": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    #Delete Address
    @action(detail=True, method=['delete'], url_path='profile/address/delete')
    def delete_address(self, request, pk=None):

        try:
            customer_profile = request.user.customer_profile
        except CustomerProfile.DoesNotExist:
            return Response(
                {   
                    "error": True,
                    "message": "User not found"
                },
                status=status.HTTP_404_NOT_FOUND
            )
        
        try:
            address = CustomerAddress.objects.get(
                id=pk,
                customer=customer_profile
            )
        except CustomerAddress.DoesNotExist:
            return Response(
                {
                    "error": True,
                    "message": "Address not found"
                },
                status=status.HTTP_404_NOT_FOUND
            )
        
        address.delete()
        return Response(
            {   
                "error": False,
                "message": "Address deleted successfully"
            },
            status=status.HTTP_200_OK
        )
    #Get Address
    @action(detail=True, methods=['get'])
    def get_address(self, request, pk=None):
        try:
            customer_profile = request.user.customer_profile
        except CustomerProfile.DoesNotExist:
            return Response(
                {   
                    "error": True,
                    "message": "User not found"
                },
                status=status.HTTP_404_NOT_FOUND
            )
        
        try:
            address = CustomerAddress.objects.get(
                id=pk,
                customer=customer_profile
            )
        except CustomerAddress.DoesNotExist:
            return Response(
                {
                    "error": True,
                    "message": "Address not found"
                },
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = CustomerAddressSerializer(address)

        
        return Response({
            "error": False,
            "message": "Address Fetch Successfully",
            "data": serializer.data
        })