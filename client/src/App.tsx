import { useRoutes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import NotFound from "./component/404!/Notfound";
import Loading from "./component/loading/Loading";
import AdminLayout from "./layout/AdminLayout";
import ClientLayout from "./layout/ClientLayout";
import Homepage from "./pages/HomePages";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetail from "./pages/DetailProduct";
import AdminProductList from "./pages/admin/Listproduct";

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
      
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "product/list",
        element: <AdminProductList/>,
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
      <main >{routes}</main>
      <Loading/>
    </>
  );
}

export default App;
