"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, MoreVertical, Copy, Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteTwibbon } from "@/lib/supabase/twibbon";

interface Campaign {
  uid: number;
  name: string;
  description: string;
  path: string;
  url: string;
  publicUrl: string;
  created_at: string;
}

interface CampaignTabProps {
  campaigns: Campaign[];
  loading: boolean;
  onRefresh: () => void;
}

export default function CampaignTab({
  campaigns,
  loading,
  onRefresh,
}: CampaignTabProps) {
  const [deleting, setDeleting] = useState<number | null>(null);

  const handleDelete = async (uid: number) => {
    if (!confirm("Are you sure you want to delete this campaign?")) return;

    setDeleting(uid);
    const result = await deleteTwibbon(uid);
    setDeleting(null);

    if (result.success) {
      onRefresh();
    } else {
      alert(result.error || "Failed to delete campaign");
    }
  };

  const handleCopyLink = (url: string) => {
    const fullUrl = `twibbon.app/${url}`;
    navigator.clipboard.writeText(fullUrl);
    alert(`Link copied: ${fullUrl}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <p className="text-muted-foreground">No campaigns created yet</p>
        <Button asChild>
          <a href="/campaigns/new">Create Campaign</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {campaigns.map((campaign) => (
        <Card
          key={campaign.uid}
          className="overflow-hidden hover:shadow-lg transition-shadow p-0"
        >
          {/* Campaign Image */}
          <div className="relative h-64 bg-muted overflow-hidden">
            <img
              src={campaign.publicUrl || "/placeholder.svg"}
              alt={campaign.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Campaign Info */}
          <div className="p-4 pt-0">
            <h3 className="font-semibold text-foreground line-clamp-2">
              {campaign.name}
            </h3>
            {campaign.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {campaign.description}
              </p>
            )}

            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-2 bg-transparent"
              >
                <Eye className="h-4 w-4" />
                Detail
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0"
                    disabled={deleting === campaign.uid}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => handleCopyLink(campaign.url)}
                    className="cursor-pointer"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    <span>Copy Link</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDelete(campaign.uid)}
                    disabled={deleting === campaign.uid}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
