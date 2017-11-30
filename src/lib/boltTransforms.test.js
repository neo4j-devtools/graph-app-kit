import { neo4j as neo4jDriver } from "../../config/test_helpers";
import {
  resultHasNodes,
  resultHasRows,
  resultHasWarnings,
  resultHasPlan,
  resultIsError,
  extractRecordsToResultArray,
  flattenGraphItemsInResultArray,
  stringifyResultArray
} from "./boltTransforms";

const neo4j = neo4jDriver.v1;

describe("boltTransforms", () => {
  test("resultHasRows should report if there are rows or not in the result", () => {
    // Given
    const items = [
      { request: null, expect: false },
      { request: { result: null }, expect: false },
      { request: { result: { records: [] } }, expect: false },
      { request: { result: { records: true } }, expect: false },
      { request: { result: { records: [1, 2] } }, expect: true },
      { request: { result: { records: ["string"] } }, expect: true }
    ];
    // When
    // Then
    items.forEach(item => {
      expect(resultHasRows(item.request)).toEqual(item.expect);
    });
  });
  test("resultHasWarnings should report if there are warnings or not in the result", () => {
    // Given
    const items = [
      { request: null, expect: false },
      { request: { result: null }, expect: false },
      { request: { result: true }, expect: false },
      { request: { result: { summary: true } }, expect: false },
      { request: { result: { summary: {} } }, expect: false },
      {
        request: { result: { summary: { notifications: null } } },
        expect: false
      },
      {
        request: { result: { summary: { notifications: true } } },
        expect: false
      },
      {
        request: { result: { summary: { notifications: [] } } },
        expect: false
      },
      {
        request: { result: { summary: { notifications: ["yes!"] } } },
        expect: true
      }
    ];
    // When
    // Then
    items.forEach(item => {
      expect(resultHasWarnings(item.request)).toEqual(item.expect);
    });
  });
  test("resultHasPlan should report if there are a plan or not in the result", () => {
    // Given
    const items = [
      { request: null, expect: false },
      { request: { result: null }, expect: false },
      { request: { result: true }, expect: false },
      { request: { result: { summary: true } }, expect: false },
      { request: { result: { summary: {} } }, expect: false },
      { request: { result: { summary: { plan: null } } }, expect: false },
      { request: { result: { summary: { profile: null } } }, expect: false },
      { request: { result: { summary: { plan: {} } } }, expect: true },
      { request: { result: { summary: { profile: {} } } }, expect: true }
    ];
    // When
    // Then
    items.forEach(item => {
      expect(resultHasPlan(item.request)).toEqual(item.expect);
    });
  });
  test("resultIsError should report if the result looks like an error", () => {
    // Given
    const items = [
      { request: null, expect: false },
      { request: { result: null }, expect: false },
      { request: { result: true }, expect: false },
      { request: { result: { code: 1 } }, expect: true }
    ];
    // When
    // Then
    items.forEach(item => {
      expect(resultIsError(item.request)).toEqual(item.expect);
    });
  });
  describe("resultHasNodes", () => {
    test("should return false if no request", () => {
      // Given
      const request = undefined;

      // When
      const hasNodes = resultHasNodes(neo4j.types, request);

      // Then
      expect(hasNodes).toEqual(false);
    });
    test("should return false if no result", () => {
      // Given
      const request = { result: undefined };

      // When
      const hasNodes = resultHasNodes(neo4j.types, request);

      // Then
      expect(hasNodes).toEqual(false);
    });
    test("should return false if no nodes are found", () => {
      // Given
      const mappedGet = map => key => map[key];
      const request = {
        result: {
          records: [
            {
              keys: ["name", "city"],
              get: mappedGet({ name: "Oskar", city: "Borås" })
            },
            {
              keys: ["name", "city"],
              get: mappedGet({ name: "Stella", city: "Borås" })
            }
          ]
        }
      };

      // When
      const hasNodes = resultHasNodes(neo4j.types, request);

      // Then
      expect(hasNodes).toEqual(false);
    });
    test("should return true if nodes are found, even nested", () => {
      // Given
      let node = new neo4j.types.Node("2", ["Movie"], { prop2: "prop2" });
      const mappedGet = map => key => map[key];
      const request = {
        result: {
          records: [
            {
              keys: ["name", "maybeNode"],
              get: mappedGet({ name: "Oskar", maybeNode: false })
            },
            {
              keys: ["name", "maybeNode"],
              get: mappedGet({
                name: "Stella",
                maybeNode: { deeper: [1, node] }
              })
            }
          ]
        }
      };

      // When
      const hasNodes = resultHasNodes(neo4j.types, request);

      // Then
      expect(hasNodes).toEqual(true);
    });
  });
  describe("record transformations", () => {
    test("extractRecordsToResultArray handles empty records", () => {
      // Given
      const records = null;

      // When
      const res = extractRecordsToResultArray(records);

      // Then
      expect(res).toEqual([]);
    });
    test("extractRecordsToResultArray handles regular records", () => {
      // Given
      const start = new neo4j.types.Node(1, ["X"], { x: 1 });
      const end = new neo4j.types.Node(2, ["Y"], { y: new neo4j.Int(1) });
      const rel = new neo4j.types.Relationship(3, 1, 2, "REL", { rel: 1 });
      const segments = [new neo4j.types.PathSegment(start, rel, end)];
      const path = new neo4j.types.Path(start, end, segments);

      const records = [
        {
          keys: ['"x"', '"y"', '"n"'],
          _fields: [
            "x",
            "y",
            new neo4j.types.Node("1", ["Person"], { prop1: "prop1" })
          ]
        },
        {
          keys: ['"x"', '"y"', '"n"'],
          _fields: ["xx", "yy", path]
        }
      ];

      // When
      const res = extractRecordsToResultArray(records);

      // Then
      expect(res).toEqual([
        ['"x"', '"y"', '"n"'],
        ["x", "y", new neo4j.types.Node("1", ["Person"], { prop1: "prop1" })],
        ["xx", "yy", path]
      ]);
    });
    test("flattenGraphItemsInResultArray extracts props from graph items", () => {
      // Given
      const start = new neo4j.types.Node(1, ["X"], { x: 1 });
      const end = new neo4j.types.Node(2, ["Y"], { y: 1 });
      const rel = new neo4j.types.Relationship(3, 1, 2, "REL", { rel: 1 });
      const segments = [new neo4j.types.PathSegment(start, rel, end)];
      const path = new neo4j.types.Path(start, end, segments);

      const records = [
        {
          keys: ['"x"', '"y"', '"n"'],
          _fields: [
            "x",
            "y",
            new neo4j.types.Node("1", ["Person"], { prop1: "prop1" })
          ]
        },
        {
          keys: ['"x"', '"y"', '"n"'],
          _fields: ["xx", "yy", { prop: path }]
        }
      ];

      // When
      const step1 = extractRecordsToResultArray(records);
      const res = flattenGraphItemsInResultArray(
        neo4j.types,
        neo4j.isInt,
        step1
      );

      // Then
      expect(res).toEqual([
        ['"x"', '"y"', '"n"'],
        ["x", "y", { prop1: "prop1" }],
        ["xx", "yy", { prop: [{ x: 1 }, { rel: 1 }, { y: 1 }] }]
      ]);
    });
    test("stringifyResultArray uses stringifyMod to serialize", () => {
      // Given
      const records = [
        {
          keys: ['"neoInt"', '"int"', '"any"', '"backslash"'],
          _fields: [new neo4j.Int("882573709873217509"), 100, 0.5, '"\\"']
        },
        {
          keys: ['"neoInt"', '"int"', '"any"'],
          _fields: [new neo4j.Int(300), 100, "string"]
        }
      ];

      // When
      const step1 = extractRecordsToResultArray(records);
      const step2 = flattenGraphItemsInResultArray(
        neo4j.types,
        neo4j.isInt,
        step1
      );
      const res = stringifyResultArray(neo4j.isInt, step2);
      // Then
      expect(res).toEqual([
        ['""neoInt""', '""int""', '""any""', '""backslash""'],
        ["882573709873217509", "100", "0.5", '""\\""'],
        ["300", "100", '"string"']
      ]);
    });
    test("stringifyResultArray handles neo4j integers nested within graph items", () => {
      // Given
      const start = new neo4j.types.Node(1, ["X"], { x: 1 });
      const end = new neo4j.types.Node(2, ["Y"], { y: new neo4j.Int(2) }); // <-- Neo4j integer
      const rel = new neo4j.types.Relationship(3, 1, 2, "REL", { rel: 1 });
      const segments = [new neo4j.types.PathSegment(start, rel, end)];
      const path = new neo4j.types.Path(start, end, segments);

      const records = [
        {
          keys: ['"x"', '"y"', '"n"'],
          _fields: [
            "x",
            "y",
            new neo4j.types.Node("1", ["Person"], { prop1: "prop1" })
          ]
        },
        {
          keys: ['"x"', '"y"', '"n"'],
          _fields: ["xx", "yy", { prop: path }]
        }
      ];

      // When
      const step1 = extractRecordsToResultArray(records);
      const step2 = flattenGraphItemsInResultArray(
        neo4j.types,
        neo4j.isInt,
        step1
      );
      const res = stringifyResultArray(neo4j.isInt, step2);
      // Then
      expect(res).toEqual([
        ['""x""', '""y""', '""n""'],
        ['"x"', '"y"', JSON.stringify({ prop1: "prop1" })],
        [
          '"xx"',
          '"yy"',
          JSON.stringify({ prop: [{ x: 1 }, { rel: 1 }, { y: 2 }] })
        ] // <--
      ]);
    });
  });
});
