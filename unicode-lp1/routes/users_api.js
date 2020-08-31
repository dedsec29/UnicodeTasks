const express = require('express');
const bodyParser= require('body-parser');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const connectionString = 'mongodb+srv://Parth:tiger@cluster0.5b4sy.mongodb.net/Parth?retryWrites=true&w=majority';
MongoClient.connect(connectionString, {useUnifiedTopology: true})
.then( client=> {
    console.log('Connected to database!');
    const db=client.db('github-clone'); //database name
    const repo=db.collection('users'); //collection name
    const fields=["userID", "name", "email", "password", "status"];
    
    router.get('/', (req, res)=> {
        res.send('Users Home');
    });

    //creating a new user
    router.post('/create', (req, res)=> {
        req.body = JSON.parse(JSON.stringify(req.body));
        let obj = {};
        for (let col of fields) 
            obj[col] = req.body[col];
        repo.insertOne(obj)
        .then(()=> res.send('User created'))
        .catch(err=> console.log(err));
    });

    //getting list of all users and corresponding details
    router.get('/all', (req, res)=> {
        repo.find({}, {_id:0}).toArray()    //ignoring id field
        .then(( results=> res.send(results)))
        .catch(err=> console.log(err));
    });

    //delete user and all his repositories
    router.delete('/del/:userID', (req, res)=> {
        let userID = req.params.userID;
        repo.deleteOne({userID:userID})
        .then(()=> {
            db.collection('repositories').deleteMany({userID:userID})
            .then(()=> res.send('Deleted'))
            .catch((err)=> console.log(err));
        })
        .catch(err=> console.log(err));
    });

    //update user details
    router.put('/update/:userID', (req, res)=> {
        let userID = req.params.userID;
        req.body = JSON.parse(JSON.stringify(req.body));
        let obj = {};
        for (let x in req.body) {
            if (x) obj[x] = req.body[x];  //just confirming x is not null or undefined
        }
        repo.updateOne({userID:userID}, {$set: obj})
        .then(()=> res.send('Details updated'))
        .catch((err)=> console.log(err));
    });

})
.catch( err => console.log(err));

module.exports = router;