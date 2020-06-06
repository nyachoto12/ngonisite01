from django.shortcuts import render,redirect
from django.contrib.auth.models import User, auth
from django.http import HttpResponse, HttpResponseRedirect
from .models import Users
from django.core.mail import send_mail, BadHeaderError
from django.contrib import messages
from .forms import CommentForm, SubscribeForm
from django.conf import settings

# Create your views here.
def home(request):
    return render(request,'home.html')
def about(request):
    Contact_Form=CommentForm
    if request.method=='GET':
        form=Contact_Form()
    else:
        form=Contact_Form(request.POST)
        if form.is_valid():
            contact_name = form.cleaned_data['contact_name']
            contact_email = form.cleaned_data['contact_email']
            contact_message = form.cleaned_data['contact_message']

            try:
                send_mail(contact_name, contact_email, contact_message, ['ngoninyachoto@gmail.com'])
                messages.info(request,'Invalid credentials')
                
                
            except BadHeaderError:
                return HttpResponse('Invalid header found.')
        return redirect ('/')

    return render(request,'about.html', {'form': CommentForm })
    

   
def Contact(request):
    if request.method=='POST':
        if request.POST.get('name') and request.POST.get('phone') and request.POST.get('email') and request.POST.get('address') and request.POST.get('gender') and request.POST.get('subject') and request.POST.get('message'):

            saverecord=Users()
            saverecord.name=request.POST.get('name')
            saverecord.phone=request.POST.get('phone')
            saverecord.email=request.POST.get('email')
            saverecord.address=request.POST.get('address')
            saverecord.gender=request.POST.get('gender')
            saverecord.subject=request.POST.get('subject')
            saverecord.message=request.POST.get('message')
            saverecord.save()
            messages.success(request,'New User Added Successful')
            return redirect("/")

    else:
        return render (request,'contact.html')


def Services(request):
    return render (request,'services.html')
def Ceilings(request):
    return render (request,'ceilings.html')

def Gallery(request):
    Contact_Form=CommentForm
    if request.method=='GET':
        form=Contact_Form()
    else:
        form=Contact_Form(request.POST)
        if form.is_valid():
            contact_name = form.cleaned_data['contact_name']
            contact_email = form.cleaned_data['contact_email']
            contact_message = form.cleaned_data['contact_message']

            try:
                send_mail(contact_name, contact_email, contact_message, ['ngoninyachoto@gmail.com'])
                messages.info(request,'Invalid credentials')
                
                
            except BadHeaderError:
                return HttpResponse('Invalid header found.')
        return redirect ('/')

    return render(request,'gallery.html', {'form': CommentForm })
    