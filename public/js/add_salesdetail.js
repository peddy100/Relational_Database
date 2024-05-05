// Get the objects we need to modify
let addSalesDetailForm = document.getElementById('add-salesdetail-form-ajax');

// Modify the objects we need
addSalesDetailForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputIdSalesInvoice = document.getElementById("input-salesinvoice");
    let inputIdProduct = document.getElementById("input-product");

    // Get the values from the form fields
    let idSalesInvoiceValue = inputIdSalesInvoice.value;
    let idProductValue = inputIdProduct.value;


    // Put our data we want to send in a javascript object
    let data = {
        idSalesInvoice: idSalesInvoiceValue,
        idProduct: idProductValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-salesdetail-ajax", true);
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
    let currentTable = document.getElementById("salesdetail-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 2 cells
    let row = document.createElement("TR");
    let idSalesDetailsCell = document.createElement("TD");
    let idSalesInvoiceCell = document.createElement("TD");
    let idProductCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idSalesDetailsCell.innerText = newRow.idSalesDetails;
    idSalesInvoiceCell.innerText = newRow.idSalesInvoice;
    idProductCell.innerText = newRow.idProduct;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteSalesDetail(newRow.idSalesDetails);
    };
    // Add the cells to the row
    row.appendChild(idSalesDetailsCell); 
    row.appendChild(idSalesInvoiceCell);
    row.appendChild(idProductCell);
    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.idSalesDetails);

    // Add the row to the table
    currentTable.appendChild(row);

    let selectMenu = document.getElementById("mySelect");
    let option = document.createElement("option");
    option.text = newRow.idSalesDetails;
    option.value = newRow.idSalesDetails;
    selectMenu.add(option);

    window.location.reload();
}
