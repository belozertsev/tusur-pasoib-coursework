import React, { useCallback, useEffect, useState } from 'react'
import { useParams, Link } from "react-router-dom"

import PostItem from '../components/PostItem'
import PostList from '../components/PostList'
import CreateForm from '../components/CreateForm'
import Header from '../components/Header'
import FriendList from '../components/FriendList'

const UserPage = () => {
	const username = localStorage.getItem('username')
	const token = localStorage.getItem('token')
	const { target } = useParams()
	const targetUser = target || username

	const [posts, setPosts] = useState([])
	const [friends, setFriends] = useState([])

	const fetchPosts = async () => {
		const responce = await (await fetch(`/api/posts/${targetUser}`, {
			method: 'GET',
			cache: 'no-cache',
			headers: {
				'Content-Type': 'application/json',
				'authorization_username': username,
				'authorization_token': token
			}
		})).json()

		if (responce.status) setPosts(responce.data)
		if (!responce.status && username !== targetUser) {
			alert(responce.message + '\nRedirecting to your personal page...')
			window.location.replace('/')
		}
	}

	useEffect(() => {
		fetchPosts()
	}, [])

	const fetchFriends = async () => {
		const responce = await (await fetch(`/api/friends`, {
			method: 'GET',
			cache: 'no-cache',
			headers: {
				'Content-Type': 'application/json',
				'authorization_username': username,
				'authorization_token': token
			}
		})).json()

		if (responce.status) setFriends(responce.data)
	}

	useEffect(() => {
		fetchFriends()
	}, [])

	return (
		<div className='userPage container'>
			<Header />
			<CreateForm />

			<PostList className='postList' username={targetUser}>
				{
					posts.map(item => {
						return <PostItem key={item.rowid} id={item.rowid} creator={item.creator} header={item.header} text={item.text} />
					})
				}
			</PostList>

			{
				targetUser == username &&
				<FriendList className='postList' username={targetUser}>
					{
						friends.map(item => {
							return <div className='friendItem'>

									<span>Friend: <a href={`/users/${item.username}`}>{item.username}</a></span>
									<span>
										{item.get_right ?
											<span style={{ borderLeft: 'thick solid teal', marginRight: '5px', marginLeft: '15px' }}>&nbsp; GET</span> :
											<span style={{ borderLeft: 'thick solid red', marginRight: '5px', marginLeft: '15px' }}>&nbsp; GET</span>}
										{item.post_right ?
											<span style={{ borderLeft: 'thick solid teal', marginRight: '5px', marginLeft: '15px' }}>&nbsp; POST</span> :
											<span style={{ borderLeft: 'thick solid red', marginRight: '5px', marginLeft: '15px' }}>&nbsp; POST</span>}
										{item.put_right ?
											<span style={{ borderLeft: 'thick solid teal', marginRight: '5px', marginLeft: '15px' }}>&nbsp; PUT</span> :
											<span style={{ borderLeft: 'thick solid red', marginRight: '5px', marginLeft: '15px' }}>&nbsp; PUT</span>}
										{item.delete_right ?
											<span style={{ borderLeft: 'thick solid teal', marginRight: '5px', marginLeft: '15px' }}>&nbsp; DELETE</span> :
											<span style={{ borderLeft: 'thick solid red', marginRight: '5px', marginLeft: '15px' }}>&nbsp; DELETE</span>}
									</span>
								
							</div>
						})
					}
				</FriendList>
			}
		</div>
	)
}

export default UserPage
