//Citation Scope:  Node.js and Handlebars code adapted from the starter code
//Date:  March 20, 2023
//Originality:  Adpated 
//Source:  https://github.com/osu-cs340-ecampus/nodejs-starter-app

// App.js

/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
PORT        = 38383;                 // Set a port number at the top so it's easy to change in the future
// Database
var db = require('./database/db-connector')
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

/*
    ROUTES
*/
app.get('/', function(req, res)
    {
        res.render('index');                    // Note the call to render() and not send(). Using render() ensures the templating engine
    });     

app.get('/customers', function(req, res)
    {  
        let query1;

        if (req.query.businessname == undefined)
        {
            query1 = "SELECT * FROM Customers;";
        }

        else
        {
            query1 = `SELECT * FROM Customers WHERE businessName LIKE "${req.query.businessname}%"`
        }

        db.pool.query(query1, function(error, rows, fields){    // Execute the query
            
            //Save the people
            let people = rows;

            return res.render('customers', {data: people});                  // Render the index.hbs file, and also send the renderer
        })                                                      // an object where 'data' is equal to the 'rows' we
    });                                                         // received back from the query

app.get('/salesreps', function(req, res)
    {  
        let query1;

        if (req.query.firstname == undefined)
        {
            query1 = "SELECT * FROM SalesReps;";
        }

        else
        {
            query1 = `SELECT * FROM SalesReps WHERE firstName LIKE "${req.query.firstname}%"`
        }

        db.pool.query(query1, function(error, rows, fields){    // Execute the query
            
            //Save the people
            let people = rows;

            return res.render('salesreps', {data: people});                  // Render the index.hbs file, and also send the renderer
        })                                                      // an object where 'data' is equal to the 'rows' we
    });                                                         // received back from the query  

app.get('/products', function(req, res)
    {  
        let query1;

        if (req.query.productname == undefined)
        {
            query1 = "SELECT * FROM Products;";
        }

        else
        {
            query1 = `SELECT * FROM Products WHERE productName LIKE "${req.query.productname}%"`
        }

        db.pool.query(query1, function(error, rows, fields){    // Execute the query
            
            //Save the people
            let products = rows;

            return res.render('products', {data: products});                  // Render the index.hbs file, and also send the renderer
        })                                                      // an object where 'data' is equal to the 'rows' we
    });                                                         // received back from the query  

app.get('/terms', function(req, res)
    {
        let query1 = "SELECT * FROM Terms;";

        db.pool.query(query1, function(error, rows, fields){
            
        return res.render('terms', {data:rows});
        })
    });   


app.get('/salesinvoices', function(req, res)
    {
        let query1 = "SELECT * FROM SalesInvoices";

        let query2 = "SELECT * FROM Customers";

        let query3 = "SELECT * FROM Terms";

        let query4 = "SELECT * FROM SalesReps"

        db.pool.query(query1, function(error, rows, fields){
            
            let salesinvoices = rows;

            db.pool.query(query2, (error, rows, fields) => {

                let customers = rows;
                
                db.pool.query(query3, (error, rows, fields) => {
                    
                    let terms = rows;

                    db.pool.query(query4, (error, rows, fields) => {

                        let salesreps = rows;
                        return res.render('salesinvoices', {data: salesinvoices, customers: customers, terms: terms, salesreps: salesreps});
                    })
                })
            })

        })
    });

app.get('/salesdetails', function(req, res)
    {
        let query1 = "SELECT * FROM SalesInvoicesHasProducts";

        let query2 = "SELECT * FROM Products"

        db.pool.query(query1, function(error, rows, fields){
            
            let salesdetails = rows;

            db.pool.query(query2, (error, rows, fields) => {

                let products = rows;
                return res.render('salesdetails', {data: salesdetails, products: products});
            })
        })
    });

app.post('/add-customer-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    
    // Capture NULL values
    let address2 = data['input-address2'];
    if (address2 === "")
    {
        address2 = 'NULL'
    }
    
    // Create the query and run it on the database
    query1 = `INSERT INTO Customers (businessName, firstName, lastName, address1, address2, city, state, zipCode, email, phone) VALUES ('${data['input-businessname']}', '${data['input-firstname']}', '${data['input-lastname']}', '${data['input-address1']}', ${address2}, '${data['input-city']}', '${data['input-state']}', '${data['input-zipcode']}', '${data['input-email']}', '${data['input-phone']}')`;
    db.pool.query(query1, function(error, rows, fields){
    
        // Check to see if there was an error
        if (error) {
    
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            res.redirect('customers')
        }          
    })
}); 

app.post('/add-salesrep-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    
    // Create the query and run it on the database
    query1 = `INSERT INTO SalesReps (firstName, lastName, title) VALUES ('${data['input-firstname']}', '${data['input-lastname']}', '${data['input-title']}')`;
    db.pool.query(query1, function(error, rows, fields){
    
        // Check to see if there was an error
        if (error) {
    
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            res.redirect('salesreps')
        }          
    })
});

app.post('/add-product-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    
    // Create the query and run it on the database
    query1 = `INSERT INTO Products (productName, productPrice) VALUES ('${data['input-productname']}', '${data['input-productprice']}')`;
    db.pool.query(query1, function(error, rows, fields){
    
        // Check to see if there was an error
        if (error) {
    
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            res.redirect('products')
        }          
    })
}); 

app.post('/add-term-ajax', function(req, res) 
    {
        // Capture the incoming data and parse it back to a JS object
        let data = req.body;
    
        // Create the query and run it on the database
        query1 = `INSERT INTO Terms (idTerm, description) VALUES ('${data.idTerm}', '${data.description}')`;
        db.pool.query(query1, function(error, rows, fields){
    
            // Check to see if there was an error
            if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error)
                res.sendStatus(400);
            }
            else
            {
                // If there was no error, perform a SELECT * on Terms
                query2 = `SELECT * FROM Terms;`;
                db.pool.query(query2, function(error, rows, fields){
    
                    // If there was an error on the second query, send a 400
                    if (error) {
                        
                        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                        console.log(error);
                        res.sendStatus(400);
                    }
                    // If all went well, send the results of the query back.
                    else
                    {
                        res.send(rows);
                    }
                })
            }
        })
    });

app.post('/add-salesinvoice-ajax', function(req, res) 
    {
        // Capture the incoming data and parse it back to a JS object
        let data = req.body;

        // Capture NULL values
        let idSalesRep = parseInt(data.idSalesRep);
        if (isNaN(idSalesRep))
        {
            idSalesRep = 'NULL'
        }

        // Create the query and run it on the database
        query1 = `INSERT INTO SalesInvoices (date, totalDue, idCustomer, idTerm, idSalesRep) VALUES 
        ('${data.date}', '${data.totalDue}', '${data.idCustomer}', '${data.idTerm}', ${idSalesRep})`;
        db.pool.query(query1, function(error, rows, fields){
    
            // Check to see if there was an error
            if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error)
                res.sendStatus(400);
            }
            else
            {
                // If there was no error, perform a SELECT * on Terms
                query2 = `SELECT * FROM SalesInvoices;`;
                db.pool.query(query2, function(error, rows, fields){
    
                    // If there was an error on the second query, send a 400
                    if (error) {
                        
                        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                        console.log(error);
                        res.sendStatus(400);
                    }
                    // If all went well, send the results of the query back.
                    else
                    {
                        res.send(rows);
                    }
                })
            }
        })
    });

app.post('/add-salesdetail-ajax', function(req, res) 
    {
        // Capture the incoming data and parse it back to a JS object
        let data = req.body;
    
        // Create the query and run it on the database
        query1 = `INSERT INTO SalesInvoicesHasProducts (idSalesInvoice, idProduct) VALUES ('${data.idSalesInvoice}', '${data.idProduct}')`;
        db.pool.query(query1, function(error, rows, fields){
    
            // Check to see if there was an error
            if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error)
                res.sendStatus(400);
            }
            else
            {
                // If there was no error, perform a SELECT * on Terms
                query2 = `SELECT * FROM SalesInvoicesHasProducts;`;
                db.pool.query(query2, function(error, rows, fields){
    
                    // If there was an error on the second query, send a 400
                    if (error) {
                        
                        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                        console.log(error);
                        res.sendStatus(400);
                    }
                    // If all went well, send the results of the query back.
                    else
                    {
                        res.send(rows);
                    }
                })
            }
        })
    });

app.delete('/delete-customer/', function(req,res,next){
    let data = req.body;
    let customerID = parseInt(data.idCustomer);
    let deleteSalesInvoices = `DELETE FROM SalesInvoices WHERE idCustomer = ?`;
    let deleteCustomers= `DELETE FROM Customers WHERE idCustomer = ?`;
  
  
          // Run the 1st query
          db.pool.query(deleteSalesInvoices, [customerID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                  // Run the second query
                  db.pool.query(deleteCustomers, [customerID], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.sendStatus(204);
                      }
                  })
              }
  })});

app.delete('/delete-salesrep/', function(req,res,next){
    let data = req.body;
    let salesRepID = parseInt(data.idSalesRep);
    let deleteSalesInvoices = `DELETE FROM SalesInvoices WHERE idSalesRep = ?`;
    let deleteSalesReps= `DELETE FROM SalesReps WHERE idSalesRep = ?`;
  
  
          // Run the 1st query
          db.pool.query(deleteSalesInvoices, [salesRepID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                  // Run the second query
                  db.pool.query(deleteSalesReps, [salesRepID], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.sendStatus(204);
                      }
                  })
              }
  })});

app.delete('/delete-product/', function(req,res,next){
    let data = req.body;
    let productID = parseInt(data.idProduct);
    let deleteSalesInvoicesHasProducts = `DELETE FROM SalesInvoicesHasProducts WHERE idProduct = ?`;
    let deleteProducts = `DELETE FROM Products WHERE idProduct = ?`;
  
  
          // Run the 1st query
          db.pool.query(deleteSalesInvoicesHasProducts, [productID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                  // Run the second query
                  db.pool.query(deleteProducts, [productID], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.sendStatus(204);
                      }
                  })
              }
  
          })
});

app.delete('/delete-salesdetail-ajax/', function(req,res,next){
    let data = req.body;
    let salesDetailID = parseInt(data.idSalesDetails);
    let deleteSalesDetails= `DELETE FROM SalesInvoicesHasProducts WHERE idSalesDetails = ?`;
  
  
          // Run the 1st query
          db.pool.query(deleteSalesDetails, [salesDetailID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              console.log(salesDetailID);
              res.sendStatus(400);
              }

              else{
                res.sendStatus(204);
              }            
  })});

  app.delete('/delete-salesinvoice-ajax/', function(req,res,next){
    let data = req.body;
    let salesInvoiceID = parseInt(data.idSalesInvoice);
    let deleteSalesInvoice= `DELETE FROM SalesInvoices WHERE idSalesInvoice = ?`;
  
  
          // Run the 1st query
          db.pool.query(deleteSalesInvoice, [salesInvoiceID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              console.log(salesInvoiceID);
              res.sendStatus(400);
              }

              else{
                res.sendStatus(204);
              }            
  })});


app.put('/put-salesdetails-ajax', function(req,res,next){
    let data = req.body;
  
    let product = parseInt(data.idProduct);
    let salesinvoice = parseInt(data.idSalesDetails);
  
    let queryUpdateProduct = `UPDATE SalesInvoicesHasProducts SET idProduct = ? WHERE SalesInvoicesHasProducts.idSalesDetails = ?`;
    let selectProduct = `SELECT * FROM Products WHERE idProduct = ?`
  
          // Run the 1st query
          db.pool.query(queryUpdateProduct, [product, salesinvoice], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              // If there was no error, we run our second query and return that data so we can use it to update the people's
              // table on the front-end
              else
              {
                  // Run the second query
                  db.pool.query(selectProduct, [product], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.send(rows);
                      }
                  })
              }
  })
});


app.put('/put-salesinvoices-ajax', function(req,res,next){
    let data = req.body;
  
    let salesrep = parseInt(data.idSalesRep);
    let salesinvoice = parseInt(data.idSalesInvoice);
  
    // Capture NULL values
    if (isNaN(salesrep))
    {
        salesrep = 'NULL'
    }


    let queryUpdateSalesRep = `UPDATE SalesInvoices SET idSalesRep = ${salesrep} WHERE SalesInvoices.idSalesInvoice = ${salesinvoice}`;
    let selectSalesRep = `SELECT * FROM SalesReps WHERE idSalesRep = ?`
  
          // Run the 1st query
          db.pool.query(queryUpdateSalesRep, function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              // If there was no error, we run our second query and return that data so we can use it to update the people's
              // table on the front-end
              else
              {
                  // Run the second query
                  db.pool.query(selectSalesRep, [salesrep], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.send(rows);
                      }
                  })
              }
  })}); 

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
