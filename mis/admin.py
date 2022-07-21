from django.contrib import admin
from . models import *

# Register your models here.

admin.site.register(User)
admin.site.register(Clinician)
admin.site.register(Patient)
admin.site.register(Appointment)
admin.site.register(Medication)
admin.site.register(Note)