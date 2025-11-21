import React from "react";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const BottomNavigation = () => {
  const navItems = [
    {
      to: "/",
      icon: "LayoutDashboard",
      label: "Dashboard",
      end: true
    },
    {
      to: "/fields",
      icon: "Square",
      label: "Fields"
    },
    {
      to: "/tasks",
      icon: "CheckSquare",
      label: "Tasks"
    },
    {
      to: "/inventory",
      icon: "Package",
      label: "Inventory"
    },
    {
      to: "/expenses",
      icon: "DollarSign",
      label: "Expenses"
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-gray-200 z-50">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center min-w-[60px] py-2 px-3 rounded-lg transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50 active:scale-95"
              )
            }
          >
            {({ isActive }) => (
              <>
                <ApperIcon
                  name={item.icon}
                  className={cn("w-5 h-5 mb-1", isActive ? "text-primary" : "")}
                />
                <span className={cn("text-xs font-medium", isActive ? "text-primary" : "")}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;