import React, { memo, useEffect, useState } from 'react';
import classNames from 'classnames';
import Login from './components/Login';
import Register from './components/Register';
import LoginHeader from './components/Header';
import { useAppSelector } from 'modules/store';
import { selectGlobal } from 'modules/global';

import Style from './index.module.less';
import { getToken } from '../../auth_token';
import { useNavigate } from 'react-router-dom';

export default memo(() => {
  const [type, setType] = useState('login');
  const globalState = useAppSelector(selectGlobal);
  const { theme } = globalState;
  const handleSwitchLoginType = () => {
    setType(type === 'register' ? 'login' : 'register');
  };
  const navigate = useNavigate();

  useEffect(() => {
    if (getToken() && getToken() !== null) {
      navigate('/');
    }
  }, []);

  return (
    <div
      className={classNames(Style.loginWrapper, { [Style.light]: theme === 'light', [Style.dark]: theme !== 'light' })}
    >
      <LoginHeader />
      <div className={Style.loginContainer}>
        <img src='/icons8-gas-96.png' alt={''} />
        <div className={Style.titleContainer}>
          <h1 className={Style.title}>Welcome to</h1>
          <h1 className={Style.title}>AffiliateManager</h1>
          <div className={Style.subTitle}>
            <p className={classNames(Style.tip, Style.registerTip)}>
              {type === 'register' ? 'Has an account?' : 'First time here?'}
            </p>
            <p className={classNames(Style.tip, Style.loginTip)} onClick={handleSwitchLoginType}>
              {type === 'register' ? 'Login' : 'Register'}
            </p>
          </div>
        </div>
        {type === 'login' ? <Login /> : <Register />}
      </div>
      {/* <footer className={Style.copyright}>Copyright @ 2023 @aaronangxz. All Rights Reserved</footer> */}
    </div>
  );
});
