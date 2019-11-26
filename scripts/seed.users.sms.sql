BEGIN;
INSERT INTO sms_users (name, password, email, number)
VALUES
    ('Hannah Zuber', 'password1', 'hannahzuber@email.com', '1234567890'),
    ('Amy Green', 'password2', 'amygreen@email.com', '1234567890'),
    ('Jonah Hill', 'hilltop', 'jonahhill@email.com', '1234567890'),
    ('Chris Evans', 'americasass', 'cap@email.com', '1234567890'),
    ('Kristen Bell', 'frozen', 'kristenbell@email.com', '1234567890'),
    ('Tahani Al Jamil', 'ladygaga', 'tahani@email.com', '1234567890'),
    ('Jason Mendoza', 'blakebortles', 'dancedance@email.com', '1234567890'),
    ('Chidi Anagonye', 'kirkegaard', 'ethics4eva@email.com', '1234567890')
;
COMMIT;