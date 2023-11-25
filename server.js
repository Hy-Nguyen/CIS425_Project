const {MongoClient} = require('mongodb');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

const fileExtenions = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.jpeg': 'text/jpeg',
    '.jpg': 'text/kpeg',
    '.png': 'text/png'
};

/**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
     */
const uri = "mongodb+srv://root:4143WMaryland.@metapc.0nhcxzq.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: false});
// console.log(client);


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Serve static files from public folder
app.use(express.static("public"));

// Route Handlers
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/account', (req, res) => {
    res.sendFile(path.join(__dirname, 'account.html'));
});
app.get('/cart', (req, res) => {
    res.sendFile(path.join(__dirname, 'cart.html'));
});
app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'contact.html'));
});
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});
app.get('/products', (req, res) => {
    res.sendFile(path.join(__dirname, 'products.html'));
});

const database = 'MetaPC';
const contact_name = 'contact_form';
// Start the Express server
client.connect()
  .then(() => {
    const db = client.db(database);
    contact_collection = db.collection(contact_name);
    app.listen(8000, () => {
      console.log(`The web server is alive! \nListening on http://localhost:8000`);
    });
  })
  .catch((err) => {
    console.error(err);
  });

// Contact Form POST request
app.post('/contact', async (req, res) => {
    const {name, email, budget, message } = req.body;
    try{
        await contact_collection.insertOne(req.body);
        res.json({success:true})
        console.log(req.body)
    } catch(err) {
        console.error(err);
        res.json({ success: false });  
    }
});