import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "src/component/sidebar/Sidebar";

const AdminLayout = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  // Kiểm tra vai trò người dùng
  const isAdmin = user.role === 'admin';

  if (!isAdmin) {
    return <Navigate to="/404" replace />;
  }
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
