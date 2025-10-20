-- Migration: Add payment account fields to campaigns table
-- Run this in your Supabase SQL editor

ALTER TABLE public.campaigns 
ADD COLUMN IF NOT EXISTS account_name TEXT,
ADD COLUMN IF NOT EXISTS account_number TEXT,
ADD COLUMN IF NOT EXISTS bank_name TEXT;

-- Update the campaigns table comment
COMMENT ON COLUMN public.campaigns.account_name IS 'Account holder name for payment processing';
COMMENT ON COLUMN public.campaigns.account_number IS 'Bank account number for payment processing';
COMMENT ON COLUMN public.campaigns.bank_name IS 'Bank name for payment processing';
