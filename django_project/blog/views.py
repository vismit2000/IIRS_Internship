from .models import Post
from users.models import matrix
import json
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render,redirect
from django.contrib.auth import authenticate, login as auth_login, logout
from django.http import HttpResponseRedirect, HttpResponse
from django.urls import reverse
from django.contrib.auth.decorators import login_required

@login_required
def home(request):
    context = {
        'posts': Post.objects.all()
    }
    e_list = matrix.objects.all()
    print(e_list)
    return render(request, 'blog/home.html', context)

@login_required
def about(request):
    return render(request, 'blog/about.html', {'title': 'About'})

@login_required
def saveMatrix(request):
    matrixJSON = json.loads( request.body.decode('utf-8'))
    print(matrixJSON)
    matrixEntry = matrix(numOfDimensions = matrixJSON['numOfDimensions'], dimensionsString = matrixJSON['dimensionsString'], entries = matrixJSON['entries'])
    matrixEntry.save()
    res = {'error':'noError'}
    return JsonResponse(res)