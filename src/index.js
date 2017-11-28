const fs = require('fs');
const jsYaml = require('js-yaml');

const PLUGIN_NAME = 'remark-metadata';
const MATTER_NODES = ['yaml', 'toml'];

/**
 * Get's a matter node from the given AST.
 *
 * @param  {Object} ast
 * @return {Object|undefined}
 */
function getMatterNode(ast) {
  // Note we don't have to traverse the AST because matter will be in root
  return ast.children.find(node => MATTER_NODES.includes(node.type));
}

/**
 * Get the frontmatter from the MDAST. If it doesn't exist, an empty
 * one will be created.
 *
 * @see https://github.com/wooorm/remark-frontmatter
 * @param  {Object} ast
 * @return {Object} a MDAST-like node for Frontmatter.
 */
function getMatter(ast) {
  let fm = getMatterNode(ast);

  // No front matter, create an empty matter node.
  if (!fm) {
    fm = {
      type: 'yaml',
      value: '',
    };
  }

  return fm;
}

/**
 * Given a frontmatter node, write the meta data into it.
 *
 * @param  {Object} frontmatterNode a MDAST-like node for Frontmatter.
 * @param  {Object} meta
 */
function writeMatter(frontmatterNode, meta) {
  const fm = {};

  // parse any existing frontmatter
  if (frontmatterNode.value) {
    Object.assign(fm, jsYaml.safeLoad(frontmatterNode.value));
  }

  // merge in meta
  Object.assign(fm, meta);

  // stringify
  frontmatterNode.value = jsYaml.safeDump(fm).trim(); // eslint-disable-line no-param-reassign
}

/**
 * Given the vFile, returns an object containing possible meta data:
 *
 * - lastModifiedDate
 *
 * @param  {vFile} vFile
 * @return {Object}
 */
function getMetadata(vFile) {
  const meta = {};

  // Is there already a date?
  if (vFile.data && vFile.data.lastModifiedDate) {
    meta.lastModifiedDate = vFile.data.lastModifiedDate;
  }

  // Otherwise determine last modified date.
  try {
    const stats = fs.statSync(vFile.path);
    meta.lastModifiedDate = new Date(stats.mtime).toUTCString();
  } catch (error) {
    vFile.message(error, null, PLUGIN_NAME);
  }

  return meta;
}

/**
 * Returns the transformer which acts on the MDAST tree and given VFile.
 *
 * @link https://github.com/unifiedjs/unified#function-transformernode-file-next
 * @link https://github.com/syntax-tree/mdast
 * @link https://github.com/vfile/vfile
 * @return {function}
 */
function metadata() {
  /**
   * @param {object}    ast   MDAST
   * @param {vFile}     vFile
   * @param {function}  next
   * @return {object}
   */
  return function transformer(ast, vFile, next) {
    // Get frontmatter node from AST
    const frontmatterNode = getMatter(ast);

    // Get metadata
    const meta = getMetadata(vFile);

    // Write metadata (by reference)
    writeMatter(frontmatterNode, meta);

    // If we don't have a Matter node in the AST, put it in.
    if (!getMatterNode(ast)) {
      ast.children.unshift(frontmatterNode);
    }

    if (typeof next === 'function') {
      return next(null, ast, vFile);
    }

    return ast;
  };
}

module.exports = metadata;
