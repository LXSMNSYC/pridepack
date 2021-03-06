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
import path from 'path';
import execa from 'execa';
import getCMD, { CMD } from '../utils/get-cmd';
import TEMPLATES from './templates';

function getDepsArgs(cmd: CMD, packages: string[]): string[] {
  switch (cmd) {
    case 'npm':
      return ['install', ...packages, '--save'];
    case 'yarn':
      return ['add', ...packages];
    default:
      return [];
  }
}

function getDevDepsArgs(cmd: CMD, packages: string[]): string[] {
  switch (cmd) {
    case 'npm':
      return ['install', ...packages, '--save-dev'];
    case 'yarn':
      return ['add', ...packages, '--dev'];
    default:
      return [];
  }
}

export async function installDevDeps(template: string, cwd = '.'): Promise<void> {
  const cmd = await getCMD();
  const { devDependencies, peerDependencies } = TEMPLATES[template];
  // Merge dev and peer
  const allDeps = [
    ...peerDependencies,
    ...devDependencies,
  ];

  if (allDeps.length > 1) {
    await execa(cmd, getDevDepsArgs(cmd, allDeps), {
      cwd: path.resolve(path.join(process.cwd(), cwd)),
    });
  }
}

export async function installDeps(template: string, cwd = '.'): Promise<void> {
  const cmd = await getCMD();
  const { dependencies } = TEMPLATES[template];

  // Run
  if (dependencies.length > 1) {
    await execa(cmd, getDepsArgs(cmd, dependencies), {
      cwd: path.resolve(path.join(process.cwd(), cwd)),
    });
  }
}
