import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { login } from '../../store/session';
import background from '../../assets/background.png'
import './auth.css'
import footer from '../../assets/footer.png'
import github from '../../assets/github.png'

function getCSRFToken() {
  const match = document.cookie.match(/csrf_token=([^;]+)/);
  return match ? match[1] : null;
}

const LoginForm = () => {
  const [errors, setErrors] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();

  const onLogin = async (e) => {
    e.preventDefault();
    await fetch(`/api/auth/csrf-token`, { credentials: 'include' });
    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(data);
    }
  };

  const demoLogin = async () => {
  await fetch(`/api/auth/csrf-token`, { credentials: 'include' });
  const data = await dispatch(login('demo@aa.io', 'password'));
  if (data) setErrors(data);
};

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  if (user) {
    return <Redirect to='/dashboard' />;
  }

  return (
    <>
    <div id='login-form-container' style={{ backgroundImage: `url(${background})`}}>
      <form id='login-form' onSubmit={onLogin}>
        <div className='auth-form-title'>Log in</div>
        <div>
          {errors.map((error, ind) => (
            <div key={ind}>{error}</div>
          ))}
        </div>
        <div className='auth_form_input_container'>
          <div htmlFor='email'>Email address:</div>
          <input
            name='email'
            type='email'
            placeholder='Email'
            value={email}
            onChange={updateEmail}
          />
        </div>
        <div className='auth_form_input_container'>
          <div htmlFor='password'>Password:</div>

          <input
            name='password'
            type='password'
            placeholder='Password'
            value={password}
            onChange={updatePassword}
          />
        </div>
        <button id='login-form-button' type='submit'>Log in</button>
        <p>------- or --------</p>
        <button type='button' onClick={demoLogin}>Log in with demo user</button>
      </form>
    </div>
   
    <img className='footer' src={footer} alt='footer'></img>
    </>
  );
};

export default LoginForm;
