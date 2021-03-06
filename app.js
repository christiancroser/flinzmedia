require('dotenv').config();

const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();

const hostname = '127.0.0.1';
const port = 3001;

app.locals.pretty = true;
app.set('view engine', 'pug');
app.set('views', './views');


// Fundamental Middlewares
app.use(bodyParser.urlencoded({extended:true}));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));


// Routes
app.get('/', function (req, res) {
	res.locals.section = 'home';
	res.render('home');
});

app.get('/about', function (req, res) {
	res.locals.section = 'about';
	res.render('about');
});

app.get('/contact', function (req, res) {
	res.locals.section = 'contact';
	res.render('contact');
});

app.get('/portfolio', function (req, res) {
	res.locals.section = 'portfolio';
	res.render('portfolio');
});

app.post('/contact', function (req, res) {
	var data = req.body;
	if (!data.name || !data.email || !data.message) {
		return res.render('contact', {
			message: {
				type: 'error',
				text: 'Please fill out all the fields'
			}
		});
	}

	var transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.NODEMAILER_USER,
			pass: process.env.NODEMAILER_PASS
		},
		tls: {
			rejectUnauthorized: false
		}
	});

	var mailOptions = {
		from: req.body.name + ' <' + req.body.email + '>',
		to: process.env.NODEMAILER_RECIPIENT,
		subject: req.body.name + ' filled the form in flinzmedia.com',
		text: req.body.message
	};

	transporter.sendMail(mailOptions, function (err, info) {
		if (err) {
			res.render('contact', {
				message: {
					type: 'error',
					text: 'There was an error, message not sent'
				}
			});
		} else {
			res.render('contact', {
				message: {
					type: 'success',
					text: 'Your message was sent, I\'ll be in touch within 24 hours'
				}
			})			
		}
	});
});


// Server start
app.listen(port, hostname, function () {
	console.log(`App is listening on ${hostname}:${port}`);
});