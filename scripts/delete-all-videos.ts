/**
 * Script to delete all videos from the platform
 * 
 * WARNING: This will permanently delete all videos and their related data:
 * - All videos
 * - All likes associated with videos
 * - All comments associated with videos
 * 
 * Usage: npx tsx scripts/delete-all-videos.ts
 *        or: pnpm tsx scripts/delete-all-videos.ts
 */

import { PrismaClient } from "../app/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"
import * as readline from "readline"

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error("❌ DATABASE_URL environment variable is not set")
  process.exit(1)
}

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve)
  })
}

async function deleteAllVideos() {
  try {
    console.log("🔍 Checking database...")

    // Count videos first
    const videoCount = await prisma.video.count()
    const likeCount = await prisma.like.count()
    const commentCount = await prisma.comment.count()

    console.log("\n📊 Current database state:")
    console.log(`   Videos: ${videoCount}`)
    console.log(`   Likes: ${likeCount}`)
    console.log(`   Comments: ${commentCount}`)

    if (videoCount === 0) {
      console.log("\n✅ No videos to delete. Database is already empty.")
      rl.close()
      await prisma.$disconnect()
      process.exit(0)
    }

    console.log("\n⚠️  WARNING: This will permanently delete:")
    console.log(`   - ${videoCount} video(s)`)
    console.log(`   - ${likeCount} like(s)`)
    console.log(`   - ${commentCount} comment(s)`)
    console.log("\n   This action CANNOT be undone!")

    const confirmation = await question("\nType 'DELETE ALL VIDEOS' to confirm: ")

    if (confirmation !== "DELETE ALL VIDEOS") {
      console.log("\n❌ Deletion cancelled. No videos were deleted.")
      rl.close()
      await prisma.$disconnect()
      process.exit(0)
    }

    console.log("\n🗑️  Deleting videos and related data...")

    // Delete in order: comments -> likes -> videos
    // This is handled by Prisma's cascade deletes, but we'll do it explicitly for clarity
    const deleteComments = await prisma.comment.deleteMany({})
    console.log(`   ✓ Deleted ${deleteComments.count} comment(s)`)

    const deleteLikes = await prisma.like.deleteMany({})
    console.log(`   ✓ Deleted ${deleteLikes.count} like(s)`)

    const deleteVideos = await prisma.video.deleteMany({})
    console.log(`   ✓ Deleted ${deleteVideos.count} video(s)`)

    console.log("\n✅ Successfully deleted all videos and related data!")
    console.log("\n📊 Final database state:")
    const finalVideoCount = await prisma.video.count()
    const finalLikeCount = await prisma.like.count()
    const finalCommentCount = await prisma.comment.count()
    console.log(`   Videos: ${finalVideoCount}`)
    console.log(`   Likes: ${finalLikeCount}`)
    console.log(`   Comments: ${finalCommentCount}`)
  } catch (error) {
    console.error("\n❌ Error deleting videos:", error)
    process.exit(1)
  } finally {
    rl.close()
    await prisma.$disconnect()
  }
}

// Run the script
deleteAllVideos()

