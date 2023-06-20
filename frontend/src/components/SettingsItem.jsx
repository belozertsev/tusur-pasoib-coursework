import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const SettingsItem = ({
	parentCallback,
	friendUsername,
	get_right,
	post_right,
	put_right,
	delete_right }) => {

	const [getRight, setGetRight] = useState(!!get_right)
	const [postRight, setPostRight] = useState(!!post_right)
	const [putRight, setPutRight] = useState(!!put_right)
	const [deleteRight, setDeleteRight] = useState(!!delete_right)

	const checkboxHandler = (right_type) => {
		switch (right_type) {
			case 'get_right': setGetRight(state => !state); break
			case 'post_right': setPostRight(state => !state); break
			case 'put_right': setPutRight(state => !state); break
			case 'delete_right': setDeleteRight(state => !state); break
		}
	}

	useEffect(() => {
		parentCallback({ applicant: friendUsername, get_right: getRight, post_right: postRight, put_right: putRight, delete_right: deleteRight })
	}, [getRight, postRight, putRight, deleteRight])

	return (
		<div className='settingsItem__settingsItem'>
			<span>Friend: {friendUsername}</span>
			<span>
				<span style={{ borderLeft: 'thick solid teal', marginRight: '5px', marginLeft: '15px' }}></span>
				GET:
				{get_right ?
					<input onClick={() => checkboxHandler('get_right')} id='get' type='checkbox' className="settingsItem__checkbox" defaultChecked /> :
					<input onClick={() => checkboxHandler('get_right')} id='get' type='checkbox' className="settingsItem__checkbox" />}

				<span style={{ borderLeft: 'thick solid teal', marginRight: '5px', marginLeft: '15px' }}></span>
				ADD (POST):
				{post_right ?
					<input onClick={() => checkboxHandler('post_right')} id='post' type='checkbox' className="settingsItem__checkbox" defaultChecked /> :
					<input onClick={() => checkboxHandler('post_right')} id='post' type='checkbox' className="settingsItem__checkbox" />}

				<span style={{ borderLeft: 'thick solid teal', marginRight: '5px', marginLeft: '15px' }}></span>
				EDIT (PUT):
				{put_right ?
					<input onClick={() => checkboxHandler('put_right')} id='put' type='checkbox' className="settingsItem__checkbox" defaultChecked /> :
					<input onClick={() => checkboxHandler('put_right')} id='put' type='checkbox' className="settingsItem__checkbox" />}

				<span style={{ borderLeft: 'thick solid teal', marginRight: '5px', marginLeft: '15px' }}></span>
				DELETE:
				{delete_right ?
					<input onClick={() => checkboxHandler('delete_right')} id='delete' type='checkbox' className="settingsItem__checkbox" defaultChecked /> :
					<input onClick={() => checkboxHandler('delete_right')} id='delete' type='checkbox' className="settingsItem__checkbox" />}
			</span>
		</div>
	)
}

export default SettingsItem
