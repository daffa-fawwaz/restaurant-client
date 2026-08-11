import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import NewOrder from "./pages/NewOrder";
import TablePage from "./pages/TablePage";
import MenuPage from "./pages/MenuPage";
import { HeaderActionProvider } from "./contexts/HeaderActionContext";

function App() {
  return (
    <BrowserRouter>
      <HeaderActionProvider>
        <div className="flex min-h-screen">
          <Sidebar />

          <main className="flex-1 min-w-0 ml-[300px]">
            <Header />

            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/new-order" element={<NewOrder />} />
              <Route path="/table" element={<TablePage />} />
              <Route path="/menu" element={<MenuPage />} />
            </Routes>
          </main>
        </div>
      </HeaderActionProvider>
    </BrowserRouter>
  );
}

export default App;
