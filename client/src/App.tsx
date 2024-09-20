import { Navigate, useRoutes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import NotFound from "./component/404!/Notfound";
import AdminCategoryAdd from "./pages/(dashboard)/categories/cateAdd";
import AdminCategoryEdit from "./pages/(dashboard)/categories/cateEdit";
import CategoryList from "./pages/(dashboard)/categories/cateList";
import AdminProductAdd from "./pages/(dashboard)/product/AddProduct";
import AdminProductList from "./pages/(dashboard)/product/Listproduct";
import AdminProductEdit from "./pages/(dashboard)/product/UpdateProduct";
import AdminUserList from "./pages/(dashboard)/user/ListUser";
import ProductDetail from "./pages/(website)/product/DetailProduct";
import Homepage from "./pages/(website)/product/HomePages";
import LikedProducts from "./pages/(website)/product/LikeProduct";
import Login from "./pages/(website)/user/Login";
import UserProfile from "./pages/(website)/user/Profile/Profile";
import Register from "./pages/(website)/user/Register";
import Cart from "./pages/(website)/cart/Cart";
import ClientLayout from "./pages/(website)/Layout";
import AdminLayout from "./pages/(dashboard)/Layout";
import PaymentResult from "./pages/(website)/Checkout/Order";
import Checkout from "./pages/(website)/Checkout/Checkout";
import OrderSummary from "./pages/(website)/Checkout/Order";

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
        path: "product/liked",
        element: <LikedProducts/>,
      },
      {
        path: "carts",
        element: <Cart/>,
      },
      {
        path: "checkout",
        element: <Checkout/>,
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
      }
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
