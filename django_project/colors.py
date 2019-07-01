from gdalconst import *
from osgeo import osr

import json
import sys, gdal
import numpy as np
import base64

filename = "./output.tif"
driver = gdal.GetDriverByName("GTiff")
ds = driver.Create( 'newABC.tif', 1, 1, 1, gdal.GDT_UInt16)
# fn   = gdal.Open(filename)
band = ds.GetRasterBand(1)
ct = gdal.ColorTable()
# Some examples
ct.SetColorEntry( 0, (0, 0, 0, 255) )
ct.SetColorEntry( 1, (0, 255, 0, 255) )
ct.SetColorEntry( 2, (255, 0, 0, 255) )
ct.SetColorEntry( 3, (255, 0, 255, 255) )
# Set the color table for your band
band.SetRasterColorTable(ct)
ct   = band.GetRasterColorTable()
print(ct)
# ct = None
# fn = None
f    = open("rgb_color.txt", 'w+')    
for i in range(ct.GetCount()):
    sEntry = ct.GetColorEntry(i)
    f.write( "  %3d: %d,%d,%d\n" % (i,sEntry[0],sEntry[1],sEntry[2]))