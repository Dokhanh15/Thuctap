import { useRoutes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import NotFound from "./component/404!/Notfound";
import Loading from "./component/loading/Loading";
import AdminLayout from "./layout/AdminLayout";
import ClientLayout from "./layout/ClientLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";

const routeConfig = [
  {
    path: "/",
    element: <ClientLayout />,
    children: [
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
        path: "register",
        element: <Register/>,
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
      <Loading/>
    </>
  );
}

export default App;
