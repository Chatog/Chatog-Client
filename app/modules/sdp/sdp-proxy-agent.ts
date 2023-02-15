import { parse, write, SessionDescription } from 'sdp-transform';

/**
 * types
 */
type MaybeSetLocalDescription =
  | ((description?: RTCLocalSessionDescriptionInit) => Promise<void>)
  | null;
export type SDPProcessor = (
  sdpObject: SessionDescription,
  ...args: any
) => SessionDescription;

class SDPProxyAgent {
  private _debug: boolean;
  // raw setLocalDescription method
  private _setLocalDescription: MaybeSetLocalDescription = null;
  // sdp processors
  private _processors: Map<string, SDPProcessor> = new Map();

  constructor(debug = true) {
    this._debug = debug;
    // env check
    if (!window.RTCPeerConnection) {
      throw new Error('[sdp-proxy-agent] your browser dont support WebRTC');
    }
  }

  /**
   * @returns whethre proxy is on
   */
  isOn() {
    return this._setLocalDescription !== null;
  }
  /**
   * turn proxy on
   */
  on() {
    if (this.isOn()) {
      console.warn('[sdp-proxy-agent] already on');
      return;
    } else {
      // save raw setLocalDescription
      this._setLocalDescription =
        window.RTCPeerConnection.prototype.setLocalDescription;
      // replace setLocalDescription with pre-hooked function
      const debug = this._debug;
      const processors = this._processors;
      const setLocalDescription = this._setLocalDescription;
      window.RTCPeerConnection.prototype.setLocalDescription = function (
        description?: RTCLocalSessionDescriptionInit
      ) {
        // parse and write description
        if (description && description.sdp) {
          let sdpObj = parse(description.sdp);
          // alter sdp one by one
          for (const name of processors.keys()) {
            console.log(`[sdp-proxy-agent] processor works: ${name}`);
            const processor = processors.get(name)!;
            sdpObj = processor(sdpObj);
          }
          description.sdp = write(sdpObj);
        }
        // invoke raw setLocalDescription
        if (setLocalDescription === null) {
          console.error('[sdp-proxy-agent] _setLocalDescription missing');
          return Promise.reject();
        } else {
          debug &&
            console.debug('[sdp-proxy-agent] final sdp:', description?.sdp);
          return setLocalDescription.call(this, description);
        }
      };
    }
  }
  /**
   * turn proxy off
   */
  off() {
    if (!this.isOn()) {
      console.warn('sdp proxy is already off');
      return;
    } else {
      // restore setLocalDescription
      window.RTCPeerConnection.prototype.setLocalDescription =
        this._setLocalDescription!;
      this._setLocalDescription = null;
    }
  }
  /**
   * manage processors
   */
  add(name: string, processor: SDPProcessor) {
    this._processors.set(name, processor);
  }
  remove(name: string) {
    this._processors.delete(name);
  }
  getProcessors() {
    return this._processors;
  }
}

const sdpProxyAgent = new SDPProxyAgent();

export default sdpProxyAgent;
