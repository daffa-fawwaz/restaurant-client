import { Outlet } from "react-router-dom";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { HeaderActionProvider } from "../contexts/HeaderActionContext";

export default function MainLayout() {
  return (
    <HeaderActionProvider>
      <div className="flex min-h-screen">
        <Sidebar />

        <main className="min-w-0 flex-1 lg:ml-[280px]">
          <Header />

          <Outlet />
        </main>
      </div>
    </HeaderActionProvider>
  );
}
