# Generated by Django 5.1.4 on 2025-01-02 01:15

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('reservations', '0001_initial'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='timeslot',
            unique_together=None,
        ),
        migrations.RemoveField(
            model_name='timeslot',
            name='restaurant',
        ),
        migrations.DeleteModel(
            name='Reservation',
        ),
        migrations.DeleteModel(
            name='TimeSlot',
        ),
    ]
