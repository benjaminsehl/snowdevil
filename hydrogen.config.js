import {defineConfig} from '@shopify/hydrogen/config';

export default defineConfig({
  routes: import.meta.globEager('./src/routes/**/*.server.[jt](s|sx)'),
  shopify: {
    defaultLocale: 'en',
    storeDomain: 'hydrogen-preview.myshopify.com',
    storefrontToken: '09c82483290a75958b379f661b96bd4b',
    storefrontApiVersion: '2022-07',
  },
});
