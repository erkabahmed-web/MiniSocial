import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ChatList from '../components/ChatList.jsx';
import MessageBubble from '../components/MessageBubble.jsx';

const MAX_PHOTO_SIZE = 1024 * 1024;

export default function Chats({ user, chats, people, onSend, onEditMessage, onDeleteMessage, onLikeMessage }) {
  const [selectedId, setSelectedId] = useState(chats[0]?.id || '');
  const [draft, setDraft] = useState('');
  const [photo, setPhoto] = useState('');
  const [error, setError] = useState('');
  const photoInput = useRef(null);
  const selectedChat = chats.find((chat) => chat.id === selectedId) || null;

  useEffect(() => {
    if (!selectedId && chats.length) setSelectedId(chats[0].id);
  }, [chats, selectedId]);

  function submit(event) {
    event.preventDefault();
    if (!selectedChat || (!draft.trim() && !photo)) return setError('Write a message or add a photo before sending.');
    if (!onSend(selectedChat.id, draft, photo)) return setError('Your message could not be sent.');
    setDraft('');
    setPhoto('');
    setError('');
  }

  function selectPhoto(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Choose an image file to send.');
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

  return <main className="page-wrap chat-page"><div className="page-heading chat-page-heading"><div><p className="eyebrow">ONE TO ONE</p><h1>Chats<span className="heading-period">.</span></h1></div><span className="heading-date">A little more personal</span></div>
    <div className={`chat-workspace${selectedChat ? ' has-selection' : ''}`}>
      <aside className="chat-sidebar"><h2>Messages</h2><ChatList chats={chats} selectedId={selectedId} onSelect={setSelectedId} people={people} />{!chats.length && <Link className="subtle-link chat-discover-link" to="/friends">Find someone to message ↗</Link>}</aside>
      <section className="chat-panel" aria-label="Conversation">
        {selectedChat ? <><header className="conversation-header"><button className="back-to-chats" type="button" onClick={() => setSelectedId('')} aria-label="Back to conversation list">←</button><span className="avatar avatar-green">{selectedChat.participantName.slice(0, 1).toUpperCase()}</span><div><h2>{selectedChat.participantName}</h2><p><span className="online-dot" />Demo profile</p></div></header>
          <div className="message-list" aria-live="polite">{selectedChat.messages.length ? selectedChat.messages.map((message) => <MessageBubble key={message.id} message={message} own={message.senderId === user.id} liked={Array.isArray(message.likes) && message.likes.includes(user.id)} onEdit={(text) => onEditMessage(selectedChat.id, message.id, text)} onDelete={() => onDeleteMessage(selectedChat.id, message.id)} onResend={() => onSend(selectedChat.id, message.text || '', message.photo || '')} onLike={() => onLikeMessage(selectedChat.id, message.id)} />) : <p className="conversation-empty">A fresh conversation. Say hello.</p>}</div>
          <form className="message-form" onSubmit={submit}>{photo && <div className="message-photo-preview"><img src={photo} alt="Selected photo preview" /><button className="photo-remove" type="button" onClick={() => setPhoto('')}>Remove photo</button></div>}<input ref={photoInput} className="sr-only" type="file" accept="image/*" aria-label="Choose a photo" onChange={selectPhoto} /><button className="chat-photo-button" type="button" onClick={() => photoInput.current?.click()} aria-label="Add photo" title="Add photo"><span aria-hidden="true">▧</span></button><label className="sr-only" htmlFor="message-draft">Write a message</label><input id="message-draft" value={draft} onChange={(event) => { setDraft(event.target.value); setError(''); }} maxLength={1000} placeholder="Write a message..." /><button className="primary-button send-button" type="submit" disabled={!draft.trim() && !photo} aria-label="Send message">Send <span aria-hidden="true">↗</span></button>{error && <span className="form-error" role="alert">{error}</span>}</form>
        </> : <div className="chat-empty"><span className="chat-empty-mark">↗</span><h2>Your conversations</h2><p>Choose a chat or find a friend to start one.</p><Link className="secondary-button button-link" to="/friends">Find friends <span aria-hidden="true">↗</span></Link></div>}
      </section>
    </div>
  </main>;
}
