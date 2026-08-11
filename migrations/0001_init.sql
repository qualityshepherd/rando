CREATE TABLE hits (
  ts       INTEGER NOT NULL,
  path     TEXT    NOT NULL,
  country  TEXT    NOT NULL DEFAULT '?',
  city     TEXT    NOT NULL DEFAULT '?',
  region   TEXT    NOT NULL DEFAULT '?',
  device   TEXT    NOT NULL DEFAULT 'desktop',
  referrer TEXT    NOT NULL DEFAULT '',
  ip_hash  TEXT    NOT NULL DEFAULT '',
  is_bot   INTEGER NOT NULL DEFAULT 0,
  asn      INTEGER,
  rss_feed TEXT,
  rss_subs INTEGER
);

CREATE INDEX idx_hits_ts ON hits(ts);
