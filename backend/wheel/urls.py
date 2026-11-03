from django.views.generic import RedirectView
from django.urls import path

from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('index/', RedirectView.as_view(pattern_name='home', permanent=False), name='legacy_index'),
    path('wheel/', views.random_wheel, name='random_wheel'),
    path('colour/', views.random_colour, name='random_colour'),
    path('anything/', views.random_anything, name='random_anything'),
    path('random/', views.random_number, name='random_number'),
    path('random-colour/', views.random_colour_result, name='random_colour_result'),
]
