const assert = require('assert')
const User = require('../src/models/User')

describe('Create user', () => {
    describe('User.create()', () => {
        it('should return err.code = "ER_BAD_NULL_ERROR" when any argument is missing', async () => {
            const user = new User()
            const result = await User.create(user)

            assert.strictEqual(result.err.code, 'ER_BAD_NULL_ERROR')
        })

        it('should return err.code = "ER_TRUNCATED_WRONG_VALUE_FOR_FIELD" when the arguments are in the wrong order', async () => {
            const user = new User(3000000, '12345', 'mike@mail.com', 'mike smith', 'my address')
            const result = await User.create(user)

            assert.strictEqual(result.err.code, 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD')
        })

        it('should return undefined when everything is correct', async () => {
            const user = new User('mike smith', 'mike@mail.com', '12345', 3000000, 'my address')
            const result = await User.create(user)

            assert.strictEqual(result, undefined)
        })

        
    })
})