# Clinic Management Information System (MIS) 

The aim of this project was to create an app that manages patient bookings with clinical staff. Django is used for the back end and HTML, Bootstrap, JavaScript with some HTMX (discovered when researching a solution for creating a live search) for the front end. 

There are 5 Django models in the app: 
- **User**: for the staff at the clinic who will use the app 
- **Clinician**: details of the clinical staff, including their linked patients, appointments and clinical notes 
- **Patient**: details of the patients, including their appointments, main clinician and notes 
- **Appointment**: records of appointments between clinicians and patients 
- **Note**: clinical notes made by clinicians about individual patients 
- **Medication**: prescription and non-prescription medications that can be assigned to patients.   

Users can create, read, update and delete 
- patient records 
- appointments 
- clincial notes 

API routes are provided for these in `mis\views.py` and paths in `mis\urls.py`.  The associated JavaScript, including for example fetch/get requests, are in `\static\mis\mis.js`.  

# Interface 

The mobile-responsive interface has been designed using Bootstrap 5. Elements are updated via JavaScript or HTMX.  
For example when appointment attendnace is updated the icon is replaced by a JavaScript function, rather than reloading the whole page.
Another example is when an appointment is deleted, the class of the table row element is changed to make it fade out of view. It is not necessary to reload the whole page.
On smaller mobile devices it is preferable to use the device in a landscape orientation. 

## Appointments 

The initial view is a list of appointments today. Each record row has an actions button which enables the appointment attendance to be marked, for the appointment to be deleted and also provides a link to the patent's details. The delete option uses HTMX to process a GET request to a view that deletes the item from the database and also uses JavaScript to update the page without reloading all the content. 

Past and future appointments are passed in as separate views.   

New appointments can be created from a form which uses cascading fields: the HTML is updated to show only appointment times and durations available for the selected clinician for the selected date/time. This means that a clinician cannot be booked if they already have an appointment nor can appointments overlap in the case of 1-hour appointments being booked where only 30 mins is available. The HTML for this form is updated using [HTMX](https://htmx.org/). 

Pagination is provided for appointment views. 

## Patients 

New patients can be added via a form. 
Existing patients can be found via a search which uses an API call to return matching string partials. 
The patient display shows their details, main clinician, medications, appointment details and clinical notes. 
Patients may be edited via the actions button which loads an update form. 

## Staff 

New clinicians can be added via a form. 
Existing clinicians can be found via a search which uses an API call to return matching string partials. 
Staff display shows their details, patients, appointments and clinical notes. 
Staff may be edited via the actions button which loads an update form. 

## Dashboard 

The dashboard view is for the signed-in user to see an overview of their appointments today. Action buttons on each appointment allow attendance to be recorded or deleted, and provides a link to patient details.   
A list of all appointments is available too. 
All a clinician's notes are available here also. 
An API call is used to retrieve the user's data, and JavaScript replaces the elements in the current view to show them. 

# Distinctiveness and Complexity: 

This project implements the core features of the CS50 project suite using the server-side python Django framework for models, views, forms, urls, with API requests via JavaScript and update of HTML elements using JavaScript without reloading the whole page in the browser. 

This project is distinct from previous projects as the main database elements are people, events and clinical notes/items, rather than post objects or commerce elements as seen in other projects. Additional complexity is included in the datetime scheduling logic used to avoid clashes of appointments (in `forms.py`). Also, live searches for patients and staff show results as characters are entered, with clickable results navigating the user to the associated record, and cascading choice fields in the new appointment form display only the options the user should be able to choose based on existing items in the database (in `mis.js`). 

# File contents and requirements

This Django project is organised as follows: 

- /clinic/clinic - main project settings. 
- /clinic/mis - app python files for models, views, URL patterns etc. plus static files and templates. 
- /clinic/requirements.txt - lists additional libraries required for this app.
Bootstrap 5 and HTMX CDNs are included in `mis/templates/mis/layout.html`. 

# How to run the application 

- Run `python manage.py runserver` from within the clinic/MIS folder. 

- Register as a new user if necessary and then sign-in. Note that after registering an existing user needs to approve the account creation request and assign clinician status.  Pending approval notifications in the menu bar. 

- The initial view is for today's appointments. 

- The menu, which is size-responsive and will automatically collapse to a button on devices with smaller displays, has options for Appointments, Patients, Staff and viewing the user's Dashboard. 

Appointment rows each have an actions menu button with options for the appointment (e.g. record attendance, delete, link to patient details). 

The Dashboard view is intended to be a summary display for the logged-in member of staff to quickly access information for their appointments today. 