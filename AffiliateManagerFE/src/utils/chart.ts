// 获取 chart 的 mock 数据
import dayjs, { Dayjs } from 'dayjs';

const RECENT_7_DAYS: [Dayjs, Dayjs] = [dayjs().subtract(7, 'day'), dayjs().subtract(1, 'day')];
export const ONE_WEEK_LIST = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

export const getRandomInt = (num = 100): number => {
  const resultNum = Number((Math.random() * num).toFixed(0));
  return resultNum <= 1 ? 1 : resultNum;
};

type ChartValue = number | string;

export function getTimeArray(
  dateTime: string[] = [],
  divideNum = dateTime.length === 0 ? 6 : Math.floor((Date.parse(dateTime[1]) - Date.parse(dateTime[0])) / 86400000),
  format = 'MM-DD',
): string[] {
  const timeArray = [];
  if (dateTime.length === 0) {
    dateTime.push(...RECENT_7_DAYS.map((item) => item.format(format)));
  }

  if (dateTime[0] === dateTime[1]) {
    const timeNode: number = new Date(dateTime[0]).getTime();
    timeArray.push(dayjs(timeNode).format(format));
    return timeArray;
  }

  for (let i = 0; i <= divideNum; i++) {
    const dateAbsTime: number = (new Date(dateTime[1]).getTime() - new Date(dateTime[0]).getTime()) / divideNum;
    const timeNode: number = new Date(dateTime[0]).getTime() + dateAbsTime * i;
    timeArray.push(dayjs(timeNode).format(format));
  }

  return timeArray;
}

// TODO Call Trend API here
export const getChartDataSet = (
  dateTime: Array<string> = [],
  divideNum = dateTime.length === 0 ? 6 : Math.floor((Date.parse(dateTime[1]) - Date.parse(dateTime[0])) / 86400000),
): ChartValue[][] => {
  const timeArray = getTimeArray(dateTime, divideNum);
  const revenueArray = [];
  const commissionArray = [];
  const bookingsArray = [];

  for (let index = 0; index <= divideNum; index++) {
    revenueArray.push(getRandomInt().toString());
    commissionArray.push(getRandomInt().toString());
    bookingsArray.push(getRandomInt().toString());
  }

  return [timeArray, revenueArray, commissionArray, bookingsArray];
};
