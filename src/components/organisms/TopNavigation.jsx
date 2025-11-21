import React, { useState } from "react";
import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const TopNavigation = ({ title, showMenu = true, actions }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { to: "/weather", icon: "Cloud", label: "Weather" },
    { to: "/reports", icon: "BarChart3", label: "Reports" },
    { to: "/settings", icon: "Settings", label: "Settings" }
  ];

  return (
    <>
      <header className="bg-surface border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <ApperIcon name="Sprout" className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">
              {title || "FarmFlow"}
            </h1>
          </div>

          <div className="flex items-center space-x-2">
            {actions}
            
            {showMenu && (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors relative"
              >
                <ApperIcon name="Menu" className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
          <div className="fixed right-0 top-0 h-full w-64 bg-surface shadow-xl">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Menu</h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-lg"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <nav className="p-4">
              <div className="space-y-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ApperIcon name={item.icon} className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default TopNavigation;