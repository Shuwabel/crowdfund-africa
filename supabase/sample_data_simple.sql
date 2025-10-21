-- Simple sample campaigns that will work with any existing user
-- Run this in your Supabase SQL Editor

-- First, let's check if you have any users and create campaigns accordingly
-- This will work whether you have users or not

-- Option 1: If you have users, use the first one
-- Option 2: If no users, we'll create campaigns without creator_id temporarily

-- Let's try to create campaigns using existing users first
DO $$
DECLARE
    first_user_id UUID;
BEGIN
    -- Try to get the first user ID
    SELECT id INTO first_user_id FROM auth.users LIMIT 1;
    
    IF first_user_id IS NOT NULL THEN
        -- We have users, create campaigns with the first user
        INSERT INTO public.campaigns (
            id, creator_id, title, description, story, category, goal_amount, current_amount, 
            status, featured_image_url, images, is_featured, is_verified, end_date,
            account_name, account_number, bank_name
        ) VALUES 
        (
            'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
            first_user_id,
            'Clean Water for Rural Communities',
            'Providing clean, safe drinking water to rural communities across Nigeria through the installation of water wells and purification systems.',
            'Access to clean water is a fundamental human right, yet millions of people in rural Nigeria still lack this basic necessity. Our Water for Life Foundation has been working tirelessly to bring clean water to underserved communities.

Through this campaign, we aim to:
- Install 10 new water wells in rural communities
- Provide water purification systems for existing contaminated sources
- Train local community members on water maintenance and hygiene
- Establish sustainable water management programs

Each well costs approximately ₦500,000 to install and maintain. With your support, we can transform lives and ensure that no family has to walk miles for clean water.',
            'community',
            5000000,
            2500000,
            'active',
            '/campaign-water-well.jpg',
            ARRAY['/campaign-water-well.jpg'],
            true,
            true,
            NOW() + INTERVAL '45 days',
            'Water for Life Foundation',
            '1234567890',
            'Access Bank'
        ),
        (
            'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
            first_user_id,
            'School Supplies for 500 Children',
            'Providing essential school supplies, textbooks, and learning materials to 500 children in underserved communities to support their education.',
            'Education is the key to breaking the cycle of poverty, but many children in our communities cannot afford basic school supplies. The Education First Initiative is committed to ensuring every child has the tools they need to succeed in school.

This campaign will provide:
- School bags and stationery for 500 children
- Textbooks and learning materials
- Uniforms for children in need
- Teacher training workshops
- School infrastructure improvements',
            'education',
            1200000,
            850000,
            'active',
            '/campaign-school-supplies.jpg',
            ARRAY['/campaign-school-supplies.jpg'],
            true,
            true,
            NOW() + INTERVAL '30 days',
            'Education First Initiative',
            '2345678901',
            'First Bank'
        ),
        (
            'cccccccc-cccc-cccc-cccc-cccccccccccc',
            first_user_id,
            'Medical Equipment for Rural Clinic',
            'Equipping a rural health clinic with essential medical equipment to provide better healthcare services to the community.',
            'Access to quality healthcare should not be limited by location. Our rural clinic serves over 5,000 people but lacks essential medical equipment. With your help, we can transform this clinic into a fully equipped healthcare facility.',
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
            first_user_id,
            'Start-up Capital for Women Farmers',
            'Providing microloans and agricultural training to women farmers to help them start and scale their farming businesses.',
            'Women farmers are the backbone of our agricultural sector, yet they often lack access to capital and modern farming techniques. The AgriWomen Collective is empowering women farmers through microloans, training, and support.',
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
            first_user_id,
            'Emergency Relief Fund',
            'Providing immediate relief and support to families affected by natural disasters and economic hardships in rural communities.',
            'When disaster strikes, families need immediate support to rebuild their lives. Our Emergency Relief Fund provides critical assistance to families facing unexpected hardships.',
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
        
        RAISE NOTICE 'Campaigns created successfully using existing user: %', first_user_id;
    ELSE
        RAISE NOTICE 'No users found. Please create a user account first by signing up on the platform.';
    END IF;
END $$;
