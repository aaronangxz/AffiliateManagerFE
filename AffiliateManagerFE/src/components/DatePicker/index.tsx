import React, { useState } from 'react';
import { DateRangePicker, DateRangeValue } from 'tdesign-react';
import dayjs from 'dayjs';
import moment from 'moment';

const RECENT_7_DAYS: DateRangeValue = [
  dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
  dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
];

export const LastWeekDatePicker = (onChange: (value: DateRangeValue) => void) => {
  const [dateSelected, setDateSelected] = useState<any>(null);
  return (
    <DateRangePicker
      mode='date'
      placeholder={['开始时间', '结束时间']}
      value={dateSelected === null ? RECENT_7_DAYS : dateSelected}
      format='YYYY-MM-DD'
      onChange={(value) => {
        onChange(value);
        setDateSelected(value);
      }}
      /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
      // @ts-ignore
      disableDate={(current) => moment().add(-1, 'days') <= current}
    />
  );
};

export default LastWeekDatePicker;
