const express = require('express');
const app = express();
const axios = require('axios');

var categories; //will be assigned a list of categories

const url = 'https://sv443.net/jokeapi/v2/'

async function getAllCategories() {
	try {
		return await axios.get(url+'categories');
	}
	catch (error) {
		console.error(error);
	}
}

async function getJokeData(category) {	
	try {
		return await axios.get(url+'joke/'+category); 
	}
	catch {
		console.log('invalid category');
	}
}

async function jokeInfo(category) {		//to fetch joke's detail
	try {
		let response = await getJokeData(category);
		let data=response.data;
		let joke;
		let type = data.type;
		if (type=='single')
			joke = data.joke;
		else
			joke = data.setup+' '+data.delivery;
		let obj = {category:data.category, id:data.id, joke:joke};
		return obj;
	}
	catch {
		console.log('Could not get info');
	}
}

app.get('/:category', async(req,res) => {
	try {
		let response = await jokeInfo(req.params.category);
		let obj = {joke: response.joke};
		res.send(obj); //is json 
	}
	catch (error) {
		console.error(error);
	}
});

app.get('/', (req,res) => {
	res.send('End points created for all categories');
})

const port = 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));

async function main() {
	categories = await getAllCategories();
	categories = categories.data.categories;

	console.log(await jokeInfo(categories[0])); //pass category of joke of which you want the deails
}

main();