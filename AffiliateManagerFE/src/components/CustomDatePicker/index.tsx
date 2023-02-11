import React, { useEffect, useState } from 'react';
import { Col, DateRangePicker, DateRangeValue, Radio, Row } from 'tdesign-react';
import dayjs from 'dayjs';
import moment from 'moment';
import { DatePicker, DatePickerProps } from 'antd';

const { RangePicker }: any = DatePicker;
export const DEFAULT_DAY = dayjs().subtract(0, 'day');

export enum TimeSelectorPeriod {
  PERIOD_NONE = 0,
  PERIOD_DAY = 1,
  PERIOD_WEEK = 2,
  PERIOD_MONTH = 3,
  PERIOD_RANGE = 4,
  PERIOD_LAST_7_DAYS = 5,
  PERIOD_LAST_28_DAYS = 6,
}

export const CustomDatePicker = ({ slotCallBack, timeCallBack, rangeCallBack, startTime, endTime }: any) => {
  // Date Picker States

  const [timeSlot, setTimeSlot] = useState('5');
  const [daySelected, setDaySelected] = useState<any>(DEFAULT_DAY);
  const [weekSelected, setWeekSelected] = useState<any>(DEFAULT_DAY);
  const [monthSelected, setMonthSelected] = useState<any>(DEFAULT_DAY);
  const [L7DSelected, setL7DSelected] = useState<any>(null);
  const [L28DSelected, setL28DSelected] = useState<any>(null);
  const [activeTimeSlot, setActiveTimeSlot] = useState('5');
  const [dayPickerOpen, setDayPickerOpen] = useState(false);
  const [weekPickerOpen, setWeekPickerOpen] = useState(false);
  const [monthPickerOpen, setMonthPickerOpen] = useState(false);
  const [rangeSelected, setRangeSelected] = useState<any>(null);

  const hideDatePicker = () => {
    setWeekPickerOpen(false);
    setMonthPickerOpen(false);
    setDayPickerOpen(false);
  };

  const rangePickerStatus = (status: any) => {
    if (!status) {
      hideDatePicker();
    }
  };
  const datePickerStatus = (status: any) => {
    if (!status) {
      hideDatePicker();
    }
  };

  const onDayChange: DatePickerProps['onChange'] = (date) => {
    setDaySelected(date);
    setActiveTimeSlot('1');
  };

  const onWeekChange: DatePickerProps['onChange'] = (date) => {
    setWeekSelected(date);
    setActiveTimeSlot('2');
  };

  const onMonthChange: DatePickerProps['onChange'] = (date) => {
    setMonthSelected(date);
    setActiveTimeSlot('3');
  };

  const onL7DChange = () => {
    setL7DSelected(!L7DSelected);
    setActiveTimeSlot('5');
  };

  const onL28DChange = () => {
    setL28DSelected(!L28DSelected);
    setActiveTimeSlot('6');
  };

  const onRangeChange: DatePickerProps['onChange'] = (date: any) => {
    setRangeSelected(date);
    setActiveTimeSlot('4');
    rangeCallBack(date);
  };

  useEffect(() => {
    timeCallBack(daySelected);
  }, [daySelected]);

  useEffect(() => {
    timeCallBack(weekSelected);
  }, [weekSelected]);

  useEffect(() => {
    timeCallBack(monthSelected);
  }, [monthSelected]);

  useEffect(() => {
    slotCallBack(timeSlot);
  }, [timeSlot]);

  return (
    <>
      <Col>
        <Row
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            padding: '10px',
          }}
        >
          <Col
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            {moment.unix(startTime).format('MMM DD, yyyy') === moment.unix(endTime).format('MMM DD, yyyy')
              ? moment.unix(startTime).format('MMM DD, yyyy')
              : `${moment.unix(startTime).format('MMM DD, yyyy')} to ${moment.unix(endTime).format('MMM DD, yyyy')}`}
            <Radio.Group
              size={'small'}
              variant='default-filled'
              onChange={(value: any) => {
                setTimeSlot(value);
                if (value === '5') {
                  onL7DChange();
                }
                if (value === '6') {
                  onL28DChange();
                }
                console.log('slot', value);
              }}
              value={timeSlot}
              style={{
                width: 'auto',
                marginLeft: '10px',
                borderRadius: '10px',
              }}
            >
              <Radio.Button value='5'>Last 7 Days</Radio.Button>
              <Radio.Button value='6'>Last 28 Days</Radio.Button>
              <Radio.Button onClick={() => setDayPickerOpen(true)} value='1'>
                Day
                <DatePicker
                  disabledDate={(current) =>
                    moment().add(1, 'seconds') <= current || current < moment('2023-01-01', 'YYYY-MM-DD')
                  }
                  picker='date'
                  placement={'bottomLeft'}
                  open={dayPickerOpen}
                  style={{ marginLeft: '-50px', visibility: 'hidden', width: '50px' }}
                  onSelect={() => setDayPickerOpen(false)}
                  onOpenChange={datePickerStatus}
                  onChange={onDayChange}
                />
              </Radio.Button>
              <Radio.Button
                onClick={() =>
                  weekPickerOpen && weekSelected === '' ? setWeekPickerOpen(false) : setWeekPickerOpen(true)
                }
                value='2'
              >
                Week
                <DatePicker
                  disabledDate={(current) =>
                    moment().add(0, 'days') <= current || current < moment('2023-01-01', 'YYYY-MM-DD')
                  }
                  picker='week'
                  placement={'bottomLeft'}
                  open={weekPickerOpen}
                  style={{ marginLeft: '-50px', visibility: 'hidden', width: '50px' }}
                  onSelect={() => setWeekPickerOpen(false)}
                  onOpenChange={datePickerStatus}
                  onChange={onWeekChange}
                />
              </Radio.Button>
              <Radio.Button
                value='3'
                onClick={() =>
                  monthPickerOpen && monthSelected === '' ? setMonthPickerOpen(false) : setMonthPickerOpen(true)
                }
              >
                Month
                <DatePicker
                  disabledDate={(current) =>
                    moment().add(0, 'days') <= current || current < moment('2023-01-01', 'YYYY-MM-DD')
                  }
                  picker='month'
                  placement={'bottomLeft'}
                  open={monthPickerOpen}
                  style={{ marginLeft: '-50px', visibility: 'hidden', width: '50px' }}
                  onSelect={() => {
                    setMonthPickerOpen(false);
                  }}
                  onChange={onMonthChange}
                  onOpenChange={datePickerStatus}
                />
              </Radio.Button>
              <Radio.Button value='4'>Custom</Radio.Button>
              <RangePicker
                disabledDate={(current: any) =>
                  moment().add(0, 'days') <= current || current < moment('2023-01-01', 'YYYY-MM-DD')
                }
                value={rangeSelected}
                placement={'bottomLeft'}
                disabled={timeSlot !== '4'}
                style={{ height: 'auto', width: 'auto', marginLeft: '5px' }}
                // open={customPickerOpen}
                onOpenChange={rangePickerStatus}
                onChange={onRangeChange}
              />
            </Radio.Group>
          </Col>
        </Row>
      </Col>
    </>
  );
};
export default CustomDatePicker;
