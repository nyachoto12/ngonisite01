
from django.shortcuts import render,redirect,get_object_or_404
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.models import User, auth
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import HttpResponse, HttpResponseRedirect
from myshop_mail.models import Item, OrderItem, Order
from django.views.generic import ListView, DetailView,View,TemplateView
#from django.core.mail import send_mail, BadHeaderError
from django.contrib import messages
#from .forms import CommentForm, SubscribeForm
from django.conf import settings
from django.utils import timezone



class HomeView(ListView):
    model=Item
    template_name= 'shop_mail.html'
class CheckoutView(ListView):
    model=Item
    template_name= 'checkout.html'
class OrderView( LoginRequiredMixin,View):
    def get(self, *args, **kwargs):
         order=Order.objects.get(user=self.request.user)
         context={
            'object': order
         }
         return render(self.request,'order_summary.html',context)

class ProductView(DetailView):
    model=Item
    template_name= 'products.html'
@login_required
def add_to_cart(request, slug):
    item = get_object_or_404(Item, slug=slug)
    order_item, created = OrderItem.objects.get_or_create(
        item=item,
        user=request.user,
        ordered=False
    )
    order_qs = Order.objects.filter(user=request.user)
    if order_qs.exists():
        order = order_qs[0]
        # check if the order item is in the order
        if order.items.filter(item__slug=item.slug).exists():
            order_item.quantity += 1
            order_item.save()
            messages.info(request, "This item quantity was updated.")
            return redirect("myshop_mail:order_summary")
        else:
            order.items.add(order_item)
            messages.info(request, "This item was added to your cart.")
            return redirect("myshop_mail:order_summary")
    else:
        ordered_date = timezone.now()
        order = Order.objects.create(user=request.user, ordered_date=ordered_date)
        order.items.add(order_item)
        messages.info(request, "This item was added to your cart.")
        return redirect("myshop_mail:order_summary")
@login_required
def remove_from_cart(request,slug):
    item = get_object_or_404(Item, slug=slug)
    order_qs = Order.objects.filter(user=request.user)
    if order_qs.exists():
        order = order_qs[0]
        # check if the order item is in the order
        if order.items.filter(item__slug=item.slug).exists():
             order_item = OrderItem.objects.filter(
                 item=item,
                 user=request.user,
                 ordered=False
            )[0]
             order.items.remove(order_item)
             messages.info(request, "The item was removed successfully from your cart.")
             return redirect("myshop_mail:order_summary")

        else:
            #order does not contain this item
            messages.info(request, "You dont have this item in your order.")
            return redirect("myshop_mail:order_summary")

    else:
        #user does not have an order
        messages.info(request, "You have no item in your cart.")
        return redirect("myshop_mail:order_summary",slug=slug)
    return redirect("myshop_mail:order_summary",slug=slug)
@login_required
def remove_item_from_cart(request,slug):
    item = get_object_or_404(Item, slug=slug)
    order_qs = Order.objects.filter(user=request.user)
    if order_qs.exists():
        order = order_qs[0]
        # check if the order item is in the order
        if order.items.filter(item__slug=item.slug).exists():
             order_item = OrderItem.objects.filter(
                 item=item,
                 user=request.user,
                 ordered=False
            )[0]
             order_item.quantity -= 1
             order_item.save()
             messages.info(request, "The item quantity is successfully updated.")
             return redirect("myshop_mail:order_summary")
        else:
            #order does not contain this item
            messages.info(request, "You dont have this item in your order.")
            return redirect("myshop_mail:order_summary")

    else:
        #user does not have an order
        messages.info(request, "You have no item in your cart.")
        return redirect("myshop_mail:order_summary")
    return redirect("myshop_mail:order_summary")



