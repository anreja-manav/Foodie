from rest_framework import serializers
from .models import Orders, OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['product', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Orders
        fields = ['id', 'items', 'delivery_address', 'total_ammount', 'order_status', 'address', 'city']
        read_only_fields = ['address', 'city', 'total_ammount']

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