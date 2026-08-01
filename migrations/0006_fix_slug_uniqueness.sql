PRAGMA foreign_keys=OFF;

CREATE TABLE links_new (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  slug TEXT NOT NULL,
  destination_url TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  show_preview INTEGER NOT NULL DEFAULT 0,
  expires_at INTEGER,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO links_new SELECT id, user_id, slug, destination_url, created_at, show_preview, expires_at FROM links;

DROP TABLE links;
ALTER TABLE links_new RENAME TO links;

CREATE UNIQUE INDEX idx_links_user_slug ON links(user_id, slug);
CREATE INDEX idx_links_user_id ON links(user_id);

PRAGMA foreign_keys=ON;
