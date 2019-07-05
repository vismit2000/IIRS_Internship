import os
import gdal
import numpy

file = "drainage_EucDist_raster.tif"
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


