import { useState } from 'react';
import CommentList from './CommentList.jsx';

function timeLabel(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
}

export default function PostCard({ post, user, onLike, onComment, onRepost }) {
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const liked = post.likes.includes(user.id);
  const reposted = post.reposts.includes(user.id);

  function submitComment(event) {
    event.preventDefault();
    if (onComment(post.id, comment)) setComment('');
  }

  return (
    <article className="post-card">
      {post.isDemo && <p className="demo-note">Sample post</p>}
      {post.reposts.length > 0 && <p className="repost-note">↻ {post.reposts.length} {post.reposts.length === 1 ? 'repost' : 'reposts'}</p>}
      <div className="post-heading"><span className="avatar">{post.authorPhoto ? <img src={post.authorPhoto} alt="" /> : post.authorName.slice(0, 1).toUpperCase()}</span><div><h2>{post.authorName}</h2><time dateTime={post.createdAt}>{timeLabel(post.createdAt)}</time></div></div>
      {post.content && <p className="post-copy">{post.content}</p>}
      {post.photo && <img className="post-photo" src={post.photo} alt={`Photo shared by ${post.authorName}`} />}
      <div className="post-actions">
        <button type="button" className={`action-button${liked ? ' selected' : ''}`} aria-pressed={liked} onClick={() => onLike(post.id)}><span aria-hidden="true">{liked ? '♥' : '♡'}</span> Like <span className="action-count">{post.likes.length || ''}</span></button>
        <button type="button" className="action-button" aria-expanded={showComments} onClick={() => setShowComments((visible) => !visible)}><span aria-hidden="true">▤</span> Comment <span className="action-count">{post.comments.length || ''}</span></button>
        <button type="button" className={`action-button${reposted ? ' selected-green' : ''}`} aria-pressed={reposted} onClick={() => onRepost(post.id)}><span aria-hidden="true">↻</span> {reposted ? 'Reposted' : 'Repost'}</button>
      </div>
      {showComments && <div className="comments-area"><CommentList comments={post.comments} /><form className="comment-form" onSubmit={submitComment}><label className="sr-only" htmlFor={`comment-${post.id}`}>Write a comment</label><input id={`comment-${post.id}`} value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Write a comment..." maxLength={500} /><button className="icon-button" type="submit" aria-label="Post comment" disabled={!comment.trim()}>↗</button></form></div>}
    </article>
  );
}
