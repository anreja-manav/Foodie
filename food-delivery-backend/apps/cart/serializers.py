from rest_framework import serializers
from .models import Cart, CartItems
from apps.restaurants.serializers import ProductSerializer

class CartItemSerializer(serializers.ModelSerializer):
    dish = ProductSerializer(source="product", read_only=True)
    # product_name = serializers.CharField(source="product.name", read_only=True)
    # image = serializers.ImageField(source='product.image', read_only=True)
    # product_price = serializers.DecimalField(
    #     source="product.price",
    #     max_digits=10,
    #     decimal_places=2,
    #     read_only=True
    # )

    class Meta:
        model = CartItems
        fields = [
            "id",
            "dish",
            "quantity",
        ]


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = [
            "id",
            "user",
            "items",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "user",
            "created_at",
            "updated_at",
        ]