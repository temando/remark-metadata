const path = require('path');
const parse = require('remark-parse');
const frontmatter = require('remark-frontmatter');
const stringify = require('remark-stringify');
const toVFile = require('to-vfile');
const unified = require('unified');
const metadata = require('../src/');

const fixturesDir = path.join(__dirname, '/fixtures');
const runtimeDir = path.join(__dirname, '/runtime');
const remark = unified().use(parse).use(stringify).use(frontmatter)
  .freeze();

// Utility function to add metadata to a vFile.
function addMetadata(vFile, destinationFilePath) {
  // eslint-disable-next-line no-param-reassign
  vFile.data = {
    destinationFilePath,
    destinationDir: path.dirname(destinationFilePath),
  };
}

describe('remark-metadata', () => {
  describe('src file name with spaces should work fine', () => {
    const srcFile = `${fixturesDir}/file name with spaces.md`;
    const destFile = `${runtimeDir}/file name with spaces.md`;
    let vfile;

    beforeEach(() => {
      vfile = toVFile.readSync(srcFile);
      addMetadata(vfile, destFile);
    });

    it('when using git', () => {
      const result = remark()
        .use(frontmatter)
        .use(metadata, {
          metadata: {
            created: metadata.GIT_CREATED_TIME,
            updated: metadata.GIT_LAST_MODIFIED_TIME,
          },
        })
        .processSync(vfile)
        .toString();

      // should be "created: 'DATE'"
      expect(result).not.toContain("created: ''");

      // should be "updated: 'DATE'"
      expect(result).not.toContain("updated: ''");
    });

    it('when using stat', () => {
      const result = remark()
        .use(metadata, {
          metadata: {
            updated: metadata.LAST_MODIFIED_TIME,
          },
        })
        .processSync(vfile)
        .toString();

      // should be "created: 'DATE'"
      expect(result).not.toContain("created: ''");

      // should be "updated: 'DATE'"
      expect(result).not.toContain("updated: ''");
    });
  });

  describe('adds metadata to existing front matter', () => {
    const srcFile = `${fixturesDir}/existing.md`;
    const destFile = `${runtimeDir}/existing.md`;
    let vfile;

    beforeEach(() => {
      vfile = toVFile.readSync(srcFile);
      addMetadata(vfile, destFile);
    });

    it('when provide shouldUpdate option', () => {
      const mockFn = jest.fn();
      const result = remark()
        .use(metadata, {
          metadata: {
            lastModifiedAt: {
              value: metadata.LAST_MODIFIED_TIME,
              shouldUpdate(newValue, oldValue) {
                mockFn();
                expect(newValue).not.toBeFalsy();
                expect(oldValue).toBe('Thu, 22 Oct 2020 06:47:56 GMT');

                return false;
              },
            },
          },
        })
        .processSync(vfile)
        .toString();

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(result).toContain("lastModifiedAt: 'Thu, 22 Oct 2020 06:47:56 GMT'");
    });

    it('when does not provide shouldUpdate option', () => {
      const result = remark()
        .use(metadata, {
          metadata: {
            lastModifiedAt: {
              value: metadata.LAST_MODIFIED_TIME,
            },
          },
        })
        .processSync(vfile)
        .toString();

      expect(result).not.toContain('lastModifiedAt: Thu, 22 Oct 2020 06:47:56 GMT');
    });

    it('when provide gitExcludeCommit option', () => {
      const result = remark()
        .use(metadata, {
          gitExcludeCommit: '',
          metadata: {
            lastModifiedAt: metadata.GIT_LAST_MODIFIED_TIME,
          },
        })
        .processSync(vfile)
        .toString();

      expect(result).toContain("lastModifiedAt: ''");
    });

    it('when provide string metadata', () => {
      const result = remark()
        .use(metadata, {
          metadata: {
            foo: 'bar',
          },
        })
        .processSync(vfile)
        .toString();

      expect(result).toContain('foo: bar');
    });

    it('when provide function metadata', () => {
      const mockFn = jest.fn();
      const result = remark()
        .use(metadata, {
          metadata: {
            foo({
              gitModifiedTime,
              gitCreatedTime,
              modifiedTime,
              vFile,
              oldFrontMatter,
            }) {
              mockFn();
              expect(gitModifiedTime).toBeTruthy();
              expect(gitCreatedTime).toBeTruthy();
              expect(modifiedTime).toBeTruthy();
              expect(vFile).toBeTruthy();
              expect(oldFrontMatter).toBeTruthy();
              return 'bar';
            },
          },
        })
        .processSync(vfile)
        .toString();

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(result).toContain('foo: bar');
    });
  });

  describe('adds metadata as new front matter', () => {
    const srcFile = `${fixturesDir}/no.md`;
    const destFile = `${runtimeDir}/no.md`;
    let vfile;

    beforeEach(() => {
      vfile = toVFile.readSync(srcFile);
      addMetadata(vfile, destFile);
    });

    it('when provide metadata', () => {
      const result = remark()
        .use(metadata, {
          metadata: { lastModifiedAt: metadata.LAST_MODIFIED_TIME },
        })
        .processSync(vfile)
        .toString();
      expect(result).toContain('lastModifiedAt:');
    });

    it('when does not provide metadata', () => {
      const result = remark().use(metadata).processSync(vfile).toString();
      expect(result).toContain('{}');
    });
  });
});
