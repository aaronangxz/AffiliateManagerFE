import React, { memo, useEffect } from 'react';
import { ConfigProvider, Drawer, Layout, merge } from 'tdesign-react';
import throttle from 'lodash/throttle';
import { useAppSelector, useAppDispatch } from 'modules/store';
import { selectGlobal, toggleSetting, toggleMenu, ELayout, switchTheme } from 'modules/global';
import Setting from './components/Setting';
import AppLayout from './components/AppLayout';
import Style from './index.module.less';
import enConfig from 'tdesign-react/es/locale/en_US';
import { useNavigate } from 'react-router-dom';

export default memo(() => {
  const globalState = useAppSelector(selectGlobal);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const AppContainer = AppLayout[globalState.isFullPage ? ELayout.fullPage : globalState.layout];

  useEffect(() => {
    if (localStorage.getItem('auth') === null) {
      navigate('/login/index');
    }
    dispatch(switchTheme(globalState.theme));
    const handleResize = throttle(() => {
      if (window.innerWidth < 900) {
        dispatch(toggleMenu(true));
      } else if (window.innerWidth > 1000) {
        dispatch(toggleMenu(false));
      }
    }, 100);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const globalConfig = merge(enConfig, {
    // 可以在此处定义更多自定义配置，具体可配置内容参看 API 文档
    calendar: {},
    table: {},
    pagination: {},
    // 全局动画设置
    animation: { exclude: [] },
  });

  return (
    <ConfigProvider globalConfig={globalConfig}>
      <Layout className={Style.panel}>
        <AppContainer />
        <Drawer
          destroyOnClose
          visible={globalState.setting}
          size='458px'
          footer={false}
          header='Settings'
          onClose={() => dispatch(toggleSetting())}
        >
          <Setting />
        </Drawer>
      </Layout>
    </ConfigProvider>
  );
});
