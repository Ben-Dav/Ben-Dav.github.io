const events = [];

function updateLocationOptions(){
    const modality = document.getElementById('event_modality').value;
    document.getElementById('location_group').classList.add("d-none");
    document.getElementById('remote_url_group').classList.add("d-none");
    document.getElementById('attendees_group').classList.add("d-none");
    document.getElementById('event_location').required = false;
    document.getElementById('event_remote_url').required = false;
    document.getElementById('event_attendees').required = false;
    if(modality == "in_person"){
        document.getElementById('location_group').classList.remove("d-none");
        document.getElementById('attendees_group').classList.remove("d-none");
        document.getElementById('event_location').required = true;
        document.getElementById('event_attendees').required = true;
    }
    else if(modality == "remote"){
        document.getElementById('remote_url_group').classList.remove("d-none");
        document.getElementById('attendees_group').classList.remove("d-none");
        document.getElementById('event_remote_url').required = true;
        document.getElementById('event_attendees').required = true;
    }
    console.log("Modality changed" + modality);
}

function saveEvent(){
    const form = document.getElementById("event_form");

    if(!form.checkValidity()){
        form.classList.add("was-validated");
        return;
    }
    const eventDetails = {
        name: document.getElementById("event_name").value,
        category: document.getElementById("event_category").value,
        weekday: document.getElementById("event_weekday").value,
        time: document.getElementById("event_time").value,
        modality: document.getElementById("event_modality").value,
        location: document.getElementById("event_location").value,
        remote_url: document.getElementById("event_remote_url").value,
        attendees: document.getElementById("event_attendees").value.split(",").map(attendee => attendee.trim())
    };
    events.push(eventDetails);
    console.log(events);
    form.reset();
    form.classList.remove("was-validated");
    document.getElementById('location_group').classList.add("d-none");
    document.getElementById('remote_url_group').classList.add("d-none");
    document.getElementById('attendees_group').classList.add("d-none");
    addEventToCalanderUi(eventDetails);

    const myModalElement = document.getElementById('event_modal');
    const myModal = bootstrap.Modal.getOrCreateInstance(myModalElement);
    myModal.hide();
}

function addEventToCalanderUi(eventInfo){
    let event_card = createEventCard(eventInfo);
    const weekday = document.getElementById(eventInfo.weekday.toLowerCase());
    weekday.appendChild(event_card);
}

function createEventCard(eventDetails){
    let event_element = document.createElement('div');
    event_element.classList = 'event row border rounded m-1 py-1 ' + eventDetails.category.toLowerCase();
    event_element.onclick = calandarClick;
    event_element.id = events.length; // set id to position in elements array
    let info = document.createElement('div');
    info.innerHTML = `<b>Event Name:</b><br>${eventDetails.name}<br><b>Event Time:</b><br>${eventDetails.time}<br><b>Event Modality:</b><br>${eventDetails.modality}<br>`;
    if(eventDetails.modality == 'remote'){
        info.innerHTML += `<b>Event Remote URL:</b><br>${eventDetails.remote_url}<br>`;
    }
    else if(eventDetails.modality == 'in_person'){
        info.innerHTML += `<b>Event Location:</b><br>${eventDetails.location}<br>`;
    }
    info.innerHTML += `<b>Attendees:</b><br>${eventDetails.attendees}`;
    event_element.appendChild(info);
    console.log(info.getElementsByTagName('b')[1].innerText);
    return event_element;
}

function calandarClick(){
    console.info("Calander Clicked");
    const entryNum = this.id;
    const eventInfo = events[entryNum-1];
    events.splice(entryNum-1, 1);
    console.log(entryNum);
    console.log(eventInfo);
    var modal = new bootstrap.Modal(document.getElementById('event_modal'));
    modal.show();
    document.getElementById("event_name").value = eventInfo.name;
    document.getElementById("event_category").value = eventInfo.category;
    document.getElementById("event_weekday").value = eventInfo.weekday;
    document.getElementById("event_time").value = eventInfo.time;
    document.getElementById("event_modality").value = eventInfo.modality;
    updateLocationOptions();
    document.getElementById("event_location").value = eventInfo.location;
    document.getElementById("event_remote_url").value = eventInfo.remote_url;
    document.getElementById("event_attendees").value = eventInfo.attendees;
    this.remove();
}