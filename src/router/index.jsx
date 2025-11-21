import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "@/components/organisms/Layout";

const Dashboard = lazy(() => import("@/components/pages/Dashboard"));
const Fields = lazy(() => import("@/components/pages/Fields"));
const FieldDetail = lazy(() => import("@/components/pages/FieldDetail"));
const Tasks = lazy(() => import("@/components/pages/Tasks"));
const TaskDetail = lazy(() => import("@/components/pages/TaskDetail"));
const Inventory = lazy(() => import("@/components/pages/Inventory"));
const Expenses = lazy(() => import("@/components/pages/Expenses"));
const Weather = lazy(() => import("@/components/pages/Weather"));
const Settings = lazy(() => import("@/components/pages/Settings"));
const Reports = lazy(() => import("@/components/pages/Reports"));
const NotFound = lazy(() => import("@/components/pages/NotFound"));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
    <div className="text-center space-y-4">
      <svg className="animate-spin h-12 w-12 text-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      <p className="text-primary font-medium">Loading FarmFlow...</p>
    </div>
  </div>
);

const mainRoutes = [
  {
    path: "",
    index: true,
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Dashboard />
      </Suspense>
    )
  },
  {
    path: "fields",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Fields />
      </Suspense>
    )
  },
  {
    path: "fields/:fieldId",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <FieldDetail />
      </Suspense>
    )
  },
  {
    path: "tasks",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Tasks />
      </Suspense>
    )
  },
  {
    path: "tasks/:taskId",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <TaskDetail />
      </Suspense>
    )
  },
  {
    path: "inventory",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Inventory />
      </Suspense>
    )
  },
  {
    path: "expenses",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Expenses />
      </Suspense>
    )
  },
  {
    path: "weather",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Weather />
      </Suspense>
    )
  },
  {
    path: "settings",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Settings />
      </Suspense>
    )
  },
  {
    path: "reports",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Reports />
      </Suspense>
    )
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <NotFound />
      </Suspense>
    )
  }
];

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: mainRoutes
  }
];

export const router = createBrowserRouter(routes);