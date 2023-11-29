const {MongoClient} = require('mongodb');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

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
app.get('/checkout', (req, res) => {
    res.sendFile(path.join(__dirname, 'checkout.html'));
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
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
});

const db = client.db('MetaPC');
const usersCollection = db.collection("users")
const contact_collection = db.collection('contact_form');
const order_collection = db.collection('orders');

// Start the Express server
client.connect()
  .then(() => {
    usersCollection.createIndex({ "email": 1 }, { unique: true })
      .then(() => {
        // console.log('Index created');
      })
      .catch((err) => {
        console.error('Error creating index:', err);
      });
      order_collection.createIndex({ "orderID": 1 }, { unique: true })
      .then(() => {
        // console.log('Index created');
      })
      .catch((err) => {
        console.error('Error creating index:', err);
      });

    app.listen(8000, () => {
      console.log(`The web server is alive! \nListening on http://localhost:8000/login.html`);
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
    } catch(err) {
        console.error(err);
        res.json({ success: false });  
    }
});

// Login Input Validation
app.post('/login', async (req, res) => {
    const {user_Email, user_Password} = req.body;

    try {
        // Find user in the MongoDB database

        const user = await usersCollection.findOne({email: req.body.email});

        if (!user) {
            return res.json({ success: false, message: 'UserNotFound' });
        } else {
            const passwordMatch = (req.body.password === user.password)
            // bcrypt is a library to hash and compare passwords
            if (!passwordMatch) {
                return res.json({ success:false, message: 'Invalid password' });
            }
        }
       
        return res.json({ success: true });
    } catch(err) {
        console.error(err);
        res.json({ success: false });  
    }
});

// Sign Up Processing
app.post('/signup', async (req, res) => {
    // collection = usersCollection
    const {firstName, lastName, email, address, password} = req.body;
    try {
        // Check if email already exists
        const user = await usersCollection.findOne({ email: email });
        if (user) {
            res.json({ success: false, message: 'Email already registered.'});
        }
        else {
            usersCollection.insertOne(req.body)
            res.json({ success: true, message: 'Account Created! Please Log In.'});
        }

    } catch (err) {
        res.json({ success: false, error: err.message });
    }
});

// Checkout Processing
app.post('/checkout', async (req, res) => {
    // collection = order_collection
    const {orderID, orderDate, orderStatus, fName, lName, email, address, payment, cart} = req.body;
    try {
        order_collection.insertOne(req.body)
        res.json({ success: true, message: 'Order Recieved!'});
    } catch (err) {
        res.json({ success: false, error: err.message });
    }
});

// Account Page Loading
app.post('/loadaccount', async (req, res) => {
    // collection = usersCollection
    // collection = order_collection
    const {email} = req.body;
    try {
        const user = await usersCollection.findOne({ email: email });
        const userInfo = {
            firstName: user.firstName, 
            lastName: user.lastName,
            address: user.address,
            orders: await order_collection.find({ email: email }).toArray()
        };
        console.log(userInfo);
        res.json({ success: true, message: '' , error: false, userInfo: userInfo});
    } catch (err) {
        res.json({ success: false, error: err.message });
    }
});