from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .forms import UserRegisterForm
from users.models import *

lastMatrix = None

# Register user
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


# View Profile
@login_required
def profile(request):
    matricesObjects = matrix().__class__.objects.filter(user = request.user)    #get all matrices that refer to current user
    matricesArr = []
    
    for i in matricesObjects:
        newMatrix = {}
        newMatrix['dimNum'] = i.numOfDimensions
        newMatrix['dimString'] = i.dimensionsString
        newMatrix['entries'] = i.entries
        newMatrix['uploadDate'] = i.upload_date
        newMatrix['output'] = i.output
        matricesArr.append(newMatrix)

    return render(request, 'users/profile.html',{'matrixArr':matricesArr})