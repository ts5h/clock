<template>
  <div class="canvas-wrapper">
    <canvas id="clock" />
  </div>
</template>

<script lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
import isMobile from 'ismobilejs';
import Canvas from '@/class/Canvas';

// Clock component
export default {
  name: 'Clock',
  setup(): void {
    // Canvas
    let cs: Canvas;
    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;
    let ww = 0;
    let wh = 0;

    // Coordination
    let animationID: number | null = null;
    let waitTime = 0;
    let x = 0;
    let y = 0;
    const w = 70;
    const h = 10;

    // For Sounds
    let eventName: string;
    let aCtx: AudioContext;
    let oMinutes = '';
    let nMinutes = '';

    // Draw Time
    const init = () => {
      if (ctx) {
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.fillRect(0, 0, ww, wh);
        x = 0;
        y = 0;
      }
    };

    const getTimeObject = () => {
      const dateObj = new Date();
      // const year = dateObj.getFullYear();
      // const month = ('0' + (dateObj.getMonth() + 1)).slice(-2);
      // const date = ('0' + dateObj.getDate()).slice(-2);
      const hours = (`0${dateObj.getHours()}`).slice(-2);
      const minutes = (`0${dateObj.getMinutes()}`).slice(-2);
      const seconds = (`0${dateObj.getSeconds()}`).slice(-2);
      const millSeconds = (`00${dateObj.getMilliseconds()}`).slice(-3);

      // console.log(hours + ':' + minutes + ':' + minutes + '.' + millSeconds);
      return {
        hours,
        minutes,
        seconds,
        millSeconds,
      };
    };

    const drawTime = () => {
      const timeObj = getTimeObject();
      nMinutes = timeObj.minutes;

      const type = Math.floor(Math.random() * 20);
      let fontSize = 0;
      let letterSpacing = 0;

      // font size: 2px - 160px
      if (type === 0) {
        fontSize = Math.floor(Math.random() * (isMobile().any ? 91 : 111)) + 10;
      } else {
        fontSize = Math.floor(Math.random() * 9) + 2;
      }

      letterSpacing = (fontSize / 160) * -0.6;
      canvas.style.letterSpacing = `${letterSpacing}em`;

      ctx.font = `${fontSize}px Inter`;
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(68, 68, 68, 0.65)';
      ctx.fillText(`${timeObj.hours}:${timeObj.minutes}:${timeObj.seconds}.${timeObj.millSeconds}`, x, y);

      // eslint-disable-next-line no-use-before-define
      playClick();
      oMinutes = nMinutes;

      if (type === 0) {
        y += h;
      } else {
        y += fontSize;
      }

      if (y >= wh) {
        x += w;
        y = 0;
      }

      if (x + w >= ww) {
        init();
      }
    };

    const setWait = () => {
      // About 60fps
      if (Math.floor(Math.random() * 20) === 0) {
        waitTime = Math.floor(Math.random() * 111) + 10;
      } else {
        waitTime = Math.floor(Math.random() * 10) + 1;
      }
    };

    const doWait = () => {
      if (waitTime === 0) {
        // eslint-disable-next-line no-use-before-define
        loop();
      } else {
        animationID = window.requestAnimationFrame(() => {
          waitTime -= 1;
          doWait();
        });
      }
    };

    const loop = () => {
      drawTime();
      setWait();
      doWait();
    };

    // Play Sounds
    const initAudioContext = () => {
      document.removeEventListener(eventName, initAudioContext);
      aCtx.resume();
    };

    const playClick = () => {
      const osc = aCtx.createOscillator();
      const gain = aCtx.createGain();
      const comp = aCtx.createDynamicsCompressor();
      let maxGain = 0.0;
      let dur = 0.0;

      if (oMinutes !== '' && nMinutes !== oMinutes) {
        osc.frequency.value = 783.991;
        maxGain = 0.6;
        dur = 0.1;
      } else {
        const keyFreq = 311.1;
        osc.frequency.value = (Math.random() * 40) - 20 + keyFreq;
        maxGain = 0.6;
        dur = 0.02;
      }

      osc.type = 'sine';
      gain.gain.value = maxGain;

      osc.connect(gain).connect(comp).connect(aCtx.destination);
      osc.start(aCtx.currentTime);
      osc.stop(aCtx.currentTime + dur);
    };

    // Resize
    const handleResize = () => {
      cs.resizeCanvas();
      ww = cs.getWindowWidth();
      wh = cs.getWindowHeight();
      init();
    };

    /* Hooks */
    onMounted(() => {
      window.addEventListener('resize', handleResize);

      // Canvas
      cs = new Canvas('clock');
      canvas = cs.getCanvas();
      ctx = cs.getContext();
      ww = cs.getWindowWidth();
      wh = cs.getWindowHeight();

      // Sounds
      eventName = typeof document.ontouchend !== 'undefined' ? 'touchend' : 'mouseup';
      document.addEventListener(eventName, initAudioContext);

      try {
        // eslint-disable-next-line
        window.AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        aCtx = new AudioContext();
      } catch (e) {
        console.log(e);
      }

      loop();
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleResize);
      if (animationID) {
        window.cancelAnimationFrame(animationID);
      }
    });
  },
};
</script>

<style scoped lang="scss">
@font-face {
  font-family: 'Inter';
  src: local('Inter'), url('../assets/fonts/Inter-Regular.ttf') format('truetype');
  font-variant: normal;
  font-feature-settings: "palt" 1;
}

.canvas-wrapper {
  width: 100%;
  height: 100%;

  canvas {
    vertical-align: bottom;
  }
}
</style>
