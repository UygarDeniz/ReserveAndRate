# Generated by Django 5.1.4 on 2024-12-18 03:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='profile_image',
            field=models.ImageField(blank=True, default='profile_images/default.jpg', null=True, upload_to='profile_images/'),
        ),
    ]