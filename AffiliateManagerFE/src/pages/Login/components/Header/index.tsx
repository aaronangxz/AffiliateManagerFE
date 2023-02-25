import React from 'react';
import { Button, Col, Row } from 'tdesign-react';
import { LogoGithubIcon, HelpCircleIcon, SettingIcon } from 'tdesign-icons-react';
import { useAppDispatch } from 'modules/store';
import { toggleSetting } from 'modules/global';

import LogoFullIcon from 'assets/svg/assets-logo-full.svg?component';
import Style from './index.module.less';

export default function Header() {
  const dispatch = useAppDispatch();

  const navToGitHub = () => {
    window.open('https://github.com/tencent/tdesign-react-starter');
  };

  const navToHelper = () => {
    window.open('http://tdesign.tencent.com/starter/docs/react/get-started');
  };

  const toggleSettingPanel = () => {
    dispatch(toggleSetting());
  };

  return (
    <div>
      <header className={Style.loginHeader}>
        {/*<div className={Style.logo} style={{ padding: '10px' }}>*/}
        {/*  <Row>*/}
        {/*    <Col span={6}>*/}
        {/*      <img src='/icons8-gas-96.png' alt={''} />*/}
        {/*    </Col>*/}
        {/*    <Col span={1}>*/}
        {/*      <h1>AffiliateManager</h1>*/}
        {/*    </Col>*/}
        {/*  </Row>*/}
        {/*</div>*/}
        {/* <LogoFullIcon className={Style.logo} /> */}
        {/* <div className={Style.operationsContainer}> */}
        {/*  <Button */}
        {/*    className={Style.operationsButton} */}
        {/*    theme='default' */}
        {/*    shape='square' */}
        {/*    variant='text' */}
        {/*    onClick={navToGitHub} */}
        {/*  > */}
        {/*    <LogoGithubIcon className={Style.icon} /> */}
        {/*  </Button> */}
        {/*  <Button */}
        {/*    className={Style.operationsButton} */}
        {/*    theme='default' */}
        {/*    shape='square' */}
        {/*    variant='text' */}
        {/*    onClick={navToHelper} */}
        {/*  > */}
        {/*    <HelpCircleIcon className={Style.icon} /> */}
        {/*  </Button> */}
        {/*  <Button */}
        {/*    className={Style.operationsButton} */}
        {/*    theme='default' */}
        {/*    shape='square' */}
        {/*    variant='text' */}
        {/*    onClick={toggleSettingPanel} */}
        {/*  > */}
        {/*    <SettingIcon className={Style.icon} /> */}
        {/*  </Button> */}
        {/* </div> */}
      </header>
    </div>
  );
}
