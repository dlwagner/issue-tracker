/* eslint-disable func-names */
/* eslint-disable no-undef */
/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
// default to Issues tab on page load and refresh

// https://stackoverflow.com/questions/12131273/twitter-bootstrap-tabs-url-doesnt-change
// Add tab href to url.

$(function() {
  var hash = window.location.hash;
  // hash && $('ul.nav a[href="' + hash + '"]').tab('show');
  hash && $('ul.nav a[href="' + hash + '"]').tab('show');

  $('.nav-tabs a').click(function(e) {
    $(this).tab('show');
    var scrollmem = $('body').scrollTop() || $('html').scrollTop();
    window.location.hash = this.hash;
    $('html,body').scrollTop(scrollmem);
  });
});

$(function() {
  // eslint-disable-next-line no-undef
  $('#btTabs a[href="#issues"]').tab('show');
});

// New Issue Tab - Filepond
// get a reference to the input element
// eslint-disable-next-line no-undef
// const inputElement = document.querySelector('input[type="file"]');

// create a FilePond instance at the input element location

// const pond = FilePond.create(inputElement);

// Settings Tab
function newProjectAlert() {
  // eslint-disable-next-line no-undef
  alert('New project created');
}
function deleteProjectAlert() {
  // eslint-disable-next-line no-undef
  alert('Project deleted');
}
function newMilestoneAlert() {
  // eslint-disable-next-line no-undef
  alert('New milestone created');
}
function deleteMilestoneAlert() {
  // eslint-disable-next-line no-undef
  alert('Milestone deleted');
}
