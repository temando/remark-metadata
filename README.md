# remark-metadata

[![NPM](https://img.shields.io/npm/v/remark-metadata.svg)](https://npmjs.org/packages/remark-metadata/)
[![Travis CI](https://img.shields.io/travis/temando/remark-metadata.svg)](https://travis-ci.org/temando/remark-metadata)
[![MIT License](https://img.shields.io/github/license/temando/remark-metadata.svg)](https://en.wikipedia.org/wiki/MIT_License)

Adds meta data about a Markdown file to a Markdown file, formatted as [Front Matter](https://jekyllrb.com/docs/frontmatter/).

## Installation

```sh
$ npm install remark-metadata
```

Requires [`remark-frontmatter`](https://github.com/wooorm/remark-frontmatter).

## Usage

Given a file, `example.md`, which contains the following Markdown:

```md
---
title: Example
---

# Example

This is an example
```

Using remark like follows:

```js
var vfile = require('to-vfile');
var remark = require('remark');
var frontmatter = require('remark-frontmatter');
var metadata = require('remark-metadata');

var example = vfile.readSync('example.md');

remark()
  .use(frontmatter)
  .use(metadata, {
    gitExcludeCommit: 'chore:',
    metadata: {
      // string
      tag: 'remark-metadata',
      // constant
      gitCreated: metadata.GIT_CREATED_TIME,
      gitUpdated: metadata.GIT_LAST_MODIFIED_TIME,
      updated: metadata.LAST_MODIFIED_TIME,
      // function
      duration({ gitCreatedTime, modifiedTime }) {
        return (
          new Date(modifiedTime).getTime() - new Date(gitCreatedTime).getTime()
        );
      },
      // object
      title: {
        value({ vFile }) {
          return vFile.basename;
        },
        shouldUpdate(newValue, oldValue) {
          if (oldValue === 'Example') {
            return true;
          }
          return false;
        },
      },
    },
  })
  .process(example, function (err, file) {
    if (err) throw err;
    console.log(String(file));
  });
```

This will output the following Markdown:

```md
---
title: Example
lastModifiedDate: 'Tue, 28 Nov 2017 02:44:25 GMT'
---

# Example

This is an example
```

If a file has no Front Matter, it will be added by this plugin.

### Options

The plugin has the following options:

- `gitExcludeCommit`: A regexp string to exclude commits when get the last modified time through git. This is useful to exclude commits of chore.
- `metadata`: An object describe each metadata.
- `metadata[key]`: A string value, or a constant, or a function that will be called with an object parameter and using the string it returns as the value, or an object contain options below.

```js
// the object parameter of function:
{
  gitModifiedTime,
  gitCreatedTime,
  modifiedTime,
  vFile,
  oldFrontMatter,
}
```

- `metadata[key].value`: A string value, or a constant, or a function, like `metadata[key]`.
- `metadata[key].shouldUpdate`: A function will be called with old and new value of this metadata. The metadata will update, if this function return truthy.

## Constants

- `GIT_CREATED_TIME`: A value of metadata to set the created time of a markdown file. Will use the first commit time of Git.
- `GIT_LAST_MODIFIED_TIME`: A value of metadata to set the last modified time of a markdown file. Will use the last commit time of Git.
- `LAST_MODIFIED_TIME`: A value of metadata to set the last modified time of a markdown file. Will use the mtime of file.
