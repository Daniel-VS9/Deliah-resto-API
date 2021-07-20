const users = [
    {
        email : 'admin@mail.com',
        name: 'admin',
        pass: "1234",
        phone: '3044444444',
        address: '19200 SW 116th Ave',
        isAdmin: true
    },
    {
        email : 'abby@mail.com',
        name: 'Abby G',
        pass: "1234",
        phone: '3111111111',
        address: '19200 SW 116th Ave',
        isAdmin: false
    },
    {
        email : 'jack@mail.com',
        name: 'Jack',
        pass: "1234",
        phone: '3000000000',
        address: '436 E St NW',
        isAdmin: false
    },
]

const getUsers = () => {
    return users
}

const addUser = (email, name, pass, phone, address) => {
    user = {email, name, pass, phone, address, isAdmin: false}
    users.push(user)
}

module.exports = {addUser, getUsers}