# Deployment Guide - Mohamed Mg Game Accounts Store

This guide covers deploying your game accounts store to various hosting platforms.

## 📋 Prerequisites

1. **GitHub Account** - To store your code
2. **Hosting Account** - Choose one:
   - [Vercel](https://vercel.com) (Recommended for Next.js)
   - [Netlify](https://netlify.com)
   - [Railway](https://railway.app)

## 🔧 Environment Variables

Create these environment variables on your hosting platform:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | SQLite database path | `file:./data.db` |
| `NODE_ENV` | Environment mode | `production` |

---

## 🚀 Option 1: Deploy to Vercel (Recommended)

Vercel is the best option for Next.js applications with zero configuration.

### Step 1: Push to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Mohamed Mg Store"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/mohamed-mg-store.git

# Push to GitHub
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings
5. Click **"Deploy"**

### Step 3: Configure Database

For production, you have two options:

#### Option A: SQLite (Simple, but ephemeral on Vercel)
The app is configured to use SQLite by default. Data persists between deployments.

#### Option B: PostgreSQL (Recommended for Production)
1. Create a PostgreSQL database on [Neon](https://neon.tech) (free tier) or [Railway](https://railway.app)
2. Update your `DATABASE_URL` environment variable in Vercel
3. Update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Vercel Configuration File

The `vercel.json` file is already included in the project root.

---

## 🌐 Option 2: Deploy to Netlify

### Step 1: Push to GitHub

Same as Vercel Step 1 above.

### Step 2: Deploy on Netlify

1. Go to [netlify.com](https://netlify.com) and sign in with GitHub
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect your GitHub repository
4. Build settings are auto-detected from `netlify.toml`
5. Click **"Deploy site"**

### Step 3: Configure Environment Variables

1. Go to **Site Settings** → **Environment Variables**
2. Add `DATABASE_URL` if using external database

---

## 🚂 Option 3: Deploy to Railway

Railway provides full server access with persistent storage.

### Step 1: Push to GitHub

Same as Vercel Step 1 above.

### Step 2: Deploy on Railway

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. Railway will auto-detect Next.js

### Step 3: Add PostgreSQL Database

1. In your Railway project, click **"+"** → **"Database"** → **"PostgreSQL"**
2. Railway will automatically set `DATABASE_URL`
3. Update `prisma/schema.prisma` to use PostgreSQL:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

---

## 🐳 Option 4: Docker Deployment

### Build and Run with Docker

```bash
# Build the Docker image
docker build -t mohamed-mg-store .

# Run the container
docker run -p 3000:3000 -v $(pwd)/data:/app/data mohamed-mg-store
```

### Docker Compose (with PostgreSQL)

```bash
docker-compose up -d
```

---

## 📱 Option 5: VPS / Self-Hosted Server

### Requirements
- Ubuntu 20.04+ or similar
- Node.js 18+ or Bun
- Nginx (optional, for reverse proxy)

### Steps

```bash
# 1. Clone your repository
git clone https://github.com/YOUR_USERNAME/mohamed-mg-store.git
cd mohamed-mg-store

# 2. Install Bun (or Node.js)
curl -fsSL https://bun.sh/install | bash

# 3. Install dependencies
bun install

# 4. Set up environment
cp .env.example .env
# Edit .env with your settings

# 5. Build and start
bun run build
bun run start

# 6. (Optional) Set up PM2 for process management
npm install -g pm2
pm2 start bun -- run start
pm2 save
pm2 startup
```

---

## 🔒 Security Recommendations for Production

1. **Change Admin Password**: Update the password in `src/app/page.tsx` (line ~497):
   ```javascript
   if (password === 'YOUR_NEW_SECURE_PASSWORD')
   ```

2. **Use Environment Variable for Password**:
   ```javascript
   if (password === process.env.ADMIN_PASSWORD)
   ```

3. **Add Rate Limiting** for admin login attempts

4. **Use HTTPS** (automatic on Vercel/Netlify)

5. **Regular Backups** of your database

---

## 📁 Project Structure for Deployment

```
├── prisma/
│   └── schema.prisma      # Database schema
├── public/
│   └── uploads/           # Uploaded images (may need cloud storage for production)
├── src/
│   ├── app/               # Next.js App Router
│   ├── components/        # React components
│   └── lib/               # Utilities
├── vercel.json            # Vercel configuration
├── netlify.toml           # Netlify configuration
├── Dockerfile             # Docker configuration
├── docker-compose.yml     # Docker Compose (optional)
└── .env.example           # Environment variables template
```

---

## ⚠️ Important Notes

### File Uploads (Images)

For production hosting on Vercel/Netlify:
- These platforms have **ephemeral file systems** - uploaded images may be deleted
- Consider using cloud storage:
  - [Cloudinary](https://cloudinary.com) (free tier)
  - [AWS S3](https://aws.amazon.com/s3)
  - [Supabase Storage](https://supabase.com)

### Database

- **SQLite** works well for small stores with Railway/VPS
- **PostgreSQL** is recommended for Vercel/Netlify with higher traffic

---

## 🆘 Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf .next node_modules
bun install
bun run build
```

### Database Errors
```bash
# Reset database
bun run db:push
```

### Images Not Showing
- Check `public/uploads` directory permissions
- Consider migrating to cloud storage

---

## 📞 Support

If you encounter issues:
1. Check the platform's deployment logs
2. Verify environment variables are set correctly
3. Ensure database migrations have run

---

**Happy Deploying! 🚀**
