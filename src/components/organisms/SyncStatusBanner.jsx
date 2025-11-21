import React, { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";

const SyncStatusBanner = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSync, setLastSync] = useState(null);
  const [pendingChanges, setPendingChanges] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Simulate sync status
    const syncInterval = setInterval(() => {
      if (isOnline && pendingChanges > 0) {
        setIsSyncing(true);
        setTimeout(() => {
          setIsSyncing(false);
          setLastSync(new Date());
          setPendingChanges(0);
        }, 2000);
      }
    }, 10000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(syncInterval);
    };
  }, [isOnline, pendingChanges]);

  const handleManualSync = () => {
    if (!isOnline) return;
    
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSync(new Date());
      setPendingChanges(0);
    }, 1500);
  };

  if (isOnline && pendingChanges === 0 && !isSyncing) {
    return null;
  }

  return (
    <div className={`px-4 py-2 text-center text-sm font-medium ${
      !isOnline ? "bg-error text-white" : 
      isSyncing ? "bg-info text-white" : 
      "bg-warning text-white"
    }`}>
      <div className="flex items-center justify-center space-x-2">
        {!isOnline ? (
          <>
            <ApperIcon name="WifiOff" className="w-4 h-4" />
            <span>Working offline</span>
          </>
        ) : isSyncing ? (
          <>
            <ApperIcon name="RefreshCw" className="w-4 h-4 animate-spin" />
            <span>Syncing data...</span>
          </>
        ) : (
          <>
            <ApperIcon name="Upload" className="w-4 h-4" />
            <span>{pendingChanges} changes pending</span>
            <button
              onClick={handleManualSync}
              className="ml-2 px-2 py-1 bg-white/20 rounded text-xs hover:bg-white/30 transition-colors"
            >
              Sync Now
            </button>
          </>
        )}
      </div>
      
      {lastSync && isOnline && !isSyncing && (
        <div className="text-xs opacity-90 mt-1">
          Last sync: {lastSync.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default SyncStatusBanner;