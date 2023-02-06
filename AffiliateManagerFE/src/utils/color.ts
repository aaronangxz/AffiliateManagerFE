import { Color } from 'tvision-color';
import { defaultColor, darkColor, CHART_COLORS } from 'configs/color';
import { ETheme } from 'types/index.d';

/**
 * 依据主题颜色获取 ColorList
 * @param theme
 * @param themeColor
 */
function getColorFromThemeColor(theme: string, themeColor: string): Array<string> {
  let themeColorList = [];
  const isDarkMode = theme === ETheme.dark;
  const colorLowerCase = themeColor.toLocaleLowerCase();

  if (defaultColor.includes(colorLowerCase)) {
    const colorIdx = defaultColor.indexOf(colorLowerCase);
    const defaultGradients = !isDarkMode ? defaultColor : darkColor;
    const spliceThemeList = defaultGradients.slice(0, colorIdx);
    themeColorList = defaultGradients.slice(colorIdx, defaultGradients.length).concat(spliceThemeList);
  } else {
    themeColorList = Color.getRandomPalette({
      color: themeColor,
      colorGamut: 'bright',
      number: 8,
    });
  }

  return themeColorList;
}

/**
 *
 * @param theme 当前主题
 * @param themeColor 当前主题色
 */
export function getChartColor(theme: ETheme, themeColor: string) {
  const colorList = getColorFromThemeColor(theme, themeColor);
  // 图表颜色
  const chartColors = CHART_COLORS[theme];
  return { ...chartColors, colorList };
}

export function generateColorMap(
  theme: string,
  colorPalette: Array<string>,
  mode: 'light' | 'dark',
  brandColorIdx: number,
) {
  const isDarkMode = mode === 'dark';

  if (isDarkMode) {
    // eslint-disable-next-line no-use-before-define
    colorPalette.reverse().map((color) => {
      const [h, s, l] = Color.colorTransform(color, 'hex', 'hsl');
      return Color.colorTransform([h, Number(s) - 4, l], 'hsl', 'hex');
    });
    // eslint-disable-next-line no-param-reassign
    brandColorIdx = 10 - brandColorIdx;
    colorPalette[0] = `${colorPalette[brandColorIdx]}20`;
  }

  const colorMap = {
    '--td-brand-color': colorPalette[brandColorIdx], // 主题色
    '--td-brand-color-1': colorPalette[0], // light
    '--td-brand-color-2': colorPalette[1], // focus
    '--td-brand-color-3': colorPalette[2], // disabled
    '--td-brand-color-4': colorPalette[3],
    '--td-brand-color-5': colorPalette[4],
    '--td-brand-color-6': colorPalette[5],
    '--td-brand-color-7': brandColorIdx > 0 ? colorPalette[brandColorIdx - 1] : theme, // hover
    '--td-brand-color-8': colorPalette[brandColorIdx], // 主题色
    '--td-brand-color-9': brandColorIdx > 8 ? theme : colorPalette[brandColorIdx + 1], // click
    '--td-brand-color-10': colorPalette[9],
  };
  return colorMap;
}

export function insertThemeStylesheet(theme: string, colorMap: Record<string, string>, mode: 'light' | 'dark') {
  const isDarkMode = mode === 'dark';
  const root = !isDarkMode ? `:root[theme-color='${theme}']` : `:root[theme-color='${theme}'][theme-mode='dark']`;

  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = `${root}{
    --td-brand-color: ${colorMap['--td-brand-color']};
    --td-brand-color-1: ${colorMap['--td-brand-color-1']};
    --td-brand-color-2: ${colorMap['--td-brand-color-2']};
    --td-brand-color-3: ${colorMap['--td-brand-color-3']};
    --td-brand-color-4: ${colorMap['--td-brand-color-4']};
    --td-brand-color-5: ${colorMap['--td-brand-color-5']};
    --td-brand-color-6: ${colorMap['--td-brand-color-6']};
    --td-brand-color-7: ${colorMap['--td-brand-color-7']};
    --td-brand-color-8: ${colorMap['--td-brand-color-8']};
    --td-brand-color-9: ${colorMap['--td-brand-color-9']};
    --td-brand-color-10: ${colorMap['--td-brand-color-10']};
  }`;

  document.head.appendChild(styleSheet);
}
