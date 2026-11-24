import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword({ onReset }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  function submit(event) {
    event.preventDefault();
    const result = onReset(email, password);
    if (result) return setError(result);
    setError('');
    setDone(true);
  }

  return <main className="auth-page"><section className="auth-panel"><Link className="brand auth-brand" to="/login"><span className="brand-mark">m</span><span>mini<span className="brand-light">social</span></span></Link><p className="eyebrow">ACCOUNT ACCESS</p><h1>Reset password.</h1><p className="auth-intro">This prototype updates the password for an account saved in this browser.</p>
    {done ? <div className="success-panel" role="status"><span className="success-mark">✓</span><p>Password updated for this demo account.</p><Link className="primary-button button-link" to="/login">Continue to log in <span aria-hidden="true">↗</span></Link></div> : <form className="form-stack" onSubmit={submit} noValidate>
      <label>Email address<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
      <label>New password <span className="field-hint">8 characters minimum</span><input type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} required /></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="primary-button" type="submit">Update password <span aria-hidden="true">↗</span></button>
    </form>}
    <p className="auth-switch"><Link to="/login">← Back to log in</Link></p>
  </section><aside className="auth-art" aria-label="A quiet moment"><span className="art-stamp">TAKE<br />YOUR<br />TIME</span><div className="art-caption"><span>03 / BACK TO YOUR PEOPLE</span><p>A fresh start,<br />right here.</p></div><div className="sun-shape" /><div className="plant-shape"><i /><i /><i /></div></aside></main>;
}
