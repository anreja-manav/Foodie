from decimal import Decimal
from django.db import transaction
from rest_framework import serializers
from .models import Orders, OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='product.name', read_only=True)
    image = serializers.ImageField(source='product.image', read_only=True)
    restaurant = serializers.CharField(source='product.restaurant.restaurant_name', read_only=True)
    restaurant_id = serializers.IntegerField(
        source='product.restaurant.id',
        read_only=True
    )
    price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = ['product', 'quantity', 'price', 'name', 'image', 'restaurant', 'restaurant_id']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    user_name = serializers.CharField(
        source='user.user.name',
        read_only=True
    )

    class Meta:
        model = Orders
        fields = [
            'id',
            'user_name',
            'items',
            'delivery_address',
            'address',
            'city',
            'pincode',
            'contact_number',
            'payment_id',
            'payment_status',
            'total_ammount',
            'order_status',
            'created_at',
        ]
        read_only_fields = [
            'address',
            'city',
            'pincode',
            'contact_number',
            'payment_id',
            'payment_status',
            'total_ammount',
            'order_status',
            'created_at',
        ]

    def create(self, validated_data):
        items_data = validated_data.pop('items')

        if not items_data:
            raise serializers.ValidationError({"items": "Order must contain at least one item."})

        with transaction.atomic():

            order = Orders.objects.create(**validated_data)
            
            total = Decimal('0.00')
            order_items = []

            for item_data in items_data:
                product = item_data['product']
                quantity = item_data.get('quantity', 1)
                item_price = product.price

                order_items.append(
                    OrderItem(
                        order=order,
                        product=product,
                        quantity=quantity,
                        price=item_price
                    )
                )
                total += item_price * quantity

            OrderItem.objects.bulk_create(order_items)

            order.total_ammount = total
            order.save(update_fields=['total_ammount'])

        return order