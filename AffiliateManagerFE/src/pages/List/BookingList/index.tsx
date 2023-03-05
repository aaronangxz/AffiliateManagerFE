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

export const BookingStatusMap: {
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

export const PaymentStatusMap: {
  [key: number]: React.ReactElement;
} = {
  0: (
    <Tag theme='success' variant='light'>
      Paid
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
      Refunded
    </Tag>
  ),
};

const slotMap: {
  [key: number]: string;
} = {
  0: 'Corgi 1',
  1: 'Corgi 2',
  2: 'Dogs 1',
  3: 'Dogs 1',
};

export const selectPage: React.FC = () => {
  const [timeSlot, setTimeSlot] = useState('5');
  const [timeSelected, setTimeSelected] = useState<any>(DEFAULT_DAY);
  const [rangeSelected, setRangeSelected] = useState<any>(null);

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
  const GetBookingList = () => {
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
      });
    }
    fetch(`${envVar.Env}/api/v1/booking/list`, {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    })
      .then((response) => response.json())
      .then((result) => {
        if(result.bookings === undefined){
          setData([]);
        }else{
          setData(result.bookings);
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
    GetBookingList();
  }, [timeSelected, rangeSelected]);

  useEffect(() => {
    if (timeSlot === '5' || timeSlot === '6') {
      GetBookingList();
    }
  }, [timeSlot]);

  const handleSlotCallBack = (pos: string) => {
    console.log('handleSlotCallBack', pos);
    setTimeSlot(pos);
  };
  const handleTimeCallBack = (pos: any) => {
    console.log('handleTimeCallBack', pos);
    setTimeSelected(pos);
  };

  const handleRangeCallBack = (pos: any) => {
    console.log('handleRangeCallBack', pos);
    setRangeSelected(pos);
  };

  return (
    <div>
      <Row>
        <Col span={3}>
          <h1>Bookings</h1>
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
            onSubmit={async (value) => {
              console.log(value);
            }}
            onCancel={() => {}}
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
              colKey: 'booking_id',
              sortType: 'all',
              sorter: (a: any, b: any) => a.booking_id - b.booking_id,
            },
            {
              title: 'Day',
              width: 'auto',
              align: 'center',
              ellipsis: true,
              colKey: 'booking_day',
            },
            {
              title: 'Slot',
              width: 'auto',
              align: 'center',
              ellipsis: true,
              colKey: 'booking_slot',
              cell({ row }) {
                return slotMap[row.booking_slot];
              },
            },
            {
              title: 'Status',
              width: 'auto',
              align: 'center',
              ellipsis: true,
              colKey: 'booking_status',
              cell({ row }) {
                return BookingStatusMap[row.booking_status];
              },
            },
            {
              title: 'Payment',
              width: 'auto',
              align: 'center',
              ellipsis: true,
              colKey: 'payment_status',
              cell({ row }) {
                return PaymentStatusMap[row.payment_status];
              },
            },
            {
              title: 'Citizen',
              width: 'auto',
              align: 'center',
              ellipsis: true,
              colKey: 'citizen_ticket_count',
              sortType: 'all',
              cell({ row }) {
                return row.citizen_ticket_count === 0 ? '0' : row.citizen_ticket_count;
              },
              sorter: (a, b) => a.citizen_ticket_count - b.citizen_ticket_count,
            },
            {
              title: 'Tourist',
              width: 'auto',
              align: 'center',
              ellipsis: true,
              colKey: 'tourist_ticket_count',
              sortType: 'all',
              cell({ row }) {
                return row.tourist_ticket_count === 0 ? '0' : row.tourist_ticket_count;
              },
              sorter: (a, b) => a.tourist_ticket_count - b.tourist_ticket_count,
            },
            {
              title: 'Total',
              width: 'auto',
              align: 'center',
              ellipsis: true,
              colKey: 'ticket_total',
              sortType: 'all',
              cell({ row }) {
                return `MYR ${(row.ticket_total / 100).toFixed(2)}`;
              },
              sorter: (a, b) => a.ticket_total - b.ticket_total,
            },
            {
              title: 'Booking Time',
              width: '200',
              align: 'center',
              ellipsis: true,
              colKey: 'transaction_time',
              sortType: 'all',
              cell({ row }) {
                return row.transaction_time === undefined || row.transaction_time === 0
                  ? '-'
                  : moment.unix(row.transaction_time).format('DD/MM/yyyy, hh:mm:ss');
              },
              sorter: (a, b) => {
                a.transaction_time = a.transaction_time === undefined ? 0 : a.transaction_time;
                b.transaction_time = b.transaction_time === undefined ? 0 : b.transaction_time;
                return a.transaction_time - b.transaction_time;
              },
            },
            {
              align: 'center',
              fixed: 'right',
              width: 'auto',
              colKey: 'op',
              title: 'Details',
              cell(record) {
                return (
                  <>
                    <Button
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
            defaultPageSize: 10,
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
