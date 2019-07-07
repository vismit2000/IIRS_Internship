from .models import *
from users.models import matrix

from django.shortcuts import render,redirect
from django.contrib.auth import authenticate, login as auth_login, logout
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.core.files import File
# from django.core import serializers		--uncomment for upload functionality

from gdalconst import *
from osgeo import osr

import json
import sys, gdal
import numpy as np
import base64

np.set_printoptions(threshold=sys.maxsize)

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
	matrixEntry = matrix(numOfDimensions = matrixJSON['numOfDimensions'], dimensionsString = matrixJSON['dimensionsString'], entries = matrixJSON['entries'],user = request.user,dimensionsMapping = matrixJSON['mappedDimensionsString'])
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

		latestMatrix = matrix().__class__.objects.latest('upload_date')
		mappedDimensionsString = latestMatrix.dimensionsMapping
		arr1 = mappedDimensionsString.split('#')		
		mappedDimArr = []
		arr1.pop()
		for i in range(len(arr1)):
			arr2 = arr1[i].split(' ')
			arr2.pop()
			mappedDimArr.append(arr2)
			print(arr2)
		print(mappedDimArr)


		# Image URLS on which operations will be performed (Hard coded right now) {Works on 4x4 matrices right now}
		imagesPaths = ['Jhilmil_Jheel Data/Jhilmil_Jheel_Normal_RASTER_data/veg_fin_15km_raster.tif', 'Jhilmil_Jheel Data/Jhilmil_Jheel_Normal_RASTER_data/drainage_EucDist_raster.tif', 'Jhilmil_Jheel Data/Jhilmil_Jheel_Normal_RASTER_data/road_EucDist_raster.tif', 'Jhilmil_Jheel Data/Jhilmil_Jheel_Normal_RASTER_data/settlement_EucDist_raster.tif']



		resultantArr = []	#stores final output image as np array
		
		# criteria weights vector
		weight = json.loads(request.body.decode('utf-8'))['valueArr']
		
		# loop through images and perform operations and save final image
		for i in range(len(imagesPaths)):
			# open the image
			ds = gdal.Open(imagesPaths[i])
			if ds is None:
				print ('Could not open image')
				sys.exit(1)

			band = ds.GetRasterBand(1)
			arr = band.ReadAsArray()
			
			# arr is numpy array for normal image let's reclassify it before performing operations
			# mappedDimArr[i] represent's ith image parameters to be mapped
			if i == 0:
				# print('before transforming , i=0')
				# print(arr[:10][:10])
				for j in range(len(mappedDimArr[i])):
					arr[arr == j+1] = mappedDimArr[i][j]
				# print('after transforming , i=0')
				# print(arr[:10][:10])
			else:
				for j in range(len(mappedDimArr[i])):
					# arr[arr >= (1000*j) and arr < (1000*j+1000) ] = mappedDimArr[i][j]
					arr[np.logical_and(arr >= (1000*j), arr < (1000*j+1000))] = mappedDimArr[i][j]

			# print(arr)
			
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
							gdal.GDT_Float32)
		
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
		print(type(dst_ds))
		#Close output raster dataset
		ds = None
		dst_ds = None
		
		data = {'error':'false'}
		print(json.dumps(data))
		return JsonResponse(data)
	return JsonResponse({'error':'true'})

@csrf_exempt
def getTiff(request):
	data = json.loads( request.body.decode('utf-8'))	#load JSON data from frontend
	if(data['latest'] == '1'):
		print('hiiiiii~~~~~~~~~~~~~~')
		valid_image = "./newABC.tif"
		inputRaster = gdal.Open(valid_image)
		outputRaster = r"./newABC2.tif"

		# get the last saved matrix (ordered according to date added)
		latestMatrix = matrix().__class__.objects.latest('upload_date')
		# print(latestMatrix)
		gdal.Warp(outputRaster,inputRaster,dstSRS='EPSG:4326')
		valid_image = "./newABC2.tif"
		print(latestMatrix.output)

		# open the image and save it in output field of last saved matrix
		with open(valid_image, "rb") as f:
			latestMatrix.output.save(outputRaster,f)
		
		with open(valid_image, "rb") as f:
			print(valid_image)
			return HttpResponse(f.read(), content_type="image/tiff")
	else:
		print('oh noooooooooo')
		valid_image = '.'+data['url']
		with open(valid_image, "rb") as f:
			print(valid_image)
			return HttpResponse(f.read(), content_type="image/tiff")

@csrf_exempt
def getImageForMap(request):
	context = {}
	context['imgUrl'] = ''
	context['isLatest'] = 1
	return render(request, 'blog/map.html',context)

@csrf_exempt
def getImageForMapInProfile(request):
	data = json.loads( request.body.decode('utf-8'))	#load JSON data from frontend
	context = {}
	context['imgUrl'] = data['url']
	context['isLatest'] = 0
	# valid_image = '.'+data['url']
	# with open(valid_image, "rb") as f:
	# 	print(valid_image)
	return render(request, 'blog/map.html',context)