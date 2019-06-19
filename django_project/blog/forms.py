from django import forms
class UserImageForm(forms.Form):
    file = forms.FileField(max_length = 100,upload_to=)