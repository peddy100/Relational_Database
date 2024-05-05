// Get the objects we need to modify
let addCustomerForm = document.getElementById('add-customer-form');

// Modify the objects we need
addCustomerForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();
    
    // Get form fields we need to get data from
    let inputBusinessName = document.getElementById("input-businessname");
    let inputFirstName = document.getElementById("input-firstname");
    let inputLastName = document.getElementById("input-lastname");
    let inputAddress1 = document.getElementById("input-address1");
    let inputAddress2 = document.getElementById("input-address2");
    let inputCity = document.getElementById("input-city");
    let inputState = document.getElementById("input-state");
    let inputZipCode = document.getElementById("input-zipcode");
    let inputEmail = document.getElementById("input-email");
    let inputPhone = document.getElementById("input-phone");

    // Get the values from the form fields
    let businessNameValue = inputBusinessName.value;    
    let firstNameValue = inputFirstName.value;
    let lastNameValue = inputLastName.value;
    let address1Value = inputAddress1.value;    
    let address2Value = inputAddress2.value;
    let cityValue = inputCity.value;
    let stateValue = inputState.value;
    let zipCodeValue = inputZipCode.value;
    let emailValue = inputEmail.value;
    let phoneValue = inputPhone.value;

    // Put our data we want to send in a javascript object
    let data = {
        businessName: businessNameValue,
        firstName: firstNameValue,
        lastName: lastNameValue,
        address1: address1Value,
        address2: address2Value,
        city: cityValue,
        state: stateValue,
        zipCode: zipCodeValue,
        email: emailValue,
        phone: phoneValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-customer-form", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputBusinessName.value = '';
            inputFirstName.value = '';
            inputLastName.value = '';
            inputAddress1.value = '';
            inputAddress2.value = '';
            inputCity.value = '';
            inputState.value = '';
            inputZipCode.value = '';
            inputEmail.value = '';
            inputPhone.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// bsg_people
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("customer-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCustomerCell = document.createElement("TD");
    let businessNameCell = document.createElement("TD");
    let firstNameCell = document.createElement("TD");
    let lastNameCell = document.createElement("TD");
    let address1Cell = document.createElement("TD");
    let address2Cell = document.createElement("TD");
    let cityCell = document.createElement("TD");
    let stateCell = document.createElement("TD");
    let zipCodeCell = document.createElement("TD");
    let emailCell = document.createElement("TD");        
    let phoneCell = document.createElement("TD");   

    // Fill the cells with correct data
    idCustomerCell.innerText = newRow.idCustomer;
    businessNameCell.innerText = newRow.businessName;
    firstNameCell.innerText = newRow.firstName;
    lastNameCell.innerText = newRow.lastName;
    address1Cell.innerText = newRow.address1;
    address2Cell.innerText = newRow.address2;
    cityCell.innerText = newRow.city;
    stateCell.innerText = newRow.state;
    zipCodeCell.innerText = newRow.zipCode;
    emailCell.innerText = newRow.email;
    phoneCell.innerText = newRow.phone;

    // Add the cells to the row 
    row.appendChild(idCustomerCell);
    row.appendChild(businessNameCell);
    row.appendChild(firstNameCell);
    row.appendChild(lastNameCell);
    row.appendChild(address1Cell);
    row.appendChild(address2Cell);
    row.appendChild(cityCell);
    row.appendChild(stateCell);
    row.appendChild(zipCodeCell);
    row.appendChild(emailCell);
    row.appendChild(phoneCell);
    
    // Add the row to the table
    currentTable.appendChild(row);
}