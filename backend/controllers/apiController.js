// Dependencies
const express = require('express')
const { getPosts, createPost, changePost, deletePost, checkRight, getUserbyPostId, getSettings, updateSettings, addSetting, getFriends } = require('../functions')


// Main object and its configuration
const router = express.Router()

router.post('/posts/:username', async (req, res) => {
	const targetUser = req.params.username
	const username = req.headers.authorization_username

	const post = {
		username: targetUser,
		creator: username,
		header: req.body.header || 'Default header',
		text: req.body.text || 'Default text'
	}

	if (await checkRight(username, targetUser, 'post_right'))
		return res.json(await createPost(post))

	return res.json({ status: false, message: 'You dont have rights to create posts on page of this user' })
})

router.get('/posts/:username', async (req, res) => {
	const targetUser = req.params.username
	const username = req.headers.authorization_username

	if (await checkRight(username, targetUser, 'get_right'))
		return res.json(await getPosts(targetUser))

	return res.json({ status: false, message: 'You dont have rights to view posts of this user' })
})

router.put('/posts/:id', async (req, res) => {
	const postId = req.params.id
	const username = req.headers.authorization_username
	const targetUser = await getUserbyPostId(postId)

	if (await checkRight(username, targetUser, 'put_right'))
		return res.json(await changePost({
			rowid: postId,
			username: targetUser,
			creator: username,
			header: req.body.header,
			text: req.body.text
		}))

	return res.json({ status: false, message: 'You dont have rights to edit posts of this user' })
})

router.delete('/posts/:id', async (req, res) => {
	const postId = req.params.id
	const username = req.headers.authorization_username
	const targetUser = await getUserbyPostId(postId)

	if (await checkRight(username, targetUser, 'delete_right'))
		return res.json(await deletePost(postId))

	return res.json({ status: false, message: 'You dont have rights to delete posts of this user' })
})


router.post('/settings/add', async (req, res) => {
	if (!req.body.row)
		return res.json({ status: false, message: 'Body must contain row field' })

	return res.json(await addSetting(req.headers.authorization_username, req.body.row))
})

router.get('/settings', async (req, res) => {
	return res.json({
		status: true,
		message: 'You can get settings array by the key "settings"',
		settings: await getSettings(req.headers.authorization_username)
	})
})

router.post('/settings', async (req, res) => {
	/*
		Settings array from frontend:
		[
			{
				applicant: bob,
				get_right: TRUE/FALSE,
				...
				delete_right: TRUE/FALSE
			}
		]
	*/

	if (!req.body.settings)
		return res.json({ status: false, message: 'Body must contain settings array' })

	return res.json(await updateSettings(req.headers.authorization_username, req.body.settings))
})

router.post('/settings/check', async (req, res) => {
	const username = req.headers.authorization_username
	const postId = req.body.postId
	const rightType = req.body.rightType

	const targetUser = await getUserbyPostId(postId)

	if (await checkRight(username, targetUser, rightType))
		return res.json({
			status: true,
			message: `You have required permission: ${rightType}`
		})

	return res.json({ status: false, message: 'You dont have rights to edit posts of this user' })
})


router.get('/friends', async (req, res) => {
	const targetUser = req.headers.authorization_username

	return res.json(await getFriends(targetUser))
	// return res.json({ status: false, message: 'There are no users who allowed you to CRUD their posts' })
})


module.exports = router
