import React from 'react'
import { Link } from 'react-router-dom'

const LoginPage = () => {
	const submitButtonHandler = async () => {
		const username = document.getElementById('username').value
		const password = document.getElementById('password').value

		const response = await (await fetch('/account/login', {
			method: 'POST',
			cache: 'no-cache',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				username,
				password
			})
		})).json()

		if (response.status) {
			localStorage.setItem('username', username)
			localStorage.setItem('token', response.token)
		}

		alert(response.message)
		window.location.reload()
	}

	return (
		<div className='authPage container'>
			<h1 className='authPage__header'>LoginPage</h1>

			<input className='createForm__input' id="username" type="text" placeholder='username' name='username' />
			<input className='createForm__input' id="password" type="password" placeholder='password' name='password' />
			<button className='createForm__button' id='submitButton' onClick={submitButtonHandler}>Login!</button>

			<Link to="/register">To Register page!</Link>
		</div>
	)
}

export default LoginPage
