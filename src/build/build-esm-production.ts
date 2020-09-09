/**
 * @license
 * MIT License
 *
 * Copyright (c) 2020 Lyon Software Technologies, Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import esbuild from 'esbuild';
import { startBenchmark, endBenchmark } from '../utils/get-benchmark';
import CONFIG_WITH_CWD from '../utils/read-config-with-cwd';
import PACKAGE_NAME from '../utils/get-package-name';
import { PRODUCTION_ENV } from '../utils/read-env-defs';
import CONFIG from '../utils/read-config';
import EXTERNALS from '../utils/read-externals';

export const OUTPUT_SUFFIX = 'production.esm.min';

export default async function buildESMProduction(): Promise<void> {
  // Get starting base time
  const baseTime = startBenchmark('Generating ESM Production Build');
  // get outfile
  const outfile = `${CONFIG_WITH_CWD.outDir}${PACKAGE_NAME}.${OUTPUT_SUFFIX}.js`;
  // run esbuild
  await esbuild.build({
    entryPoints: [
      CONFIG_WITH_CWD.srcFile,
    ],
    outfile,
    bundle: true,
    minify: false,
    format: 'esm',
    sourcemap: true,
    define: {
      ...PRODUCTION_ENV,
      'process.env.NODE_ENV': '"production"',
    },
    external: EXTERNALS,
    target: CONFIG.target,
    tsconfig: CONFIG_WITH_CWD.tsconfig,
    jsxFactory: CONFIG.jsxFactory,
    jsxFragment: CONFIG.jsxFragment,
  });
  endBenchmark('ESM Production Build', baseTime);
}
