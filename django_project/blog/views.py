from .models import *
from users.models import matrix

from django.shortcuts import render,redirect
from django.contrib.auth import authenticate, login as auth_login, logout
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
# from django.core import serializers		--uncomment for upload functionality

from gdalconst import *
from osgeo import osr

import json
import sys, gdal
import numpy as np
import base64


@login_required
def home(request):
	"""
		view to render home page
	"""
	return render(request, 'blog/home.html')

@login_required
def saveMatrix(request):
	"""
		takes the matrix entered by user and stores it in database as a matrix() class object
	"""
	matrixJSON = json.loads( request.body.decode('utf-8'))	#load JSON data from frontend
	# create new matrix object with given details
	matrixEntry = matrix(numOfDimensions = matrixJSON['numOfDimensions'], dimensionsString = matrixJSON['dimensionsString'], entries = matrixJSON['entries'],user = request.user)
	# save matrix
	matrixEntry.save()
	res = {'error':'noError'}
	# return json response
	return JsonResponse(res)

#------------------------ Uncomment following for upload functionality-----------------------

# @csrf_exempt
# def upload(request):
# 	if request.method=="POST":
# 		print(request)
# 		newProfile,created = UserProfile.objects.get_or_create(user = request.user)
# 		newProfile.save()
# 		print(request.FILES)
# 		imgs = request.FILES.getlist('pic')
# 		for img in imgs:
# 			print(img)
# 			newPic = UploadImage(usr_profile = newProfile,image = img)
# 			print(newPic)
# 			newPic.save()
# 		print(newProfile)
# 		return JsonResponse({'error':'false','message':'Uploaded Successfully'})
# 	return JsonResponse({'error':'true','message':'Failed'})

def processImages(request):
	if request.method == "POST":

		# --------------------Uncomment following for upload functionality------------------------------

		# usr = request.user
		# user_profile = UserProfile.objects.get(user = usr)
		# images = UploadImage.objects.filter(usr_profile = user_profile)
		# data = serializers.serialize('json', images)
		# for img in images:
		# 	file = img
		# 	print(file.image.url)
		# 	ds = gdal.Open('.'+file.image.url)


		gdal.AllRegister()

		# Image URLS on which operations will be performed (Hard coded right now) {Works on 4x4 matrices right now}
		imagesPaths = ['JHILMIL/Reclass_veg.tif', 'JHILMIL/Reclass_drainage.tif', 'JHILMIL/Reclass_road.tif', 'JHILMIL/Reclass_set.tif']
		
		resultantArr = []	#stores final output image as np array
		
		# criteria weights vector
		weight = json.loads(request.body.decode('utf-8'))['valueArr']
		
		# loop through images and perform operations and save final image
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

		# save resultant array as tif image using informations from one of input image (Here using last one)
		# ds = gdal.Open('./veg.tif' , GA_ReadOnly)
		geotransform = ds.GetGeoTransform()
		wkt = ds.GetProjection()
		# Create gtif file
		driver = gdal.GetDriverByName("GTiff")
		output_file = "./newABC.tif"	#output file location
		dst_ds = driver.Create(output_file,
							band.XSize,
							band.YSize,
							1,
							gdal.GDT_Byte)
		
		new_array = np.array(resultantArr)
		#setting extension of output raster
		# top left x, w-e pixel resolution, rotation, top left y, rotation, n-s pixel resolution
		dst_ds.SetGeoTransform(geotransform)
		# setting spatial reference of output raster
		srs = osr.SpatialReference()
		srs.ImportFromEPSG(32644)
		dst_ds.SetProjection( srs.ExportToWkt() )

		#writting output raster
		dst_ds.GetRasterBand(1).WriteArray( new_array )
		#setting nodata value
		dst_ds.GetRasterBand(1).SetNoDataValue(-9999)

		#Close output raster dataset
		ds = None
		dst_ds = None
		
		data = {'error':'false'}
		print(json.dumps(data))
		return JsonResponse(data)
	return JsonResponse({'error':'true'})

@csrf_exempt
def getTiff(request):
	valid_image = "./newABC.tif"
	inputRaster = gdal.Open(valid_image)
	outputRaster = r"./newABC2.tif"
	gdal.Warp(outputRaster,inputRaster,dstSRS='EPSG:4326')
	valid_image = "./newABC2.tif"
	with open(valid_image, "rb") as f:
		print(valid_image)
		return HttpResponse(f.read(), content_type="image/tiff")

# @csrf_exempt
def getImageForMap(request):
	return render(request, 'blog/map.html')