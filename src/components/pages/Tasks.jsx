import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import fieldService from "@/services/api/fieldService";
import taskService from "@/services/api/taskService";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import TaskCard from "@/components/molecules/TaskCard";
import TaskCreateForm from "@/components/molecules/TaskCreateForm";

const Tasks = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [fields, setFields] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, fields, searchQuery, statusFilter, priorityFilter, categoryFilter]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [tasksData, fieldsData] = await Promise.all([
        taskService.getAll(),
        fieldService.getAll()
      ]);
      
      setTasks(tasksData);
      setFields(fieldsData);
    } catch (err) {
      setError(err.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

const filterTasks = () => {
    let filtered = tasks.map(task => {
      const field = fields.find(f => f?.Id != null && (task.field_id_c?.Id || task.field_id_c) != null && 
        f.Id.toString() === (task.field_id_c?.Id || task.field_id_c).toString());
      return {
        ...task,
        fieldName: field?.Name || field?.name
      };
    });
    // Search filter
    if (searchQuery.trim()) {
const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        (task.title_c || task.title || '').toLowerCase().includes(query) ||
        (task.description_c || task.description || '').toLowerCase().includes(query) ||
        (task.category_c || task.category || '').toLowerCase().includes(query) ||
        task.fieldName?.toLowerCase().includes(query)
      );
    }

    // Status filter
if (statusFilter !== "all") {
      if (statusFilter === "overdue") {
        filtered = filtered.filter(task => 
          new Date(task.due_date_c || task.dueDate) < new Date() && (task.status_c || task.status) !== "completed"
        );
      } else {
        filtered = filtered.filter(task => (task.status_c || task.status) === statusFilter);
      }
    }

// Priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter(task => (task.priority_c || task.priority) === priorityFilter);
    }

// Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(task => (task.category_c || task.category) === categoryFilter);
    }

// Sort by due date
    filtered.sort((a, b) => new Date(a.due_date_c || a.dueDate) - new Date(b.due_date_c || b.dueDate));

    setFilteredTasks(filtered);
  };

const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateTask = () => {
    setShowCreateModal(true);
  };

const handleTaskCreated = (newTask) => {
    setTasks(prev => [newTask, ...prev]);
    setShowCreateModal(false);
    toast.success('Task created successfully');
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
  };

  const handleTaskUpdate = (updatedTask) => {
    setTasks(prev => prev.map(task => 
      task.Id === updatedTask.Id ? updatedTask : task
    ));
    toast.success('Task updated successfully');
  };
  if (loading) return <Loading type="cards" />;
  if (error) return <ErrorView message={error} onRetry={loadTasks} />;

const pendingTasks = filteredTasks.filter(task => (task.status_c || task.status) === "pending");
  const overdueTasks = filteredTasks.filter(task => 
    new Date(task.due_date_c || task.dueDate) < new Date() && (task.status_c || task.status) !== "completed"
  );
  const completedTasks = filteredTasks.filter(task => (task.status_c || task.status) === "completed");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600">Manage your farm activities and operations</p>
        </div>
        
        <Button onClick={handleCreateTask}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Create Task
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search tasks by title, description, category, or field..."
        />
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
<option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </Select>

          <Select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">All Priority</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </Select>

          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="planting">Planting</option>
            <option value="irrigation">Irrigation</option>
            <option value="fertilizing">Fertilizing</option>
            <option value="harvesting">Harvesting</option>
            <option value="maintenance">Maintenance</option>
            <option value="monitoring">Monitoring</option>
          </Select>
          
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("all");
              setPriorityFilter("all");
              setCategoryFilter("all");
            }}
          >
            <ApperIcon name="X" className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 text-center">
          <div className="text-2xl font-bold text-warning mb-1">
            {pendingTasks.length}
          </div>
          <p className="text-sm text-gray-600">Pending Tasks</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 text-center">
          <div className="text-2xl font-bold text-error mb-1">
            {overdueTasks.length}
          </div>
          <p className="text-sm text-gray-600">Overdue Tasks</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 text-center">
          <div className="text-2xl font-bold text-success mb-1">
            {completedTasks.length}
          </div>
          <p className="text-sm text-gray-600">Completed Tasks</p>
        </div>
      </div>

      {/* Tasks List */}
{/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <Empty
          icon="CheckSquare"
          title="No tasks found"
          message={searchQuery || statusFilter !== "all" || priorityFilter !== "all" || categoryFilter !== "all" ? 
            "No tasks match your search criteria. Try adjusting your filters." :
            "Start by creating your first task to manage your farm activities and keep track of important operations."
          }
          actionLabel="Create First Task"
          onAction={handleCreateTask}
        />
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <TaskCard 
              key={task.Id} 
              task={task} 
              onTaskUpdate={handleTaskUpdate}
            />
          ))}
        </div>
      )}

      {/* Create Task Modal */}
      {showCreateModal && (
        <TaskCreateForm
          onTaskCreated={handleTaskCreated}
          onClose={handleCloseModal}
        />
      )}

      {/* Floating Action Button for Mobile */}
      <button
        onClick={handleCreateTask}
        className="fixed bottom-20 right-4 w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center lg:hidden active:scale-95"
        aria-label="Create Task"
      >
        <ApperIcon name="Plus" className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Tasks;