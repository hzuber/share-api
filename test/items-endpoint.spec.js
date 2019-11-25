const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')
const { testUsers, testItems } = helpers.makeItemsFixtures()


describe('Items Endpoints', () => {
    let db

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        })
        app.set('db', db)
    })

    function makeAuthHeader(user) {
        const token = Buffer.from(`${user.email}:${user.password}`).toString('base64')
        return `Basic ${token}`
    }

    before('clean the table', () => db.raw('TRUNCATE sms_users, sms_items RESTART IDENTITY CASCADE'))
    afterEach('cleanup', () => db.raw('TRUNCATE sms_users, sms_items RESTART IDENTITY CASCADE'))
    after('disconnect from db', () => db.destroy())

    describe(`Protected endpoints`, () => {
        beforeEach('insert items', () =>
            helpers.seedItemsTables(
                db,
                testUsers,
                testItems
            )
        )
    
        describe(`GET /api/items/:item_id`, () => {
            it(`responds with 401 'Missing basic token' when no basic token`, () => {
                return supertest(app)
                    .get(`/api/items/123`)
                    .expect(401, { error: `Missing basic token` })
            })

            it(`responds 401 'Unauthorized request' when no credentials in token`, () => {
                const userNoCreds = { email: '', password: '' }
                return supertest(app)
                    .get(`/api/items/123`)
                    .set('Authorization', makeAuthHeader(userNoCreds))
                    .expect(401, { error: `Unauthorized request` })
            })

            it(`responds 401 'Unauthorized request' when invalid user`, () => {
                const userInvalidCreds = { email: 'user-not', password: 'existy' }
                return supertest(app)
                    .get(`/api/items/1`)
                    .set('Authorization', makeAuthHeader(userInvalidCreds))
                    .expect(401, { error: `Unauthorized request` })
            })

            it(`responds 401 'Unauthorized request' when invalid password`, () => {
                const userInvalidPass = { email: testUsers[0].email, password: 'wrong' }
                return supertest(app)
                    .get(`/api/items/1`)
                    .set('Authorization', makeAuthHeader(userInvalidPass))
                    .expect(401, { error: `Unauthorized request` })
            })
        })
    })

    describe(`Get /api/items`, () => {
        context('Given there are items in the database', () => {
            beforeEach('insert items', () => 
                helpers.seedItemsTables(
                    db,
                    testUsers,
                    testItems
                )
            )

            it('responds with 200 and all of the items', () => {
                const expectedItems = testItems.map(item => helpers.makeExpectedItem(item))
                return supertest(app)
                    .get('/api/items')
                    .expect(200, expectedItems)
            })
        })

        context('Given there are no items', () => {
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get('/api/items')
                    .expect(200, [])
            })
        })

        context('Given an XSS attack item', () => {
            const testUser = helpers.makeUsersArray()[1]
            const {
                maliciousItem,
                expectedItem,
            } = helpers.makeMaliciousItem(testUser)

            beforeEach('insert malicious item', () => {
                return helpers.seedMaliciousItem(
                  db,
                  testUser,
                  maliciousItem,
                )
              })

            it('removes XSS attack content', () => {
                return supertest(app)
                    .get('/api/items')
                    .expect(200)
                    .expect(res => {
                        expect(res.body[0].name).to.eql(expectedItem.name)
                        expect(res.body[0].description).to.eql(expectedItem.description)
                    })
            })
        })
    })

    describe(`GET /api/items/:item_id`, () => {
        context(`Given no items`, () => {
            beforeEach(() => 
            helpers.seedUsers(db, testUsers)
            )
                it(`responds with 404`, () => {
                    const itemId = 123456
                    return supertest(app)
                    .get(`/api/items/${itemId}`)
                    .set('Authorization', makeAuthHeader(testUsers[0]))
                    .expect(404, { error: 
                        {message:
                            `Item doesn't exist` }
                    })
                })
        })
    
        context('Given there are items in the database', () => {
          beforeEach('insert items', () =>
            helpers.seedItemsTables(
              db,
              testUsers,
              testItems,
            )
          )
    
          it('responds with 200 and the specified item', () => {
            const itemId = 2
            const testItem = testItems[itemId - 1]
            const expectedItem = helpers.makeExpectedItem(testItem)
    
            return supertest(app)
              .get(`/api/items/${itemId}`)
              .set('Authorization', makeAuthHeader(testUsers[0]))
              .expect(200, expectedItem)
          })
        })
    
        context(`Given an XSS attack item`, () => {
          const testUser = helpers.makeUsersArray()[1]
          const {
            maliciousItem,
            expectedItem,
          } = helpers.makeMaliciousItem(testUser)
    
          beforeEach('insert malicious item', () => {
            return helpers.seedMaliciousItem(
              db,
              testUser,
              maliciousItem,
            )
          })
    
          it('removes XSS attack content', () => {
            return supertest(app)
              .get(`/api/items/${maliciousItem.id}`)
              .set('Authorization', makeAuthHeader(testUser))
              .expect(200)
              .expect(res => {
                expect(res.body.name).to.eql(expectedItem.name)
                expect(res.body.description).to.eql(expectedItem.description)
              })
          })
        })
      })

    describe('POST /api/items', () => {
        context('Given an item to insert', () => {
            beforeEach('insert items', () =>
            helpers.seedItemsTables(
              db,
              testUsers,
              testItems,
            )
          )
            it(`creates a new item, responds with 201 and the specified item`, () => {
                const newItem = {
                    name: "test new item",
                    type: "Household",
                    author: "",
                    borrowed: false,
                    borrowed_by: "",
                    borrowed_since: null,
                    description: "it's a new item",
                    owned_by: 1
                }
                return supertest(app)
                    .post('/api/items')
                    .set('Authorization', makeAuthHeader(testUsers[0]))
                    .send(newItem)
                    .expect(201)
                    .expect(res => {
                        expect(res.body.name).to.eql(newItem.name)
                        expect(res.body.type).to.eql(newItem.type)
                        expect(res.body.borrowed).to.eql(newItem.borrowed)
                        expect(res.body.description).to.eql(newItem.description)
                        expect(res.body).to.have.property('id')
                        expect(res.header.location).to.eql(`/api/items/${res.body.id}`)
                    })
                    .then(postRes => 
                        supertest(app)
                            .get(`/api/items/${postRes.body.id}`)
                            .expect(postRes.body)   
                        )
            })
            const requiredFields = ['name', 'borrowed']
            requiredFields.forEach(field => {
                const newItem = {
                    name: 'test new item',
                    borrowed: false,
                }

                it(`it responds with 400 and error message when the '${field}' is missing`, () => {
                    delete newItem[field]
                    return supertest(app)
                        .post('/api/items')
                        .set('Authorization', makeAuthHeader(testUsers[0]))
                        .send(newItem)
                        .expect(400,{
                            error: { message:`You are missing '${field}' in request body.`}
                        })
                })
            })
        })

        context(`Given an XSS attack item`, () => {
            const testUser = testUsers[0]
            const {maliciousItem, expectedItem} = helpers.makeMaliciousItem(testUser)
    
          beforeEach('insert items', () => {
            return helpers.seedItemsTables(
              db,
              testUsers,
              testItems,
            )
          })

            it('removes XSS attack content', () => {
                return supertest(app)
                    .post(`/api/items`)
                    .set('Authorization', makeAuthHeader(testUsers[0]))
                    .send(maliciousItem)
                    .expect(201)
                    .expect(res => {
                        expect(res.body.name).to.eql(expectedItem.name)
                        expect(res.body.description).to.eql(expectedItem.description)
                    })
            })
        })
    })

    describe(`DELETE /api/items/:item_id`, () => {
        context("Given there are items in the database", () => {

            beforeEach('insert items', () =>
            helpers.seedItemsTables(
              db,
              testUsers,
              testItems,
            )
          )

            it('responds with a 204 and removes the item', () => {
                const idToRemove = 2
                const expectedItemList = testItems.filter(item => item.id !== idToRemove)
                const expectedItems = expectedItemList.map(item => helpers.makeExpectedItem(item))
                return supertest(app)
                    .delete(`/api/items/${idToRemove}`)
                    .set('Authorization', makeAuthHeader(testUsers[0]))
                    .expect(204)
                    .then(res => 
                        supertest(app)
                            .get(`/api/items`)
                            .expect(expectedItems))
            })
        })
    })

    describe(`PATCH /api/items/:item_id`, () => {
        context('Given no items', () => {
            it(`responds with a 404`, () => {
                const itemId = 123456
                return supertest(app)
                    .patch(`/api/items/${itemId}`)
                    .set('Authorization', makeAuthHeader(testUsers[0]))
                    .expect(404, {error: {message: `Item doesn't exist`}})
            })
        })

        context(`Given there are items in the database`, () => {
            beforeEach('insert items', () =>
            helpers.seedItemsTables(
              db,
              testUsers,
              testItems,
            )
          )

            it(`responds with 204 and updates the article`, () => {
                const idToUpdate = 2
                const updateItem = {
                    name: 'updated name',
                    password: 'new password',
                    email: 'newitem@email.com',
                }
                const expectedItem= {
                    ...testItems[idToUpdate - 1],
                    ...updateItem
                }
                return supertest(app)
                    .patch(`/api/items/${idToUpdate}`)
                    .set('Authorization', makeAuthHeader(testUsers[0]))
                    .send(updateItem)
                    .expect(204)
                    .then(res => {
                        supertest(app)
                            .get(`/api/items/${idToUpdate}`)
                            .expect(expectedItem)
                    })
            })

            it(`responds with 400 when no required fields are supplied`, () => {
                const idToUpdate = 2
                return supertest(app)
                    .patch(`/api/items/${idToUpdate}`)
                    .set('Authorization', makeAuthHeader(testUsers[0]))
                    .send({ irrelevantField: 'foo' })
                    .expect(400, {
                        error: {
                            message: `Request must contain a change`
                        }
                    })
            })

            it(`responds with 204 when updating only a subset of fields`, () => {
                const idToUpdate = 2
                const updateItem = {
                    name: 'updated item name'
                }
                const expectedItem = {
                    ...testItems[idToUpdate - 1],
                    ...updateItem
                }

                return supertest(app)
                    .patch(`/api/items/${idToUpdate}`)
                    .set('Authorization', makeAuthHeader(testUsers[0]))
                    .send({
                        ...updateItem,
                        fieldToIgnore: 'should not be in GET request'
                    })
                    .expect(204)
                    .then(res => {
                        supertest(app)
                            .get(`/api/items/${idToUpdate}`)
                            .expect(expectedItem)
                    })
            })

        })
    })
})