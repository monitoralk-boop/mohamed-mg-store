import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function GET() {
  try {
    const accounts = await db.account.findMany({
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ accounts })
  } catch (error) {
    console.error('Error fetching accounts:', error)
    return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 })
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
    const images = formData.getAll('images') as File[]

    if (!name || !description || !price || !categoryId) {
      return NextResponse.json({ error: 'Name, description, price, and category are required' }, { status: 400 })
    }

    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    // Check if account with same name exists
    const existing = await db.account.findFirst({
      where: { name: name.trim() }
    })

    if (existing) {
      return NextResponse.json({ error: 'Account with this name already exists' }, { status: 400 })
    }

    // Verify category exists
    const category = await db.category.findUnique({
      where: { id: categoryId }
    })

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 400 })
    }

    // Create account first
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

    // Upload and save images
    if (images && images.length > 0 && images[0].size > 0) {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads')
      await mkdir(uploadDir, { recursive: true })

      for (let i = 0; i < images.length; i++) {
        const image = images[i]
        const bytes = await image.arrayBuffer()
        const buffer = Buffer.from(bytes)
        
        const fileName = `${Date.now()}-${i}-${image.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
        const filePath = path.join(uploadDir, fileName)
        
        await writeFile(filePath, buffer)
        
        await db.accountImage.create({
          data: {
            url: `/uploads/${fileName}`,
            accountId: account.id,
            order: i
          }
        })
      }
    }

    // Fetch the complete account with images
    const completeAccount = await db.account.findUnique({
      where: { id: account.id },
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' }
        }
      }
    })

    return NextResponse.json({ account: completeAccount })
  } catch (error) {
    console.error('Error creating account:', error)
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
  }
}
