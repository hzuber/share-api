const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { makeUsersArray, makeMaliciousUsers } = require('./users.fixtures')
const { makeItemsArray, makeMaliciousItems } = require('./items.fixtures')
const testUsers = makeUsersArray();
const testItems = makeItemsArray();

describe('Users Endpoints', () => {
    let db

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        })
        app.set('db', db)
    })

    before('clean the table', () => db.raw('TRUNCATE sms_users, sms_items RESTART IDENTITY CASCADE'))
    afterEach('cleanup', () => db.raw('TRUNCATE sms_users, sms_items RESTART IDENTITY CASCADE'))
    after('disconnect from db', () => db.destroy())

    describe(`Get /api/users`, () => {
        context('Given there are users in the database', () => {
            beforeEach('insert users', () => {
                return db
                    .into('sms_users')
                    .insert(testUsers)
            })

            it('responds with 200 and all of the users', () => {
                return supertest(app)
                    .get('/api/users')
                    .expect(200, testUsers)
            })
        })

        context('Given there are no users', () => {
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get('/api/users')
                    .expect(200, [])
            })
        })

        context('Given an XSS attack user', () => {
            const { maliciousUser, expectedUser } = makeMaliciousUsers();

            beforeEach('insert malicious user', () => {
                return db
                    .into('sms_users')
                    .insert(maliciousUser)
            })

            it('removes XSS attack content', () => {
                return supertest(app)
                    .get('/api/users')
                    .expect(200)
                    .expect(res => {
                        expect(res.body[0].password).to.eql(expectedUser.password)
                        expect(res.body[0].pw_hint).to.eql(expectedUser.pw_hint)
                    })
            })
        })
    })

    describe('GET /users/:user_id', () => {
        context('Given there are users in the database', () => {
            beforeEach('insert users', () => {
                return db
                    .into('sms_users')
                    .insert(testUsers)
            })

            it('GET /users/:user_id responds with 200 and the user', () => {
                const userId = 2
                const expectedUser = testUsers[userId-1]
                return supertest(app)
                    .get(`/api/users/${userId}`)
                    .expect(200, expectedUser)
            })
        })

        context('Given there are no users', () => {
            it('responds with 404', () => {
                const userId = 123456
                return supertest(app)
                    .get(`/api/users/${userId}`)
                    .expect(404, {error: {message: `User doesn't exist`}})
            })
        })

        context('Given an XSS attack user', () => {
            const { maliciousUser, expectedUser } = makeMaliciousUsers();

            beforeEach('insert malicious user', () => {
                return db
                    .into('sms_users')
                    .insert(maliciousUser)
            })

            it('removes XSS attack content', () => {
                return supertest(app)
                    .get(`/api/users/${maliciousUser.id}`)
                    .expect(200)
                    .expect(res => {
                        expect(res.body.password).to.eql(expectedUser.password)
                        expect(res.body.pw_hint).to.eql(expectedUser.pw_hint)
                    })
            })
        })
    })

    describe('POST /api/users', () => {
        it(`creates a new user, responds with 201 and the specified user`, () => {
            const newUser = {
                name: 'test new user',
                password: "test password",
                pw_hint: "test hint",
                email: "test@email.com",
                number: "1234567890"
            }
            return supertest(app)
                .post('/api/users')
                .send(newUser)
                .expect(201)
                .expect(res => {
                    expect(res.body.name).to.eql(newUser.name)
                    expect(res.body.password).to.eql(newUser.password)
                    expect(res.body.pw_hint).to.eql(newUser.pw_hint)
                    expect(res.body.email).to.eql(newUser.email)
                    expect(res.body.number).to.eql(newUser.number)
                    expect(res.body).to.have.property('id')
                    expect(res.header.location).to.eql(`/api/users/${res.body.id}`)
                })
                .then(postRes => 
                    supertest(app)
                        .get(`/api/users/${postRes.body.id}`)
                        .expect(postRes.body)   
                    )
        })
        const requiredFields = ['name', 'password', 'email']
        requiredFields.forEach(field => {
            const newUser = {
                name: 'test new user',
                password: "test password",
                email: "test@email.com",
            }

            it(`it responds with 400 and error message when the '${field}' is missing`, () => {
                delete newUser[field]
                return supertest(app)
                    .post('/api/users')
                    .send(newUser)
                    .expect(400,{
                        error: { message:`You are missing '${field}' in request body.`}
                    })
            })
        })

        context(`Given an XSS attack user`, () => {
            const { maliciousUser, expectedUser } = makeMaliciousUsers()

            it('removes XSS attack content', () => {
                return supertest(app)
                    .post(`/api/users`)
                    .send(maliciousUser)
                    .expect(201)
                    .expect(res => {
                        expect(res.body.password).to.eql(expectedUser.password)
                        expect(res.body.pw_hint).to.eql(expectedUser.pw_hint)
                    })
            })
        })
    })

    describe(`DELETE /api/users/:user_id`, () => {
        context("Given there are users in the database", () => {
            const testUsers = makeUsersArray()

            beforeEach('insert users', () => {
                return db
                    .into('sms_users')
                    .insert(testUsers)
            })

            it('responds with a 204 and removes the user', () => {
                const idToRemove = 2
                const expectedUsers = testUsers.filter(user => user.id !== idToRemove)
                return supertest(app)
                    .delete(`/api/users/${idToRemove}`)
                    .expect(204)
                    .then(res => 
                        supertest(app)
                            .get(`/api/users`)
                            .expect(expectedUsers))
            })
        })
    })

    describe(`PATCH /api/users/:user_id`, () => {
        context('Given no users', () => {
            it(`responds with a 404`, () => {
                const userId = 123456
                return supertest(app)
                    .patch(`/api/users/${userId}`)
                    .expect(404, {error: {message: `User doesn't exist`}})
            })
        })

        context(`Given there are users in the database`, () => {
            beforeEach('insert users', () => {
                return db   
                    .into('sms_users')
                    .insert(testUsers)
            })

            it(`responds with 204 and updates the article`, () => {
                const idToUpdate = 2
                const updateUser = {
                    name: 'updated name',
                    password: 'new password',
                    email: 'newuser@email.com',
                }
                const expectedUser= {
                    ...testUsers[idToUpdate - 1],
                    ...updateUser
                }
                return supertest(app)
                    .patch(`/api/users/${idToUpdate}`)
                    .send(updateUser)
                    .expect(204)
                    .then(res => {
                        supertest(app)
                            .get(`/api/users/${idToUpdate}`)
                            .expect(expectedUser)
                    })
            })

            it(`responds with 400 when no required fields are supplied`, () => {
                const idToUpdate = 2
                return supertest(app)
                    .patch(`/api/users/${idToUpdate}`)
                    .send({ irrelevantField: 'foo' })
                    .expect(400, {
                        error: {
                            message: `Request must contain a change`
                        }
                    })
            })

            it(`responds with 204 when updating only a subset of fields`, () => {
                const idToUpdate = 2
                const updateUser = {
                    name: 'updated user name'
                }
                const expectedUser = {
                    ...testUsers[idToUpdate - 1],
                    ...updateUser
                }

                return supertest(app)
                    .patch(`/api/users/${idToUpdate}`)
                    .send({
                        ...updateUser,
                        fieldToIgnore: 'should not be in GET request'
                    })
                    .expect(204)
                    .then(res => {
                        supertest(app)
                            .get(`/api/users/${idToUpdate}`)
                            .expect(expectedUser)
                    })
            })

        })
    })

    describe(`GET /api/users/:user_id/items`, () => {
        context('Given there are items in the database', () => {
            beforeEach('insert items', () => {
                return db   
                    .into('sms_users')
                    .insert(testUsers)
                    .then(() => {
                        return db
                            .into('sms_items')
                            .insert(testItems)
                    })
            })

            it('GET /users/:user_id/items responds with 200 and the items', () => {
                const userId = 2
                const expectedItem = [testItems[userId - 1]]
                return supertest(app)
                    .get(`/api/users/${userId}/items`)
                    .expect(200, expectedItem)
            })
        })
        context(`Given an XSS attack item`, () => {
            const { maliciousItem, expectedItem } = makeMaliciousItems()
            const { maliciousUser, expectedUser } = makeMaliciousUsers()

            beforeEach('insert malicious user and item', () => {
                return db
                    .into('sms_users')
                    .insert(maliciousUser)
                    .then(() => {
                        return db
                            .into('sms_items')
                            .insert(maliciousItem)
                    })
            })

            it('removes XSS attack content', () => {
                return supertest(app)
                    .get(`/api/users/911/items`)
                    .expect(200)
                    .expect(res => {
                        expect(res.body.name).to.eql(expectedItem.name)
+                       expect(res.body.description).to.eql(expectedItem.description)
                    })
            })
        })
    })
})