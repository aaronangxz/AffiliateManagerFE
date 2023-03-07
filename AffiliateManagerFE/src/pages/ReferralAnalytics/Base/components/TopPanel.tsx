import React, { useEffect, useState } from 'react';
import { Card, Col, MessagePlugin, Radio, Row } from 'tdesign-react';
import { CalendarIcon, DiscountFilledIcon, UsergroupIcon, WalletIcon } from 'tdesign-icons-react';
import Board, { ETrend, IBoardProps } from 'components/Board';
import Style from './TopPanel.module.less';
import { DatePicker, DatePickerProps } from 'antd';
import moment from 'moment';
import dayjs, { Dayjs } from 'dayjs';
import ReactEcharts from 'echarts-for-react';
import useDynamicChart from '../../../../hooks/useDynamicChart';
import { RECENT_7_DAYS_STRING } from './MiddleChart';
import * as echarts from 'echarts';
import { EChartOption } from 'echarts';
import { isInfinity } from 'tdesign-react/es/_common/js/input-number/large-number';
import { RecentList } from './RecentList';
import {TimeSelectorPeriod} from "../../../../components/CustomDatePicker";
import envVar from '../../../../env_var';
import getToken from "../../../../auth_token";

const { RangePicker } = DatePicker;
const DEFAULT_ID = 6;

moment.locale('en-gb');

export const calculateDiff = (curr: number | null, prev: number | null) => {
  const newStats = (curr == null ? 0 : curr) / 100;
  const oldStats = (prev == null ? 0 : prev) / 100;
  if (newStats === 0 && oldStats === 0) {
    return 0;
  }
  return ((newStats - oldStats) / oldStats) * 100;
};

export const TopPanel = () => {
  let coreStats = null;
  let coreStatsPrev = null;
  const DEFAULT_DAY = dayjs().subtract(0, 'day');

  const [coreStatsState, setCoreStatsState] = useState<any>({
    citizen_ticket_total: 0,
    tourist_ticket_total: 0,
    total_commission: 0,
    total_active_affiliates: 0,
    total_affiliate_bookings: 0,
  });

  const [coreStatsPrevState, setCoreStatsPrevState] = useState<any>({
    citizen_ticket_total: 0,
    tourist_ticket_total: 0,
    total_commission: 0,
    total_active_affiliates: 0,
    total_affiliate_bookings: 0,
  });

  const [subText, setSubText] = useState('vs Previous Week');
  const [cardLoading, setCardLoading] = useState(false);
  const [startTime, setStartTime] = useState<any>(moment().weekday(1).format('X'));
  const [endTime, setEndTime] = useState<any>(Math.round(Date.now() / 1000));

  const [dayPickerOpen, setDayPickerOpen] = useState(false);
  const [weekPickerOpen, setWeekPickerOpen] = useState(false);
  const [monthPickerOpen, setMonthPickerOpen] = useState(false);

  const [timeSlot, setTimeSlot] = useState('5');
  const [activeTimeSlot, setActiveTimeSlot] = useState('5');
  const [rangeSelected, setRangeSelected] = useState<any>(null);
  const [rangeCount, setRangeCount] = useState<any>(0);

  const [daySelected, setDaySelected] = useState<any>(DEFAULT_DAY);
  const [weekSelected, setWeekSelected] = useState<any>(DEFAULT_DAY);
  const [monthSelected, setMonthSelected] = useState<any>(DEFAULT_DAY);
  const [L7DSelected, setL7DSelected] = useState<any>(null);
  const [L28DSelected, setL28DSelected] = useState<any>(null);

  const [pieOptions, setPieOptions] = useState<EChartOption>({});

  const PANE_LIST: Array<IBoardProps> = [
    {
      title: 'Total Affiliate Revenue',
      subtitle: 'The grand total of all ticket sales made through referrals in the selected time period.',
      count: `${((coreStatsState.citizen_ticket_total + coreStatsState.tourist_ticket_total) / 100).toFixed(2)}`,
      trend:
        // eslint-disable-next-line no-nested-ternary
        isInfinity(
          calculateDiff(
            coreStatsState.citizen_ticket_total + coreStatsState.tourist_ticket_total,
            coreStatsPrevState.citizen_ticket_total + coreStatsPrevState.tourist_ticket_total,
          ),
        ) ||
        Number.isNaN(
          calculateDiff(
            coreStatsState.citizen_ticket_total + coreStatsState.tourist_ticket_total,
            coreStatsPrevState.citizen_ticket_total + coreStatsPrevState.tourist_ticket_total,
          ),
        ) ||
        calculateDiff(
          coreStatsState.citizen_ticket_total + coreStatsState.tourist_ticket_total,
          coreStatsPrevState.citizen_ticket_total + coreStatsPrevState.tourist_ticket_total,
        ) === 0
          ? ETrend.none
          : calculateDiff(
              coreStatsState.citizen_ticket_total + coreStatsState.tourist_ticket_total,
              coreStatsPrevState.citizen_ticket_total + coreStatsPrevState.tourist_ticket_total,
            ) < 0
          ? ETrend.down
          : ETrend.up,
      trendNum:
        isInfinity(
          calculateDiff(
            coreStatsState.citizen_ticket_total + coreStatsState.tourist_ticket_total,
            coreStatsPrevState.citizen_ticket_total + coreStatsPrevState.tourist_ticket_total,
          ),
        ) ||
        Number.isNaN(
          calculateDiff(
            coreStatsState.citizen_ticket_total + coreStatsState.tourist_ticket_total,
            coreStatsPrevState.citizen_ticket_total + coreStatsPrevState.tourist_ticket_total,
          ),
        ) ||
        calculateDiff(
          coreStatsState.citizen_ticket_total + coreStatsState.tourist_ticket_total,
          coreStatsPrevState.citizen_ticket_total + coreStatsPrevState.tourist_ticket_total,
        ) === 0
          ? '(No Data)'
          : `${calculateDiff(
              coreStatsState.citizen_ticket_total + coreStatsState.tourist_ticket_total,
              coreStatsPrevState.citizen_ticket_total + coreStatsPrevState.tourist_ticket_total,
            ).toFixed(2)}%`,
      Icon: (
        <div className={Style.iconWrap}>
          <DiscountFilledIcon className={Style.svgIcon} />
        </div>
      ),
    },
    {
      title: 'Total Commission',
      subtitle: 'The grand total of commission earned in the selected time period.',
      count: `${(coreStatsState.total_commission / 100).toFixed(2)}`,
      trend:
        // eslint-disable-next-line no-nested-ternary
        isInfinity(calculateDiff(coreStatsState.total_commission, coreStatsPrevState.total_commission)) ||
        Number.isNaN(calculateDiff(coreStatsState.total_commission, coreStatsPrevState.total_commission)) ||
        calculateDiff(coreStatsState.total_commission, coreStatsPrevState.total_commission) === 0
          ? ETrend.none
          : calculateDiff(coreStatsState.total_commission, coreStatsPrevState.total_commission) < 0
          ? ETrend.down
          : ETrend.up,
      trendNum:
        isInfinity(calculateDiff(coreStatsState.total_commission, coreStatsPrevState.total_commission)) ||
        Number.isNaN(calculateDiff(coreStatsState.total_commission, coreStatsPrevState.total_commission)) ||
        calculateDiff(coreStatsState.total_commission, coreStatsPrevState.total_commission) === 0
          ? '(No Data)'
          : `${calculateDiff(coreStatsState.total_commission, coreStatsPrevState.total_commission).toFixed(2)}%`,
      Icon: (
        <div className={Style.iconWrap}>
          <WalletIcon className={Style.svgIcon} />
        </div>
      ),
    },
    {
      title: 'Total Clicks',
      subtitle: 'The total number of clicks (including unsuccessful referrals) in the selected time period.',
      count: `${coreStatsState.total_clicks}`,
      trend:
        // eslint-disable-next-line no-nested-ternary
        isInfinity(calculateDiff(coreStatsState.total_clicks, coreStatsPrevState.total_clicks)) ||
        Number.isNaN(calculateDiff(coreStatsState.total_clicks, coreStatsPrevState.total_clicks)) ||
        calculateDiff(coreStatsState.total_clicks, coreStatsPrevState.total_clicks) === 0
          ? ETrend.none
          : calculateDiff(coreStatsState.total_clicks, coreStatsPrevState.total_clicks) < 0
          ? ETrend.down
          : ETrend.up,
      trendNum:
        isInfinity(calculateDiff(coreStatsState.total_clicks, coreStatsPrevState.total_clicks)) ||
        Number.isNaN(calculateDiff(coreStatsState.total_clicks, coreStatsPrevState.total_clicks)) ||
        calculateDiff(coreStatsState.total_clicks, coreStatsPrevState.total_clicks) === 0
          ? '(No Data)'
          : `${calculateDiff(coreStatsState.total_clicks, coreStatsPrevState.total_clicks).toFixed(2)}%`,
      Icon: (
        <div className={Style.iconWrap}>
          <UsergroupIcon className={Style.svgIcon} />
        </div>
      ),
    },
    {
      title: 'Total Bookings',
      subtitle: 'The total number of bookings referred in the selected time period.',
      count: `${coreStatsState.total_bookings} Bookings`,
      trend:
        // eslint-disable-next-line no-nested-ternary
        isInfinity(calculateDiff(coreStatsState.total_bookings, coreStatsPrevState.total_bookings)) ||
        Number.isNaN(calculateDiff(coreStatsState.total_bookings, coreStatsPrevState.total_bookings)) ||
        calculateDiff(coreStatsState.total_bookings, coreStatsPrevState.total_bookings) === 0
          ? ETrend.none
          : calculateDiff(coreStatsState.total_bookings, coreStatsPrevState.total_bookings) < 0
          ? ETrend.down
          : ETrend.up,
      trendNum:
        isInfinity(calculateDiff(coreStatsState.total_bookings, coreStatsPrevState.total_bookings)) ||
        Number.isNaN(calculateDiff(coreStatsState.total_bookings, coreStatsPrevState.total_bookings)) ||
        calculateDiff(coreStatsState.total_bookings, coreStatsPrevState.total_bookings) === 0
          ? '(No Data)'
          : `${calculateDiff(coreStatsState.total_bookings, coreStatsPrevState.total_bookings).toFixed(2)}%`,
      Icon: (
        <div className={Style.iconWrap}>
          <CalendarIcon className={Style.svgIcon} />
        </div>
      ),
    },
  ];

  const hideDatePicker = () => {
    setWeekPickerOpen(false);
    setMonthPickerOpen(false);
    setDayPickerOpen(false);
  };

  const getReferralCoreStats = async () => {
    setCardLoading(true);
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
      setSubText('');
    } else {
      let p;
      let ts;
      switch (timeSlot) {
        case '1':
          p = TimeSelectorPeriod.PERIOD_DAY;
          ts = Date.parse(daySelected) / 1000;
          setSubText('vs Previous Day');
          break;
        case '2':
          p = TimeSelectorPeriod.PERIOD_WEEK;
          ts = Date.parse(weekSelected) / 1000;
          setSubText('vs Previous Week');
          break;
        case '3':
          p = TimeSelectorPeriod.PERIOD_MONTH;
          ts = Date.parse(monthSelected) / 1000;
          setSubText('vs Previous Month');
          break;
        case '5':
          p = TimeSelectorPeriod.PERIOD_LAST_7_DAYS;
          ts = Math.round(Date.now() / 1000);
          setSubText('vs Last 7 Days');
          break;
        case '6':
          p = TimeSelectorPeriod.PERIOD_LAST_28_DAYS;
          ts = Math.round(Date.now() / 1000);
          setSubText('vs Last 28 Days');
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

    fetch(`${envVar.Env}/api/v1/referral/stats`, {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.response_meta.error_code !== 0) {
          MessagePlugin.error(result.response_meta.error_msg);
          return;
        }
        coreStats = result.referral_stats.core_stats;
        coreStatsPrev = result.referral_stats_previous_cycle.core_stats;
        setCoreStatsState(coreStats);
        setCoreStatsPrevState(coreStatsPrev);
        setStartTime(result.referral_stats.start_time);
        setEndTime(result.referral_stats.end_time);
        setCardLoading(false);

        setPieOptions({
          tooltip: {
            trigger: 'item',
          },
          grid: {
            top: '0',
            right: '0',
          },
          legend: {
            itemWidth: 12,
            itemHeight: 4,
            textStyle: {
              fontSize: 12,
            },
            left: 'center',
            bottom: '0',
            orient: 'horizontal', // legend 横向布局。
          },
          series: [
            {
              name: 'Sales',
              type: 'pie',
              radius: ['48%', '60%'],
              avoidLabelOverlap: true,
              silent: false,
              itemStyle: {
                borderWidth: 1,
              },
              label: {
                show: true,
                position: 'center',
                formatter: ['{value|{d}%}', '{name|from {b} Ticket}'].join('\n'),
                rich: {
                  value: {
                    fontSize: 28,
                    fontWeight: 'normal',
                    lineHeight: 46,
                  },
                  name: {
                    color: '#909399',
                    fontSize: 12,
                    lineHeight: 14,
                  },
                },
              },
              labelLine: {
                show: false,
              },
              data: [
                { value: result.referral_stats.core_stats.citizen_ticket_total / 100, name: 'Citizen' },
                { value: result.referral_stats.core_stats.tourist_ticket_total / 100, name: 'Tourist' },
              ],
            },
          ],
        });
      })
      .catch((error) => {
        MessagePlugin.error(error).then();
        setCardLoading(false);
      });
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

  const revenue: any[] = [];
  const dateString: any[] = [];
  const commission: any[] = [];
  const bookings: any[] = [];
  const clicks: any[] = [];

  const [customOptions, setCustomOptions] = useState<EChartOption>({});

  const getReferralTrend = async () => {
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
          ts = Date.parse(daySelected) / 1000;
          break;
        case '2':
          p = TimeSelectorPeriod.PERIOD_WEEK;
          ts = Date.parse(weekSelected) / 1000;
          break;
        case '3':
          p = TimeSelectorPeriod.PERIOD_MONTH;
          ts = Date.parse(monthSelected) / 1000;
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

    fetch(`${envVar.Env}/api/v1/referral/trend`, {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.response_meta.error_code !== 0) {
          MessagePlugin.error(result.response_meta.error_msg);
          return;
        }
        for (let i = 0; i < result.times_stats.length; i++) {
          revenue.push(
            ((result.times_stats[i].citizen_ticket_total + result.times_stats[i].tourist_ticket_total) / 100).toFixed(
              2,
            ),
          );
          dateString.push(result.times_stats[i].date_string);
          commission.push(result.times_stats[i].total_commission / 100);
          bookings.push(result.times_stats[i].total_bookings);
          clicks.push(result.times_stats[i].total_clicks);
        }

        let chartType = 'line';
        if (timeSlot === '1' || result.times_stats.length === 1) {
          chartType = 'bar';
        }

        setCustomOptions({
          tooltip: {
            borderWidth: 0,
            trigger: 'axis',
            backgroundColor: 'rgba(50,50,50,0.7)',
            extraCssText: 'border-radius:10px; box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);',
            textStyle: {
              color: '#ffffff',
            },
          },
          grid: {
            left: '0',
            right: '20px',
            top: '5px',
            bottom: '36px',
            containLabel: true,
          },
          legend: {
            left: 'center',
            bottom: '0',
            orient: 'horizontal', // legend 横向布局。
            data: ['Revenue (MYR)', 'Commission (MYR)', 'Clicks', 'Bookings'],
            textStyle: {
              fontSize: 12,
            },
          },
          xAxis: {
            type: 'category',
            data: dateString.length === 0 ? RECENT_7_DAYS_STRING : dateString,
            boundaryGap: false,
            axisLine: {
              lineStyle: {
                color: '#E3E6EB',
                width: 1,
              },
            },
          },
          yAxis: [
            {
              type: 'value',
              position: 'left',
            },
            {
              type: 'value',
              position: 'right',
            },
          ],
          series: [
            {
              name: 'Revenue (MYR)',
              data: revenue,
              type: chartType,
              barMaxWidth: '5%',
              smooth: true,
              showSymbol: true,
              symbol: 'circle',
              symbolSize: 0,
              itemStyle: {
                borderWidth: 1,
                opacity: 0.8,
                barBorderRadius: 5,
              },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgba(12,108,255,0.3)',
                  },
                  {
                    offset: 1,
                    color: 'rgba(244,253,255,0.18)',
                  },
                ]),
              },
            },
            {
              name: 'Commission (MYR)',
              data: commission,
              type: chartType,
              barMaxWidth: '5%',
              smooth: true,
              showSymbol: true,
              symbol: 'circle',
              symbolSize: 0,
              itemStyle: {
                borderWidth: 1,
                opacity: 0.8,
                barBorderRadius: 5,
              },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgba(115,201,255,0.3)',
                  },
                  {
                    offset: 1,
                    color: 'rgba(244,253,255,0.18)',
                  },
                ]),
              },
            },
            {
              name: 'Clicks',
              data: clicks,
              type: chartType,
              barMaxWidth: '5%',
              smooth: true,
              showSymbol: true,
              symbol: 'circle',
              symbolSize: 0,
              itemStyle: {
                borderWidth: 1,
                opacity: 0.8,
                barBorderRadius: 5,
              },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgba(128,255,165,0.3)',
                  },
                  {
                    offset: 1,
                    color: 'rgba(244,253,255,0.18)',
                  },
                ]),
              },
              yAxisIndex: 1,
            },
            {
              name: 'Bookings',
              data: bookings,
              type: chartType,
              barMaxWidth: '5%',
              smooth: true,
              showSymbol: true,
              symbol: 'circle',
              symbolSize: 0,
              itemStyle: {
                borderWidth: 1,
                opacity: 0.8,
                barBorderRadius: 5,
              },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgba(255,232,124,0.3)',
                  },
                  {
                    offset: 1,
                    color: 'rgba(244,253,255,0.18)',
                  },
                ]),
              },
              yAxisIndex: 1,
            },
          ],
        });
      })
      .catch((error) => {
        MessagePlugin.error(error);
      });
  };

  const dynamicLineChartOption = useDynamicChart(customOptions, {
    placeholderColor: ['legend.textStyle.color', 'xAxis.axisLabel.color', 'yAxis.axisLabel.color'],
    borderColor: ['series.0.itemStyle.borderColor', 'series.1.itemStyle.borderColor'],
  });

  const dynamicPieChartOption = useDynamicChart(pieOptions, {
    placeholderColor: ['legend.textStyle.color'],
    containerColor: ['series.0.itemStyle.borderColor'],
    textColor: ['label.color', 'label.color'],
  });

  useEffect(() => {
    setRangeCount(0);
    getReferralCoreStats().then();
    getReferralTrend().then();
  }, [daySelected, weekSelected, monthSelected, rangeSelected, L7DSelected, L28DSelected]);

  const onRangeChange: DatePickerProps['onChange'] = (date: any | Dayjs | null, datestring: string | any) => {
    setRangeSelected(date);
    setActiveTimeSlot('4');
  };

  return (
    <div>
      <Row
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Col xl={3}>
          <Row>
            <Col>
              <h1>Referral Analytics</h1>
            </Col>
            <Col></Col>
          </Row>
        </Col>
        <Col xl={9}>
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
              {moment.unix(startTime).format('MMM DD, yyyy')} to {moment.unix(endTime).format('MMM DD, yyyy')}
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
                  disabledDate={(current) =>
                    moment().add(0, 'days') <= current || current < moment('2023-01-01', 'YYYY-MM-DD')
                  }
                  value={rangeSelected}
                  placement={'bottomLeft'}
                  disabled={timeSlot !== '4'}
                  style={{ height: 'auto', width: 'auto', marginLeft: '5px' }}
                  onOpenChange={rangePickerStatus}
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  onChange={onRangeChange}
                />
              </Radio.Group>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        {PANE_LIST.map((item) => (
          <Col key={item.title} xs={6} xl={3}>
            <Board
              title={item.title}
              subtitle={item.subtitle}
              trend={activeTimeSlot === '4' ? undefined : item.trend}
              trendNum={item.trendNum}
              count={item.count}
              desc={activeTimeSlot === '4' ? '' : `${subText}`}
            />
          </Col>
        ))}
      </Row>
      <Row gutter={[16, 16]} className={Style.middleChartPanel} style={{ paddingTop: '15px' }}>
        <Col xs={12} xl={9}>
          <Card
            title='Trend'
            subtitle='Click on the legends to select metrics'
            bordered={false}
            hoverShadow={true}
            style={{ borderRadius: '15px' }}
          >
            <ReactEcharts option={dynamicLineChartOption} notMerge={true} lazyUpdate={false} />
          </Card>
        </Col>
        <Col xs={12} xl={3}>
          <Card title='Ticket Sales Type' bordered={false} hoverShadow={true} style={{ borderRadius: '15px' }}>
            <ReactEcharts option={dynamicPieChartOption} notMerge={true} lazyUpdate={true} />
          </Card>
        </Col>
      </Row>
      <Row style={{ paddingBottom: '5px' }}>
        <RecentList />
      </Row>
    </div>
  );
};

export default React.memo(TopPanel);
