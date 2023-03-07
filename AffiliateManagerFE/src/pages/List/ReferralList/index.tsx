import React, { useState, memo, useEffect } from 'react';
import {Table, Dialog, Button, Row, Col, Tag, MessagePlugin} from 'tdesign-react';
import SearchForm from './components/SearchForm';
import './index.module.less';
import classnames from 'classnames';
import CommonStyle from '../../../styles/common.module.less';
import { CustomDatePicker, DEFAULT_DAY, TimeSelectorPeriod } from '../../../components/CustomDatePicker';
import moment from 'moment/moment';
import envVar from '../../../env_var';
import getToken from "../../../auth_token";

export const ReferralStatusMap: {
  [key: number]: React.ReactElement;
} = {
  0: (
    <Tag theme='success' variant='light'>
      Success
    </Tag>
  ),
  1: (
    <Tag theme='warning' variant='light'>
      Pending
    </Tag>
  ),
  2: (
    <Tag theme='danger' variant='light'>
      Failed
    </Tag>
  ),
  3: (
    <Tag theme='default' variant='light'>
      Cancelled
    </Tag>
  ),
};
export const selectPage: React.FC = () => {
  const [timeSlot, setTimeSlot] = useState('5');
  const [timeSelected, setTimeSelected] = useState<any>(DEFAULT_DAY);
  const [rangeSelected, setRangeSelected] = useState<any>(null);
  const [searchString, setSearchString] = useState<any>(null);

  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([0, 1]);
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState([]);

  const [startTime, setStartTime] = useState<any>(moment().weekday(1).format('X'));
  const [endTime, setEndTime] = useState<any>(Math.round(Date.now() / 1000));

  const [loading, setLoading] = useState(false);

  function onSelectChange(value: (string | number)[]) {
    setSelectedRowKeys(value);
  }

  function rehandleClickOp(record: any) {
    console.log(record);
  }

  function handleClose() {
    setVisible(false);
  }

  const [sortInfo, setSortInfo] = useState({ sortBy: 'affiliate_id', descending: true });
  function onSortChange(
    sort: React.SetStateAction<{ sortBy: string | any; descending: boolean | any } | any>,
    options: any,
  ) {
    console.log(sort, options);
    setSortInfo(sort);
    // 默认不存在排序时，也可以在这里设置 data 的值
    // setData(options.currentDataSource);
  }

  // 默认存在排序时，必须在这里给 data 赋值
  function onDataChange(newData: any) {
    setData(newData);
  }
  const GetAffiliateList = () => {
    setLoading(true);
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `Bearer ${getToken()?.tokens.access_token}`);

    let raw = '';
    if (timeSlot === '4') {
      raw = JSON.stringify({
        time_selector: {
          period: TimeSelectorPeriod.PERIOD_RANGE,
          start_ts: Date.parse(rangeSelected[0]) / 1000,
          end_ts: Date.parse(rangeSelected[1]) / 1000,
        },
        affiliate_name: searchString,
      });
    } else {
      let p;
      let ts;
      switch (timeSlot) {
        case '1':
          p = TimeSelectorPeriod.PERIOD_DAY;
          ts = Date.parse(timeSelected) / 1000;
          break;
        case '2':
          p = TimeSelectorPeriod.PERIOD_WEEK;
          ts = Date.parse(timeSelected) / 1000;
          break;
        case '3':
          p = TimeSelectorPeriod.PERIOD_MONTH;
          ts = Date.parse(timeSelected) / 1000;
          break;
        case '5':
          p = TimeSelectorPeriod.PERIOD_LAST_7_DAYS;
          ts = Math.round(Date.now() / 1000);
          break;
        case '6':
          p = TimeSelectorPeriod.PERIOD_LAST_28_DAYS;
          ts = Math.round(Date.now() / 1000);
          break;
        default:
          p = TimeSelectorPeriod.PERIOD_NONE;
      }
      raw = JSON.stringify({
        time_selector: {
          base_ts: ts,
          period: p,
        },
        affiliate_name: searchString,
      });
    }
    fetch(`${envVar.Env}/api/v1/referral/list`, {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.referral_list === undefined) {
          setData([]);
        } else {
          setData(result.referral_list);
        }
        setStartTime(result.start_time);
        setEndTime(result.end_time);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        MessagePlugin.error(error);
      });
  };

  useEffect(() => {
    if (searchString === null) {
      return;
    }
    GetAffiliateList();
  }, [timeSelected, rangeSelected, searchString]);

  useEffect(() => {
    if (timeSlot === '5' || timeSlot === '6') {
      GetAffiliateList();
    }
  }, [timeSlot]);

  const handleSlotCallBack = (pos: string) => {
    setTimeSlot(pos);
  };
  const handleTimeCallBack = (pos: any) => {
    setTimeSelected(pos);
  };

  const handleRangeCallBack = (pos: any) => {
    setRangeSelected(pos);
  };

  const handleStringCallBack: any = (pos: any) => {
    setSearchString(pos);
  };

  return (
    <div>
      <Row>
        <Col span={3}>
          <h1>Referrals</h1>
        </Col>
        <Col span={9}>
          <CustomDatePicker
            slotCallBack={handleSlotCallBack}
            timeCallBack={handleTimeCallBack}
            rangeCallBack={handleRangeCallBack}
            startTime={startTime}
            endTime={endTime}
          />
        </Col>
      </Row>
      <div className={classnames(CommonStyle.pageWithPadding, CommonStyle.pageWithColor)}>
        <Row justify='start' style={{ marginBottom: '20px' }}>
          <SearchForm
            // onSubmit={async (value: any) => {
            //   console.log(value);
            // }}
            // onCancel={() => {}}
            handleStringCallBack={handleStringCallBack}
          />
        </Row>
        <Table
          // sort={sortInfo}
          multipleSort={false}
          onSortChange={onSortChange}
          onDataChange={onDataChange}
          loading={loading}
          data={data}
          columns={[
            {
              title: 'ID',
              width: '70',
              fixed: 'left',
              align: 'left',
              ellipsis: true,
              colKey: 'referral_id',
              sortType: 'all',
              sorter: (a: any, b: any) => a.referral_id - b.referral_id,
            },
            {
              title: 'Affiliate',
              width: '150',
              fixed: 'left',
              align: 'left',
              ellipsis: true,
              colKey: 'affiliate_name',
              sortType: 'all',
            },
            {
              title: 'Status',
              width: '100',
              fixed: 'left',
              align: 'center',
              ellipsis: true,
              colKey: 'referral_status',
              sortType: 'all',
              cell({ row }) {
                return ReferralStatusMap[row.referral_status];
              },
            },
            {
              title: 'Click Time',
              width: '200',
              align: 'center',
              fixed: 'left',
              ellipsis: true,
              colKey: 'referral_click_time',
              sortType: 'all',
              cell({ row }) {
                return row.referral_click_time === undefined || row.referral_click_time === 0
                  ? '-'
                  : moment.unix(row.referral_click_time).format('DD/MM/yyyy, hh:mm:ss');
              },
              sorter: (a: any, b: any) => a.referral_click_time - b.referral_click_time,
            },
            {
              title: 'Booking',
              width: '100',
              align: 'center',
              ellipsis: true,
              colKey: 'booking_ref_id',
              sortType: 'all',
              cell({ row }) {
                return row.booking_ref_id === undefined || row.booking_ref_id === 0 ? '-' : row.booking_ref_id;
              },
              sorter: (a, b) => {
                a.booking_ref_id = a.booking_ref_id === undefined ? 0 : a.booking_ref_id;
                b.booking_ref_id = b.booking_ref_id === undefined ? 0 : b.booking_ref_id;
                return a.booking_ref_id - b.booking_ref_id;
              },
            },
            {
              title: 'Commission',
              width: '150',
              align: 'center',
              ellipsis: true,
              colKey: 'referral_commission',
              sortType: 'all',
              cell({ row }) {
                return row.referral_commission === undefined || row.referral_commission === 0
                  ? '-'
                  : `MYR ${(row.referral_commission / 100).toFixed(2)}`;
              },
              sorter: (a, b) => {
                a.referral_commission = a.referral_commission === undefined ? 0 : a.referral_commission;
                b.referral_commission = b.referral_commission === undefined ? 0 : b.referral_commission;
                return a.referral_commission - b.referral_commission;
              },
            },
            {
              title: 'Amount',
              width: '150',
              align: 'center',
              ellipsis: true,
              colKey: 'total_ticket_amount',
              sortType: 'all',
              cell({ row }) {
                return row.total_ticket_amount === undefined || row.total_ticket_amount === 0
                  ? '-'
                  : `MYR ${(row.total_ticket_amount / 100).toFixed(2)}`;
              },
              sorter: (a, b) => {
                a.total_ticket_amount = a.total_ticket_amount === undefined ? 0 : a.total_ticket_amount;
                b.total_ticket_amount = b.total_ticket_amount === undefined ? 0 : b.total_ticket_amount;
                return a.total_ticket_amount - b.total_ticket_amount;
              },
            },
            {
              title: 'Tickets',
              width: '100',
              align: 'center',
              ellipsis: true,
              colKey: 'total_ticket_count',
              sortType: 'all',
              cell({ row }) {
                return row.total_ticket_count === undefined || row.total_ticket_count === 0
                  ? '-'
                  : row.total_ticket_count;
              },
              sorter: (a, b) => {
                a.total_ticket_count = a.total_ticket_count === undefined ? 0 : a.total_ticket_count;
                b.total_ticket_count = b.total_ticket_count === undefined ? 0 : b.total_ticket_count;
                return a.total_ticket_count - b.total_ticket_count;
              },
            },
            {
              title: 'Booking Time',
              width: '200',
              align: 'center',
              ellipsis: true,
              colKey: 'booking_time',
              sortType: 'all',
              cell({ row }) {
                return row.booking_time === undefined || row.booking_time === 0
                  ? '-'
                  : moment.unix(row.booking_time).format('DD/MM/yyyy, hh:mm:ss');
              },
              sorter: (a, b) => {
                a.booking_time = a.booking_time === undefined ? 0 : a.booking_time;
                b.booking_time = b.booking_time === undefined ? 0 : b.booking_time;
                return a.booking_time - b.booking_time;
              },
            },
            {
              align: 'center',
              fixed: 'right',
              width: '100',
              colKey: 'op',
              title: 'Details',
              cell(record) {
                return (
                  <>
                    <Button
                      disabled={true}
                      theme='primary'
                      variant='text'
                      onClick={() => {
                        rehandleClickOp(record);
                      }}
                    >
                      View
                    </Button>
                  </>
                );
              },
            },
          ]}
          rowKey='index'
          selectedRowKeys={selectedRowKeys}
          hover
          onSelectChange={onSelectChange}
          pagination={{
            total: data.length,
            defaultCurrent: 1,
            defaultPageSize: 20,
            showJumper: true,
            onCurrentChange(current, pageInfo) {},
            onPageSizeChange(size) {},
          }}
        />
        <Dialog header='确认删除当前所选合同？' visible={visible} onClose={handleClose}>
          <p>删除后的所有合同信息将被清空,且无法恢复</p>
        </Dialog>
      </div>
    </div>
  );
};

export default memo(selectPage);
