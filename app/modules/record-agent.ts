import { downloadFile } from '@/utils/file';
import { formatDate, formatTimeHMS, timeFrom } from '@/utils/time';

class RecordAgent {
  private _recordingStream: MediaStream | null = null;
  private _recorder: MediaRecorder | null = null;

  isRecording() {
    return this._recordingStream !== null;
  }

  startRecord(mediaStream: MediaStream, filenamePrefix?: string) {
    this._recordingStream = mediaStream;
    this._recorder = new MediaRecorder(this._recordingStream);
    const recordStartTime = new Date();
    const chunks: Blob[] = [];

    this._recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };
    this._recorder.onstop = () => {
      console.log('[record-agent] record stop');
      let filename = `${formatDate(recordStartTime)}_${timeFrom(
        recordStartTime.valueOf()
      )}.webm`;
      if (filenamePrefix) {
        filename = filenamePrefix + '_' + filename;
      }
      // ':' is not allowed in filename
      filename.replaceAll(/:/g, '-');
      downloadFile(filename, chunks);
    };

    this._recorder.start(0);
    console.log('[record-agent] record start');
  }

  stopRecord() {
    this._recorder?.stop();
    this._recorder = null;
    this._recordingStream = null;
  }
}

const recordAgent = new RecordAgent();

export default recordAgent;
