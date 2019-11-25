const bcrypt = require('bcryptjs')

function makeUsersArray() {
  return [
    {
      id: 1,
      name: 'test-user-1',
      pw_hint: 'password1',
      email: 'test@email.com',
      password: 'password1',
      number: 1234567890,
    },
    {
      id: 2,
      name: 'test-user-2',
      pw_hint: 'password2',
      email: 'test@email.com',
      password: 'password2',
      number: 1234567890,
    },
    {
      id: 3,
      name: 'test-user-3',
      pw_hint: 'password3',
      email: 'test@email.com',
      password: 'password3',
      number: 1234567890,
    },
    {
      id: 4,
      name: 'test-user-4',
      pw_hint: 'password4',
      email: 'test@email.com',
      password: 'password4',
      number: 1234567890,
    },
  ]
}

function makeItemsArray(users) {
  return [
    {
      id: 1,
      name: 'First item!',
      type: 'Household',
      author: '',
      owned_by: users[0].id,
      borrowed: false,
      borrowed_by: "",
      borrowed_since: '2029-01-22T16:28:32.615Z',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
    },
    {
      id: 2,
      name: 'Second item!',
      type: 'Book',
      author: 'JK Rowling',
      owned_by: users[1].id,
      borrowed: true,
      borrowed_by: users[3].id,
      borrowed_since: '2029-01-22T16:28:32.615Z',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
    },
    {
      id: 3,
      name: 'Third item!',
      type: 'Electronics',
      author: '',
      owned_by: users[3].id,
      borrowed: false,
      borrowed_by: "",
      borrowed_since: '2029-01-22T16:28:32.615Z',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
    },
    {
      id: 4,
      name: 'Fourth item!',
      type: 'Garden',
      author: '',
      owned_by: users[2].id,
      borrowed: true,
      borrowed_by: users[1].id,
      borrowed_since:'2029-01-22T16:28:32.615Z',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
    },
  ]
}

function makeMaliciousItem(user) {
  const maliciousItem = {
    id: 911,
    type: 'Household',
    name: 'Naughty naughty very naughty <script>alert("xss");</script>',
    owned_by: user.id,
    borrowed: false,
    borrowed_by: null,
    borrowed_since: null,
    description: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
  }
  const expectedItem = {
    id: 911,
    type: 'Household',
    owned_by: user.id,
    borrowed: false,
    borrowed_by: null,
    borrowed_since: null,
    name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    description: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
  }
  return {
    maliciousItem,
    expectedItem,
  }
}

function makeExpectedItem(item){
  return {
    id: item.id,
    name: item.name,
    type: item.type,
    author: item.author,
    owned_by: item.owned_by,
    borrowed: item.borrowed,
    borrowed_by: item.borrowed_by.toString(),
    borrowed_since: item.borrowed_since,
    description: item.description,
  }
}

function makeExpectedUser(user){
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    password: user.password,
    pw_hint: user.pw_hint,
    number: user.number.toString()
  }
}

function makeMaliciousUser() {
  const maliciousUser = {
    id: 911,
    name: 'Naughty naughty very naughty <script>alert("xss");</script>',
    email: 'email@email.com',
    number: 9119119111,
    pw_hint: '',
    password: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
  }
  const expectedUser = {
    ...maliciousUser,
    name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    password: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
  }
  return {
    maliciousUser,
    expectedUser,
  }
}

function makeItemsFixtures() {
  const testUsers = makeUsersArray()
  const testItems = makeItemsArray(testUsers)
  return { testUsers, testItems }
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        sms_users,
        sms_items
      `
    )
    .then(() =>
      Promise.all([
        trx.raw(`ALTER SEQUENCE sms_items_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE sms_users_id_seq minvalue 0 START WITH 1`),
        trx.raw(`SELECT setval('sms_items_id_seq', 0)`),
        trx.raw(`SELECT setval('sms_users_id_seq', 0)`),
      ])
    )
  )
}

function seedUsers(db, users) {
     const preppedUsers = users.map(user => ({
       ...user,
       password: bcrypt.hashSync(user.password, 1)
     }))
     return db.into('sms_users').insert(preppedUsers)
       .then(() =>
         // update the auto sequence to stay in sync
         db.raw(
           `SELECT setval('sms_users_id_seq', ?)`,
           [users[users.length - 1].id],
         )
       )
   }

function seedItemsTables(db, users, items) {
  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async trx => {
    await seedUsers(trx, users)
    await trx.into('sms_items').insert(items)
    // update the auto sequence to match the forced id values
    await trx.raw(
            `SELECT setval('sms_items_id_seq', ?)`,
            [items[items.length - 1].id],
          )
  })
}

function seedMaliciousItem(db, user, item) {
  return seedUsers(db, [user])
    .then(() =>
      db
        .into('sms_items')
        .insert([item])
    )
}

module.exports = {
  makeUsersArray,
  makeItemsArray,
  makeMaliciousItem,
  makeExpectedItem,
  makeExpectedUser,
  makeMaliciousUser,
  makeItemsFixtures,
  cleanTables,
  seedItemsTables,
  seedUsers,
  seedMaliciousItem,
}
