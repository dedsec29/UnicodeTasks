function subjectMarks() {
	this.Maths=null;
	this.English=null;
}

function student() {
	this.Name=null;
	this.Score=null;
}

function comp(x,y) {
	return (y.Score.English+y.Score.Maths)/2 - (x.Score.English+x.Score.Maths)/2;
}

function doWork(listOfStudents) { //first name, last name, marks in maths, marks in english
	var arr=[];
	var i;
	for (i of listOfStudents) {
		var r = i.split(' ');
		var person = new student();
		var marks = new subjectMarks();
		person.Name = r[0]+' '+r[1]; 
		marks.Maths = Number(r[2]);
		marks.English = Number(r[3]);
		person.Score = marks;
		arr.push(person);
	}
	arr.sort(comp);
	return arr;
}

var sampleInput = ['Rashmil Panchani 99 97', 'Parag Vaid 95 93', 'Siddharth Sanghavi 98 100'];
console.log(doWork(sampleInput));