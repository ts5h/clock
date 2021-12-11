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
    const w = 60;
    const h = 10;
    const textSize = {
      zero: { width: 0 },
      one: { width: 0 },
      two: { width: 0 },
      three: { width: 0 },
      four: { width: 0 },
      five: { width: 0 },
      six: { width: 0 },
      seven: { width: 0 },
      eight: { width: 0 },
      nine: { width: 0 },
      colon: { width: 0 },
      dot: { width: 0 },
    };

    // For Sounds
    let eventName: string;
    let aCtx: AudioContext;
    let oMinutes = '';
    let nMinutes = '';

    // Draw Time
    const init = () => {
      if (ctx) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
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
      const timeString = `${timeObj.hours}:${timeObj.minutes}:${timeObj.seconds}.${timeObj.millSeconds}`;
      nMinutes = timeObj.minutes;

      const type = Math.floor(Math.random() * (isMobile().any ? 12 : 20));
      let fontSize = 0;

      // font size: 2px - 80px / 2px - 120px
      if (type === 0) {
        fontSize = Math.floor(Math.random() * (isMobile().any ? 81 : 111)) + 10;
      } else {
        fontSize = Math.floor(Math.random() * 9) + 2;
      }

      let letterSpacing: number;

      if (isMobile().apple.device) {
        letterSpacing = 0;
      } else if (isMobile().any) {
        letterSpacing = (fontSize / 80) * -0.15;
      } else {
        letterSpacing = (fontSize / 120) * -0.4;
      }

      if (isMobile().apple.device) {
        canvas.style.letterSpacing = '0em';
        ctx.font = `${fontSize}px Inter`;
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'rgba(68, 68, 68, 0.75)';

        // fillText
        const ratio = fontSize / 100;
        const space = (fontSize / 80) * -6;
        let localX = x;

        for (let i = 0; i < timeString.length; i += 1) {
          ctx.fillText(timeString[i], localX, y);

          switch (timeString[i]) {
            case '0':
              localX += (textSize.zero.width + space) * ratio;
              break;
            case '1':
              localX += (textSize.one.width + space) * ratio;
              break;
            case '2':
              localX += (textSize.two.width + space) * ratio;
              break;
            case '3':
              localX += (textSize.three.width + space) * ratio;
              break;
            case '4':
              localX += (textSize.four.width + space) * ratio;
              break;
            case '5':
              localX += (textSize.five.width + space) * ratio;
              break;
            case '6':
              localX += (textSize.six.width + space) * ratio;
              break;
            case '7':
              if (i < timeString.length - 1 && timeString[i + 1] === '.') {
                localX += (textSize.seven.width - 10 + space) * ratio;
              } else {
                localX += (textSize.seven.width + space) * ratio;
              }
              break;
            case '8':
              localX += (textSize.eight.width + space) * ratio;
              break;
            case '9':
              localX += (textSize.nine.width + space) * ratio;
              break;
            case ':':
              localX += (textSize.colon.width + space) * ratio;
              break;
            case '.':
              if (i < timeString.length - 1 && timeString[i + 1] === '1') {
                localX += (textSize.dot.width - 10 + space) * ratio;
              } else {
                localX += (textSize.dot.width + space) * ratio;
              }
              break;
            default:
              break;
          }
        }
      } else {
        canvas.style.letterSpacing = `${letterSpacing}em`;
        ctx.font = `${fontSize}px Inter`;
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'rgba(68, 68, 68, 0.75)';
        ctx.fillText(timeString, x, y);
      }

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

      // Check text size
      ctx.font = '100px Inter';
      textSize.zero.width = ctx.measureText('0').width;
      textSize.one.width = ctx.measureText('1').width;
      textSize.two.width = ctx.measureText('2').width;
      textSize.three.width = ctx.measureText('3').width;
      textSize.four.width = ctx.measureText('4').width;
      textSize.five.width = ctx.measureText('5').width;
      textSize.six.width = ctx.measureText('6').width;
      textSize.seven.width = ctx.measureText('7').width;
      textSize.eight.width = ctx.measureText('8').width;
      textSize.nine.width = ctx.measureText('9').width;
      textSize.colon.width = ctx.measureText(':').width;
      textSize.dot.width = ctx.measureText('.').width;

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
    -webkit-font-smoothing: subpixel-antialiased;
    text-rendering: optimizeLegibility;
    vertical-align: bottom;
  }
}
</style>
