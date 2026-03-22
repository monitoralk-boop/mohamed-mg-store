#!/bin/bash

# Mohamed Mg Store - Quick Deploy Script
# Usage: ./scripts/deploy.sh [platform]

set -e

echo "🚀 Mohamed Mg Store - Deployment Helper"
echo "========================================"

PLATFORM=${1:-"vercel"}

case $PLATFORM in
    "vercel")
        echo "📦 Preparing for Vercel deployment..."
        echo ""
        echo "Steps:"
        echo "1. Push your code to GitHub"
        echo "2. Go to vercel.com and import your repository"
        echo "3. Set environment variables:"
        echo "   - DATABASE_URL=file:./data.db (SQLite)"
        echo "   - Or use PostgreSQL connection string"
        echo ""
        echo "✅ vercel.json is configured"
        ;;

    "netlify")
        echo "📦 Preparing for Netlify deployment..."
        echo ""
        echo "Steps:"
        echo "1. Push your code to GitHub"
        echo "2. Go to netlify.com and import your repository"
        echo "3. Set environment variables in Site Settings"
        echo ""
        echo "✅ netlify.toml is configured"
        ;;

    "docker")
        echo "📦 Building Docker image..."
        docker build -t mohamed-mg-store .
        echo ""
        echo "✅ Docker image built successfully!"
        echo ""
        echo "To run:"
        echo "  docker run -p 3000:3000 -v \$(pwd)/data:/app/data mohamed-mg-store"
        ;;

    "railway")
        echo "📦 Preparing for Railway deployment..."
        echo ""
        echo "Steps:"
        echo "1. Push your code to GitHub"
        echo "2. Go to railway.app and create new project"
        echo "3. Deploy from GitHub repo"
        echo "4. Add PostgreSQL database"
        echo "5. Rename prisma/schema.postgresql.prisma to prisma/schema.prisma"
        ;;

    *)
        echo "❌ Unknown platform: $PLATFORM"
        echo "Usage: ./scripts/deploy.sh [vercel|netlify|docker|railway]"
        exit 1
        ;;
esac

echo ""
echo "📚 For detailed instructions, see DEPLOYMENT.md"
