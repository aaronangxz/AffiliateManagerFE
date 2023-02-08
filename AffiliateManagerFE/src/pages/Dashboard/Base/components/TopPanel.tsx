import React, { useEffect, useState } from 'react';
import { Col, Row } from 'tdesign-react';
import { UsergroupIcon, FileIcon } from 'tdesign-icons-react';
import Board, { ETrend, IBoardProps } from 'components/Board';
import Style from './TopPanel.module.less';

export const TopPanel = () => {
  let coreStats = null;
  let coreStatsPrev = null;

  const [coreStatsState, setCoreStatsState] = useState({
    citizen_ticket_total: 0,
    tourist_ticket_total: 0,
    total_commission: 0,
    total_active_affiliates: 0,
    total_affiliate_bookings: 0,
  });

  const [coreStatsPrevState, setCoreStatsPrevState] = useState({
    citizen_ticket_total: 0,
    tourist_ticket_total: 0,
    total_commission: 0,
    total_active_affiliates: 0,
    total_affiliate_bookings: 0,
  });

  const calculateRevenueDiff = () => {
    const curr =
      ((coreStatsState.citizen_ticket_total == null ? 0 : coreStatsState.citizen_ticket_total) +
        (coreStatsState.tourist_ticket_total == null ? 0 : coreStatsState.tourist_ticket_total)) /
      100;

    const prev =
      ((coreStatsPrevState.citizen_ticket_total == null ? 0 : coreStatsPrevState.citizen_ticket_total) +
        (coreStatsPrevState.tourist_ticket_total == null ? 0 : coreStatsPrevState.tourist_ticket_total)) /
      100;

    return ((curr - prev) / curr) * 100;
  };

  const calculateCommissionDiff = () => {
    const curr = (coreStatsState.total_commission == null ? 0 : coreStatsState.citizen_ticket_total) / 100;
    const prev =
      (coreStatsPrevState.total_commission == null ? 0 : coreStatsPrevState.citizen_ticket_total) / 100;
    return ((curr - prev) / curr) * 100;
  };

  const calculateActiveAffiliatesDiff = () => {
    const curr =
      (coreStatsState.total_active_affiliates == null ? 0 : coreStatsState.total_active_affiliates) /
      100;
    const prev =
      (coreStatsPrevState.total_active_affiliates == null
        ? 0
        : coreStatsPrevState.total_active_affiliates) / 100;
    return ((curr - prev) / curr) * 100;
  };

  const calculateAffiliateBookingsDiff = () => {
    const curr =
      (coreStatsState.total_affiliate_bookings == null ? 0 : coreStatsState.total_affiliate_bookings) /
      100;
    const prev =
      (coreStatsPrevState.total_affiliate_bookings == null
        ? 0
        : coreStatsPrevState.total_affiliate_bookings) / 100;
    return ((curr - prev) / curr) * 100;
  };

  const PANE_LIST: Array<IBoardProps> = [
    {
      title: 'Total Affiliate Revenue (Week)',
      count: `MYR ${((coreStatsState.citizen_ticket_total + coreStatsState.tourist_ticket_total) / 100).toFixed(2)}`,
      trend: calculateRevenueDiff() < 0 ? ETrend.down : ETrend.up,
      trendNum: `${calculateRevenueDiff().toFixed(2)}%`,
    },
    {
      title: 'Total Commission (Week)',
      count: `MYR ${(coreStatsState.total_commission / 100).toFixed(2)}`,
      trend: calculateCommissionDiff() < 0 ? ETrend.down : ETrend.up,
      trendNum: `${calculateCommissionDiff().toFixed(2)}%`,
    },
    {
      title: 'Active Affiliates (Week)',
      count: `${coreStatsState.total_active_affiliates}`,
      trend: calculateActiveAffiliatesDiff() < 0 ? ETrend.down : ETrend.up,
      trendNum: `${calculateActiveAffiliatesDiff().toFixed(2)}%`,
      Icon: (
        <div className={Style.iconWrap}>
          <UsergroupIcon className={Style.svgIcon} />
        </div>
      ),
    },
    {
      title: 'Affiliate Bookings (Week)',
      count: `${coreStatsState.total_affiliate_bookings}`,
      trend: calculateAffiliateBookingsDiff() < 0 ? ETrend.down : ETrend.up,
      trendNum: `${calculateAffiliateBookingsDiff().toFixed(2)}%`,
      Icon: (
        <div className={Style.iconWrap}>
          <FileIcon className={Style.svgIcon} />
        </div>
      ),
    },
  ];

  const getAffiliateCoreStats = () => {
    fetch('http://127.0.0.1:8888/api/v1/affiliate/stats', {
      method: 'GET',
      redirect: 'follow',
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.response_meta.error_code !== 0) {
          console.log(result.response_meta.error_msg);
          return;
        }

        coreStats = result.affiliate_stats.core_stats;
        coreStatsPrev = result.affiliate_stats_previous_cycle.core_stats;
        setCoreStatsState(coreStats);
        setCoreStatsPrevState(coreStatsPrev);

        console.log(coreStats);
        console.log(coreStatsPrev);
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  useEffect(() => {
    getAffiliateCoreStats();
  }, []);

  return (
    <Row gutter={[16, 16]}>
      {PANE_LIST.map((item, index) => (
        <Col key={item.title} xs={6} xl={3}>
          <Board
            title={item.title}
            trend={item.trend}
            trendNum={item.trendNum}
            count={item.count}
            desc={'vs Last Week'}
            Icon={item.Icon}
          />
        </Col>
      ))}
    </Row>
  );
};

export default React.memo(TopPanel);
