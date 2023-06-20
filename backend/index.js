// Dependencies
const express = require('express')
const path = require('path')

const apiController = require('./controllers/apiController')
const accountController = require('./controllers/accountController')
const authMiddleware = require('./authMiddleware')


// Configuration constants
const PORT = process.env.PORT || 80


// Main object and its configuration
const app = express()

app.use(express.json())
app.use('/account', accountController)
app.use('/api', authMiddleware, apiController)

// for production
app.use('/', express.static(path.join(__dirname, '../frontend/build')))
app.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'))
})

// // for development
// app.get('/', async (req, res) => {
// 	res.sendFile(path.resolve(__dirname, '../frontend/public/index.html'))
// })


// Main function that runs the app
const start = () => {
	try {
		app.listen(PORT, () => console.log(' ~ App has been started'))
	} catch (error) {
		console.log(' ~ Error when starting app')
		process.exit(1)
	}
}
start()
