import React from 'react'
import { useState, useEffect } from 'react'

import Header from '../components/Header'
import SettingsItem from '../components/SettingsItem'

function SettingsPage() {
	const username = localStorage.getItem('username')
	const token = localStorage.getItem('token')

	const [settings, setSettings] = useState([])

	const fetchSettings = async () => {
		const responce = await (await fetch('/api/settings', {
			method: 'GET',
			cache: 'no-cache',
			headers: {
				'Content-Type': 'application/json',
				'authorization_username': username,
				'authorization_token': token
			}
		})).json()

		if (responce.status) setSettings(responce.settings)
		else alert(responce.message)
		console.log(responce.settings)
	}

	useEffect(() => {
		fetchSettings()
	}, [])

	const updateSettings = (stateObj) => {
		const index = settings.findIndex(row => row.applicant == stateObj.applicant)

		const newSettings = settings.map(row => {
			if (row.applicant == stateObj.applicant) return { username, ...stateObj }
			else return row
		})


		setSettings(newSettings)
	}

	const saveButtonHandler = async () => {
		const responce = await (await fetch('/api/settings', {
			method: 'POST',
			cache: 'no-cache',
			headers: {
				'Content-Type': 'application/json',
				'authorization_username': username,
				'authorization_token': token
			},
			body: JSON.stringify({
				settings
			})
		})).json()

		alert(responce.message)
	}

	const addButtonHandler = async () => {
		const newApplicant = prompt('Enter your friends username:')
		if (!newApplicant) return
		
		const row = { username, applicant: newApplicant, get_right: false, post_right: false, put_right: false, delete_right: false }

		const responce = await (await fetch('/api/settings/add', {
			method: 'POST',
			cache: 'no-cache',
			headers: {
				'Content-Type': 'application/json',
				'authorization_username': username,
				'authorization_token': token
			},
			body: JSON.stringify({
				row
			})
		})).json()

		alert(responce.message)
		window.location.reload()
	}

	return (
		<div className='settingsPage container'>
			<Header />

			<h1 className='authPage__header'>SettingsPage</h1>

			{settings.map(item => {
				return <SettingsItem parentCallback={updateSettings} key={item.applicant} friendUsername={item.applicant} get_right={item.get_right} post_right={item.post_right} put_right={item.put_right} delete_right={item.delete_right} />
			})}


			<button className='createForm__button' id='addButton' onClick={addButtonHandler}>Add new rule</button>
			<button className='createForm__button' id='saveButton' onClick={saveButtonHandler}>Save new settings</button>
		</div>
	)
}

export default SettingsPage
