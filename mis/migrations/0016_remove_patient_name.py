# Generated by Django 4.0.5 on 2022-06-29 16:50

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mis', '0015_alter_appointment_options_alter_user_options_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='patient',
            name='name',
        ),
    ]
