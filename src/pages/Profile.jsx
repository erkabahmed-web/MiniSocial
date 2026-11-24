import { useRef, useState } from 'react';

const MAX_PHOTO_SIZE = 1024 * 1024;

export default function Profile({ user, onUpdate }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [bio, setBio] = useState(user.bio || '');
  const [photo, setPhoto] = useState(user.photo || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const photoInput = useRef(null);

  function submit(event) {
    event.preventDefault();
    const result = onUpdate({ name, email, bio, password, photo });
    if (result) {
      setError(result);
      setSaved(false);
      return;
    }
    setError('');
    setPassword('');
    setSaved(true);
  }

  function selectPhoto(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Choose an image file for your profile photo.');
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
        setSaved(false);
      } else {
        setError('This image could not be opened.');
      }
    };
    reader.onerror = () => setError('This image could not be opened.');
    reader.readAsDataURL(file);
  }

  return <main className="page-wrap standard-page profile-page"><div className="page-heading"><div><p className="eyebrow">YOUR ACCOUNT</p><h1>Profile<span className="heading-period">.</span></h1></div><span className="heading-date">A little about you</span></div>
    <div className="profile-layout"><aside className="profile-preview"><span className="profile-avatar">{photo ? <img src={photo} alt="" /> : user.name.slice(0, 1).toUpperCase()}</span><h2>{user.name}</h2><p>{user.email}</p><p className="profile-bio">{user.bio || 'Your bio will appear here.'}</p><span className="profile-label">MINISOCIAL MEMBER</span></aside>
      <section className="profile-form-section"><div className="section-title"><div><h2>Edit details</h2><p>Changes are saved in this browser.</p></div></div><form className="form-stack profile-form" onSubmit={submit} noValidate>
        <div className="profile-photo-control"><span>Profile photo <small>Up to 1 MB</small></span><input ref={photoInput} className="sr-only" type="file" accept="image/*" aria-label="Choose a profile photo" onChange={selectPhoto} /><div className="profile-photo-buttons"><button className="secondary-button" type="button" onClick={() => photoInput.current?.click()}>Choose photo</button>{photo && <button className="photo-remove" type="button" onClick={() => { setPhoto(''); setSaved(false); setError(''); }}>Remove</button>}</div></div>
        <label>Full name<input type="text" autoComplete="name" value={name} onChange={(event) => { setName(event.target.value); setSaved(false); }} maxLength={70} required /></label>
        <label>Email address<input type="email" autoComplete="email" value={email} onChange={(event) => { setEmail(event.target.value); setSaved(false); }} required /></label>
        <label>About you <span className="field-hint">Optional</span><textarea value={bio} onChange={(event) => { setBio(event.target.value); setSaved(false); }} maxLength={240} rows={4} /></label>
        <label>New password <span className="field-hint">Leave blank to keep your current password</span><input type="password" autoComplete="new-password" value={password} onChange={(event) => { setPassword(event.target.value); setSaved(false); }} minLength={8} /></label>
        {error && <p className="form-error" role="alert">{error}</p>}{saved && <p className="form-success" role="status">Your profile has been updated.</p>}
        <div className="profile-submit"><button className="primary-button" type="submit">Save changes <span aria-hidden="true">↗</span></button></div>
      </form><p className="storage-note">Demo note: account details and password are stored locally in this browser. This prototype does not provide production account security.</p></section>
    </div>
  </main>;
}
