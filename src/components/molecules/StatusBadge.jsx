import React from "react";
import Badge from "@/components/atoms/Badge";

const StatusBadge = ({ status, type = "task" }) => {
  const getVariant = () => {
    if (type === "task") {
      switch (status) {
        case "completed": return "success";
        case "pending": return "warning";
        case "overdue": return "error";
        default: return "default";
      }
    }
    
    if (type === "priority") {
      switch (status) {
        case "high": return "error";
        case "medium": return "warning"; 
        case "low": return "success";
        default: return "default";
      }
    }

    if (type === "inventory") {
      switch (status) {
        case "low": return "error";
        case "medium": return "warning";
        case "high": return "success";
        default: return "default";
      }
    }

    return "default";
  };

  const getText = () => {
    if (type === "priority") {
      return status === "high" ? "High Priority" : status === "medium" ? "Medium Priority" : "Low Priority";
    }
    
    if (type === "inventory") {
      return status === "low" ? "Low Stock" : status === "medium" ? "Medium Stock" : "In Stock";
    }

    return status?.charAt(0).toUpperCase() + status?.slice(1) || "Unknown";
  };

  return (
    <Badge variant={getVariant()}>
      {getText()}
    </Badge>
  );
};

export default StatusBadge;