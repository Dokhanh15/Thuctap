
const CommentSection = () => {
  // Danh sách bình luận mẫu
  const comments = [
    {
      id: 1,
      username: "Nguyễn Văn A",
      content: "Sản phẩm rất tốt, mình rất hài lòng!",
    },
    {
      id: 2,
      username: "Trần Thị B",
      content: "Màu sắc và kích thước đúng như mong đợi.",
    },
    {
      id: 3,
      username: "Lê Văn C",
      content: "Giao hàng nhanh chóng, đóng gói cẩn thận.",
    },
  ];

  return (
    <div className="mb-10 container">
      <h2 className="text-2xl font-bold mb-4">Bình luận</h2>
      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="bg-gray-100 p-4 rounded-lg shadow-md"
          >
            <p className="font-semibold text-lg">{comment.username}</p>
            <p className="text-gray-700">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
