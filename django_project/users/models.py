from django.db import models

# Create your models here.
class matrix(models.Model):
    numOfDimensions = models.IntegerField()
    dimensionsString = models.CharField(max_length = 1000)
    entries = models.CharField(max_length = 1000)

    def __str__(self):
        return self.dimensionsString