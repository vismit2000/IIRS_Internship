from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class matrix(models.Model):
    upload_date=models.DateTimeField(auto_now_add =True,null=True)
    user = models.ForeignKey(User,on_delete = models.CASCADE,null=True)
    numOfDimensions = models.IntegerField()
    dimensionsString = models.CharField(max_length = 1000)
    entries = models.CharField(max_length = 1000)

    def __str__(self):
        return self.dimensionsString