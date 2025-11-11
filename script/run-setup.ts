import * as fs from "fs"
import * as path from "path"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    "[ERROR] Supabase credentials not found. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY",
  )
  process.exit(1)
}

async function runSetup() {
  console.log("[v0] Starting database setup...")
  console.log("[v0] Using Supabase:", SUPABASE_URL)

  try {
    // We need to use the service role key for admin operations
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!supabaseServiceKey) {
      console.error("[ERROR] SUPABASE_SERVICE_ROLE_KEY not found. This is required for database setup.")
      console.log("[INFO] Please add SUPABASE_SERVICE_ROLE_KEY to your environment variables in the Vars section.")
      process.exit(1)
    }

    // Read SQL files
    const setupSQL = fs.readFileSync(path.join(__dirname, "01-init-database.sql"), "utf-8")
    const seedSQL = fs.readFileSync(path.join(__dirname, "02-seed-roles.sql"), "utf-8")
    const triggerSQL = fs.readFileSync(path.join(__dirname, "03-auth-trigger.sql"), "utf-8")

    console.log("[v0] Read all SQL files successfully")

    // Create Supabase admin client
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${supabaseServiceKey}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to connect to Supabase: ${response.statusText}`)
    }

    console.log("[v0] Connected to Supabase successfully")

    // Execute SQL via Supabase REST API
    // Note: This requires using the SQL Editor API which is not directly available
    // Instead, we'll provide instructions for manual execution
    console.log("[INFO] To complete database setup, please follow these steps:")
    console.log("\n1. Go to your Supabase project dashboard: https://app.supabase.com")
    console.log("2. Navigate to: SQL Editor → New Query")
    console.log("3. Copy and paste the content of scripts/01-init-database.sql and execute it")
    console.log("4. Copy and paste the content of scripts/02-seed-roles.sql and execute it")
    console.log("5. Copy and paste the content of scripts/03-auth-trigger.sql and execute it")
    console.log("\nAlternatively, you can use the Supabase CLI:")
    console.log("  supabase db push")

    console.log("\n[v0] Setup instructions complete!")
  } catch (error) {
    console.error("[ERROR] Setup failed:", error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}

runSetup()
