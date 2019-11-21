function makeItemsArray() {
    return [
        //keep owned_by and id the same for testing purposes
        {
            id: 1,
            name: 'First item',
            author: "",
            type: 'Household',
            borrowed: false,
            borrowed_by: "",
            borrowed_since: null,
            owned_by: 1,
            description: "Lorem ipsum dolor"
        },
        {
            id: 2,
            name: 'Second item',
            author: 'an author',
            type: 'Book',
            borrowed: true,
            borrowed_by: "a person",
            borrowed_since: "2019-06-19T12:59:00.000Z",
            owned_by: 2,
            description: "Lorem ipsum dolor"
        },
        {
            id: 3,
            name: 'Third item',
            author: "",
            type: 'Electronics',
            borrowed: false,
            borrowed_by: "",
            borrowed_since: null,
            owned_by: 3,
            description: "Lorem ipsum dolor"
        },
        {
            id: 4,
            name: 'Fourth item',
            author: "",
            type: 'Toys',
            borrowed: false,
            borrowed_by: "",
            borrowed_since: null,
            owned_by: 4,
            description: "Lorem ipsum dolor"
        },
    ]
}

function makeMaliciousItems() {
    const maliciousItemArr = [{
        type: "Garden",
        name: "Naughty naughty very naughty <script>alert('xss');</script>",
        description: "Bad image <img src='https://url.to.file.which/does-not.exist' onerror='alert(document.cookie);'>. But not <strong>all</strong> bad.",
        borrowed: true,
        author: "",
        borrowed_by: "a person",
        borrowed_since: "2019-06-19T12:59:00.000Z",
        owned_by: 911
    }]
      expectedItem = [{
        ...maliciousItemArr[0],
        name: 'Naughty naughty very naughty &lt;script&gt;alert(\'xss\');&lt;/script&gt;',
        description: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
    }]
      return {
        maliciousItemArr,
        expectedItem,
    }
}

module.exports = {makeItemsArray, makeMaliciousItems}