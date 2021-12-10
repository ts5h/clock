<template>
  <div
    @mouseover="hoverHandler(true)"
    @mouseout="hoverHandler(false)"
    @touchstart="touchHandler(true)"
    @touchend="touchHandler(false)"
    :class="['github', theme, status.hover ? 'on' : '']"
  >
    <a :href="url" target="_blank" title="GitHub">GitHub</a>
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
  name: 'GitHub',
  props: {
    theme: String,
    url: String,
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

<style scoped lang="scss">
@use "../scss/config/variables";

.github {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  position: fixed;
  right: 0;
  top: 0;

  opacity: 0;
  transition: opacity 0.3s ease-out;

  &.on {
    opacity: 1;
  }

  a {
    display: block;
    width: 30px;
    height: 30px;
    overflow: hidden;

    background: url(/img/icon_github.svg) no-repeat center center / 16px auto;
    text-indent: -9999px;
    text-decoration: none;
  }
}

// Light
.github {
  &.light {
    a {
      background: #444;
      mask: url(/img/icon_github.svg) no-repeat center center / 16px auto;
    }
  }
}

@media screen and (max-width: variables.$break-point) {
  .github {
    opacity: 0.5;
    transition: none;

    a {
      background-size: 14px auto;
      width: 24px;
      height: 24px;
    }
  }
}
</style>
