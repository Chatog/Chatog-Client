interface NSUtilType {
  start: (stream: MediaStream) => MediaStream;
  stop: () => void;
}

class NSAgent {
  _nsUtil?: NSUtilType;
  _originalStream?: MediaStream;
  _denoisedStream?: MediaStream;

  startNoiseSuppression(stream: MediaStream): MediaStream {
    if (!this._nsUtil) {
      this._nsUtil = new window.NSUtil('/ns-worklet.js');
    }
    if (this._originalStream) {
      // denoise same stream, just return
      if (stream === this._originalStream && this._denoisedStream)
        return this._denoisedStream;
      // denoise different stream, refuse
      if (stream !== this._originalStream) {
        console.warn(`[ns-agent] another stream is already being denoised`);
        return stream;
      }
    }
    this._originalStream = stream;
    this._denoisedStream = this._nsUtil!.start(this._originalStream);
    return this._denoisedStream;
  }

  stopNoiseSuppression(): MediaStream | undefined {
    this._nsUtil?.stop();
    this._denoisedStream = undefined;
    return this._originalStream;
  }
}

const nsAgent = new NSAgent();

export default nsAgent;
