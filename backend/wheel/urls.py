from django.urls import path

from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('wheel/', views.random_wheel, name='random_wheel'),
    path('random/', views.random_number, name='random_number'),
]