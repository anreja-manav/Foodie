from apps.accounts.models import CustomerAddress
from rest_framework.response import Response
from rest_framework import status

def get_city(user):
    default_address = CustomerAddress.objects.filter(
        customer__user=user, 
        is_default=True
    ).first()

    if not default_address:
        return Response(
            {'error': 'Please set a default delivery address to search for local food.'}, 
            status=status.HTTP_400_BAD_REQUEST
        )

    return default_address.city