import { NextResponse } from 'next/server'
import db from '@/lib/db'

export async function GET() {
  try {
    const accounts = await db.account.findMany({
      include: {
        category: true,
        images: { orderBy: { order: 'asc' } }
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ accounts })
  } catch (error) {
    console.error('Error fetching accounts:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch accounts',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = formData.get('price') as string
    const shortPreview = formData.get('shortPreview') as string
    const categoryId = formData.get('categoryId') as string
    const exchangeable = formData.get('exchangeable') === 'true'
    const imageUrlsJson = formData.get('imageUrls') as string
    const imageUrls: string[] = imageUrlsJson ? JSON.parse(imageUrlsJson) : []

    if (!name || !description || !price || !categoryId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    const existing = await db.account.findFirst({
      where: { name: name.trim() }
    })

    if (existing) {
      return NextResponse.json({ error: 'Account already exists' }, { status: 400 })
    }

    // Create account
    const account = await db.account.create({
      data: {
        name: name.trim(),
        slug,
        description: description.trim(),
        price: parseFloat(price),
        shortPreview: shortPreview?.trim() || null,
        exchangeable,
        categoryId
      }
    })

    // Create images
    for (let i = 0; i < imageUrls.length; i++) {
      await db.accountImage.create({
        data: {
          url: imageUrls[i],
          accountId: account.id,
          order: i
        }
      })
    }

    // Fetch account with images
    const accountWithImages = await db.account.findUnique({
      where: { id: account.id },
      include: {
        category: true,
        images: { orderBy: { order: 'asc' } }
      }
    })

    return NextResponse.json({ account: accountWithImages })
  } catch (error) {
    console.error('Error creating account:', error)
    return NextResponse.json({ 
      error: 'Failed to create account',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
