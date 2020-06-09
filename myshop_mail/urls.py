from django.urls import path,reverse
from django.conf import settings
from django.conf.urls.static import static
#from myshop_mail.views import orders
from .views import (
    
    
    HomeView,
    ProductView,
    CheckoutView,
    OrderView,
    add_to_cart,
    remove_from_cart,
    remove_item_from_cart
    
)
app_name='myshop_mail'

urlpatterns=[
    path('shop',HomeView.as_view(), name='shop'),
    #path('checkout',views.checkout, name='checkout'),
    path('products/<slug>/', ProductView.as_view(), name='products'),
    path('order_summary/', OrderView.as_view(), name='order_summary'),
     path('checkout/', CheckoutView.as_view(), name='checkout'),
    path('add_to_cart/<slug>/',add_to_cart,name='add_to_cart'),
    path('remove_from_cart/<slug>/',remove_from_cart,name='remove_from_cart'),
     path('remove_item_from_cart/<slug>/',remove_item_from_cart,name='remove_item_from_cart')
    
]