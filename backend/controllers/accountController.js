// Dependencies
const express = require('express')
const {areCredentialsCorrect, register, login, generateToken} = require('../functions')

// Main object and its configuration
const router = express.Router()

router.post('/register', async (req, res) => {
	const { username, password } = req.body

	if (areCredentialsCorrect(username, password)) {
		let result = await register(username, password)

		if (result.status)
		return res.json({...result, ...generateToken(username, password)})
		
		return res.json(result)
	}

	return res.json({status: false, message: 'Your credentials dont meet the minimum security requirements'})
})

router.post('/login', async (req, res) => {
	const { username, password } = req.body
	
	if (areCredentialsCorrect(username, password)) {
		let result = await login(username, password)
		
		if (result.status)
		return res.json({...result, ...generateToken(username, password)})
		
		return res.json(result)
	}

	return res.json({status: false, message: 'Your credentials dont meet the minimum security requirements'})
})


// It should be possible for used to delete their account
// And was originally planned, but it was not implemented
router.post('/delete', async (req, res) => {
	return res.json({status: false, message: 'We dont have that functionality yet, sorry'})
})


module.exports = router
