import React, { useEffect, useState } from 'react';
import { Col, Row, Table, Button, Card, MessagePlugin, Tag } from 'tdesign-react';
import { TdPrimaryTableProps } from 'tdesign-react/es/table';
import Style from './RecentList.module.less';
import moment from 'moment/moment';

import { CheckCircleFilledIcon, CloseCircleFilledIcon, HourglassIcon, RefreshIcon } from 'tdesign-icons-react';

const statusNameListMap: any = {
  0: { label: 'Success', theme: 'success', icon: <CheckCircleFilledIcon /> },
  1: { label: 'Pending', theme: 'warning', icon: <HourglassIcon /> },
  2: { label: 'Failed', theme: 'danger', icon: <CloseCircleFilledIcon /> },
  3: { label: 'Cancelled', theme: 'danger', icon: <CloseCircleFilledIcon /> },
};

const DEFAULT_ID = 6;
export const RecentList = () => {
  const clickList: any = [];
  const earningList: any = [];

  const [recentClicksListState, setRecentClicksListState] = useState([]);
  const [recentEarningsListState, setRecentEarningsListState] = useState([]);
  const [clicksRefreshTime, setClicksRefreshTime] = useState(moment());
  const [earningsRefreshTime, setEarningsRefreshTime] = useState(moment());
  const [clicksRefresh, setClicksRefresh] = useState(false);
  const [earningsRefresh, setEarningsRefresh] = useState(false);
  const [clicksLoading, setClicksLoading] = useState(false);
  const [earningsLoading, setEarningsLoading] = useState(false);

  const getRecentClicksList = () => {
    setClicksLoading(true);
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify({
      affiliate_id: DEFAULT_ID,
    });
    fetch(`http://127.0.0.1:8888/api/v1/referral/recent/list`, {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.response_meta.error_code !== 0) {
          setClicksLoading(false);
          MessagePlugin.error(result.response_meta.error_msg).then();
          return;
        }

        if (result.referral_recent.recent_clicks !== null) {
          for (let i = 0; i < result.referral_recent.recent_clicks.length; i++) {
            clickList.push(result.referral_recent.recent_clicks[i]);
          }
        }
        setRecentClicksListState(clickList);
        setClicksRefreshTime(moment());
        setClicksLoading(false);
      })
      .catch((error) => {
        setClicksLoading(false);
        MessagePlugin.error(error).then();
      });
  };

  const getRecentEarningsList = () => {
    setEarningsLoading(true);
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify({
      affiliate_id: DEFAULT_ID,
    });
    fetch(`http://127.0.0.1:8888/api/v1/referral/recent/list`, {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.response_meta.error_code !== 0) {
          setEarningsLoading(false);
          MessagePlugin.error(result.response_meta.error_msg).then();
          return;
        }

        if (result.referral_recent.recent_earnings !== null) {
          for (let i = 0; i < result.referral_recent.recent_earnings.length; i++) {
            earningList.push(result.referral_recent.recent_earnings[i]);
          }
        }
        setRecentEarningsListState(earningList);
        setEarningsRefreshTime(moment());
        setEarningsLoading(false);
      })
      .catch((error) => {
        setEarningsLoading(false);
        MessagePlugin.error(error).then();
      });
  };

  // const AffiliateRadioGroup = (
  //   <Radio.Group
  //     defaultValue='3'
  //     onChange={(value: any) => {
  //       setClicksRefresh(value);
  //     }}
  //   >
  //     <Radio.Button value='2'>This Week</Radio.Button>
  //     <Radio.Button value='3'>This Month</Radio.Button>
  //   </Radio.Group>
  // );
  //
  // const CommissionRadioGroup = (
  //   <Radio.Group
  //     defaultValue='3'
  //     onChange={(value: any) => {
  //       setEarningsPeriod(value);
  //     }}
  //   >
  //     <Radio.Button value='2'>This Week</Radio.Button>
  //     <Radio.Button value='3'>This Month</Radio.Button>
  //   </Radio.Group>
  // );

  const CLICKS_COLUMNS: TdPrimaryTableProps['columns'] = [
    {
      fixed: 'left',
      align: 'center',
      ellipsis: true,
      colKey: 'referral_id',
      title: 'ID',
      width: 'auto',
    },
    {
      align: 'center',
      ellipsis: true,
      colKey: 'referral_status',
      title: 'Status',
      width: 'auto',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      cell: (record: { row: { referral_status: any } }) => (
        <Tag
          style={{ alignItems: 'center', justifyContent: 'center', display: 'flex' }}
          shape='round'
          theme={statusNameListMap[record.row.referral_status].theme}
          variant='light-outline'
          icon={statusNameListMap[record.row.referral_status].icon}
        >
          {statusNameListMap[record.row.referral_status].label}
        </Tag>
      ),
    },
    {
      align: 'center',
      colKey: 'referral_click_time',
      title: 'Click Time',
      width: '250',
      cell: ({ row }) =>
        row.referral_click_time === '' ? '' : moment.unix(row.referral_click_time).format('DD/MM/yyyy, hh:mm:ss'),
    },
    {
      align: 'center',
      colKey: 'operation',
      fixed: 'right',
      title: 'Details',
      width: 'auto',
      cell: ({ row }) =>
        row.referral_id === undefined ? null : (
          <Button variant='text' theme='primary' onClick={() => console.log(row)}>
            View
          </Button>
        ),
    },
  ];

  const EARNINGS_COLUMNS: TdPrimaryTableProps['columns'] = [
    {
      fixed: 'left',
      align: 'center',
      ellipsis: true,
      colKey: 'referral_id',
      title: 'ID',
      width: '50',
    },
    {
      align: 'center',
      ellipsis: true,
      colKey: 'booking_ref_id',
      title: 'Booking Ref',
      width: 'auto',
    },
    {
      align: 'center',
      colKey: 'referral_click_time',
      title: 'Booking Time',
      width: '200',
      cell: ({ row }) =>
        row.booking_time === undefined ? '' : moment.unix(row.booking_time).format('DD/MM/yyyy, hh:mm:ss'),
    },
    {
      align: 'center',
      colKey: 'total_commission',
      title: 'Commission',
      width: 'auto',
      cell: ({ row }) => (row.referral_commission === '' ? null : `MYR ${(row.referral_commission / 100).toFixed(2)}`),
    },
    {
      align: 'center',
      colKey: 'operation',
      title: 'Details',
      fixed: 'right',
      width: 'auto',
      cell: ({ row }) =>
        row.referral_id === undefined ? null : (
          <Button variant='text' theme='primary' onClick={() => console.log(row)}>
            View
          </Button>
        ),
    },
  ];

  useEffect(() => {
    getRecentClicksList();
  }, [!clicksRefresh]);

  useEffect(() => {
    getRecentEarningsList();
  }, [!earningsRefresh]);

  const handleClick = () => {
    setClicksRefresh(!clicksRefresh);
    setClicksRefreshTime(moment());
  };

  const handleEarnings = () => {
    setEarningsRefresh(!earningsRefresh);
    setEarningsRefreshTime(moment());
  };

  const onClicksRefresh = (
    <Button variant='outline' icon={<RefreshIcon />} onClick={handleClick} loading={clicksLoading}>
      Refresh
    </Button>
  );

  const onEarningsRefresh = (
    <Button variant='outline' icon={<RefreshIcon />} onClick={handleEarnings} loading={earningsLoading}>
      Refresh
    </Button>
  );

  return (
    <Row gutter={[16, 16]} className={Style.rankListPanel}>
      <Col xs={12} xl={6} span={12}>
        <Card
          title='Recent 10 Clicks'
          subtitle={`As at ${clicksRefreshTime.format('MMM DD, yyyy h:mm:ss a')} (GMT+8)`}
          actions={onClicksRefresh}
          bordered={false}
          hoverShadow={true}
          style={{ borderRadius: '15px' }}
        >
          <Table
            style={{ height: '600px' }}
            columns={CLICKS_COLUMNS}
            rowKey='referral_id'
            size='medium'
            data={recentClicksListState}
            loading={clicksLoading}
          />
        </Card>
      </Col>
      <Col xs={12} xl={6} span={12}>
        <Card
          title='Recent 10 Earnings'
          subtitle={`As at ${earningsRefreshTime.format('MMM DD, yyyy h:mm:ss a')} (GMT+8)`}
          actions={onEarningsRefresh}
          bordered={false}
          hoverShadow={true}
          style={{ borderRadius: '15px' }}
        >
          <Table
            style={{ height: '600px' }}
            columns={EARNINGS_COLUMNS}
            rowKey='referral_id'
            size='medium'
            data={recentEarningsListState}
            loading={earningsLoading}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default React.memo(RecentList);
