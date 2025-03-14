import { test, expect, beforeEach, afterEach } from 'vitest';
import { mkdir, writeFile, rm, readdir } from 'fs/promises';
import VitePluginFlattenThemeBlocks from '../src/index.js'; // Adjust path if needed

const testSource = 'test-theme-blocks';
const testDestination = 'test-blocks';

beforeEach(async () => {
  await rm(testSource, { recursive: true, force: true });
  await rm(testDestination, { recursive: true, force: true });
  await mkdir(`${testSource}/Hero`, { recursive: true });
  await mkdir(`${testSource}/Test`, { recursive: true });
  await writeFile(`${testSource}/Hero/foo.liquid`, 'Hero Foo Content');
  await writeFile(`${testSource}/Test/bar.liquid`, 'Test Bar Content');
  await writeFile(`${testSource}/xyz.liquid`, 'XYZ Content');
});

afterEach(async () => {
  await rm(testSource, { recursive: true, force: true });
  await rm(testDestination, { recursive: true, force: true });
});

test('copies and flattens liquid files', async () => {
  const plugin = VitePluginFlattenThemeBlocks({ source: testSource, destination: testDestination });
  await plugin.buildStart();

  const files = await readdir(testDestination);
  expect(files).toContain('hero-foo.liquid');
  expect(files).toContain('test-bar.liquid');
  expect(files).toContain('xyz.liquid');
});