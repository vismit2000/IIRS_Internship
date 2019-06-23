import os
import gdal
import numpy

file = "Reclass_veg.tif"
print(file)
ds = gdal.Open(file)
band = ds.GetRasterBand(1)
arr = band.ReadAsArray()
[cols, rows] = arr.shape
print(arr.shape)

for i in range(rows):
	for j in range(cols):
		print(arr[i, j], end = ' ')
	print()

print()

file = "Reclass_drainage.tif"
print(file)
ds = gdal.Open(file)
band = ds.GetRasterBand(1)
arr = band.ReadAsArray()
[cols, rows] = arr.shape
print(arr.shape)

for i in range(rows):
	for j in range(cols):
		print(arr[i, j], end = ' ')
	print()
	
print()	
	
file = "Reclass_road.tif"
print(file)
ds = gdal.Open(file)
band = ds.GetRasterBand(1)
arr = band.ReadAsArray()
[cols, rows] = arr.shape
print(arr.shape)

for i in range(rows):
	for j in range(cols):
		print(arr[i, j], end = ' ')
	print()
	
	
print()

file = "Reclass_set.tif"
print(file)
ds = gdal.Open(file)
band = ds.GetRasterBand(1)
arr = band.ReadAsArray()
[cols, rows] = arr.shape
print(arr.shape)

for i in range(rows):
	for j in range(cols):
		print(arr[i, j], end = ' ')
	print()
	
print()
