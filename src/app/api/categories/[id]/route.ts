import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const category = await db.category.findUnique({
      where: { id },
      include: {
        accounts: {
          include: {
            images: true
          }
        }
      }
    })

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    return NextResponse.json({ category })
  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const formData = await request.formData()
    const name = formData.get('name') as string
    const image = formData.get('image') as File | null

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    // Check if another category with same name exists
    const existing = await db.category.findFirst({
      where: {
        AND: [
          { id: { not: id } },
          {
            OR: [
              { name: name.trim() },
              { slug }
            ]
          }
        ]
      }
    })

    if (existing) {
      return NextResponse.json({ error: 'Category with this name already exists' }, { status: 400 })
    }

    let imageUrl = undefined
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

    const category = await db.category.update({
      where: { id },
      data: {
        name: name.trim(),
        slug,
        ...(imageUrl && { image: imageUrl })
      }
    })

    return NextResponse.json({ category })
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Delete all account images first
    const accounts = await db.account.findMany({
      where: { categoryId: id },
      select: { id: true }
    })

    for (const account of accounts) {
      await db.accountImage.deleteMany({
        where: { accountId: account.id }
      })
    }

    // Delete all accounts in this category
    await db.account.deleteMany({
      where: { categoryId: id }
    })

    // Delete the category
    await db.category.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}
