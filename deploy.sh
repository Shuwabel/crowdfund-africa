#!/bin/bash

# FundAfrica Deployment Script
echo "🚀 FundAfrica Deployment Script"
echo "================================"

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install it first:"
    echo "npm install -g pnpm"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Build the project
echo "🔨 Building the project..."
pnpm build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🎉 Your FundAfrica app is ready for deployment!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Push your code to GitHub"
    echo "2. Go to https://vercel.com/dashboard"
    echo "3. Click 'New Project' and import your repository"
    echo "4. Add environment variables in Vercel dashboard"
    echo "5. Deploy!"
    echo ""
    echo "🔗 Environment variables to add in Vercel:"
    echo "NEXT_PUBLIC_SUPABASE_URL=https://REDACTED.supabase.co"
    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=REDACTED"
    echo "SUPABASE_SERVICE_ROLE_KEY=REDACTED"
    echo "NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=REDACTED"
    echo "PAYSTACK_SECRET_KEY=REDACTED"
    echo "NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app"
    echo "NEXT_PUBLIC_MAX_FILE_SIZE=10485760"
    echo "NEXT_PUBLIC_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
