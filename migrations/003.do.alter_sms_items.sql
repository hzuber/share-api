CREATE TYPE item_type AS ENUM (
    'Household',
    'Electronics',
    'Book',
    'Garden',
    'Tools',
    'Toys'
);


ALTER TABLE sms_items
    ADD COLUMN
        type item_type;