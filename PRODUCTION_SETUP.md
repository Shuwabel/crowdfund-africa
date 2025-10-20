# Production Configuration for FundAfrica

## Environment Variables
Create a `.env.local` file with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://REDACTED.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=REDACTED
SUPABASE_SERVICE_ROLE_KEY=REDACTED

# Payment Configuration (Replace with your actual keys)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_your_paystack_public_key
PAYSTACK_SECRET_KEY=REDACTED_paystack_secret_key

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXTAUTH_SECRET=your_nextauth_secret_key_minimum_32_characters
NEXTAUTH_URL=https://your-domain.com

# File Upload Configuration
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
NEXT_PUBLIC_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp

# Email Configuration (Optional - for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## Database Setup

1. **Run the SQL schema**:
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Copy and paste the contents of `supabase/schema.sql`
   - Execute the script

2. **Set up Storage buckets**:
   - Create buckets for: `campaign-images`, `profile-images`, `campaign-updates`
   - Set appropriate policies for public access

3. **Configure Row Level Security**:
   - The schema includes RLS policies
   - Test with different user roles

## Payment Integration

1. **Paystack Setup**:
   - Create account at https://paystack.com
   - Get your live API keys (replace test keys in production)
   - Configure webhook URL: `https://your-app-name.vercel.app/api/payments/paystack/callback`
   - Test with Paystack's test cards

2. **Alternative Payment Methods**:
   - Implement Flutterwave for broader African coverage
   - Add mobile money options (MTN, Airtel, etc.)

## Security Measures

1. **Environment Security**:
   - Never commit `.env.local` to version control
   - Use different keys for development and production
   - Rotate keys regularly

2. **API Security**:
   - Implement rate limiting
   - Add request validation
   - Use HTTPS in production

3. **Database Security**:
   - Review RLS policies
   - Monitor for suspicious activity
   - Regular backups

## Deployment

### Vercel (Recommended)

1. **Connect Repository**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect Next.js

2. **Environment Variables**:
   Add these in Vercel dashboard under Settings > Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://REDACTED.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=REDACTED
   SUPABASE_SERVICE_ROLE_KEY=REDACTED
   NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=REDACTED
   PAYSTACK_SECRET_KEY=REDACTED
   NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
   NEXT_PUBLIC_MAX_FILE_SIZE=10485760
   NEXT_PUBLIC_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp
   ```

3. **Deploy**:
   - Click "Deploy" in Vercel dashboard
   - Your app will be live at `https://your-app-name.vercel.app`

4. **Custom Domain** (Optional):
   - Add custom domain in Vercel dashboard
   - Update `NEXT_PUBLIC_APP_URL` to your custom domain

### Alternative Platforms

1. **Netlify**:
   - Build command: `npm run build`
   - Publish directory: `.next`

2. **Railway/Render**:
   - Use Node.js environment
   - Set environment variables

## Performance Optimization

1. **Image Optimization**:
   - Use Next.js Image component
   - Implement lazy loading
   - Compress images before upload

2. **Database Optimization**:
   - Add indexes for frequently queried fields
   - Use database connection pooling
   - Implement caching strategies

3. **CDN Setup**:
   - Use Vercel's Edge Network
   - Configure Supabase CDN for images

## Monitoring & Analytics

1. **Error Tracking**:
   - Integrate Sentry for error monitoring
   - Set up alerts for critical errors

2. **Analytics**:
   - Google Analytics 4
   - Vercel Analytics (already included)

3. **Performance Monitoring**:
   - Core Web Vitals tracking
   - Database query performance

## Backup Strategy

1. **Database Backups**:
   - Supabase automatic backups
   - Export data regularly

2. **File Storage**:
   - Backup uploaded images
   - Use multiple storage providers

## Testing

1. **Unit Tests**:
   ```bash
   npm install --save-dev jest @testing-library/react
   npm test
   ```

2. **Integration Tests**:
   - Test payment flows
   - Test authentication flows
   - Test file uploads

3. **E2E Tests**:
   ```bash
   npm install --save-dev playwright
   npx playwright test
   ```

## Maintenance

1. **Regular Updates**:
   - Keep dependencies updated
   - Security patches
   - Feature updates

2. **Monitoring**:
   - Check error logs daily
   - Monitor payment success rates
   - Track user engagement

3. **Scaling**:
   - Monitor database performance
   - Scale storage as needed
   - Optimize for mobile users

## Legal Compliance

1. **Terms of Service**:
   - Create comprehensive ToS
   - Include payment terms
   - Data protection clauses

2. **Privacy Policy**:
   - GDPR compliance
   - Data collection practices
   - User rights

3. **Payment Compliance**:
   - PCI DSS compliance
   - Local payment regulations
   - Tax reporting requirements

