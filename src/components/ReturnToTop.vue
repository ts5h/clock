<template>
  <div
    @mouseover="hoverHandler(true)"
    @mouseout="hoverHandler(false)"
    @touchstart="touchHandler(true)"
    @touchend="touchHandler(false)"
    :class="['return-to-top', theme, status.hover ? 'on' : '']"
  >
    <a href="/">Back</a>
  </div>
</template>

<script lang="ts">
import { reactive } from 'vue';
import isMobile from 'ismobilejs';

type setupType = {
  status: { hover: boolean };
  hoverHandler: (state: boolean) => void;
  touchHandler: (state: boolean) => void;
};

export default {
  name: 'ReturnToTop',
  props: {
    theme: String,
  },
  setup(): setupType {
    const status = reactive<{ hover: boolean }>({
      hover: false,
    });

    const hoverHandler = (state: boolean) => {
      if (isMobile().any) return;
      status.hover = state;
    };

    const touchHandler = (state: boolean) => {
      if (!isMobile().any) return;
      status.hover = state;
    };

    return {
      status,
      hoverHandler,
      touchHandler,
    };
  },
};
</script>

<style lang="scss" scoped>
@use "../scss/config/variables";

/* Return to the HOME on static pages */
.return-to-top {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1000;

  box-sizing: border-box;
  background: url(/img/arrow-back-to-home.svg) no-repeat 8px center / 12px auto;
  margin: 0;
  padding: 0;

  opacity: 0;
  transition: opacity 0.3s ease-out;

  &.on {
    opacity: 1;
  }

  a {
    display: block;
    color: white;
    font-family: Inter, sans-serif;
    font-size: 11px;
    padding: 8px 10px 8px 24px;
    text-decoration: none;
  }
}

// Light
.return-to-top {
  &.light {
    background-color: rgba(white, 0.8);
    background-image: url(/img/arrow-back-to-home-dark.svg);

    a {
      color: #444;
    }
  }
}

@media screen and (max-width: variables.$break-point) {
  .return-to-top {
    text-indent: -9999px;
    background-position: center center;
    width: 24px;
    height: 24px;

    opacity: 0.5;
    transition: none;

    a {
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      padding: 0;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
