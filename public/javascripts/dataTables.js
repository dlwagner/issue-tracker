/* eslint-disable func-names */
/* eslint-disable no-undef */
// DataTables formatting:
//   -Hide search|info|ordering|lengthchange
//   -Keep pagination
let table = '';
$(document).ready(function() {
  table = $('#issuesTable').DataTable({
    // "dom": '<"top"i>rt<"bottom"p><"clear">',
    // Center pagination below table. This combined with CSS styling.
    dom: 'rt<"bottom"p><"clear">',
    // hide table functions
    searching: false,
    info: false,
    ordering: false,
    bLengthChange: false,
  });
  // Set table length (numRows) to 15
  table.page.len(10).draw();
});
