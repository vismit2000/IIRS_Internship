from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='blog-home'),
    path('saveMatrix/', views.saveMatrix, name='saveMatrix'),
    # path('upload/', views.upload, name='upload'),     --uncomment for upload functionality
    path('processImages/', views.processImages, name='processImages'),
    path('getTiff/', views.getTiff, name='getTiff'),
    path('getImageForMap/', views.getImageForMap, name='getImageForMap'),
    path('getImageForMapInProfile/', views.getImageForMapInProfile, name='getImageForMapInProfile'),
]
