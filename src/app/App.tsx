import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "../pages/auth/Login"
import Layout from "../components/layouts/Layout"
import Dashboard from "../components/pages/Dashboard"
import Notifications from "../components/pages/Notifications"

function App() {

  return (

    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="expense" element={<></>} />
          <Route path="transactions" element={<></>} />
        </Route>
      </Routes>
    </BrowserRouter >
  )
}

export default App
