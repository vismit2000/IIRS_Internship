from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='blog-home'),
    path('about/', views.about, name='blog-about'),
    path('saveMatrix/', views.saveMatrix, name='saveMatrix'),
    path('upload/', views.upload, name='upload'),
    path('processImages/', views.processImages, name='processImages'),
    path('tryNew/', views.tryNew, name='tryNew'),
    path('fetchImage/', views.fetchImage, name='fetchImage'),
]