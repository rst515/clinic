# Generated by Django 4.0.5 on 2022-06-27 14:12

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('mis', '0012_appointment_attended'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='patient',
            name='appointments',
        ),
        migrations.AddField(
            model_name='patient',
            name='appointments',
            field=models.ForeignKey(blank=True, default=44, on_delete=django.db.models.deletion.CASCADE, related_name='patient_appointments', to='mis.appointment'),
            preserve_default=False,
        ),
    ]
