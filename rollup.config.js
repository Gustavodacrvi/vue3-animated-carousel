/**
 * Export der Komponente läuft über "rollup"
 * Das scheint die einzige Möglichkeit zu sein die funktioniert
 *
 * Weitere Infos:
 *      https://rollupjs.org/guide/en/
 *
 * Cheat-Sheet:
 *      https://devhints.io/rollup
 */
import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';
import commonjs from 'rollup-plugin-commonjs'; // Convert CommonJS modules to ES6
import vue from 'rollup-plugin-vue'; // Handle .vue SFC files
import resolve from '@rollup/plugin-node-resolve';
import del from 'rollup-plugin-delete'
import css from 'rollup-plugin-css-porter';

export default {
    input: 'src/index.ts', // our source file
    output: [
        {
            // Keep the bundle as an ES module file, suitable for other bundlers
            // and inclusion as a <script type=module> tag in modern browsers
            name: 'AnimatedCarousel',
            file: 'dist/vue3-animated-carousel.esm.js',
            format: 'esm', // the preferred format
            sourcemap: true,
        },
        {
            name: 'AnimatedCarousel',
            file: 'dist/vue3-animated-carouselrce.umd.js',
            format: 'umd',
            sourcemap: true,
            globals: {
                'vue-property-decorator': 'vuePropertyDecorator'
            }
        },
        {
            name: 'AnimatedCarousel',
            file: 'dist/vue3-animated-carousel.min.js',
            format: 'iife',
            sourcemap: true,
            globals: {
                'vue-property-decorator': 'vuePropertyDecorator'
            },
        },
        {
            name: 'AnimatedCarousel',
            file: 'dist/vue3-animated-carousel.cjs.js',
            format: 'cjs',
            sourcemap: true,
        },
    ],

    external: [
        ...Object.keys(pkg.dependencies || {}),
        "tsdist",
        "vue",
        // "vue-class-component",
        // "vue-property-decorator",
        "vuex",
        "vuex-class",
        "vuetify",
        "vuetify/dist"
    ],
    plugins: [
        typescript({
            typescript: require('typescript'),
            objectHashIgnoreUnknownHack: true,
            module: 'esnext',

            tsconfig: "tsconfig.json",
            tsconfigOverride: { exclude: [ "node_modules", "src/main.ts", "tests" ] }
        }),
        commonjs(),

        // [Rollup Plugin Vue](https://rollup-plugin-vue.vuejs.org/)
        vue({
            css: false, // Dynamically inject css as a <style> tag
            compileTemplate: true, // Explicitly convert template to render function
        }),
        css(),
        resolve(),

        del({
            targets: 'dist/main.d.ts',
            hook: 'generateBundle'
        })
    ]
};
