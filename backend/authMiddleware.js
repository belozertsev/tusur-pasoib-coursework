const sqlite3 = require('sqlite3')
const sqlite = require('sqlite')
const open = sqlite.open
const { checkToken } = require('./functions')


module.exports = async (req, res, next) => {
	/*
		Checks if user exists and token is valid
		If so - passes control to apiController, otherwise - stops processing the request
		
		Returns JS-object:
			{
				status: boolean,
				message: string
			}
	*/

	const db = await open({
		filename: 'database.sqlite',
		driver: sqlite3.Database
	})

	const candidate = await db.get('SELECT * FROM users WHERE username = ?', req.headers.authorization_username)

	if (!candidate)
		return res.json({ status: false, message: "Not authorized - we dont have such a user" })

	if (checkToken(req.headers.authorization_token, req.headers.authorization_username, candidate.password))
		return next()

	return res.json({ status: false, message: "Not authorized - token is invalid" })
}
