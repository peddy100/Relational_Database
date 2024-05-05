// Get the objects we need to modify
let addTermForm = document.getElementById('add-term-form-ajax');

// Modify the objects we need
addTermForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputIdTerm = document.getElementById("input-term");
    let inputDescription = document.getElementById("input-description");

    // Get the values from the form fields
    let idTermValue = inputIdTerm.value;
    let descriptionValue = inputDescription.value;


    // Put our data we want to send in a javascript object
    let data = {
        idTerm: idTermValue,
        description: descriptionValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-term-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputIdTerm.value = '';
            inputDescription.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// Terms
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("terms-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 2 cells
    let row = document.createElement("TR");
    let idTermCell = document.createElement("TD");
    let descriptionCell = document.createElement("TD");

    // Fill the cells with correct data
    idTermCell.innerText = newRow.idTerm;
    descriptionCell.innerText = newRow.description;

    // Add the cells to the row 
    row.appendChild(idTermCell);
    row.appendChild(descriptionCell);

    window.location.reload();
}
