import React from 'react';
import { Link } from 'react-router-dom';
import Logo from 'src/assets/img/admin-removebg-preview.png';
// Import các biểu tượng từ MUI
import DashboardIcon from '@mui/icons-material/Dashboard';
import TableChartIcon from '@mui/icons-material/TableChart';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const Sidebar = () => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleListItemClick = (index:any) => {
    setSelectedIndex(index);
  };

  return (
    <div className="w-[250px] bg-[#36363C] text-white h-[160vh] flex flex-col items-center rounded-md">
      <div className="w-full flex justify-center py-5">
        <Link to={'/admin'} className="text-none">
          <img src={Logo} alt="Logo" width={100} />
        </Link>
      </div>

      <hr className="w-full border-pink-500" />

      <nav className="w-full">
        <Link to={'/admin'} className="no-underline">
          <div
            className={`flex items-center p-3 my-2 mx-auto rounded-lg w-[230px] ${selectedIndex === 0 ? 'bg-[#E63673]' : 'hover:bg-[#525256]'} cursor-pointer`}
            onClick={() => handleListItemClick(0)}
          >
            <DashboardIcon className="text-white" />
            <span className="ml-4">Bảng điều khiển</span>
          </div>
        </Link>

        <Link to={'/admin/product/list'} className="no-underline">
          <div
            className={`flex items-center p-3 my-2 mx-auto rounded-lg w-[230px] ${selectedIndex === 1 ? 'bg-[#E63673]' : 'hover:bg-[#525256]'} cursor-pointer`}
            onClick={() => handleListItemClick(1)}
          >
            <TableChartIcon className="text-white" />
            <span className="ml-4">Sản phẩm</span>
          </div>
        </Link>

        <Link to={'/admin/category/list'} className="no-underline">
          <div
            className={`flex items-center p-3 my-2 mx-auto rounded-lg w-[230px] ${selectedIndex === 2 ? 'bg-[#E63673]' : 'hover:bg-[#525256]'} cursor-pointer`}
            onClick={() => handleListItemClick(2)}
          >
            <ReceiptIcon className="text-white" />
            <span className="ml-4">Danh mục</span>
          </div>
        </Link>

        <Link to={'/admin/user/list'} className="no-underline">
          <div
            className={`flex items-center p-3 my-2 mx-auto rounded-lg w-[230px] ${selectedIndex === 6 ? 'bg-[#E63673]' : 'hover:bg-[#525256]'} cursor-pointer`}
            onClick={() => handleListItemClick(6)}
          >
            <AccountCircleIcon className="text-white" />
            <span className="ml-4">Người dùng</span>
          </div>
        </Link>

        <Link to={'/'} className="no-underline">
          <div
            className={`flex items-center p-3 my-2 mx-auto rounded-lg w-[230px] ${selectedIndex === 7 ? 'bg-[#E63673]' : 'hover:bg-[#525256]'} cursor-pointer`}
            onClick={() => handleListItemClick(7)}
          >
            <ExitToAppIcon className="text-white" />
            <span className="ml-4">Website</span>
          </div>
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
