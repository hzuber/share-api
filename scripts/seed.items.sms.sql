BEGIN;
INSERT INTO sms_items (name, type, author, borrowed, borrowed_by, borrowed_since, owned_by, description)
VALUES
    ("plastic chairs", "Household", null, false, null, null, 1, "8 grey plastic chairs"),
    ("mattress", "Household", null, true,"David Berg", "2019-06-19T12:59-0500", 2, "twin mattress"),
    ("mattress", "Household", null, false, null, null, 2, "twin mattress"),
    ("rake", "Garden", null, true, "Andy Newman", "2019-04-19T12:59-0500", 3, ""),
    ("lawn mower", "Garden", false, false, false, 1, "Braun Lawn Mower"),
    ("table saw", "Tools", null, false, null, null, 4, "Hyundai Table Saw"),
    ("weed whacker", "Garden", false, null, null, 5, "Pilot Weed Whacker"),
    ("wrench", "Tools", true, "Hannah Zuber", "2019-11-19T12:59-0500", 5, "regular sized wrench"),
    ("This is How You Lose Her", "Book", "Junot Diaz", false, null, null, 7, "On a beach in the Dominican Republic, a doomed relationship flounders. In a New Jersey laundry room, a woman does her lover’s washing and thinks about his wife. In Boston, a man buys his love child, his only son, a first baseball bat and glove. At the heart of these stories is the irrepressible, irresistible Yunior, a young hardhead whose longing for love is equaled only by his recklessness--and by the extraordinary women he loves and loses. In prose that is endlessly energetic, inventive, tender, and funny, these stories lay bare the infinite longing and inevitable weakness of the human heart. They remind us that passion always triumphs over experience, and that “the half-life of love is forever.”"),
    ("Gone With the Wind", "Book", "Margaret Mitchell", true, , "borrowed": true, "CB Berkovits", "2019-10-19T12:59-0500", 6, "'My dear, I don't give a damn.'Margaret Mitchell’s page-turning, sweeping American epic has been a classic for over eighty years. Beloved and thought by many to be the greatest of the American novels, Gone with the Wind is a story of love, hope and loss set against the tense historical background of the American Civil War. The lovers at the novel’s centre – the selfish, privileged Scarlett O’Hara and rakish Rhett Butler – are magnetic: pulling readers into the tangled narrative of a struggle to survive that cannot be forgotten."),
    ("Hocus Pocus", "Book", "Kurt Vonnegut", false, null, null, 8, "description":"Here is the adventure of Eugene Debs Hartke. He’s a Vietnam veteran, a jazz pianist, a college professor, and a prognosticator of the apocalypse (and other things Earth-shattering). But that’s neither here nor there. Because at Tarkington College—where he teaches—the excrement is about to hit the air-conditioning. And it’s all Eugene’s fault."),
    ("Good Omens", "Book", "Terry Pratchett & Neil Gaimen", true, "Aviva Gomberg", 8, "2019-08-19T12:59-0500", "description":"According to The Nice and Accurate Prophecies of Agnes Nutter, Witch (the world's only completely accurate book of prophecies, written in 1655, before she exploded), the world will end on a Saturday. Next Saturday, in fact. Just before dinner. So the armies of Good and Evil are amassing, Atlantis is rising, frogs are falling, tempers are flaring. Everything appears to be going according to Divine Plan. Except a somewhat fussy angel and a fast-living demon—both of whom have lived amongst Earth's mortals since The Beginning and have grown rather fond of the lifestyle—are not actually looking forward to the coming Rapture. And someone seems to have misplaced the Antichrist . . ."),
    ("Printer", "Electronics", false, null, null, 7, "Pantone color printer"),
]
;
COMMIT;