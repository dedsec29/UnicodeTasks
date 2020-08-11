const express = require('express');
const app = express();
const bodyParser= require('body-parser');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;

app.use(bodyParser.urlencoded({ extended: false })); //The urlencoded method within body-parser tells body-parser to extract data from the <form> element and add them to the body property in the request object.
app.use(bodyParser.json()); //attaching body parser to all points

app.set('views', path.join(__dirname, 'views2'));  //views2 folder
app.set('view engine', 'ejs');  //this sets the view engine as ejs

function comp(x,y) {
	return (y.englishMarks+y.mathMarks)/2 - (x.englishMarks+x.mathMarks)/2;
}

const connectionString = 'mongodb+srv://Parth:tiger@cluster0.am17u.mongodb.net/Parth?retryWrites=true&w=majority';

MongoClient.connect(connectionString, {useUnifiedTopology: true})
.then( client=> {
	console.log('Connected to database!');
	const db=client.db('classroom'); //database name
	const classStudents=db.collection('class-students'); //collection name // {name: , englishMarks: , mathMarks: }

	app.get('/', (req,res,next)=> {
		res.render('index');
	});

	app.get('/all', (req,res,next)=> {
		classStudents.find().toArray()
		.then( results=> {
			results.sort(comp);
			res.render('students', {student: results});
		})
		.catch( err=> console.error(err));
	});

	app.post('/submit', (req,res,next)=> {
		let mathMarks = req.body.maths;
		let englishMarks = req.body.english;
		let fname = req.body.fname;
		let lname = req.body.lname;
		classStudents.insertOne({fname:fname, lname:lname, englishMarks:englishMarks, mathMarks:mathMarks})
		.then( ()=> res.redirect('/all'))
		.catch(error => console.error(error));
	});

})
.catch( err=> console.error(err));

const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`Listening on port ${port}`));


