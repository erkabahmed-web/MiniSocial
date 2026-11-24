import { useState } from 'react';

export default function MessageBubble({ message, own, liked, onEdit, onDelete, onResend, onLike }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [actionStatus, setActionStatus] = useState('');
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(message.text || '');
  const [editError, setEditError] = useState('');
  const time = new Date(message.createdAt);
  const likes = Array.isArray(message.likes) ? message.likes : [];

  async function copyMessage() {
    if (!message.text) return false;
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard access is unavailable.');
      await navigator.clipboard.writeText(message.text);
      setActionStatus('Copied to clipboard.');
      return true;
    } catch {
      setActionStatus('Could not access the clipboard.');
      return false;
    }
  }

  async function cutMessage() {
    if (await copyMessage()) {
      onDelete();
      setMenuOpen(false);
    }
  }

  function saveEdit(event) {
    event.preventDefault();
    if (!draft.trim()) {
      setEditError('A message cannot be empty.');
      return;
    }
    if (onEdit(draft)) {
      setEditing(false);
      setEditError('');
    } else {
      setEditError('Your message could not be updated.');
    }
  }

  return <div className={`message-row${own ? ' own' : ''}`}><div className="message-bubble">{editing ? <form className="message-edit-form" onSubmit={saveEdit}><label className="sr-only" htmlFor={`edit-message-${message.id}`}>Edit message</label><textarea id={`edit-message-${message.id}`} value={draft} onChange={(event) => { setDraft(event.target.value); setEditError(''); }} maxLength={1000} rows={3} /><div className="message-edit-actions"><button type="submit" disabled={!draft.trim()}>Save</button><button type="button" onClick={() => { setDraft(message.text || ''); setEditing(false); setEditError(''); }}>Cancel</button></div>{editError && <span className="message-edit-error" role="alert">{editError}</span>}</form> : message.text && <p>{message.text}</p>}{message.photo && <img className="message-photo" src={message.photo} alt="Photo attachment" />}{!editing && <><time>{Number.isNaN(time.getTime()) ? '' : time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}{message.editedAt && <span> · edited</span>}</time>{likes.length > 0 && <span className="message-reaction" aria-label={`${likes.length} likes`}>♥ {likes.length}</span>}</>}</div><div className="message-options" onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setMenuOpen(false); }}><button className="message-options-trigger" type="button" aria-label="Message options" aria-haspopup="menu" aria-expanded={menuOpen} onClick={() => { setMenuOpen((open) => !open); setActionStatus(''); }}>⋯</button>{menuOpen && <div className="message-options-menu" role="menu"><button type="button" role="menuitem" disabled={!own || !message.text} onClick={() => { setDraft(message.text || ''); setEditError(''); setEditing(true); setMenuOpen(false); }}>Edit</button><button type="button" role="menuitem" disabled={!own} onClick={() => { onDelete(); setMenuOpen(false); }}>Delete</button><button type="button" role="menuitem" disabled={!own || !message.text} title={!message.text ? 'No text to cut' : 'Cut this message'} onClick={cutMessage}>Cut</button><button type="button" role="menuitem" disabled={!message.text} title={!message.text ? 'No text to copy' : 'Copy message text'} onClick={copyMessage}>Copy</button><button type="button" role="menuitem" onClick={() => { onResend(); setMenuOpen(false); }}>Resend</button><button type="button" role="menuitem" aria-pressed={liked} onClick={() => { onLike(); setMenuOpen(false); }}>{liked ? '♥ Unlike' : '♡ Like'}</button>{actionStatus && <span className="message-action-status" role="status">{actionStatus}</span>}</div>}</div></div>;
}
