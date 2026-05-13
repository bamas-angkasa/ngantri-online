INSERT INTO users (id, name, email, password_hash, role_global)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Adi Owner', 'owner@barberadi.test', NULL, 'customer'),
  ('00000000-0000-0000-0000-000000000002', 'Rina Customer', 'rina@customer.test', NULL, 'customer')
ON CONFLICT (email) DO NOTHING;

INSERT INTO businesses (id, owner_id, name, slug, logo_url, description, subscription_plan, subscription_status)
VALUES (
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Barber Adi',
  'barber-adi',
  NULL,
  'Barbershop lokal dengan antrean realtime dari Ngantri.',
  'free',
  'active'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO business_members (business_id, user_id, role)
VALUES (
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'owner'
)
ON CONFLICT (business_id, user_id) DO NOTHING;

INSERT INTO branches (id, business_id, name, slug, address, phone)
VALUES
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Barber Adi Sawojajar', 'sawojajar', 'Sawojajar, Malang', '+6281200000001'),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Barber Adi Sulfat', 'sulfat', 'Sulfat, Malang', '+6281200000002')
ON CONFLICT (business_id, slug) DO NOTHING;

INSERT INTO branch_staff (id, branch_id, name, role_label)
VALUES
  ('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'Adi', 'Capster'),
  ('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 'Raka', 'Capster'),
  ('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002', 'Bima', 'Capster')
ON CONFLICT DO NOTHING;

INSERT INTO services (id, business_id, name, duration_minutes, price, is_active)
VALUES
  ('40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Potong Rambut', 20, 35000, true),
  ('40000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Cukur Jenggot', 10, 20000, true),
  ('40000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 'Hair Wash', 15, 15000, true),
  ('40000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001', 'Coloring', 90, 150000, true)
ON CONFLICT DO NOTHING;

INSERT INTO themes (business_id, template_name, primary_color, secondary_color)
VALUES ('10000000-0000-0000-0000-000000000001', 'Masculine', '#2563EB', '#F59E0B')
ON CONFLICT (business_id) DO NOTHING;

INSERT INTO subscriptions (business_id, plan, monthly_queue_limit, branch_limit, current_period_start, current_period_end, status)
VALUES ('10000000-0000-0000-0000-000000000001', 'free', 10, 1, date_trunc('month', now())::date, (date_trunc('month', now()) + interval '1 month - 1 day')::date, 'active')
ON CONFLICT (business_id) DO NOTHING;
