from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Cart, CartItems
from .serializers import CartSerializer

# Create your views here.
class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        customer = getattr(self.request.user, "customer_profile", None)

        if customer is None:
            return Cart.objects.none()

        return Cart.objects.filter(user=customer)

    @action(detail=False, methods=['get'])
    def my_cart(self, request):
        customer = request.user.customer_profile

        cart, _ = Cart.objects.get_or_create(user=customer)
        serializer = self.get_serializer(cart)

        return Response({"error": False, "data":serializer.data})

    @action(detail=False, methods=['post'])
    def add_item(self, request):
        customer = request.user.customer_profile

        product_id = request.data.get("product_id")
        quantity = int(request.data.get("quantity", 1))

        cart, _ = Cart.objects.get_or_create(user=customer)

        item, created = CartItems.objects.get_or_create(
            cart=cart,
            product_id=product_id,
            defaults={"quantity": quantity}
        )

        if not created:
            item.quantity += quantity
            item.save()

        return Response(
            {"error": False, "message": "Item added to cart"},
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=['patch'])
    def update_item(self, request):
        customer = request.user.customer_profile

        product_id = request.data.get("product")
        quantity = int(request.data.get("quantity"))
        cart = Cart.objects.get(user=customer)

        try:
            item = CartItems.objects.get(
                cart=cart,
                product_id=product_id
            )
        except CartItems.DoesNotExist:
            return Response(
                {"error": True, "message": "Item not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        if quantity <= 0:
            item.delete()
        else:
            item.quantity = quantity
            item.save()

        return Response({"error": False,"message": "Cart updated"})

    @action(detail=True, methods=['delete'])
    def remove_item(self, request, id):
        if id == None:
            return Response({"error": True, "message": "Dish can not be empty"})
        customer = request.user.customer_profile
        cart = Cart.objects.get(user=customer)

        CartItems.objects.filter(
            cart=cart,
            product_id=id
        ).delete()

        return Response({"error": False, "message": "Item removed"})