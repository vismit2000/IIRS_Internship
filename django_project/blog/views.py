from .models import *
from users.models import matrix
import json
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render,redirect
from django.contrib.auth import authenticate, login as auth_login, logout
from django.http import HttpResponseRedirect, HttpResponse
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.core import serializers
from django.forms.models import model_to_dict
import os
import gdal
import numpy


@login_required
def home(request):
	return render(request, 'blog/home.html')

@login_required
def about(request):
	return render(request, 'blog/about.html', {'title': 'About'})

@login_required
def saveMatrix(request):
	matrixJSON = json.loads( request.body.decode('utf-8'))
	print(matrixJSON)
	matrixEntry = matrix(numOfDimensions = matrixJSON['numOfDimensions'], dimensionsString = matrixJSON['dimensionsString'], entries = matrixJSON['entries'],user = request.user)
	matrixEntry.save()
	res = {'error':'noError'}
	return JsonResponse(res)

@csrf_exempt
def upload(request):
	if request.method=="POST":
		print(request)
		# imgs = UploadForm(request.POST, request.FILES)
		newProfile,created = UserProfile.objects.get_or_create(user = request.user)
		newProfile.save()
		print(request.FILES)
		imgs = request.FILES.getlist('pic')
		for img in imgs:
			print(img)
			newPic = UploadImage(usr_profile = newProfile,image = img)
			print(newPic)
			newPic.save()
			# if img.is_valid():
				# img.save()
				# images=Upload.objects.all().order_by('-upload_date')
		# newProfile.save()
		print(newProfile)
		return JsonResponse({'error':'false','message':'Uploaded Successfully'})
	# else:
		# img=UploadForm()
		# print(img)
	# images=Upload.objects.all().order_by('-upload_date')
	return JsonResponse({'error':'true','message':'Failed'})

def processImages(request):
	if request.method == "GET":
		usr = request.user
		user_profile = UserProfile.objects.get(user = usr)
		images = UploadImage.objects.filter(usr_profile = user_profile)
		# data = serializers.serialize('json', images)
		for img in images:
			file = img
			print(file.image.url)
			ds = gdal.Open('.'+file.image.url)
			band = ds.GetRasterBand(1)
			arr = band.ReadAsArray()
			[cols, rows] = arr.shape
			print(arr.shape)
			arr_min = arr.min()
			arr_max = arr.max()
			arr_mean = int(arr.mean())
			print([arr_min,arr_max,arr_mean])
			print(file.image)

		return JsonResponse({'error':'flase'})