import { NavLink } from 'react-router-dom';

const links = [
  { to: '/feed', label: 'Feed', icon: '◉' },
  { to: '/chats', label: 'Chats', icon: '↗' },
  { to: '/friends', label: 'Friends', icon: '⌘' },
  { to: '/profile', label: 'Profile', icon: '○' },
];

export default function Navbar({ user, onLogout }) {
  return (
    <header className="topbar">
      <NavLink className="brand" to="/feed" aria-label="MiniSocial home"><span className="brand-mark">m</span><span>mini<span className="brand-light">social</span></span></NavLink>
      <nav className="main-nav" aria-label="Main navigation">
        {links.map((link) => <NavLink key={link.to} to={link.to} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}><span className="nav-icon" aria-hidden="true">{link.icon}</span><span>{link.label}</span></NavLink>)}
      </nav>
      <div className="topbar-user"><span className="avatar avatar-small">{user.photo ? <img src={user.photo} alt="" /> : user.name.slice(0, 1).toUpperCase()}</span><span className="topbar-name">{user.name}</span><button className="text-button" type="button" onClick={onLogout}>Log out</button></div>
    </header>
  );
}
