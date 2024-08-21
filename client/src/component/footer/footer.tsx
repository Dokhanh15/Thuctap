import { Link } from 'react-router-dom'; // Assuming you're using React Router

function Footer() {
  return (
    <footer className="bg-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-4">Thông tin chung</h2>
            <ul className="space-y-2">
              <li><Link to="/policy">Chính sách bảo hành</Link></li>
              <li><Link to="/privacy">Chính sách bảo mật</Link></li>
              <li><Link to="/terms">Điều kiện giao dịch chung</Link></li>
            </ul>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-4">Hướng dẫn mua hàng</h2>
            <ul className="space-y-2">
              <li><Link to="/shipping">Vận chuyển và giao nhận</Link></li>
              <li><Link to="/payment">Phương thức thanh toán</Link></li>
            </ul>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-4">Kết nối với chúng tôi</h2>
            {/* <div className="flex space-x-2">
              <a href="#" className="text-blue-500 hover:text-blue-700">
                <FacebookIcon />
              </a>
              <a href="#" className="text-blue-500 hover:text-blue-700">
                <TwitterIcon />
              </a>
              <a href="#" className="text-red-500 hover:text-red-700">
                <YouTubeIcon />
              </a>
              <a href="#" className="text-purple-500 hover:text-purple-700">
                <InstagramIcon />
              </a>
            </div> */}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-4">Hotline</h2>
            <p>1900 2033</p>
          </div>
        </div>
        <div className="border-t border-gray-300 mt-8 py-4">
          <p className="text-sm text-gray-500">
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