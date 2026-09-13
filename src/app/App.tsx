import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Layout from "../components/layouts/Layout";
import Dashboard from "../components/pages/Dashboard";
import Notifications from "../components/pages/Notifications";
import Trips from "../components/pages/Trips";
import ComingSoon from "../components/pages/ComingSoon";
import CarrierAccount from "../components/pages/CarrierAccount";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import CreateVendor from "../components/pages/CreateVendor";
import Vehicles from "../components/pages/Vehicles";
import { AuthProvider } from "../context/user/AuthContext";
import VehicleDetails from "../components/pages/VehicleDetails";
import Payments from "../components/pages/Payments";
import LoadBoard from "../components/pages/LoadBoard";
import Drivers from "../components/pages/Drivers";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/create-vendor" element={<CreateVendor />} />

          {/* Protected Application Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="trips" element={<Trips />} />
            <Route path="load-board" element={<LoadBoard  />} />
            <Route path="scorecard" element={<ComingSoon />} />
            <Route path="vehicles" element={<Vehicles />} />
            <Route path="vehicles/:id" element={<VehicleDetails />} />
            <Route path="drivers" element={<Drivers />} />
            <Route path="payments" element={<Payments />} />
            <Route path="carrier-account" element={<CarrierAccount />} />
          </Route>

          {/* Fallback route */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
