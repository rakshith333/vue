var dep0 = {
  async handler() {
    return {
      data: {
        hello: "world",
        env: "hello production!"
      }
    };
  }
};
let transformError = (error) => ({
  error: {
    status: error.status || 500,
    message: error.message,
    title: error.name,
    details: error.details,
    stack: void 0
  }
});
class RestError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.details = details;
  }
  toJSON() {
    return JSON.stringify(transformError(this));
  }
}
class BadRequestError extends RestError {
  constructor(message, details) {
    super(message, 400, details);
  }
}
var dep1 = {
  async handler() {
    throw new BadRequestError("Yikes", {
      inputs: ["email"]
    });
  }
};
var dep2 = {
  async handler({ params }) {
    return {
      data: {
        message: `You are user "${params == null ? void 0 : params.id}"`
      }
    };
  }
};
var dep3 = {
  async handler({ params }) {
    return {
      data: {
        message: `Hello from the API, ${(params == null ? void 0 : params.name) || "anonymous"}`
      }
    };
  },
  options: {
    cache: {
      html: 60 * 60 * 24 * 7
    }
  }
};
var dep4 = {
  async handler() {
    return {
      data: {
        server: true,
        message: "Welcome to Vitessedge"
      }
    };
  },
  options: {
    cache: {
      html: 60 * 60 * 24 * 7
    }
  }
};
var virtual_vitedgeFunctions = {
  staticMap: new Map([
    ["/api/demo", dep0],
    ["/api/error", dep1],
    ["/props/hi-name", dep3],
    ["/props/home", dep4]
  ]),
  dynamicMap: new Map([[/^\/api\/users\/([^/]+?)\/?$/i, { keys: ["id"], value: dep2 }]])
};
export { virtual_vitedgeFunctions as default };
