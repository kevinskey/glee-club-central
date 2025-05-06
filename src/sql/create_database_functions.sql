
-- Function to get attendance records for a member
CREATE OR REPLACE FUNCTION get_attendance_records(p_member_id UUID)
RETURNS JSONB
LANGUAGE SQL
AS $$
  SELECT 
    json_agg(
      json_build_object(
        'id', a.id,
        'member_id', a.member_id,
        'status', a.status,
        'notes', a.notes,
        'created_at', a.created_at,
        'calendar_events', json_build_object(
          'title', ce.title,
          'date', ce.date,
          'time', ce.time,
          'location', ce.location
        )
      )
    )
  FROM attendance a
  LEFT JOIN calendar_events ce ON a.event_id = ce.id
  WHERE a.member_id = p_member_id
  ORDER BY a.created_at DESC
  LIMIT 10;
$$;

-- Function to get payment records for a member
CREATE OR REPLACE FUNCTION get_payment_records(p_member_id UUID)
RETURNS JSONB
LANGUAGE SQL
AS $$
  SELECT 
    json_agg(
      json_build_object(
        'id', id,
        'member_id', member_id,
        'amount', amount,
        'payment_date', payment_date,
        'payment_method', payment_method,
        'status', status,
        'description', description
      )
    )
  FROM payments
  WHERE member_id = p_member_id
  ORDER BY payment_date DESC
  LIMIT 10;
$$;

-- Function to get member notes
CREATE OR REPLACE FUNCTION get_member_notes(p_member_id UUID)
RETURNS JSONB
LANGUAGE SQL
AS $$
  SELECT 
    json_agg(
      json_build_object(
        'id', mn.id,
        'member_id', mn.member_id,
        'note', mn.note,
        'created_at', mn.created_at,
        'created_by', mn.created_by,
        'created_by_profile', json_build_object(
          'first_name', p.first_name,
          'last_name', p.last_name
        )
      )
    )
  FROM member_notes mn
  LEFT JOIN profiles p ON mn.created_by = p.id
  WHERE mn.member_id = p_member_id
  ORDER BY mn.created_at DESC;
$$;

-- Function to get all sections
CREATE OR REPLACE FUNCTION get_sections()
RETURNS JSONB
LANGUAGE SQL
AS $$
  SELECT 
    json_agg(
      json_build_object(
        'id', id,
        'name', name,
        'description', description,
        'section_leader_id', section_leader_id
      )
    )
  FROM sections
  ORDER BY name;
$$;

-- Function to get sections with member count
CREATE OR REPLACE FUNCTION get_sections_with_member_count()
RETURNS JSONB
LANGUAGE SQL
AS $$
  SELECT 
    json_agg(
      json_build_object(
        'id', s.id,
        'name', s.name,
        'description', s.description,
        'section_leader_id', s.section_leader_id,
        'member_count', COALESCE(count(p.id), 0)
      )
    )
  FROM sections s
  LEFT JOIN profiles p ON s.id = p.section_id
  GROUP BY s.id, s.name
  ORDER BY s.name;
$$;

-- Function to get members with section data
CREATE OR REPLACE FUNCTION get_members_with_sections()
RETURNS JSONB
LANGUAGE SQL
AS $$
  SELECT 
    json_agg(
      json_build_object(
        'id', p.id,
        'first_name', p.first_name,
        'last_name', p.last_name,
        'email', p.email,
        'phone', p.phone,
        'voice_part', p.voice_part,
        'avatar_url', p.avatar_url,
        'role', p.role,
        'status', p.status,
        'section_id', p.section_id,
        'join_date', p.join_date,
        'sections', json_build_object(
          'id', s.id,
          'name', s.name
        )
      )
    )
  FROM profiles p
  LEFT JOIN sections s ON p.section_id = s.id
  ORDER BY p.last_name, p.first_name;
$$;
