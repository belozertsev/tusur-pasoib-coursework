import React from 'react'


const PostList = ({ username = '@username', children }) => {
	return (
		<div className='postList__postList'>
			<h1 className='postList_header'>
				Posts on {username}'s page':
			</h1>
			{children}
		</div>
	)
}

export default PostList
