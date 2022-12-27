/**
 * format time
 * @param time ms
 * @returns HH:MM:SS
 */
export function formatTimeHMS(time: number): string {
  time /= 1000;
  const h = Math.floor(time / 3600);
  time -= h * 3600;
  const m = Math.floor(time / 60);
  time -= m * 60;
  const s = Math.floor(time);

  let res = '';
  res += h < 10 ? `0${h}` : h;
  res += ':';
  res += m < 10 ? `0${m}` : m;
  res += ':';
  res += s < 10 ? `0${s}` : s;
  return res;
}
