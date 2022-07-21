import json
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import JsonResponse
from django.shortcuts import HttpResponse, HttpResponseRedirect, render
from django.urls import reverse
from django.core.paginator import Paginator
from django.views.decorators.csrf import csrf_exempt
from .forms import *
from .models import *
from django.contrib.auth.decorators import login_required
from datetime import date
from django.core.exceptions import ObjectDoesNotExist

# Views
@login_required
def dashboard(request):
    startdate = date.today()
    c = Clinician.objects.get(name=request.user)
    clinic_appointments_today_count = Appointment.objects.filter(date=startdate).all().count()
    user_appointments_today_count = Appointment.objects.filter(date=startdate, clinician=c).all().count()
    clinic_appointments_attended_today = Appointment.objects.filter(date=startdate, attended=True).all().count()
    user_appointments_attended_today = Appointment.objects.filter(date=startdate, clinician=c, attended=True).all().count()
    clinic_remaining = clinic_appointments_today_count - clinic_appointments_attended_today
    user_remaining = user_appointments_today_count - user_appointments_attended_today

    dash = {
            'id': request.user.id,
            'clinic_appointments_today_count': clinic_appointments_today_count,
            'user_appointments_today_count': user_appointments_today_count,
            'clinic_appointments_attended_today': clinic_appointments_attended_today,
            'user_appointments_attended_today': user_appointments_attended_today,
            'clinic_remaining': clinic_remaining,
            'user_remaining': user_remaining
    }
    return dash

@login_required
def index(request, successMessage=False, errorMessage=False):
    # all appointments
    startdate = date.today()
    appointments_today = Appointment.objects.filter(date=startdate).order_by('date', 'time').all()

    paginator_today = Paginator(appointments_today, 5)
    page_number = request.GET.get('page')
    page_obj_today = paginator_today.get_page(page_number)

    try:
        cn = Clinician.objects.get(name=request.user)
    except ObjectDoesNotExist:
        return HttpResponse("Thank you for registering. You will be informed when you have been assigned clincian user status and your account has been activated.")

    pending_users_count = User.objects.filter(is_clinician=False).all().count()
    p = User.objects.filter(is_clinician=False)
    p = [p.__str__() for p in p]
    if len(p) > 1:
        c = ", "
    else:
        c = ""
    pending_users_list = ""
    for i in p:
        pending_users_list += i + c 
    print(pending_users_list)
    # pending_users_list = str(pending_users_list)
    # string1=""
    # pending_users_list = (string1.join(pending_users_list))
    # string2=", "
    # pending_users_list = (string2.join(pending_users_list))

    context = {
        "appointments": page_obj_today, 
        "apt_title": "Today's appointments", #: {startdate.strftime('%a %e %b %Y')}",
        "appointment_form": NewAppointment(),
        "success_message": successMessage,
        "warning_message": errorMessage,
        "patients": Patient.objects.all(),
        "patient_form": patientDetails(),
        "staff_form": staffDetails(),
        "note_form" : NewNote(),
        "patient_list" : patientSearchList(request),
        "staff_list": staffSearchList(request),
        "dash": dashboard(request),
        "clinician_id": cn.id,
        "pending_users_count": pending_users_count,
        "pending_users_list": pending_users_list,
    }

    return render(request, "mis/index.html", context)

@login_required
def future(request):
    form = NewAppointment()
    startdate = date.today()
    appointments_future = Appointment.objects.filter(date__gt=startdate).order_by('date', 'time').all()
    cn = Clinician.objects.get(name=request.user)

    paginator_future = Paginator(appointments_future, 5)
    page_number = request.GET.get('page')
    page_obj_future = paginator_future.get_page(page_number)

    return render(request, "mis/index.html", {
        "appointments": page_obj_future,
        "apt_title": "Future appointments",
        "appointment_form": form,
        "note_form" : NewNote(),
        "patient_form": patientDetails(),#
        "staff_form": staffDetails(),
        "patient_list" : patientSearchList(request),
        "staff_list": staffSearchList(request),
        "dash": dashboard(request),
        "clinician_id": cn.id

    })

@login_required
def past(request):
    form = NewAppointment()
    startdate = date.today()
    appointments_past = Appointment.objects.filter(date__lt=startdate).order_by('-date', 'time').all()
    cn = Clinician.objects.get(name=request.user)

    paginator_past = Paginator(appointments_past, 5)
    page_number = request.GET.get('page')
    page_obj_past = paginator_past.get_page(page_number)

    return render(request, "mis/index.html", {
        "appointments": page_obj_past,
        "apt_title": "Past appointments",
        "appointment_form": form,
        "note_form" : NewNote(),
        "patient_form": patientDetails(),
        "staff_form": staffDetails(),
        "patient_list" : patientSearchList(request),
        "staff_list": staffSearchList(request),
        "dash": dashboard(request),
        "clinician_id": cn.id
    })

@login_required
def appointment(request): #create new appointment
    '''Accepts POST request for creating new appointment'''
    if request.method == "POST":
        form = NewAppointment(request.POST)
        if form.is_valid():
            obj = form.save(commit=False) 
            # obj.duration = datetime.timedelta(minutes=30)
            # check clinician availabilty
            # if booking ok, save and return success msg
            # else render form with advice note 
            form.save()
            return index(request, successMessage=f"Appointment for {obj.patient} on {obj.date.strftime('%a %e %b %Y')} at {obj.time.strftime('%I:%M %p')} created!")
        else:
            return render(request, "", {
                "warning_message": 'Form error, please try again.',
                "form": form,
            })
    else:
        return index(request)

@login_required
def newAppointment(request):
    '''Renders form for creating new appointment'''
    form = NewAppointment()
    context = {"form" : form}
    return render(request, 'mis/index.html', context) 

@login_required
def newApptTime(request):
    '''Retruns list of available times for selected clinician (HTMX updated in page)'''
    form = NewAppointment(request.GET)
    # print("Form time: ", form['time'], form['duration'])
    return HttpResponse(form['time'])

@login_required
def newApptDuration(request):
    '''Retruns list of available times for selected clinician (HTMX updated in page)'''
    form = NewAppointment(request.GET)
    # print("Form time: ", form['time'], form['duration'])
    return HttpResponse(form['duration'])

@login_required
def patientSearchList(request):
    p = Patient.objects.all().values('id', 'first_name', 'last_name').order_by('last_name', 'first_name')
    p_json = json.dumps(list(p))
    return JsonResponse(p_json, safe=False) 

@login_required
def staffSearchList(request):
    c = Clinician.objects.all().values('id', 'name__first_name', 'name__last_name').order_by('name__last_name', 'name__first_name')
    c_json = json.dumps(list(c))
    return JsonResponse(c_json, safe=False)

@login_required
def patient(request, id):
    if request.method == 'GET':
        patient = Patient.objects.get(id=id)
        appointments = Appointment.objects.filter(patient=patient.id).order_by('-date', 'time')
        notes = Note.objects.filter(patient=patient.id).order_by('-timestamp')
        print(notes)
        p = patient.serialize()
        apts = [a.serialize() for a in appointments]
        nts = [n.serialize() for n in notes]
        p.update({'appointments': apts})
        p.update({'notes': nts})

        return JsonResponse(p)
    else:
        return JsonResponse({
            "error": "Invalid request."
            }, status=400)

@login_required
def newStaff(request):
    if request.method == 'POST':
        form = staffDetails(request.POST)
        if form.is_valid():
            obj = form.save()
            #obj.item = value
            form.save()
            user_record = User.objects.get(id=obj.name.id)
            user_record.is_clinician = True
            user_record.save(update_fields=['is_clinician'])
            return(index(request, successMessage=f"Clinician {obj.name.first_name} {obj.name.last_name} created!"))
        else:
            return(index(request, errorMessage=f"Form error for New Clinician {obj.name.first_name} {obj.name.last_name}!"))
    else:
        return JsonResponse({
            "error": "Invalid request."
            }, status=400)

@login_required
def staff(request, id):
    if request.method == 'GET':
        staff = Clinician.objects.get(id=id)
        appointments = Appointment.objects.filter(clinician=staff.id).order_by('-date', 'time')
        notes = Note.objects.filter(recorded_by=staff.id).order_by('-timestamp')
        appointments_today = Appointment.objects.filter(clinician=staff.id, date=datetime.date.today()).order_by('time')

        s = staff.serialize()
        apts = [a.serialize() for a in appointments]
        apts_today = [a.serialize() for a in appointments_today]
        nts = [n.serialize() for n in notes]
        s.update({'appointments': apts})
        s.update({'appointments_today': apts_today})
        s.update({'notes': nts})

        return JsonResponse(s)
    else:
        return JsonResponse({
            "error": "Invalid request."
            }, status=400)

@login_required
def newPatient(request):
    if request.method == 'POST':
        form = patientDetails(request.POST)
        if form.is_valid():
            obj = form.save()
            #obj.item = value
            form.save()
            return(index(request, successMessage=f"Patient {obj.first_name} {obj.last_name} created!"))
        else:
            return(index(request, errorMessage=f"Form error for New Patient {obj.first_name} {obj.last_name}!"))
    else:
        return JsonResponse({
            "error": "Invalid request."
            }, status=400)

@login_required
def editPatient(request, id):
    obj = Patient.objects.get(id=id)
    print(obj)
    form = patientDetails(instance = obj)
    if request.method == 'POST':
        form = patientDetails(request.POST, instance = obj)
        if form.is_valid():
            obj = form.save()
            form.save()
            return(index(request, successMessage=f"Patient {obj.first_name} {obj.last_name} updated!"))
    return render(request, 'mis/patient_update_form.html', {
       "form": form,
    })

@login_required
def editStaff(request, id):
    obj = Clinician.objects.get(id=id)
    print(obj)
    form = staffDetails(instance = obj)
    if request.method == 'POST':
        form = staffDetails(request.POST, instance = obj)
        if form.is_valid():
            form.save()
            return(index(request, successMessage=f"Clinician {obj.name.first_name} {obj.name.last_name} updated!"))
        else:
            return(index(request, errorMessage=f"Form error for clinician {obj.name.first_name} {obj.name.last_name}!"))
    return render(request, 'mis/staff_update_form.html', {
       "form": form,
    })

@login_required
def newNote(request): #create new note
    if request.method == "POST":
        form = NewNote(request.POST)
        if form.is_valid():
            obj = form.save(commit=False) 
            obj.timestamp = datetime.datetime.now()
            obj.recorded_by = Clinician.objects.get(name=request.user)
            form.save()
            return index(request, successMessage=f"Note for {obj.patient} created!")
        else:
            return render(request, "mis/index.html", {
                "warning_message": 'Form error, please try again.',
                "form": form,
            })
    else:
        return index(request)

@csrf_exempt
@login_required
def toggleAttendance(request, id):
    if request.method == 'PUT':
        appointment = Appointment.objects.get(id=id)
        data = json.loads(request.body)
        appointment.attended = data.get("attended")
        appointment.save(update_fields=['attended'])
        return JsonResponse({'id':id,'attendance':appointment.attended})
    
    elif request.method == 'GET':
        appointment = Appointment.objects.get(id=id)
        return JsonResponse({'id': id,'attended': appointment.attended})
    else:
        return JsonResponse({
            "error": "Proper request required."
        }, status=400)

@csrf_exempt
@login_required
def deleteAppointment(request, id):
    if request.method == 'PUT':
        appointment = Appointment.objects.get(id=id)
        appointment.delete()
        return HttpResponse(status=200) 
    else:
        return JsonResponse({
            "error": "PUT request required."
        }, status=400)

@csrf_exempt
@login_required
def deleteNote(request, id):
    if request.method == 'PUT':
        note = Note.objects.get(id=id)
        print("Note to be deleted :", note)
        note.delete()
        return JsonResponse({'id':id,'message': f'Note for {note.patient} deleted!'})
    else:
        return JsonResponse({
            "error": "PUT request required."
        }, status=400)

@csrf_exempt
@login_required
def note(request, id):
    if request.method == 'GET':
        note = Note.objects.get(id=id)
        return JsonResponse({'id':id,'patient': f'{note.patient.first_name} {note.patient.last_name}', 'note': note.note, 'timestamp': note.timestamp, 'recorded_by': f'{note.recorded_by.name.first_name} {note.recorded_by.name.last_name}'})
    else:
        return JsonResponse({
            "error": "GET request required."
        }, status=400)

@csrf_exempt
@login_required
def deletePatient(request, id):
    if request.method == 'PUT':
        p = Patient.objects.get(id=id)
        p.delete()
        return JsonResponse({'id':id,'message': f'Patient {p.first_name} {p.last_name} deleted!'})
    else:
        return JsonResponse({
            "error": "Proper request required."
        }, status=400)

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "mis/sign_in.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "mis/sign_in.html")

def logout_view(request):
    logout(request)
    return render(request, "mis/sign_in.html")

def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]
        first_name = request.POST["first_name"]
        last_name = request.POST["last_name"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "mis/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.first_name = first_name
            user.last_name = last_name
            user.save()
        except IntegrityError:
            return render(request, "mis/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "mis/register.html")