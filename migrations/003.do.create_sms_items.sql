CREATE TABLE IF NOT EXISTS sms_items (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    name TEXT NOT NULL,
    type item_type,
    author TEXT,
    borrowed BOOLEAN NOT NULL,
    borrowed_by TEXT,
    borrowed_since TIMESTAMP DEFAULT now(),
    description TEXT,
    owned_by INTEGER REFERENCES sms_users(id) ON DELETE CASCADE
);