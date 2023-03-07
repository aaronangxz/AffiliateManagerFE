import React, { memo } from 'react';
import Style from './Menu.module.less';
import FullLogo from 'assets/svg/assets-logo-full.svg?component';
import MiniLogo from 'assets/svg/assets-t-logo.svg?component';
import { useNavigate } from 'react-router-dom';

interface IProps {
  collapsed?: boolean;
}

export default memo((props: IProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/');
  };

  return (
    <div className={Style.menuLogo} onClick={handleClick}>
      {props.collapsed ? <img src='/icons8-gas-40.png' alt={''}/> : <img src='/icons8-gas-40.png' alt={''} style={{paddingRight:'5px'}}/>}
      {props.collapsed ? '' : <h3>AffiliateManager</h3>}
    </div>
  );
});
