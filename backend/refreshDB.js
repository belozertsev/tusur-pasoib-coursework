const sqlite3 = require('sqlite3')
const sqlite = require('sqlite')
const open = sqlite.open

const start = async () => {

	const db = await open({
		filename: 'database.sqlite',
		driver: sqlite3.Database
	})

	await db.exec('DROP TABLE IF EXISTS users')
	await db.exec('DROP TABLE IF EXISTS posts')
	await db.exec('DROP TABLE IF EXISTS rights')
	
	await db.exec('CREATE TABLE IF NOT EXISTS users ("username" TEXT PRIMARY KEY NOT NULL, "password" TEXT NOT NULL)')
	await db.exec('CREATE TABLE IF NOT EXISTS posts ("username" TEXT NOT NULL, "creator" TEXT NOT NULL, "header" TEXT NOT NULL, "text" TEXT NOT NULL)')
	await db.exec('CREATE TABLE IF NOT EXISTS rights ("username" TEXT NOT NULL, "applicant" TEXT NOT NULL, "get_right" INTEGER NOT NULL, "post_right" INTEGER NOT NULL, "put_right" INTEGER NOT NULL, "delete_right" INTEGER NOT NULL, PRIMARY KEY ("username", "applicant"))')

	await db.run('INSERT INTO "users" ("username", "password") VALUES (?, ?)', 'alice', '12345')
	await db.run('INSERT INTO "users" ("username", "password") VALUES (?, ?)', 'bob', '54321')

	await db.run('INSERT INTO "posts" ("username", "creator", "header", "text") VALUES \
					("alice", "alice", "Greeting", "This is my first post. Hello to everybody!")')
	await db.run('INSERT INTO "posts" ("username", "creator", "header", "text") VALUES \
					("alice", "bob", "Declaration of love", "Hi, Alice! I think that I love you. And I want everybody to know that!")')
	
	await db.run('INSERT INTO "rights" ("username", "applicant", "get_right", "post_right", "put_right", "delete_right") VALUES \
					("alice", "bob", TRUE, TRUE, TRUE, FALSE)')
}
start()
