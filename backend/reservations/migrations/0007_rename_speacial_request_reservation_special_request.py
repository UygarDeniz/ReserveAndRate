# Generated by Django 5.1.4 on 2025-01-05 01:04

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('reservations', '0006_reservation_guests_reservation_speacial_request'),
    ]

    operations = [
        migrations.RenameField(
            model_name='reservation',
            old_name='speacial_request',
            new_name='special_request',
        ),
    ]
