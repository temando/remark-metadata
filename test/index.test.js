const path = require('path');
const parse = require('remark-parse');
const frontmatter = require('remark-frontmatter');
const stringify = require('remark-stringify');
const toVFile = require('to-vfile');
const unified = require('unified');
const metadata = require('../src/');

const fixturesDir = path.join(__dirname, '/fixtures');
const runtimeDir = path.join(__dirname, '/runtime');
const remark = unified().use(parse).use(stringify).use(frontmatter).freeze();

// Utility function to add metdata to a vFile.
function addMetadata(vFile, destinationFilePath) {
  vFile.data = {
    destinationFilePath,
    destinationDir: path.dirname(destinationFilePath),
  };
}

describe('remark-metadata', () => {
  it('adds metadata to existing front matter', () => {
    const srcFile = `${fixturesDir}/existing.md`;
    const destFile = `${runtimeDir}/existing.md`;
    const vfile = toVFile.readSync(srcFile);
    addMetadata(vfile, destFile);

    const result = remark().use(metadata).processSync(vfile).toString();
    expect(result).toContain('lastModifiedAt:');
  });

  it('adds metadata using stat', () => {
    const srcFile = `${fixturesDir}/existing.md`;
    const destFile = `${runtimeDir}/existing.md`;
    const vfile = toVFile.readSync(srcFile);
    addMetadata(vfile, destFile);

    const result = remark().use(metadata, { git: false }).processSync(vfile).toString();
    expect(result).toContain('lastModifiedAt:');
  });

  it('adds metadata as new front matter', () => {
    const srcFile = `${fixturesDir}/no.md`;
    const destFile = `${runtimeDir}/no.md`;
    const vfile = toVFile.readSync(srcFile);
    addMetadata(vfile, destFile);

    const result = remark().use(metadata).processSync(vfile).toString();
    expect(result).toContain('lastModifiedAt:');
  });

  it('reuses modified date from vFile data', () => {
    const srcFile = `${fixturesDir}/existing.md`;
    const destFile = `${runtimeDir}/existing.md`;
    const vfile = toVFile.readSync(srcFile);
    addMetadata(vfile, destFile);
    vfile.data.lastModifiedAt = 'Tue, 28 Nov 2017 02:44:25 GMT';

    const result = remark().use(metadata).processSync(vfile).toString();
    expect(result).toContain('lastModifiedAt:');
  });
});
