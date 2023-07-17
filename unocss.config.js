import presetWeapp from "unocss-preset-weapp";
import { defineConfig } from "unocss";
import {
  extractorAttributify,
  transformerClass,
} from "unocss-preset-weapp/transformer";

const { transformerAttributify, presetWeappAttributify } =
  extractorAttributify();

export default defineConfig({
  presets: [
    // https://github.com/MellowCo/unocss-preset-weapp
    presetWeapp({
      // h5兼容
      // 只开发小程序可删除
      platform: "uniapp",
      isH5: process.env.UNI_PLATFORM === "h5",
    }),

    // attributify autocomplete
    presetWeappAttributify(),
  ],
  shortcuts: [
    {
      "border-base": "border border-gray-500_10",
      center: "flex justify-center items-center",
    },
  ],

  transformers: [
    // https://github.com/MellowCo/unocss-preset-weapp/tree/main/src/transformer/transformerAttributify
    transformerAttributify(),

    // https://github.com/MellowCo/unocss-preset-weapp/tree/main/src/transformer/transformerClass
    transformerClass(),
  ],
});
