from mis.models import *
import random, datetime

people = [1,2,3,4,5]
dates = ['2022-07-14','2022-07-15','2022-07-16','2022-07-17','2022-07-18']
times = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30']

def autoGenApts(n):
    for i in range(n):
        p = Patient.objects.get(id=random.choice(people))
        c = Clinician.objects.get(id=random.choice(people))
        d = random.choice(dates) #dates[1:] 
        dur = datetime.timedelta(minutes=30)
        a = Appointment.objects.create(patient=p, clinician=c, date=d, time=random.choice(times), duration=dur)
        a.save()
 
## to run in manage.py shell:
## path="C:\\Users\\mmrus\\OneDrive\\Documents\\Projects\\CS50_projects\\clinic\\mis\\generate_bookings.py"
## exec (open(path).read())
## autoGenApts(10)