Success. No rows returned


-- Seed some quick hits for testing
INSERT INTO quick_hits (title, completed, sort_order) VALUES
('Invoice #402', false, 0),
('Reply Slack', false, 1),
('Update Linear', false, 2)
ON CONFLICT DO NOTHING;
