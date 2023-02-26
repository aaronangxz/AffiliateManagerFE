import React from 'react';
import { ChevronRightIcon, HelpCircleFilledIcon, HelpCircleIcon, TipsIcon } from 'tdesign-icons-react';
import { Card, Col, Row, Tooltip } from 'tdesign-react';
import classnames from 'classnames';
import Style from './index.module.less';
import { QuestionCircleOutlined } from '@ant-design/icons';
import CountUp from 'react-countup';

export enum ETrend {
  up,
  down,
  none,
  undefined,
}

export interface IBoardProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  subtitle?: string;
  count?: string;
  Icon?: React.ReactElement;
  desc?: string;
  trend?: ETrend;
  trendNum?: string;
  dark?: boolean;
  border?: boolean;
  loading?: boolean;
}
const calculateFigures = (amount: number) => {
  if (amount > 1000) {
    return (
      <div className={Style.boardItemLeft}>
        MYR <CountUp start={0.0} decimals={2} end={amount / 1000} duration={0.8}></CountUp>K
      </div>
    );
  }
  return (
    <div className={Style.boardItemLeft}>
      MYR <CountUp start={0.0} decimals={2} end={amount} duration={0.8}></CountUp>
    </div>
  );
};

export const TrendIcon = ({ trend, trendNum }: { trend?: ETrend; trendNum?: string | number }) => {
  if (trend === undefined) {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginLeft: 'auto' }}>
        <Tooltip content='We are unable to calculate % change for custom period' theme='light'>
          <HelpCircleIcon size={'medium'} />
        </Tooltip>
      </div>
    );
  }

  if (trend === ETrend.none) {
    return (
      <div style={{ marginLeft: '5px' }}>
        <Tooltip content='The previous period has no data, hence we are unable to calculate the % change' theme='light'>
          <HelpCircleIcon size={'medium'} />
        </Tooltip>
      </div>
    );
  }

  if (trend === ETrend.undefined) {
    return null;
  }

  return (
    <div
      className={classnames({
        [Style.trendColorUp]: trend === ETrend.up,
        [Style.trendColorDown]: trend === ETrend.down,
      })}
    >
      <div
        className={classnames(Style.trendIcon, {
          [Style.trendIconUp]: trend === ETrend.up,
          [Style.trendIconDown]: trend === ETrend.down,
        })}
      >
        {}

        {trend === ETrend.up ? (
          <svg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path d='M4.5 8L8 4.5L11.5 8' stroke='currentColor' strokeWidth='1.5' />
            <path d='M8 5V12' stroke='currentColor' strokeWidth='1.5' />
          </svg>
        ) : (
          <svg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path d='M11.5 8L8 11.5L4.5 8' stroke='currentColor' strokeWidth='1.5' />
            <path d='M8 11L8 4' stroke='currentColor' strokeWidth='1.5' />
          </svg>
        )}
      </div>
      {trendNum}
    </div>
  );
};

const Board = ({ title, subtitle, count, desc, trend, trendNum, Icon, dark, border = false, loading }: IBoardProps) => (
  <Card
    hoverShadow={true}
    style={{ borderRadius: '15px' }}
    loading={loading}
    title={
      <span className={Style.boardTitle}>
        {title}{' '}
        <Tooltip content={subtitle} theme='light'>
          <HelpCircleIcon size={'medium'} />
        </Tooltip>
      </span>
    }
    className={classnames({
      [Style.boardPanelDark]: dark,
      [Style.boardPanel]: true,
    })}
    bordered={border}
    footer={
      <div className={Style.boardItemBottom}>
        <div className={Style.boardItemDesc}>
          {desc}
          <TrendIcon trend={trend} trendNum={trendNum} />
        </div>
        {/* <ChevronRightIcon className={Style.boardItemIcon} /> */}
      </div>
    }
  >
    <div className={Style.boardItem}>
      {title === 'Total Affiliate Revenue' ||
      title === 'Total Commission' ||
      title === 'Lifetime Affiliate Revenue' ||
      title === 'Lifetime Commission' ? (
        calculateFigures(count)
      ) : (
        <div className={Style.boardItemLeft}>
          {title === 'Total Affiliate Revenue' ||
          title === 'Total Commission' ||
          title === 'Lifetime Affiliate Revenue' ||
          title === 'Lifetime Commission'
            ? 'MYR '
            : ''}
          <CountUp start={0.0} end={parseInt(count, 10)} duration={0.8}></CountUp>
        </div>
      )}
      <div className={Style.boardItemRight}>{Icon}</div>
    </div>
  </Card>
);

export default React.memo(Board);
