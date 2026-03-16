import KoreanLunarCalendar from 'korean-lunar-calendar';

/**
 * 음력 날짜를 양력 날짜로 변환
 */
export function lunarToSolar(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const calendar = new KoreanLunarCalendar();
  calendar.setLunarDate(year, month, day, false);
  const solar = calendar.getSolarCalendar();
  return `${solar.year}-${String(solar.month).padStart(2, '0')}-${String(solar.day).padStart(2, '0')}`;
}

/**
 * 양력 날짜를 음력 날짜로 변환
 */
export function solarToLunar(dateStr: string): { year: number; month: number; day: number } {
  const [year, month, day] = dateStr.split('-').map(Number);
  const calendar = new KoreanLunarCalendar();
  calendar.setSolarDate(year, month, day);
  const lunar = calendar.getLunarCalendar();
  return { year: lunar.year, month: lunar.month, day: lunar.day };
}
