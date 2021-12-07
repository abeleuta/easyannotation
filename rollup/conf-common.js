import pkg from '../package.json';
import del from 'rollup-plugin-delete';
import typescript from 'rollup-plugin-typescript2';
import svgo from 'rollup-plugin-svgo';
import generatePackageJson from 'rollup-plugin-generate-package-json'
import postcss from 'rollup-plugin-postcss';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

const outputDir = "./dist/";

let leanPkg = Object.assign({}, pkg);
leanPkg.scripts = {};
leanPkg.devDependencies = {};

const banner =
    `/* **********************************
EasyAnnotation.js version ${pkg.version}
https://easyannotation.com

Copyright Andrei Beleuta
see README.md and LICENSE for details
********************************** */`;

export default [
    {
        input: './src/index.ts',
        plugins: [
            del({targets: './dist/*'}),
            typescript({
                useTsconfigDeclarationDir: true,
                clean: true
            }),
            nodeResolve(),
            commonjs({
                // non-CommonJS modules will be ignored, but you can also
                // specifically include/exclude files
                include: 'node_modules/**',  // Default: undefined
//      exclude: [ 'node_modules/foo/**', 'node_modules/bar/**' ],  // Default: undefined
                // these values can also be regular expressions
                // include: /node_modules/

                // search for files other than .js files (must already
                // be transpiled by a previous plugin!)
//      extensions: [ '.js', '.coffee' ],  // Default: [ '.js' ]

                // if true then uses of `global` won't be dealt with by this plugin
                //ignoreGlobal: false,  // Default: false

                // if false then skip sourceMap generation for CommonJS modules
                sourceMap: true,  // Default: true

                // explicitly specify unresolvable named exports
                // (see below for more details)
                // namedExports: {'@simonwep/pickr': ['Pickr', 'create']}
                // namedExports: {'node_modules/@simonwep/pickr': ['Pickr', 'create']}

                // sometimes you have to leave require statements
                // unconverted. Pass an array containing the IDs
                // or a `id => boolean` function. Only use this
                // option if you know what you're doing!
                //ignore: [ 'conditional-runtime-dependency' ]
            }),
            postcss({
                minimize: true,
                inject:false
            }),
            svgo({raw: true}),
            // inlineSvg({}),
            generatePackageJson({
                baseContents: leanPkg
            })],
        output: [
            {
                file: outputDir + pkg.module,
                format: 'es',
                banner: banner
            },
            {
                file: outputDir + pkg.main,
                name: pkg.name,
                format: 'umd',
                sourcemap: true,
                banner: banner,
            }
        ]
    },
    {
        input: './src/index.ts',
        plugins: [
            typescript({
                useTsconfigDeclarationDir: true,
                clean: true
            }),
            postcss({
                extensions: ['.css'],
                minimize: true,
                inject:false
            }),
            svgo({raw: true}),
            // inlineSvg({}),
            generatePackageJson({
                baseContents: leanPkg
            })],
        output: [
            {
                file: outputDir + pkg.main,
                name: pkg.name,
                format: 'umd',
                banner: banner
            },

        ]
    }
];
