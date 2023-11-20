const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');
const mysql = require('mysql');
const qs = require('querystring');
const {errorMonitor} = require('stream');

const fileExtenions = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.jpeg': 'text/jpeg',
    '.jpg': 'text/kpeg',
    '.png': 'text/png'
};

// // Replace Below Parameters with Your Own
// const con = mysql.createConnection({
//     host: 'localhost', // 'sql.wpc-is.online'
//     user: "root", // 'root'
//     password: '4143WMaryland.', //"hgng5048",
//     database: "Project"
// });

const con = mysql.createConnection({
    host: 'sql.wpc-is.online',
    user: "hgnguye3", 
    password: "hgng5048",
    database: "test"
});

con.connect();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Serve static files from public folder
app.use(express.static("public"));

// Define a route handler for the root URL
app.get('/', (req, res) => {
    // Use path.join to construct the path to the index.html file
    const indexPath = path.join(__dirname, 'index.html');

    //  Send the index.html file
    res.sendFile(indexPath);
});

app.post('/contact', (req, res) => {
    const {name, email, budget, message} = req.body;

    // print request body for debugging
    console.log('Requestion Body: ',  req.body);

    // insert data into My Sql Table
    con.query(
        // 'INSERT INTO tableName (name, email, budget, message) VALUES (?, ?, ?, ?)',
        'INSERT INTO contact_form (name, email, budget, message) \
        VALUES (?, ?, ?, ?)',

        [name, email, budget, message],
        (error, results) => {
            if (error) {
                console.log('error inserting data: ', error);
                res.status(300).json({error: 'Database error: ', details: error.message});

            } 
            res.redirect('/index.html');        
        }
    )
});  // action

// Start the Express server
const port = 8000;
app.listen(port, () => {
    console.log(`The web server is alive! \nListening on http://localhost:${port}`);

});