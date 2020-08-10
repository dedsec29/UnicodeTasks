const express = require('express');
const app = express();
const bodyParser= require('body-parser');
const path = require('path');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); //attaching body parser to all points

app.set('views', path.join(__dirname, 'views'));  //view folder
app.set('view engine', 'ejs');  //this sets the view engine as ejs

var listStudents=[]; // {name: , englishMarks: , mathMarks: }

function comp(x,y) {
	return (y.englishMarks+y.mathMarks)/2 - (x.englishMarks+x.mathMarks)/2;
}

app.get('/', (req,res,next)=> {
	res.render('index');
});

app.get('/all', (req,res,next)=> {
	listStudents.sort(comp);
	res.render('students', {student: listStudents});
});

app.post('/submit', (req,res,next)=> {
	let mathMarks = req.body.maths;
	let englishMarks = req.body.english;
	let sName = req.body.name;
	listStudents.push({name: sName, englishMarks:englishMarks, mathMarks:mathMarks});
	res.redirect('/all');
});

const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`Listening on port ${port}`));


