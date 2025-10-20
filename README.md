# FundAfrica - Crowdfunding Platform for African Communities

A modern, secure, and scalable crowdfunding platform built with Next.js, Supabase, and TypeScript, specifically designed for African communities.

## 🌟 Features

### Core Functionality
- **Campaign Management**: Create, edit, and manage fundraising campaigns
- **User Authentication**: Secure signup/login with email verification
- **Payment Processing**: Integrated Paystack payment gateway with multiple payment methods
- **File Upload**: Secure image upload for campaigns and profiles
- **Real-time Updates**: Campaign progress tracking and updates
- **Comments System**: Community engagement with nested comments
- **Search & Filtering**: Find campaigns by category, status, and keywords

### Security Features
- **Row Level Security (RLS)**: Database-level security policies
- **Rate Limiting**: API endpoint protection against abuse
- **CSRF Protection**: Cross-site request forgery prevention
- **Input Validation**: Comprehensive data validation and sanitization
- **File Upload Security**: Secure file handling with type validation

### Payment Integration
- **Paystack Integration**: Card payments, USSD, and mobile wallets
- **Multiple Payment Methods**: Support for various African payment options
- **Transaction Tracking**: Complete donation history and status tracking
- **Webhook Handling**: Secure payment verification and status updates

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Supabase account
- Paystack account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd crowdfund-africa
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```bash
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   
   # Payment Configuration
   NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
   PAYSTACK_SECRET_KEY=your_paystack_secret_key
   
   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret_key
   ```

4. **Set up the database**
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Copy and paste the contents of `supabase/schema.sql`
   - Execute the script

5. **Set up storage buckets**
   - Create buckets: `campaign-images`, `profile-images`, `campaign-updates`
   - Configure appropriate policies for public access

6. **Run the development server**
   ```bash
   pnpm dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
crowdfund-africa/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── campaign/          # Campaign pages
│   ├── create/            # Campaign creation
│   ├── donate/            # Donation pages
│   └── explore/           # Campaign discovery
├── components/            # React components
│   ├── ui/                # Reusable UI components
│   └── wizard-steps/      # Campaign creation wizard
├── lib/                   # Utility functions
│   ├── auth.ts            # Authentication utilities
│   ├── campaigns.ts       # Campaign operations
│   ├── donations.ts       # Donation operations
│   ├── payments.ts        # Payment processing
│   ├── security.ts        # Security utilities
│   ├── supabase.ts        # Supabase client
│   └── types.ts           # TypeScript types
├── supabase/              # Database schema
└── public/                # Static assets
```

## 🗄️ Database Schema

### Core Tables
- **profiles**: User profiles and authentication data
- **campaigns**: Fundraising campaigns
- **campaign_updates**: Campaign progress updates
- **donations**: Donation records and payment tracking
- **comments**: User comments on campaigns
- **campaign_follows**: User following campaigns
- **reports**: Content moderation reports

### Key Features
- **Row Level Security**: All tables have RLS policies
- **Automatic Timestamps**: Created/updated timestamps
- **Foreign Key Constraints**: Data integrity
- **Indexes**: Optimized for common queries

## 🔐 Security Implementation

### Authentication
- Supabase Auth with email verification
- Secure session management
- Password strength validation
- Account recovery

### Authorization
- Role-based access control (user, admin, moderator)
- Campaign ownership verification
- API endpoint protection
- Middleware-based route guards

### Data Protection
- Input sanitization and validation
- SQL injection prevention
- XSS protection
- CSRF tokens

### Rate Limiting
- API endpoint rate limiting
- Different limits for different operations
- IP-based tracking
- Graceful degradation

## 💳 Payment Integration

### Supported Payment Methods
- **Card Payments**: Visa, Mastercard, Verve
- **USSD**: Mobile banking codes
- **Mobile Wallets**: Mobile money integration
- **Bank Transfers**: Direct bank transfers

### Payment Flow
1. User initiates donation
2. Payment reference generated
3. Payment gateway integration
4. Webhook verification
5. Campaign amount update
6. Confirmation to user

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Add environment variables
3. Deploy automatically on push

### Manual Deployment
1. Build the application: `pnpm build`
2. Start production server: `pnpm start`
3. Configure reverse proxy (nginx)
4. Set up SSL certificates

### Environment Variables for Production
```bash
# Use production URLs and keys
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_...
PAYSTACK_SECRET_KEY=sk_live_...
```

## 🧪 Testing

### Running Tests
```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Type checking
pnpm type-check

# Linting
pnpm lint
```

### Test Coverage
- Authentication flows
- Payment processing
- File uploads
- API endpoints
- Security measures

## 📊 Monitoring & Analytics

### Built-in Analytics
- Vercel Analytics integration
- Error tracking with detailed logs
- Performance monitoring
- User engagement metrics

### Custom Metrics
- Campaign success rates
- Payment completion rates
- User retention
- Geographic distribution

## 🔧 Configuration

### Environment Variables
See `.env.example` for all required variables.

### Feature Flags
- Enable/disable features via environment variables
- A/B testing capabilities
- Gradual rollout support

### Customization
- Brand colors and themes
- Payment gateway selection
- File upload limits
- Rate limiting thresholds

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### Code Standards
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Conventional commits

### Pull Request Process
1. Ensure all tests pass
2. Update documentation
3. Add appropriate labels
4. Request review from maintainers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [API Documentation](docs/api.md)
- [Deployment Guide](docs/deployment.md)
- [Security Guide](docs/security.md)

### Community
- [GitHub Discussions](https://github.com/your-repo/discussions)
- [Discord Community](https://discord.gg/your-invite)
- [Email Support](mailto:support@fundafrica.com)

### Bug Reports
- Use GitHub Issues
- Include reproduction steps
- Provide environment details
- Add relevant logs

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Core crowdfunding functionality
- ✅ Payment integration
- ✅ User authentication
- ✅ Security implementation

### Phase 2 (Next)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Social media integration

### Phase 3 (Future)
- [ ] AI-powered campaign optimization
- [ ] Blockchain integration
- [ ] International expansion
- [ ] Enterprise features

## 🙏 Acknowledgments

- Supabase for backend infrastructure
- Vercel for deployment platform
- Paystack for payment processing
- Next.js team for the framework
- Open source community for components

---

**Built with ❤️ for African communities**

