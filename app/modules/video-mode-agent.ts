import SDPProxyAgent, { SDPProcessor } from './sdp/sdp-proxy-agent';
import { VideoMaxBitrateProcessor } from './sdp/processors/bitrate-processor';
import {
  VP9EncoderProcessor,
  RC_END_USAGE
} from './sdp/processors/vp9-encoder-processor';
import { VideoMode } from '@/store/media-control';

const videoModeProcessors = new Map<VideoMode, SDPProcessor>();
videoModeProcessors.set(
  VideoMode.QUALITY,
  VP9EncoderProcessor({
    rc_end_usage: RC_END_USAGE.CBR,
    cq_level: 31,
    min_q: 4,
    max_q: 24,
    target_rate: 2000
  })
);

class VideoModeAgent {
  private _currentMode: VideoMode = VideoMode.STABLE;

  init() {
    SDPProxyAgent.add('video-max-bitrate', VideoMaxBitrateProcessor(4000));
    SDPProxyAgent.on();
  }

  controlVideoEncoder(mode: VideoMode) {
    const processor = videoModeProcessors.get(mode);
    if (processor) {
      SDPProxyAgent.off();
      SDPProxyAgent.add(`video-mode-${mode}`, processor);
      this._currentMode = mode;
      SDPProxyAgent.on();
    }
  }

  restoreVideoEncoder() {
    if (this._currentMode !== VideoMode.STABLE) {
      SDPProxyAgent.off();
      SDPProxyAgent.remove(`video-mode-${this._currentMode}`);
      this._currentMode = VideoMode.STABLE;
      SDPProxyAgent.on();
    }
  }
}

const videoModeAgent = new VideoModeAgent();

export default videoModeAgent;
