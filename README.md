# remark-metadata

[![NPM](https://img.shields.io/npm/v/remark-metadata.svg)](https://npmjs.org/packages/remark-metadata/)
[![Travis CI](https://img.shields.io/travis/temando/remark-metadata.svg)](https://travis-ci.org/temando/remark-metadata)
[![MIT License](https://img.shields.io/github/license/temando/remark-metadata.svg)](https://en.wikipedia.org/wiki/MIT_License)

Adds meta data about a Markdown file to a Markdown file, formatted as [Front Matter](https://jekyllrb.com/docs/frontmatter/).

The following meta data is added:

- `lastModifiedDate`

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
  .use(metadata)
  .process(example, function (err, file) {
    if (err) throw err;
    console.log(String(file))
    })
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
