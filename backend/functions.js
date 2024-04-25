const sqlite3 = require('sqlite3')
const sqlite = require('sqlite')
const open = sqlite.open


// Functions for accountController
const register = async (username, password) => {
	/*
		Checks if the user already exists and creates a new one if it does not
		
		Returns JS-object:
			{
				status: boolean,
				message: string
			}
	*/

	const db = await open({ filename: 'database.sqlite', driver: sqlite3.Database })

	if (await db.get('SELECT rowid FROM users WHERE username = ?', username)) {
		return { status: false, message: 'We already have such a user' }
	}

	const result = await db.run('INSERT INTO users (username, password) VALUES (?, ?)',
		username,
		password
	)

	if (result.lastID)
		return { status: true, message: 'We have created a new user' }

	return { status: false, message: 'We could not create a new user' }
}

const login = async (username, password) => {
	/*
		Checks if the user exists and verifies his credentials
		
		Returns JS-object:
			{
				status: boolean,
				message: string
			}
	*/

	const db = await open({ filename: 'database.sqlite', driver: sqlite3.Database })

	const user = await db.get('SELECT * FROM users WHERE username = ?', username)

	if (!user)
		return { status: false, message: 'We dont have such a user' }

	if (password === user.password)
		return { status: true, message: 'We have checked everything - the user exists and the password is correct' }

	return { status: false, message: 'We checked - the passwords do not match (you are liar)' }
}

const areCredentialsCorrect = (username, password) => {
	/*
		Verifies that username:
			- is longer than 2 characters
			- starts with a letter
			- does not cantain any forbidden characters (/\W/ - regexp for any char except letters and numbers)
		and password is longer than 4 characters
	*/

	return (username.length > 2 &&
		/[a-zA-Z]/.test(username[0]) &&
		!/\W/.test(username) &&
		password.length > 4)
}


// Functions for apiController
const createPost = async (post) => {
	const db = await open({ filename: 'database.sqlite', driver: sqlite3.Database })

	const result = await db.run('INSERT INTO posts (username, creator, header, text) VALUES (?, ?, ?, ?)',
		post.username,
		post.creator,
		post.header,
		post.text
	)

	if (result.changes)
		return { status: true, message: 'We just created the new post' }

	return { status: false, message: 'We could not create the new post' }
}

const getPosts = async (targetUser) => {
	const db = await open({ filename: 'database.sqlite', driver: sqlite3.Database })

	const result = await db.all('SELECT rowid, * FROM posts WHERE username = ?', targetUser)

	if (!!result.length) {
		return {
			status: true,
			message: 'We have found some posts - get them by the key "data" (array of JS objects)',
			data: result
		}
	}

	return { status: false, message: 'We could not find any post of this user' }
}

const changePost = async (newPost) => {
	const db = await open({ filename: 'database.sqlite', driver: sqlite3.Database })

	const oldPost = await db.get('SELECT * FROM posts WHERE rowid = ?', newPost.rowid)

	const result = await db.run(`UPDATE posts SET username = ?, creator = ?, header = ?, text = ? WHERE rowid = ${newPost.rowid}`,
		newPost.username,
		newPost.creator,
		newPost.header || oldPost.header,
		newPost.text || oldPost.text
	)

	if (result.changes)
		return { status: true, message: 'We just updated existing post' }

	return { status: false, message: 'We could not update this post' }
}

const deletePost = async (id) => {
	const db = await open({ filename: 'database.sqlite', driver: sqlite3.Database })

	const result = await db.run('DELETE FROM posts WHERE rowid = ?', id)

	if (result.changes)
		return { status: true, message: 'We just deleted post irrevocably' }

	return { status: false, message: 'We could not delete this post for some reason' }
}


const addSetting = async (username, row) => {
	const db = await open({ filename: 'database.sqlite', driver: sqlite3.Database })

	if (username != row.applicant) {
		await db.run('INSERT INTO rights (username, applicant, get_right, post_right, put_right, delete_right) VALUES (?, ?, ?, ?, ?, ?)',
			username,
			row.applicant,
			row.get_right,
			row.post_right,
			row.put_right,
			row.delete_right)

		return { status: true, message: `We have created new rule for ${username}` }
	}

	return { status: false, message: `We could not create such a rule for ${username}` }
}

const getSettings = async (username) => {
	const db = await open({ filename: 'database.sqlite', driver: sqlite3.Database })

	const rights = await db.all('SELECT * FROM rights WHERE username = ?', username)
	return rights
}

const updateSettings = async (username, settingsArray) => {
	const db = await open({ filename: 'database.sqlite', driver: sqlite3.Database })

	await db.run('DELETE FROM rights WHERE username = ?', username)

	settingsArray.forEach(async row => {
		if (username != row.applicant)
			await db.run('INSERT INTO rights (username, applicant, get_right, post_right, put_right, delete_right) VALUES (?, ?, ?, ?, ?, ?)',
				username,
				row.applicant,
				row.get_right,
				row.post_right,
				row.put_right,
				row.delete_right
			)
	})

	return { status: true, message: `We deleted all old records and created new ones for ${username}` }
}


const getFriends = async (targetUser) => {
	const db = await open({ filename: 'database.sqlite', driver: sqlite3.Database })

	// In this context, friends are not really friends,
	// but all those who set up some rights for our targetUser
	const friends = await db.all('SELECT username, "get_right", "post_right", "put_right", "delete_right" FROM rights WHERE applicant = ?', targetUser)

	if (!!friends.length) {
		return {
			status: true,
			message: 'We have found some friends - get them by the key "data" (array of JS objects)',
			data: friends
		}
	}

	return { status: false, message: 'We could not find any friends of this user' }
}


const checkRight = async (applicant, target, right_type) => {
	if (applicant == target)
		return true

	const db = await open({ filename: 'database.sqlite', driver: sqlite3.Database })

	const result = await db.get(`SELECT ${right_type} FROM rights WHERE username = ? AND applicant = ?`,
		target,
		applicant
	)

	if (!result)
		return false

	return !!result[right_type]
}

const getUserbyPostId = async (id) => {
	const db = await open({ filename: 'database.sqlite', driver: sqlite3.Database })
	
	const result = await db.get('SELECT username FROM posts WHERE rowid = ?', id)
	return result?.username
}


// these functions should use JWT or any other type of tokens
// but for simplification, the "child" generation of tokens is used
const generateToken = (username, password) => { return { token: username + '!' + password + '!secret' } }
const checkToken = (token, username, password) => username + '!' + password + '!secret' === token


module.exports = { getFriends, areCredentialsCorrect, register, login, generateToken, checkToken, getPosts, createPost, changePost, deletePost, getSettings, updateSettings, checkRight, getUserbyPostId, addSetting }
