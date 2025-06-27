import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { signUp } from '../../store/session';
import background from '../../assets/background.png';
import footer from '../../assets/footer.png';
import './auth.css';
import NavBar from '../NavBar';

const SignUpForm = () => {
  const [errors, setErrors] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);

  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();

  const onSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const errorsArr = [];

    if (firstName.length > 49) errorsArr.push("First Name must be less than 50 characters");
    if (lastName.length > 49) errorsArr.push("Last Name must be less than 50 characters");
    if (username.length > 39) errorsArr.push("Username must be less than 40 characters");
    if (nickname.length > 49) errorsArr.push("Nickname must be less than 50 characters");
    if (email.length > 254) errorsArr.push("Email must be less than 255 characters");
    if (password.length > 30) errorsArr.push("Password must be less than 30 characters");
    if (password !== repeatPassword) errorsArr.push("Passwords do not match");

    if (errorsArr.length) {
      setErrors(errorsArr);
      setLoading(false);
      return;
    }

    const data = await dispatch(signUp(username, email, password, firstName, lastName, nickname));
    if (data) {
      setErrors(data);
      setLoading(false);
    }
  };

  if (user) return <Redirect to='/dashboard' />;

  return (
    <div>
      <NavBar />
      <div id='signup-form-container'>
        <div className="auth-background" style={{ backgroundImage: `url(${background})` }}>
          <form className="auth-form" onSubmit={onSignUp}>
            <h2>Create Your Account</h2>
            {errors.length > 0 && (
              <ul className="auth-errors">
                {errors.map((error, idx) => <li key={idx}>{error}</li>)}
              </ul>
            )}
            <div className="form-grid">
              <label>
                First Name
                <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required />
              </label>
              <label>
                Last Name
                <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} required />
              </label>
              <label>
                Nickname
                <input type="text" value={nickname} onChange={e => setNickname(e.target.value)} required />
              </label>
              <label>
                Username
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
              </label>
              <label>
                Email
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </label>
              <label>
                Password
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
              </label>
              <label>
                Repeat Password
                <input type="password" value={repeatPassword} onChange={e => setRepeatPassword(e.target.value)} required />
              </label>
            </div>
            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
      <img className="footer" src={footer} alt="footer" />
    </div>
  );
};

export default SignUpForm;
