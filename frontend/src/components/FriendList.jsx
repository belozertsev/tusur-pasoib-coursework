import React from 'react'

const FriendList = ({ username = '@username', children }) => {
	return (
		<div className='postList__postList'>
			<h1 className='postList_header'>
				Potential friends of {username}:
			</h1>
			{children}
		</div>
	)
}

export default FriendList
