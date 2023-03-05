import React, { useEffect, useState } from 'react';
import { Col, Radio, Row, Table, Button, Card, MessagePlugin } from 'tdesign-react';
import { TdPrimaryTableProps } from 'tdesign-react/es/table';
import classnames from 'classnames';
import { TrendIcon, ETrend } from 'components/Board';
import { PURCHASE_TREND_LIST, SALE_TREND_LIST } from '../constant';
import Style from './RankList.module.less';
import moment from 'moment/moment';
import { isInfinity } from 'tdesign-react/es/_common/js/input-number/large-number';
import { calculateDiff } from './TopPanel';
import envVar from '../../../../env_var';
import getToken from "../../../../auth_token";

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
  const [affiliateStartTime, setAffiliateStartTime] = useState(0);
  const [affiliateEndTime, setAffiliateEndTime] = useState(0);
  const [commissionStartTime, setCommissionStartTime] = useState(0);
  const [commissionEndTime, setCommissionEndTime] = useState(0);
  const [affiliatePeriod, setAffiliatePeriod] = useState('3');
  const [commissionPeriod, setCommissionPeriod] = useState('3');

  const getAffiliateRankingList = () => {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `Bearer ${getToken()?.tokens.access_token}`);
    fetch(`${envVar.Env}/api/v1/affiliate/ranking/list?period=${affiliatePeriod}`, {
      headers: myHeaders,
      method: 'GET',
      redirect: 'follow',
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.response_meta.error_code !== 0) {
          MessagePlugin.error(result.response_meta.error_msg).then();
          return;
        }

        if (result.affiliate_ranking.top_affiliate_referral_list === undefined) {
          setTopReferralListState([]);
        } else {
          for (let i = 0; i < result.affiliate_ranking.top_affiliate_referral_list.length; i++) {
            refList.push(result.affiliate_ranking.top_affiliate_referral_list[i]);
          }
          setTopReferralListState(refList);
        }

        if (refList.length < 5) {
          const r = 5 - refList.length;
          for (let i = 0; i < r; i++) {
            refList.push({
              affiliate_name: '',
              affiliate_type: '',
              unique_referral_code: '',
              total_referrals: '',
              previous_cycle_referrals: '',
            });
          }
        }

        setAffiliateStartTime(result.affiliate_ranking.start_time);
        setAffiliateEndTime(result.affiliate_ranking.end_time);
      })
      .catch((error) => {
        MessagePlugin.error(error).then();
      });
  };

  const getCommissionRankingList = () => {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `Bearer ${getToken()?.tokens.access_token}`);

    fetch(`${envVar.Env}/api/v1/affiliate/ranking/list?period=${commissionPeriod}`, {
      headers: myHeaders,
      method: 'GET',
      redirect: 'follow',
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.response_meta.error_code !== 0) {
          MessagePlugin.error(result.response_meta.error_msg).then();
          return;
        }

        if (result.affiliate_ranking.top_affiliate_commission_list === undefined) {
          setTopCommissionListState([]);
        } else {
          for (let i = 0; i < result.affiliate_ranking.top_affiliate_commission_list.length; i++) {
            commList.push(result.affiliate_ranking.top_affiliate_commission_list[i]);
          }
          setTopCommissionListState(commList);
        }

        if (commList.length < 5) {
          const r = 5 - commList.length;
          for (let i = 0; i < r; i++) {
            commList.push({
              affiliate_name: '',
              affiliate_type: '',
              unique_referral_code: '',
              total_commission: '',
              previous_cycle_commission: '',
            });
          }
        }
        setCommissionStartTime(result.affiliate_ranking.start_time);
        setCommissionEndTime(result.affiliate_ranking.end_time);
      })
      .catch((error) => {
        MessagePlugin.error(error).then();
      });
  };

  const AffiliateRadioGroup = (
    <Radio.Group
      defaultValue='3'
      onChange={(value: any) => {
        setAffiliatePeriod(value);
      }}
    >
      <Radio.Button value='2'>This Week</Radio.Button>
      <Radio.Button value='3'>This Month</Radio.Button>
    </Radio.Group>
  );

  const CommissionRadioGroup = (
    <Radio.Group
      defaultValue='3'
      onChange={(value: any) => {
        setCommissionPeriod(value);
      }}
    >
      <Radio.Button value='2'>This Week</Radio.Button>
      <Radio.Button value='3'>This Month</Radio.Button>
    </Radio.Group>
  );

  const AFFILIATES_COLUMNS: TdPrimaryTableProps['columns'] = [
    {
      align: 'center',
      colKey: 'index',
      title: 'Rank',
      width: 80,
      fixed: 'left',
      cell: ({ rowIndex }) => (
        <span
          className={classnames(Style.rankIndex, {
            [Style.rankIndexTop]: rowIndex === 0,
            [Style.rankIndexSecond]: rowIndex === 1,
            [Style.rankIndexThird]: rowIndex === 2,
            [Style.rankIndexRest]: rowIndex > 2 && rowIndex < 5,
          })}
        >
          {rowIndex + 1}
        </span>
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
      cell: ({ row }) => affiliateTypeMap[row.affiliate_type],
    },
    {
      align: 'center',
      colKey: 'increase',
      width: 100,
      title: '% Change',
      cell: ({ row }) => (
        <TrendIcon
          trend={
            row.total_referrals === ''
              ? ETrend.undefined
              : isInfinity(calculateDiff(row.total_referrals, row.previous_cycle_referrals))
              ? ETrend.none
              : calculateDiff(row.total_referrals, row.previous_cycle_referrals) < 0
              ? ETrend.down
              : ETrend.up
          }
          trendNum={
            row.total_referrals === ''
              ? ''
              : `${Math.round(
                  ((row.total_referrals - row.previous_cycle_referrals) / row.previous_cycle_referrals) * 100,
                )}%`
          }
        />
      ),
    },
    {
      align: 'center',
      colKey: 'total_referrals',
      title: 'Referrals',
      width: 100,
      cell: ({ row }) => (row.total_referrals === '' ? '' : row.total_referrals),
    },
    {
      align: 'center',
      colKey: 'operation',
      fixed: 'right',
      title: 'Details',
      width: 80,
      cell: ({ row }) =>
        row.user_id === undefined ? null : (
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
        <span
          className={classnames(Style.rankIndex, {
            [Style.rankIndexTop]: rowIndex === 0,
            [Style.rankIndexSecond]: rowIndex === 1,
            [Style.rankIndexThird]: rowIndex === 2,
            [Style.rankIndexRest]: rowIndex > 2 && rowIndex < 5,
          })}
        >
          {rowIndex + 1}
        </span>
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
      cell: ({ row }) => affiliateTypeMap[row.affiliate_type],
    },
    {
      align: 'center',
      colKey: 'increase',
      width: 100,
      title: 'Increase',
      cell: ({ row }) => (
        <TrendIcon
          trend={
            row.total_commission === ''
              ? ETrend.undefined
              : isInfinity(calculateDiff(row.total_commission, row.previous_cycle_commission))
              ? ETrend.none
              : calculateDiff(row.total_commission, row.previous_cycle_commission) < 0
              ? ETrend.down
              : ETrend.up
          }
          trendNum={
            row.total_commission === ''
              ? ''
              : `${Math.round(
                  ((row.total_commission - row.previous_cycle_commission) / row.previous_cycle_commission) * 100,
                )}%`
          }
        />
      ),
    },
    {
      align: 'center',
      colKey: 'total_commission',
      title: 'Commission',
      width: 120,
      cell: ({ row }) => (row.total_commission === '' ? null : `MYR ${(row.total_commission / 100).toFixed(2)}`),
    },
    {
      align: 'center',
      colKey: 'operation',
      title: 'Details',
      fixed: 'right',
      width: 80,
      cell: ({ row }) =>
        row.user_id === undefined ? null : (
          <Button variant='text' theme='primary' onClick={() => console.log(row)}>
            View
          </Button>
        ),
    },
  ];

  useEffect(() => {
    getAffiliateRankingList();
    getCommissionRankingList();
  }, [affiliatePeriod, commissionPeriod]);

  return (
    <Row gutter={[16, 16]} className={Style.rankListPanel}>
      <Col xs={12} xl={6} span={12}>
        <Card
          title='Top 5 Affiliates'
          subtitle={`${moment.unix(affiliateStartTime).format('MMM DD, yyyy')} to ${moment
            .unix(affiliateEndTime)
            .format('MMM DD, yyyy')}`}
          actions={AffiliateRadioGroup}
          bordered={false}
          hoverShadow={true}
          style={{ borderRadius: '15px' }}
        >
          <Table
            style={{ height: '350px' }}
            columns={AFFILIATES_COLUMNS}
            rowKey='affiliateName'
            size='medium'
            data={topReferralListState}
          />
        </Card>
      </Col>
      <Col xs={12} xl={6} span={12}>
        <Card
          title='Top 5 Commissions'
          subtitle={`${moment.unix(commissionStartTime).format('MMM DD, yyyy')} to ${moment
            .unix(commissionEndTime)
            .format('MMM DD, yyyy')}`}
          actions={CommissionRadioGroup}
          bordered={false}
          hoverShadow={true}
          style={{ borderRadius: '15px' }}
        >
          <Table
            style={{ height: '350px' }}
            columns={COMMISSIONS_COLUMNS}
            rowKey='affiliateName'
            size='medium'
            data={topCommissionListState}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default React.memo(RankList);
