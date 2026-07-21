
from rest_framework import serializers
from apps.restaurants.models import Category, Product, Restaurant



class ProductSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    restaurant = serializers.ReadOnlyField(source='restaurant.restaurant_name')
    restaurant_id = serializers.ReadOnlyField(source='restaurant.id')
    restaurant_rating = serializers.ReadOnlyField(source='restaurant.rating')
    food_type_display = serializers.CharField(source='get_food_type_display', read_only=True)
    
    # Custom field to calculate savings percentage on the fly
    savings_percentage = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'old_price', 
            'savings_percentage', 'food_type', 'food_type_display', 
            'rating', 'image', 'is_available', 'is_bestseller', 'preparation_time',
            'restaurant', 'restaurant_id', 'restaurant_rating'
        ]

    def get_image(self, obj):
        return obj.image.url if obj.image else None
    
    def get_savings_percentage(self, obj):
        if obj.old_price and obj.old_price > obj.price:
            savings = ((obj.old_price - obj.price) / obj.old_price) * 100
            return round(savings, 0)
        return 0


class CategorySerializer(serializers.ModelSerializer):
    products = serializers.SerializerMethodField()
    class Meta:
        model = Category
        fields = ['id', 'name', 'products', 'image']

    def get_products(self, obj):
        restaurant = self.context.get('restaurant')
        if restaurant:
            products = obj.products.filter(restaurant=restaurant)
        else:
            products = obj.products.all()
            
        return ProductSerializer(products, many=True, context=self.context).data



class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = [
            'id', 'restaurant_name', 'resturant_pic', 'restaurant_address', 
            'city', 'pincode', 'is_open', 'contact_number', 'restaurant_description',
            'GST_number', 'Account_number', 'fassai_certificate', 'opening_time',
            'closing_time', 'rating'
        ]

class RestaurantDetailSerializer(serializers.ModelSerializer):
    categories = serializers.SerializerMethodField()

    class Meta:
        model = Restaurant
        fields = [
            'id', 'restaurant_name', 'resturant_pic', 'restaurant_address', 
            'city', 'pincode', 'is_open', 'contact_number', 'restaurant_description',
            'GST_number', 'Account_number', 'fassai_certificate', 'opening_time',
            'closing_time', 'rating', 'categories'
        ]

    # FIXED: Moved out of the Meta class scope hierarchy
    def get_categories(self, obj):
        categories = Category.objects.filter(products__restaurant=obj).distinct()
        return CategorySerializer(categories, many=True, context={'restaurant': obj}).data