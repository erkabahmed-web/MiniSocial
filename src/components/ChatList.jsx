export default function ChatList({ chats, selectedId, onSelect, people }) {
  if (!chats.length) return <p className="chat-list-empty">No conversations yet. Add a friend and start a chat.</p>;
  return <ul className="chat-list">{chats.map((chat) => {
    const person = people.find((item) => item.id === chat.participantId);
    const latest = chat.messages.at(-1);
    return <li key={chat.id}><button className={`chat-list-item${selectedId === chat.id ? ' active' : ''}`} onClick={() => onSelect(chat.id)} type="button"><span className={`avatar avatar-${person?.color || 'green'}`}>{chat.participantName.slice(0, 1).toUpperCase()}</span><span className="chat-list-copy"><strong>{chat.participantName}</strong><span>{latest?.text || (latest?.photo ? '▧ Photo' : 'Say hello')}</span></span><span className="online-dot" aria-label="Demo profile" title="Demo profile" /></button></li>;
  })}</ul>;
}
