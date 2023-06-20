import React from 'react'
import { useParams } from 'react-router-dom'

const PostItem = ({
	id,
	creator,
	header = 'Заголовок по умолчанию',
	text = 'Текст по умолчанию' }) => {

	const username = localStorage.getItem('username')
	const token = localStorage.getItem('token')

	const deleteButtonHandler = async () => {
		const response = await (await fetch(`/api/posts/${id}`, {
			method: 'DELETE',
			cache: 'no-cache',
			headers: {
				'Content-Type': 'application/json',
				'authorization_username': username,
				'authorization_token': token
			}
		})).json()

		alert(response.message)
		if (response.status) window.location.reload()
	}

	const editButtonHandler = async () => {
		const permittionResponce = await (await fetch('/api/settings/check', {
			method: 'POST',
			cache: 'no-cache',
			headers: {
				'Content-Type': 'application/json',
				'authorization_username': username,
				'authorization_token': token
			},
			body: JSON.stringify({
				postId: id,
				rightType: 'put_right'
			})
		})).json()

		if (!permittionResponce.status) {
			return alert(permittionResponce.message)
		}

		const newHeader = prompt('Edit header:', header)
		const newText = prompt('Edit text:', text)

		const response = await (await fetch(`/api/posts/${id}`, {
			method: 'PUT',
			cache: 'no-cache',
			headers: {
				'Content-Type': 'application/json',
				'authorization_username': username,
				'authorization_token': token
			},
			body: JSON.stringify({
				header: newHeader,
				text: newText
			})
		})).json()

		alert(response.message)
		if (response.status) window.location.reload()
	}

	return (
		<div className='postItem__postItem'>
			<div>id: <span id='id'>{id}</span></div>
			<div>Creator: {creator}</div>
			<h2 className='postItem__header' >{header}</h2>
			<p className='postItem__text'>{text}</p>

			<button id='deleteButton' onClick={deleteButtonHandler} className='postItem__button'>Delete</button>
			<button id='editButton' onClick={editButtonHandler} className='postItem__button'>Edit</button>
		</div>
	)
}

export default PostItem
