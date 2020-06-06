from django import forms
from django.contrib.auth.models import User,auth

class CommentForm(forms.Form):
    contact_name=forms.CharField(required=True,
    widget=forms.TextInput(attrs={
        'class': 'form-control','placeholder':'Enter your fullname','size':'50'
    }))
    contact_email=forms.EmailField(required=True,  widget=forms.TextInput(attrs={
        'class': 'form-control','placeholder':'Enter your email address','size':'50'
    }))
    contact_message=forms.CharField(required=True, widget=forms.Textarea(attrs={
        'class': 'contact-form-message form-group bottommargin_0  form-control',
        'placeholder':'Your comment/s here', 'rows':"3", 'cols':"45" 
    }))

class SubscribeForm(forms.Form):
     contact_email=forms.EmailField(required=True,  widget=forms.TextInput(attrs={
        'class': 'form-control','placeholder':'Enter your email address','size':'20'
    }))
