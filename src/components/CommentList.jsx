export default function CommentList({ comments }) {
  if (!comments.length) return <p className="empty-comments">No comments yet. Start the conversation.</p>;
  return (
    <ul className="comment-list">
      {comments.map((comment) => <li key={comment.id}><span className="comment-avatar">{comment.authorName.slice(0, 1).toUpperCase()}</span><p><strong>{comment.authorName}</strong> {comment.text}</p></li>)}
    </ul>
  );
}
