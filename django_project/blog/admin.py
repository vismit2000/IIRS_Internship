from django.contrib import admin
from .models import UserProfile,UploadImage

admin.site.register(UploadImage)
admin.site.register(UserProfile)
