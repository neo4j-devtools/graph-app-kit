export function shallowEqual(objA, objB) {
  if (objA === objB) {
    return true;
  }

  if (
    typeof objA !== "object" ||
    objA === null ||
    typeof objB !== "object" ||
    objB === null
  ) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  var bHasOwnProperty = hasOwnProperty.bind(objB);
  for (var i = 0; i < keysA.length; i++) {
    if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
      return false;
    }
  }

  return true;
}

export const flattenArray = arr => {
  return arr.reduce((all, curr) => {
    if (Array.isArray(curr)) return all.concat(flattenArray(curr));
    return all.concat(curr);
  }, []);
};

export const stringifyMod = (
  value,
  modFn = null,
  prettyLevel = false,
  skipOpeningIndentation = false
) => {
  prettyLevel = !prettyLevel
    ? false
    : prettyLevel === true ? 1 : parseInt(prettyLevel);
  const nextPrettyLevel = prettyLevel ? prettyLevel + 1 : false;
  const newLine = prettyLevel ? "\n" : "";
  const indentation =
    prettyLevel && !skipOpeningIndentation ? Array(prettyLevel).join("  ") : "";
  const endIndentation = prettyLevel ? Array(prettyLevel).join("  ") : "";
  const propSpacing = prettyLevel ? " " : "";
  const toString = Object.prototype.toString;
  const isArray =
    Array.isArray ||
    function(a) {
      return toString.call(a) === "[object Array]";
    };
  const escMap = {
    '"': '"',
    "\\": "\\",
    "\b": "\b",
    "\f": "\f",
    "\n": "\n",
    "\r": "\r",
    "\t": "\t"
  };
  const escFunc = function(m) {
    return (
      escMap[m] || "\\u" + (m.charCodeAt(0) + 0x10000).toString(16).substr(1)
    );
  };
  const escRE = /[\\"\u0000-\u001F\u2028\u2029]/g;
  if (modFn) {
    const modVal = modFn && modFn(value);
    if (typeof modVal !== "undefined") return indentation + modVal;
  }
  if (value == null) return indentation + "null";
  if (typeof value === "number") {
    return indentation + (isFinite(value) ? value.toString() : "null");
  }
  if (typeof value === "boolean") return indentation + value.toString();
  if (typeof value === "object") {
    if (typeof value.toJSON === "function") {
      return stringifyMod(value.toJSON(), modFn, nextPrettyLevel);
    } else if (isArray(value)) {
      let hasValues = false;
      let res = "";
      for (let i = 0; i < value.length; i++) {
        hasValues = true;
        res +=
          (i ? "," : "") +
          newLine +
          stringifyMod(value[i], modFn, nextPrettyLevel);
      }
      return (
        indentation +
        "[" +
        res +
        (hasValues ? newLine + endIndentation : "") +
        "]"
      );
    } else if (toString.call(value) === "[object Object]") {
      let tmp = [];
      for (const k in value) {
        if (value.hasOwnProperty(k)) {
          tmp.push(
            stringifyMod(k, modFn, nextPrettyLevel) +
              ":" +
              propSpacing +
              stringifyMod(value[k], modFn, nextPrettyLevel, true)
          );
        }
      }
      return (
        indentation +
        "{" +
        newLine +
        tmp.join("," + newLine) +
        newLine +
        endIndentation +
        "}"
      );
    }
  }
  return indentation + '"' + value.toString().replace(escRE, escFunc) + '"';
};
