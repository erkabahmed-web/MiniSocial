import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  function submit(event) {
    event.preventDefault();
    const result = onLogin(email, password);
    if (result) return setError(result);
    navigate(location.state?.from || '/feed', { replace: true });
  }

  return <main className="auth-page"><section className="auth-panel"><Link className="brand auth-brand" to="/login"><span className="brand-mark">m</span><span>mini<span className="brand-light">social</span></span></Link><p className="eyebrow">A LITTLE CLOSER, EVERY DAY</p><h1>Welcome back.</h1><p className="auth-intro">Pick up where your people left off.</p>
    <form className="form-stack" onSubmit={submit} noValidate>
      <label>Email address<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
      <label>Password<input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="primary-button" type="submit">Log in <span aria-hidden="true">↗</span></button>
    </form>
    <Link className="subtle-link forgot-link" to="/forgot-password">Forgot password?</Link>
    <p className="auth-switch">New around here? <Link to="/signup">Create an account</Link></p>
  </section><aside className="auth-art" aria-label="A calm place to catch up"><span className="art-stamp">YOUR<br />SMALL<br />CORNER</span><div className="art-caption"><span>01 / A PLACE TO PAUSE</span><p>Good days are<br />better shared.</p></div><div className="sun-shape" /><div className="plant-shape"><i /><i /><i /></div></aside></main>;
}
