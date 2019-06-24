from django.contrib import admin
from users.models import *
from blog.models import *

admin.site.register(UploadImage)
admin.site.register(UserProfile)
admin.site.register(matrix)
admin.site.register(FinalProcessedImage)

