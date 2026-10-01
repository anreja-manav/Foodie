from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Orders
from .serializers import OrderSerializer
from apps.accounts.permissions import IsVerifiedVendor

# Create your views here.

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Orders.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'])
    def place_order(self, request):
        customer_profile = getattr(request.user, 'customer_profile', None)
        if not customer_profile:
            return Response({"error": True, "message": "User is not a customer"}, status=403)

        serializer = OrderSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=customer_profile)
            return Response({"error": False, "message": "Order Placed","data": serializer.data}, status=status.HTTP_201_CREATED)
            
        return Response({"error": True, "message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def my_orders(self, request):
        orders = Orders.objects.filter(user=request.user.customer_profile)
        serializer = OrderSerializer(orders, many=True)
        return Response({"error": False, "data":serializer.data})
    
    @action(detail=True, methods=['patch'])
    def cancel_order(self, request, pk=None):
        try:
            order = Orders.objects.get(pk=pk, user=request.user.customer_profile)
        except Orders.DoesNotExist:
            return Response({"error": True, "message": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

        if order.order_status == 'PLACED':
            order.order_status = 'CANCELLED'
            order.save()
            return Response({"error": False, "message": "Order cancelled successfully."})
        
        return Response(
            {"error": True, "message": "Order cannot be cancelled once it is confirmed or Out for delivery."}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    @action(detail=True, methods=['patch'], permission_classes=[IsVerifiedVendor])
    def update_status(self, request, pk=None):
        try:
            order = Orders.objects.get(id=pk)
        except Orders.DoesNotExist:
            return Response(
                {"error": True, "message": "Order not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        if order.order_status == "CANCELLED":
            return Response(
                {
                    "error": True,
                    "message": "Cannot change status once order is cancelled"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        new_status = request.data.get('order_status')

        if not hasattr(request.user, 'vendor_profile'):
            return Response(
                {
                    "error": True,
                    "message": "Vendor profile not found"
                },
                status=status.HTTP_403_FORBIDDEN
            )
        if not order.items.filter(
            product__restaurant__vendor=request.user.vendor_profile
        ).exists():
            return Response(
                {
                    "error": True,
                    "message": "You can only update status for your own restaurant's orders"
                },
                status=status.HTTP_403_FORBIDDEN
            )

        if new_status not in dict(Orders.STATUS_CHOICES):
            return Response(
                {
                    "error": True,
                    "message": "Invalid status"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        order.order_status = new_status
        order.save(update_fields=['order_status'])

        return Response(
            {
                "error": False,
                "message": f"Order status updated to {new_status}"
            }
        )

    
    @action(detail=True, methods=['patch'])
    def capture_payment(self, request, pk=None):
        order = self.get_object()
        if order.order_status == "CANCELLED":
            return Response({"error": True, "message": "Can not change cancelled order payment status"})
        pay_id = request.data.get('payment_id')
        
        if not pay_id:
            return Response({"error": True, "message": "Payment ID required"}, status=400)
            
        order.payment_id = pay_id
        order.payment_status = 'SUCCESS'
        if order.order_status == "PENDING": order.order_status = 'CONFIRMED'
        
        order.save()
        return Response({"error": False, "message": "Payment successful"})