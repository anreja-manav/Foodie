from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status, viewsets
from apps.accounts.permissions import IsAdmin, IsVerifiedVendor, IsVendor
from django.shortcuts import get_object_or_404
from django.db.models import Q

from apps.restaurants.models import Category, Product, Restaurant
from apps.accounts.models import VendorProfile
from apps.restaurants.serializers import CategorySerializer, ProductSerializer, RestaurantSerializer
from .utils import get_city

# Create your views here.

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    @action(detail=True, methods=['get'])
    def products(self, request, pk=None):
        category = self.get_object()
        products = category.products.filter(is_available=True)
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
    
    @action(detail=True, methods=['delete'], permission_classes = [IsVerifiedVendor, IsAdmin])
    def delete_category(self, request, pk=None):
        category = self.get_object()
        category.delete()
        return Response({'message': 'category deleted'}, status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=False, methods=['post'], permission_classes = [IsVerifiedVendor, IsAdmin])
    def create_category(self, request):
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "data": serializer.data,
                    "message" : "Category Added Successfully"
                },status=status.HTTP_201_CREATED)
        return Response({
            "data":serializer.errors,
            "message" : "Error Occured"
            }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['patch'], permission_classes = [IsVerifiedVendor, IsAdmin])
    def update_category(self, request, pk=None):
        category = self.get_object()
        name = request.data.get('name')
        if name is not None:
            category.name = name
            category.save()
            return Response({'message': 'category updated'}, status=status.HTTP_200_OK)
        return Response({'message': 'name field is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def list(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response({
            "message": "Success",
            "error": False,
            "data":serializer.data
        }, status=status.HTTP_200_OK)

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    
    @action(detail=False, methods=['post'], permission_classes = [IsVerifiedVendor])
    def bulk_create(self, request):
        serializer = ProductSerializer(data=request.data, many=True)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "data": serializer.data,
                    "message" : "Products Added Successfully"
                },status=status.HTTP_201_CREATED)
        return Response({
            "data":serializer.errors,
            "message" : "Error Occured"
            }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['patch'], permission_classes = [IsVerifiedVendor])
    def update_availability(self, request, pk=None):
        product = self.get_object()
        is_available = request.data.get('is_available')
        if is_available is not None:
            product.is_available = is_available
            product.save()
            return Response({'message': 'availability updated'}, status=status.HTTP_200_OK)
        return Response({'message': 'is_available field is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['patch'])
    def update_rating(self, request, pk=None):
        product = self.get_object()
        rating = request.data.get('rating')
        if rating is not None:
            try:
                rating = float(rating)
                if 0 <= rating <= 5:
                    product.rating = rating
                    product.save()
                    return Response({'message': 'rating updated'}, status=status.HTTP_200_OK)
                else:
                    return Response({'message': 'Rating must be between 0 and 5'}, status=status.HTTP_400_BAD_REQUEST)
            except ValueError:
                return Response({'message': 'Invalid rating value'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'message': 'rating field is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['patch'], permission_classes = [IsAdmin])
    def mark_bestseller(self, request, pk=None):
        product = self.get_object()
        is_bestseller = request.data.get('is_bestseller')
        if is_bestseller is not None:
            product.is_bestseller = is_bestseller
            product.save()
            return Response({'message': 'bestseller status updated'}, status=status.HTTP_200_OK)
        return Response({'message': 'is_bestseller field is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['patch'], permission_classes = [IsVerifiedVendor])
    def update_preparation_time(self, request, pk=None):
        product = self.get_object()
        preparation_time = request.data.get('preparation_time')
        if preparation_time is not None:
            try:
                preparation_time = int(preparation_time)
                if preparation_time >= 0:
                    product.preparation_time = preparation_time
                    product.save()
                    return Response({'message': 'preparation time updated'}, status=status.HTTP_200_OK)
                else:
                    return Response({'message': 'Preparation time must be non-negative'}, status=status.HTTP_400_BAD_REQUEST)
            except ValueError:
                return Response({'message': 'Invalid preparation time value'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'message': 'preparation_time field is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['patch'], permission_classes = [IsVerifiedVendor])
    def update_price(self, request, pk=None):
        product = self.get_object()
        price = request.data.get('price')
        old_price = request.data.get('old_price')
        if price is not None:
            try:
                price = float(price)
                if price >= 0:
                    product.price = price
                else:
                    return Response({'message': 'Price must be non-negative'}, status=status.HTTP_400_BAD_REQUEST)
            except ValueError:
                return Response({'message': 'Invalid price value'}, status=status.HTTP_400_BAD_REQUEST)
        if old_price is not None:
            try:
                old_price = float(old_price)
                if old_price >= 0:
                    product.old_price = old_price
                else:
                    return Response({'message': 'Old price must be non-negative'}, status=status.HTTP_400_BAD_REQUEST)
            except ValueError:
                return Response({'message': 'Invalid old price value'}, status=status.HTTP_400_BAD_REQUEST)
        product.save()
        return Response({'message': 'price updated'}, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['patch'], permission_classes = [IsVerifiedVendor])
    def update_food_type(self, request, pk=None):
        product = self.get_object()
        food_type = request.data.get('food_type')
        if food_type in dict(Product.FOOD_TYPES).keys():
            product.food_type = food_type
            product.save()
            return Response({'message': 'food type updated'}, status=status.HTTP_200_OK)
        return Response({'message': 'Invalid food type value'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['patch'], permission_classes = [IsVerifiedVendor])
    def update_category(self, request, pk=None):
        product = self.get_object()
        category_id = request.data.get('category_id')
        if category_id is not None:
            category = get_object_or_404(Category, id=category_id)
            product.category = category
            product.save()
            return Response({'message': 'category updated'}, status=status.HTTP_200_OK)
        return Response({'message': 'category_id field is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['patch'], permission_classes = [IsVerifiedVendor])
    def update_description(self, request, pk=None):
        product = self.get_object()
        description = request.data.get('description')
        if description is not None:
            product.description = description
            product.save()
            return Response({'message': 'description updated'}, status=status.HTTP_200_OK)
        return Response({'message': 'description field is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['patch'], permission_classes = [IsVerifiedVendor])
    def update_name(self, request, pk=None):
        product = self.get_object()
        name = request.data.get('name')
        if name is not None:
            product.name = name
            product.save()
            return Response({'message': 'name updated'}, status=status.HTTP_200_OK)
        return Response({'message': 'name field is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['patch'], permission_classes = [IsVerifiedVendor])
    def update_image(self, request, pk=None):
        product = self.get_object()
        image = request.data.get('image')
        if image is not None:
            product.image = image
            product.save()
            return Response({'message': 'image updated'}, status=status.HTTP_200_OK)
        return Response({'message': 'image field is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['delete'], permission_classes = [IsVerifiedVendor])
    def delete_product(self, request, pk=None):
        product = self.get_object()
        product.delete()
        return Response({'message': 'product deleted'}, status=status.HTTP_204_NO_CONTENT)
    

    @action(detail=False, methods=['get'])
    def bestsellers(self, request):
        user_city = get_city(request.user)
        bestsellers = Product.objects.filter(
            is_bestseller=True,
            is_available=True,
            restaurant__city__iexact=user_city
        ).select_related('restaurant', 'category')
        serializer = ProductSerializer(bestsellers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'])
    def by_category(self, request):
        category_id = request.query_params.get('category_id')
        if category_id is not None:
            products = Product.objects.filter(category_id=category_id, is_available=True)
            serializer = ProductSerializer(products, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({'error': 'category_id query parameter is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def by_food_type(self, request):
        user_city = get_city(request.user)
        food_type = request.query_params.get('food_type')
        if food_type in dict(Product.FOOD_TYPES).keys():
            products = Product.objects.filter(
                food_type=food_type,
                is_available=True,
                restaurant__city__iexact=user_city
        ).select_related('restaurant', 'category')
            serializer = ProductSerializer(products, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({'message': 'Invalid food_type query parameter'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def search(self, request):

        user_city = get_city(request.user)
        query = request.query_params.get('query')

        if not query:
            return Response({'message': 'query parameter is required'}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Search Products
        products = Product.objects.filter(
            Q(name__icontains=query) | Q(description__icontains=query),
            is_available=True,
            restaurant__city__iexact=user_city
        ).select_related('restaurant')

        # 2. Search Restaurants
        restaurants = Restaurant.objects.filter(
            Q(restaurant_name__icontains=query) | Q(restaurant_description__icontains=query),
            city__iexact=user_city,
            is_open=True
        )

        product_serializer = ProductSerializer(products, many=True)
        restaurant_serializer = RestaurantSerializer(restaurants, many=True)
        return Response({
            'products': product_serializer.data,
            'restaurants': restaurant_serializer.data
        }, status=status.HTTP_200_OK)
    

    @action(detail=False, methods=['get'])
    def available(self, request):
        user_city = get_city(request.user)
        available_products = Product.objects.filter(is_available=True, restaurant__city__iexact=user_city)
        serializer = ProductSerializer(available_products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['get'])
    def get_products(self, request, pk=None):
        try:
            restaurant = Restaurant.objects.get(pk=pk)
        except Restaurant.DoesNotExist:
            return Response({"message": "Restaurant not found"}, status=status.HTTP_404_NOT_FOUND)
        products = Product.objects.filter(restaurant=restaurant)
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    # @action(detail=True, methods=['get'])
    # def menu_by_category(self, request, pk=None):
    #     try:
    #         restaurant = Restaurant.objects.get(pk=pk)
    #     except Restaurant.DoesNotExist:
    #         return Response({"message": "Restaurant not found"}, status=status.HTTP_404_NOT_FOUND)
    #     categories = Category.objects.filter(products__restaurant=restaurant).distinct()
    #     serializer = CategorySerializer(categories, many=True, context={'restaurant': restaurant})
    #     return Response(serializer.data)
    

    

class RestaurantViewSet(viewsets.ModelViewSet):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer


    @action(detail=True, methods=['get'])
    def restaurants_list(self, request, city):
        # import pdb; pdb.set_trace()
        user_city = city
        print(user_city)
        restaurants = Restaurant.objects.filter(
            city=user_city
        )
        serializer = RestaurantSerializer(restaurants, many=True)
        return Response({
            "message":"Successfully get Restaurants List",
            "data":serializer.data,
            "error": False
        }, status=status.HTTP_200_OK)
    


    @action(detail=False, methods=['post'], permission_classes=[IsVendor])
    def add_restaurant(self, request):
        try:
            vendor_profile = request.user.vendor_profile
        except VendorProfile.DoesNotExist:
            return Response(
                {"message": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = RestaurantSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(vendor=vendor_profile)
            return Response(
                {
                    "data": serializer.data,
                    "message" : "Restaurant Added Successfully"
                },status=status.HTTP_201_CREATED)
        return Response({
            "data":serializer.errors,
            "message" : "Error Occured"
            }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['patch'], permission_classes=[IsVendor])
    def update_restaurant(self, request, pk=None):
        try:
            vendor_profile = request.user.vendor_profile
        except VendorProfile.DoesNotExist:
            return Response(
                {"message": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        try:
            restaurant = Restaurant.objects.get(
                id=pk,
                vendor=vendor_profile
            )
        except Restaurant.DoesNotExist:
            return Response(
                {"message": "Restaurant not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = RestaurantSerializer(restaurant, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "data": serializer.data,
                    "message" : "Restaurant Updated Successfully"
                },status=status.HTTP_201_CREATED)
        return Response({
            "data":serializer.errors,
            "message" : "Error Occured"
            }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'], permission_classes=[IsVendor])
    def get_restaurant(self, request):
        try:
            vendor_profile = request.user.vendor_profile
        except VendorProfile.DoesNotExist:
            return Response(
                {"message": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        restaurant = getattr(vendor_profile, 'restaurant', None)
        
        if not restaurant:
            return Response(
                {"message": "No restaurant found for this vendor."},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = RestaurantSerializer(restaurant)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'], permission_classes=[IsVerifiedVendor])
    def my_menu(self, request):
        try:
            restaurant = request.user.vendor_profile.restaurant
            products = Product.objects.filter(restaurant=restaurant)
            
            serializer = ProductSerializer(products, many=True)
            return Response(serializer.data)
        except (VendorProfile.DoesNotExist, Restaurant.DoesNotExist):
            return Response({"error": "No restaurant found"}, status=404)