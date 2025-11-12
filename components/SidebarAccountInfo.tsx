"use client"

import { useUser } from "@/lib/auth/hooks"
import { createClient } from "@/lib/supabase/client"
import { Settings } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function SidebarAccountInfo() {
  const { user, loading } = useUser()
  const [userData, setUserData] = useState<any>(null)
  const [userDataLoading, setUserDataLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setUserDataLoading(false)
        return
      }

      try {
        const { data, error } = await supabase.from("users").select("name, email").eq("uid", user.id).single()

        if (error) throw error
        setUserData(data)
      } catch (err) {
        console.error("[v0] Error fetching user data:", err)
      } finally {
        setUserDataLoading(false)
      }
    }

    fetchUserData()
  }, [user, supabase])

  if (loading || userDataLoading) {
    return null
  }

  if (!user || !userData) {
    return null
  }

  const username = `@${userData.email.split("@")[0]}`

  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-gray-50 border border-gray-200">
      <Link href="/profile" className="flex items-center gap-3 flex-1 min-w-0">
        <div className="flex items-center justify-center size-10 rounded-full bg-cyan-100 text-cyan-600 font-semibold flex-shrink-0">
          {userData.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{userData.name || user.email?.split("@")[0]}</p>
          <p className="text-xs text-gray-500 truncate">{username}</p>
          <p className="text-xs text-gray-400 mt-1">View your profile</p>
        </div>
      </Link>
      <button className="p-1 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0">
        <Settings className="size-4 text-gray-600" />
      </button>
    </div>
  )
}
