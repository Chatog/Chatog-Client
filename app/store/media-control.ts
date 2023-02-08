import { Ref, ref } from 'vue';

export interface IMediaStatsReport {
  total: StatsReport;
  video?: VideoStatsReport;
  audio?: AudioStatsReport;
}
export interface StatsReport {
  bandwidth: number;
  packetloss: number;
}
export interface VideoStatsReport extends StatsReport {
  resolution: {
    width: number;
    height: number;
  };
  framerate: number;
  codecs: string;
  rtt: number;
  targetBitrate: number;
}
export interface AudioStatsReport extends StatsReport {
  channelNum: number;
  sampleRate: number;
  codecs: string;
  rtt: number;
}

export function defaultIMediaStatsReport(): IMediaStatsReport {
  return {
    total: {
      bandwidth: 0,
      packetloss: 0
    }
  };
}

export function defaultVideoStatsReport(): VideoStatsReport {
  return {
    bandwidth: 0,
    packetloss: 0,
    resolution: {
      width: 0,
      height: 0
    },
    framerate: 0,
    codecs: '',
    rtt: 0,
    targetBitrate: 0
  };
}

export function defaultAudioStatsReport(): AudioStatsReport {
  return {
    bandwidth: 0,
    packetloss: 0,
    channelNum: 0,
    sampleRate: 0,
    codecs: '',
    rtt: 0
  };
}

export const imediaStatsMap: Map<string, Ref<IMediaStatsReport>> = new Map();

export function initIMediaStatsReport(imid: string) {
  imediaStatsMap.set(imid, ref(defaultIMediaStatsReport()));
}
