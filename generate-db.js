const fs = require('fs')

const firstNames = [
	'Emma',
	'Liam',
	'Olivia',
	'Noah',
	'Ava',
	'Elijah',
	'Charlotte',
	'William',
	'Sophia',
	'James',
]
const lastNames = [
	'Smith',
	'Johnson',
	'Williams',
	'Brown',
	'Jones',
	'Garcia',
	'Miller',
	'Davis',
	'Rodriguez',
	'Martinez',
]
const streets = [
	'Oak',
	'Maple',
	'Pine',
	'Cedar',
	'Elm',
	'Main',
	'Washington',
	'Park',
	'Lake',
	'Hill',
]
const colors = [
	'red',
	'blue',
	'green',
	'yellow',
	'purple',
	'orange',
	'pink',
	'black',
	'white',
	'gray',
]
const hobbies = [
	'reading',
	'gaming',
	'cooking',
	'painting',
	'photography',
	'hiking',
	'swimming',
	'dancing',
	'gardening',
	'traveling',
]

const getRandomArray = (arr, min = 1, max = 4) => {
	const count = Math.floor(Math.random() * (max - min + 1)) + min
	const shuffled = [...arr].sort(() => 0.5 - Math.random())
	return shuffled.slice(0, count)
}

const generateUsers = count => {
	return Array.from({ length: count }, (_, i) => ({
		id: `${i + 1}`,
		firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
		lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
		email: `user${i + 1}@example.com`,
		isActive: Math.random() > 0.3,
		age: Math.floor(Math.random() * (70 - 18 + 1)) + 18,
		phone: `555-${String(i + 1).padStart(4, '0')}`,
		address: `${Math.floor(Math.random() * 999) + 1} ${streets[Math.floor(Math.random() * streets.length)]} Street`,
		createdAt: new Date(Date.now() - Math.random() * 31536000000).toISOString(),
		isPremiumMember: Math.random() > 0.7,
		favoriteColors: getRandomArray(colors, 1, 3),
		hobbies: getRandomArray(hobbies, 2, 5),
	}))
}

const db = {
	users: generateUsers(100),
}

fs.writeFileSync('db.json', JSON.stringify(db, null, 2))
