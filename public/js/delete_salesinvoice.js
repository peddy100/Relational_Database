function deleteSalesInvoice(salesInvoiceID) {
    // Put our data we want to send in a javascript object
    let data = {
        idSalesInvoice: salesInvoiceID
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-salesinvoice-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table
            deleteRow(salesInvoiceID);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    console.log(data)
    xhttp.send(JSON.stringify(data));
    window.location.reload();
}


function deleteRow(salesInvoiceID){

    let table = document.getElementById("salesinvoices-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == salesInvoiceID) {
            table.deleteRow(i);
            break;
       }
    }
}