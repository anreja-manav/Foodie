from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status, viewsets

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
            "Profile Picture" : serializer.data['profile_pic'],
            "Role" : serializer.data['role'],
            "Addresses" : serializer.data['customer_addresses']
        })
    
    #Delete Profile
    @action(detail=False, methods=['delete'], url_path='profile/delete')
    def delete_customer(self, request):
        try:
            instance = Account.objects.get(id=request.user.id, role='customer')
        except Account.DoesNotExist:
            return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        instance.delete()
        return Response({'detail': 'User deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    
    # Update Profile
    @action(detail=False, methods=['patch'], url_path='profile/update')
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
                "ID" : serializer.data['id'],
                "Name" : serializer.data['name'],
                "Email" : serializer.data['email'],
                "Phone" : serializer.data['phone'],
                "Profile Picture" : serializer.data['profile_pic'],
                "Role" : serializer.data['role'],
                "Addresses" : serializer.data['customer_addresses']
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
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
                {"detail": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        try:
            address = CustomerAddress.objects.get(
                id=pk,
                customer=customer_profile
            )
        except CustomerAddress.DoesNotExist:
            return Response(
                {"detail": "Address not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = CustomerAddressSerializer(address, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save(customer=customer_profile)
            return Response({
                "message": "Address Updated Successfully",
                "data": serializer.data
            })

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    #Delete Address
    @action(detail=True, method=['delete'], url_path='profile/address/delete')
    def delete_address(self, request, pk=None):

        try:
            customer_profile = request.user.customer_profile
        except CustomerProfile.DoesNotExist:
            return Response(
                {"detail": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        try:
            address = CustomerAddress.objects.get(
                id=pk,
                customer=customer_profile
            )
        except CustomerAddress.DoesNotExist:
            return Response(
                {"detail": "Address not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        address.delete()
        return Response(
            {"message": "Address deleted successfully"},
            status=status.HTTP_200_OK
        )
    
