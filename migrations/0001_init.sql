CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  plan_tier TEXT NOT NULL DEFAULT 'free',
  stripe_customer_id TEXT,
  created_at INTEGER NOT NULL
);

CREATE TABLE links (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  destination_url TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE click_events (
  id TEXT PRIMARY KEY,
  link_id TEXT NOT NULL,
  timestamp INTEGER NOT NULL,
  country TEXT,
  city TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_asn TEXT,
  bot_score INTEGER,
  tcp_rtt INTEGER,
  http_protocol TEXT,
  tls_version TEXT,
  colo TEXT,
  accept_language TEXT,
  ip_hash TEXT,
  raw_headers TEXT,
  FOREIGN KEY (link_id) REFERENCES links(id)
);

CREATE INDEX idx_links_slug ON links(slug);
CREATE INDEX idx_links_user_id ON links(user_id);
CREATE INDEX idx_click_events_link_id ON click_events(link_id);
