import { Outlet } from "react-router-dom";

import Header from "../components/Header";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen">
  
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-4 bg-gray-50 flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}