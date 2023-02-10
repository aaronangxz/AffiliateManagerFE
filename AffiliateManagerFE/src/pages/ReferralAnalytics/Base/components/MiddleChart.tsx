import React, { useState } from 'react';
import {Col, Row, Card, DateRangeValue} from 'tdesign-react';
import ReactEcharts from 'echarts-for-react';
import useDynamicChart from 'hooks/useDynamicChart';
import LastWeekDatePicker from 'components/DatePicker';
import { getLineChartOptions, getPieChartOptions } from '../chart';
import Style from './MiddleChart.module.less';
import dayjs from "dayjs";

export const lineOptions = getLineChartOptions();
export const pieOptions = getPieChartOptions();

export const RECENT_7_DAYS_STRING: Array<string> = [
  dayjs().subtract(7, 'day').format('YYYY-MM-DD').toString(),
  dayjs().subtract(1, 'day').format('YYYY-MM-DD').toString(),
];

export const MiddleChart = () => {
  const [customOptions, setCustomOptions] = useState(lineOptions);
  const [date, setDate] = useState<Array<string>>(RECENT_7_DAYS_STRING);

  const onTimeChange = (value: Array<string>) => {
    const options = getLineChartOptions(value);
    setCustomOptions(options);
    setDate(value);
    console.log('d',date)
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

  return (
    <Row gutter={[16, 16]} className={Style.middleChartPanel}>
      <Col xs={12} xl={9}>
        <Card title='Core Stats' subtitle={`${date[0]} to ${date[1]}`} actions={LastWeekDatePicker(onTimeChange)} bordered={false}>
          <ReactEcharts option={dynamicLineChartOption} notMerge={true} lazyUpdate={true} />
        </Card>
      </Col>
      <Col xs={12} xl={3}>
        <Card title='Ticket Type' bordered={false}>
          <ReactEcharts option={dynamicPieChartOption} notMerge={true} lazyUpdate={true} />
        </Card>
      </Col>
    </Row>
  );
};

export default React.memo(MiddleChart);
