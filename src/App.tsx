import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "./pages/Login";
import { useAuthStore } from "./store/authStore";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Layout from "./components/layout/Layout";
import User from "./pages/basicDefinitions/User";
import InventoryGoodList from "./pages/reports/InventoryGoodList";
import ProviderList from "./pages/reports/ProviderList";
import ProducerList from "./pages/reports/ProducerList";
import Dashboard from "./pages/Dashboard";
import ProductOffer from "./pages/businessAccounting/operations/ProductOffer";
import ProductPerm from "./pages/businessAccounting/operations/ProductPerm";
import ProductGrace from "./pages/businessAccounting/operations/ProductGrace";
import ProductPrice from "./pages/businessAccounting/operations/ProductPrice";
//import PayRequestOperation from "./pages/treasure/operation/PayRequestOperation";
import NotFound from "./pages/NotFound";
import ClearBook from "./pages/businessAccounting/operations/ClearBook";
import CupboardsReport from "./pages/warehouse/reports/CupboardsReport";
import GetInventoryBalance from "./pages/businessAccounting/reports/GetInventoryBalance";
import Workflow from "./pages/workflow/Workflow";
import { useDefinitionInvironment } from "./hooks/useDefinitionInvironment";
import WorkflowMaps from "./pages/workflow/WorkflowMaps";
import PurchaseRequest from "./pages/businessAccounting/operations/PurchaseRequest";
import PayRequest from "./pages/treasure/operation/PayRequest";

const queryClient = new QueryClient();

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <AppContent />
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

function AppContent() {
  const { definitionInvironment, definitionDateTime } = useDefinitionInvironment();

  return (
    <Layout definitionInvironment={definitionInvironment}>
      <Routes>
        <Route path="/login" element={<Login isHomePage={true} />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard definitionInvironment={definitionInvironment} />
            </PrivateRoute>
          }
        />
        <Route
          path="/Admin/ProductOffer"
          element={
            <PrivateRoute>
              <ProductOffer
                definitionDateTime={definitionDateTime}
                definitionInvironment={definitionInvironment}
              />
            </PrivateRoute>
          }
        />
        <Route
          path="/Admin/Indent"
          element={
            <PrivateRoute>
              <PurchaseRequest
                definitionDateTime={definitionDateTime}
                definitionInvironment={definitionInvironment}
              />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/ProductPerm"
          element={
            <PrivateRoute>
              <ProductPerm
                definitionDateTime={definitionDateTime}
                definitionInvironment={definitionInvironment}
              />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/ProductGrace"
          element={
            <PrivateRoute>
              <ProductGrace
                definitionDateTime={definitionDateTime}
                definitionInvironment={definitionInvironment}
              />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/ProductPrice"
          element={
            <PrivateRoute>
              <ProductPrice
                definitionDateTime={definitionDateTime}
                definitionInvironment={definitionInvironment}
              />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/PayRequest"
          element={
            <PrivateRoute>
              <PayRequest
                definitionInvironment={definitionInvironment}
                definitionDateTime={definitionDateTime}
              />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/WFMS/index"
          element={
            <PrivateRoute>
              <Workflow
                definitionInvironment={definitionInvironment}
                definitionDateTime={definitionDateTime}
              />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/user/index"
          element={
            <PrivateRoute>
              <User definitionInvironment={definitionInvironment} />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/RpProviders/Inventory"
          element={
            <PrivateRoute>
              <InventoryGoodList
                definitionInvironment={definitionInvironment}
              />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/RpProviders"
          element={
            <PrivateRoute>
              <ProviderList definitionInvironment={definitionInvironment} />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/RpProducers"
          element={
            <PrivateRoute>
              <ProducerList definitionInvironment={definitionInvironment} />
            </PrivateRoute>
          }
        />
        <Route
          path="/Admin/ClearBook/index"
          element={
            <PrivateRoute>
              <ClearBook definitionInvironment={definitionInvironment} />
            </PrivateRoute>
          }
        />
        <Route
          path="/Admin/CupboardsReport"
          element={
            <PrivateRoute>
              <CupboardsReport definitionInvironment={definitionInvironment} />
            </PrivateRoute>
          }
        />
        <Route
          path="/Admin/ttac/InventoryBalance"
          element={
            <PrivateRoute>
              <GetInventoryBalance
                definitionInvironment={definitionInvironment}
              />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/WFMS_FlowMap/Index"
          element={
            <PrivateRoute>
              <WorkflowMaps definitionInvironment={definitionInvironment} />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/admin/WFMS/index" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
export default App;
