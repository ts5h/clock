<template>
  <div class="canvas-wrapper">
    <canvas id="clock" />
  </div>
</template>

<script lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
import Canvas from '@/class/Canvas';

export default {
  name: 'Clock',
  setup(): void {
    // Canvas
    let cs: Canvas;
    let ctx: CanvasRenderingContext2D;
    let ww = 0;
    let wh = 0;

    // Coordination
    let animationID: number | null = null;
    let waitTime = 0;
    let startX = 0;
    let startY = 0;
    // let x = 0;
    // let y = 0;
    const w = 75;
    const h = 10;

    const init = () => {
      if (ctx) {
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.fillRect(0, 0, ww, wh);
        startX = 0;
        startY = 0;
      }
    };

    const getTimeString = () => {
      const dateObj = new Date();
      // const year = dateObj.getFullYear();
      // const month = ('0' + (dateObj.getMonth() + 1)).slice(-2);
      // const date = ('0' + dateObj.getDate()).slice(-2);
      const hours = (`0${dateObj.getHours()}`).slice(-2);
      const minutes = (`0${dateObj.getMinutes()}`).slice(-2);
      const seconds = (`0${dateObj.getSeconds()}`).slice(-2);
      const millSeconds = (`00${dateObj.getMilliseconds()}`).slice(-3);

      // console.log(hours + ':' + minutes + ':' + minutes + '.' + millSeconds);

      return `${hours}:${minutes}:${seconds}.${millSeconds}`;
    };
    const drawTime = () => {
      const timeString = getTimeString();

      // console.log(timeString);
      let fontSize = 0;
      const type = Math.floor(Math.random() * 15);

      if (type === 0) {
        fontSize = Math.floor(Math.random() * 90) + 10;
      } else {
        fontSize = Math.floor(Math.random() * 10) + 1;
      }

      ctx.font = `${fontSize}px Inter`;
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#444';
      ctx.fillText(timeString, startX, startY);

      if (type === 0) {
        startY += h;
      } else {
        startY += fontSize;
      }

      if (startY >= wh) {
        startX += w;
        startY = 0;
      }

      if (startX + w >= ww) {
        init();
      }
    };

    const setWait = () => {
      // About 60fps
      if (Math.floor(Math.random() * 20) > 0) {
        waitTime = Math.floor(Math.random() * 10);
      } else {
        waitTime = Math.floor(Math.random() * 110) + 10;
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

    // Resize
    const handleResize = () => {
      cs.resizeCanvas();
      ww = cs.getWindowWidth();
      wh = cs.getWindowHeight();
      init();
    };

    window.addEventListener('resize', handleResize);

    /* Hooks */
    onMounted(() => {
      cs = new Canvas('clock');
      ctx = cs.getContext();
      ww = cs.getWindowWidth();
      wh = cs.getWindowHeight();
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
.canvas-wrapper {
  width: 100%;
  height: 100%;

  canvas {
    vertical-align: bottom;
  }
}
</style>
