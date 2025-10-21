-- Sample campaigns to populate the database
-- Run this in your Supabase SQL Editor

-- First, let's check if we have any profiles to work with
-- If not, we'll create some sample profiles first

-- Insert sample profiles (replace with actual user IDs if you have them)
INSERT INTO public.profiles (id, email, full_name, is_verified) 
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'foundation@waterforlife.org', 'Water for Life Foundation', true),
  ('22222222-2222-2222-2222-222222222222', 'education@edufirst.org', 'Education First Initiative', true),
  ('33333333-3333-3333-3333-333333333333', 'health@carefoundation.org', 'Health Care Foundation', true),
  ('44444444-4444-4444-4444-444444444444', 'business@agriwomen.org', 'AgriWomen Collective', true),
  ('55555555-5555-5555-5555-555555555555', 'community@ruralaid.org', 'Rural Aid Community', false)
ON CONFLICT (id) DO NOTHING;

-- Insert sample campaigns
INSERT INTO public.campaigns (
  id,
  creator_id,
  title,
  description,
  story,
  category,
  goal_amount,
  current_amount,
  status,
  featured_image_url,
  images,
  is_featured,
  is_verified,
  end_date,
  account_name,
  account_number,
  bank_name
) VALUES 
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '11111111-1111-1111-1111-111111111111',
    'Clean Water for Rural Communities',
    'Providing clean, safe drinking water to rural communities across Nigeria through the installation of water wells and purification systems.',
    'Access to clean water is a fundamental human right, yet millions of people in rural Nigeria still lack this basic necessity. Our Water for Life Foundation has been working tirelessly to bring clean water to underserved communities.

Through this campaign, we aim to:
- Install 10 new water wells in rural communities
- Provide water purification systems for existing contaminated sources
- Train local community members on water maintenance and hygiene
- Establish sustainable water management programs

Each well costs approximately ₦500,000 to install and maintain. With your support, we can transform lives and ensure that no family has to walk miles for clean water.

Your donation will directly fund:
- Well drilling and installation
- Water purification equipment
- Community training programs
- Maintenance and sustainability initiatives

Together, we can make clean water accessible to everyone.',
    'community',
    5000000,
    2500000,
    'active',
    '/campaign-water-well.jpg',
    ARRAY['/campaign-water-well.jpg', '/african-community-helping-each-other.jpg'],
    true,
    true,
    NOW() + INTERVAL '45 days',
    'Water for Life Foundation',
    '1234567890',
    'Access Bank'
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '22222222-2222-2222-2222-222222222222',
    'School Supplies for 500 Children',
    'Providing essential school supplies, textbooks, and learning materials to 500 children in underserved communities to support their education.',
    'Education is the key to breaking the cycle of poverty, but many children in our communities cannot afford basic school supplies. The Education First Initiative is committed to ensuring every child has the tools they need to succeed in school.

This campaign will provide:
- School bags and stationery for 500 children
- Textbooks and learning materials
- Uniforms for children in need
- Teacher training workshops
- School infrastructure improvements

Each child''s complete school package costs ₦2,400, including:
- School bag
- Notebooks, pens, pencils, erasers
- Textbooks for core subjects
- Calculator and geometry set
- School uniform

Your support will directly impact a child''s ability to attend school and excel in their studies. Education is an investment in our future, and every child deserves the opportunity to learn and grow.',
    'education',
    1200000,
    850000,
    'active',
    '/campaign-school-supplies.jpg',
    ARRAY['/campaign-school-supplies.jpg', '/campaign-scholarship.jpg'],
    true,
    true,
    NOW() + INTERVAL '30 days',
    'Education First Initiative',
    '2345678901',
    'First Bank'
  ),
  (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    '33333333-3333-3333-3333-333333333333',
    'Medical Equipment for Rural Clinic',
    'Equipping a rural health clinic with essential medical equipment to provide better healthcare services to the community.',
    'Access to quality healthcare should not be limited by location. Our rural clinic serves over 5,000 people but lacks essential medical equipment. With your help, we can transform this clinic into a fully equipped healthcare facility.

The clinic urgently needs:
- Portable ultrasound machine
- Digital blood pressure monitors
- Oxygen concentrator
- Patient monitoring systems
- Laboratory equipment
- Emergency response equipment

This equipment will enable us to:
- Provide accurate diagnoses
- Monitor patient conditions effectively
- Respond to medical emergencies
- Conduct essential laboratory tests
- Improve overall patient care

Your donation will help save lives and improve the health outcomes for thousands of people in our community. Every contribution brings us closer to providing world-class healthcare services to those who need it most.',
    'health',
    3000000,
    1800000,
    'active',
    '/campaign-medical.jpg',
    ARRAY['/campaign-medical.jpg'],
    true,
    true,
    NOW() + INTERVAL '60 days',
    'Health Care Foundation',
    '3456789012',
    'GTBank'
  ),
  (
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    '44444444-4444-4444-4444-444444444444',
    'Start-up Capital for Women Farmers',
    'Providing microloans and agricultural training to women farmers to help them start and scale their farming businesses.',
    'Women farmers are the backbone of our agricultural sector, yet they often lack access to capital and modern farming techniques. The AgriWomen Collective is empowering women farmers through microloans, training, and support.

This program will provide:
- Microloans of ₦50,000-₦200,000 per farmer
- Modern farming equipment and seeds
- Training in sustainable farming practices
- Market access and business development support
- Mentorship and peer support networks

Each woman farmer will receive:
- Initial capital for seeds and equipment
- Training in modern farming techniques
- Access to agricultural extension services
- Support in finding markets for their produce
- Financial literacy training

Your investment in these women farmers will:
- Increase food production and security
- Create sustainable livelihoods
- Empower women economically
- Strengthen local communities
- Promote sustainable agriculture

Together, we can help these women farmers build successful, sustainable businesses that benefit their families and communities.',
    'business',
    2000000,
    450000,
    'active',
    '/campaign-farming.jpg',
    ARRAY['/campaign-farming.jpg'],
    false,
    true,
    NOW() + INTERVAL '90 days',
    'AgriWomen Collective',
    '4567890123',
    'Zenith Bank'
  ),
  (
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    '55555555-5555-5555-5555-555555555555',
    'Emergency Relief Fund',
    'Providing immediate relief and support to families affected by natural disasters and economic hardships in rural communities.',
    'When disaster strikes, families need immediate support to rebuild their lives. Our Emergency Relief Fund provides critical assistance to families facing unexpected hardships, including natural disasters, economic crises, and health emergencies.

This fund will provide:
- Emergency food supplies and clean water
- Temporary shelter and housing assistance
- Medical care and medication
- School supplies for children
- Livelihood restoration support

Your donation will help families:
- Meet their immediate basic needs
- Access emergency medical care
- Keep children in school
- Rebuild their livelihoods
- Restore hope and dignity

Every contribution, no matter the size, makes a difference in someone''s life during their most difficult time. Together, we can provide a safety net for families when they need it most.',
    'emergency',
    1500000,
    320000,
    'active',
    '/african-people-celebrating-success.jpg',
    ARRAY['/african-people-celebrating-success.jpg'],
    false,
    false,
    NOW() + INTERVAL '120 days',
    'Rural Aid Community',
    '5678901234',
    'Union Bank'
  )
ON CONFLICT (id) DO NOTHING;

-- Insert some sample donations to make the campaigns look more realistic
INSERT INTO public.donations (
  id,
  campaign_id,
  donor_id,
  amount,
  message,
  is_anonymous,
  payment_method,
  payment_reference,
  status
) VALUES 
  ('f1111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NULL, 50000, 'Great cause! Keep up the good work.', false, 'card', 'PAY_001', 'completed'),
  ('f2222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NULL, 25000, 'Every child deserves clean water.', true, 'card', 'PAY_002', 'completed'),
  ('f3333333-3333-3333-3333-333333333333', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', NULL, 100000, 'Education is the future!', false, 'card', 'PAY_003', 'completed'),
  ('f4444444-4444-4444-4444-444444444444', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', NULL, 50000, 'Supporting our children''s education.', false, 'card', 'PAY_004', 'completed'),
  ('f5555555-5555-5555-5555-555555555555', 'cccccccc-cccc-cccc-cccc-cccccccccccc', NULL, 75000, 'Healthcare for all!', false, 'card', 'PAY_005', 'completed')
ON CONFLICT (id) DO NOTHING;
