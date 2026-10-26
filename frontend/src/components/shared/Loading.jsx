function Loading({ message = 'Đang tải dữ liệu...' }) {
  return (
    <div className="loading" role="status" aria-live="polite">
      {message}
    </div>
  );
}

export default Loading;