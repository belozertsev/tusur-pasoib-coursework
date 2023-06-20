import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

// import { authContext } from '../contexts/authContext'

const RegisterPage = () => {
	// const context = React.useContext(authContext)

	const submitButtonHandler = async () => {
		const username = document.getElementById('username').value
		const password = document.getElementById('password').value

		const response = await (await fetch('/account/register', {
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
				<h1 className='authPage__header'>RegisterPage</h1>

				<input className='createForm__input' id="username" type="text" placeholder='username' name='username' />
				<input className='createForm__input' id="password" type="password" placeholder='password' name='password' />
				<button className='createForm__button' id='submitButton' onClick={submitButtonHandler}>Register!</button>

				<Link to="/login">To Login page!</Link>
			</div>
	)
}

export default RegisterPage
