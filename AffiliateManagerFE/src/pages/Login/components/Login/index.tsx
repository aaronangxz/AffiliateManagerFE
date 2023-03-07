import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, MessagePlugin, Input, Checkbox, Button, FormInstanceFunctions, SubmitContext } from 'tdesign-react';
import { LockOnIcon, UserIcon, BrowseOffIcon, BrowseIcon, RefreshIcon } from 'tdesign-icons-react';
import classnames from 'classnames';
import QRCode from 'qrcode.react';
import { useAppDispatch } from 'modules/store';
import envVar from '../../../../env_var';
import useCountdown from '../../hooks/useCountDown';

import Style from './index.module.less';
import { getRoot } from '../../../../router';
import getToken from '../../../../auth_token';

const { FormItem } = Form;

export type ELoginType = 'password' | 'phone' | 'qrcode';

export default function Login() {
  const [loginType, changeLoginType] = useState<ELoginType>('password');
  const [showPsw, toggleShowPsw] = useState(false);
  const { countdown, setupCountdown } = useCountdown(60);
  const formRef = useRef<FormInstanceFunctions>();
  const navigate = useNavigate();

  const performLogin = async (userInfo: Record<string, unknown>) => {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify({
      user_name: userInfo.account,
      user_password: userInfo.password,
    });

    fetch(`${envVar.Env}/api/v1/platform/login`, {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.response_meta.error_code !== 0) {
          MessagePlugin.error(result.response_meta.error_msg);
          return;
        }
        localStorage.setItem('auth', JSON.stringify(result.auth_cookie));
        MessagePlugin.success(`Welcome Back, ${result.auth_cookie.user_name}!`);
        navigate('/');
      })
      .catch((error) => {
        MessagePlugin.error(error);
      });
  };
  const onSubmit = async (e: SubmitContext) => {
    if (e.validateResult === true) {
      const formValue = formRef.current?.getFieldsValue?.(true) || {};
      performLogin(formValue);
    }
  };

  const switchType = (val: ELoginType) => {
    formRef.current?.reset?.();
    changeLoginType(val);
  };

  return (
    <div>
      <Form
        ref={formRef}
        className={classnames(Style.itemContainer, `login-${loginType}`)}
        labelWidth={0}
        onSubmit={onSubmit}
      >
        {loginType === 'password' && (
          <>
            <FormItem
              name='account'
              rules={[
                { required: true, message: 'Username is mandatory.', type: 'error' },
                { whitespace: true, message: 'Username is mandatory.', type: 'error' },
              ]}
            >
              <Input size='large' placeholder='Username：admin' prefixIcon={<UserIcon />}></Input>
            </FormItem>
            <FormItem name='password' rules={[{ required: true, message: 'Password is mandatory.', type: 'error' }]}>
              <Input
                size='large'
                type={showPsw ? 'text' : 'password'}
                placeholder='Password：admin'
                prefixIcon={<LockOnIcon />}
                suffixIcon={
                  showPsw ? (
                    <BrowseIcon onClick={() => toggleShowPsw((current) => !current)} />
                  ) : (
                    <BrowseOffIcon onClick={() => toggleShowPsw((current) => !current)} />
                  )
                }
              />
            </FormItem>
            {/* <div className={classnames(Style.checkContainer, Style.rememberPwd)}> */}
            {/*  /!* <Checkbox>Remember Me</Checkbox> *!/ */}
            {/*  <span className={Style.checkContainerTip}>Forgot your password？</span> */}
            {/* </div> */}
          </>
        )}

        {/* 扫码登陆 */}
        {loginType === 'qrcode' && (
          <>
            <div className={Style.tipContainer}>
              <span className='tip'>请使用微信扫一扫登录</span>
              <span className='refresh'>
                刷新 <RefreshIcon />
              </span>
            </div>
            <QRCode value='' size={200} />
          </>
        )}
        {/* // 手机号登陆 */}
        {loginType === 'phone' && (
          <>
            <FormItem name='phone' rules={[{ required: true, message: '手机号必填', type: 'error' }]}>
              <Input maxlength={11} size='large' placeholder='请输入您的手机号' prefixIcon={<UserIcon />} />
            </FormItem>
            <FormItem name='verifyCode' rules={[{ required: true, message: '验证码必填', type: 'error' }]}>
              <Input size='large' placeholder='请输入验证码' />
              <Button
                variant='outline'
                className={Style.verificationBtn}
                disabled={countdown > 0}
                onClick={setupCountdown}
              >
                {countdown === 0 ? '发送验证码' : `${countdown}秒后可重发`}
              </Button>
            </FormItem>
          </>
        )}
        {loginType !== 'qrcode' && (
          <FormItem className={Style.btnContainer}>
            <Button block size='large' type='submit'>
              Login
            </Button>
          </FormItem>
        )}
        {/* <div className={Style.switchContainer}> */}
        {/*  {loginType !== 'password' && ( */}
        {/*    <span className='tip' onClick={() => switchType('password')}> */}
        {/*      使用账号密码登录 */}
        {/*    </span> */}
        {/*  )} */}
        {/*  {loginType !== 'qrcode' && ( */}
        {/*    <span className='tip' onClick={() => switchType('qrcode')}> */}
        {/*      使用微信扫码登录 */}
        {/*    </span> */}
        {/*  )} */}
        {/*  {loginType !== 'phone' && ( */}
        {/*    <span className='tip' onClick={() => switchType('phone')}> */}
        {/*      使用手机号登录 */}
        {/*    </span> */}
        {/*  )} */}
        {/* </div> */}
      </Form>
    </div>
  );
}
