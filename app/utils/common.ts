/**
 * whether in electron or in browser
 */
export const IS_ELECTRON = window !== window.top;

/**
 * convert memberId to roomId
 * @param {string} memberId r@${uuid}@${uuid}
 * @return roomId: r@${uuid}
 */
export function memberIdToRoomId(memberId: string): string {
  let lastAtIndex = 0;
  for (let i = memberId.length; i >= 0; --i) {
    if (memberId[i] === '@') {
      lastAtIndex = i;
      break;
    }
  }
  return memberId.substring(0, lastAtIndex);
}

/**
 * bytes/s => kb/s
 */
export function BpsToKbps(value: number): number {
  return (value * 8) / 1000;
}
