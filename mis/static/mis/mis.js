'use strict';

// Toggle attendance
// Icons
const checked = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill text-success" viewBox="0 0 16 16">
<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
</svg>`
const unchecked = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle text-warning" viewBox="0 0 16 16">
<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
</svg>`

function markAttended(id,a) {
    fetch(`/appointment/${id}/attendance`, {
        method: 'PUT',
        body: JSON.stringify({
            id: id,
            attended: a,
        })
    })
        .then(response => {
            console.log(response.status);
            updateAttendance(id);
            //setTimeout(function () { updateAttendance(id); }, 1000);
        })
};

function updateAttendance(id) {
    fetch(`/appointment/${id}/attendance`)
        .then(response => response.json())
        .then(result => {
            console.log(result.attended);
          if (result.attended !== true) {
            let el = document.getElementsByClassName(`attended-${id}`);
            for (let i = 0; i < el.length; i++) {
              el[i].innerHTML = unchecked;
            };
                // document.getElementById(`attended-${id}`).innerHTML = unchecked;
                //document.getElementById(`togAtt-${id}`).innerHTML = checked + ' Mark as attended';
                //console.log('is not true, set checked')
          } else {
            let el = document.getElementsByClassName(`attended-${id}`);
            for (let i = 0; i < el.length; i++) {
              el[i].innerHTML = checked;
            };
                //document.getElementById(`attended-${id}`).innerHTML = checked;
                //document.getElementById(`togAtt-${id}`).innerHTML = unchecked + ' Mark not attended';
                //console.log('is true, set unchecked');
            };
            // console.log(response.status);
        });
};

// Appointments

// function deleteAppt(id) {
//    fetch(`/appointment/${id}/delete`, {
//         method: 'PUT',
//         body: JSON.stringify({
//             id: id,
//         })
//     })
//      .then(response => response.json())
//      .then(data => {
//        let el = document.getElementsByClassName(`appt-row-${id}`);
//        console.log(el);
//        for (let i = 0; i < el.length; i++) {
//          console.log(el[i]);
//         //  el[i].hidden = true;
//         el[i].classList = 'collapse';
//        };
//            successMsg(data.message);
//        });
//             //updateAttendance(id);
//             //setTimeout(function () { updateAttendance(id); }, 1000);
// };

// Notes
function deleteNote(id) {
  fetch(`/note/${id}/delete`, {
       method: 'PUT',
       body: JSON.stringify({
           id: id,
       })
   })
    .then(response => response.json())
    .then(data => {
      let el = document.getElementsByClassName(`note-row-${id}`);
      console.log(el)
      for (let i = 0; i < el.length; i++) {
        console.log(el[i]);
        el[i].hidden = true;
      };
          successMsg(data.message);
      });
};

function showAddNote(id) {
  fetch(`patient/${id}`)
    .then(response => response.json())
    .then(patient_record => {
      //console.log(patient_record);
      document.getElementById('new-note').innerText = `New Note for ${patient_record.name}`;
      document.getElementById('note-for-patient').innerHTML = `<input type="hidden" name="patient" value="${patient_record.id}" />`
    });
};

// Patients
function deletePatient(id) {
  fetch(`/patient/${id}/delete`, {
       method: 'PUT',
       body: JSON.stringify({
           id: id,
       })
   })
      .then(response => response.json())
      .then(data => {
          //  document.getElementById(`row-${id}`).classList = "bg-secondary text-danger fade";
          // setTimeout(function () { document.getElementById(`row-${id}`).remove(); }, 500);
          document.getElementById('patient_tables').style.display = 'none';  
          successMsg(data.message);
      });
           //updateAttendance(id);
           //setTimeout(function () { updateAttendance(id); }, 1000);
};
function patient(id) {
    fetch(`/patient/${id}`)
        .then(response => response.json())
        .then(patient_record => {
          console.log(patient_record);
          document.getElementById(`patient-name`).innerHTML = `<svg class="bi pe-none me-2" width="24" height="24"><use xlink:href="#people-circle" /></svg>` + patient_record.name;
          document.getElementById('patient-button').innerHTML = `
          <button
            type="button"
            class="btn btn-outline-light btn-sm dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            id="patient-button"
            aria-label="row button"
            style="position: inherit;"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-three-dots-vertical"
              viewBox="0 0 16 16"
            >
              <path
                d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"
              />
            </svg>
          </button>
          <ul class="dropdown-menu" >
            <li>
              <a class="dropdown-item"
              href="#"
              data-bs-toggle="collapse"
              data-bs-target="#collapseNewAppt, #collapsePatientTable"
              aria-expanded="false"
              aria-controls="collapseNewAppt"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-calendar-plus"
                viewBox="0 0 16 16"
              >
                <path
                  d="M8 7a.5.5 0 0 1 .5.5V9H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V10H6a.5.5 0 0 1 0-1h1.5V7.5A.5.5 0 0 1 8 7z"
                />
                <path
                  d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"
                />
              </svg>
              New Appointment</a>
                  <a class="dropdown-item" href="#" onclick="return showAddNote(${patient_record.id})" id="new-note" data-bs-toggle="collapse"
                  data-bs-target="#collapseNewNote, #collapsePatientTable"
                  aria-expanded="false"
                  aria-controls="collapseNewNote"
                >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-journal-plus" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M8 5.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V10a.5.5 0 0 1-1 0V8.5H6a.5.5 0 0 1 0-1h1.5V6a.5.5 0 0 1 .5-.5z"/>
                  <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z"/>
                  <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z"/>
                </svg> New Note</a>
                <a class="dropdown-item" href="/patient/${patient_record.id}/edit" id="update-patient" onclick="">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
</svg> Edit Patient</a>
            </li>
            <li><hr class="dropdown-divider" /></li>
                              <li>
                                <a
                                  class="dropdown-item text-danger"
                                  href="#"
                                  onclick="return deletePatient(${patient_record.id})"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    class="bi bi-trash"
                                    viewBox="0 0 16 16"
                                  >
                                    <path
                                      d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"
                                    />
                                    <path
                                      fill-rule="evenodd"
                                      d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                                    />
                                  </svg>
                                  Delete</a
                                >
                              </li>
          </ul>`;
          document.getElementById(`patient-dob`).innerText = patient_record.dob;
          document.getElementById(`patient-gender`).innerText = " " + patient_record.gender;
          document.getElementById(`patient-medications`).innerText = patient_record.medications;
          document.getElementById(`patient-clinicians`).innerText = patient_record.clinicians;
          let trA = ''
          for (let i = 0; i < patient_record.appointments.length; i++) {
            let obj = patient_record.appointments[i]
            let attendMark = ''
            if (obj.attended === "/") {
              attendMark =
                '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill text-success" viewBox="0 0 16 16"> <path d = "M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" /></svg > ';
            } else if (obj.attended === "X") {
              attendMark =
                `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle text-warning" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>`;
            } else { attendMark = "-"; }
            trA += `<tr class="appt-row-${obj.id}"><td>${obj.date}</td> <td>${obj.time}</td> <td>${obj.clinician}</td> <td>${obj.duration}</td> <td class="attended-${obj.id} text-center">${attendMark}</td><td>
                <!-- Row button -->
                <div class="btn-group dropstart">
                  <button
                    type="button"
                    class="btn btn-outline-dark btn-sm dropdown-toggle"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    id="row-button-${obj.id}"
                    aria-label="row button"
                    style="position: inherit;"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-three-dots-vertical"
                      viewBox="0 0 16 16"
                    >
                      <path
                        d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"
                      />
                    </svg>
                  </button>
                  <ul class="dropdown-menu" >

                    <li>
                      <a class="dropdown-item" href="#" onclick="return markAttended(${obj.id},true)" id="togAtt-${obj.id}"
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill text-success" viewBox="0 0 16 16">
                          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                          </svg> Mark as attended</a>
                          <a class="dropdown-item" href="#" onclick="return markAttended(${obj.id},false)" id="togAtt-${obj.id}"
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle text-warning" viewBox="0 0 16 16">
                          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                        </svg> Mark not attended</a>
                    </li>
                    <li>
                    <a class="dropdown-item"
                    href="#"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseNewAppt, #collapsePatientTable"
                    aria-expanded="false"
                    aria-controls="collapseNewAppt"
                    ><svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-calendar-plus"
                      viewBox="0 0 16 16"
                    >
                      <path
                        d="M8 7a.5.5 0 0 1 .5.5V9H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V10H6a.5.5 0 0 1 0-1h1.5V7.5A.5.5 0 0 1 8 7z"
                      />
                      <path
                        d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"
                      />
                    </svg>
                    New Appointment</a>
                    </li>
                    <li><hr class="dropdown-divider" /></li>
                    <li>
                      <a
                        class="dropdown-item text-danger"
                        href="#"
                        hx-put="/appointment/${obj.id}/delete"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          class="bi bi-trash"
                          viewBox="0 0 16 16"
                        >
                          <path
                            d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"
                          />
                          <path
                            fill-rule="evenodd"
                            d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                          />
                        </svg>
                        Delete</a
                      >
                    </li>
                  </ul>
                </div>
              </td></tr>`

          };
          document.getElementById(`patient-appointments`).innerHTML = trA;
          let trN = ''
          for (const i of patient_record.notes) {
            trN += `<tr class="note-row-${i.id}"><td>${i.timestamp}</td><td>${i.note}</td><td>${i.recorded_by}</td><td>
            <!-- Row button -->
            <div class="btn-group dropstart">
              <button
                type="button"
                class="btn btn-outline-dark btn-sm dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                class="row-button-${i.id}"
                aria-label="row button"
                style="position: inherit;"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-three-dots-vertical"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"
                  />
                </svg>
              </button>
              <ul class="dropdown-menu" >
                <li>
                <a class="dropdown-item" href="#" id="new-note" onclick="return ShowAddNote(${id})" data-bs-toggle="collapse"
                              data-bs-target="#collapseNewNote, #collapsePatientTable"
                              aria-expanded="false"
                              aria-controls="collapseNewNote"
                            >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-journal-plus" viewBox="0 0 16 16">
                              <path fill-rule="evenodd" d="M8 5.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V10a.5.5 0 0 1-1 0V8.5H6a.5.5 0 0 1 0-1h1.5V6a.5.5 0 0 1 .5-.5z"/>
                              <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z"/>
                              <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z"/>
                            </svg> New Note</a>
                </li>
                <li>
                  <a class="dropdown-item" href="#" onclick="return successMsg('Edit button for note ${i.id} clicked!')"
                    ><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                      <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                    </svg> Edit</a
                  >
                </li>
                <li><hr class="dropdown-divider" /></li>
                <li>
                  <a
                    class="dropdown-item text-danger"
                    href="#"
                    onclick="return deleteNote(${i.id})"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-trash"
                      viewBox="0 0 16 16"
                    >
                      <path
                        d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"
                      />
                      <path
                        fill-rule="evenodd"
                        d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                      />
                    </svg>
                    Delete</a
                  >
                </li>
              </ul>
            </div>
          </td></tr>`;
          };
          document.getElementById(`patient-notes`).innerHTML = trN;
          htmx.process(document.getElementById(`patient-appointments`));
        });
};

// Staff (staff details and dashboard)
function staff(id) {
  fetch(`/staff/${id}`)
      .then(response => response.json())
      .then(staff_record => {
        console.log(staff_record);
        let el = document.getElementsByClassName("staff-name");
        for (let i = 0; i < el.length; i++) {
          el[i].innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-person-badge" viewBox="0 0 16 16">
          <path d="M6.5 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
          <path d="M4.5 0A2.5 2.5 0 0 0 2 2.5V14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2.5A2.5 2.5 0 0 0 11.5 0h-7zM3 2.5A1.5 1.5 0 0 1 4.5 1h7A1.5 1.5 0 0 1 13 2.5v10.795a4.2 4.2 0 0 0-.776-.492C11.392 12.387 10.063 12 8 12s-3.392.387-4.224.803a4.2 4.2 0 0 0-.776.492V2.5z"/>
        </svg>&nbsp` + staff_record.name;
        };
        el = document.getElementsByClassName("staff-button");
        for (let i = 0; i < el.length; i++) {
          el[i].innerHTML = `
        <button
          type="button"
          class="btn btn-outline-light btn-sm dropdown-toggle"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          id="staff-button"
          aria-label="row button"
          style="position: inherit;"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-three-dots-vertical"
            viewBox="0 0 16 16"
          >
            <path
              d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"
            />
          </svg>
        </button>
        <ul class="dropdown-menu" >
              <a class="dropdown-item" href="/staff/${staff_record.id}/edit" id="update-staff" onclick="">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
  </svg> Edit Staff</a>
          </li>
        </ul>`;
        };

        el = document.getElementsByClassName("staff-role");
        for (let i = 0; i < el.length; i++) {
          el[i].innerText = " " + staff_record.role;
        };

        el = document.getElementsByClassName("staff-main_room");
        for (let i = 0; i < el.length; i++) {
          el[i].innerText = staff_record.main_room;
        };
        let pat = ''
        for (let p in staff_record.patients) {
          pat += staff_record.patients[p] + '\n'
        };

        el = document.getElementsByClassName("staff-patients");
        for (let i = 0; i < el.length; i++) {
          el[i].innerText = pat;
        };

        let trA_today = ''
        console.log(staff_record.appointments_today);
        for (let i = 0; i < staff_record.appointments_today.length; i++) {
          let obj = staff_record.appointments_today[i]
          let attendMark = ''
          if (obj.attended === "/") {
            attendMark =
              '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill text-success" viewBox="0 0 16 16"> <path d = "M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" /></svg > ';
          } else if (obj.attended === "X") {
            attendMark =
              `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle text-warning" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>`;
          } else { attendMark = "-"; }
          trA_today += `<tr class="appt-row-${obj.id}"><td>${obj.date}</td> <td>${obj.time}</td> <td>${obj.patient}</td> <td>${obj.duration}</td> <td class="attended-${obj.id} text-center">${attendMark}</td><td>
              <!-- Row button -->
              <div class="btn-group dropstart">
                <button
                  type="button"
                  class="btn btn-outline-dark btn-sm dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  id="row-button-${obj.id}"
                  aria-label="row button"
                  style="position: inherit;"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-three-dots-vertical"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"
                    />
                  </svg>
                </button>
                <ul class="dropdown-menu" >

                  <li>
                    <a class="dropdown-item" href="#" onclick="return markAttended(${obj.id},true)" id="togAtt-${obj.id}"
                      >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill text-success" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                        </svg> Mark as attended</a>
                        <a class="dropdown-item" href="#" onclick="return markAttended(${obj.id},false)" id="togAtt-${obj.id}"
                      >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle text-warning" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                      </svg> Mark not attended</a>
                  </li>
                  <li>
                  <a class="dropdown-item"
                  href="#"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseNewAppt, #collapsePatientTable"
                  aria-expanded="false"
                  aria-controls="collapseNewAppt"
                  ><svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-calendar-plus"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M8 7a.5.5 0 0 1 .5.5V9H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V10H6a.5.5 0 0 1 0-1h1.5V7.5A.5.5 0 0 1 8 7z"
                    />
                    <path
                      d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"
                    />
                  </svg>
                  New Appointment</a>
                  </li>

                  <li><hr class="dropdown-divider" /></li>
                  <li>
                    <a
                      class="dropdown-item"
                      href="#"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapsePatientTable"
                      onclick="return patient(${obj.patient_id})"
                    >
                    <svg class="bi pe-none" width="16" height="16">
                      <use xlink:href="#people-circle" />
                    </svg>
                     Patient Details</a
                    >
                  </li>

                  <li><hr class="dropdown-divider" /></li>
                  <li>
                    <a
                      class="dropdown-item text-danger"
                      hx-put="appointment/${obj.id}/delete"
                      hx-trigger="click"
                      href="#"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-trash"
                        viewBox="0 0 16 16"
                      >
                        <path
                          d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"
                        />
                        <path
                          fill-rule="evenodd"
                          d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                        />
                      </svg>
                      Delete</a
                    >
                  </li>
                </ul>
              </div>
            </td></tr>`
        };

        el = document.getElementsByClassName("staff-appointments-today");
        for (let i = 0; i < el.length; i++) {
          el[i].innerHTML = trA_today;
          htmx.process(el[i]);
        };

        let trA = ''
        for (let i = 0; i < staff_record.appointments.length; i++) {
          let obj = staff_record.appointments[i]
          let attendMark = ''
          if (obj.attended === "/") {
            attendMark =
              '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill text-success" viewBox="0 0 16 16"> <path d = "M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" /></svg > ';
          } else if (obj.attended === "X") {
            attendMark =
              `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle text-warning" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>`;
          } else { attendMark = "-"; }
          trA += `<tr class="appt-row-${obj.id}"><td>${obj.date}</td> <td>${obj.time}</td> <td>${obj.patient}</td> <td>${obj.duration}</td> <td class="attended-${obj.id} text-center">${attendMark}</td><td>
              <!-- Row button -->
              <div class="btn-group dropstart">
                <button
                  type="button"
                  class="btn btn-outline-dark btn-sm dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  id="row-button-${obj.id}"
                  aria-label="row button"
                  style="position: inherit;"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-three-dots-vertical"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"
                    />
                  </svg>
                </button>
                <ul class="dropdown-menu" >

                  <li>
                    <a class="dropdown-item" href="#" onclick="return markAttended(${obj.id},true)" id="togAtt-${obj.id}"
                      >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill text-success" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                        </svg> Mark as attended</a>
                        <a class="dropdown-item" href="#" onclick="return markAttended(${obj.id},false)" id="togAtt-${obj.id}"
                      >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle text-warning" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                      </svg> Mark not attended</a>
                  </li>
                  <li>
                  <a class="dropdown-item"
                  href="#"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseNewAppt, #collapsePatientTable"
                  aria-expanded="false"
                  aria-controls="collapseNewAppt"
                  ><svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-calendar-plus"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M8 7a.5.5 0 0 1 .5.5V9H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V10H6a.5.5 0 0 1 0-1h1.5V7.5A.5.5 0 0 1 8 7z"
                    />
                    <path
                      d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"
                    />
                  </svg>
                  New Appointment</a>
                  </li>

                  <li><hr class="dropdown-divider" /></li>
                  <li>
                    <a
                      class="dropdown-item"
                      href="#"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapsePatientTable"
                      onclick="return patient(${obj.patient_id})"
                    >
                    <svg class="bi pe-none" width="16" height="16">
                      <use xlink:href="#people-circle" />
                    </svg>
                     Patient Details</a
                    >
                  </li>

                  <li><hr class="dropdown-divider" /></li>
                  <li>
                    <a
                      class="dropdown-item text-danger"
                      hx-put="appointment/${obj.id}/delete"
                      href="#"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-trash"
                        viewBox="0 0 16 16"
                      >
                        <path
                          d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"
                        />
                        <path
                          fill-rule="evenodd"
                          d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                        />
                      </svg>
                      Delete</a
                    >
                  </li>
                </ul>
              </div>
            </td></tr>`
        };

        el = document.getElementsByClassName("staff-appointments");
        for (let i = 0; i < el.length; i++) {
          el[i].innerHTML = trA;
          htmx.process(el[i]);
        };
        let trN = ''
        for (const i of staff_record.notes) {
          trN += `<tr class="note-row-${i.id}"><td>${i.patient}</td><td>${i.timestamp}</td><td>${i.note}</td><td>
          <!-- Row button -->
          <div class="btn-group dropstart">
            <button
              type="button"
              class="btn btn-outline-dark btn-sm dropdown-toggle"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              id="row-button-${i.id}"
              aria-label="row button"
              style="position: inherit;"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-three-dots-vertical"
                viewBox="0 0 16 16"
              >
                <path
                  d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"
                />
              </svg>
            </button>
            <ul class="dropdown-menu" >
              <li>
              <a class="dropdown-item" href="#" id="new-note" onclick="return ShowAddNote(${id})" data-bs-toggle="collapse"
                            data-bs-target="#collapseNewNote, #collapsePatientTable"
                            aria-expanded="false"
                            aria-controls="collapseNewNote"
                          >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-journal-plus" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M8 5.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V10a.5.5 0 0 1-1 0V8.5H6a.5.5 0 0 1 0-1h1.5V6a.5.5 0 0 1 .5-.5z"/>
                            <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z"/>
                            <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z"/>
                          </svg> New Note</a>
              </li>
              <li>
                <a class="dropdown-item" href="#" onclick="return successMsg('Edit button for note ${i.id} clicked!')"
                  ><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                  </svg> Edit</a
                >
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <a
                  class="dropdown-item text-danger"
                  href="#"
                  onclick="return deleteNote(${i.id})"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-trash"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"
                    />
                    <path
                      fill-rule="evenodd"
                      d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                    />
                  </svg>
                  Delete</a
                >
              </li>
            </ul>
          </div>
        </td></tr>`;
        };
        el = document.getElementsByClassName("staff-notes");
        for (let i = 0; i < el.length; i++) {
          el[i].innerHTML = trN;
        };
      });
};

//  Messages
function successMsg(messageText) {
    const msg = `  <div
  class="alert alert-success d-flex align-items-center alert-dismissible fade show"
  role="alert"
  >
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    class="bi bi-check-circle"
    viewBox="0 0 16 16"
    role="img"
    aria-label="Success:"
  >
    <path
      d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
    />
    <path
      d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"
    />
  </svg>
  <div>
    &nbsp ${messageText} <button
      type="button"
      class="btn-close"
      data-bs-dismiss="alert"
      aria-label="Close"
      onclick=""
    ></button>
  </div>
      </div>`;
    document.getElementById('successMsgDiv').innerHTML = msg;
};

function loadIndex() {
  setTimeout(function () {
    window.location.replace("/index");
     }, 500);
};

// patient live search
fetch(`/patient/search`)
  .then(response => response.json())
  .then(patients => {
    const data = patients; 
    //console.log(data)

    const rdata = JSON.parse(data.replace(/&quot;/g, '"'));
    //console.log(rdata)
    const input = document.getElementById('search_here');
    //console.log(input)

    let filteredArr = [];

    input.addEventListener('keyup', (e) => {
      box.innerHTML = ""
      filteredArr = rdata.filter(info => ''.concat(info['first_name'], info['last_name']).toLowerCase().includes(e.target.value.toLowerCase()))
      console.log(`Filtered array: `, filteredArr)
      if (filteredArr.length > 0) {
        filteredArr.map(item => {
          box.innerHTML += `<a id="patient-link" class="btn btn-outline-dark text-start"  data-bs-toggle="collapse" data-bs-target="#collapsePatientTable"
                    data-bs-parent="#content-div" onclick="return patient(${item.id})">
                        <b>${item['first_name']} ${item['last_name']}</b>
                    </a>`
        })
      } else {
        box.innerHTML = `<b>No results found...</b>`
      }
    });
  });



//staff live Search
fetch(`/staff/search`)
  .then(response => response.json())
  .then(staff => {
    const data_staff = staff;
    //console.log(data_staff)
    const rdata_staff = JSON.parse(data_staff.replace(/&quot;/g, '"'));
    //console.log(rdata_staff)
      
    const input_staff = document.getElementById('search_here_staff');
    //console.log(input_staff)

    let filteredArr_s = [];

    input_staff.addEventListener('keyup', (e_s) => {
      box_staff.innerHTML = ""
      filteredArr_s = rdata_staff.filter(info_s => ''.concat(info_s['name__first_name'], info_s['name__last_name']).toLowerCase().includes(e_s.target.value.toLowerCase()))
      //console.log(`Filtered array staff: `, filteredArr_s)
      if (filteredArr_s.length > 0) {
        filteredArr_s.map(item_s => {
          box_staff.innerHTML += `<a id="staff-link" class="btn btn-outline-dark text-start" data-bs-toggle="collapse" data-bs-target="#collapseStaffTable"
                data-bs-parent="#content-div" onclick="return staff(${item_s.id})" >
                      <b>${item_s['name__first_name']} ${item_s['name__last_name']}</b>
                  </a>`
        })
      } else {
        box_staff.innerHTML = `<b>No results found...</b>`
      }
    });
  });