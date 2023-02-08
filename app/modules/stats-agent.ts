import MediaManager from '@/media';
import { IMediaVO, useMediaStore } from '@/store/media';
import {
  defaultIMediaStatsReport,
  IMediaStatsReport,
  VideoStatsReport,
  AudioStatsReport,
  defaultVideoStatsReport,
  defaultAudioStatsReport
} from '@/store/media-control';
import { BpsToKbps } from '@/utils/common';

export type IMediaStatsReportCallack = (report: IMediaStatsReport) => void;

class StatsAgent {
  private _reportInterval: number;

  private _imediaReposrtTimers: Map<string, NodeJS.Timer> = new Map();
  private _preReports: Map<
    string,
    {
      video?: RTCStatsReport;
      audio?: RTCStatsReport;
    }
  > = new Map();

  constructor(reportInterval = 2000) {
    this._reportInterval = reportInterval;
  }

  async startReport(initMedia: IMediaVO, callback: IMediaStatsReportCallack) {
    if (initMedia.audioId === '' && initMedia.videoId === '') {
      console.error('[stats-agent] empty media');
      return;
    }
    const imid = initMedia.imid;
    // no pre report, collect once first
    if (!this._preReports.has(imid)) this._preReports.set(imid, {});

    // start timer task
    const timer = setInterval(async () => {
      // must use up-to-date imedia
      const media = useMediaStore().getIMedia(imid);
      if (!media) {
        console.warn(`[stats-agent] no imeida[${imid}]`);
        return;
      }

      const videoRTCStatsReport =
        media.videoId !== ''
          ? await MediaManager.getMediaStats(media.videoId)
          : undefined;
      const audioRTCStatsReport =
        media.audioId !== ''
          ? await MediaManager.getMediaStats(media.audioId)
          : undefined;

      const finalReport = this.transformReport(media.imid, {
        videoReport: videoRTCStatsReport,
        audioReport: audioRTCStatsReport
      });
      console.debug('[stats-agent]', media, finalReport);

      // update pre report
      this._preReports.set(media.imid, {
        video: videoRTCStatsReport,
        audio: audioRTCStatsReport
      });
      // callback report
      callback(finalReport);
    }, this._reportInterval);

    this._imediaReposrtTimers.set(imid, timer);
  }

  transformReport(
    imid: string,
    reports: {
      videoReport?: RTCStatsReport;
      audioReport?: RTCStatsReport;
    }
  ): IMediaStatsReport {
    const { videoReport, audioReport } = reports;

    const ret: IMediaStatsReport = defaultIMediaStatsReport();
    let videoRet: VideoStatsReport | undefined;
    let audioRet: AudioStatsReport | undefined;

    const preReport = this._preReports.get(imid);
    if (!preReport) {
      console.warn(`[stats-agent] imedia[${imid}] has no pre report`);
    }

    // only compute total packet loss
    let totalPackets = 0;
    let totalLostPackets = 0;

    /**
     * video
     */
    if (videoReport) {
      const preReportVideo = preReport?.video;
      videoRet = defaultVideoStatsReport();
      videoReport.forEach((stats) => {
        if (stats.type === 'outbound-rtp') {
          // outbound-rtp
          videoRet!.resolution.width = stats.frameWidth;
          videoRet!.resolution.height = stats.frameHeight;
          videoRet!.framerate = stats.framesPerSecond;
          videoRet!.targetBitrate = stats.targetBitrate;
          if (preReportVideo) {
            const preOutboundRtpStats = getStatsById(preReportVideo, stats.id);
            if (preOutboundRtpStats) {
              videoRet!.bandwidth = bytesToKbps(
                stats.bytesSent - preOutboundRtpStats.bytesSent,
                this._reportInterval
              );
            }
          }
          // codec
          let codecStats = getStatsById(videoReport, stats.codecId);
          if (codecStats) {
            videoRet!.codecs = `${codecStats.mimeType.split('/')[1]} (${
              codecStats.payloadType
            })`;
          }
          // remote-inbound-rtp
          let remoteInboundRtpStats = getStatsById(videoReport, stats.remoteId);
          if (remoteInboundRtpStats) {
            videoRet!.rtt = remoteInboundRtpStats.roundTripTime;
            // add to packets info
            if (preReportVideo) {
              const preRemoteInboundRtpStats = getStatsById(
                preReportVideo,
                stats.remoteId
              );
              if (preRemoteInboundRtpStats) {
                // @FIX remote-inbound sometimes no packetsReceived
                // use outbound-rtp.packetsSent to replace
                if (!remoteInboundRtpStats.packetsReceived) {
                  const preOutboundRtpStats = getStatsById(
                    preReportVideo,
                    stats.id
                  );
                  if (preOutboundRtpStats)
                    totalPackets +=
                      stats.packetsSent - preOutboundRtpStats.packetsSent;
                } else {
                  totalPackets +=
                    remoteInboundRtpStats.packetsReceived -
                    preRemoteInboundRtpStats.packetsReceived;
                }
                totalLostPackets +=
                  remoteInboundRtpStats.packetsLost -
                  preRemoteInboundRtpStats.packetsLost;
              }
            }
          }
        } else if (stats.type === 'inbound-rtp') {
          // inbound-rtp
          videoRet!.resolution.width = stats.frameWidth;
          videoRet!.resolution.height = stats.frameHeight;
          videoRet!.framerate = stats.framesPerSecond;
          if (preReportVideo) {
            const preInboundRtpStats = getStatsById(preReportVideo, stats.id);
            if (preInboundRtpStats) {
              // bandwidth
              videoRet!.bandwidth = bytesToKbps(
                stats.bytesReceived - preInboundRtpStats.bytesReceived,
                this._reportInterval
              );
              // add to packets info
              totalPackets +=
                stats.packetsReceived - preInboundRtpStats.packetsReceived;
              totalLostPackets +=
                stats.packetsLost - preInboundRtpStats.packetsLost;
            }
          }
          // codec
          let codecStats = getStatsById(videoReport, stats.codecId);
          if (codecStats) {
            videoRet!.codecs = `${codecStats.mimeType.split('/')[1]} (${
              codecStats.payloadType
            })`;
          }
          // @FIX mediasoup => no remote-outbound-rtp
          // dont show rtt
          videoRet!.rtt = -1;
        }
      });
      ret.video = videoRet;
    }

    /**
     * audio
     */
    if (audioReport) {
      const preReportAudio = preReport?.audio;
      audioRet = defaultAudioStatsReport();
      audioReport.forEach((stats) => {
        if (stats.type === 'outbound-rtp') {
          // outbound-rtp
          if (preReportAudio) {
            const preOutboundRtpStats = getStatsById(preReportAudio, stats.id);
            if (preOutboundRtpStats) {
              audioRet!.bandwidth = bytesToKbps(
                stats.bytesSent - preOutboundRtpStats.bytesSent,
                this._reportInterval
              );
            }
          }
          // codec
          let codecStats = getStatsById(audioReport, stats.codecId);
          if (codecStats) {
            audioRet!.codecs = `${codecStats.mimeType.split('/')[1]} (${
              codecStats.payloadType
            })`;
            audioRet!.channelNum = codecStats.channels;
            audioRet!.sampleRate = codecStats.clockRate;
          }
          // remote-inbound-rtp
          let remoteInboundRtpStats = getStatsById(audioReport, stats.remoteId);
          if (remoteInboundRtpStats) {
            videoRet!.rtt = remoteInboundRtpStats.roundTripTime;
            // add to packets info
            if (preReportAudio) {
              const preRemoteInboundRtpStats = getStatsById(
                preReportAudio,
                stats.remoteId
              );
              if (preRemoteInboundRtpStats) {
                totalPackets +=
                  remoteInboundRtpStats.packetsReceived -
                  preRemoteInboundRtpStats.packetsReceived;
                totalLostPackets +=
                  remoteInboundRtpStats.packetsLost -
                  preRemoteInboundRtpStats.packetsLost;
              }
            }
          }
        } else if (stats.type === 'inbound-rtp') {
          // inbound-rtp
          if (preReportAudio) {
            // inbound-rtp
            const preInboundRtpStats = getStatsById(preReportAudio, stats.id);
            if (preInboundRtpStats) {
              // bandwidth
              audioRet!.bandwidth = bytesToKbps(
                stats.bytesReceived - preInboundRtpStats.bytesReceived,
                this._reportInterval
              );
              // add to packets info
              totalPackets +=
                stats.packetsReceived - preInboundRtpStats.packetsReceived;
              totalLostPackets +=
                stats.packetsLost - preInboundRtpStats.packetsLost;
            }
            // remote-outbound-rtp
            let remoteOutboundRtpStats = getStatsById(
              audioReport,
              stats.remoteId
            );
            if (remoteOutboundRtpStats) {
              audioRet!.rtt = remoteOutboundRtpStats.roundTripTime;
              // codec
              let codecStats = getStatsById(
                audioReport,
                remoteOutboundRtpStats.codecId
              );
              if (codecStats) {
                audioRet!.codecs = `${codecStats.mimeType.split('/')[1]} (${
                  codecStats.payloadType
                })`;
                audioRet!.channelNum = codecStats.channels;
                audioRet!.sampleRate = codecStats.clockRate;
              }
            }
          }
        }
      });
      ret.audio = audioRet;
    }

    /**
     * total
     */
    ret.total.bandwidth =
      (ret.video?.bandwidth || 0) + (ret.audio?.bandwidth || 0);
    ret.total.packetloss =
      totalPackets === 0 ? 0 : totalLostPackets / totalPackets;

    return ret;
  }

  stopReport(imid: string) {
    const timer = this._imediaReposrtTimers.get(imid);
    if (!timer) {
      console.warn('[stats-agent] timer not found');
      return;
    }
    clearInterval(timer);
    this._preReports.delete(imid);
  }
}

/**
 * @returns RTCStats | undefined
 */
function getStatsById(report: RTCStatsReport, id: string): any {
  let ret;
  report.forEach((stats) => {
    if (stats.id === id) {
      ret = stats;
    }
  });
  return ret;
}

function bytesToKbps(bytes: number, time: number): number {
  return Math.ceil(BpsToKbps((bytes / time) * 1000));
}

const statsAgent = new StatsAgent();

export default statsAgent;
