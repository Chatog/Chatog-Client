import { SessionDescription } from 'sdp-transform';
import { SDPProcessor } from '../sdp-proxy-agent';

export enum RC_END_USAGE {
  VBR,
  CQ,
  CBR,
  Q
}

interface VP9EncoderConfig {
  rc_end_usage?: RC_END_USAGE; // 0~4
  cq_level?: number; // 0~63
  min_q?: number; // 0~63
  max_q?: number; // 0~63
  target_rate?: number; // kbps
}

export function VP9EncoderProcessor(
  config: VP9EncoderConfig = {
    rc_end_usage: RC_END_USAGE.CBR,
    cq_level: 31,
    min_q: 4,
    max_q: 24,
    target_rate: 2000
  }
): SDPProcessor {
  return (sdpObj: SessionDescription) => {
    let sessionDesc = '';
    for (const k of Object.keys(config)) {
      // @ts-ignore
      sessionDesc += `${k}=${config[k]};`;
    }
    if (!sdpObj.description) sdpObj.description = '';
    sdpObj.description += sessionDesc;
    return sdpObj;
  };
}
