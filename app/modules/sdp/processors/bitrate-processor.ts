import { SessionDescription } from 'sdp-transform';
import { SDPProcessor } from '../sdp-proxy-agent';

/**
 * use b:AS= to set max bandwidth(bitrate)
 * @param max_bitrate
 */
export function VideoMaxBitrateProcessor(max_bitrate: number): SDPProcessor {
  if (max_bitrate < 0) max_bitrate = 0;

  return (sdpObj: SessionDescription) => {
    const mLine = sdpObj.media.find((m) => m.type === 'video');
    if (mLine) {
      mLine.bandwidth = [
        {
          type: 'AS',
          limit: max_bitrate
        }
      ];
    }
    return sdpObj;
  };
}

/**
 * use x-google-start-bitrate to set start bitrate
 * @param start_bitrate
 * @param codec
 */
export function VideoStartBitrateProcessor(
  codec: string,
  start_bitrate: number
): SDPProcessor {
  if (start_bitrate < 0) start_bitrate = 0;
  const config = `x-google-start-bitrate=${start_bitrate};`;

  return (sdpObj: SessionDescription) => {
    const mLine = sdpObj.media.find((m) => m.type === 'video');
    if (mLine) {
      const firstRtp = mLine.rtp.find((item) => item.codec === codec);
      if (firstRtp) {
        const payload = firstRtp.payload;
        const fmtp = mLine.fmtp.find((item) => item.payload === payload);
        if (fmtp) {
          // if missing ';' at the end
          if (fmtp.config[fmtp.config.length - 1] !== ';') fmtp.config += ';';
          fmtp.config += config;
        } else {
          mLine.fmtp.push({
            payload,
            config
          });
        }
      }
    }
    return sdpObj;
  };
}
