CREATE DATABASE wiki;

\c wiki;

CREATE TABLE summaries (
    id INTEGER PRIMARY KEY,
    summary TEXT
);

CREATE INDEX idx_summaries_id ON summaries(id);