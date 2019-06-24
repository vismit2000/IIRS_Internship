from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from django.forms import ModelForm

class UserProfile(models.Model):
	user = models.OneToOneField(User,on_delete = models.CASCADE,null=True)
	upload_date=models.DateTimeField(auto_now_add =True)
	def __str__(self):
		return str(self.user)+' '+str(self.upload_date)

# FileUpload form class.
# class UploadForm(ModelForm):
# 	class Meta:
# 		model = Upload
# 		fields = ('pic',)

class UploadImage(models.Model):
	usr_profile = models.ForeignKey(UserProfile,related_name='images',on_delete=models.CASCADE)
	image = models.ImageField(upload_to="newImages/")
	def __str__(self):
		return str(self.usr_profile)+' '+str(self.image)

class FinalProcessedImage(models.Model):
	usr_profile = models.ForeignKey(UserProfile,related_name='processedImages',on_delete=models.CASCADE)
	image = models.ImageField(upload_to="processedImages/")
	def __str__(self):
		return str(self.usr_profile)+' '+str(self.image)