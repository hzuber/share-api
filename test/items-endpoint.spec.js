const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { makeUsersArray, makeMaliciousUsers } = require('./users.fixtures')
const { makeItemsArray, makeMaliciousItems } = require('./items.fixtures')
const testItems = makeItemsArray();
const testUsers = makeUsersArray();

describe('Items Endpoints', () => {
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

    describe(`Get /api/items`, () => {
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

            it('responds with 200 and all of the items', () => {
                return supertest(app)
                    .get('/api/items')
                    .expect(200, testItems)
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
            const {maliciousUser} = makeMaliciousUsers();
            const { maliciousItemArr, expectedItem } = makeMaliciousItems();
            const maliciousItem = maliciousItemArr[0]
            beforeEach('insert malicious items', () => {
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
                    .get('/api/items')
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
            beforeEach('insert users', () => {
                return db   
                    .into('sms_users')
                    .insert(testUsers)
            })
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
                        .send(newItem)
                        .expect(400,{
                            error: { message:`You are missing '${field}' in request body.`}
                        })
                })
            })
        })

        context(`Given an XSS attack item`, () => {
            const { maliciousUser } = makeMaliciousUsers()
            const { maliciousItemArr, expectedItem } = makeMaliciousItems()
            const maliciousItem = maliciousItemArr[0]

            beforeEach('insert malicious user', () => {
                return db
                    .into('sms_users')
                    .insert(maliciousUser)
            })

            it('removes XSS attack content', () => {
                return supertest(app)
                    .post(`/api/items`)
                    .send(maliciousItem)
                    .expect(201)
                    .expect(res => {
                        expect(res.body.name).to.eql(expectedItem[0].name)
                        expect(res.body.description).to.eql(expectedItem[0].description)
                    })
            })
        })
    })

    describe(`DELETE /api/items/:item_id`, () => {
        context("Given there are items in the database", () => {
            const testItems = makeItemsArray();

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

            it('responds with a 204 and removes the item', () => {
                const idToRemove = 2
                const expectedItems = testItems.filter(item => item.id !== idToRemove)
                return supertest(app)
                    .delete(`/api/items/${idToRemove}`)
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
                    .expect(404, {error: {message: `Item doesn't exist`}})
            })
        })

        context(`Given there are items in the database`, () => {
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