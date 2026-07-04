from django.urls import path
from apps.restaurants.views import CategoryViewSet, ProductViewSet, RestaurantViewSet
from apps.accounts.permissions import IsVerifiedVendor, IsAdmin, IsVendor

category_list = CategoryViewSet.as_view({'get': 'list'})
create_category = CategoryViewSet.as_view({'post': 'create_category'}, permission_classes = [IsVerifiedVendor, IsAdmin])
update_category = CategoryViewSet.as_view({'patch': 'update_category'}, permission_classes = [IsVerifiedVendor, IsAdmin])
delete_category = CategoryViewSet.as_view({'delete': 'delete_category'}, permission_classes = [IsVerifiedVendor, IsAdmin])
category_products = CategoryViewSet.as_view({'get': 'products'})

add_product = ProductViewSet.as_view({'post': 'bulk_create'}, permission_classes = [IsVerifiedVendor])
update_availability = ProductViewSet.as_view({'patch': 'update_availability'}, permission_classes = [IsVerifiedVendor])
update_price = ProductViewSet.as_view({'patch': 'update_price'}, permission_classes = [IsVerifiedVendor])
update_rating = ProductViewSet.as_view({'patch': 'update_rating'}, permission_classes = [IsVerifiedVendor])
update_description = ProductViewSet.as_view({'patch': 'update_description'}, permission_classes = [IsVerifiedVendor])
delete_product = ProductViewSet.as_view({'delete': 'delete_product'}, permission_classes = [IsVerifiedVendor])
mark_bestseller = ProductViewSet.as_view({'patch': 'mark_bestseller'}, permission_classes = [IsAdmin])
update_preparation_time = ProductViewSet.as_view({'patch': 'update_preparation_time'}, permission_classes = [IsVerifiedVendor])
update_food_type = ProductViewSet.as_view({'patch': 'update_food_type'}, permission_classes = [IsVerifiedVendor])
update_category = ProductViewSet.as_view({'patch': 'update_category'}, permission_classes = [IsVerifiedVendor])
update_name = ProductViewSet.as_view({'patch': 'update_name'}, permission_classes = [IsVerifiedVendor])
update_image = ProductViewSet.as_view({'patch': 'update_image'}, permission_classes = [IsVerifiedVendor])
bestseller = ProductViewSet.as_view({'get': 'bestsellers'})
search = ProductViewSet.as_view({'get': 'search'})
products_by_category = ProductViewSet.as_view({'get': 'by_category'})
products_by_food_type = ProductViewSet.as_view({'get': 'by_food_type'})
availble_products = ProductViewSet.as_view({'get': 'available'})
products_by_restaurant = ProductViewSet.as_view({'get': 'get_products'})
# menu_by_category = ProductViewSet.as_view({'get': 'menu_by_category'})

restaurant_detail = RestaurantViewSet.as_view({'get': 'retrieve'})
add_restaurant = RestaurantViewSet.as_view({'post': 'add_restaurant'}, permission_classes=[IsVendor])
update_restaurant = RestaurantViewSet.as_view({'patch': 'update_restaurant'}, permission_classes=[IsVendor])
get_restaurant = RestaurantViewSet.as_view({'get': 'get_restaurant'}, permission_classes=[IsVendor])
my_menu = RestaurantViewSet.as_view({'get': 'my_menu'}, permission_classes=[IsVerifiedVendor])
restaurants_list = RestaurantViewSet.as_view({'get': 'restaurants_list'})


urlpatterns = [
    path('categories', category_list, name='category_list'),
    path('categories/create', create_category, name='create_category'),
    path('categories/update', update_category, name='update_category'),
    path('categories/delete', delete_category, name='delete_category'),
    path('categories/<int:category_id>/products', category_products, name='category_products'),
    path('products/add', add_product, name='add_product'),
    path('products/update/availability', update_availability, name='update_availability'),
    path('products/update/price', update_price, name='update_price'),
    path('products/update/rating', update_rating, name='update_rating'),
    path('products/update/description', update_description, name='update_description'),
    path('products/delete', delete_product, name='delete_product'),
    path('products/by-category', products_by_category, name='products_by_category'),
    path('products/by-food-type', products_by_food_type, name='products_by_food_type'),
    path('products/mark-bestseller', mark_bestseller, name='mark_bestseller'),
    path('products/update/preparation-time', update_preparation_time, name='update_preparation_time'),
    path('products/update/food-type', update_food_type, name='update_food_type'),
    path('products/update/category', update_category, name='update_category'),
    path('products/update/name', update_name, name='update_name'),
    path('products/update/image', update_image, name='update_image'),
    path('products/bestseller', bestseller, name='bestseller'),
    path('search', search, name='search'),
    path('products/available', availble_products, name='available_products'),
    path('<int:pk>/get_products', products_by_restaurant, name='products_by_restaurant'),
    # path('<int:pk>/categories',  menu_by_category, name='menu_by_category'),

    path('<int:pk>/', restaurant_detail, name='restaurant_detail'),
    path('add', add_restaurant, name='add_restaurant'),
    path('update/<int:pk>/', update_restaurant, name='update_restaurant'),
    path('', get_restaurant, name='get_restaurant'),
    path('my_menu', my_menu, name='my_menu'),
    path('<str:city>', restaurants_list, name = 'restaurants_list'),
]

