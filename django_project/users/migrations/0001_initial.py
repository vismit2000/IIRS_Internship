# Generated by Django 2.2.2 on 2019-07-06 15:23

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='matrix',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('upload_date', models.DateTimeField(auto_now_add=True, null=True)),
                ('numOfDimensions', models.IntegerField()),
                ('dimensionsString', models.CharField(max_length=1000)),
                ('entries', models.CharField(max_length=1000)),
                ('output', models.ImageField(default='outputImages/rasql_1.png', upload_to='outputImages/')),
                ('dimensionsMapping', models.CharField(max_length=10000, null=True)),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
