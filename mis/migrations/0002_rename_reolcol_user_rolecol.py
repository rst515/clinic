# Generated by Django 4.0.5 on 2022-06-21 12:32

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mis', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='user',
            old_name='reolCol',
            new_name='roleCol',
        ),
    ]
