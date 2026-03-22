import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { writeFile, mkdir, unlink } from 'fs/promises'
import path from 'path'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const account = await db.account.findUnique({
      where: { id },
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    }

    return NextResponse.json({ account })
  } catch (error) {
    console.error('Error fetching account:', error)
    return NextResponse.json({ error: 'Failed to fetch account' }, { status: 500 })
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

    // Check if another account with same name exists
    const existing = await db.account.findFirst({
      where: {
        AND: [
          { id: { not: id } },
          { name: name.trim() }
        ]
      }
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

    // Update account
    const account = await db.account.update({
      where: { id },
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

    // Upload and save new images if provided
    if (images && images.length > 0 && images[0].size > 0) {
      // Delete old images
      const oldImages = await db.accountImage.findMany({
        where: { accountId: id }
      })

      for (const img of oldImages) {
        try {
          const filePath = path.join(process.cwd(), 'public', img.url)
          await unlink(filePath)
        } catch {
          // Ignore errors if file doesn't exist
        }
      }

      await db.accountImage.deleteMany({
        where: { accountId: id }
      })

      // Upload new images
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
    console.error('Error updating account:', error)
    return NextResponse.json({ error: 'Failed to update account' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Get images to delete files
    const images = await db.accountImage.findMany({
      where: { accountId: id }
    })

    // Delete image files
    for (const img of images) {
      try {
        const filePath = path.join(process.cwd(), 'public', img.url)
        await unlink(filePath)
      } catch {
        // Ignore errors if file doesn't exist
      }
    }

    // Delete images from database (cascade should handle this but let's be explicit)
    await db.accountImage.deleteMany({
      where: { accountId: id }
    })

    // Delete the account
    await db.account.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting account:', error)
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 })
  }
}
