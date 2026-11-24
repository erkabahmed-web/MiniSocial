import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Signup({ onSignup }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function submit(event) {
    event.preventDefault();
    const result = onSignup(name, email, password);
    if (result) return setError(result);
    navigate('/feed', { replace: true });
  }

  return <main className="auth-page"><section className="auth-panel"><Link className="brand auth-brand" to="/login"><span className="brand-mark">m</span><span>mini<span className="brand-light">social</span></span></Link><p className="eyebrow">MAKE YOURSELF AT HOME</p><h1>Find your people.</h1><p className="auth-intro">A little space for the conversations that matter.</p>
    <form className="form-stack" onSubmit={submit} noValidate>
      <label>Full name<input type="text" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} maxLength={70} required /></label>
      <label>Email address<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
      <label>Password <span className="field-hint">8 characters minimum</span><input type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} required /></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="primary-button" type="submit">Create account <span aria-hidden="true">↗</span></button>
    </form>
    <p className="auth-switch">Already have an account? <Link to="/login">Log in</Link></p>
  </section><aside className="auth-art signup-art" aria-label="Illustration of a welcoming little corner"><span className="art-stamp">A SOFTER<br />KIND OF<br />SOCIAL</span><div className="art-caption"><span>02 / FIND YOUR PEOPLE</span><p>Room for the<br />everyday things.</p></div><div className="sun-shape" /><div className="plant-shape"><i /><i /><i /></div></aside></main>;
}
