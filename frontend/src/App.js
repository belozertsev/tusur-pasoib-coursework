import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import authContext from './contexts/authContext'

import './App.css'

import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import UserPage from './pages/UserPage.jsx'
import SettingsPage from './pages/SettingsPage'

function App() {
	const [username, setUsername] = useState(localStorage.getItem('username'))
	const [token, setToken] = useState(localStorage.getItem('token'))

	return (
		<authContext.Provider value={{ username, setUsername, token, setToken }}>
			{
				username && token ?
					<Routes>
						<Route path='/' element={< UserPage />} />
						<Route path='/settings' element={< SettingsPage />} />
						<Route path='/users/:target' element={<UserPage />} />
						<Route path='*' element={<Navigate to="/" replace />} />
					</Routes >
					:
					<Routes>
						<Route path='/login' element={< LoginPage />} />
						<Route path='/register' element={< RegisterPage />} />
						<Route path="*" element={<Navigate to="/login" replace />} />
					</Routes >
			}
		</ authContext.Provider>
	)
}

export default App
