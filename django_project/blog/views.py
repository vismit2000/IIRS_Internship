from .models import *
from users.models import *
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
import os, sys, time, gdal
from gdalconst import *
import numpy as np
from osgeo import osr
import base64


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
def tryNew(request):
	if request.method=="GET":
		return render(request, 'blog/try.html')

@csrf_exempt
def fetchImage(request):
	valid_image = "./abc.tif"
	try:
		with open(valid_image, "rb") as f:
			print(valid_image)
			return HttpResponse(f.read(), content_type="image/tiff")
	except IOError:
		return render(request,'blog/try.html')

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
	if request.method == "POST":
		gdal.AllRegister()
		
		imagesPaths = ['JHILMIL/Reclass_veg.tif', 'JHILMIL/Reclass_drainage.tif', 'JHILMIL/Reclass_road.tif', 'JHILMIL/Reclass_set.tif']

		resultantArr = []
		weight = json.loads(request.body.decode('utf-8'))['valueArr']
		print(weight)
		for i in range(len(imagesPaths)):
			# open the image
			ds = gdal.Open(imagesPaths[i] , GA_ReadOnly)
			if ds is None:
				print ('Could not open image')
				sys.exit(1)

			band = ds.GetRasterBand(1)
			arr = band.ReadAsArray()
			arr = arr * float(weight[i])
			if i==0:
				resultantArr = arr
			else:
				resultantArr = resultantArr + arr
		print(resultantArr)
		geotransform = ds.GetGeoTransform()
		wkt = ds.GetProjection()
		# Create gtif file
		driver = gdal.GetDriverByName("GTiff")
		output_file = "./abc.tif"
		dst_ds = driver.Create(output_file,
							band.XSize,
							band.YSize,
							1,
							gdal.GDT_Float32)
		
		new_array = np.array(resultantArr)
		#writting output raster
		dst_ds.GetRasterBand(1).WriteArray( new_array )
		#setting nodata value
		dst_ds.GetRasterBand(1).SetNoDataValue(-9999)
		#setting extension of output raster
		# top left x, w-e pixel resolution, rotation, top left y, rotation, n-s pixel resolution
		dst_ds.SetGeoTransform(geotransform)
		# setting spatial reference of output raster
		srs = osr.SpatialReference()
		srs.ImportFromWkt(wkt)
		dst_ds.SetProjection( srs.ExportToWkt() )


		#Close output raster dataset
		ds = None
		dst_ds = None


		options_list = [
			'-ot Byte',
			'-of JPEG',
			'-b 1',
			'-scale'
		] 
		options_string = " ".join(options_list)
		gdal.Translate('./abc.jpg',
					output_file,
					options=options_string)

		output_file2 = './abc.jpg'
		with open(output_file2,mode='rb') as file:
			img = file.read()
		data = {'error':'false','array':resultantArr.tolist(),'image':base64.encodebytes(img).decode("utf-8")}
		print(json.dumps(data))

		newProfile,created = UserProfile.objects.get_or_create(user = request.user)
		newProfile.save()
		print(img)
		# newPic = FinalProcessedImage(usr_profile = newProfile,image = img)
		# newPic.save()

		return JsonResponse(data)
	return JsonResponse({'error':'true'})