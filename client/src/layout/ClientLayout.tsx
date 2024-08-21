import { Outlet } from "react-router-dom";
import Footer from "src/component/footer/footer";
import Header from "src/component/header/header";

const ClientLayout = () => {
  return (
    <>
      <div>
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ClientLayout;
