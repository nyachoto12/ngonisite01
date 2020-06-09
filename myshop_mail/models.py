from django.db import models
from django.conf import settings
from django.shortcuts import reverse

CATEGORY_CHOICES=(
    ('Ceilings', 'Ceiling Requirements'),
    ('Skimming', 'Skimming Requirements'),
    ('Framming', 'Framming Requirements')
)
LABEL_CHOICES=(
    ('P', 'primary'),
    ('S', 'secondary'),
    ('D', 'danger')
)
class Item(models.Model):
    title = models.CharField(max_length=100)
    price = models.FloatField()
    discount_price = models.FloatField(blank=True, null=True)
    category = models.CharField(choices=CATEGORY_CHOICES, max_length=12)
    label = models.CharField(choices=LABEL_CHOICES, max_length=1)
    slug = models.SlugField()
    description = models.TextField()
    image = models.ImageField(upload_to='pics')

    def __str__(self):
        return self.title
    def get_absolute_url(self):
        return reverse('myshop_mail:products', kwargs={
            'slug':self.slug
        })
    def get_add_to_cart_url(self):
        return reverse('myshop_mail:add_to_cart', kwargs={
            'slug':self.slug
        })
    def get_remove_from_cart_url(self):

        return reverse('myshop_mail:remove_from_cart', kwargs={
            'slug':self.slug
        })
    def get_shop_url(self):

        return reverse('myshop_mail:shop')
    def get_checkout_url(self):

        return reverse('myshop_mail:checkout')
        
   
class OrderItem(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    ordered = models.BooleanField(default=False)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    

    def __str__(self):
        return f"{self.quantity} of {self.item.title}"
   
    def get_total_item_price(self):
        return self.quantity * self.item.price
    def get_total_item_discount_price(self):
        return self.quantity * self.item.discount_price
    def get_total_saved(self):
        return self.get_total_item_price() - self.get_total_item_discount_price()
    def get_final_price(self):
        if  self.item.discount_price:
            return self.get_total_saved()
        return self.get_total_item_price()


class Order(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    ref_code = models.CharField(max_length=20, blank=True, null=True)
    items = models.ManyToManyField(OrderItem)
    start_date = models.DateTimeField(auto_now_add=True)
    ordered_date = models.DateTimeField()
    

    def __str__(self):
        return self.user.username

    def get_total(self):
        total=0
        for order_item in self.items.all():
            total+=order_item.get_final_price()
        return total


    