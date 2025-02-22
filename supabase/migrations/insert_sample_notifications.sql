-- Insert sample notifications
insert into notifications (type, message, details, priority, scheduled_time)
values
  ('Medicine', 'Take Blood Pressure Medicine', '2 tablets with water', 'high', now() + interval '1 hour'),
  ('Exercise', 'Time for Morning Walk', '15 minutes in garden', 'medium', now() + interval '2 hours'),
  ('Medicine', 'Take Diabetes Medicine', '1 tablet after lunch', 'high', now() + interval '4 hours'),
  ('Activity', 'Memory Game Session', 'Play matching cards game', 'medium', now() + interval '6 hours'),
  ('Social', 'Video Call with Family', 'Call with daughter Sarah', 'high', now() + interval '8 hours');
