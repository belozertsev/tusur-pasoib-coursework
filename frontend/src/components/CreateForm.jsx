import React from 'react'
import { useParams } from "react-router-dom"

const CreateForm = () => {
	const username = localStorage.getItem('username')
	const token = localStorage.getItem('token')
	const { target } = useParams()
	const targetUser = target || username

	const createButtonHandler = async () => {
		const header = document.getElementById('header').value
		const text = document.getElementById('text').value

		if (header.lenght < 1 || text.length < 1) return alert('Header or text is too short or empty')

		const response = await (await fetch(`/api/posts/${targetUser}`, {
			method: 'POST',
			cache: 'no-cache',
			headers: {
				'Content-Type': 'application/json',
				'authorization_username': username,
				'authorization_token': token
			},
			body: JSON.stringify({
				header,
				text
			})
		})).json()

		alert(response.message)
		window.location.reload()

	}

	return (
		<form className='createForm__createForm'>
			<h1 className='createForm__header'>
				New post:
			</h1>
			<input
				className='createForm__input'
				type='text'
				name='header'
				id='header'
				placeholder='Header' />
			<input
				className='createForm__input'
				type='text'
				name='text'
				id='text'
				placeholder='Text' />
			<button id='createButton' onClick={createButtonHandler} className='createForm__button'>Create</button>
		</form>
	)
}

export default CreateForm
