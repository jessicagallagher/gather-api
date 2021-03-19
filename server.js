const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3003;

const dbname = 'events';

// middleware
app.use(express.json());

// error / disconnection
mongoose.connection.on('error', err => console.log(err.message + ' is Mongo not running?'));
mongoose.connection.on('disconnected', () => console.log('mongo disconnected'));

const MONGODB_URI = process.env.MONGODB_URI || `mongodb://localhost:27017/${dbname}`

// connect db
console.log(MONGODB_URI)
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
mongoose.connection.once('open', () => {
	console.log('connected to mongoose! ~~~')
});

// whitelist and cors
const whitelist = ['http://localhost:3000', 'https://mighty-savannah-40031.herokuapp.com/'];
const corsOptions = {
	origin: function(origin, callback) {
		if(whitelist.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			callback(new Error('not allowed by CORS'));
		}
	}
}

app.use(cors());

// controller
const eventsController = require('./controllers/event_controller.js');
app.use('/events', eventsController);
const cityController = require('./controllers/city_controller.js');
app.use('/cities', cityController);

// listener
app.listen(port, () => {
	console.log('listening on port ' + port)
})