BEGIN;
INSERT INTO sms_users (name, password, pw_hint, email, number)
VALUES
    ('Hannah Zuber', 'password1', null, 'hannahzuber@email.com', '1234567890'),
    ('Amy Green', 'password2', 'pw2', 'amygreen@email.com', '1234567890'),
    ('Jonah Hill', 'hilltop', null, 'jonahhill@email.com', '1234567890'),
    ('Chris Evans', 'americasass', 'my butt', 'cap@email.com', '1234567890'),
    ('Kristen Bell', 'frozen', 'anna', 'kristenbell@email.com', '1234567890'),
    ('Tahani Al Jamil', 'ladygaga', 'mybestfriend', 'tahani@email.com', '1234567890'),
    ('Jason Mendoza', 'blakebortles', null, 'dancedance@email.com', '1234567890'),
    ('Chidi Anagonye', 'kirkegaard', null, 'ethics4eva@email.com', '1234567890')
;
COMMIT;