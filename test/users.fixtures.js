function makeUsersArray() {
    return [
        {
            id: 1,
            name: 'First user',
            password: "password",
            pw_hint: "a hint",
            email: "user@email.com",
            number: "1234567890"
        },
        {
            id: 2,
            name: 'Second user',
            password: "password",
            pw_hint: "a hint",
            email: "user@email.com",
            number: "1234567890"
        },
        {
            id: 3,
            name: 'Third user',
            password: "password",
            pw_hint: "a hint",
            email: "user@email.com",
            number: "1234567890"
        },
        {
            id: 4,
            name: 'Fourth user',
            password: "password",
            pw_hint: "a hint",
            email: "user@email.com",
            number: "1234567890"
        }
    ]
}

function makeMaliciousUsers() {
    const maliciousUser = {
        id: 911,
        name: 'Bad Name',
        password: 'Naughty naughty very naughty <script>alert("xss");</script>',
        pw_hint: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
        email: 'terribleemail.com',
        number: 9119119111
    }
      const expectedUser = {
        ...maliciousUser,
        password: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        pw_hint: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
    }
      return {
        maliciousUser,
        expectedUser,
    }
}

module.exports = {makeMaliciousUsers, makeUsersArray}