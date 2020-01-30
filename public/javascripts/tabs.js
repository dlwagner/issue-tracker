// default to Issues tab on page load and refresh
$(function () {
    $('#btTabs a[href="#issues"]').tab('show')
})

//////////////  Filepond   ///////////////////////////
// get a reference to the input element
const inputElement = document.querySelector('input[id="filepond"]');

// create a FilePond instance at the input element location
const pond = FilePond.create(inputElement);

function newProjectAlert() {
    alert("New project created");
}

function deleteProjectAlert() {
    alert("Project deleted");
}

function newMilestoneAlert() {
    alert("New milestone created");
}

function deleteMilestoneAlert() {
    alert("Milestone deleted");
}
