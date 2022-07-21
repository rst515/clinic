from django.urls import path
from django.views.generic.list import ListView
from django.views.generic.dates import DateDetailView
from . import views 
from . import models
from . import forms

urlpatterns = [
    path("", views.login_view, name="login"),
    path("index", views.index, name="index"),
    path("appointment", views.appointment, name="appointment"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("future", views.future, name="future"),
    path("past", views.past, name="past"),

    path('appointment/<int:id>/delete', views.deleteAppointment, name="deleteAppointment"),
    path('appointment/<int:id>/attendance', views.toggleAttendance, name="attendance"),

    path('newAppt', views.newAppointment, name="newAppt"), #HTMX
    path('newApptTime', views.newApptTime, name="newApptTime"), #HTMX
    path('newApptDuration', views.newApptDuration, name="newApptDuration"), #HTMX
    
    path('staff/<int:id>', views.staff, name="staff"),
    path('staff/<int:id>/edit', views.editStaff, name="editStaff"),
    path('staff/new', views.newStaff, name="newStaff"),
    path('staff/search', views.staffSearchList, name="staffSearchList"),

    path('patient/<int:id>', views.patient, name="patient"),
    path('patient/new', views.newPatient, name="newPatient"),
    path('patient/<int:id>/edit', views.editPatient, name="editPatient"),
    path('patient/<int:id>/delete', views.deletePatient, name="deletePatient"),
    path('patient/search', views.patientSearchList, name="patientSearchList"),

    path('note/<int:id>', views.note, name="note"),
    path('note/new', views.newNote, name="newNote"),
    path('note/<int:id>/delete', views.deleteNote, name="deleteNote"),
    
]