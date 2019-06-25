from django.db import models
from django.contrib.auth.models import User

# matrix class to save each individual matrix user enters (references user table)
class matrix(models.Model):
    upload_date=models.DateTimeField(auto_now_add =True,null=True)  #to store date of upload
    user = models.ForeignKey(User,on_delete = models.CASCADE,null=True) #foriegn key
    numOfDimensions = models.IntegerField()
    dimensionsString = models.CharField(max_length = 1000)  #name of dimensions
    entries = models.CharField(max_length = 1000)   #values user entered

    def __str__(self):
        return self.dimensionsString