from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .forms import UserRegisterForm
from .models import *
from blog.models import *

import base64

def register(request):
    if request.method == 'POST':
        form = UserRegisterForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            messages.success(request, f'Your account has been created! You are now able to log in')
            return redirect('login')
    else:
        form = UserRegisterForm()
    return render(request, 'users/register.html', {'form': form})


@login_required
def profile(request):
    matricesObjects = matrix().__class__.objects.filter(user = request.user)
    currUser = UserProfile().__class__.objects.get(user = request.user)
    processedImages = FinalProcessedImage().__class__.objects.filter(usr_profile = currUser)
    print(processedImages)
    matricesArr = []
    for i in matricesObjects:
        newMatrix = {}
        newMatrix['dimNum'] = i.numOfDimensions
        newMatrix['dimString'] = i.dimensionsString
        newMatrix['entries'] = i.entries
        newMatrix['uploadDate'] = i.upload_date
        # print(newMatrix)
        matricesArr.append(newMatrix)
        # print(matricesArr)
    # print(matricesArr)
    processedImagesArr = []
    ctr = 0
    for i in processedImages:
        key = 'img'+str(ctr)
        processedImagesArr.append({key:base64.encodebytes(i.image).decode("utf-8")})
        ctr = ctr+1
    return render(request, 'users/profile.html',{'matrixArr':matricesArr,'processedImagesArr':processedImagesArr})