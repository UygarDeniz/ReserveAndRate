# Generated by Django 5.1.4 on 2025-01-05 01:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('reservations', '0005_alter_businesshours_options_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='reservation',
            name='guests',
            field=models.IntegerField(default=1),
        ),
        migrations.AddField(
            model_name='reservation',
            name='speacial_request',
            field=models.TextField(blank=True),
        ),
    ]
