import { Outlet } from "react-router-dom";
import Footer from "src/component/footer/footer";
import Header from "src/component/header/header";

const ClientLayout = () => {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ClientLayout;
