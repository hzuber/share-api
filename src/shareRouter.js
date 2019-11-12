const express = require('express');

const shareRouter = express.Router();

const itemsStore = [
    {"id": 1, "name": "plastic chairs", "type":"Household", "description":"8 grey plastic chairs", "borrowed": false, "borrowed_by": null, "borrowed_since": null},
    {"id": 2, "name": "mattress", "type":"Household", "description":"twin mattress", "borrowed": true, "borrowed_by": "David Berg", "borrowed_since": "2019-06-19T12:59-0500"},
    {"id": 3, "name": "mattress", "type":"Household", "description":"twin mattress", "borrowed": false, "borrowed_by": null},
    {"id": 4, "name": "rake", "type":"Garden", "description":"", "borrowed": true, "borrowed_by": "Andy Newman", "borrowed_since": "2019-04-19T12:59-0500"},
    {"id": 5, "name": "lawn mower", "type":"Garden", "description":"Braun Lawn Mower", "borrowed": false, "borrowed_by": null},
    {"id": 6, "name": "table saw", "type":"Tools", "description":"Hyundai Table Saw", "borrowed": false, "borrowed_by": null},
    {"id": 7, "name": "weed whacker", "type":"Garden", "description":"Pilot Weed Whacker", "borrowed": false, "borrowed_by": null},
    {"id": 8, "name": "wrench", "type":"Tools", "description":"regular sized wrench", "borrowed": true, "borrowed_by": "Hannah Zuber", "borrowed_since": "2019-11-19T12:59-0500"},
    {"id": 9, "name": "This is How You Lose Her", "author": "Junot Diaz", "type":"Book", "description":"On a beach in the Dominican Republic, a doomed relationship flounders. In a New Jersey laundry room, a woman does her lover’s washing and thinks about his wife. In Boston, a man buys his love child, his only son, a first baseball bat and glove. At the heart of these stories is the irrepressible, irresistible Yunior, a young hardhead whose longing for love is equaled only by his recklessness--and by the extraordinary women he loves and loses. In prose that is endlessly energetic, inventive, tender, and funny, these stories lay bare the infinite longing and inevitable weakness of the human heart. They remind us that passion always triumphs over experience, and that “the half-life of love is forever.”", "borrowed": false, "borrowed_by": null},
    {"id": 10, "name": "Gone With the Wind", "author":"Margaret Mitchell","type":"Book", "description":"'My dear, I don't give a damn.'Margaret Mitchell’s page-turning, sweeping American epic has been a classic for over eighty years. Beloved and thought by many to be the greatest of the American novels, Gone with the Wind is a story of love, hope and loss set against the tense historical background of the American Civil War. The lovers at the novel’s centre – the selfish, privileged Scarlett O’Hara and rakish Rhett Butler – are magnetic: pulling readers into the tangled narrative of a struggle to survive that cannot be forgotten.", "borrowed": true, "borrowed_by": "CB Berkovits", "borrowed_since": "2019-10-19T12:59-0500"},
    {"id": 11, "name": "Hocus Pocus", "type":"Book", "author": "Kurt Vonnegut", "description":"Here is the adventure of Eugene Debs Hartke. He’s a Vietnam veteran, a jazz pianist, a college professor, and a prognosticator of the apocalypse (and other things Earth-shattering). But that’s neither here nor there. Because at Tarkington College—where he teaches—the excrement is about to hit the air-conditioning. And it’s all Eugene’s fault.", "borrowed": false, "borrowed_by": null},
    {"id": 12, "name": "Good Omens", "type":"Book", "author": "Terry Pratchett & Neil Gaimen", "description":"According to The Nice and Accurate Prophecies of Agnes Nutter, Witch (the world's only completely accurate book of prophecies, written in 1655, before she exploded), the world will end on a Saturday. Next Saturday, in fact. Just before dinner. So the armies of Good and Evil are amassing, Atlantis is rising, frogs are falling, tempers are flaring. Everything appears to be going according to Divine Plan. Except a somewhat fussy angel and a fast-living demon—both of whom have lived amongst Earth's mortals since The Beginning and have grown rather fond of the lifestyle—are not actually looking forward to the coming Rapture. And someone seems to have misplaced the Antichrist . . .", "borrowed": true, "borrowed_by": "Aviva Gomberg", "borrowed_since": "2019-08-19T12:59-0500"},
    {"id": 13, "name": "Printer", "type":"Electronics", "description":"Pantone color printer", "borrowed": false, "borrowed_by": null},
]

shareRouter
    .route('/')
    .get((req, res, next) => {
        return res.json(itemsStore)
    })

module.exports = shareRouter;