import React, { memo } from 'react';
import { Button } from 'tdesign-react';

import Light403Icon from 'assets/svg/assets-result-403.svg?component';
import Light404Icon from 'assets/svg/assets-result-404.svg?component';
import Light500Icon from 'assets/svg/assets-result-500.svg?component';
import style from './index.module.less';
import { useNavigate } from 'react-router-dom';

enum ECode {
  forbidden = 403,
  notFount = 404,
  error = 500,
}

interface IErrorPageProps {
  code: ECode;
  title?: string;
  desc?: string;
}

const errorInfo = {
  [ECode.forbidden]: {
    title: '403 Forbidden',
    desc: 'Oops, you do not have permission to access this page!',
    icon: <Light403Icon />,
  },
  [ECode.notFount]: {
    title: '404 Not Found',
    desc: 'Oops, we cannot find the page that you are looking for.',
    icon: <Light404Icon />,
  },
  [ECode.error]: {
    title: '500 Internal Server Error',
    desc: 'Oops, something is wrong.',
    icon: <Light500Icon />,
  },
};

const ErrorPage: React.FC<IErrorPageProps> = (props) => {
  const navigate = useNavigate();
  const info = errorInfo[props.code];

  const onClick = () => {
    navigate('/');
  };
  return (
    <div className={style.errorBox}>
      {info?.icon}
      <div className={style.title}>{info?.title}</div>
      <div className={style.description}>{info?.desc}</div>
      <Button theme='primary' onClick={onClick}>
        Back to home
      </Button>
    </div>
  );
};

export default memo(ErrorPage);
