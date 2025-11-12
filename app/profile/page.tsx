"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/lib/auth/hooks";
import { getUserTwibbons } from "@/lib/supabase/twibbon";
import { getUserLinks } from "@/lib/supabase/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import CampaignTab from "@/components/profile/CampaignTab";
import CollectionsTab from "@/components/profile/CollectionsTab";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ProfilePage() {
  const { user, loading: userLoading } = useUser();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [links, setLinks] = useState<any[]>([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  const [loadingLinks, setLoadingLinks] = useState(false);
  const [activeTab, setActiveTab] = useState("campaigns");

  useEffect(() => {
    if (user) {
      loadCampaigns();
      loadLinks();
    }
  }, [user]);

  const loadCampaigns = async () => {
    setLoadingCampaigns(true);
    const result = await getUserTwibbons();
    if (result.success) {
      setCampaigns(result.data || []);
    }
    setLoadingCampaigns(false);
  };

  const loadLinks = async () => {
    setLoadingLinks(true);
    const result = await getUserLinks();
    if (result.success) {
      setLinks(result.data || []);
    }
    setLoadingLinks(false);
  };

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-lg text-muted-foreground">
          Please log in to view your profile
        </p>
        <Button asChild>
          <a href="/auth/login">Go to Login</a>
        </Button>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <ProfileHeader user={user} />
        <ProfileStats user={user} campaigns={campaigns.length} />

        <div className="px-6 md:px-12 py-8">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="border-b bg-transparent p-0 h-auto">
              <TabsTrigger
                value="campaigns"
                className="border-b-2 shadow-none rounded-none px-4 py-3 data-[state=active]:border-b-primary data-[state=active]:bg-transparent"
              >
                Campaign
              </TabsTrigger>
              <TabsTrigger
                value="collections"
                className="border-b-2 shadow-none rounded-none px-4 py-3 data-[state=active]:border-b-primary data-[state=active]:bg-transparent"
              >
                Collections
              </TabsTrigger>
            </TabsList>

            <TabsContent value="campaigns" className="mt-6">
              <CampaignTab
                campaigns={campaigns}
                loading={loadingCampaigns}
                onRefresh={loadCampaigns}
              />
            </TabsContent>

            <TabsContent value="collections" className="mt-6">
              <CollectionsTab
                links={links}
                loading={loadingLinks}
                onRefresh={loadLinks}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </>
  );
}
