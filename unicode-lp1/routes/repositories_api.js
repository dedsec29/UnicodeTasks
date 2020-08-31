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
    const repo=db.collection('repositories'); //collection name
    const fields = ["repository_name", "userID", "description", "access", "creation_date", "last_updated",
                    "numVisits", "numForks", "numStars"];
    
    router.get('/', (req, res)=> {
        res.send('Repositories Home');
    });

    //creating a new rep
    router.post('/create', (req, res)=> {
        req.body = JSON.parse(JSON.stringify(req.body));
        let obj = {};
        for (let col of fields) 
            obj[col] = req.body[col];
        repo.insertOne(obj)
        .then(()=> res.send('Repository created'))
        .catch(err=> console.log(err));
    });

    //get a list of all repositories and corresponding details
    router.get('/all', (req, res)=> {
        repo.find({}, {_id:0}).toArray()    //ignoring id field
        .then(( results=> res.send(results)))
        .catch(err=> console.log(err));
    });

    //delete a repository (userID and repository_name will together uniquely identify a repository)
    router.delete('/del/:userID/:repName', (req, res)=> {
        let userID = req.params.userID;
        let repName = req.params.repName;
        repo.deleteOne({userID:userID, repository_name:repName})
        .then(()=> res.send('Deleted'))
        .catch(err=> console.log(err));
    });

    //update details of a repository
    router.put('/update/:userID/:repName', (req, res)=> {
        let userID = req.params.userID;
        let repName = req.params.repName;

        req.body = JSON.parse(JSON.stringify(req.body));
        let obj = {};
        for (let x in req.body) { 
            if (x) obj[x] = req.body[x];  //just confirming x is not null or undefined
        }
        repo.updateOne({userID:userID, repository_name:repName}, {$set: obj})
        .then(()=> res.send('Details updated'))  //not logging on console so that I could see this on Postman. (or else it keeps waiting for a response)
        .catch((err)=> console.log(err));
    });

})
.catch( err => console.log(err));

module.exports = router;