from django.db import models
from colorful.fields import RGBColorField
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser):
    roleCol = RGBColorField(colors=['#2A6CAA', '#2aaa68'])
    is_clinician = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    def serialize(self):
        return {
            'id': self.id,
            'name': f'{self.user.first_name} {self.user.last_name}'
        }

class Clinician(models.Model):
    name = models.ForeignKey("User", on_delete=models.CASCADE, related_name="related_Clinician_user")
    class ClinicalRole(models.TextChoices):
        C = 'C', 'Consultant'
        D = 'D', 'Doctor'
        N = 'N', 'Nurse'
        S = 'S', 'Surgeon'
        T = 'T', 'Therapist'
    role = models.TextField(max_length=1, choices=ClinicalRole.choices)
    ROOMS = (
        ('01', 'Room 1'),
        ('02', 'Room 2'),
        ('03', 'Room 3'),
        ('04', 'Room 4'),
        ('05', 'Room 5'),
    )
    main_room = models.CharField(max_length=2, choices=ROOMS, blank=True) 
    appointments = models.ManyToManyField("Appointment", blank=True, related_name="clinician_appointments")
    patients = models.ManyToManyField("Patient", blank=True, related_name="clinician_patients")

    def __str__(self):
        return f"{self.name.first_name} {self.name.last_name} [{self.get_role_display()}]"
    
    def serialize(self): #clinicians
        p = Patient.objects.filter(clinicians=self.id).order_by('last_name', 'first_name')
        return {
            "id": self.id,
            "name": f'{self.name.first_name} {self.name.last_name}',
            "role": self.get_role_display(),
            "main_room": self.get_main_room_display(),
            "patients": [f'{patient.first_name} {patient.last_name}' for patient in p],
            "appointments": '',
            "appointments_today": '',
            "notes": ''
        }

class Patient(models.Model):
    first_name = models.CharField(max_length=60)
    last_name = models.CharField(max_length=60)
    dob = models.DateField()
    gender = models.CharField(max_length=2,choices=(('M','Male'),('F','Female'),('TM','Transgender Male'),('TF','Transgender Female'),('O','Other'),))
    medications = models.ManyToManyField("Medication", blank=True)
    clinicians = models.ManyToManyField("Clinician", related_name="related_clinicians")
    roleCol = RGBColorField(colors=['#aa2a2c'])


    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    def serialize(self):
        meds = [f'{medication.name}' for medication in self.medications.all()]
        meds = str(meds)#.replace(",", "\n")
        meds = meds.replace("[", "")
        meds = meds.replace("]", "")
        meds = meds.replace("'", "")
        return {
            "id": self.id,
            "name": f'{self.first_name} {self.last_name}',
            "dob": self.dob.strftime('%e %b %Y'),
            "gender": self.get_gender_display(),
            "medications": meds,
            "clinicians": [f'{clinician.name.first_name} {clinician.name.last_name}' for clinician in self.clinicians.all()],
            "appointments": '',
            "notes": ''
        }

class Appointment(models.Model):
    patient = models.ForeignKey("Patient", on_delete=models.PROTECT, related_name="scheduled_patient")
    clinician = models.ForeignKey("Clinician", on_delete=models.PROTECT, related_name="scheduled_staff")
    date = models.DateField()
    time = models.TimeField()
    duration = models.DurationField(default="00:30:00")
    notes = models.ForeignKey("Note", on_delete=models.PROTECT, blank=True, null=True, related_name="appointment_notes")
    attended = models.BooleanField(blank=True, null=True)

    class Meta():
        ordering = ['date', '-time']

    def duration_HHmm(self):
        sec = self.duration.total_seconds()
        return '%01d:%02d' % (int((sec/3600)%3600), int((sec/60)%60))

    def __str__(self):
        if self.attended:
            atnd = '/'
        elif self.attended == False:
            atnd = 'X'
        else:
            atnd = ''

        if str(self.duration == "1:00:00"):
            dur = '1 hour'
        elif str(self.duration == "0:30:00"):
            dur = '30 mins'
        else:
            dur = '-'

        return f"{self.date.strftime('%a %e %b %Y')} {self.time.strftime('%I:%M %p')} {dur}: {self.patient.first_name} {self.patient.last_name} with {self.clinician} [{atnd}]"
    
    def serialize(self):
        if self.attended:
            atnd = '/'
        elif self.attended == False:
            atnd = 'X'
        else:
            atnd = ''
        return {
            'id': self.id,
            'patient_id': self.patient.id,
            'patient': f"{self.patient.first_name} {self.patient.last_name}",
            'date': self.date.strftime('%a %e %b %Y'),
            'time': self.time.strftime('%I:%M %p'),
            'duration': self.duration_HHmm(),
            'clinician': f'{self.clinician.name.first_name} {self.clinician.name.last_name} [{self.clinician.get_role_display()}]',
            'attended': atnd
            }
    
    def available(self):
        return {
            'date': self.date.strftime('%a %e %b %Y'),
            'time': self.time.strftime('%I:%M %p'),
            'duration': str(self.duration)
        }

class Medication(models.Model):
        name = models.CharField(max_length=60)
        description = models.CharField(max_length=500)
        prescription_required = models.BooleanField(default=False)

        def __str__(self):
            if self.prescription_required:
                prescript = '[Prescription required]'
            else:
                prescript = '[Non-prescription]'
            return f"{self.name}: {self.description} {prescript}"

class Note(models.Model):
    note = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    patient = models.ForeignKey("Patient", on_delete=models.PROTECT, related_name="patient_details")
    recorded_by = models.ForeignKey("Clinician", on_delete=models.PROTECT, related_name="staff_details")

    def __str__(self):
        return f"{self.id}. {self.patient.first_name} {self.patient.last_name}: {self.note}"

    def serialize(self):
        return {
            "id": self.id,
            "note": self.note,
            "timestamp": self.timestamp.strftime('%a %e %b %Y, %I:%M %p'),
            "patient": f"{self.patient.first_name} {self.patient.last_name}",
            "recorded_by": f'{self.recorded_by.name.first_name} {self.recorded_by.name.last_name} [{self.recorded_by.get_role_display()}]'
            }

