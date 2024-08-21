// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/UserModel';

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Không có token, vui lòng đăng nhập!' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = await User.findById(decoded.id);
        if (!req.user) {
            return res.status(401).json({ message: 'Người dùng không tồn tại!' });
        }
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token không hợp lệ!' });
    }
};

export default authMiddleware;
