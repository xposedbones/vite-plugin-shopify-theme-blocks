import { promises as fs } from 'fs';
import path from 'path';
import chokidar from 'chokidar';

export default function VitePluginFlattenLiquidFiles({ source = 'theme-blocks', destination = 'blocks' } = {}) {
  async function copyFiles() {
    const files = await getLiquidFiles(source);
    await fs.mkdir(destination, { recursive: true });
    await Promise.all(files.map(file => copyFile(file)));
  }

  async function getLiquidFiles(dir, parentPath = '') {
    let results = [];
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = parentPath ? path.join(parentPath, entry.name) : entry.name;

      if (entry.isDirectory()) {
        const nestedFiles = await getLiquidFiles(fullPath, entry.name);
        results = results.concat(nestedFiles);
      } else if (entry.isFile() && entry.name.endsWith('.liquid')) {
        results.push({ fullPath, relativePath });
      }
    }
    return results;
  }

  async function copyFile({ fullPath, relativePath }) {
    const parts = relativePath.split(path.sep);
    const newFileName = parts.length > 1 ? `${parts.slice(0, -1).join('-')}-${parts[parts.length - 1]}` : parts[0];
    const destinationPath = path.join(destination, newFileName.toLowerCase());
    await fs.copyFile(fullPath, destinationPath);
  }

  return {
    name: 'vite-plugin-flatten-liquid',
    buildStart() {
      return copyFiles();
    },
    configureServer(server) {
      const watcher = chokidar.watch(source, { persistent: true });

      watcher.on('add', copyFiles);
      watcher.on('change', copyFiles);
      watcher.on('unlink', copyFiles);
    },
  };
}