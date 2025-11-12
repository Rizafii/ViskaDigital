"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { Copy, Edit2, Trash2, Lock } from "lucide-react"
import { useState } from "react"
import { deleteLink } from "@/lib/supabase/link"

interface Link {
  uid: number
  name: string
  description: string | null
  original_link: string
  short_link: string
  active: boolean
  created_at: string
}

interface CollectionsTabProps {
  links: Link[]
  loading: boolean
  onRefresh: () => void
}

export default function CollectionsTab({ links, loading, onRefresh }: CollectionsTabProps) {
  const [deleting, setDeleting] = useState<number | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  const handleDelete = async (uid: number) => {
    if (!confirm("Are you sure you want to delete this link?")) return

    setDeleting(uid)
    const result = await deleteLink(uid)
    setDeleting(null)

    if (result.success) {
      onRefresh()
    } else {
      alert(result.error || "Failed to delete link")
    }
  }

  const handleCopyLink = (shortLink: string) => {
    const fullUrl = `${window.location.origin}/r/${shortLink}`
    navigator.clipboard.writeText(fullUrl)
    setCopied(shortLink)
    setTimeout(() => setCopied(null), 2000)
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    )
  }

  if (links.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <Lock className="h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">No links created yet</p>
        <Button asChild>
          <a href="/links/new">Create Link</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {links.map((link) => (
        <Card key={link.uid} className="p-4 hover:shadow-md transition-shadow">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Link Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground truncate">{link.name}</h3>
                <Lock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              </div>
              {link.description && <p className="text-sm text-muted-foreground line-clamp-1">{link.description}</p>}
              <p className="text-xs text-muted-foreground mt-2 break-all">
                {window.location.origin}/r/{link.short_link}
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleCopyLink(link.short_link)} className="gap-2">
                <Copy className="h-4 w-4" />
                {copied === link.short_link ? "Copied!" : "Copy"}
              </Button>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Edit2 className="h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(link.uid)}
                disabled={deleting === link.uid}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
