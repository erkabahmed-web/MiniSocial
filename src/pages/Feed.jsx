import { useRef, useState } from 'react';
import PostCard from '../components/PostCard.jsx';

const MAX_PHOTO_SIZE = 1024 * 1024;

export default function Feed({ user, posts, onAddPost, onLike, onComment, onRepost }) {
  const [content, setContent] = useState('');
  const [photo, setPhoto] = useState('');
  const [error, setError] = useState('');
  const photoInput = useRef(null);

  function selectPhoto(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Choose an image file to share.');
      return;
    }
    if (file.size > MAX_PHOTO_SIZE) {
      setError('Choose an image smaller than 1 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPhoto(reader.result);
        setError('');
      } else {
        setError('This image could not be opened.');
      }
    };
    reader.onerror = () => setError('This image could not be opened.');
    reader.readAsDataURL(file);
  }

  function submit(event) {
    event.preventDefault();
    if (!content.trim() && !photo) return setError('Write something or add a photo before sharing.');
    if (!onAddPost(content, photo)) return setError('Your post could not be shared. Try a smaller image.');
    setContent('');
    setPhoto('');
    setError('');
  }
  return <main className="page-wrap feed-layout"><section className="feed-column"><div className="page-heading"><div><p className="eyebrow">MONDAY, YOUR WAY</p><h1>Your feed<span className="heading-period">.</span></h1></div><span className="heading-date">A little catch-up</span></div>
    <form className="composer" onSubmit={submit}><div className="composer-top"><span className="avatar avatar-coral">{user.photo ? <img src={user.photo} alt="" /> : user.name.slice(0, 1).toUpperCase()}</span><div className="composer-input"><label className="sr-only" htmlFor="post-text">Share an update</label><textarea id="post-text" placeholder={`What’s on your mind, ${user.name.split(' ')[0]}?`} value={content} onChange={(event) => { setContent(event.target.value); setError(''); }} maxLength={1000} rows={3} />{photo && <div className="photo-preview"><img src={photo} alt="Selected photo preview" /><button className="photo-remove" type="button" onClick={() => setPhoto('')}>Remove photo</button></div>}</div></div><div className="composer-footer">{error ? <p className="form-error" role="alert">{error}</p> : <span className="character-count">{content.length}/1000</span>}<div className="composer-actions"><input ref={photoInput} className="sr-only" type="file" accept="image/*" aria-label="Choose a photo" onChange={selectPhoto} /><button className="photo-button" type="button" onClick={() => photoInput.current?.click()}><span aria-hidden="true">▧</span> Add photo</button><button className="primary-button compact-button" type="submit" disabled={!content.trim() && !photo}>Share update <span aria-hidden="true">↗</span></button></div></div></form>
    <div className="feed-label"><h2>Recent notes</h2><span>{posts.length} {posts.length === 1 ? 'post' : 'posts'}</span></div>
    <div className="post-list">{posts.map((post) => <PostCard key={post.id} post={{ ...post, authorPhoto: post.authorId === user.id ? user.photo : post.authorPhoto, likes: Array.isArray(post.likes) ? post.likes : [], comments: Array.isArray(post.comments) ? post.comments : [], reposts: Array.isArray(post.reposts) ? post.reposts : [] }} user={user} onLike={onLike} onComment={onComment} onRepost={onRepost} />)}</div>
  </section><aside className="feed-aside"><div className="aside-rule" /><p className="eyebrow">A NOTE TO SELF</p><p className="aside-quote">“The small things are the big things.”</p><span className="aside-byline">A good thought to keep</span><div className="aside-bottom"><span className="aside-number">01</span><span>YOUR LITTLE CORNER OF THE INTERNET</span></div></aside></main>;
}
