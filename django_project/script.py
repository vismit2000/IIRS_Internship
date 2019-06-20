import os
import gdal
import numpy

file = "./media/newImages/LC81070352015218LGN00.jpg"
print(file)
ds = gdal.Open(file)
band = ds.GetRasterBand(1)
arr = band.ReadAsArray()
[cols, rows] = arr.shape
print(arr.shape)
arr_min = arr.min()
arr_max = arr.max()
arr_mean = int(arr.mean())
print([arr_min,arr_max,arr_mean])
