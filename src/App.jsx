import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import Feed from './pages/Feed.jsx';
import Chats from './pages/Chats.jsx';
import Friends from './pages/Friends.jsx';
import Profile from './pages/Profile.jsx';
import { demoPeople } from './utils/demoData.js';
import { loadState, makeId, saveState } from './utils/storage.js';

export default function App() {
  const [data, setData] = useState(loadState);
  const navigate = useNavigate();
  const user = data.users.find((item) => item.id === data.currentUserId) ?? null;

  useEffect(() => {
    saveState(data);
  }, [data]);

  function signUp(name, email, password) {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) || password.length < 8) {
      return 'Enter a name, a valid email, and a password of at least 8 characters.';
    }
    if (data.users.some((item) => item.email.toLowerCase() === cleanEmail)) return 'An account with this email already exists.';
    const account = { id: makeId(), name: cleanName, email: cleanEmail, password, bio: '' };
    setData((current) => ({ ...current, users: [...current.users, account], currentUserId: account.id }));
    return '';
  }

  function logIn(email, password) {
    const cleanEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) || !password) return 'Enter a valid email and password.';
    const account = data.users.find((item) => item.email.toLowerCase() === cleanEmail && item.password === password);
    if (!account) return 'Email or password is not correct.';
    setData((current) => ({ ...current, currentUserId: account.id }));
    return '';
  }

  function resetPassword(email, password) {
    const cleanEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) || password.length < 8) return 'Enter a valid email and a new password of at least 8 characters.';
    if (!data.users.some((item) => item.email.toLowerCase() === cleanEmail)) return 'No account was found for that email in this browser.';
    setData((current) => ({
      ...current,
      users: current.users.map((item) => item.email.toLowerCase() === cleanEmail ? { ...item, password } : item),
    }));
    return '';
  }

  function updateProfile(changes) {
    const cleanName = changes.name.trim();
    const cleanEmail = changes.email.trim().toLowerCase();
    if (!cleanName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) return 'Enter a name and a valid email.';
    if (data.users.some((item) => item.id !== user.id && item.email.toLowerCase() === cleanEmail)) return 'That email is already used by another account.';
    if (changes.password && changes.password.length < 8) return 'A new password must be at least 8 characters.';
    setData((current) => ({
      ...current,
      users: current.users.map((item) => item.id === user.id
        ? { ...item, name: cleanName, email: cleanEmail, bio: changes.bio.trim(), photo: changes.photo ?? user.photo ?? '', ...(changes.password ? { password: changes.password } : {}) }
        : item),
    }));
    return '';
  }

  function logout() {
    setData((current) => ({ ...current, currentUserId: null }));
    navigate('/login', { replace: true });
  }

  function addPost(content, photo = '') {
    const text = content.trim();
    if (!text && !photo) return false;
    const post = { id: makeId(), authorId: user.id, authorName: user.name, content: text, ...(photo ? { photo } : {}), createdAt: new Date().toISOString(), likes: [], comments: [], reposts: [] };
    setData((current) => ({ ...current, posts: [post, ...current.posts] }));
    return true;
  }

  function toggleLike(postId) {
    setData((current) => ({
      ...current,
      posts: current.posts.map((post) => {
        if (post.id !== postId) return post;
        const likes = Array.isArray(post.likes) ? post.likes : [];
        return { ...post, likes: likes.includes(user.id) ? likes.filter((id) => id !== user.id) : [...likes, user.id] };
      }),
    }));
  }

  function addComment(postId, text) {
    const content = text.trim();
    if (!content) return false;
    setData((current) => ({
      ...current,
      posts: current.posts.map((post) => post.id === postId
        ? { ...post, comments: [...(Array.isArray(post.comments) ? post.comments : []), { id: makeId(), authorId: user.id, authorName: user.name, text: content, createdAt: new Date().toISOString() }] }
        : post),
    }));
    return true;
  }

  function toggleRepost(postId) {
    setData((current) => ({
      ...current,
      posts: current.posts.map((post) => {
        if (post.id !== postId) return post;
        const reposts = Array.isArray(post.reposts) ? post.reposts : [];
        return { ...post, reposts: reposts.includes(user.id) ? reposts.filter((id) => id !== user.id) : [...reposts, user.id] };
      }),
    }));
  }

  function addFriend(personId) {
    if (!personId || personId === user.id) return;
    setData((current) => current.friendships.some((friendship) => friendship.userId === user.id && friendship.personId === personId)
      ? current
      : { ...current, friendships: [...current.friendships, { id: makeId(), userId: user.id, personId }] });
  }

  function startChat(personId, personName) {
    setData((current) => current.chats.some((chat) => chat.userId === user.id && chat.participantId === personId)
      ? current
      : { ...current, chats: [...current.chats, { id: makeId(), userId: user.id, participantId: personId, participantName: personName, messages: [] }] });
    navigate('/chats');
  }

  function sendMessage(chatId, text, photo = '') {
    const content = text.trim();
    if (!content && !photo) return false;
    setData((current) => ({
      ...current,
      chats: current.chats.map((chat) => chat.id === chatId
        ? { ...chat, messages: [...chat.messages, { id: makeId(), senderId: user.id, text: content, ...(photo ? { photo } : {}), createdAt: new Date().toISOString() }] }
        : chat),
    }));
    return true;
  }

  function deleteMessage(chatId, messageId) {
    setData((current) => ({
      ...current,
      chats: current.chats.map((chat) => chat.id === chatId
        ? { ...chat, messages: chat.messages.filter((message) => message.id !== messageId || message.senderId !== user.id) }
        : chat),
    }));
  }

  function editMessage(chatId, messageId, text) {
    const content = text.trim();
    if (!content) return false;
    setData((current) => ({
      ...current,
      chats: current.chats.map((chat) => chat.id === chatId
        ? {
          ...chat,
          messages: chat.messages.map((message) => message.id === messageId && message.senderId === user.id
            ? { ...message, text: content, editedAt: new Date().toISOString() }
            : message),
        }
        : chat),
    }));
    return true;
  }

  function toggleMessageLike(chatId, messageId) {
    setData((current) => ({
      ...current,
      chats: current.chats.map((chat) => chat.id === chatId
        ? {
          ...chat,
          messages: chat.messages.map((message) => {
            if (message.id !== messageId) return message;
            const likes = Array.isArray(message.likes) ? message.likes : [];
            return { ...message, likes: likes.includes(user.id) ? likes.filter((id) => id !== user.id) : [...likes, user.id] };
          }),
        }
        : chat),
    }));
  }

  const people = [
    ...demoPeople,
    ...data.users.filter((item) => item.id !== user?.id).map((item) => ({ id: item.id, name: item.name, tagline: item.bio || 'A MiniSocial member', color: 'green' })),
  ].filter((person, index, list) => list.findIndex((other) => other.id === person.id) === index);

  return (
    <div className="app-shell">
      {user && <Navbar user={user} onLogout={logout} />}
      <Routes>
        <Route path="/login" element={<Login onLogin={logIn} />} />
        <Route path="/signup" element={<Signup onSignup={signUp} />} />
        <Route path="/forgot-password" element={<ForgotPassword onReset={resetPassword} />} />
        <Route element={<ProtectedRoute user={user} />}>
          <Route path="/feed" element={<Feed user={user} posts={data.posts} onAddPost={addPost} onLike={toggleLike} onComment={addComment} onRepost={toggleRepost} />} />
          <Route path="/chats" element={<Chats user={user} chats={data.chats.filter((chat) => chat.userId === user.id)} people={people} onSend={sendMessage} onEditMessage={editMessage} onDeleteMessage={deleteMessage} onLikeMessage={toggleMessageLike} />} />
          <Route path="/friends" element={<Friends user={user} people={people} friendships={data.friendships.filter((friendship) => friendship.userId === user.id)} onAddFriend={addFriend} onMessage={startChat} />} />
          <Route path="/profile" element={<Profile user={user} onUpdate={updateProfile} />} />
        </Route>
        <Route path="*" element={<Navigate to={user ? '/feed' : '/login'} replace />} />
      </Routes>
    </div>
  );
}
