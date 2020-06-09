from django import template
from myshop_mail.models import Order

register = template.Library()


@register.filter
def cart_item_count(user):
    if user.is_authenticated:
        qs = Order.objects.filter(user=user)
        if qs.exists():
            return qs[0].items.count()
    return 0
