# Generated by Django 5.1.4 on 2024-12-26 02:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('restaurants', '0007_restaurant_remarks'),
    ]

    operations = [
        migrations.AlterField(
            model_name='restaurant',
            name='highlights',
            field=models.JSONField(blank=True, null=True),
        ),
    ]
