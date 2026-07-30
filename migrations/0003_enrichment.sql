ALTER TABLE click_events ADD COLUMN os_version TEXT;
ALTER TABLE click_events ADD COLUMN is_in_app_browser INTEGER DEFAULT 0;
ALTER TABLE click_events ADD COLUMN bot_score_reasons TEXT;
