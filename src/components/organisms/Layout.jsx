import React from "react";
import { Outlet } from "react-router-dom";
import TopNavigation from "@/components/organisms/TopNavigation";
import BottomNavigation from "@/components/organisms/BottomNavigation";
import SyncStatusBanner from "@/components/organisms/SyncStatusBanner";

const Layout = () => {
  return (
    <div className="min-h-screen bg-background">
      <SyncStatusBanner />
      <TopNavigation />
      
      <main className="pb-20 pt-4">
        <div className="px-4">
          <Outlet />
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Layout;