const app = require('./app.js');

const port = process.env.PORT || 5000;

app.on('Mongoose ready', () => {
	app.listen(port, () => {
		console.log(`The server is accepting connections from port ${port}!\n`);
	});
});
