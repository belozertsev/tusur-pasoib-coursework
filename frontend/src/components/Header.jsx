import React from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'

// import authContext from '../../contexts/authContext'

const Header = () => {
	const username = localStorage.getItem('username')

	const exitButtonHandler = async () => {
		localStorage.clear()

		alert('You have logged out of your account')
		window.location.reload()
	}

	// const friendButtonHandler = () => {
	// 	const friendName = document.getElementById('friend').value
	// 	if (friendName) window.location.assign(`/users/${friendName}`)
	// }

	return (
		<div className='header__header'>
			<a href='/' className='header__logo'>Сoursework ПАСОИБ</a>
			<div className='header__nav'>
				<span>
					{/* <text style={{marginRight: '1rem'}}>Friend username:</text> 
					<input className='createForm__input' id='friend' placeholder='username' style={{borderRadius: '5px'}}/>
					<button className='header__button' onClick={friendButtonHandler}>GO</button> */}
				</span>
				<span className='header__auth'>Logged in as: {username}</span>
				<a href='/settings' className='header__button'>Settings</a>
				<button id='exitButton' onClick={exitButtonHandler} className='header__button'>Exit</button>
			</div>
		</div>
	)
}

export default Header
