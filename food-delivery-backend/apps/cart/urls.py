from django.urls import path
from .views import CartViewSet


add_item = CartViewSet.as_view({'post':'add_item'})
update_item = CartViewSet.as_view({'patch': 'update_item'})
my_cart = CartViewSet.as_view({'get':'my_cart'})
remove_item = CartViewSet.as_view({'delete':'remove_item'})
clear_cart = CartViewSet.as_view({'delete':'clear_cart'})

urlpatterns = [
    path('my_cart', my_cart, name='my_cart'),
    path('add_item', add_item, name='add_item'),
    path('update_item', update_item, name='update_item'),
    path('remove_item', remove_item, name='remove_item'),
    path('clear_cart', clear_cart, name='clear_cart'),
]