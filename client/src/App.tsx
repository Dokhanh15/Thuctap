import { Navigate, useRoutes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import NotFound from "./component/404!/Notfound";
import AdminLayout from "./layout/AdminLayout";
import ClientLayout from "./layout/ClientLayout";
import ProductDetail from "./pages/client/product/DetailProduct";
import Homepage from "./pages/client/product/HomePages";
import Login from "./pages/client/user/Login";
import Register from "./pages/client/user/Register";
import AdminProductList from "./pages/admin/product/Listproduct";
import AdminProductAdd from "./pages/admin/product/AddProduct";
import AdminProductEdit from "./pages/admin/product/UpdateProduct";
import UserProfile from "./pages/client/user/Profile/Profile";
import CategoryList from "./pages/admin/categories/cateList";
import AdminCategoryAdd from "./pages/admin/categories/cateAdd";
import AdminCategoryEdit from "./pages/admin/categories/cateEdit";
import AdminUserList from "./pages/admin/user/ListUser";

const routeConfig = [
  {
    path: "/",
    element: <ClientLayout />,
    children: [
      {
        path: "/",
        element: <Homepage/>,
      },
      {
        path: "product/:id",
        element: <ProductDetail/>,
      },

      {
        path: "login",
        element: <Login/>,
      },
      {
        path: "register",
        element: <Register/>,
      },
      {
        path: "profile",
        element: <UserProfile/>,
      },
      
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="product/list" replace />,
      },
      {
        path: "product/list",
        element: <AdminProductList/>,
      },
      {
        path: "product/add",
        element: <AdminProductAdd/>,
      },
      {
        path: "product/edit/:id",
        element: <AdminProductEdit/>,
      },
      {
        path: "category/list",
        element: <CategoryList/>,
      },
      {
        path: "category/add",
        element: <AdminCategoryAdd/>,
      },
      {
        path: "category/edit/:id",
        element: <AdminCategoryEdit/>,
      },
      {
        path: "user/list",
        element: <AdminUserList/>,
      },
    ],
  },
  {
    path: "/404",
    element: <NotFound />,
  },
  {
    path: "*",
    element: <NotFound />,
  }
];

function App() {
  const routes = useRoutes(routeConfig);

  return (
    <>
      <ToastContainer />
      <main>{routes}</main>
    </>
  );
}

export default App;
