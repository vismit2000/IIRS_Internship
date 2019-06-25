from django.contrib import admin
from .models import *

# class registered here will be shown in admin panel (localhost:8000/admin)
# admin.site.register(UploadImage)
admin.site.register(UserProfile)
