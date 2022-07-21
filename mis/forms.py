import datetime
from django import forms
from django.urls import reverse, reverse_lazy
from .models import *
from crispy_forms.helper import FormHelper 
from crispy_forms.layout import Submit, Layout, HTML
from crispy_bootstrap5.bootstrap5 import FloatingField 
from dynamic_forms import DynamicField, DynamicFormMixin

# TIME_MAP_HALF_HOURS_CHOICES = (
#     (datetime.time(9, 00, 00), '09:00'),
#     (datetime.time(9, 30, 00), '09:30'),
#     (datetime.time(10, 00, 00), '10:00'),
#     (datetime.time(10, 30, 00), '10:30'),
#     (datetime.time(11, 00, 00), '11:00'),
#     (datetime.time(11, 30, 00), '11:30'),
#     (datetime.time(12, 00, 00), '12:00'),
#     (datetime.time(12, 30, 00), '12:30'),
#     (datetime.time(14, 00, 00), '14:00'),
#     (datetime.time(14, 30, 00), '14:30'),
#     (datetime.time(15, 00, 00), '15:00'),
#     (datetime.time(15, 30, 00), '15:30'),
#     (datetime.time(16, 00, 00), '16:00'),
#     (datetime.time(16, 30, 00), '16:30')
# )
# DURATION_CHOICES = (
#     (datetime.timedelta(minutes=30), '30 mins'),
#     (datetime.timedelta(minutes=60), '60 mins'),
# )

class NewAppointment(DynamicFormMixin, forms.ModelForm):
    '''When clinician selected available times on chosen date are displayed'''

    clinician = forms.ModelChoiceField(
        queryset = Clinician.objects.all(),
        initial = Clinician.objects.first(),
    )
    date = forms.DateField(widget=forms.TextInput(attrs={'type': 'date'}), initial=datetime.date.today())
    
    def timeChoices(form):
        requested_clinician = form['clinician'].value()
        requested_date = form['date'].value()
        print("Req clinician: ", requested_clinician, "\n", "Req date: ", requested_date, "type: ", type(requested_date))
        
        c = Clinician.objects.get(id=requested_clinician)  
        times = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM']
        filtered_times = list(times)
        a = Appointment.objects.filter(clinician=c, date=requested_date).order_by('date', 'time')
        print(len(a), " appointments for: ", c, ": ", a)
        apts = [a.available() for a in a]
        apt_times = [a['time'] for a in apts]
        print("apt_times: ", apt_times)

        # generate list of appointment times by removing existing appointment times and also appointment times for 1 hour appointments
        doubles = []
        for t in times:
            for a in apts:
                if a['duration'] == "1:00:00" and a['time'] == t:
                    doubles.append(times[times.index(t)+1])

        for t in times:
            for s in apt_times:
                #print("t: ", t, "s: ", s)
                if t == s:
                    filtered_times.remove(t)
                    print("Removed: ", t)

        for t in times:
            for d in doubles:
                if t == d:
                    filtered_times.remove(t)
                    print("Removed for doubles: ", t)
        print("filtered_times: ", filtered_times)

        time_choices = [(datetime.datetime.strptime(t,'%I:%M %p').time(),t) for t in filtered_times]
        print(time_choices)
        return tuple(time_choices)

    time = DynamicField(
        forms.ChoiceField,
        choices=timeChoices,
        # initial=
        )

    def durationChoices(form):
        requested_clinician = form['clinician'].value()
        requested_date = form['date'].value()
        requested_time = form['time'].value()
        if requested_time:
            next_appt_time = datetime.datetime.strptime(requested_time, '%H:%M:%S') + datetime.timedelta(minutes=30)
        else:
            next_appt_time = datetime.datetime.strptime('09:00 AM','%I:%M %p').time()

        c = Clinician.objects.get(id=requested_clinician)  
        a = Appointment.objects.filter(clinician=c, date=requested_date, time=next_appt_time) 
        apt = [a.available() for a in a]
        print(apt)
        if apt:
            if apt[0]['duration'] == "1:00:00":
                filtered_durations = [30]
            else:
                filtered_durations = [30, 60]
        else:
            filtered_durations = [30, 60]

        duration_choices = [(datetime.timedelta(minutes=d),f'{d} mins') for d in filtered_durations]
        print(duration_choices)
        '''DURATION_CHOICES = (
            (datetime.timedelta(minutes=30), '30 mins'),
            (datetime.timedelta(minutes=60), '60 mins'),
        )'''
        return tuple(duration_choices)

    duration = DynamicField(
        forms.ChoiceField,
        choices=durationChoices,
        )

    class Meta:
        model = Appointment
        exclude = ('attended', 'notes')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.form_action = reverse('appointment')
        self.helper.add_input(Submit('submit', 'Submit', css_class='btn btn-dark'))
        self.helper.layout = Layout(
            FloatingField('patient'),
            FloatingField('date'),
            FloatingField('clinician', hx_get="/newApptTime", hx_target="#id_time", hx_include="[name='date']"), 
            FloatingField('time', autocomplete='off', hx_get="/newApptDuration", hx_target="#id_duration", hx_include="[name='date'], [name='clinician']"),
            FloatingField('duration'),
        )
        
class patientDetails(forms.ModelForm):
    class Meta:
        model = Patient
        fields = ('first_name', 'last_name', 'dob', 'gender', 'medications', 'clinicians')
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper(self)
        self.helper.form_action = reverse('newPatient')
        self.helper.add_input(Submit('submit', 'Save', css_class='btn btn-dark')) 
        self.helper.layout = Layout(
            FloatingField('first_name'),
            FloatingField('last_name'),
            FloatingField('dob'),
            FloatingField('gender'),
            ('medications'),
            ('clinicians'),
            HTML('<div id="update-patient-id"></div>'),
            )
    
class staffDetails(forms.ModelForm):
    class Meta:
        model = Clinician
        fields = ('name', 'role', 'main_room', 'patients')
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper(self)
        self.helper.form_action = reverse('newStaff')
        self.helper.add_input(Submit('submit', 'Save', css_class='btn btn-dark')) 
        
        self.helper.layout = Layout(
            FloatingField('name'),
            FloatingField('role'),
            FloatingField('main_room'),
            ('patients'),
            HTML('<div id="update-staff-id"></div>'),
            )

class NewNote(forms.ModelForm):

    class Meta:
        model = Note
        fields = ('patient', 'note',)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper(self)
        self.helper.form_action = reverse('newNote')
        self.helper.add_input(Submit('submit', 'Submit', css_class='btn btn-dark')) 
        self.helper.layout = Layout(
            FloatingField('note'),
            HTML('<div id="note-for-patient"></div>'),
            )
    