from rest_framework import serializers
from .models import Orders, OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='product.name', read_only=True)
    image = serializers.ImageField(source='product.image', read_only=True)
    restaurant = serializers.CharField(source = 'product.restaurant', read_only = True)
    restaurant_id = serializers.IntegerField(
        source='product.restaurant.id',
        read_only=True
    )

    class Meta:
        model = OrderItem
        fields = ['product', 'quantity', 'price', 'name', 'image', 'restaurant', 'restaurant_id']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    user_name = serializers.CharField(
        source = 'user.user.name',
        read_only = True
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
            'created_at',
        ]

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Orders.objects.create(**validated_data)
        total = 0
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
            total += item_data['price'] * item_data['quantity']
        order.total_ammount = total
        order.save()
        return order