ALTER TABLE sessions ADD COLUMN user_agent TEXT;
ALTER TABLE sessions ADD COLUMN ip_hash TEXT;
ALTER TABLE sessions ADD COLUMN last_seen INTEGER;
