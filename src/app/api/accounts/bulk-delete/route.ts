import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { unlink } from 'fs/promises'
import path from 'path'

export async function POST(request: Request) {
  try {
    const { ids } = await request.json()

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'No account IDs provided' }, { status: 400 })
    }

    // Get all images for these accounts
    const images = await db.accountImage.findMany({
      where: {
        accountId: { in: ids }
      }
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

    // Delete images from database
    await db.accountImage.deleteMany({
      where: {
        accountId: { in: ids }
      }
    })

    // Delete accounts
    await db.account.deleteMany({
      where: {
        id: { in: ids }
      }
    })

    return NextResponse.json({ success: true, deleted: ids.length })
  } catch (error) {
    console.error('Error bulk deleting accounts:', error)
    return NextResponse.json({ error: 'Failed to delete accounts' }, { status: 500 })
  }
}
