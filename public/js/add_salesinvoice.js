// Get the objects we need to modify
let addSalesInvoiceForm = document.getElementById('add-salesinvoice-form-ajax');

// Modify the objects we need
addSalesInvoiceForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputdate = document.getElementById("input-date");
    let inputtotalDue = document.getElementById("input-totalDue");
    let inputidCustomer = document.getElementById("input-idCustomer");
    let inputidTerm = document.getElementById("input-idTerm");
    let inputidSalesRep = document.getElementById("input-idSalesRep");

    // Get the values from the form fields
    let dateValue = inputdate.value;
    let totalDueValue = inputtotalDue.value;
    let idCustomerValue = inputidCustomer.value;
    let idTermValue = inputidTerm.value;
    let idSalesRepValue = inputidSalesRep.value;

    // Put our data we want to send in a javascript object
    let data = {
        date: dateValue,
        totalDue: totalDueValue,
        idCustomer: idCustomerValue,
        idTerm: idTermValue,
        idSalesRep: idSalesRepValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-salesinvoice-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputdate.value = '';
            inputtotalDue.value = '';
            inputidCustomer.value = '';
            inputidTerm.value = '';
            inputidSalesRep.value = '';
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
    let currentTable = document.getElementById("salesinvoices-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 2 cells
    let row = document.createElement("TR");
    let idSalesInvoiceCell = document.createElement("TD");
    let dateCell = document.createElement("TD");
    let totalDueCell = document.createElement("TD");
    let idCustomerCell = document.createElement("TD");
    let idTermCell = document.createElement("TD");
    let idSalesRepCell = document.createElement("TD");

    // Fill the cells with correct data
    idSalesInvoiceCell.innerText = newRow.idSalesInvoice;
    dateCell.innerText = newRow.date;
    totalDueCell.innerText = newRow.totalDue;
    idCustomerCell.innerText = newRow.idCustomer;
    idTermCell.innerText = newRow.idTerm;
    idSalesRepCell.innerText = newRow.idSalesRep;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteSalesInvoice(newRow.idSalesInvoice);
    };

    // Add the cells to the row 
    row.appendChild(idSalesInvoiceCell);
    row.appendChild(dateCell);
    row.appendChild(idCustomerCell);
    row.appendChild(idTermCell);
    row.appendChild(idSalesRepCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.idSalesInvoice);

    // Add the row to the table
    currentTable.appendChild(row);
    
    // Find drop down menu, create a new option, fill data in the option (full name, id),
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    
    let selectMenu = document.getElementById("mySelect");
    let option = document.createElement("option");
    option.text = newRow.idSalesInvoice;
    option.value = newRow.idSalesInvoice;
    selectMenu.add(option);

    window.location.reload();
}
