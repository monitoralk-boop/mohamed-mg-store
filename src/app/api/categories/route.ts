import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function GET() {
  try {
    const categories = await db.category.findMany({
      orderBy: { name: 'asc' }
    })
    return NextResponse.json({ categories })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const name = formData.get('name') as string
    const image = formData.get('image') as File | null

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    // Check if category with same name or slug exists
    const existing = await db.category.findFirst({
      where: {
        OR: [
          { name: name.trim() },
          { slug }
        ]
      }
    })

    if (existing) {
      return NextResponse.json({ error: 'Category with this name already exists' }, { status: 400 })
    }

    let imageUrl = null
    if (image && image.size > 0) {
      const bytes = await image.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      const uploadDir = path.join(process.cwd(), 'public', 'uploads')
      await mkdir(uploadDir, { recursive: true })
      
      const fileName = `${Date.now()}-${image.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      const filePath = path.join(uploadDir, fileName)
      
      await writeFile(filePath, buffer)
      imageUrl = `/uploads/${fileName}`
    }

    const category = await db.category.create({
      data: {
        name: name.trim(),
        slug,
        image: imageUrl
      }
    })

    return NextResponse.json({ category })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}
