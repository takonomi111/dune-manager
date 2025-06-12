import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-auto';
import path from 'path';

const config = {
  preprocess: preprocess(),
  kit: {
    adapter: adapter(),
    alias: {
      $lib: path.resolve('./src'),
    },
  },
};

export default config;
