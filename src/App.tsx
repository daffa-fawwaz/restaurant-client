import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";

import Dashboard from "./pages/Dashboard";
import NewOrder from "./pages/NewOrder";
import TablePage from "./pages/TablePage";
import MenuPage from "./pages/MenuPage";

import MainLayout from "./layouts/MainLayout";
import PrivateRoute from "./components/PrivateRoute";
import { Toaster } from "sonner";
import CheckoutPage from "./pages/checkoutPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />

            <Route path="/new-order" element={<NewOrder />} />
            <Route path="/history" element={<OrderHistoryPage />} />

            <Route path="/checkout/:id" element={<CheckoutPage />} />

            <Route path="/table" element={<TablePage />} />

            <Route path="/menu" element={<MenuPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
