# Generated by Django 2.2.2 on 2019-07-04 13:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_auto_20190701_1033'),
    ]

    operations = [
        migrations.AddField(
            model_name='matrix',
            name='dimensionsMapping',
            field=models.CharField(max_length=10000, null=True),
        ),
    ]
