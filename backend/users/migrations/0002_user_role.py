# Generated by Django 5.1.4 on 2025-01-11 18:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='role',
            field=models.CharField(choices=[('restaurant', 'Restaurant'), ('customer', 'Customer')], default='customer', max_length=20),
        ),
    ]
