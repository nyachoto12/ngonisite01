from django.db import models
from django import forms


class Users(models.Model):
    name=models.CharField(max_length=100)
    phone=models.IntegerField()
    email=models.EmailField(max_length=100)
    address=models.CharField(max_length=100)
    gender=models.CharField(max_length=10)
    subject=models.CharField(max_length=100)
    message=models.CharField(max_length=100) 

    class Meta:
        db_table="accounts_users"

