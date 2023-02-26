import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Popup, Badge, Dropdown, Space } from 'tdesign-react';
import {
  Icon,
  LogoGithubIcon,
  MailIcon,
  HelpCircleIcon,
  SettingIcon,
  PoweroffIcon,
  UserCircleIcon,
} from 'tdesign-icons-react';
import { useAppDispatch } from 'modules/store';
import { toggleSetting } from 'modules/global';
import { logout } from 'modules/user';
import Style from './HeaderIcon.module.less';
import getToken from "../../../auth_token";

const { DropdownMenu, DropdownItem } = Dropdown;

export default memo(() => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const gotoWiki = () => {
    window.open('https://tdesign.tencent.com/react/overview');
  };

  const gotoGitHub = () => {
    window.open('https://github.com/Tencent/tdesign-react-starter');
  };

  const clickHandler = (data: any) => {
    if (data.value === 0) {
      navigate('/user/profile');
    }
  };
  const handleLogout = async () => {
    localStorage.removeItem('auth');
    navigate('/login/index');
  };

  return (
    <Space align='center'>
      {/*<Badge className={Style.badge} count={6} dot={false} maxCount={99} shape='circle' showZero={false} size='medium'>*/}
      {/*  <Button className={Style.menuIcon} shape='square' size='large' variant='text' icon={<MailIcon />} />*/}
      {/*</Badge>*/}
      {/*<Popup content='代码仓库' placement='bottom' showArrow destroyOnClose>*/}
      {/*  <Button*/}
      {/*    className={Style.menuIcon}*/}
      {/*    shape='square'*/}
      {/*    size='large'*/}
      {/*    variant='text'*/}
      {/*    onClick={gotoGitHub}*/}
      {/*    icon={<LogoGithubIcon />}*/}
      {/*  />*/}
      {/*</Popup>*/}
      {/*<Popup content='帮助文档' placement='bottom' showArrow destroyOnClose>*/}
      {/*  <Button*/}
      {/*    className={Style.menuIcon}*/}
      {/*    shape='square'*/}
      {/*    size='large'*/}
      {/*    variant='text'*/}
      {/*    onClick={gotoWiki}*/}
      {/*    icon={<HelpCircleIcon />}*/}
      {/*  />*/}
      {/*</Popup>*/}
      <Dropdown trigger={'click'} onClick={clickHandler}>
        <Button variant='text' className={Style.dropdown}>
          <Icon name='user-circle' className={Style.icon} />
          <span className={Style.text}>{getToken()?.user_name}</span>
          <Icon name='chevron-down' className={Style.icon} />
        </Button>
        <DropdownMenu>
          <DropdownItem value={0}>
            <div className={Style.dropItem}>
              <UserCircleIcon />
              <span>Profile</span>
            </div>
          </DropdownItem>
          <DropdownItem value={1} onClick={handleLogout}>
            <div className={Style.dropItem}>
              <PoweroffIcon />
              <span>Logout</span>
            </div>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Popup content='Settings' placement='bottom' showArrow destroyOnClose>
        <Button
          className={Style.menuIcon}
          shape='square'
          size='large'
          variant='text'
          onClick={() => dispatch(toggleSetting())}
          icon={<SettingIcon />}
        />
      </Popup>
    </Space>
  );
});
