'use strict';

var solidJs = require('solid-js');
var seroval = require('seroval');

const booleans = ["allowfullscreen", "async", "autofocus", "autoplay", "checked", "controls", "default", "disabled", "formnovalidate", "hidden", "indeterminate", "inert", "ismap", "loop", "multiple", "muted", "nomodule", "novalidate", "open", "playsinline", "readonly", "required", "reversed", "seamless", "selected"];
const BooleanAttributes = /*#__PURE__*/new Set(booleans);
const ChildProperties = /*#__PURE__*/new Set(["innerHTML", "textContent", "innerText", "children"]);
const Aliases = /*#__PURE__*/Object.assign(Object.create(null), {
  className: "class",
  htmlFor: "for"
});

const ES2017FLAG = seroval.Feature.AggregateError
| seroval.Feature.BigInt
| seroval.Feature.BigIntTypedArray;
const GLOBAL_IDENTIFIER = '_$HY.r';
function createSerializer({
  onData,
  onDone,
  scopeId,
  onError
}) {
  return new seroval.Serializer({
    scopeId,
    globalIdentifier: GLOBAL_IDENTIFIER,
    disabledFeatures: ES2017FLAG,
    onData,
    onDone,
    onError
  });
}
function getLocalHeaderScript(id) {
  return seroval.getCrossReferenceHeader(id) + ';';
}

const VOID_ELEMENTS = /^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i;
const REPLACE_SCRIPT = `function $df(e,n,o,t){if(n=document.getElementById(e),o=document.getElementById("pl-"+e)){for(;o&&8!==o.nodeType&&o.nodeValue!=="pl-"+e;)t=o.nextSibling,o.remove(),o=t;_$HY.done?o.remove():o.replaceWith(n.content)}n.remove(),_$HY.fe(e)}`;
function renderToString(code, options = {}) {
  const {
    renderId
  } = options;
  let scripts = "";
  const serializer = createSerializer({
    scopeId: renderId,
    onData(script) {
      if (!scripts) {
        scripts = getLocalHeaderScript(renderId);
      }
      scripts += script;
    },
    onError: options.onError
  });
  solidJs.sharedConfig.context = {
    id: renderId || "",
    count: 0,
    suspense: {},
    lazy: {},
    assets: [],
    nonce: options.nonce,
    serialize(id, p) {
      !solidJs.sharedConfig.context.noHydrate && serializer.write(id, p);
    },
    roots: 0,
    nextRoot() {
      return this.renderId + "i-" + this.roots++;
    }
  };
  let html = solidJs.createRoot(d => {
    setTimeout(d);
    return resolveSSRNode(escape(code()));
  });
  solidJs.sharedConfig.context.noHydrate = true;
  serializer.close();
  html = injectAssets(solidJs.sharedConfig.context.assets, html);
  if (scripts.length) html = injectScripts(html, scripts, options.nonce);
  return html;
}
function renderToStringAsync(code, options = {}) {
  const {
    timeoutMs = 30000
  } = options;
  let timeoutHandle;
  const timeout = new Promise((_, reject) => {
    timeoutHandle = setTimeout(() => reject("renderToString timed out"), timeoutMs);
  });
  return Promise.race([renderToStream(code, options), timeout]).then(html => {
    clearTimeout(timeoutHandle);
    return html;
  });
}
function renderToStream(code, options = {}) {
  let {
    nonce,
    onCompleteShell,
    onCompleteAll,
    renderId,
    noScripts
  } = options;
  let dispose;
  const blockingPromises = [];
  const pushTask = task => {
    if (noScripts) return;
    if (!tasks && !firstFlushed) {
      tasks = getLocalHeaderScript(renderId);
    }
    tasks += task + ";";
    if (!timer && firstFlushed) {
      timer = setTimeout(writeTasks);
    }
  };
  const checkEnd = () => {
    if (!registry.size && !completed) {
      writeTasks();
      onCompleteAll && onCompleteAll({
        write(v) {
          !completed && buffer.write(v);
        }
      });
      writable && writable.end();
      completed = true;
      setTimeout(dispose);
    }
  };
  const serializer = createSerializer({
    scopeId: options.renderId,
    onData: pushTask,
    onDone: checkEnd,
    onError: options.onError
  });
  const flushEnd = () => {
    if (!registry.size) {
      serializer.flush();
    }
  };
  const registry = new Map();
  const writeTasks = () => {
    if (tasks.length && !completed && firstFlushed) {
      buffer.write(`<script${nonce ? ` nonce="${nonce}"` : ""}>${tasks}</script>`);
      tasks = "";
    }
    timer && clearTimeout(timer);
    timer = null;
  };
  let context;
  let writable;
  let tmp = "";
  let tasks = "";
  let firstFlushed = false;
  let completed = false;
  let scriptFlushed = false;
  let timer = null;
  let buffer = {
    write(payload) {
      tmp += payload;
    }
  };
  solidJs.sharedConfig.context = context = {
    id: renderId || "",
    count: 0,
    async: true,
    resources: {},
    lazy: {},
    suspense: {},
    assets: [],
    nonce,
    block(p) {
      if (!firstFlushed) blockingPromises.push(p);
    },
    replace(id, payloadFn) {
      if (firstFlushed) return;
      const placeholder = `<!--!$${id}-->`;
      const first = html.indexOf(placeholder);
      if (first === -1) return;
      const last = html.indexOf(`<!--!$/${id}-->`, first + placeholder.length);
      html = html.replace(html.slice(first, last + placeholder.length + 1), resolveSSRNode(payloadFn()));
    },
    serialize(id, p, wait) {
      const serverOnly = solidJs.sharedConfig.context.noHydrate;
      if (!firstFlushed && wait && typeof p === "object" && "then" in p) {
        blockingPromises.push(p);
        !serverOnly && p.then(d => {
          serializer.write(id, d);
        }).catch(e => {
          serializer.write(id, e);
        });
      } else if (!serverOnly) serializer.write(id, p);
    },
    roots: 0,
    nextRoot() {
      return this.renderId + "i-" + this.roots++;
    },
    registerFragment(key) {
      if (!registry.has(key)) {
        let resolve, reject;
        const p = new Promise((r, rej) => (resolve = r, reject = rej));
        registry.set(key, {
          resolve: v => queue(() => queue(() => resolve(v))),
          reject: e => queue(() => queue(() => reject(e)))
        });
        serializer.write(key, p);
      }
      return (value, error) => {
        if (registry.has(key)) {
          const {
            resolve,
            reject
          } = registry.get(key);
          registry.delete(key);
          if (waitForFragments(registry, key)) {
            resolve(true);
            return;
          }
          if ((value !== undefined || error) && !completed) {
            if (!firstFlushed) {
              queue(() => html = replacePlaceholder(html, key, value !== undefined ? value : ""));
              error ? reject(error) : resolve(true);
            } else {
              buffer.write(`<template id="${key}">${value !== undefined ? value : " "}</template>`);
              pushTask(`$df("${key}")${!scriptFlushed ? ";" + REPLACE_SCRIPT : ""}`);
              error ? reject(error) : resolve(true);
              scriptFlushed = true;
            }
          }
        }
        if (!registry.size) queue(flushEnd);
        return firstFlushed;
      };
    }
  };
  let html = solidJs.createRoot(d => {
    dispose = d;
    return resolveSSRNode(escape(code()));
  });
  function doShell() {
    solidJs.sharedConfig.context = context;
    context.noHydrate = true;
    html = injectAssets(context.assets, html);
    if (tasks.length) html = injectScripts(html, tasks, nonce);
    buffer.write(html);
    tasks = "";
    onCompleteShell && onCompleteShell({
      write(v) {
        !completed && buffer.write(v);
      }
    });
  }
  return {
    then(fn) {
      function complete() {
        doShell();
        fn(tmp);
      }
      if (onCompleteAll) {
        let ogComplete = onCompleteAll;
        onCompleteAll = options => {
          ogComplete(options);
          complete();
        };
      } else onCompleteAll = complete;
      if (!registry.size) queue(flushEnd);
    },
    pipe(w) {
      allSettled(blockingPromises).then(() => {
        doShell();
        buffer = writable = w;
        buffer.write(tmp);
        firstFlushed = true;
        if (completed) writable.end();else setTimeout(flushEnd);
      });
    },
    pipeTo(w) {
      return allSettled(blockingPromises).then(() => {
        doShell();
        const encoder = new TextEncoder();
        const writer = w.getWriter();
        let resolve;
        const p = new Promise(r => resolve = r);
        writable = {
          end() {
            writer.releaseLock();
            w.close();
            resolve();
          }
        };
        buffer = {
          write(payload) {
            writer.write(encoder.encode(payload));
          }
        };
        buffer.write(tmp);
        firstFlushed = true;
        if (completed) writable.end();else setTimeout(flushEnd);
        return p;
      });
    }
  };
}
function HydrationScript(props) {
  const {
    nonce
  } = solidJs.sharedConfig.context;
  return ssr(generateHydrationScript({
    nonce,
    ...props
  }));
}
function ssr(t, ...nodes) {
  if (nodes.length) {
    let result = "";
    for (let i = 0; i < nodes.length; i++) {
      result += t[i];
      const node = nodes[i];
      if (node !== undefined) result += resolveSSRNode(node);
    }
    t = result + t[nodes.length];
  }
  return {
    t
  };
}
function ssrClassList(value) {
  if (!value) return "";
  let classKeys = Object.keys(value),
    result = "";
  for (let i = 0, len = classKeys.length; i < len; i++) {
    const key = classKeys[i],
      classValue = !!value[key];
    if (!key || key === "undefined" || !classValue) continue;
    i && (result += " ");
    result += escape(key);
  }
  return result;
}
function ssrStyle(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  let result = "";
  const k = Object.keys(value);
  for (let i = 0; i < k.length; i++) {
    const s = k[i];
    const v = value[s];
    if (v != undefined) {
      if (i) result += ";";
      result += `${s}:${escape(v, true)}`;
    }
  }
  return result;
}
function ssrElement(tag, props, children, needsId) {
  if (props == null) props = {};else if (typeof props === "function") props = props();
  const skipChildren = VOID_ELEMENTS.test(tag);
  const keys = Object.keys(props);
  let result = `<${tag}${needsId ? ssrHydrationKey() : ""} `;
  let classResolved;
  for (let i = 0; i < keys.length; i++) {
    const prop = keys[i];
    if (ChildProperties.has(prop)) {
      if (children === undefined && !skipChildren) children = prop === "innerHTML" ? props[prop] : escape(props[prop]);
      continue;
    }
    const value = props[prop];
    if (prop === "style") {
      result += `style="${ssrStyle(value)}"`;
    } else if (prop === "class" || prop === "className" || prop === "classList") {
      if (classResolved) continue;
      let n;
      result += `class="${escape(((n = props.class) ? n + " " : "") + ((n = props.className) ? n + " " : ""), true) + ssrClassList(props.classList)}"`;
      classResolved = true;
    } else if (BooleanAttributes.has(prop)) {
      if (value) result += prop;else continue;
    } else if (value == undefined || prop === "ref" || prop.slice(0, 2) === "on") {
      continue;
    } else {
      result += `${Aliases[prop] || prop}="${escape(value, true)}"`;
    }
    if (i !== keys.length - 1) result += " ";
  }
  if (skipChildren) return {
    t: result + "/>"
  };
  if (typeof children === "function") children = children();
  return {
    t: result + `>${resolveSSRNode(children, true)}</${tag}>`
  };
}
function ssrAttribute(key, value, isBoolean) {
  return isBoolean ? value ? " " + key : "" : value != null ? ` ${key}="${value}"` : "";
}
function ssrHydrationKey() {
  const hk = getHydrationKey();
  return hk ? ` data-hk="${hk}"` : "";
}
function escape(s, attr) {
  const t = typeof s;
  if (t !== "string") {
    if (!attr && t === "function") return escape(s());
    if (!attr && Array.isArray(s)) {
      for (let i = 0; i < s.length; i++) s[i] = escape(s[i]);
      return s;
    }
    if (attr && t === "boolean") return String(s);
    return s;
  }
  const delim = attr ? '"' : "<";
  const escDelim = attr ? "&quot;" : "&lt;";
  let iDelim = s.indexOf(delim);
  let iAmp = s.indexOf("&");
  if (iDelim < 0 && iAmp < 0) return s;
  let left = 0,
    out = "";
  while (iDelim >= 0 && iAmp >= 0) {
    if (iDelim < iAmp) {
      if (left < iDelim) out += s.substring(left, iDelim);
      out += escDelim;
      left = iDelim + 1;
      iDelim = s.indexOf(delim, left);
    } else {
      if (left < iAmp) out += s.substring(left, iAmp);
      out += "&amp;";
      left = iAmp + 1;
      iAmp = s.indexOf("&", left);
    }
  }
  if (iDelim >= 0) {
    do {
      if (left < iDelim) out += s.substring(left, iDelim);
      out += escDelim;
      left = iDelim + 1;
      iDelim = s.indexOf(delim, left);
    } while (iDelim >= 0);
  } else while (iAmp >= 0) {
    if (left < iAmp) out += s.substring(left, iAmp);
    out += "&amp;";
    left = iAmp + 1;
    iAmp = s.indexOf("&", left);
  }
  return left < s.length ? out + s.substring(left) : out;
}
function resolveSSRNode(node, top) {
  const t = typeof node;
  if (t === "string") return node;
  if (node == null || t === "boolean") return "";
  if (Array.isArray(node)) {
    let prev = {};
    let mapped = "";
    for (let i = 0, len = node.length; i < len; i++) {
      if (!top && typeof prev !== "object" && typeof node[i] !== "object") mapped += `<!--!$-->`;
      mapped += resolveSSRNode(prev = node[i]);
    }
    return mapped;
  }
  if (t === "object") return node.t;
  if (t === "function") return resolveSSRNode(node());
  return String(node);
}
function getHydrationKey() {
  const hydrate = solidJs.sharedConfig.context;
  return hydrate && !hydrate.noHydrate && `${hydrate.id}${hydrate.count++}`;
}
function useAssets(fn) {
  solidJs.sharedConfig.context.assets.push(() => resolveSSRNode(fn()));
}
function getAssets() {
  const assets = solidJs.sharedConfig.context.assets;
  let out = "";
  for (let i = 0, len = assets.length; i < len; i++) out += assets[i]();
  return out;
}
function generateHydrationScript({
  eventNames = ["click", "input"],
  nonce
} = {}) {
  return `<script${nonce ? ` nonce="${nonce}"` : ""}>window._$HY||(e=>{let t=e=>e&&e.hasAttribute&&(e.hasAttribute("data-hk")?e:t(e.host&&e.host.nodeType?e.host:e.parentNode));["${eventNames.join('", "')}"].forEach((o=>document.addEventListener(o,(o=>{let a=o.composedPath&&o.composedPath()[0]||o.target,s=t(a);s&&!e.completed.has(s)&&e.events.push([s,o])}))))})(_$HY={events:[],completed:new WeakSet,r:{},fe(){}});</script><!--xs-->`;
}
function Hydration(props) {
  if (!solidJs.sharedConfig.context.noHydrate) return props.children;
  const context = solidJs.sharedConfig.context;
  solidJs.sharedConfig.context = {
    ...context,
    count: 0,
    id: `${context.id}${context.count++}-`,
    noHydrate: false
  };
  const res = props.children;
  solidJs.sharedConfig.context = context;
  return res;
}
function NoHydration(props) {
  solidJs.sharedConfig.context.noHydrate = true;
  return props.children;
}
function queue(fn) {
  return Promise.resolve().then(fn);
}
function allSettled(promises) {
  let length = promises.length;
  return Promise.allSettled(promises).then(() => {
    if (promises.length !== length) return allSettled(promises);
    return;
  });
}
function injectAssets(assets, html) {
  if (!assets || !assets.length) return html;
  let out = "";
  for (let i = 0, len = assets.length; i < len; i++) out += assets[i]();
  return html.replace(`</head>`, out + `</head>`);
}
function injectScripts(html, scripts, nonce) {
  const tag = `<script${nonce ? ` nonce="${nonce}"` : ""}>${scripts}</script>`;
  const index = html.indexOf("<!--xs-->");
  if (index > -1) {
    return html.slice(0, index) + tag + html.slice(index);
  }
  return html + tag;
}
function waitForFragments(registry, key) {
  for (const k of [...registry.keys()].reverse()) {
    if (key.startsWith(k)) return true;
  }
  return false;
}
function replacePlaceholder(html, key, value) {
  const marker = `<template id="pl-${key}">`;
  const close = `<!--pl-${key}-->`;
  const first = html.indexOf(marker);
  if (first === -1) return html;
  const last = html.indexOf(close, first + marker.length);
  return html.slice(0, first) + value + html.slice(last + close.length);
}
const RequestContext = Symbol();
function getRequestEvent() {
  return globalThis[RequestContext] ? globalThis[RequestContext].getStore() : undefined;
}
function Assets(props) {
  useAssets(() => props.children);
}
function pipeToNodeWritable(code, writable, options = {}) {
  if (options.onReady) {
    options.onCompleteShell = ({
      write
    }) => {
      options.onReady({
        write,
        startWriting() {
          stream.pipe(writable);
        }
      });
    };
  }
  const stream = renderToStream(code, options);
  if (!options.onReady) stream.pipe(writable);
}
function pipeToWritable(code, writable, options = {}) {
  if (options.onReady) {
    options.onCompleteShell = ({
      write
    }) => {
      options.onReady({
        write,
        startWriting() {
          stream.pipeTo(writable);
        }
      });
    };
  }
  const stream = renderToStream(code, options);
  if (!options.onReady) stream.pipeTo(writable);
}
function ssrSpread(props, isSVG, skipChildren) {
  let result = "";
  if (props == null) return result;
  if (typeof props === "function") props = props();
  const keys = Object.keys(props);
  let classResolved;
  for (let i = 0; i < keys.length; i++) {
    let prop = keys[i];
    if (prop === "children") {
      !skipChildren && console.warn(`SSR currently does not support spread children.`);
      continue;
    }
    const value = props[prop];
    if (prop === "style") {
      result += `style="${ssrStyle(value)}"`;
    } else if (prop === "class" || prop === "className" || prop === "classList") {
      if (classResolved) continue;
      let n;
      result += `class="${(n = props.class) ? n + " " : ""}${(n = props.className) ? n + " " : ""}${ssrClassList(props.classList)}"`;
      classResolved = true;
    } else if (BooleanAttributes.has(prop)) {
      if (value) result += prop;else continue;
    } else if (value == undefined || prop === "ref" || prop.slice(0, 2) === "on" || prop.slice(0, 5) === "prop:") {
      continue;
    } else {
      if (prop.slice(0, 5) === "attr:") prop = prop.slice(5);
      result += `${Aliases[prop] || prop}="${escape(value, true)}"`;
    }
    if (i !== keys.length - 1) result += " ";
  }
  return result;
}

const isServer = true;
const isDev = false;
function render() {}
function hydrate() {}
function insert() {}
function spread() {}
function addEventListener() {}
function delegateEvents() {}
function Dynamic(props) {
  const [p, others] = solidJs.splitProps(props, ["component"]);
  const comp = p.component,
    t = typeof comp;
  if (comp) {
    if (t === "function") return comp(others);else if (t === "string") {
      return ssrElement(comp, others, undefined, true);
    }
  }
}
function Portal(props) {
  return "";
}

Object.defineProperty(exports, 'ErrorBoundary', {
  enumerable: true,
  get: function () { return solidJs.ErrorBoundary; }
});
Object.defineProperty(exports, 'For', {
  enumerable: true,
  get: function () { return solidJs.For; }
});
Object.defineProperty(exports, 'Index', {
  enumerable: true,
  get: function () { return solidJs.Index; }
});
Object.defineProperty(exports, 'Match', {
  enumerable: true,
  get: function () { return solidJs.Match; }
});
Object.defineProperty(exports, 'Show', {
  enumerable: true,
  get: function () { return solidJs.Show; }
});
Object.defineProperty(exports, 'Suspense', {
  enumerable: true,
  get: function () { return solidJs.Suspense; }
});
Object.defineProperty(exports, 'SuspenseList', {
  enumerable: true,
  get: function () { return solidJs.SuspenseList; }
});
Object.defineProperty(exports, 'Switch', {
  enumerable: true,
  get: function () { return solidJs.Switch; }
});
Object.defineProperty(exports, 'createComponent', {
  enumerable: true,
  get: function () { return solidJs.createComponent; }
});
Object.defineProperty(exports, 'mergeProps', {
  enumerable: true,
  get: function () { return solidJs.mergeProps; }
});
exports.Assets = Assets;
exports.Dynamic = Dynamic;
exports.Hydration = Hydration;
exports.HydrationScript = HydrationScript;
exports.NoHydration = NoHydration;
exports.Portal = Portal;
exports.RequestContext = RequestContext;
exports.addEventListener = addEventListener;
exports.delegateEvents = delegateEvents;
exports.escape = escape;
exports.generateHydrationScript = generateHydrationScript;
exports.getAssets = getAssets;
exports.getHydrationKey = getHydrationKey;
exports.getRequestEvent = getRequestEvent;
exports.hydrate = hydrate;
exports.insert = insert;
exports.isDev = isDev;
exports.isServer = isServer;
exports.pipeToNodeWritable = pipeToNodeWritable;
exports.pipeToWritable = pipeToWritable;
exports.render = render;
exports.renderToStream = renderToStream;
exports.renderToString = renderToString;
exports.renderToStringAsync = renderToStringAsync;
exports.resolveSSRNode = resolveSSRNode;
exports.spread = spread;
exports.ssr = ssr;
exports.ssrAttribute = ssrAttribute;
exports.ssrClassList = ssrClassList;
exports.ssrElement = ssrElement;
exports.ssrHydrationKey = ssrHydrationKey;
exports.ssrSpread = ssrSpread;
exports.ssrStyle = ssrStyle;
exports.useAssets = useAssets;
