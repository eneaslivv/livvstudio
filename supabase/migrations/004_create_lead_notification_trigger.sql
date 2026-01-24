CREATE OR REPLACE FUNCTION notify_new_lead()
RETURNS TRIGGER AS $$
DECLARE
  lead_data jsonb;
BEGIN
  -- Build lead data JSON
  lead_data := jsonb_build_object(
    'name', NEW.name,
    'email', NEW.email,
    'message', NEW.message,
    'created_at', NEW.created_at
  );

  -- Call Edge Function to send email notification
  PERFORM net.http_post(
    url := current_setting('app.settings.supabase_url') || '/functions/v1/notify-new-lead',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
    ),
    body := lead_data
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_new_lead_notify ON leads;
CREATE TRIGGER on_new_lead_notify
  AFTER INSERT ON leads
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_lead();
