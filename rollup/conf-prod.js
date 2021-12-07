import { terser } from "rollup-plugin-terser";
import copy from 'rollup-plugin-cpy';

import commoncfg from './conf-common';

commoncfg[0].plugins.push(
    terser({
        compress: {
            passes: 2
        }}),
    copy({
        files: ['LICENSE', 'README.md'],
        dest: './dist'
    })
);

commoncfg[1].plugins.push(
    terser({
        compress: {
            passes: 2
        }})
);

export default commoncfg;
