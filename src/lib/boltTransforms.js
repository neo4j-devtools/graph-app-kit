import { stringifyMod, flattenArray } from "./utils";

export const recursivelyExtractGraphItems = (types, item) => {
  if (item instanceof types.Node) return item;
  if (item instanceof types.Relationship) return item;
  if (item instanceof types.Path) return item;
  if (Array.isArray(item)) {
    return item.map(i => recursivelyExtractGraphItems(types, i));
  }
  if (["number", "string", "boolean"].indexOf(typeof item) !== -1) return false;
  if (item === null) return false;
  if (typeof item === "object") {
    return Object.keys(item).map(key =>
      recursivelyExtractGraphItems(types, item[key])
    );
  }
  return item;
};

export const resultHasNodes = (types, request) => {
  if (!request) return false;
  const { result = {} } = request;
  if (!result || !result.records) return false;
  const { records = undefined } = result;
  if (!records || !records.length) return false;
  let keys = records[0].keys;
  for (let i = 0; i < records.length; i++) {
    const graphItems = keys.map(key => records[i].get(key));
    const items = recursivelyExtractGraphItems(types, graphItems);
    const flat = flattenArray(items);
    const nodes = flat.filter(
      item => item instanceof types.Node || item instanceof types.Path
    );
    if (nodes.length) return true;
  }
  return false;
};

export const resultHasRows = request => {
  return !!(
    request &&
    request.result &&
    request.result.records &&
    request.result.records.length
  );
};

export const resultHasWarnings = request => {
  return !!(
    request &&
    request.result &&
    request.result.summary &&
    request.result.summary.notifications &&
    request.result.summary.notifications.length
  );
};

export const resultHasPlan = request => {
  return !!(
    request &&
    request.result &&
    request.result.summary &&
    !!(request.result.summary.plan || request.result.summary.profile)
  );
};

export const resultIsError = request => {
  return !!(request && request.result && request.result.code);
};

/**
 * Takes an array of objects and stringifies it using a
 * modified version of JSON.stringify.
 * It takes a replacer without enforcing quoting rules to it.
 * Used so we can have Neo4j integers as string without quotes.
 * intChecker is usually from neo4j-driver -> neo4j.isInt
 */
export const stringifyResultArray = (intChecker, arr = []) => {
  return arr.map(col => {
    if (!col) return col;
    return col.map(fVal => {
      return stringifyMod(fVal, val => {
        if (intChecker(val)) return val.toString();
      });
    });
  });
};

/**
 * Transforms an array of neo4j driver records to an array of objects.
 * Flattens graph items so only their props are left.
 * Leaves Neo4j Integers as they were.
 * types is usually neo4j-driver -> neo4j.types
 * intChecker is usually from neo4j-driver -> neo4j.isInt
 */
export const transformResultRecordsToResultArray = (
  types,
  intChecker,
  records
) => {
  return records && records.length
    ? [records]
        .map(extractRecordsToResultArray)
        .map(flattenGraphItemsInResultArray.bind(null, types, intChecker))[0]
    : undefined;
};

/**
 * Transformes an array of neo4j driver records to an array of objects.
 * Leaves all values as they were, just changing the data structure.
 */
export const extractRecordsToResultArray = (records = []) => {
  records = Array.isArray(records) ? records : [];
  const keys = records[0] ? [records[0].keys] : undefined;
  return (keys || []).concat(
    records.map(record => {
      return record.keys.map((key, i) => record._fields[i]);
    })
  );
};

/**
 *
 * @param {*} types usually neo4j-driver -> neo4j.types
 * @param {*} intChecker usually from neo4j-driver -> neo4j.isInt
 * @param {*} result
 */
export const flattenGraphItemsInResultArray = (
  types,
  intChecker,
  result = []
) => {
  return result.map(flattenGraphItems.bind(null, types, intChecker));
};

/**
 *
 * Recursively looks for graph items and elevates their properties if found.
 * Leaves everything else (including neo4j integers) as is
 *
 * @param {*} types usually neo4j-driver -> neo4j.types
 * @param {*} intChecker usually from neo4j-driver -> neo4j.isInt
 * @param {*} item
 */
export const flattenGraphItems = (types, intChecker, item) => {
  if (Array.isArray(item)) {
    return item.map(flattenGraphItems.bind(null, types, intChecker));
  }
  if (
    typeof item === "object" &&
    item !== null &&
    !isGraphItem(types, item) &&
    !intChecker(item)
  ) {
    let out = {};
    const keys = Object.keys(item);
    for (let i = 0; i < keys.length; i++) {
      out[keys[i]] = flattenGraphItems(types, intChecker, item[keys[i]]);
    }
    return out;
  }
  if (isGraphItem(types, item)) {
    return extractPropertiesFromGraphItems(types, item);
  }
  return item;
};

/**
 *
 * @param {*} types usually neo4j-driver -> neo4j.types
 * @param {*} item
 */
export const isGraphItem = (types, item) => {
  return (
    item instanceof types.Node ||
    item instanceof types.Relationship ||
    item instanceof types.Path ||
    item instanceof types.PathSegment
  );
};

/**
 *
 * @param {*} types usually neo4j-driver -> neo4j.types
 * @param {*} obj
 */
export function extractPropertiesFromGraphItems(types, obj) {
  if (obj instanceof types.Node || obj instanceof types.Relationship) {
    return obj.properties;
  } else if (obj instanceof types.Path) {
    return [].concat.apply([], arrayifyPath(types, obj));
  }
  return obj;
}

/**
 *
 * @param {*} types usually neo4j-driver -> neo4j.types
 * @param {*} path
 */
const arrayifyPath = (types, path) => {
  let segments = path.segments;
  // Zero length path. No relationship, end === start
  if (!Array.isArray(path.segments) || path.segments.length < 1) {
    segments = [{ ...path, end: null }];
  }
  return segments.map(function(segment) {
    return [
      extractPropertiesFromGraphItems(types, segment.start),
      extractPropertiesFromGraphItems(types, segment.relationship),
      extractPropertiesFromGraphItems(types, segment.end)
    ].filter(part => part !== null);
  });
};
