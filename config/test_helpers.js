export const mockDriver = (
  runSpy = () => Promise.resolve(),
  closeSpy = () => Promise.resolve()
) => ({
  session: () => ({
    run: runSpy,
    close: closeSpy
  })
});

export function flushPromises() {
  return new Promise(resolve => setImmediate(resolve));
}

export const desktopApiContexts = {
  activeGraph: {
    projects: [
      {
        graphs: [
          {
            status: "ACTIVE",
            connection: {
              configuration: {
                protocols: {
                  bolt: {
                    host: "localhost",
                    port: 7687,
                    tlsLevel: "OPTIONAL"
                  }
                }
              }
            }
          }
        ]
      }
    ]
  }
};

function integerFn(val) {
  this.val = val;
}
integerFn.prototype.toString = function() {
  return this.val.toString();
};

export const neo4j = {
  v1: {
    Int: integerFn,
    isInt: function(val) {
      return val instanceof integerFn;
    },
    types: {
      Node: function Node(id, labels, properties) {
        this.identity = id;
        this.labels = labels;
        this.properties = properties;
      },
      Relationship: function Relationship(id, start, end, type, properties) {
        this.identity = id;
        this.start = start;
        this.end = end;
        this.type = type;
        this.properties = properties;
      },
      Path: function Path(start, end, segments) {
        this.start = start;
        this.end = end;
        this.segments = segments;
        this.length = segments.length;
      },
      PathSegment: function PathSegment(start, relationship, end) {
        this.start = start;
        this.relationship = relationship;
        this.end = end;
      }
    },
    Integer: function Integer({ low, high }) {
      this.low = low;
      this.high = high;
    }
  }
};

neo4j.v1.types.Node.prototype.toString = function() {
  return "node";
};
neo4j.v1.types.Relationship.prototype.toString = function() {
  return "rel";
};
neo4j.v1.types.Path.prototype.toString = function() {
  return "path";
};
neo4j.v1.types.PathSegment.prototype.toString = function() {
  return "pathsegment";
};
neo4j.v1.Integer.prototype.toInt = function() {
  return this.low;
};
neo4j.v1.int = val => new neo4j.v1.Integer(val);
