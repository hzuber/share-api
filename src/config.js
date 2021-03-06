module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL || "postgresql://postgres@localhost/share_my_stuff",
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || "postgresql://postgres@localhost/share_my_stuff-test",
    CLIENT_ORIGIN: 'https://share-my-stuff.hzuber.now.sh/'
}