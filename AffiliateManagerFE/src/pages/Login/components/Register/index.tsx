import React, { useState, useRef } from 'react';
import classnames from 'classnames';
import {
  Form,
  MessagePlugin,
  Input,
  Checkbox,
  Button,
  FormInstanceFunctions,
  SubmitContext,
  Select,
} from 'tdesign-react';
import {
  LockOnIcon,
  UserIcon,
  MailIcon,
  BrowseOffIcon,
  BrowseIcon,
  HomeIcon,
  FolderIcon,
  MobileIcon,
  FileIcon,
} from 'tdesign-icons-react';
import useCountdown from '../../hooks/useCountDown';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import Style from './index.module.less';

const { FormItem } = Form;

export type ERegisterType = 'phone' | 'email';

export default function Register() {
  const [registerType, changeRegisterType] = useState('email');
  const [showPsw, toggleShowPsw] = useState(false);
  const { countdown, setupCountdown } = useCountdown(60);
  const formRef = useRef<FormInstanceFunctions>();
  const [contact, setContact] = useState('');
  const handleNumChange = (event: any) => {
    console.log(event);
    setContact(event);
  };
  const onSubmit = (e: SubmitContext) => {
    if (e.validateResult === true) {
      const { checked } = formRef.current?.getFieldsValue?.(['checked']) as { checked: boolean };
      if (!checked) {
        MessagePlugin.error('请同意 TDesign 服务协议和 TDesign 隐私声明');
        return;
      }
      MessagePlugin.success('注册成功');
    }
  };

  const switchType = (val: ERegisterType) => {
    formRef.current?.reset?.();
    changeRegisterType(val);
  };

  return (
    <div>
      <Form
        ref={formRef}
        className={classnames(Style.itemContainer, `register-${registerType}`)}
        labelWidth={0}
        onSubmit={onSubmit}
      >
        <FormItem
          name='entityName'
          rules={[{ required: true, message: 'Entity Name is mandatory.', type: 'error' }]}
          help='Entity name is the name of your business.'
        >
          <Input type='text' size='large' placeholder='Entity Name' prefixIcon={<HomeIcon />} />
        </FormItem>
        <FormItem
          name='entityId'
          rules={[{ required: true, message: 'Entity Identifier is mandatory.', type: 'error' }]}
          help='Entity identifier is the identification number of your business.'
        >
          <Input type='text' size='large' placeholder='Entity Identifier' prefixIcon={<FileIcon />} />
        </FormItem>
        {registerType === 'phone' && (
          <FormItem name='phone' rules={[{ required: true, message: '手机号必填', type: 'error' }]}>
            <Input maxlength={11} size='large' placeholder='请输入您的手机号' prefixIcon={<MobileIcon />} />
          </FormItem>
        )}
        <FormItem name='userName' rules={[{ required: true, message: 'Username is mandatory.', type: 'error' }]}>
          <Input type='text' size='large' placeholder='Username' prefixIcon={<UserIcon />} />
        </FormItem>
        <FormItem name='password' rules={[{ required: true, message: 'Password is mandatory.', type: 'error' }]}>
          <Input
            size='large'
            type={showPsw ? 'text' : 'password'}
            placeholder='Password'
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
        {registerType === 'email' && (
          <FormItem
            name='email'
            rules={[
              { required: true, message: 'Email is mandatory.', type: 'error' },
              { email: true, message: 'Incorrect email format', type: 'warning' },
            ]}
          >
            <Input type='text' size='large' placeholder='Email' prefixIcon={<MailIcon />} />
          </FormItem>
        )}
        <FormItem name='phone' rules={[{ required: true, message: 'Contact Number is mandatory.', type: 'error' }]}>
          <Input maxlength={15} size='large' placeholder='Contact Number' prefixIcon={<MobileIcon />} />
          {/* <PhoneInput */}
          {/*  country={'my'} */}
          {/*  onChange={(event) => handleNumChange(event)} */}
          {/*  inputStyle={{ color: 'black' }} */}
          {/*  preferredCountries={['my', 'sg']} */}
          {/*  countryCodeEditable={false} */}
          {/*  autoFormat={false} */}
          {/* /> */}
        </FormItem>
        <FormItem name='entityName' help='You may specify a referral code that represents your business.'>
          <Input type='text' size='large' placeholder='Preferred Referral Code' prefixIcon={<HomeIcon />} />
        </FormItem>
        <FormItem name='type' rules={[{ required: true, message: 'Business Type is mandatory.', type: 'error' }]}>
          {
            <Select clearable placeholder={'Business Type'} defaultValue={'A'}>
              <Select.Option label={'Accommodation Provider'} key={'A'} value={0} />
              <Select.Option label={'Ride Hailing Services'} key={'B'} value={1} />
            </Select>
          }
        </FormItem>
        {registerType === 'phone' && (
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
        )}
        <FormItem className={Style.checkContainer} name='checked' initialData={false}>
          <Checkbox>I agree to share my sales data with AffiliateManager.</Checkbox>
        </FormItem>
        <FormItem>
          <Button block size='large' type='submit'>
            Join
          </Button>
        </FormItem>
        {/* <div className={Style.switchContainer}> */}
        {/*  <span className={Style.switchTip} onClick={() => switchType(registerType === 'phone' ? 'email' : 'phone')}> */}
        {/*    {registerType === 'phone' ? '使用邮箱注册' : '使用手机号注册'} */}
        {/*  </span> */}
        {/* </div> */}
      </Form>
    </div>
  );
}
