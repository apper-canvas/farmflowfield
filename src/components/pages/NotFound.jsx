import React from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center px-4">
      <Card className="max-w-md w-full text-center p-8">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name="Sprout" className="w-10 h-10 text-primary" />
        </div>
        
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Field Not Found
        </h2>
        
        <p className="text-gray-600 mb-8">
          Looks like you've wandered into an uncharted field! The page you're looking for doesn't exist in our farm management system.
        </p>
        
        <div className="space-y-4">
          <Button 
            onClick={() => navigate("/")}
            className="w-full"
          >
            <ApperIcon name="Home" className="w-4 h-4 mr-2" />
            Return to Dashboard
          </Button>
          
          <div className="flex space-x-3">
            <Button 
              onClick={() => navigate("/fields")}
              variant="outline"
              className="flex-1"
            >
              <ApperIcon name="Square" className="w-4 h-4 mr-2" />
              View Fields
            </Button>
            
            <Button 
              onClick={() => navigate("/tasks")}
              variant="outline"
              className="flex-1"
            >
              <ApperIcon name="CheckSquare" className="w-4 h-4 mr-2" />
              View Tasks
            </Button>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Need help? Check the weather conditions or review your recent farm activities.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default NotFound;