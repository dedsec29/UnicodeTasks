const express = require('express');
const app = express();

//initialising routes
app.use('/api/repositories', require('./routes/repositories_api'));
app.use('/api/users', require('./routes/users_api'));

const port = process.env.PORT || 3000;	
app.listen(port, ()=> console.log(`Listening on port ${port}`));