function ErrorBox({ message = 'Đã xảy ra lỗi.' }) {
  return (
    <div className="error-box" role="alert">
      <strong>Có lỗi xảy ra</strong>
      <p>{message}</p>
    </div>
  );
}

export default ErrorBox;