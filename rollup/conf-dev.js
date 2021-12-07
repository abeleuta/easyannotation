import pkg from '../package.json';
import commoncfg from './conf-common';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import copy from 'rollup-plugin-cpy';
import staticSite from 'rollup-plugin-static-site';

commoncfg[0].plugins.push(
    staticSite({
        template: { path: './index.html' },
        dir: './dist'
    }),
    copy({
        files: ['dev/*.jpg'],
        dest: './dist/dev'
    }),
    serve('./dist'),
    livereload()
);

commoncfg[0].output[0].name = pkg.name;
commoncfg[0].output[0].format = 'umd';
commoncfg[0].output[0].sourcemap = true;

commoncfg.pop();

export default commoncfg;