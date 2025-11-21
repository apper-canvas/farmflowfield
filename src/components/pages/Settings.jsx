import React, { useState } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Select from "@/components/atoms/Select";

const Settings = () => {
  const [language, setLanguage] = useState("en");
  const [units, setUnits] = useState("metric");
  const [syncInterval, setSyncInterval] = useState("auto");
  const [notifications, setNotifications] = useState({
    taskReminders: true,
    weatherAlerts: true,
    lowStock: true,
    syncStatus: false
  });

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
    { code: "pt", name: "Português", flag: "🇧🇷" },
    { code: "fr", name: "Français", flag: "🇫🇷" }
  ];

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    toast.success(`Language changed to ${languages.find(l => l.code === newLanguage)?.name}`);
  };

  const handleUnitsChange = (newUnits) => {
    setUnits(newUnits);
    toast.success(`Units changed to ${newUnits === "metric" ? "Metric" : "Imperial"}`);
  };

  const handleSyncIntervalChange = (newInterval) => {
    setSyncInterval(newInterval);
    toast.success("Sync settings updated");
  };

  const handleNotificationToggle = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    toast.success("Notification settings updated");
  };

  const handleClearOfflineData = () => {
    if (window.confirm("Are you sure you want to clear all offline data? This cannot be undone.")) {
      // Clear offline data logic would go here
      toast.success("Offline data cleared successfully");
    }
  };

  const handleExportData = () => {
    toast.success("Data export started - you will receive a download link shortly");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Customize your FarmFlow experience</p>
      </div>

      {/* Language Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <ApperIcon name="Globe" className="w-5 h-5 text-primary mr-2" />
          Language & Localization
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interface Language
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 ${
                    language === lang.code
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-gray-200 hover:border-gray-300 text-gray-700"
                  }`}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="font-medium">{lang.name}</span>
                  {language === lang.code && (
                    <ApperIcon name="Check" className="w-4 h-4 ml-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Select
              label="Units"
              value={units}
              onChange={(e) => handleUnitsChange(e.target.value)}
            >
              <option value="metric">Metric (Celsius, Kilometers, Hectares)</option>
              <option value="imperial">Imperial (Fahrenheit, Miles, Acres)</option>
            </Select>
          </div>
        </div>
      </Card>

      {/* Sync Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <ApperIcon name="RefreshCw" className="w-5 h-5 text-primary mr-2" />
          Sync & Offline Settings
        </h3>
        
        <div className="space-y-4">
          <Select
            label="Sync Frequency"
            value={syncInterval}
            onChange={(e) => handleSyncIntervalChange(e.target.value)}
          >
            <option value="auto">Automatic (when online)</option>
            <option value="15min">Every 15 minutes</option>
            <option value="30min">Every 30 minutes</option>
            <option value="1hour">Every hour</option>
            <option value="manual">Manual only</option>
          </Select>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <ApperIcon name="Database" className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Offline Storage</span>
              </div>
              <p className="text-xs text-blue-700 mb-3">
                All your farm data is stored locally for offline access
              </p>
              <Button
                onClick={handleClearOfflineData}
                variant="outline"
                size="sm"
                className="text-blue-600 border-blue-300 hover:bg-blue-50"
              >
                Clear Offline Data
              </Button>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <ApperIcon name="Download" className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-900">Data Export</span>
              </div>
              <p className="text-xs text-green-700 mb-3">
                Export all your data for backup or migration
              </p>
              <Button
                onClick={handleExportData}
                variant="outline"
                size="sm"
                className="text-green-600 border-green-300 hover:bg-green-50"
              >
                Export Data
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <ApperIcon name="Bell" className="w-5 h-5 text-primary mr-2" />
          Notifications
        </h3>
        
        <div className="space-y-4">
          {[
            {
              key: "taskReminders",
              title: "Task Reminders",
              description: "Get notified about upcoming and overdue tasks"
            },
            {
              key: "weatherAlerts", 
              title: "Weather Alerts",
              description: "Receive important weather warnings and conditions"
            },
            {
              key: "lowStock",
              title: "Low Stock Alerts",
              description: "Get notified when inventory items need restocking"
            },
            {
              key: "syncStatus",
              title: "Sync Status",
              description: "Show notifications for data sync operations"
            }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
              
              <button
                onClick={() => handleNotificationToggle(item.key)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                  notifications[item.key] ? "bg-primary" : "bg-gray-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    notifications[item.key] ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* App Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <ApperIcon name="Info" className="w-5 h-5 text-primary mr-2" />
          App Information
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Version:</span>
              <span className="ml-2 font-medium">1.0.0</span>
            </div>
            <div>
              <span className="text-gray-500">Last Updated:</span>
              <span className="ml-2 font-medium">June 2024</span>
            </div>
            <div>
              <span className="text-gray-500">Storage Used:</span>
              <span className="ml-2 font-medium">2.3 MB</span>
            </div>
            <div>
              <span className="text-gray-500">Offline Records:</span>
              <span className="ml-2 font-medium">342 items</span>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" size="sm">
                <ApperIcon name="HelpCircle" className="w-4 h-4 mr-2" />
                Help & Support
              </Button>
              
              <Button variant="outline" size="sm">
                <ApperIcon name="FileText" className="w-4 h-4 mr-2" />
                Privacy Policy
              </Button>
              
              <Button variant="outline" size="sm">
                <ApperIcon name="Shield" className="w-4 h-4 mr-2" />
                Terms of Service
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Reset Settings */}
      <Card className="p-6 border-orange-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <ApperIcon name="RotateCcw" className="w-5 h-5 text-warning mr-2" />
          Reset Settings
        </h3>
        
        <p className="text-gray-600 mb-4">
          Reset all settings to their default values. This will not delete your farm data.
        </p>
        
        <Button
          variant="outline"
          onClick={() => {
            if (window.confirm("Are you sure you want to reset all settings to defaults?")) {
              setLanguage("en");
              setUnits("metric");
              setSyncInterval("auto");
              setNotifications({
                taskReminders: true,
                weatherAlerts: true,
                lowStock: true,
                syncStatus: false
              });
              toast.success("Settings reset to defaults");
            }
          }}
          className="text-warning border-warning hover:bg-warning/5"
        >
          <ApperIcon name="RotateCcw" className="w-4 h-4 mr-2" />
          Reset All Settings
        </Button>
      </Card>
    </div>
  );
};

export default Settings;