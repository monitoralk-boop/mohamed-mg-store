import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const categories = await db.category.findMany({
      orderBy: { name: 'asc' }
    })
    return NextResponse.json({ categories })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch categories',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const name = formData.get('name') as string

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

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

    const category = await db.category.create({
      data: {
        name: name.trim(),
        slug,
        image: null
      }
    })

    return NextResponse.json({ category })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json({ 
      error: 'Failed to create category',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
