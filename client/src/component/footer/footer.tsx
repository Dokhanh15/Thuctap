import { Link } from 'react-router-dom'; // Assuming you're using React Router

function Footer() {
  return (
    <footer className="bg-gray-200 text-center">
      <div className="container mx-auto px-4 py-8 ">
        {/* Main content section */}
        <div className="flex flex-col md:flex-row md:gap-10 justify-center items-center md:justify-between">
          {/* General Info Section */}
          <div className="flex-1 mb-8 md:mb-0 text-center md:text-left">
            <h2 className="text-xl font-bold mb-4">Thông tin chung</h2>
            <ul className="space-y-2">
              <li><Link to="/policy" className="text-gray-700 hover:text-gray-900">Chính sách bảo hành</Link></li>
              <li><Link to="/privacy" className="text-gray-700 hover:text-gray-900">Chính sách bảo mật</Link></li>
              <li><Link to="/terms" className="text-gray-700 hover:text-gray-900">Điều kiện giao dịch chung</Link></li>
            </ul>
          </div>

          {/* Shopping Guide Section */}
          <div className="flex-1 mb-8 md:mb-0 text-center md:text-left">
            <h2 className="text-xl font-bold mb-4">Hướng dẫn mua hàng</h2>
            <ul className="space-y-2">
              <li><Link to="/shipping" className="text-gray-700 hover:text-gray-900">Vận chuyển và giao nhận</Link></li>
              <li><Link to="/payment" className="text-gray-700 hover:text-gray-900">Phương thức thanh toán</Link></li>
            </ul>
          </div>

          {/* Connect with Us Section */}
          <div className="flex-1 mb-8 md:mb-0 text-center md:text-left">
            <h2 className="text-xl font-bold mb-4">Kết nối với chúng tôi</h2>
            {/* Uncomment and add social icons */}
            {/* <div className="flex justify-center md:justify-start space-x-4">
              <a href="#" className="text-blue-500 hover:text-blue-700"><FacebookIcon /></a>
              <a href="#" className="text-blue-500 hover:text-blue-700"><TwitterIcon /></a>
              <a href="#" className="text-red-500 hover:text-red-700"><YouTubeIcon /></a>
              <a href="#" className="text-purple-500 hover:text-purple-700"><InstagramIcon /></a>
            </div> */}
          </div>

          {/* Hotline Section */}
          <div className="flex-1 mb-8 md:mb-0 text-center md:text-left">
            <h2 className="text-xl font-bold mb-4">Hotline</h2>
            <p className="text-gray-700">1900 2033</p>
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className="border-t border-gray-300 mt-8 pt-4 text-center">
          <p className="text-sm text-gray-500 mb-2">
            &copy; 2023 All rights reserved Laforce
          </p>
          <p className="text-sm text-gray-500">
            CÔNG TY TNHH LAFORCE VIỆT NAM - Địa chỉ: Số 129 Cầu Giấy, Phường Quan Hoa, Quận Cầu Giấy, Thành Phố Hà Nội, Việt Nam - Mã số doanh nghiệp: 0106156656
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
