import { resolve } from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'
const resolve = (dir: string) => path.resolve(process.cwd(), dir)
// https://vitejs.dev/config/
export default defineConfig({
    build: {
        lib: {
            // Could also be a dictionary or array of multiple entry points
            entry: resolve(__dirname, 'src/components/index.ts'),
            name: 'Moveable',
            formats: ["cjs", "es"],
            // the proper extensions will be added
            fileName: 'moveable',
        },
        rollupOptions: {
            external: ["vue", "moveable", "@daybrush/utils", "framework-utils"],
            output: {
                // Provide global variables to use in the UMD build
                // Add external deps here
                globals: {
                    vue: "Vue",
                },
            },
        },
        minify: false,
    },
    plugins: [
        vue(),
        dts(),
        createSvgIconsPlugin({
            // 指定需要缓存的图标文件夹
            iconDirs: [resolve('src/assets/icons')],
            // 指定symbolId格式
            symbolId: 'icon-[dir]-[name]'
          }),
    ],
})
