# Generated by Django 2.2.2 on 2019-06-25 04:44

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userprofile',
            name='randomIndex',
        ),
    ]
