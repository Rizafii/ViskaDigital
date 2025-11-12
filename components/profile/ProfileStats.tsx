"use client";

import { Card } from "@/components/ui/card";
import { Users, FileText, Calendar } from "lucide-react";
import type { User } from "@supabase/supabase-js";

interface ProfileStatsProps {
  user: User;
  campaigns: number;
}

export default function ProfileStats({ user, campaigns }: ProfileStatsProps) {
  const joinedDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A";

  return (
    <div className="px-6 md:px-12 py-6 border-t border-b border-gray-200">
      <div className="flex flex-col md:flex-row gap-6 md:gap-12">
        <div className="flex items-center gap-3">
          <Users className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Supporters</p>
            <p className="text-xl font-bold">0</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Campaigns</p>
            <p className="text-xl font-bold">{campaigns}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Joined Since</p>
            <p className="text-xl font-bold">{joinedDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
