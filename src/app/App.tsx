import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "../pages/auth/Login"
import Layout from "../components/layouts/Layout"
import Dashboard from "../components/pages/Dashboard"
import Notifications from "../components/pages/Notifications"
import Trips from "../components/pages/Trips"
import ComingSoon from "../components/pages/ComingSoon"

function App() {

  return (

    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="trips" element={<Trips />} />
          <Route path="load-board" element={<ComingSoon/>} />
          <Route path="scorecard" element={<ComingSoon/>} />
          <Route path="payments" element={<ComingSoon/>} />
        </Route>
      </Routes>
    </BrowserRouter >
  )
}

export default App
