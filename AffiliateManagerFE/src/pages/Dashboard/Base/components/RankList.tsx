import React, { useEffect, useState } from 'react';
import { Col, Radio, Row, Table, Button, Card } from 'tdesign-react';
import { TdPrimaryTableProps } from 'tdesign-react/es/table';
import classnames from 'classnames';
import { TrendIcon, ETrend } from 'components/Board';
import { PURCHASE_TREND_LIST, SALE_TREND_LIST } from '../constant';
import Style from './RankList.module.less';

const DateRadioGroup = (
  <Radio.Group defaultValue='recent_week'>
    <Radio.Button value='recent_week'>This Week</Radio.Button>
    <Radio.Button value='recent_month'>This Month</Radio.Button>
  </Radio.Group>
);

const affiliateTypeMap: {
  [key: number]: string;
} = {
  0: 'Airbnb',
  1: 'Grab',
};

export const RankList = () => {
  const refList: any = [];
  const commList: any = [];

  const [topReferralListState, setTopReferralListState] = useState([]);
  const [topCommissionListState, setTopCommissionListState] = useState([]);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);

  const getAffiliateRankingList = () => {
    fetch('http://127.0.0.1:8888/api/v1/affiliate/ranking/list', {
      method: 'GET',
      redirect: 'follow',
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.response_meta.error_code !== 0) {
          console.log(result.response_meta.error_msg);
          return;
        }

        if (result.affiliate_ranking.top_affiliate_referral_list !== null) {
          for (let i = 0; i < result.affiliate_ranking.top_affiliate_referral_list.length; i++) {
            refList.push(result.affiliate_ranking.top_affiliate_referral_list[i]);
          }
        }
        setTopReferralListState(refList);
        console.log(topReferralListState);

        if (result.affiliate_ranking.top_affiliate_commission_list !== null) {
          for (let i = 0; i < result.affiliate_ranking.top_affiliate_commission_list.length; i++) {
            commList.push(result.affiliate_ranking.top_affiliate_commission_list[i]);
          }
        }
        setTopCommissionListState(commList);
        console.log(topCommissionListState);
        setStartTime (result.affiliate_ranking.start_time);
        setEndTime (result.affiliate_ranking.end_time);
        console.log(startTime);
        console.log(endTime);

        console.log(result);
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  const AFFILIATES_COLUMNS: TdPrimaryTableProps['columns'] = [
    {
      align: 'center',
      colKey: 'index',
      title: 'Rank',
      width: 80,
      fixed: 'left',
      cell: ({ rowIndex }) => (
        <span className={classnames(Style.rankIndex, { [Style.rankIndexTop]: rowIndex < 3 })}>{rowIndex + 1}</span>
      ),
    },
    {
      align: 'left',
      ellipsis: true,
      colKey: 'affiliate_name',
      title: 'Name',
      width: 'auto',
    },
    {
      align: 'left',
      ellipsis: true,
      colKey: 'affiliate_type',
      title: 'Type',
      width: 'auto',
      cell: ({ row }) => (
        affiliateTypeMap[row.affiliate_type]
      ),
    },
    {
      align: 'center',
      colKey: 'increase',
      width: 100,
      title: 'Increase',
      cell: ({ row }) => (
        <TrendIcon
          trend={row.total_referrals < row.previous_cycle_referrals ? ETrend.down : ETrend.up}
          trendNum={`${((row.total_referrals - row.previous_cycle_referrals) / row.total_referrals) * 100}%`}
        />
      ),
    },
    {
      align: 'center',
      colKey: 'total_referrals',
      title: 'Referrals',
      width: 100,
    },
    {
      align: 'center',
      colKey: 'operation',
      fixed: 'right',
      title: 'Details',
      width: 80,
      cell: ({ row }) => (
        <Button variant='text' theme='primary' onClick={() => console.log(row)}>
          View
        </Button>
      ),
    },
  ];

  const COMMISSIONS_COLUMNS: TdPrimaryTableProps['columns'] = [
    {
      align: 'center',
      colKey: 'index',
      title: 'Rank',
      width: 80,
      fixed: 'left',
      cell: ({ rowIndex }) => (
        <span className={classnames(Style.rankIndex, { [Style.rankIndexTop]: rowIndex < 3 })}>{rowIndex + 1}</span>
      ),
    },
    {
      align: 'left',
      ellipsis: true,
      colKey: 'affiliate_name',
      title: 'Name',
      width: 'auto',
    },
    {
      align: 'left',
      ellipsis: true,
      colKey: 'affiliate_type',
      title: 'Type',
      width: 'auto',
      cell: ({ row }) => (
        affiliateTypeMap[row.affiliate_type]
      ),
    },
    {
      align: 'center',
      colKey: 'increase',
      width: 100,
      title: 'Increase',
      cell: ({ row }) => (
        <TrendIcon
          trend={row.total_commission < row.previous_cycle_commission ? ETrend.down : ETrend.up}
          trendNum={`${((row.total_commission - row.previous_cycle_commission) / row.total_commission) * 100}%`}
        />
      ),
    },
    {
      align: 'center',
      colKey: 'total_commission',
      title: 'Commission',
      width: 120,
      cell: ({ row }) => `MYR ${(row.total_commission / 100).toFixed(2)}`,
    },
    {
      align: 'center',
      colKey: 'operation',
      title: 'Details',
      fixed: 'right',
      width: 80,
      cell: ({ row }) => (
        <Button variant='text' theme='primary' onClick={() => console.log(row)}>
          View
        </Button>
      ),
    },
  ];

  useEffect(() => {
    getAffiliateRankingList();
  }, []);

  return (
    <Row gutter={[16, 16]} className={Style.rankListPanel}>
      <Col xs={12} xl={6} span={12}>
        <Card title='Top 5 Affiliates' subtitle={`${new Date(startTime * 1000).toLocaleDateString()} - ${new Date(endTime * 1000).toLocaleDateString()}`} actions={DateRadioGroup} bordered={false}>
          <Table columns={AFFILIATES_COLUMNS} rowKey='affiliateName' size='medium' data={topReferralListState} />
        </Card>
      </Col>
      <Col xs={12} xl={6} span={12}>
        <Card title='Top 5 Commissions' subtitle={`${new Date(startTime * 1000).toLocaleDateString()} - ${new Date(endTime * 1000).toLocaleDateString()}`} actions={DateRadioGroup} bordered={false}>
          <Table columns={COMMISSIONS_COLUMNS} rowKey='affiliateName' size='medium' data={topCommissionListState} />
        </Card>
      </Col>
    </Row>
  );
};

export default React.memo(RankList);
