import crypto from 'crypto';
import querystring from 'querystring';

// Hàm để sắp xếp object
function sortObject(obj) {
    const sorted = {};
    const keys = Object.keys(obj).sort();
    keys.forEach(key => {
        sorted[key] = obj[key];
    });
    return sorted;
}

export const createPayment = (req, res) => {
    const { amount, bankCode, orderId, orderInfo, locale } = req.body;
    const tmnCode = process.env.VNPAY_TMN_CODE;
    const secretKey = process.env.VNPAY_HASH_SECRET;
    const returnUrl = process.env.VNPAY_RETURN_URL;
    const vnpUrl = process.env.VNPAY_URL;

    let vnpParams = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode: tmnCode,
        vnp_Locale: locale || 'vn',
        vnp_CurrCode: 'VND',
        vnp_TxnRef: orderId,
        vnp_OrderInfo: orderInfo,
        vnp_OrderType: 'billpayment',
        vnp_Amount: amount * 100, 
        vnp_ReturnUrl: returnUrl,
        vnp_IpAddr: req.ip,
        vnp_CreateDate: new Date().toISOString().slice(0, 19).replace(/-/g, '').replace(/:/g, '').replace('T', ''),
    };

    if (bankCode) {
        vnpParams['vnp_BankCode'] = bankCode;
    }

    vnpParams = sortObject(vnpParams);
    const signData = querystring.stringify(vnpParams, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    vnpParams['vnp_SecureHash'] = signed;

    const paymentUrl = `${vnpUrl}?${querystring.stringify(vnpParams, { encode: false })}`;
    res.status(200).json({ paymentUrl });
};

export const vnpayReturn = (req, res) => {
    const vnpParams = req.query;
    const secureHash = vnpParams['vnp_SecureHash'];

    delete vnpParams['vnp_SecureHash'];
    delete vnpParams['vnp_SecureHashType'];

    const secretKey = process.env.VNPAY_HASH_SECRET;
    const signData = querystring.stringify(vnpParams, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    // Kiểm tra tính toàn vẹn của dữ liệu
    if (secureHash === signed) {
        if (vnpParams['vnp_ResponseCode'] === '00') {
            // Kiểm tra thêm txnRef và amount
            if (vnpParams['vnp_TxnRef'] === vnpParams['vnp_TxnRef'] && vnpParams['vnp_Amount'] === amount * 100) {
                // Cập nhật trạng thái đơn hàng trong cơ sở dữ liệu ở đây
                res.status(200).json({ message: 'Payment successful' });
            } else {
                res.status(400).json({ message: 'Order mismatch' });
            }
        } else {
            res.status(400).json({ message: 'Payment failed' });
        }
    } else {
        res.status(400).json({ message: 'Checksum failed' });
    }
};

export const vnpayIPN = (req, res) => {
    const vnpParams = req.body; // Hoặc req.query tùy vào cách VNPay gửi dữ liệu
    const secureHash = vnpParams['vnp_SecureHash'];

    delete vnpParams['vnp_SecureHash'];
    delete vnpParams['vnp_SecureHashType'];

    const secretKey = process.env.VNPAY_HASH_SECRET;
    const signData = querystring.stringify(vnpParams, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    // Xử lý xác thực
    if (secureHash === signed) {
        // Cập nhật trạng thái đơn hàng trong cơ sở dữ liệu ở đây
        res.status(200).json({ message: 'IPN received' });
    } else {
        res.status(400).json({ message: 'Checksum failed' });
    }
};
