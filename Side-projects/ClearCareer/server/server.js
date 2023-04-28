(function (global, factory) {
  typeof exports === "object" && typeof module !== "undefined"
    ? (module.exports = factory(
        require("http"),
        require("fs"),
        require("crypto")
      ))
    : typeof define === "function" && define.amd
    ? define(["http", "fs", "crypto"], factory)
    : ((global =
        typeof globalThis !== "undefined" ? globalThis : global || self),
      (global.Server = factory(global.http, global.fs, global.crypto)));
})(this, function (http, fs, crypto) {
  "use strict";

  function _interopDefaultLegacy(e) {
    return e && typeof e === "object" && "default" in e ? e : { default: e };
  }

  var http__default = /*#__PURE__*/ _interopDefaultLegacy(http);
  var fs__default = /*#__PURE__*/ _interopDefaultLegacy(fs);
  var crypto__default = /*#__PURE__*/ _interopDefaultLegacy(crypto);

  class ServiceError extends Error {
    constructor(message = "Service Error") {
      super(message);
      this.name = "ServiceError";
    }
  }

  class NotFoundError extends ServiceError {
    constructor(message = "Resource not found") {
      super(message);
      this.name = "NotFoundError";
      this.status = 404;
    }
  }

  class RequestError extends ServiceError {
    constructor(message = "Request error") {
      super(message);
      this.name = "RequestError";
      this.status = 400;
    }
  }

  class ConflictError extends ServiceError {
    constructor(message = "Resource conflict") {
      super(message);
      this.name = "ConflictError";
      this.status = 409;
    }
  }

  class AuthorizationError extends ServiceError {
    constructor(message = "Unauthorized") {
      super(message);
      this.name = "AuthorizationError";
      this.status = 401;
    }
  }

  class CredentialError extends ServiceError {
    constructor(message = "Forbidden") {
      super(message);
      this.name = "CredentialError";
      this.status = 403;
    }
  }

  var errors = {
    ServiceError,
    NotFoundError,
    RequestError,
    ConflictError,
    AuthorizationError,
    CredentialError,
  };

  const { ServiceError: ServiceError$1 } = errors;

  function createHandler(plugins, services) {
    return async function handler(req, res) {
      const method = req.method;
      console.info(`<< ${req.method} ${req.url}`);

      // Redirect fix for admin panel relative paths
      if (req.url.slice(-6) == "/admin") {
        res.writeHead(302, {
          Location: `http://${req.headers.host}/admin/`,
        });
        return res.end();
      }

      let status = 200;
      let headers = {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      };
      let result = "";
      let context;

      // NOTE: the OPTIONS method results in undefined result and also it never processes plugins - keep this in mind
      if (method == "OPTIONS") {
        Object.assign(headers, {
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Credentials": false,
          "Access-Control-Max-Age": "86400",
          "Access-Control-Allow-Headers":
            "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, X-Authorization, X-Admin",
        });
      } else {
        try {
          context = processPlugins();
          await handle(context);
        } catch (err) {
          if (err instanceof ServiceError$1) {
            status = err.status || 400;
            result = composeErrorObject(err.code || status, err.message);
          } else {
            // Unhandled exception, this is due to an error in the service code - REST consumers should never have to encounter this;
            // If it happens, it must be debugged in a future version of the server
            console.error(err);
            status = 500;
            result = composeErrorObject(500, "Server Error");
          }
        }
      }

      res.writeHead(status, headers);
      if (
        context != undefined &&
        context.util != undefined &&
        context.util.throttle
      ) {
        await new Promise((r) => setTimeout(r, 500 + Math.random() * 500));
      }
      res.end(result);

      function processPlugins() {
        const context = { params: {} };
        plugins.forEach((decorate) => decorate(context, req));
        return context;
      }

      async function handle(context) {
        const { serviceName, tokens, query, body } = await parseRequest(req);
        if (serviceName == "admin") {
          return ({ headers, result } = services["admin"](
            method,
            tokens,
            query,
            body
          ));
        } else if (serviceName == "favicon.ico") {
          return ({ headers, result } = services["favicon"](
            method,
            tokens,
            query,
            body
          ));
        }

        const service = services[serviceName];

        if (service === undefined) {
          status = 400;
          result = composeErrorObject(
            400,
            `Service "${serviceName}" is not supported`
          );
          console.error("Missing service " + serviceName);
        } else {
          result = await service(context, { method, tokens, query, body });
        }

        // NOTE: logout does not return a result
        // in this case the content type header should be omitted, to allow checks on the client
        if (result !== undefined) {
          result = JSON.stringify(result);
        } else {
          status = 204;
          delete headers["Content-Type"];
        }
      }
    };
  }

  function composeErrorObject(code, message) {
    return JSON.stringify({
      code,
      message,
    });
  }

  async function parseRequest(req) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const tokens = url.pathname.split("/").filter((x) => x.length > 0);
    const serviceName = tokens.shift();
    const queryString = url.search.split("?")[1] || "";
    const query = queryString
      .split("&")
      .filter((s) => s != "")
      .map((x) => x.split("="))
      .reduce(
        (p, [k, v]) => Object.assign(p, { [k]: decodeURIComponent(v) }),
        {}
      );
    const body = await parseBody(req);

    return {
      serviceName,
      tokens,
      query,
      body,
    };
  }

  function parseBody(req) {
    return new Promise((resolve, reject) => {
      let body = "";
      req.on("data", (chunk) => (body += chunk.toString()));
      req.on("end", () => {
        try {
          resolve(JSON.parse(body));
        } catch (err) {
          resolve(body);
        }
      });
    });
  }

  var requestHandler = createHandler;

  class Service {
    constructor() {
      this._actions = [];
      this.parseRequest = this.parseRequest.bind(this);
    }

    /**
     * Handle service request, after it has been processed by a request handler
     * @param {*} context Execution context, contains result of middleware processing
     * @param {{method: string, tokens: string[], query: *, body: *}} request Request parameters
     */
    async parseRequest(context, request) {
      for (let { method, name, handler } of this._actions) {
        if (
          method === request.method &&
          matchAndAssignParams(context, request.tokens[0], name)
        ) {
          return await handler(
            context,
            request.tokens.slice(1),
            request.query,
            request.body
          );
        }
      }
    }

    /**
     * Register service action
     * @param {string} method HTTP method
     * @param {string} name Action name. Can be a glob pattern.
     * @param {(context, tokens: string[], query: *, body: *)} handler Request handler
     */
    registerAction(method, name, handler) {
      this._actions.push({ method, name, handler });
    }

    /**
     * Register GET action
     * @param {string} name Action name. Can be a glob pattern.
     * @param {(context, tokens: string[], query: *, body: *)} handler Request handler
     */
    get(name, handler) {
      this.registerAction("GET", name, handler);
    }

    /**
     * Register POST action
     * @param {string} name Action name. Can be a glob pattern.
     * @param {(context, tokens: string[], query: *, body: *)} handler Request handler
     */
    post(name, handler) {
      this.registerAction("POST", name, handler);
    }

    /**
     * Register PUT action
     * @param {string} name Action name. Can be a glob pattern.
     * @param {(context, tokens: string[], query: *, body: *)} handler Request handler
     */
    put(name, handler) {
      this.registerAction("PUT", name, handler);
    }

    /**
     * Register PATCH action
     * @param {string} name Action name. Can be a glob pattern.
     * @param {(context, tokens: string[], query: *, body: *)} handler Request handler
     */
    patch(name, handler) {
      this.registerAction("PATCH", name, handler);
    }

    /**
     * Register DELETE action
     * @param {string} name Action name. Can be a glob pattern.
     * @param {(context, tokens: string[], query: *, body: *)} handler Request handler
     */
    delete(name, handler) {
      this.registerAction("DELETE", name, handler);
    }
  }

  function matchAndAssignParams(context, name, pattern) {
    if (pattern == "*") {
      return true;
    } else if (pattern[0] == ":") {
      context.params[pattern.slice(1)] = name;
      return true;
    } else if (name == pattern) {
      return true;
    } else {
      return false;
    }
  }

  var Service_1 = Service;

  function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        let r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  var util = {
    uuid,
  };

  const uuid$1 = util.uuid;

  const data = fs__default["default"].existsSync("./data")
    ? fs__default["default"].readdirSync("./data").reduce((p, c) => {
        const content = JSON.parse(
          fs__default["default"].readFileSync("./data/" + c)
        );
        const collection = c.slice(0, -5);
        p[collection] = {};
        for (let endpoint in content) {
          p[collection][endpoint] = content[endpoint];
        }
        return p;
      }, {})
    : {};

  const actions = {
    get: (context, tokens, query, body) => {
      tokens = [context.params.collection, ...tokens];
      let responseData = data;
      for (let token of tokens) {
        if (responseData !== undefined) {
          responseData = responseData[token];
        }
      }
      return responseData;
    },
    post: (context, tokens, query, body) => {
      tokens = [context.params.collection, ...tokens];
      console.log("Request body:\n", body);

      // TODO handle collisions, replacement
      let responseData = data;
      for (let token of tokens) {
        if (responseData.hasOwnProperty(token) == false) {
          responseData[token] = {};
        }
        responseData = responseData[token];
      }

      const newId = uuid$1();
      responseData[newId] = Object.assign({}, body, { _id: newId });
      return responseData[newId];
    },
    put: (context, tokens, query, body) => {
      tokens = [context.params.collection, ...tokens];
      console.log("Request body:\n", body);

      let responseData = data;
      for (let token of tokens.slice(0, -1)) {
        if (responseData !== undefined) {
          responseData = responseData[token];
        }
      }
      if (
        responseData !== undefined &&
        responseData[tokens.slice(-1)] !== undefined
      ) {
        responseData[tokens.slice(-1)] = body;
      }
      return responseData[tokens.slice(-1)];
    },
    patch: (context, tokens, query, body) => {
      tokens = [context.params.collection, ...tokens];
      console.log("Request body:\n", body);

      let responseData = data;
      for (let token of tokens) {
        if (responseData !== undefined) {
          responseData = responseData[token];
        }
      }
      if (responseData !== undefined) {
        Object.assign(responseData, body);
      }
      return responseData;
    },
    delete: (context, tokens, query, body) => {
      tokens = [context.params.collection, ...tokens];
      let responseData = data;

      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        if (responseData.hasOwnProperty(token) == false) {
          return null;
        }
        if (i == tokens.length - 1) {
          const body = responseData[token];
          delete responseData[token];
          return body;
        } else {
          responseData = responseData[token];
        }
      }
    },
  };

  const dataService = new Service_1();
  dataService.get(":collection", actions.get);
  dataService.post(":collection", actions.post);
  dataService.put(":collection", actions.put);
  dataService.patch(":collection", actions.patch);
  dataService.delete(":collection", actions.delete);

  var jsonstore = dataService.parseRequest;

  /*
   * This service requires storage and auth plugins
   */

  const { AuthorizationError: AuthorizationError$1 } = errors;

  const userService = new Service_1();

  userService.get("me", getSelf);
  userService.post("register", onRegister);
  userService.post("login", onLogin);
  userService.get("logout", onLogout);

  function getSelf(context, tokens, query, body) {
    if (context.user) {
      const result = Object.assign({}, context.user);
      delete result.hashedPassword;
      return result;
    } else {
      throw new AuthorizationError$1();
    }
  }

  function onRegister(context, tokens, query, body) {
    return context.auth.register(body);
  }

  function onLogin(context, tokens, query, body) {
    return context.auth.login(body);
  }

  function onLogout(context, tokens, query, body) {
    return context.auth.logout();
  }

  var users = userService.parseRequest;

  const { NotFoundError: NotFoundError$1, RequestError: RequestError$1 } =
    errors;

  var crud = {
    get,
    post,
    put,
    patch,
    delete: del,
  };

  function validateRequest(context, tokens, query) {
    /*
        if (context.params.collection == undefined) {
            throw new RequestError('Please, specify collection name');
        }
        */
    if (tokens.length > 1) {
      throw new RequestError$1();
    }
  }

  function parseWhere(query) {
    const operators = {
      "<=": (prop, value) => (record) => record[prop] <= JSON.parse(value),
      "<": (prop, value) => (record) => record[prop] < JSON.parse(value),
      ">=": (prop, value) => (record) => record[prop] >= JSON.parse(value),
      ">": (prop, value) => (record) => record[prop] > JSON.parse(value),
      "=": (prop, value) => (record) => record[prop] == JSON.parse(value),
      " like ": (prop, value) => (record) =>
        record[prop].toLowerCase().includes(JSON.parse(value).toLowerCase()),
      " in ": (prop, value) => (record) =>
        JSON.parse(`[${/\((.+?)\)/.exec(value)[1]}]`).includes(record[prop]),
    };
    const pattern = new RegExp(
      `^(.+?)(${Object.keys(operators).join("|")})(.+?)$`,
      "i"
    );

    try {
      let clauses = [query.trim()];
      let check = (a, b) => b;
      let acc = true;
      if (query.match(/ and /gi)) {
        // inclusive
        clauses = query.split(/ and /gi);
        check = (a, b) => a && b;
        acc = true;
      } else if (query.match(/ or /gi)) {
        // optional
        clauses = query.split(/ or /gi);
        check = (a, b) => a || b;
        acc = false;
      }
      clauses = clauses.map(createChecker);

      return (record) => clauses.map((c) => c(record)).reduce(check, acc);
    } catch (err) {
      throw new Error("Could not parse WHERE clause, check your syntax.");
    }

    function createChecker(clause) {
      let [match, prop, operator, value] = pattern.exec(clause);
      [prop, value] = [prop.trim(), value.trim()];

      return operators[operator.toLowerCase()](prop, value);
    }
  }

  function get(context, tokens, query, body) {
    validateRequest(context, tokens);

    let responseData;

    try {
      if (query.where) {
        responseData = context.storage
          .get(context.params.collection)
          .filter(parseWhere(query.where));
      } else if (context.params.collection) {
        responseData = context.storage.get(
          context.params.collection,
          tokens[0]
        );
      } else {
        // Get list of collections
        return context.storage.get();
      }

      if (query.sortBy) {
        const props = query.sortBy
          .split(",")
          .filter((p) => p != "")
          .map((p) => p.split(" ").filter((p) => p != ""))
          .map(([p, desc]) => ({ prop: p, desc: desc ? true : false }));

        // Sorting priority is from first to last, therefore we sort from last to first
        for (let i = props.length - 1; i >= 0; i--) {
          let { prop, desc } = props[i];
          responseData.sort(({ [prop]: propA }, { [prop]: propB }) => {
            if (typeof propA == "number" && typeof propB == "number") {
              return (propA - propB) * (desc ? -1 : 1);
            } else {
              return propA.localeCompare(propB) * (desc ? -1 : 1);
            }
          });
        }
      }

      if (query.offset) {
        responseData = responseData.slice(Number(query.offset) || 0);
      }
      const pageSize = Number(query.pageSize) || 10;
      if (query.pageSize) {
        responseData = responseData.slice(0, pageSize);
      }

      if (query.distinct) {
        const props = query.distinct.split(",").filter((p) => p != "");
        responseData = Object.values(
          responseData.reduce((distinct, c) => {
            const key = props.map((p) => c[p]).join("::");
            if (distinct.hasOwnProperty(key) == false) {
              distinct[key] = c;
            }
            return distinct;
          }, {})
        );
      }

      if (query.count) {
        return responseData.length;
      }

      if (query.select) {
        const props = query.select.split(",").filter((p) => p != "");
        responseData = Array.isArray(responseData)
          ? responseData.map(transform)
          : transform(responseData);

        function transform(r) {
          const result = {};
          props.forEach((p) => (result[p] = r[p]));
          return result;
        }
      }

      if (query.load) {
        const props = query.load.split(",").filter((p) => p != "");
        props.map((prop) => {
          const [propName, relationTokens] = prop.split("=");
          const [idSource, collection] = relationTokens.split(":");
          console.log(
            `Loading related records from "${collection}" into "${propName}", joined on "_id"="${idSource}"`
          );
          const storageSource =
            collection == "users" ? context.protectedStorage : context.storage;
          responseData = Array.isArray(responseData)
            ? responseData.map(transform)
            : transform(responseData);

          function transform(r) {
            const seekId = r[idSource];
            const related = storageSource.get(collection, seekId);
            delete related.hashedPassword;
            r[propName] = related;
            return r;
          }
        });
      }
    } catch (err) {
      console.error(err);
      if (err.message.includes("does not exist")) {
        throw new NotFoundError$1();
      } else {
        throw new RequestError$1(err.message);
      }
    }

    context.canAccess(responseData);

    return responseData;
  }

  function post(context, tokens, query, body) {
    console.log("Request body:\n", body);

    validateRequest(context, tokens);
    if (tokens.length > 0) {
      throw new RequestError$1("Use PUT to update records");
    }
    context.canAccess(undefined, body);

    body._ownerId = context.user._id;
    let responseData;

    try {
      responseData = context.storage.add(context.params.collection, body);
    } catch (err) {
      throw new RequestError$1();
    }

    return responseData;
  }

  function put(context, tokens, query, body) {
    console.log("Request body:\n", body);

    validateRequest(context, tokens);
    if (tokens.length != 1) {
      throw new RequestError$1("Missing entry ID");
    }

    let responseData;
    let existing;

    try {
      existing = context.storage.get(context.params.collection, tokens[0]);
    } catch (err) {
      throw new NotFoundError$1();
    }

    context.canAccess(existing, body);

    try {
      responseData = context.storage.set(
        context.params.collection,
        tokens[0],
        body
      );
    } catch (err) {
      throw new RequestError$1();
    }

    return responseData;
  }

  function patch(context, tokens, query, body) {
    console.log("Request body:\n", body);

    validateRequest(context, tokens);
    if (tokens.length != 1) {
      throw new RequestError$1("Missing entry ID");
    }

    let responseData;
    let existing;

    try {
      existing = context.storage.get(context.params.collection, tokens[0]);
    } catch (err) {
      throw new NotFoundError$1();
    }

    context.canAccess(existing, body);

    try {
      responseData = context.storage.merge(
        context.params.collection,
        tokens[0],
        body
      );
    } catch (err) {
      throw new RequestError$1();
    }

    return responseData;
  }

  function del(context, tokens, query, body) {
    validateRequest(context, tokens);
    if (tokens.length != 1) {
      throw new RequestError$1("Missing entry ID");
    }

    let responseData;
    let existing;

    try {
      existing = context.storage.get(context.params.collection, tokens[0]);
    } catch (err) {
      throw new NotFoundError$1();
    }

    context.canAccess(existing);

    try {
      responseData = context.storage.delete(
        context.params.collection,
        tokens[0]
      );
    } catch (err) {
      throw new RequestError$1();
    }

    return responseData;
  }

  /*
   * This service requires storage and auth plugins
   */

  const dataService$1 = new Service_1();
  dataService$1.get(":collection", crud.get);
  dataService$1.post(":collection", crud.post);
  dataService$1.put(":collection", crud.put);
  dataService$1.patch(":collection", crud.patch);
  dataService$1.delete(":collection", crud.delete);

  var data$1 = dataService$1.parseRequest;

  const imgdata =
    "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Td4DLneAwSddMiRH8tMU8nng/Yy+KQsM3AKBNbe35j5OH4A0dbV8AxwcAqMFyl73eHd3e2//nmn29wOGi3Kv+RixSgAAEkxpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+Cjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDQuNC4wLUV4aXYyIj4KIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgIHhtbG5zOmlwdGNFeHQ9Imh0dHA6Ly9pcHRjLm9yZy9zdGQvSXB0YzR4bXBFeHQvMjAwOC0wMi0yOS8iCiAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiCiAgICB4bWxuczpwbHVzPSJodHRwOi8vbnMudXNlcGx1cy5vcmcvbGRmL3htcC8xLjAvIgogICAgeG1sbnM6R0lNUD0iaHR0cDovL3d3dy5naW1wLm9yZy94bXAvIgogICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIgogICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIgogICAgeG1sbnM6eG1wUmlnaHRzPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvcmlnaHRzLyIKICAgeG1wTU06RG9jdW1lbnRJRD0iZ2ltcDpkb2NpZDpnaW1wOjdjZDM3NWM3LTcwNmItNDlkMy1hOWRkLWNmM2Q3MmMwY2I4ZCIKICAgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2NGY2YTJlYy04ZjA5LTRkZTMtOTY3ZC05MTUyY2U5NjYxNTAiCiAgIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoxMmE1NzI5Mi1kNmJkLTRlYjQtOGUxNi1hODEzYjMwZjU0NWYiCiAgIEdJTVA6QVBJPSIyLjAiCiAgIEdJTVA6UGxhdGZvcm09IldpbmRvd3MiCiAgIEdJTVA6VGltZVN0YW1wPSIxNjEzMzAwNzI5NTMwNjQzIgogICBHSU1QOlZlcnNpb249IjIuMTAuMTIiCiAgIGRjOkZvcm1hdD0iaW1hZ2UvcG5nIgogICBwaG90b3Nob3A6Q3JlZGl0PSJHZXR0eSBJbWFnZXMvaVN0b2NrcGhvdG8iCiAgIHhtcDpDcmVhdG9yVG9vbD0iR0lNUCAyLjEwIgogICB4bXBSaWdodHM6V2ViU3RhdGVtZW50PSJodHRwczovL3d3dy5pc3RvY2twaG90by5jb20vbGVnYWwvbGljZW5zZS1hZ3JlZW1lbnQ/dXRtX21lZGl1bT1vcmdhbmljJmFtcDt1dG1fc291cmNlPWdvb2dsZSZhbXA7dXRtX2NhbXBhaWduPWlwdGN1cmwiPgogICA8aXB0Y0V4dDpMb2NhdGlvbkNyZWF0ZWQ+CiAgICA8cmRmOkJhZy8+CiAgIDwvaXB0Y0V4dDpMb2NhdGlvbkNyZWF0ZWQ+CiAgIDxpcHRjRXh0OkxvY2F0aW9uU2hvd24+CiAgICA8cmRmOkJhZy8+CiAgIDwvaXB0Y0V4dDpMb2NhdGlvblNob3duPgogICA8aXB0Y0V4dDpBcnR3b3JrT3JPYmplY3Q+CiAgICA8cmRmOkJhZy8+CiAgIDwvaXB0Y0V4dDpBcnR3b3JrT3JPYmplY3Q+CiAgIDxpcHRjRXh0OlJlZ2lzdHJ5SWQ+CiAgICA8cmRmOkJhZy8+CiAgIDwvaXB0Y0V4dDpSZWdpc3RyeUlkPgogICA8eG1wTU06SGlzdG9yeT4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJzYXZlZCIKICAgICAgc3RFdnQ6Y2hhbmdlZD0iLyIKICAgICAgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpjOTQ2M2MxMC05OWE4LTQ1NDQtYmRlOS1mNzY0ZjdhODJlZDkiCiAgICAgIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkdpbXAgMi4xMCAoV2luZG93cykiCiAgICAgIHN0RXZ0OndoZW49IjIwMjEtMDItMTRUMTM6MDU6MjkiLz4KICAgIDwvcmRmOlNlcT4KICAgPC94bXBNTTpIaXN0b3J5PgogICA8cGx1czpJbWFnZVN1cHBsaWVyPgogICAgPHJkZjpTZXEvPgogICA8L3BsdXM6SW1hZ2VTdXBwbGllcj4KICAgPHBsdXM6SW1hZ2VDcmVhdG9yPgogICAgPHJkZjpTZXEvPgogICA8L3BsdXM6SW1hZ2VDcmVhdG9yPgogICA8cGx1czpDb3B5cmlnaHRPd25lcj4KICAgIDxyZGY6U2VxLz4KICAgPC9wbHVzOkNvcHlyaWdodE93bmVyPgogICA8cGx1czpMaWNlbnNvcj4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgcGx1czpMaWNlbnNvclVSTD0iaHR0cHM6Ly93d3cuaXN0b2NrcGhvdG8uY29tL3Bob3RvL2xpY2Vuc2UtZ20xMTUwMzQ1MzQxLT91dG1fbWVkaXVtPW9yZ2FuaWMmYW1wO3V0bV9zb3VyY2U9Z29vZ2xlJmFtcDt1dG1fY2FtcGFpZ249aXB0Y3VybCIvPgogICAgPC9yZGY6U2VxPgogICA8L3BsdXM6TGljZW5zb3I+CiAgIDxkYzpjcmVhdG9yPgogICAgPHJkZjpTZXE+CiAgICAgPHJkZjpsaT5WbGFkeXNsYXYgU2VyZWRhPC9yZGY6bGk+CiAgICA8L3JkZjpTZXE+CiAgIDwvZGM6Y3JlYXRvcj4KICAgPGRjOmRlc2NyaXB0aW9uPgogICAgPHJkZjpBbHQ+CiAgICAgPHJkZjpsaSB4bWw6bGFuZz0ieC1kZWZhdWx0Ij5TZXJ2aWNlIHRvb2xzIGljb24gb24gd2hpdGUgYmFja2dyb3VuZC4gVmVjdG9yIGlsbHVzdHJhdGlvbi48L3JkZjpsaT4KICAgIDwvcmRmOkFsdD4KICAgPC9kYzpkZXNjcmlwdGlvbj4KICA8L3JkZjpEZXNjcmlwdGlvbj4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/PmWJCnkAAAAGYktHRAD/AP8A/6C9p5MAAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQflAg4LBR0CZnO/AAAARHRFWHRDb21tZW50AFNlcnZpY2UgdG9vbHMgaWNvbiBvbiB3aGl0ZSBiYWNrZ3JvdW5kLiBWZWN0b3IgaWxsdXN0cmF0aW9uLlwvEeIAAAMxSURBVHja7Z1bcuQwCEX7qrLQXlp2ynxNVWbK7dgWj3sl9JvYRhxACD369erW7UMzx/cYaychonAQvXM5ABYkpynoYIiEGdoQog6AYfywBrCxF4zNrX/7McBbuXJe8rXx/KBDULcGsMREzCbeZ4J6ME/9wVH5d95rogZp3npEgPLP3m2iUSGqXBJS5Dr6hmLm8kRuZABYti5TMaailV8LodNQwTTUWk4/WZk75l0kM0aZQdaZjMqkrQDAuyMVJWFjMB4GANXr0lbZBxQKr7IjI7QvVWkok/Jn5UHVh61CYPs+/i7eL9j3y/Au8WqoAIC34k8/9k7N8miLcaGWHwgjZXE/awyYX7h41wKMCskZM2HXAddDkTdglpSjz5bcKPbcCEKwT3+DhxtVpJvkEC7rZSgq32NMSBoXaCdiahDCKrND0fpX8oQlVsQ8IFQZ1VARdIF5wroekAjB07gsAgDUIbQHFENIDEX4CQANIVe8Iw/ASiACLXl28eaf579OPuBa9/mrELUYHQ1t3KHlZZnRcXb2/c7ygXIQZqjDMEzeSrOgCAhqYMvTUE+FKXoVxTxgk3DEPREjGzj3nAk/VaKyB9GVIu4oMyOlrQZgrBBEFG9PAZTfs3amYDGrP9Wl964IeFvtz9JFluIvlEvcdoXDOdxggbDxGwTXcxFRi/LdirKgZUBm7SUdJG69IwSUzAMWgOAq/4hyrZVaJISSNWHFVbEoCFEhyBrCtXS9L+so9oTy8wGqxbQDD350WTjNESVFEB5hdKzUGcV5QtYxVWR2Ssl4Mg9qI9u6FCBInJRXgfEEgtS9Cgrg7kKouq4mdcDNBnEHQvWFTdgdgsqP+MiluVeBM13ahx09AYSWi50gsF+I6vn7BmCEoHR3NBzkpIOw4+XdVBBGQUioblaZHbGlodtB+N/jxqwLX/x/NARfD8ADxTOCKIcwE4Lw0OIbguMYcGTlymEpHYLXIKx8zQEqIfS2lGJPaADFEBR/PMH79ErqtpnZmTBlvM4wgihPWDEEhXn1LISj50crNgfCp+dWHYQRCfb2zgfnBZmKGAyi914anK9Coi4LOMhoAn3uVtn+AGnLKxPUZnCuAAAAAElFTkSuQmCC";
  const img = Buffer.from(imgdata, "base64");

  var favicon = (method, tokens, query, body) => {
    console.log("serving favicon...");
    const headers = {
      "Content-Type": "image/png",
      "Content-Length": img.length,
    };
    let result = img;

    return {
      headers,
      result,
    };
  };

  var require$$0 =
    '<!DOCTYPE html>\r\n<html lang="en">\r\n<head>\r\n    <meta charset="UTF-8">\r\n    <meta http-equiv="X-UA-Compatible" content="IE=edge">\r\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\r\n    <title>SUPS Admin Panel</title>\r\n    <style>\r\n        * {\r\n            padding: 0;\r\n            margin: 0;\r\n        }\r\n\r\n        body {\r\n            padding: 32px;\r\n            font-size: 16px;\r\n        }\r\n\r\n        .layout::after {\r\n            content: \'\';\r\n            clear: both;\r\n            display: table;\r\n        }\r\n\r\n        .col {\r\n            display: block;\r\n            float: left;\r\n        }\r\n\r\n        p {\r\n            padding: 8px 16px;\r\n        }\r\n\r\n        table {\r\n            border-collapse: collapse;\r\n        }\r\n\r\n        caption {\r\n            font-size: 120%;\r\n            text-align: left;\r\n            padding: 4px 8px;\r\n            font-weight: bold;\r\n            background-color: #ddd;\r\n        }\r\n\r\n        table, tr, th, td {\r\n            border: 1px solid #ddd;\r\n        }\r\n\r\n        th, td {\r\n            padding: 4px 8px;\r\n        }\r\n\r\n        ul {\r\n            list-style: none;\r\n        }\r\n\r\n        .collection-list a {\r\n            display: block;\r\n            width: 120px;\r\n            padding: 4px 8px;\r\n            text-decoration: none;\r\n            color: black;\r\n            background-color: #ccc;\r\n        }\r\n        .collection-list a:hover {\r\n            background-color: #ddd;\r\n        }\r\n        .collection-list a:visited {\r\n            color: black;\r\n        }\r\n    </style>\r\n    <script type="module">\nimport { html, render } from \'https://unpkg.com/lit-html?module\';\nimport { until } from \'https://unpkg.com/lit-html/directives/until?module\';\n\nconst api = {\r\n    async get(url) {\r\n        return json(url);\r\n    },\r\n    async post(url, body) {\r\n        return json(url, {\r\n            method: \'POST\',\r\n            headers: { \'Content-Type\': \'application/json\' },\r\n            body: JSON.stringify(body)\r\n        });\r\n    }\r\n};\r\n\r\nasync function json(url, options) {\r\n    return await (await fetch(\'/\' + url, options)).json();\r\n}\r\n\r\nasync function getCollections() {\r\n    return api.get(\'data\');\r\n}\r\n\r\nasync function getRecords(collection) {\r\n    return api.get(\'data/\' + collection);\r\n}\r\n\r\nasync function getThrottling() {\r\n    return api.get(\'util/throttle\');\r\n}\r\n\r\nasync function setThrottling(throttle) {\r\n    return api.post(\'util\', { throttle });\r\n}\n\nasync function collectionList(onSelect) {\r\n    const collections = await getCollections();\r\n\r\n    return html`\r\n    <ul class="collection-list">\r\n        ${collections.map(collectionLi)}\r\n    </ul>`;\r\n\r\n    function collectionLi(name) {\r\n        return html`<li><a href="javascript:void(0)" @click=${(ev) => onSelect(ev, name)}>${name}</a></li>`;\r\n    }\r\n}\n\nasync function recordTable(collectionName) {\r\n    const records = await getRecords(collectionName);\r\n    const layout = getLayout(records);\r\n\r\n    return html`\r\n    <table>\r\n        <caption>${collectionName}</caption>\r\n        <thead>\r\n            <tr>${layout.map(f => html`<th>${f}</th>`)}</tr>\r\n        </thead>\r\n        <tbody>\r\n            ${records.map(r => recordRow(r, layout))}\r\n        </tbody>\r\n    </table>`;\r\n}\r\n\r\nfunction getLayout(records) {\r\n    const result = new Set([\'_id\']);\r\n    records.forEach(r => Object.keys(r).forEach(k => result.add(k)));\r\n\r\n    return [...result.keys()];\r\n}\r\n\r\nfunction recordRow(record, layout) {\r\n    return html`\r\n    <tr>\r\n        ${layout.map(f => html`<td>${JSON.stringify(record[f]) || html`<span>(missing)</span>`}</td>`)}\r\n    </tr>`;\r\n}\n\nasync function throttlePanel(display) {\r\n    const active = await getThrottling();\r\n\r\n    return html`\r\n    <p>\r\n        Request throttling: </span>${active}</span>\r\n        <button @click=${(ev) => set(ev, true)}>Enable</button>\r\n        <button @click=${(ev) => set(ev, false)}>Disable</button>\r\n    </p>`;\r\n\r\n    async function set(ev, state) {\r\n        ev.target.disabled = true;\r\n        await setThrottling(state);\r\n        display();\r\n    }\r\n}\n\n//import page from \'//unpkg.com/page/page.mjs\';\r\n\r\n\r\nfunction start() {\r\n    const main = document.querySelector(\'main\');\r\n    editor(main);\r\n}\r\n\r\nasync function editor(main) {\r\n    let list = html`<div class="col">Loading&hellip;</div>`;\r\n    let viewer = html`<div class="col">\r\n    <p>Select collection to view records</p>\r\n</div>`;\r\n    display();\r\n\r\n    list = html`<div class="col">${await collectionList(onSelect)}</div>`;\r\n    display();\r\n\r\n    async function display() {\r\n        render(html`\r\n        <section class="layout">\r\n            ${until(throttlePanel(display), html`<p>Loading</p>`)}\r\n        </section>\r\n        <section class="layout">\r\n            ${list}\r\n            ${viewer}\r\n        </section>`, main);\r\n    }\r\n\r\n    async function onSelect(ev, name) {\r\n        ev.preventDefault();\r\n        viewer = html`<div class="col">${await recordTable(name)}</div>`;\r\n        display();\r\n    }\r\n}\r\n\r\nstart();\n\n</script>\r\n</head>\r\n<body>\r\n    <main>\r\n        Loading&hellip;\r\n    </main>\r\n</body>\r\n</html>';

  const mode = process.argv[2] == "-dev" ? "dev" : "prod";

  const files = {
    index:
      mode == "prod"
        ? require$$0
        : fs__default["default"].readFileSync("./client/index.html", "utf-8"),
  };

  var admin = (method, tokens, query, body) => {
    const headers = {
      "Content-Type": "text/html",
    };
    let result = "";

    const resource = tokens.join("/");
    if (resource && resource.split(".").pop() == "js") {
      headers["Content-Type"] = "application/javascript";

      files[resource] =
        files[resource] ||
        fs__default["default"].readFileSync("./client/" + resource, "utf-8");
      result = files[resource];
    } else {
      result = files.index;
    }

    return {
      headers,
      result,
    };
  };

  /*
   * This service requires util plugin
   */

  const utilService = new Service_1();

  utilService.post("*", onRequest);
  utilService.get(":service", getStatus);

  function getStatus(context, tokens, query, body) {
    return context.util[context.params.service];
  }

  function onRequest(context, tokens, query, body) {
    Object.entries(body).forEach(([k, v]) => {
      console.log(`${k} ${v ? "enabled" : "disabled"}`);
      context.util[k] = v;
    });
    return "";
  }

  var util$1 = utilService.parseRequest;

  var services = {
    jsonstore,
    users,
    data: data$1,
    favicon,
    admin,
    util: util$1,
  };

  const { uuid: uuid$2 } = util;

  function initPlugin(settings) {
    const storage = createInstance(settings.seedData);
    const protectedStorage = createInstance(settings.protectedData);

    return function decoreateContext(context, request) {
      context.storage = storage;
      context.protectedStorage = protectedStorage;
    };
  }

  /**
   * Create storage instance and populate with seed data
   * @param {Object=} seedData Associative array with data. Each property is an object with properties in format {key: value}
   */
  function createInstance(seedData = {}) {
    const collections = new Map();

    // Initialize seed data from file
    for (let collectionName in seedData) {
      if (seedData.hasOwnProperty(collectionName)) {
        const collection = new Map();
        for (let recordId in seedData[collectionName]) {
          if (seedData.hasOwnProperty(collectionName)) {
            collection.set(recordId, seedData[collectionName][recordId]);
          }
        }
        collections.set(collectionName, collection);
      }
    }

    // Manipulation

    /**
     * Get entry by ID or list of all entries from collection or list of all collections
     * @param {string=} collection Name of collection to access. Throws error if not found. If omitted, returns list of all collections.
     * @param {number|string=} id ID of requested entry. Throws error if not found. If omitted, returns of list all entries in collection.
     * @return {Object} Matching entry.
     */
    function get(collection, id) {
      if (!collection) {
        return [...collections.keys()];
      }
      if (!collections.has(collection)) {
        throw new ReferenceError("Collection does not exist: " + collection);
      }
      const targetCollection = collections.get(collection);
      if (!id) {
        const entries = [...targetCollection.entries()];
        let result = entries.map(([k, v]) => {
          return Object.assign(deepCopy(v), { _id: k });
        });
        return result;
      }
      if (!targetCollection.has(id)) {
        throw new ReferenceError("Entry does not exist: " + id);
      }
      const entry = targetCollection.get(id);
      return Object.assign(deepCopy(entry), { _id: id });
    }

    /**
     * Add new entry to collection. ID will be auto-generated
     * @param {string} collection Name of collection to access. If the collection does not exist, it will be created.
     * @param {Object} data Value to store.
     * @return {Object} Original value with resulting ID under _id property.
     */
    function add(collection, data) {
      const record = assignClean({ _ownerId: data._ownerId }, data);

      let targetCollection = collections.get(collection);
      if (!targetCollection) {
        targetCollection = new Map();
        collections.set(collection, targetCollection);
      }
      let id = uuid$2();
      // Make sure new ID does not match existing value
      while (targetCollection.has(id)) {
        id = uuid$2();
      }

      record._createdOn = Date.now();
      targetCollection.set(id, record);
      return Object.assign(deepCopy(record), { _id: id });
    }

    /**
     * Replace entry by ID
     * @param {string} collection Name of collection to access. Throws error if not found.
     * @param {number|string} id ID of entry to update. Throws error if not found.
     * @param {Object} data Value to store. Record will be replaced!
     * @return {Object} Updated entry.
     */
    function set(collection, id, data) {
      if (!collections.has(collection)) {
        throw new ReferenceError("Collection does not exist: " + collection);
      }
      const targetCollection = collections.get(collection);
      if (!targetCollection.has(id)) {
        throw new ReferenceError("Entry does not exist: " + id);
      }

      const existing = targetCollection.get(id);
      const record = assignSystemProps(deepCopy(data), existing);
      record._updatedOn = Date.now();
      targetCollection.set(id, record);
      return Object.assign(deepCopy(record), { _id: id });
    }

    /**
     * Modify entry by ID
     * @param {string} collection Name of collection to access. Throws error if not found.
     * @param {number|string} id ID of entry to update. Throws error if not found.
     * @param {Object} data Value to store. Shallow merge will be performed!
     * @return {Object} Updated entry.
     */
    function merge(collection, id, data) {
      if (!collections.has(collection)) {
        throw new ReferenceError("Collection does not exist: " + collection);
      }
      const targetCollection = collections.get(collection);
      if (!targetCollection.has(id)) {
        throw new ReferenceError("Entry does not exist: " + id);
      }

      const existing = deepCopy(targetCollection.get(id));
      const record = assignClean(existing, data);
      record._updatedOn = Date.now();
      targetCollection.set(id, record);
      return Object.assign(deepCopy(record), { _id: id });
    }

    /**
     * Delete entry by ID
     * @param {string} collection Name of collection to access. Throws error if not found.
     * @param {number|string} id ID of entry to update. Throws error if not found.
     * @return {{_deletedOn: number}} Server time of deletion.
     */
    function del(collection, id) {
      if (!collections.has(collection)) {
        throw new ReferenceError("Collection does not exist: " + collection);
      }
      const targetCollection = collections.get(collection);
      if (!targetCollection.has(id)) {
        throw new ReferenceError("Entry does not exist: " + id);
      }
      targetCollection.delete(id);

      return { _deletedOn: Date.now() };
    }

    /**
     * Search in collection by query object
     * @param {string} collection Name of collection to access. Throws error if not found.
     * @param {Object} query Query object. Format {prop: value}.
     * @return {Object[]} Array of matching entries.
     */
    function query(collection, query) {
      if (!collections.has(collection)) {
        throw new ReferenceError("Collection does not exist: " + collection);
      }
      const targetCollection = collections.get(collection);
      const result = [];
      // Iterate entries of target collection and compare each property with the given query
      for (let [key, entry] of [...targetCollection.entries()]) {
        let match = true;
        for (let prop in entry) {
          if (query.hasOwnProperty(prop)) {
            const targetValue = query[prop];
            // Perform lowercase search, if value is string
            if (
              typeof targetValue === "string" &&
              typeof entry[prop] === "string"
            ) {
              if (
                targetValue.toLocaleLowerCase() !==
                entry[prop].toLocaleLowerCase()
              ) {
                match = false;
                break;
              }
            } else if (targetValue != entry[prop]) {
              match = false;
              break;
            }
          }
        }

        if (match) {
          result.push(Object.assign(deepCopy(entry), { _id: key }));
        }
      }

      return result;
    }

    return { get, add, set, merge, delete: del, query };
  }

  function assignSystemProps(target, entry, ...rest) {
    const whitelist = ["_id", "_createdOn", "_updatedOn", "_ownerId"];
    for (let prop of whitelist) {
      if (entry.hasOwnProperty(prop)) {
        target[prop] = deepCopy(entry[prop]);
      }
    }
    if (rest.length > 0) {
      Object.assign(target, ...rest);
    }

    return target;
  }

  function assignClean(target, entry, ...rest) {
    const blacklist = ["_id", "_createdOn", "_updatedOn", "_ownerId"];
    for (let key in entry) {
      if (blacklist.includes(key) == false) {
        target[key] = deepCopy(entry[key]);
      }
    }
    if (rest.length > 0) {
      Object.assign(target, ...rest);
    }

    return target;
  }

  function deepCopy(value) {
    if (Array.isArray(value)) {
      return value.map(deepCopy);
    } else if (typeof value == "object") {
      return [...Object.entries(value)].reduce(
        (p, [k, v]) => Object.assign(p, { [k]: deepCopy(v) }),
        {}
      );
    } else {
      return value;
    }
  }

  var storage = initPlugin;

  const {
    ConflictError: ConflictError$1,
    CredentialError: CredentialError$1,
    RequestError: RequestError$2,
  } = errors;

  function initPlugin$1(settings) {
    const identity = settings.identity;

    return function decorateContext(context, request) {
      context.auth = {
        register,
        login,
        logout,
      };

      const userToken = request.headers["x-authorization"];
      if (userToken !== undefined) {
        let user;
        const session = findSessionByToken(userToken);
        if (session !== undefined) {
          const userData = context.protectedStorage.get(
            "users",
            session.userId
          );
          if (userData !== undefined) {
            console.log("Authorized as " + userData[identity]);
            user = userData;
          }
        }
        if (user !== undefined) {
          context.user = user;
        } else {
          throw new CredentialError$1("Invalid access token");
        }
      }

      function register(body) {
        if (
          body.hasOwnProperty(identity) === false ||
          body.hasOwnProperty("password") === false ||
          body[identity].length == 0 ||
          body.password.length == 0
        ) {
          throw new RequestError$2("Missing fields");
        } else if (
          context.protectedStorage.query("users", {
            [identity]: body[identity],
          }).length !== 0
        ) {
          throw new ConflictError$1(
            `A user with the same ${identity} already exists`
          );
        } else {
          const newUser = Object.assign({}, body, {
            [identity]: body[identity],
            hashedPassword: hash(body.password),
          });
          const result = context.protectedStorage.add("users", newUser);
          delete result.hashedPassword;

          const session = saveSession(result._id);
          result.accessToken = session.accessToken;

          return result;
        }
      }

      function login(body) {
        const targetUser = context.protectedStorage.query("users", {
          [identity]: body[identity],
        });
        if (targetUser.length == 1) {
          if (hash(body.password) === targetUser[0].hashedPassword) {
            const result = targetUser[0];
            delete result.hashedPassword;

            const session = saveSession(result._id);
            result.accessToken = session.accessToken;

            return result;
          } else {
            throw new CredentialError$1("Login or password don't match");
          }
        } else {
          throw new CredentialError$1("Login or password don't match");
        }
      }

      function logout() {
        if (context.user !== undefined) {
          const session = findSessionByUserId(context.user._id);
          if (session !== undefined) {
            context.protectedStorage.delete("sessions", session._id);
          }
        } else {
          throw new CredentialError$1("User session does not exist");
        }
      }

      function saveSession(userId) {
        let session = context.protectedStorage.add("sessions", { userId });
        const accessToken = hash(session._id);
        session = context.protectedStorage.set(
          "sessions",
          session._id,
          Object.assign({ accessToken }, session)
        );
        return session;
      }

      function findSessionByToken(userToken) {
        return context.protectedStorage.query("sessions", {
          accessToken: userToken,
        })[0];
      }

      function findSessionByUserId(userId) {
        return context.protectedStorage.query("sessions", { userId })[0];
      }
    };
  }

  const secret = "This is not a production server";

  function hash(string) {
    const hash = crypto__default["default"].createHmac("sha256", secret);
    hash.update(string);
    return hash.digest("hex");
  }

  var auth = initPlugin$1;

  function initPlugin$2(settings) {
    const util = {
      throttle: false,
    };

    return function decoreateContext(context, request) {
      context.util = util;
    };
  }

  var util$2 = initPlugin$2;

  /*
   * This plugin requires auth and storage plugins
   */

  const {
    RequestError: RequestError$3,
    ConflictError: ConflictError$2,
    CredentialError: CredentialError$2,
    AuthorizationError: AuthorizationError$2,
  } = errors;

  function initPlugin$3(settings) {
    const actions = {
      GET: ".read",
      POST: ".create",
      PUT: ".update",
      PATCH: ".update",
      DELETE: ".delete",
    };
    const rules = Object.assign(
      {
        "*": {
          ".create": ["User"],
          ".update": ["Owner"],
          ".delete": ["Owner"],
        },
      },
      settings.rules
    );

    return function decorateContext(context, request) {
      // special rules (evaluated at run-time)
      const get = (collectionName, id) => {
        return context.storage.get(collectionName, id);
      };
      const isOwner = (user, object) => {
        return user._id == object._ownerId;
      };
      context.rules = {
        get,
        isOwner,
      };
      const isAdmin = request.headers.hasOwnProperty("x-admin");

      context.canAccess = canAccess;

      function canAccess(data, newData) {
        const user = context.user;
        const action = actions[request.method];
        let { rule, propRules } = getRule(
          action,
          context.params.collection,
          data
        );

        if (Array.isArray(rule)) {
          rule = checkRoles(rule, data);
        } else if (typeof rule == "string") {
          rule = !!eval(rule);
        }
        if (!rule && !isAdmin) {
          throw new CredentialError$2();
        }
        propRules.map((r) => applyPropRule(action, r, user, data, newData));
      }

      function applyPropRule(action, [prop, rule], user, data, newData) {
        // NOTE: user needs to be in scope for eval to work on certain rules
        if (typeof rule == "string") {
          rule = !!eval(rule);
        }

        if (rule == false) {
          if (action == ".create" || action == ".update") {
            delete newData[prop];
          } else if (action == ".read") {
            delete data[prop];
          }
        }
      }

      function checkRoles(roles, data, newData) {
        if (roles.includes("Guest")) {
          return true;
        } else if (!context.user && !isAdmin) {
          throw new AuthorizationError$2();
        } else if (roles.includes("User")) {
          return true;
        } else if (context.user && roles.includes("Owner")) {
          return context.user._id == data._ownerId;
        } else {
          return false;
        }
      }
    };

    function getRule(action, collection, data = {}) {
      let currentRule = ruleOrDefault(true, rules["*"][action]);
      let propRules = [];

      // Top-level rules for the collection
      const collectionRules = rules[collection];
      if (collectionRules !== undefined) {
        // Top-level rule for the specific action for the collection
        currentRule = ruleOrDefault(currentRule, collectionRules[action]);

        // Prop rules
        const allPropRules = collectionRules["*"];
        if (allPropRules !== undefined) {
          propRules = ruleOrDefault(
            propRules,
            getPropRule(allPropRules, action)
          );
        }

        // Rules by record id
        const recordRules = collectionRules[data._id];
        if (recordRules !== undefined) {
          currentRule = ruleOrDefault(currentRule, recordRules[action]);
          propRules = ruleOrDefault(
            propRules,
            getPropRule(recordRules, action)
          );
        }
      }

      return {
        rule: currentRule,
        propRules,
      };
    }

    function ruleOrDefault(current, rule) {
      return rule === undefined || rule.length === 0 ? current : rule;
    }

    function getPropRule(record, action) {
      const props = Object.entries(record)
        .filter(([k]) => k[0] != ".")
        .filter(([k, v]) => v.hasOwnProperty(action))
        .map(([k, v]) => [k, v[action]]);

      return props;
    }
  }

  var rules = initPlugin$3;

  var identity = "email";
  var protectedData = {
    users: {
      "35c62d76-8152-4626-8712-eeb96381bea8": {
        email: "peter@abv.bg",
        hashedPassword:
          "83313014ed3e2391aa1332615d2f053cf5c1bfe05ca1cbcb5582443822df6eb1",
      },
      "847ec027-f659-4086-8032-5173e2f9c93a": {
        email: "john@abv.bg",
        hashedPassword:
          "83313014ed3e2391aa1332615d2f053cf5c1bfe05ca1cbcb5582443822df6eb1",
      },
    },
    sessions: {},
  };
  var seedData = {
    offers: {
      "1840a313-225c-416a-817a-9954d4609f7c": {
        _ownerId: "35c62d76-8152-4626-8712-eeb96381bea8",
        title: "Senior Frontend Software Engineer",
        imageUrl: "data:image/jpeg;base64,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",
        category: "IT, Developer, WEB",
        description:
          "We are looking for programmers with a keen eye for design for the position of front end developer. Front end developers are responsible for ensuring the alignment of web design and user experience requirements, optimizing web pages for maximum efficiency, and maintaining brand consistency across all web pages, among other duties.",
        requirements:
          "Degree in computer science or related field. Understanding of key design principles. Proficiency in HTML, CSS, JavaScript. Experience with responsive and adaptive design. Good problem-solving skills. Excellent verbal communication skills. Good interpersonal skills.",
        salary: "7000",
        _createdOn: 1617194210928,
      },
      "126777f5-3277-42ad-b874-76d043b069cb": {
        _ownerId: "847ec027-f659-4086-8032-5173e2f9c93a",
        title: "Sales Manager",
        imageUrl: "data:image/jpeg;base64,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",
        category: "Sales, Administration, Analyze",
        description:
          "A sales manager is someone who is responsible for leading and guiding a team of sales people in an organization. They set sales goals & quotas, build a sales plan, analyze data, assign sales training and sales territories, mentor the members of his/her sales team and are involved in the hiring and firing process.",
        requirements:
          "Managing organizational sales by developing a business plan that covers sales, revenue, and expense controls. Meeting planned sales goals. Setting individual sales targets with the sales team. Tracking sales goals and reporting results as necessary. Overseeing the activities and performance of the sales team.",
        salary: "1900",
        _createdOn: 1617194295474,
      },
      "136777f5-3277-42ad-b874-76d043b069cb": {
        _ownerId: "847ec027-f659-4086-8032-5173e2f9c93a",
        title: "Invoice Administrator",
        imageUrl: "data:image/jpeg;base64,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",
        category: "Finance, Administration, Data Capture",
        description:
          "The manager will oversee quality assurance, quality control, and customer service regarding the invoicing process; ensure adherence to proper invoicing procedures; and interpret and clarify invoicing policies. We are looking for individuals who have a passion for making a difference in the lives of people around the world.",
        requirements:
          "Experience with SQL-based accounting software and demonstrated ability to learn and operate new systems in a short period. Experience with accounts payable, general ledger, and client invoicing. Experience with accounting software; Solomon IV experience preferred. Ability to solve technical, managerial, or operational problems and evaluate options based on relevant information, resources, well-rounded experience, and knowledge.",
        salary: "1700",
        _createdOn: 1617194295480,
      },
    },
    applications: {},
  };
  var rules$1 = {
    users: {
      ".create": false,
      ".read": ["Owner"],
      ".update": false,
      ".delete": false,
    },
  };
  var settings = {
    identity: identity,
    protectedData: protectedData,
    seedData: seedData,
    rules: rules$1,
  };

  const plugins = [
    storage(settings),
    auth(settings),
    util$2(),
    rules(settings),
  ];

  const server = http__default["default"].createServer(
    requestHandler(plugins, services)
  );

  const port = 3030;
  server.listen(port);
  console.log(
    `Server started on port ${port}. You can make requests to http://localhost:${port}/`
  );
  console.log(`Admin panel located at http://localhost:${port}/admin`);

  var softuniPracticeServer = {};

  return softuniPracticeServer;
});
