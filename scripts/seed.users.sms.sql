BEGIN;

TRUNCATE
  sms_users
  RESTART IDENTITY CASCADE;

INSERT INTO sms_users (name, password, pw_hint, email, number)
VALUES
    ('Hannah Zuber', '$2a$12$t3Wc4iaZ2nVdmuh8zGKatewMPMJJ/ddPAasaRcI/SG518DRA4Yy96', null, 'hannahzuber@email.com', '1234567890'),
    ('Amy Green', '$2a$12$cfDzxYm2GvYkeNF/plOlI.v/q5MZvTzmmWYTj7xiky2nGLO2ltuO.', 'pw2', 'amygreen@email.com', '1234567890'),
    ('Jonah Hill', '$2a$12$44Jps6Mq7pjpgD9WCIXEbui7S4DrGRPzGCXT2XYBGBrsZcLhPq/gS', null, 'jonahhill@email.com', '1234567890'),
    ('Chris Evans', 'a$2a$12$OryEzvpbgczJUHsUeEqqO.pzQShKd/K7rt3BvzPckbg/zRLh4IBp6', 'my butt', 'cap@email.com', '1234567890'),
    ('Kristen Bell', '$2a$12$DXGab5i6aF.ryH1mq/Bnguqp7pWghbkN.AetJw/TeCdsyD.1cjOL2', 'anna', 'kristenbell@email.com', '1234567890'),
    ('Tahani Al Jamil', '$2a$12$QRr.5lYMmN8dSbS1y4Y9CO2CSs4TvNcTmHnKiVCmUQzK9deLfUhHa', 'mybestfriend', 'tahani@email.com', '1234567890'),
    ('Jason Mendoza', '$2a$12$K0ohDhfy1d27Ef6X/P2A7ed0t9ePibwyiSBNAHt70H5vjjQk4ihli', null, 'dancedance@email.com', '1234567890'),
    ('Chidi Anagonye', '$2a$12$Q8jmq3N5wwd3Ilz8XIwjSeo4TeRoOsrHuPWwEW7pWZyMZqLvVmjjq', null, 'ethics4eva@email.com', '1234567890')
;
COMMIT;