import { Outlet } from "react-router-dom";
import Footer from "src/component/footer/footer";
import Header from "src/component/header/header";

const ClientLayout = () => {
  const handleSearch = (searchTerm: string) => {
    console.log("Từ khóa tìm kiếm:", searchTerm);
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header onSearch={handleSearch} />
        <main className="">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ClientLayout;
