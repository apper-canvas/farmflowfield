import React from "react";
import { Outlet } from "react-router-dom";
import UserMenu from "@/components/organisms/UserMenu";
import BottomNavigation from "@/components/organisms/BottomNavigation";
import SyncStatusBanner from "@/components/organisms/SyncStatusBanner";
import TopNavigation from "@/components/organisms/TopNavigation";

function Layout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNavigation 
        title="FarmFlow"
        actions={<UserMenu />}
      />
      <SyncStatusBanner />
      
      <main className="flex-1 pb-20 lg:pb-0">
        <Outlet />
      </main>
      
      <BottomNavigation />
    </div>
);
}

export default Layout;