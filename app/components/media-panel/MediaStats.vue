<template>
  <div
    class="media-stats"
    @mouseenter="isHover = true"
    @mouseleave="isHover = false"
    @click.stop
  >
    <v-icon color="#fff">mdi-chart-box-outline</v-icon>
    <div class="stats-popup" v-if="isHover">
      <div class="stats-popup__block">
        <div class="stats-popup__block-title">Total</div>
        <MediaStatsItem
          label="bandwidth"
          :value="report.total.bandwidth + ' kbps'"
        ></MediaStatsItem>
        <MediaStatsItem
          label="packetloss"
          :value="report.total.packetloss.toFixed(2) + '%'"
        ></MediaStatsItem>
      </div>
      <div class="stats-popup__block" v-if="report.video">
        <div class="stats-popup__block-title">Video</div>
        <MediaStatsItem
          label="bandwidth"
          :value="report.video.bandwidth + ' kbps'"
        ></MediaStatsItem>
        <MediaStatsItem
          label="resolution"
          :value="
            report.video.resolution.width + 'x' + report.video.resolution.height
          "
        ></MediaStatsItem>
        <MediaStatsItem
          label="framerate"
          :value="report.video.framerate + ' fps'"
        ></MediaStatsItem>
        <MediaStatsItem
          label="codecs"
          :value="report.video.codecs"
        ></MediaStatsItem>
        <MediaStatsItem
          v-show="report.video.rtt >= 0"
          label="delay"
          :value="report.video.rtt + ' ms'"
        ></MediaStatsItem>
      </div>
      <div class="stats-popup__block" v-if="report.audio">
        <div class="stats-popup__block-title">Audio</div>
        <MediaStatsItem
          label="bandwidth"
          :value="report.audio.bandwidth + ' kbps'"
        ></MediaStatsItem>
        <MediaStatsItem
          label="sample rate"
          :value="report.audio.sampleRate + ''"
        ></MediaStatsItem>
        <MediaStatsItem
          label="channel num"
          :value="report.audio.channelNum + ''"
        ></MediaStatsItem>
        <MediaStatsItem
          label="codecs"
          :value="report.audio.codecs"
        ></MediaStatsItem>
        <MediaStatsItem
          v-show="report.audio.rtt >= 0"
          label="delay"
          :value="report.audio.rtt + ' ms'"
        ></MediaStatsItem>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IMediaVO } from '@/store/media';
import { ref, toRefs, onUnmounted } from 'vue';
import { imediaStatsMap, initIMediaStatsReport } from '@/store/media-control';
import MediaStatsItem from './MediaStatsItem.vue';

const isHover = ref(false);

const props = defineProps<{
  media: IMediaVO;
}>();
const { media } = toRefs(props);

// promise exists data to render
initIMediaStatsReport(media.value.imid);
const report = imediaStatsMap.get(media.value.imid)!;
</script>

<style scoped>
.stats-popup {
  position: absolute;
  top: 0;
  /* equal to icon width */
  left: 24px;
  z-index: 20;

  padding: 8px;
  display: flex;
  flex-direction: column;
  background-color: #000;
  color: #fff;
  border-radius: 4px;
}
.stats-popup__block-title {
  font-size: 14px;
  font-weight: bold;
}
.stats-popup__block {
  width: 200px;
}
.stats-popup__block:not(:last-child) {
  margin-bottom: 6px;
}
</style>
