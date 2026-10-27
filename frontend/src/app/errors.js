const ERROR_MESSAGES = [
  [
    'Bao hiem da het han',
    'Gói bảo hiểm đã hết hạn.',
  ],
  [
    'Vuot qua han muc bao hiem',
    'Số tiền vượt hạn mức bảo hiểm còn lại.',
  ],
  [
    'Quy bao hiem khong du',
    'Quỹ bảo hiểm hiện không đủ để chi trả.',
  ],
  [
    'Benh vien chua xac nhan',
    'Bệnh viện chưa xác nhận chi phí điều trị.',
  ],
  [
    'Claim da xu ly',
    'Yêu cầu bồi thường này đã được xử lý.',
  ],
  [
    'Soulbound: khong the chuyen nhuong',
    'Thẻ bảo hiểm không thể chuyển nhượng.',
  ],
  [
    'Goi bao hiem khong ton tai',
    'Gói bảo hiểm không tồn tại.',
  ],
  [
    'Goi bao hiem khong hoat dong',
    'Gói bảo hiểm này hiện không mở bán.',
  ],
  [
    'Sai so tien thanh toan',
    'Số ETH thanh toán không đúng giá gói.',
  ],
  [
    'Da co goi bao hiem con han',
    'Bạn đã có gói bảo hiểm còn hiệu lực.',
  ],
  [
    'Khong phai chu the hoac benh vien',
    'Chỉ chủ thẻ hoặc bệnh viện được ủy quyền mới gửi được yêu cầu.',
  ],
  [
    'So tien khong hop le',
    'Số tiền không hợp lệ.',
  ],
  [
    'So tien xac nhan vuot so tien yeu cau',
    'Số tiền xác nhận lớn hơn số tiền yêu cầu.',
  ],
  [
    'Khong tim thay yeu cau boi thuong',
    'Không tìm thấy yêu cầu bồi thường.',
  ],
  [
    'Chuyen tien that bai',
    'Chuyển tiền thất bại.',
  ],
  [
    'Cong ty bao hiem chua dang ky khoa ma hoa',
    'Công ty bảo hiểm chưa đăng ký khóa mã hóa. Hãy đăng ký trước.',
  ],
  [
    'Ma so bao hiem qua dai',
    'Mã số bảo hiểm quá dài.',
  ],
];

function collectErrorMessages(err) {
  if (!err) {
    return [];
  }

  if (typeof err === 'string') {
    return [err];
  }

  const candidates = [
    err.shortMessage,
    err.reason,
    err.message,
    err.info?.error?.message,
    err.error?.message,
    err.data?.message,
    err.errorName,
    err.revert?.name,
    err.data?.errorName,
    err.info?.error?.data?.message,
    err.error?.data?.message,
  ];

  return candidates.filter(
    (value) => typeof value === 'string' && value.length > 0,
  );
}

export function toVietnameseError(err) {
  if (!err) {
    return 'Không thể thực hiện thao tác. Vui lòng thử lại.';
  }

  // MetaMask: user rejected the transaction or request.
  if (err.code === 'ACTION_REJECTED' || err.code === 4001) {
    const errorCodes = [
        err.code,
        err.error?.code,
        err.info?.error?.code,
    ];

    if (
        errorCodes.some(
            (code) =>
            code === 'ACTION_REJECTED' ||
            code === 4001 ||
            code === '4001',
        )
    ) {
        return 'Bạn đã hủy giao dịch.';
    }
  }

  const messages = collectErrorMessages(err);

  // OpenZeppelin AccessControl v5 custom error.
  if (
    messages.some((message) =>
      message.includes('AccessControlUnauthorizedAccount'),
    )
  ) {
    return 'Ví của bạn không có quyền thực hiện thao tác này.';
  }

  for (const [source, translated] of ERROR_MESSAGES) {
    if (
      messages.some((message) => message.includes(source))
    ) {
      return translated;
    }
  }

  // A network mismatch uses the project's frozen message.
  if (
    messages.some((message) =>
      message.includes('Vui lòng chuyển MetaMask sang mạng Sepolia.'),
    )
  ) {
    return 'Vui lòng chuyển MetaMask sang mạng Sepolia.';
  }

  return 'Không thể thực hiện thao tác. Vui lòng thử lại.';
}