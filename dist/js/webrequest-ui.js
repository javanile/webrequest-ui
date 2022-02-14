(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __reExport = (target, module, copyDefault, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
          __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
    }
    return target;
  };
  var __toESM = (module, isNodeMode) => {
    return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", !isNodeMode && module && module.__esModule ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
  };

  // node_modules/highlight.js/lib/core.js
  var require_core = __commonJS({
    "node_modules/highlight.js/lib/core.js"(exports, module) {
      var deepFreezeEs6 = { exports: {} };
      function deepFreeze(obj) {
        if (obj instanceof Map) {
          obj.clear = obj.delete = obj.set = function() {
            throw new Error("map is read-only");
          };
        } else if (obj instanceof Set) {
          obj.add = obj.clear = obj.delete = function() {
            throw new Error("set is read-only");
          };
        }
        Object.freeze(obj);
        Object.getOwnPropertyNames(obj).forEach(function(name) {
          var prop = obj[name];
          if (typeof prop == "object" && !Object.isFrozen(prop)) {
            deepFreeze(prop);
          }
        });
        return obj;
      }
      deepFreezeEs6.exports = deepFreeze;
      deepFreezeEs6.exports.default = deepFreeze;
      var deepFreeze$1 = deepFreezeEs6.exports;
      var Response = class {
        constructor(mode) {
          if (mode.data === void 0)
            mode.data = {};
          this.data = mode.data;
          this.isMatchIgnored = false;
        }
        ignoreMatch() {
          this.isMatchIgnored = true;
        }
      };
      function escapeHTML(value) {
        return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
      }
      function inherit$1(original, ...objects) {
        const result = /* @__PURE__ */ Object.create(null);
        for (const key in original) {
          result[key] = original[key];
        }
        objects.forEach(function(obj) {
          for (const key in obj) {
            result[key] = obj[key];
          }
        });
        return result;
      }
      var SPAN_CLOSE = "</span>";
      var emitsWrappingTags = (node) => {
        return !!node.kind;
      };
      var expandScopeName = (name, { prefix }) => {
        if (name.includes(".")) {
          const pieces = name.split(".");
          return [
            `${prefix}${pieces.shift()}`,
            ...pieces.map((x, i) => `${x}${"_".repeat(i + 1)}`)
          ].join(" ");
        }
        return `${prefix}${name}`;
      };
      var HTMLRenderer = class {
        constructor(parseTree, options) {
          this.buffer = "";
          this.classPrefix = options.classPrefix;
          parseTree.walk(this);
        }
        addText(text) {
          this.buffer += escapeHTML(text);
        }
        openNode(node) {
          if (!emitsWrappingTags(node))
            return;
          let scope = node.kind;
          if (node.sublanguage) {
            scope = `language-${scope}`;
          } else {
            scope = expandScopeName(scope, { prefix: this.classPrefix });
          }
          this.span(scope);
        }
        closeNode(node) {
          if (!emitsWrappingTags(node))
            return;
          this.buffer += SPAN_CLOSE;
        }
        value() {
          return this.buffer;
        }
        span(className) {
          this.buffer += `<span class="${className}">`;
        }
      };
      var TokenTree = class {
        constructor() {
          this.rootNode = { children: [] };
          this.stack = [this.rootNode];
        }
        get top() {
          return this.stack[this.stack.length - 1];
        }
        get root() {
          return this.rootNode;
        }
        add(node) {
          this.top.children.push(node);
        }
        openNode(kind) {
          const node = { kind, children: [] };
          this.add(node);
          this.stack.push(node);
        }
        closeNode() {
          if (this.stack.length > 1) {
            return this.stack.pop();
          }
          return void 0;
        }
        closeAllNodes() {
          while (this.closeNode())
            ;
        }
        toJSON() {
          return JSON.stringify(this.rootNode, null, 4);
        }
        walk(builder) {
          return this.constructor._walk(builder, this.rootNode);
        }
        static _walk(builder, node) {
          if (typeof node === "string") {
            builder.addText(node);
          } else if (node.children) {
            builder.openNode(node);
            node.children.forEach((child) => this._walk(builder, child));
            builder.closeNode(node);
          }
          return builder;
        }
        static _collapse(node) {
          if (typeof node === "string")
            return;
          if (!node.children)
            return;
          if (node.children.every((el) => typeof el === "string")) {
            node.children = [node.children.join("")];
          } else {
            node.children.forEach((child) => {
              TokenTree._collapse(child);
            });
          }
        }
      };
      var TokenTreeEmitter = class extends TokenTree {
        constructor(options) {
          super();
          this.options = options;
        }
        addKeyword(text, kind) {
          if (text === "") {
            return;
          }
          this.openNode(kind);
          this.addText(text);
          this.closeNode();
        }
        addText(text) {
          if (text === "") {
            return;
          }
          this.add(text);
        }
        addSublanguage(emitter, name) {
          const node = emitter.root;
          node.kind = name;
          node.sublanguage = true;
          this.add(node);
        }
        toHTML() {
          const renderer = new HTMLRenderer(this, this.options);
          return renderer.value();
        }
        finalize() {
          return true;
        }
      };
      function source(re) {
        if (!re)
          return null;
        if (typeof re === "string")
          return re;
        return re.source;
      }
      function lookahead(re) {
        return concat("(?=", re, ")");
      }
      function anyNumberOfTimes(re) {
        return concat("(?:", re, ")*");
      }
      function optional(re) {
        return concat("(?:", re, ")?");
      }
      function concat(...args) {
        const joined = args.map((x) => source(x)).join("");
        return joined;
      }
      function stripOptionsFromArgs(args) {
        const opts = args[args.length - 1];
        if (typeof opts === "object" && opts.constructor === Object) {
          args.splice(args.length - 1, 1);
          return opts;
        } else {
          return {};
        }
      }
      function either(...args) {
        const opts = stripOptionsFromArgs(args);
        const joined = "(" + (opts.capture ? "" : "?:") + args.map((x) => source(x)).join("|") + ")";
        return joined;
      }
      function countMatchGroups(re) {
        return new RegExp(re.toString() + "|").exec("").length - 1;
      }
      function startsWith(re, lexeme) {
        const match = re && re.exec(lexeme);
        return match && match.index === 0;
      }
      var BACKREF_RE = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
      function _rewriteBackreferences(regexps, { joinWith }) {
        let numCaptures = 0;
        return regexps.map((regex) => {
          numCaptures += 1;
          const offset = numCaptures;
          let re = source(regex);
          let out = "";
          while (re.length > 0) {
            const match = BACKREF_RE.exec(re);
            if (!match) {
              out += re;
              break;
            }
            out += re.substring(0, match.index);
            re = re.substring(match.index + match[0].length);
            if (match[0][0] === "\\" && match[1]) {
              out += "\\" + String(Number(match[1]) + offset);
            } else {
              out += match[0];
              if (match[0] === "(") {
                numCaptures++;
              }
            }
          }
          return out;
        }).map((re) => `(${re})`).join(joinWith);
      }
      var MATCH_NOTHING_RE = /\b\B/;
      var IDENT_RE = "[a-zA-Z]\\w*";
      var UNDERSCORE_IDENT_RE = "[a-zA-Z_]\\w*";
      var NUMBER_RE = "\\b\\d+(\\.\\d+)?";
      var C_NUMBER_RE = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)";
      var BINARY_NUMBER_RE = "\\b(0b[01]+)";
      var RE_STARTERS_RE = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~";
      var SHEBANG = (opts = {}) => {
        const beginShebang = /^#![ ]*\//;
        if (opts.binary) {
          opts.begin = concat(beginShebang, /.*\b/, opts.binary, /\b.*/);
        }
        return inherit$1({
          scope: "meta",
          begin: beginShebang,
          end: /$/,
          relevance: 0,
          "on:begin": (m, resp) => {
            if (m.index !== 0)
              resp.ignoreMatch();
          }
        }, opts);
      };
      var BACKSLASH_ESCAPE = {
        begin: "\\\\[\\s\\S]",
        relevance: 0
      };
      var APOS_STRING_MODE = {
        scope: "string",
        begin: "'",
        end: "'",
        illegal: "\\n",
        contains: [BACKSLASH_ESCAPE]
      };
      var QUOTE_STRING_MODE = {
        scope: "string",
        begin: '"',
        end: '"',
        illegal: "\\n",
        contains: [BACKSLASH_ESCAPE]
      };
      var PHRASAL_WORDS_MODE = {
        begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
      };
      var COMMENT = function(begin, end, modeOptions = {}) {
        const mode = inherit$1({
          scope: "comment",
          begin,
          end,
          contains: []
        }, modeOptions);
        mode.contains.push({
          scope: "doctag",
          begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
          end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
          excludeBegin: true,
          relevance: 0
        });
        const ENGLISH_WORD = either("I", "a", "is", "so", "us", "to", "at", "if", "in", "it", "on", /[A-Za-z]+['](d|ve|re|ll|t|s|n)/, /[A-Za-z]+[-][a-z]+/, /[A-Za-z][a-z]{2,}/);
        mode.contains.push({
          begin: concat(/[ ]+/, "(", ENGLISH_WORD, /[.]?[:]?([.][ ]|[ ])/, "){3}")
        });
        return mode;
      };
      var C_LINE_COMMENT_MODE = COMMENT("//", "$");
      var C_BLOCK_COMMENT_MODE = COMMENT("/\\*", "\\*/");
      var HASH_COMMENT_MODE = COMMENT("#", "$");
      var NUMBER_MODE = {
        scope: "number",
        begin: NUMBER_RE,
        relevance: 0
      };
      var C_NUMBER_MODE = {
        scope: "number",
        begin: C_NUMBER_RE,
        relevance: 0
      };
      var BINARY_NUMBER_MODE = {
        scope: "number",
        begin: BINARY_NUMBER_RE,
        relevance: 0
      };
      var REGEXP_MODE = {
        begin: /(?=\/[^/\n]*\/)/,
        contains: [{
          scope: "regexp",
          begin: /\//,
          end: /\/[gimuy]*/,
          illegal: /\n/,
          contains: [
            BACKSLASH_ESCAPE,
            {
              begin: /\[/,
              end: /\]/,
              relevance: 0,
              contains: [BACKSLASH_ESCAPE]
            }
          ]
        }]
      };
      var TITLE_MODE = {
        scope: "title",
        begin: IDENT_RE,
        relevance: 0
      };
      var UNDERSCORE_TITLE_MODE = {
        scope: "title",
        begin: UNDERSCORE_IDENT_RE,
        relevance: 0
      };
      var METHOD_GUARD = {
        begin: "\\.\\s*" + UNDERSCORE_IDENT_RE,
        relevance: 0
      };
      var END_SAME_AS_BEGIN = function(mode) {
        return Object.assign(mode, {
          "on:begin": (m, resp) => {
            resp.data._beginMatch = m[1];
          },
          "on:end": (m, resp) => {
            if (resp.data._beginMatch !== m[1])
              resp.ignoreMatch();
          }
        });
      };
      var MODES = /* @__PURE__ */ Object.freeze({
        __proto__: null,
        MATCH_NOTHING_RE,
        IDENT_RE,
        UNDERSCORE_IDENT_RE,
        NUMBER_RE,
        C_NUMBER_RE,
        BINARY_NUMBER_RE,
        RE_STARTERS_RE,
        SHEBANG,
        BACKSLASH_ESCAPE,
        APOS_STRING_MODE,
        QUOTE_STRING_MODE,
        PHRASAL_WORDS_MODE,
        COMMENT,
        C_LINE_COMMENT_MODE,
        C_BLOCK_COMMENT_MODE,
        HASH_COMMENT_MODE,
        NUMBER_MODE,
        C_NUMBER_MODE,
        BINARY_NUMBER_MODE,
        REGEXP_MODE,
        TITLE_MODE,
        UNDERSCORE_TITLE_MODE,
        METHOD_GUARD,
        END_SAME_AS_BEGIN
      });
      function skipIfHasPrecedingDot(match, response) {
        const before = match.input[match.index - 1];
        if (before === ".") {
          response.ignoreMatch();
        }
      }
      function scopeClassName(mode, _parent) {
        if (mode.className !== void 0) {
          mode.scope = mode.className;
          delete mode.className;
        }
      }
      function beginKeywords(mode, parent) {
        if (!parent)
          return;
        if (!mode.beginKeywords)
          return;
        mode.begin = "\\b(" + mode.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)";
        mode.__beforeBegin = skipIfHasPrecedingDot;
        mode.keywords = mode.keywords || mode.beginKeywords;
        delete mode.beginKeywords;
        if (mode.relevance === void 0)
          mode.relevance = 0;
      }
      function compileIllegal(mode, _parent) {
        if (!Array.isArray(mode.illegal))
          return;
        mode.illegal = either(...mode.illegal);
      }
      function compileMatch(mode, _parent) {
        if (!mode.match)
          return;
        if (mode.begin || mode.end)
          throw new Error("begin & end are not supported with match");
        mode.begin = mode.match;
        delete mode.match;
      }
      function compileRelevance(mode, _parent) {
        if (mode.relevance === void 0)
          mode.relevance = 1;
      }
      var beforeMatchExt = (mode, parent) => {
        if (!mode.beforeMatch)
          return;
        if (mode.starts)
          throw new Error("beforeMatch cannot be used with starts");
        const originalMode = Object.assign({}, mode);
        Object.keys(mode).forEach((key) => {
          delete mode[key];
        });
        mode.keywords = originalMode.keywords;
        mode.begin = concat(originalMode.beforeMatch, lookahead(originalMode.begin));
        mode.starts = {
          relevance: 0,
          contains: [
            Object.assign(originalMode, { endsParent: true })
          ]
        };
        mode.relevance = 0;
        delete originalMode.beforeMatch;
      };
      var COMMON_KEYWORDS = [
        "of",
        "and",
        "for",
        "in",
        "not",
        "or",
        "if",
        "then",
        "parent",
        "list",
        "value"
      ];
      var DEFAULT_KEYWORD_SCOPE = "keyword";
      function compileKeywords(rawKeywords, caseInsensitive, scopeName = DEFAULT_KEYWORD_SCOPE) {
        const compiledKeywords = /* @__PURE__ */ Object.create(null);
        if (typeof rawKeywords === "string") {
          compileList(scopeName, rawKeywords.split(" "));
        } else if (Array.isArray(rawKeywords)) {
          compileList(scopeName, rawKeywords);
        } else {
          Object.keys(rawKeywords).forEach(function(scopeName2) {
            Object.assign(compiledKeywords, compileKeywords(rawKeywords[scopeName2], caseInsensitive, scopeName2));
          });
        }
        return compiledKeywords;
        function compileList(scopeName2, keywordList) {
          if (caseInsensitive) {
            keywordList = keywordList.map((x) => x.toLowerCase());
          }
          keywordList.forEach(function(keyword) {
            const pair = keyword.split("|");
            compiledKeywords[pair[0]] = [scopeName2, scoreForKeyword(pair[0], pair[1])];
          });
        }
      }
      function scoreForKeyword(keyword, providedScore) {
        if (providedScore) {
          return Number(providedScore);
        }
        return commonKeyword(keyword) ? 0 : 1;
      }
      function commonKeyword(keyword) {
        return COMMON_KEYWORDS.includes(keyword.toLowerCase());
      }
      var seenDeprecations = {};
      var error2 = (message) => {
        console.error(message);
      };
      var warn = (message, ...args) => {
        console.log(`WARN: ${message}`, ...args);
      };
      var deprecated = (version2, message) => {
        if (seenDeprecations[`${version2}/${message}`])
          return;
        console.log(`Deprecated as of ${version2}. ${message}`);
        seenDeprecations[`${version2}/${message}`] = true;
      };
      var MultiClassError = new Error();
      function remapScopeNames(mode, regexes, { key }) {
        let offset = 0;
        const scopeNames = mode[key];
        const emit = {};
        const positions = {};
        for (let i = 1; i <= regexes.length; i++) {
          positions[i + offset] = scopeNames[i];
          emit[i + offset] = true;
          offset += countMatchGroups(regexes[i - 1]);
        }
        mode[key] = positions;
        mode[key]._emit = emit;
        mode[key]._multi = true;
      }
      function beginMultiClass(mode) {
        if (!Array.isArray(mode.begin))
          return;
        if (mode.skip || mode.excludeBegin || mode.returnBegin) {
          error2("skip, excludeBegin, returnBegin not compatible with beginScope: {}");
          throw MultiClassError;
        }
        if (typeof mode.beginScope !== "object" || mode.beginScope === null) {
          error2("beginScope must be object");
          throw MultiClassError;
        }
        remapScopeNames(mode, mode.begin, { key: "beginScope" });
        mode.begin = _rewriteBackreferences(mode.begin, { joinWith: "" });
      }
      function endMultiClass(mode) {
        if (!Array.isArray(mode.end))
          return;
        if (mode.skip || mode.excludeEnd || mode.returnEnd) {
          error2("skip, excludeEnd, returnEnd not compatible with endScope: {}");
          throw MultiClassError;
        }
        if (typeof mode.endScope !== "object" || mode.endScope === null) {
          error2("endScope must be object");
          throw MultiClassError;
        }
        remapScopeNames(mode, mode.end, { key: "endScope" });
        mode.end = _rewriteBackreferences(mode.end, { joinWith: "" });
      }
      function scopeSugar(mode) {
        if (mode.scope && typeof mode.scope === "object" && mode.scope !== null) {
          mode.beginScope = mode.scope;
          delete mode.scope;
        }
      }
      function MultiClass(mode) {
        scopeSugar(mode);
        if (typeof mode.beginScope === "string") {
          mode.beginScope = { _wrap: mode.beginScope };
        }
        if (typeof mode.endScope === "string") {
          mode.endScope = { _wrap: mode.endScope };
        }
        beginMultiClass(mode);
        endMultiClass(mode);
      }
      function compileLanguage(language) {
        function langRe(value, global) {
          return new RegExp(source(value), "m" + (language.case_insensitive ? "i" : "") + (language.unicodeRegex ? "u" : "") + (global ? "g" : ""));
        }
        class MultiRegex {
          constructor() {
            this.matchIndexes = {};
            this.regexes = [];
            this.matchAt = 1;
            this.position = 0;
          }
          addRule(re, opts) {
            opts.position = this.position++;
            this.matchIndexes[this.matchAt] = opts;
            this.regexes.push([opts, re]);
            this.matchAt += countMatchGroups(re) + 1;
          }
          compile() {
            if (this.regexes.length === 0) {
              this.exec = () => null;
            }
            const terminators = this.regexes.map((el) => el[1]);
            this.matcherRe = langRe(_rewriteBackreferences(terminators, { joinWith: "|" }), true);
            this.lastIndex = 0;
          }
          exec(s) {
            this.matcherRe.lastIndex = this.lastIndex;
            const match = this.matcherRe.exec(s);
            if (!match) {
              return null;
            }
            const i = match.findIndex((el, i2) => i2 > 0 && el !== void 0);
            const matchData = this.matchIndexes[i];
            match.splice(0, i);
            return Object.assign(match, matchData);
          }
        }
        class ResumableMultiRegex {
          constructor() {
            this.rules = [];
            this.multiRegexes = [];
            this.count = 0;
            this.lastIndex = 0;
            this.regexIndex = 0;
          }
          getMatcher(index) {
            if (this.multiRegexes[index])
              return this.multiRegexes[index];
            const matcher = new MultiRegex();
            this.rules.slice(index).forEach(([re, opts]) => matcher.addRule(re, opts));
            matcher.compile();
            this.multiRegexes[index] = matcher;
            return matcher;
          }
          resumingScanAtSamePosition() {
            return this.regexIndex !== 0;
          }
          considerAll() {
            this.regexIndex = 0;
          }
          addRule(re, opts) {
            this.rules.push([re, opts]);
            if (opts.type === "begin")
              this.count++;
          }
          exec(s) {
            const m = this.getMatcher(this.regexIndex);
            m.lastIndex = this.lastIndex;
            let result = m.exec(s);
            if (this.resumingScanAtSamePosition()) {
              if (result && result.index === this.lastIndex)
                ;
              else {
                const m2 = this.getMatcher(0);
                m2.lastIndex = this.lastIndex + 1;
                result = m2.exec(s);
              }
            }
            if (result) {
              this.regexIndex += result.position + 1;
              if (this.regexIndex === this.count) {
                this.considerAll();
              }
            }
            return result;
          }
        }
        function buildModeRegex(mode) {
          const mm = new ResumableMultiRegex();
          mode.contains.forEach((term) => mm.addRule(term.begin, { rule: term, type: "begin" }));
          if (mode.terminatorEnd) {
            mm.addRule(mode.terminatorEnd, { type: "end" });
          }
          if (mode.illegal) {
            mm.addRule(mode.illegal, { type: "illegal" });
          }
          return mm;
        }
        function compileMode(mode, parent) {
          const cmode = mode;
          if (mode.isCompiled)
            return cmode;
          [
            scopeClassName,
            compileMatch,
            MultiClass,
            beforeMatchExt
          ].forEach((ext) => ext(mode, parent));
          language.compilerExtensions.forEach((ext) => ext(mode, parent));
          mode.__beforeBegin = null;
          [
            beginKeywords,
            compileIllegal,
            compileRelevance
          ].forEach((ext) => ext(mode, parent));
          mode.isCompiled = true;
          let keywordPattern = null;
          if (typeof mode.keywords === "object" && mode.keywords.$pattern) {
            mode.keywords = Object.assign({}, mode.keywords);
            keywordPattern = mode.keywords.$pattern;
            delete mode.keywords.$pattern;
          }
          keywordPattern = keywordPattern || /\w+/;
          if (mode.keywords) {
            mode.keywords = compileKeywords(mode.keywords, language.case_insensitive);
          }
          cmode.keywordPatternRe = langRe(keywordPattern, true);
          if (parent) {
            if (!mode.begin)
              mode.begin = /\B|\b/;
            cmode.beginRe = langRe(cmode.begin);
            if (!mode.end && !mode.endsWithParent)
              mode.end = /\B|\b/;
            if (mode.end)
              cmode.endRe = langRe(cmode.end);
            cmode.terminatorEnd = source(cmode.end) || "";
            if (mode.endsWithParent && parent.terminatorEnd) {
              cmode.terminatorEnd += (mode.end ? "|" : "") + parent.terminatorEnd;
            }
          }
          if (mode.illegal)
            cmode.illegalRe = langRe(mode.illegal);
          if (!mode.contains)
            mode.contains = [];
          mode.contains = [].concat(...mode.contains.map(function(c) {
            return expandOrCloneMode(c === "self" ? mode : c);
          }));
          mode.contains.forEach(function(c) {
            compileMode(c, cmode);
          });
          if (mode.starts) {
            compileMode(mode.starts, parent);
          }
          cmode.matcher = buildModeRegex(cmode);
          return cmode;
        }
        if (!language.compilerExtensions)
          language.compilerExtensions = [];
        if (language.contains && language.contains.includes("self")) {
          throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
        }
        language.classNameAliases = inherit$1(language.classNameAliases || {});
        return compileMode(language);
      }
      function dependencyOnParent(mode) {
        if (!mode)
          return false;
        return mode.endsWithParent || dependencyOnParent(mode.starts);
      }
      function expandOrCloneMode(mode) {
        if (mode.variants && !mode.cachedVariants) {
          mode.cachedVariants = mode.variants.map(function(variant) {
            return inherit$1(mode, { variants: null }, variant);
          });
        }
        if (mode.cachedVariants) {
          return mode.cachedVariants;
        }
        if (dependencyOnParent(mode)) {
          return inherit$1(mode, { starts: mode.starts ? inherit$1(mode.starts) : null });
        }
        if (Object.isFrozen(mode)) {
          return inherit$1(mode);
        }
        return mode;
      }
      var version = "11.4.0";
      var HTMLInjectionError = class extends Error {
        constructor(reason, html) {
          super(reason);
          this.name = "HTMLInjectionError";
          this.html = html;
        }
      };
      var escape = escapeHTML;
      var inherit = inherit$1;
      var NO_MATCH = Symbol("nomatch");
      var MAX_KEYWORD_HITS = 7;
      var HLJS = function(hljs) {
        const languages = /* @__PURE__ */ Object.create(null);
        const aliases = /* @__PURE__ */ Object.create(null);
        const plugins = [];
        let SAFE_MODE = true;
        const LANGUAGE_NOT_FOUND = "Could not find the language '{}', did you forget to load/include a language module?";
        const PLAINTEXT_LANGUAGE = { disableAutodetect: true, name: "Plain text", contains: [] };
        let options = {
          ignoreUnescapedHTML: false,
          throwUnescapedHTML: false,
          noHighlightRe: /^(no-?highlight)$/i,
          languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
          classPrefix: "hljs-",
          cssSelector: "pre code",
          languages: null,
          __emitter: TokenTreeEmitter
        };
        function shouldNotHighlight(languageName) {
          return options.noHighlightRe.test(languageName);
        }
        function blockLanguage(block) {
          let classes = block.className + " ";
          classes += block.parentNode ? block.parentNode.className : "";
          const match = options.languageDetectRe.exec(classes);
          if (match) {
            const language = getLanguage(match[1]);
            if (!language) {
              warn(LANGUAGE_NOT_FOUND.replace("{}", match[1]));
              warn("Falling back to no-highlight mode for this block.", block);
            }
            return language ? match[1] : "no-highlight";
          }
          return classes.split(/\s+/).find((_class) => shouldNotHighlight(_class) || getLanguage(_class));
        }
        function highlight2(codeOrLanguageName, optionsOrCode, ignoreIllegals) {
          let code = "";
          let languageName = "";
          if (typeof optionsOrCode === "object") {
            code = codeOrLanguageName;
            ignoreIllegals = optionsOrCode.ignoreIllegals;
            languageName = optionsOrCode.language;
          } else {
            deprecated("10.7.0", "highlight(lang, code, ...args) has been deprecated.");
            deprecated("10.7.0", "Please use highlight(code, options) instead.\nhttps://github.com/highlightjs/highlight.js/issues/2277");
            languageName = codeOrLanguageName;
            code = optionsOrCode;
          }
          if (ignoreIllegals === void 0) {
            ignoreIllegals = true;
          }
          const context = {
            code,
            language: languageName
          };
          fire("before:highlight", context);
          const result = context.result ? context.result : _highlight(context.language, context.code, ignoreIllegals);
          result.code = context.code;
          fire("after:highlight", result);
          return result;
        }
        function _highlight(languageName, codeToHighlight, ignoreIllegals, continuation) {
          const keywordHits = /* @__PURE__ */ Object.create(null);
          function keywordData(mode, matchText) {
            return mode.keywords[matchText];
          }
          function processKeywords() {
            if (!top.keywords) {
              emitter.addText(modeBuffer);
              return;
            }
            let lastIndex = 0;
            top.keywordPatternRe.lastIndex = 0;
            let match = top.keywordPatternRe.exec(modeBuffer);
            let buf = "";
            while (match) {
              buf += modeBuffer.substring(lastIndex, match.index);
              const word = language.case_insensitive ? match[0].toLowerCase() : match[0];
              const data = keywordData(top, word);
              if (data) {
                const [kind, keywordRelevance] = data;
                emitter.addText(buf);
                buf = "";
                keywordHits[word] = (keywordHits[word] || 0) + 1;
                if (keywordHits[word] <= MAX_KEYWORD_HITS)
                  relevance += keywordRelevance;
                if (kind.startsWith("_")) {
                  buf += match[0];
                } else {
                  const cssClass = language.classNameAliases[kind] || kind;
                  emitter.addKeyword(match[0], cssClass);
                }
              } else {
                buf += match[0];
              }
              lastIndex = top.keywordPatternRe.lastIndex;
              match = top.keywordPatternRe.exec(modeBuffer);
            }
            buf += modeBuffer.substr(lastIndex);
            emitter.addText(buf);
          }
          function processSubLanguage() {
            if (modeBuffer === "")
              return;
            let result2 = null;
            if (typeof top.subLanguage === "string") {
              if (!languages[top.subLanguage]) {
                emitter.addText(modeBuffer);
                return;
              }
              result2 = _highlight(top.subLanguage, modeBuffer, true, continuations[top.subLanguage]);
              continuations[top.subLanguage] = result2._top;
            } else {
              result2 = highlightAuto(modeBuffer, top.subLanguage.length ? top.subLanguage : null);
            }
            if (top.relevance > 0) {
              relevance += result2.relevance;
            }
            emitter.addSublanguage(result2._emitter, result2.language);
          }
          function processBuffer() {
            if (top.subLanguage != null) {
              processSubLanguage();
            } else {
              processKeywords();
            }
            modeBuffer = "";
          }
          function emitMultiClass(scope, match) {
            let i = 1;
            while (match[i] !== void 0) {
              if (!scope._emit[i]) {
                i++;
                continue;
              }
              const klass = language.classNameAliases[scope[i]] || scope[i];
              const text = match[i];
              if (klass) {
                emitter.addKeyword(text, klass);
              } else {
                modeBuffer = text;
                processKeywords();
                modeBuffer = "";
              }
              i++;
            }
          }
          function startNewMode(mode, match) {
            if (mode.scope && typeof mode.scope === "string") {
              emitter.openNode(language.classNameAliases[mode.scope] || mode.scope);
            }
            if (mode.beginScope) {
              if (mode.beginScope._wrap) {
                emitter.addKeyword(modeBuffer, language.classNameAliases[mode.beginScope._wrap] || mode.beginScope._wrap);
                modeBuffer = "";
              } else if (mode.beginScope._multi) {
                emitMultiClass(mode.beginScope, match);
                modeBuffer = "";
              }
            }
            top = Object.create(mode, { parent: { value: top } });
            return top;
          }
          function endOfMode(mode, match, matchPlusRemainder) {
            let matched = startsWith(mode.endRe, matchPlusRemainder);
            if (matched) {
              if (mode["on:end"]) {
                const resp = new Response(mode);
                mode["on:end"](match, resp);
                if (resp.isMatchIgnored)
                  matched = false;
              }
              if (matched) {
                while (mode.endsParent && mode.parent) {
                  mode = mode.parent;
                }
                return mode;
              }
            }
            if (mode.endsWithParent) {
              return endOfMode(mode.parent, match, matchPlusRemainder);
            }
          }
          function doIgnore(lexeme) {
            if (top.matcher.regexIndex === 0) {
              modeBuffer += lexeme[0];
              return 1;
            } else {
              resumeScanAtSamePosition = true;
              return 0;
            }
          }
          function doBeginMatch(match) {
            const lexeme = match[0];
            const newMode = match.rule;
            const resp = new Response(newMode);
            const beforeCallbacks = [newMode.__beforeBegin, newMode["on:begin"]];
            for (const cb of beforeCallbacks) {
              if (!cb)
                continue;
              cb(match, resp);
              if (resp.isMatchIgnored)
                return doIgnore(lexeme);
            }
            if (newMode.skip) {
              modeBuffer += lexeme;
            } else {
              if (newMode.excludeBegin) {
                modeBuffer += lexeme;
              }
              processBuffer();
              if (!newMode.returnBegin && !newMode.excludeBegin) {
                modeBuffer = lexeme;
              }
            }
            startNewMode(newMode, match);
            return newMode.returnBegin ? 0 : lexeme.length;
          }
          function doEndMatch(match) {
            const lexeme = match[0];
            const matchPlusRemainder = codeToHighlight.substr(match.index);
            const endMode = endOfMode(top, match, matchPlusRemainder);
            if (!endMode) {
              return NO_MATCH;
            }
            const origin = top;
            if (top.endScope && top.endScope._wrap) {
              processBuffer();
              emitter.addKeyword(lexeme, top.endScope._wrap);
            } else if (top.endScope && top.endScope._multi) {
              processBuffer();
              emitMultiClass(top.endScope, match);
            } else if (origin.skip) {
              modeBuffer += lexeme;
            } else {
              if (!(origin.returnEnd || origin.excludeEnd)) {
                modeBuffer += lexeme;
              }
              processBuffer();
              if (origin.excludeEnd) {
                modeBuffer = lexeme;
              }
            }
            do {
              if (top.scope) {
                emitter.closeNode();
              }
              if (!top.skip && !top.subLanguage) {
                relevance += top.relevance;
              }
              top = top.parent;
            } while (top !== endMode.parent);
            if (endMode.starts) {
              startNewMode(endMode.starts, match);
            }
            return origin.returnEnd ? 0 : lexeme.length;
          }
          function processContinuations() {
            const list = [];
            for (let current = top; current !== language; current = current.parent) {
              if (current.scope) {
                list.unshift(current.scope);
              }
            }
            list.forEach((item) => emitter.openNode(item));
          }
          let lastMatch = {};
          function processLexeme(textBeforeMatch, match) {
            const lexeme = match && match[0];
            modeBuffer += textBeforeMatch;
            if (lexeme == null) {
              processBuffer();
              return 0;
            }
            if (lastMatch.type === "begin" && match.type === "end" && lastMatch.index === match.index && lexeme === "") {
              modeBuffer += codeToHighlight.slice(match.index, match.index + 1);
              if (!SAFE_MODE) {
                const err = new Error(`0 width match regex (${languageName})`);
                err.languageName = languageName;
                err.badRule = lastMatch.rule;
                throw err;
              }
              return 1;
            }
            lastMatch = match;
            if (match.type === "begin") {
              return doBeginMatch(match);
            } else if (match.type === "illegal" && !ignoreIllegals) {
              const err = new Error('Illegal lexeme "' + lexeme + '" for mode "' + (top.scope || "<unnamed>") + '"');
              err.mode = top;
              throw err;
            } else if (match.type === "end") {
              const processed = doEndMatch(match);
              if (processed !== NO_MATCH) {
                return processed;
              }
            }
            if (match.type === "illegal" && lexeme === "") {
              return 1;
            }
            if (iterations > 1e5 && iterations > match.index * 3) {
              const err = new Error("potential infinite loop, way more iterations than matches");
              throw err;
            }
            modeBuffer += lexeme;
            return lexeme.length;
          }
          const language = getLanguage(languageName);
          if (!language) {
            error2(LANGUAGE_NOT_FOUND.replace("{}", languageName));
            throw new Error('Unknown language: "' + languageName + '"');
          }
          const md = compileLanguage(language);
          let result = "";
          let top = continuation || md;
          const continuations = {};
          const emitter = new options.__emitter(options);
          processContinuations();
          let modeBuffer = "";
          let relevance = 0;
          let index = 0;
          let iterations = 0;
          let resumeScanAtSamePosition = false;
          try {
            top.matcher.considerAll();
            for (; ; ) {
              iterations++;
              if (resumeScanAtSamePosition) {
                resumeScanAtSamePosition = false;
              } else {
                top.matcher.considerAll();
              }
              top.matcher.lastIndex = index;
              const match = top.matcher.exec(codeToHighlight);
              if (!match)
                break;
              const beforeMatch = codeToHighlight.substring(index, match.index);
              const processedCount = processLexeme(beforeMatch, match);
              index = match.index + processedCount;
            }
            processLexeme(codeToHighlight.substr(index));
            emitter.closeAllNodes();
            emitter.finalize();
            result = emitter.toHTML();
            return {
              language: languageName,
              value: result,
              relevance,
              illegal: false,
              _emitter: emitter,
              _top: top
            };
          } catch (err) {
            if (err.message && err.message.includes("Illegal")) {
              return {
                language: languageName,
                value: escape(codeToHighlight),
                illegal: true,
                relevance: 0,
                _illegalBy: {
                  message: err.message,
                  index,
                  context: codeToHighlight.slice(index - 100, index + 100),
                  mode: err.mode,
                  resultSoFar: result
                },
                _emitter: emitter
              };
            } else if (SAFE_MODE) {
              return {
                language: languageName,
                value: escape(codeToHighlight),
                illegal: false,
                relevance: 0,
                errorRaised: err,
                _emitter: emitter,
                _top: top
              };
            } else {
              throw err;
            }
          }
        }
        function justTextHighlightResult(code) {
          const result = {
            value: escape(code),
            illegal: false,
            relevance: 0,
            _top: PLAINTEXT_LANGUAGE,
            _emitter: new options.__emitter(options)
          };
          result._emitter.addText(code);
          return result;
        }
        function highlightAuto(code, languageSubset) {
          languageSubset = languageSubset || options.languages || Object.keys(languages);
          const plaintext = justTextHighlightResult(code);
          const results = languageSubset.filter(getLanguage).filter(autoDetection).map((name) => _highlight(name, code, false));
          results.unshift(plaintext);
          const sorted = results.sort((a, b) => {
            if (a.relevance !== b.relevance)
              return b.relevance - a.relevance;
            if (a.language && b.language) {
              if (getLanguage(a.language).supersetOf === b.language) {
                return 1;
              } else if (getLanguage(b.language).supersetOf === a.language) {
                return -1;
              }
            }
            return 0;
          });
          const [best, secondBest] = sorted;
          const result = best;
          result.secondBest = secondBest;
          return result;
        }
        function updateClassName(element, currentLang, resultLang) {
          const language = currentLang && aliases[currentLang] || resultLang;
          element.classList.add("hljs");
          element.classList.add(`language-${language}`);
        }
        function highlightElement(element) {
          let node = null;
          const language = blockLanguage(element);
          if (shouldNotHighlight(language))
            return;
          fire("before:highlightElement", { el: element, language });
          if (element.children.length > 0) {
            if (!options.ignoreUnescapedHTML) {
              console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk.");
              console.warn("https://github.com/highlightjs/highlight.js/wiki/security");
              console.warn("The element with unescaped HTML:");
              console.warn(element);
            }
            if (options.throwUnescapedHTML) {
              const err = new HTMLInjectionError("One of your code blocks includes unescaped HTML.", element.innerHTML);
              throw err;
            }
          }
          node = element;
          const text = node.textContent;
          const result = language ? highlight2(text, { language, ignoreIllegals: true }) : highlightAuto(text);
          element.innerHTML = result.value;
          updateClassName(element, language, result.language);
          element.result = {
            language: result.language,
            re: result.relevance,
            relevance: result.relevance
          };
          if (result.secondBest) {
            element.secondBest = {
              language: result.secondBest.language,
              relevance: result.secondBest.relevance
            };
          }
          fire("after:highlightElement", { el: element, result, text });
        }
        function configure(userOptions) {
          options = inherit(options, userOptions);
        }
        const initHighlighting = () => {
          highlightAll();
          deprecated("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
        };
        function initHighlightingOnLoad() {
          highlightAll();
          deprecated("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
        }
        let wantsHighlight = false;
        function highlightAll() {
          if (document.readyState === "loading") {
            wantsHighlight = true;
            return;
          }
          const blocks = document.querySelectorAll(options.cssSelector);
          blocks.forEach(highlightElement);
        }
        function boot() {
          if (wantsHighlight)
            highlightAll();
        }
        if (typeof window !== "undefined" && window.addEventListener) {
          window.addEventListener("DOMContentLoaded", boot, false);
        }
        function registerLanguage(languageName, languageDefinition) {
          let lang = null;
          try {
            lang = languageDefinition(hljs);
          } catch (error$1) {
            error2("Language definition for '{}' could not be registered.".replace("{}", languageName));
            if (!SAFE_MODE) {
              throw error$1;
            } else {
              error2(error$1);
            }
            lang = PLAINTEXT_LANGUAGE;
          }
          if (!lang.name)
            lang.name = languageName;
          languages[languageName] = lang;
          lang.rawDefinition = languageDefinition.bind(null, hljs);
          if (lang.aliases) {
            registerAliases(lang.aliases, { languageName });
          }
        }
        function unregisterLanguage(languageName) {
          delete languages[languageName];
          for (const alias of Object.keys(aliases)) {
            if (aliases[alias] === languageName) {
              delete aliases[alias];
            }
          }
        }
        function listLanguages() {
          return Object.keys(languages);
        }
        function getLanguage(name) {
          name = (name || "").toLowerCase();
          return languages[name] || languages[aliases[name]];
        }
        function registerAliases(aliasList, { languageName }) {
          if (typeof aliasList === "string") {
            aliasList = [aliasList];
          }
          aliasList.forEach((alias) => {
            aliases[alias.toLowerCase()] = languageName;
          });
        }
        function autoDetection(name) {
          const lang = getLanguage(name);
          return lang && !lang.disableAutodetect;
        }
        function upgradePluginAPI(plugin) {
          if (plugin["before:highlightBlock"] && !plugin["before:highlightElement"]) {
            plugin["before:highlightElement"] = (data) => {
              plugin["before:highlightBlock"](Object.assign({ block: data.el }, data));
            };
          }
          if (plugin["after:highlightBlock"] && !plugin["after:highlightElement"]) {
            plugin["after:highlightElement"] = (data) => {
              plugin["after:highlightBlock"](Object.assign({ block: data.el }, data));
            };
          }
        }
        function addPlugin(plugin) {
          upgradePluginAPI(plugin);
          plugins.push(plugin);
        }
        function fire(event, args) {
          const cb = event;
          plugins.forEach(function(plugin) {
            if (plugin[cb]) {
              plugin[cb](args);
            }
          });
        }
        function deprecateHighlightBlock(el) {
          deprecated("10.7.0", "highlightBlock will be removed entirely in v12.0");
          deprecated("10.7.0", "Please use highlightElement now.");
          return highlightElement(el);
        }
        Object.assign(hljs, {
          highlight: highlight2,
          highlightAuto,
          highlightAll,
          highlightElement,
          highlightBlock: deprecateHighlightBlock,
          configure,
          initHighlighting,
          initHighlightingOnLoad,
          registerLanguage,
          unregisterLanguage,
          listLanguages,
          getLanguage,
          registerAliases,
          autoDetection,
          inherit,
          addPlugin
        });
        hljs.debugMode = function() {
          SAFE_MODE = false;
        };
        hljs.safeMode = function() {
          SAFE_MODE = true;
        };
        hljs.versionString = version;
        hljs.regex = {
          concat,
          lookahead,
          either,
          optional,
          anyNumberOfTimes
        };
        for (const key in MODES) {
          if (typeof MODES[key] === "object") {
            deepFreeze$1(MODES[key]);
          }
        }
        Object.assign(hljs, MODES);
        return hljs;
      };
      var highlight = HLJS({});
      module.exports = highlight;
      highlight.HighlightJS = highlight;
      highlight.default = highlight;
    }
  });

  // node_modules/alpinejs/dist/cdn.js
  (() => {
    var flushPending = false;
    var flushing = false;
    var queue = [];
    function scheduler(callback) {
      queueJob(callback);
    }
    function queueJob(job) {
      if (!queue.includes(job))
        queue.push(job);
      queueFlush();
    }
    function dequeueJob(job) {
      const index = queue.indexOf(job);
      if (index !== -1) {
        queue.splice(index, 1);
      }
    }
    function queueFlush() {
      if (!flushing && !flushPending) {
        flushPending = true;
        queueMicrotask(flushJobs);
      }
    }
    function flushJobs() {
      flushPending = false;
      flushing = true;
      for (let i = 0; i < queue.length; i++) {
        queue[i]();
      }
      queue.length = 0;
      flushing = false;
    }
    var reactive;
    var effect;
    var release;
    var raw;
    var shouldSchedule = true;
    function disableEffectScheduling(callback) {
      shouldSchedule = false;
      callback();
      shouldSchedule = true;
    }
    function setReactivityEngine(engine) {
      reactive = engine.reactive;
      release = engine.release;
      effect = (callback) => engine.effect(callback, { scheduler: (task) => {
        if (shouldSchedule) {
          scheduler(task);
        } else {
          task();
        }
      } });
      raw = engine.raw;
    }
    function overrideEffect(override) {
      effect = override;
    }
    function elementBoundEffect(el) {
      let cleanup2 = () => {
      };
      let wrappedEffect = (callback) => {
        let effectReference = effect(callback);
        if (!el._x_effects) {
          el._x_effects = /* @__PURE__ */ new Set();
          el._x_runEffects = () => {
            el._x_effects.forEach((i) => i());
          };
        }
        el._x_effects.add(effectReference);
        cleanup2 = () => {
          if (effectReference === void 0)
            return;
          el._x_effects.delete(effectReference);
          release(effectReference);
        };
      };
      return [wrappedEffect, () => {
        cleanup2();
      }];
    }
    var onAttributeAddeds = [];
    var onElRemoveds = [];
    var onElAddeds = [];
    function onElAdded(callback) {
      onElAddeds.push(callback);
    }
    function onElRemoved(callback) {
      onElRemoveds.push(callback);
    }
    function onAttributesAdded(callback) {
      onAttributeAddeds.push(callback);
    }
    function onAttributeRemoved(el, name, callback) {
      if (!el._x_attributeCleanups)
        el._x_attributeCleanups = {};
      if (!el._x_attributeCleanups[name])
        el._x_attributeCleanups[name] = [];
      el._x_attributeCleanups[name].push(callback);
    }
    function cleanupAttributes(el, names) {
      if (!el._x_attributeCleanups)
        return;
      Object.entries(el._x_attributeCleanups).forEach(([name, value]) => {
        if (names === void 0 || names.includes(name)) {
          value.forEach((i) => i());
          delete el._x_attributeCleanups[name];
        }
      });
    }
    var observer = new MutationObserver(onMutate);
    var currentlyObserving = false;
    function startObservingMutations() {
      observer.observe(document, { subtree: true, childList: true, attributes: true, attributeOldValue: true });
      currentlyObserving = true;
    }
    function stopObservingMutations() {
      flushObserver();
      observer.disconnect();
      currentlyObserving = false;
    }
    var recordQueue = [];
    var willProcessRecordQueue = false;
    function flushObserver() {
      recordQueue = recordQueue.concat(observer.takeRecords());
      if (recordQueue.length && !willProcessRecordQueue) {
        willProcessRecordQueue = true;
        queueMicrotask(() => {
          processRecordQueue();
          willProcessRecordQueue = false;
        });
      }
    }
    function processRecordQueue() {
      onMutate(recordQueue);
      recordQueue.length = 0;
    }
    function mutateDom(callback) {
      if (!currentlyObserving)
        return callback();
      stopObservingMutations();
      let result = callback();
      startObservingMutations();
      return result;
    }
    var isCollecting = false;
    var deferredMutations = [];
    function deferMutations() {
      isCollecting = true;
    }
    function flushAndStopDeferringMutations() {
      isCollecting = false;
      onMutate(deferredMutations);
      deferredMutations = [];
    }
    function onMutate(mutations) {
      if (isCollecting) {
        deferredMutations = deferredMutations.concat(mutations);
        return;
      }
      let addedNodes = [];
      let removedNodes = [];
      let addedAttributes = /* @__PURE__ */ new Map();
      let removedAttributes = /* @__PURE__ */ new Map();
      for (let i = 0; i < mutations.length; i++) {
        if (mutations[i].target._x_ignoreMutationObserver)
          continue;
        if (mutations[i].type === "childList") {
          mutations[i].addedNodes.forEach((node) => node.nodeType === 1 && addedNodes.push(node));
          mutations[i].removedNodes.forEach((node) => node.nodeType === 1 && removedNodes.push(node));
        }
        if (mutations[i].type === "attributes") {
          let el = mutations[i].target;
          let name = mutations[i].attributeName;
          let oldValue = mutations[i].oldValue;
          let add2 = () => {
            if (!addedAttributes.has(el))
              addedAttributes.set(el, []);
            addedAttributes.get(el).push({ name, value: el.getAttribute(name) });
          };
          let remove = () => {
            if (!removedAttributes.has(el))
              removedAttributes.set(el, []);
            removedAttributes.get(el).push(name);
          };
          if (el.hasAttribute(name) && oldValue === null) {
            add2();
          } else if (el.hasAttribute(name)) {
            remove();
            add2();
          } else {
            remove();
          }
        }
      }
      removedAttributes.forEach((attrs, el) => {
        cleanupAttributes(el, attrs);
      });
      addedAttributes.forEach((attrs, el) => {
        onAttributeAddeds.forEach((i) => i(el, attrs));
      });
      for (let node of removedNodes) {
        if (addedNodes.includes(node))
          continue;
        onElRemoveds.forEach((i) => i(node));
      }
      addedNodes.forEach((node) => {
        node._x_ignoreSelf = true;
        node._x_ignore = true;
      });
      for (let node of addedNodes) {
        if (removedNodes.includes(node))
          continue;
        if (!node.isConnected)
          continue;
        delete node._x_ignoreSelf;
        delete node._x_ignore;
        onElAddeds.forEach((i) => i(node));
        node._x_ignore = true;
        node._x_ignoreSelf = true;
      }
      addedNodes.forEach((node) => {
        delete node._x_ignoreSelf;
        delete node._x_ignore;
      });
      addedNodes = null;
      removedNodes = null;
      addedAttributes = null;
      removedAttributes = null;
    }
    function scope(node) {
      return mergeProxies(closestDataStack(node));
    }
    function addScopeToNode(node, data2, referenceNode) {
      node._x_dataStack = [data2, ...closestDataStack(referenceNode || node)];
      return () => {
        node._x_dataStack = node._x_dataStack.filter((i) => i !== data2);
      };
    }
    function refreshScope(element, scope2) {
      let existingScope = element._x_dataStack[0];
      Object.entries(scope2).forEach(([key, value]) => {
        existingScope[key] = value;
      });
    }
    function closestDataStack(node) {
      if (node._x_dataStack)
        return node._x_dataStack;
      if (typeof ShadowRoot === "function" && node instanceof ShadowRoot) {
        return closestDataStack(node.host);
      }
      if (!node.parentNode) {
        return [];
      }
      return closestDataStack(node.parentNode);
    }
    function mergeProxies(objects) {
      let thisProxy = new Proxy({}, {
        ownKeys: () => {
          return Array.from(new Set(objects.flatMap((i) => Object.keys(i))));
        },
        has: (target, name) => {
          return objects.some((obj) => obj.hasOwnProperty(name));
        },
        get: (target, name) => {
          return (objects.find((obj) => {
            if (obj.hasOwnProperty(name)) {
              let descriptor = Object.getOwnPropertyDescriptor(obj, name);
              if (descriptor.get && descriptor.get._x_alreadyBound || descriptor.set && descriptor.set._x_alreadyBound) {
                return true;
              }
              if ((descriptor.get || descriptor.set) && descriptor.enumerable) {
                let getter = descriptor.get;
                let setter = descriptor.set;
                let property = descriptor;
                getter = getter && getter.bind(thisProxy);
                setter = setter && setter.bind(thisProxy);
                if (getter)
                  getter._x_alreadyBound = true;
                if (setter)
                  setter._x_alreadyBound = true;
                Object.defineProperty(obj, name, {
                  ...property,
                  get: getter,
                  set: setter
                });
              }
              return true;
            }
            return false;
          }) || {})[name];
        },
        set: (target, name, value) => {
          let closestObjectWithKey = objects.find((obj) => obj.hasOwnProperty(name));
          if (closestObjectWithKey) {
            closestObjectWithKey[name] = value;
          } else {
            objects[objects.length - 1][name] = value;
          }
          return true;
        }
      });
      return thisProxy;
    }
    function initInterceptors(data2) {
      let isObject2 = (val) => typeof val === "object" && !Array.isArray(val) && val !== null;
      let recurse = (obj, basePath = "") => {
        Object.entries(Object.getOwnPropertyDescriptors(obj)).forEach(([key, { value, enumerable }]) => {
          if (enumerable === false || value === void 0)
            return;
          let path = basePath === "" ? key : `${basePath}.${key}`;
          if (typeof value === "object" && value !== null && value._x_interceptor) {
            obj[key] = value.initialize(data2, path, key);
          } else {
            if (isObject2(value) && value !== obj && !(value instanceof Element)) {
              recurse(value, path);
            }
          }
        });
      };
      return recurse(data2);
    }
    function interceptor(callback, mutateObj = () => {
    }) {
      let obj = {
        initialValue: void 0,
        _x_interceptor: true,
        initialize(data2, path, key) {
          return callback(this.initialValue, () => get(data2, path), (value) => set(data2, path, value), path, key);
        }
      };
      mutateObj(obj);
      return (initialValue) => {
        if (typeof initialValue === "object" && initialValue !== null && initialValue._x_interceptor) {
          let initialize = obj.initialize.bind(obj);
          obj.initialize = (data2, path, key) => {
            let innerValue = initialValue.initialize(data2, path, key);
            obj.initialValue = innerValue;
            return initialize(data2, path, key);
          };
        } else {
          obj.initialValue = initialValue;
        }
        return obj;
      };
    }
    function get(obj, path) {
      return path.split(".").reduce((carry, segment) => carry[segment], obj);
    }
    function set(obj, path, value) {
      if (typeof path === "string")
        path = path.split(".");
      if (path.length === 1)
        obj[path[0]] = value;
      else if (path.length === 0)
        throw error;
      else {
        if (obj[path[0]])
          return set(obj[path[0]], path.slice(1), value);
        else {
          obj[path[0]] = {};
          return set(obj[path[0]], path.slice(1), value);
        }
      }
    }
    var magics = {};
    function magic(name, callback) {
      magics[name] = callback;
    }
    function injectMagics(obj, el) {
      Object.entries(magics).forEach(([name, callback]) => {
        Object.defineProperty(obj, `$${name}`, {
          get() {
            return callback(el, { Alpine: alpine_default, interceptor });
          },
          enumerable: false
        });
      });
      return obj;
    }
    function tryCatch(el, expression, callback, ...args) {
      try {
        return callback(...args);
      } catch (e) {
        handleError(e, el, expression);
      }
    }
    function handleError(error2, el, expression = void 0) {
      Object.assign(error2, { el, expression });
      console.warn(`Alpine Expression Error: ${error2.message}

${expression ? 'Expression: "' + expression + '"\n\n' : ""}`, el);
      setTimeout(() => {
        throw error2;
      }, 0);
    }
    function evaluate(el, expression, extras = {}) {
      let result;
      evaluateLater(el, expression)((value) => result = value, extras);
      return result;
    }
    function evaluateLater(...args) {
      return theEvaluatorFunction(...args);
    }
    var theEvaluatorFunction = normalEvaluator;
    function setEvaluator(newEvaluator) {
      theEvaluatorFunction = newEvaluator;
    }
    function normalEvaluator(el, expression) {
      let overriddenMagics = {};
      injectMagics(overriddenMagics, el);
      let dataStack = [overriddenMagics, ...closestDataStack(el)];
      if (typeof expression === "function") {
        return generateEvaluatorFromFunction(dataStack, expression);
      }
      let evaluator = generateEvaluatorFromString(dataStack, expression, el);
      return tryCatch.bind(null, el, expression, evaluator);
    }
    function generateEvaluatorFromFunction(dataStack, func) {
      return (receiver = () => {
      }, { scope: scope2 = {}, params = [] } = {}) => {
        let result = func.apply(mergeProxies([scope2, ...dataStack]), params);
        runIfTypeOfFunction(receiver, result);
      };
    }
    var evaluatorMemo = {};
    function generateFunctionFromString(expression, el) {
      if (evaluatorMemo[expression]) {
        return evaluatorMemo[expression];
      }
      let AsyncFunction = Object.getPrototypeOf(async function() {
      }).constructor;
      let rightSideSafeExpression = /^[\n\s]*if.*\(.*\)/.test(expression) || /^(let|const)\s/.test(expression) ? `(() => { ${expression} })()` : expression;
      const safeAsyncFunction = () => {
        try {
          return new AsyncFunction(["__self", "scope"], `with (scope) { __self.result = ${rightSideSafeExpression} }; __self.finished = true; return __self.result;`);
        } catch (error2) {
          handleError(error2, el, expression);
          return Promise.resolve();
        }
      };
      let func = safeAsyncFunction();
      evaluatorMemo[expression] = func;
      return func;
    }
    function generateEvaluatorFromString(dataStack, expression, el) {
      let func = generateFunctionFromString(expression, el);
      return (receiver = () => {
      }, { scope: scope2 = {}, params = [] } = {}) => {
        func.result = void 0;
        func.finished = false;
        let completeScope = mergeProxies([scope2, ...dataStack]);
        if (typeof func === "function") {
          let promise = func(func, completeScope).catch((error2) => handleError(error2, el, expression));
          if (func.finished) {
            runIfTypeOfFunction(receiver, func.result, completeScope, params, el);
            func.result = void 0;
          } else {
            promise.then((result) => {
              runIfTypeOfFunction(receiver, result, completeScope, params, el);
            }).catch((error2) => handleError(error2, el, expression)).finally(() => func.result = void 0);
          }
        }
      };
    }
    function runIfTypeOfFunction(receiver, value, scope2, params, el) {
      if (typeof value === "function") {
        let result = value.apply(scope2, params);
        if (result instanceof Promise) {
          result.then((i) => runIfTypeOfFunction(receiver, i, scope2, params)).catch((error2) => handleError(error2, el, value));
        } else {
          receiver(result);
        }
      } else {
        receiver(value);
      }
    }
    var prefixAsString = "x-";
    function prefix(subject = "") {
      return prefixAsString + subject;
    }
    function setPrefix(newPrefix) {
      prefixAsString = newPrefix;
    }
    var directiveHandlers = {};
    function directive(name, callback) {
      directiveHandlers[name] = callback;
    }
    function directives(el, attributes, originalAttributeOverride) {
      let transformedAttributeMap = {};
      let directives2 = Array.from(attributes).map(toTransformedAttributes((newName, oldName) => transformedAttributeMap[newName] = oldName)).filter(outNonAlpineAttributes).map(toParsedDirectives(transformedAttributeMap, originalAttributeOverride)).sort(byPriority);
      return directives2.map((directive2) => {
        return getDirectiveHandler(el, directive2);
      });
    }
    function attributesOnly(attributes) {
      return Array.from(attributes).map(toTransformedAttributes()).filter((attr) => !outNonAlpineAttributes(attr));
    }
    var isDeferringHandlers = false;
    var directiveHandlerStacks = /* @__PURE__ */ new Map();
    var currentHandlerStackKey = Symbol();
    function deferHandlingDirectives(callback) {
      isDeferringHandlers = true;
      let key = Symbol();
      currentHandlerStackKey = key;
      directiveHandlerStacks.set(key, []);
      let flushHandlers = () => {
        while (directiveHandlerStacks.get(key).length)
          directiveHandlerStacks.get(key).shift()();
        directiveHandlerStacks.delete(key);
      };
      let stopDeferring = () => {
        isDeferringHandlers = false;
        flushHandlers();
      };
      callback(flushHandlers);
      stopDeferring();
    }
    function getDirectiveHandler(el, directive2) {
      let noop = () => {
      };
      let handler3 = directiveHandlers[directive2.type] || noop;
      let cleanups = [];
      let cleanup2 = (callback) => cleanups.push(callback);
      let [effect3, cleanupEffect] = elementBoundEffect(el);
      cleanups.push(cleanupEffect);
      let utilities = {
        Alpine: alpine_default,
        effect: effect3,
        cleanup: cleanup2,
        evaluateLater: evaluateLater.bind(evaluateLater, el),
        evaluate: evaluate.bind(evaluate, el)
      };
      let doCleanup = () => cleanups.forEach((i) => i());
      onAttributeRemoved(el, directive2.original, doCleanup);
      let fullHandler = () => {
        if (el._x_ignore || el._x_ignoreSelf)
          return;
        handler3.inline && handler3.inline(el, directive2, utilities);
        handler3 = handler3.bind(handler3, el, directive2, utilities);
        isDeferringHandlers ? directiveHandlerStacks.get(currentHandlerStackKey).push(handler3) : handler3();
      };
      fullHandler.runCleanups = doCleanup;
      return fullHandler;
    }
    var startingWith = (subject, replacement) => ({ name, value }) => {
      if (name.startsWith(subject))
        name = name.replace(subject, replacement);
      return { name, value };
    };
    var into = (i) => i;
    function toTransformedAttributes(callback = () => {
    }) {
      return ({ name, value }) => {
        let { name: newName, value: newValue } = attributeTransformers.reduce((carry, transform) => {
          return transform(carry);
        }, { name, value });
        if (newName !== name)
          callback(newName, name);
        return { name: newName, value: newValue };
      };
    }
    var attributeTransformers = [];
    function mapAttributes(callback) {
      attributeTransformers.push(callback);
    }
    function outNonAlpineAttributes({ name }) {
      return alpineAttributeRegex().test(name);
    }
    var alpineAttributeRegex = () => new RegExp(`^${prefixAsString}([^:^.]+)\\b`);
    function toParsedDirectives(transformedAttributeMap, originalAttributeOverride) {
      return ({ name, value }) => {
        let typeMatch = name.match(alpineAttributeRegex());
        let valueMatch = name.match(/:([a-zA-Z0-9\-:]+)/);
        let modifiers = name.match(/\.[^.\]]+(?=[^\]]*$)/g) || [];
        let original = originalAttributeOverride || transformedAttributeMap[name] || name;
        return {
          type: typeMatch ? typeMatch[1] : null,
          value: valueMatch ? valueMatch[1] : null,
          modifiers: modifiers.map((i) => i.replace(".", "")),
          expression: value,
          original
        };
      };
    }
    var DEFAULT = "DEFAULT";
    var directiveOrder = [
      "ignore",
      "ref",
      "data",
      "id",
      "bind",
      "init",
      "for",
      "model",
      "modelable",
      "transition",
      "show",
      "if",
      DEFAULT,
      "teleport",
      "element"
    ];
    function byPriority(a, b) {
      let typeA = directiveOrder.indexOf(a.type) === -1 ? DEFAULT : a.type;
      let typeB = directiveOrder.indexOf(b.type) === -1 ? DEFAULT : b.type;
      return directiveOrder.indexOf(typeA) - directiveOrder.indexOf(typeB);
    }
    function dispatch(el, name, detail = {}) {
      el.dispatchEvent(new CustomEvent(name, {
        detail,
        bubbles: true,
        composed: true,
        cancelable: true
      }));
    }
    var tickStack = [];
    var isHolding = false;
    function nextTick(callback) {
      tickStack.push(callback);
      queueMicrotask(() => {
        isHolding || setTimeout(() => {
          releaseNextTicks();
        });
      });
    }
    function releaseNextTicks() {
      isHolding = false;
      while (tickStack.length)
        tickStack.shift()();
    }
    function holdNextTicks() {
      isHolding = true;
    }
    function walk(el, callback) {
      if (typeof ShadowRoot === "function" && el instanceof ShadowRoot) {
        Array.from(el.children).forEach((el2) => walk(el2, callback));
        return;
      }
      let skip = false;
      callback(el, () => skip = true);
      if (skip)
        return;
      let node = el.firstElementChild;
      while (node) {
        walk(node, callback, false);
        node = node.nextElementSibling;
      }
    }
    function warn(message, ...args) {
      console.warn(`Alpine Warning: ${message}`, ...args);
    }
    function start() {
      if (!document.body)
        warn("Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?");
      dispatch(document, "alpine:init");
      dispatch(document, "alpine:initializing");
      startObservingMutations();
      onElAdded((el) => initTree(el, walk));
      onElRemoved((el) => destroyTree(el));
      onAttributesAdded((el, attrs) => {
        directives(el, attrs).forEach((handle) => handle());
      });
      let outNestedComponents = (el) => !closestRoot(el.parentElement, true);
      Array.from(document.querySelectorAll(allSelectors())).filter(outNestedComponents).forEach((el) => {
        initTree(el);
      });
      dispatch(document, "alpine:initialized");
    }
    var rootSelectorCallbacks = [];
    var initSelectorCallbacks = [];
    function rootSelectors() {
      return rootSelectorCallbacks.map((fn) => fn());
    }
    function allSelectors() {
      return rootSelectorCallbacks.concat(initSelectorCallbacks).map((fn) => fn());
    }
    function addRootSelector(selectorCallback) {
      rootSelectorCallbacks.push(selectorCallback);
    }
    function addInitSelector(selectorCallback) {
      initSelectorCallbacks.push(selectorCallback);
    }
    function closestRoot(el, includeInitSelectors = false) {
      return findClosest(el, (element) => {
        const selectors = includeInitSelectors ? allSelectors() : rootSelectors();
        if (selectors.some((selector) => element.matches(selector)))
          return true;
      });
    }
    function findClosest(el, callback) {
      if (!el)
        return;
      if (callback(el))
        return el;
      if (el._x_teleportBack)
        el = el._x_teleportBack;
      if (!el.parentElement)
        return;
      return findClosest(el.parentElement, callback);
    }
    function isRoot(el) {
      return rootSelectors().some((selector) => el.matches(selector));
    }
    function initTree(el, walker = walk) {
      deferHandlingDirectives(() => {
        walker(el, (el2, skip) => {
          directives(el2, el2.attributes).forEach((handle) => handle());
          el2._x_ignore && skip();
        });
      });
    }
    function destroyTree(root) {
      walk(root, (el) => cleanupAttributes(el));
    }
    function setClasses(el, value) {
      if (Array.isArray(value)) {
        return setClassesFromString(el, value.join(" "));
      } else if (typeof value === "object" && value !== null) {
        return setClassesFromObject(el, value);
      } else if (typeof value === "function") {
        return setClasses(el, value());
      }
      return setClassesFromString(el, value);
    }
    function setClassesFromString(el, classString) {
      let split = (classString2) => classString2.split(" ").filter(Boolean);
      let missingClasses = (classString2) => classString2.split(" ").filter((i) => !el.classList.contains(i)).filter(Boolean);
      let addClassesAndReturnUndo = (classes) => {
        el.classList.add(...classes);
        return () => {
          el.classList.remove(...classes);
        };
      };
      classString = classString === true ? classString = "" : classString || "";
      return addClassesAndReturnUndo(missingClasses(classString));
    }
    function setClassesFromObject(el, classObject) {
      let split = (classString) => classString.split(" ").filter(Boolean);
      let forAdd = Object.entries(classObject).flatMap(([classString, bool]) => bool ? split(classString) : false).filter(Boolean);
      let forRemove = Object.entries(classObject).flatMap(([classString, bool]) => !bool ? split(classString) : false).filter(Boolean);
      let added = [];
      let removed = [];
      forRemove.forEach((i) => {
        if (el.classList.contains(i)) {
          el.classList.remove(i);
          removed.push(i);
        }
      });
      forAdd.forEach((i) => {
        if (!el.classList.contains(i)) {
          el.classList.add(i);
          added.push(i);
        }
      });
      return () => {
        removed.forEach((i) => el.classList.add(i));
        added.forEach((i) => el.classList.remove(i));
      };
    }
    function setStyles(el, value) {
      if (typeof value === "object" && value !== null) {
        return setStylesFromObject(el, value);
      }
      return setStylesFromString(el, value);
    }
    function setStylesFromObject(el, value) {
      let previousStyles = {};
      Object.entries(value).forEach(([key, value2]) => {
        previousStyles[key] = el.style[key];
        if (!key.startsWith("--")) {
          key = kebabCase(key);
        }
        el.style.setProperty(key, value2);
      });
      setTimeout(() => {
        if (el.style.length === 0) {
          el.removeAttribute("style");
        }
      });
      return () => {
        setStyles(el, previousStyles);
      };
    }
    function setStylesFromString(el, value) {
      let cache = el.getAttribute("style", value);
      el.setAttribute("style", value);
      return () => {
        el.setAttribute("style", cache || "");
      };
    }
    function kebabCase(subject) {
      return subject.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
    }
    function once(callback, fallback = () => {
    }) {
      let called = false;
      return function() {
        if (!called) {
          called = true;
          callback.apply(this, arguments);
        } else {
          fallback.apply(this, arguments);
        }
      };
    }
    directive("transition", (el, { value, modifiers, expression }, { evaluate: evaluate2 }) => {
      if (typeof expression === "function")
        expression = evaluate2(expression);
      if (!expression) {
        registerTransitionsFromHelper(el, modifiers, value);
      } else {
        registerTransitionsFromClassString(el, expression, value);
      }
    });
    function registerTransitionsFromClassString(el, classString, stage) {
      registerTransitionObject(el, setClasses, "");
      let directiveStorageMap = {
        enter: (classes) => {
          el._x_transition.enter.during = classes;
        },
        "enter-start": (classes) => {
          el._x_transition.enter.start = classes;
        },
        "enter-end": (classes) => {
          el._x_transition.enter.end = classes;
        },
        leave: (classes) => {
          el._x_transition.leave.during = classes;
        },
        "leave-start": (classes) => {
          el._x_transition.leave.start = classes;
        },
        "leave-end": (classes) => {
          el._x_transition.leave.end = classes;
        }
      };
      directiveStorageMap[stage](classString);
    }
    function registerTransitionsFromHelper(el, modifiers, stage) {
      registerTransitionObject(el, setStyles);
      let doesntSpecify = !modifiers.includes("in") && !modifiers.includes("out") && !stage;
      let transitioningIn = doesntSpecify || modifiers.includes("in") || ["enter"].includes(stage);
      let transitioningOut = doesntSpecify || modifiers.includes("out") || ["leave"].includes(stage);
      if (modifiers.includes("in") && !doesntSpecify) {
        modifiers = modifiers.filter((i, index) => index < modifiers.indexOf("out"));
      }
      if (modifiers.includes("out") && !doesntSpecify) {
        modifiers = modifiers.filter((i, index) => index > modifiers.indexOf("out"));
      }
      let wantsAll = !modifiers.includes("opacity") && !modifiers.includes("scale");
      let wantsOpacity = wantsAll || modifiers.includes("opacity");
      let wantsScale = wantsAll || modifiers.includes("scale");
      let opacityValue = wantsOpacity ? 0 : 1;
      let scaleValue = wantsScale ? modifierValue(modifiers, "scale", 95) / 100 : 1;
      let delay = modifierValue(modifiers, "delay", 0);
      let origin = modifierValue(modifiers, "origin", "center");
      let property = "opacity, transform";
      let durationIn = modifierValue(modifiers, "duration", 150) / 1e3;
      let durationOut = modifierValue(modifiers, "duration", 75) / 1e3;
      let easing = `cubic-bezier(0.4, 0.0, 0.2, 1)`;
      if (transitioningIn) {
        el._x_transition.enter.during = {
          transformOrigin: origin,
          transitionDelay: delay,
          transitionProperty: property,
          transitionDuration: `${durationIn}s`,
          transitionTimingFunction: easing
        };
        el._x_transition.enter.start = {
          opacity: opacityValue,
          transform: `scale(${scaleValue})`
        };
        el._x_transition.enter.end = {
          opacity: 1,
          transform: `scale(1)`
        };
      }
      if (transitioningOut) {
        el._x_transition.leave.during = {
          transformOrigin: origin,
          transitionDelay: delay,
          transitionProperty: property,
          transitionDuration: `${durationOut}s`,
          transitionTimingFunction: easing
        };
        el._x_transition.leave.start = {
          opacity: 1,
          transform: `scale(1)`
        };
        el._x_transition.leave.end = {
          opacity: opacityValue,
          transform: `scale(${scaleValue})`
        };
      }
    }
    function registerTransitionObject(el, setFunction, defaultValue = {}) {
      if (!el._x_transition)
        el._x_transition = {
          enter: { during: defaultValue, start: defaultValue, end: defaultValue },
          leave: { during: defaultValue, start: defaultValue, end: defaultValue },
          in(before = () => {
          }, after = () => {
          }) {
            transition(el, setFunction, {
              during: this.enter.during,
              start: this.enter.start,
              end: this.enter.end
            }, before, after);
          },
          out(before = () => {
          }, after = () => {
          }) {
            transition(el, setFunction, {
              during: this.leave.during,
              start: this.leave.start,
              end: this.leave.end
            }, before, after);
          }
        };
    }
    window.Element.prototype._x_toggleAndCascadeWithTransitions = function(el, value, show, hide) {
      let clickAwayCompatibleShow = () => {
        document.visibilityState === "visible" ? requestAnimationFrame(show) : setTimeout(show);
      };
      if (value) {
        if (el._x_transition && (el._x_transition.enter || el._x_transition.leave)) {
          el._x_transition.enter && (Object.entries(el._x_transition.enter.during).length || Object.entries(el._x_transition.enter.start).length || Object.entries(el._x_transition.enter.end).length) ? el._x_transition.in(show) : clickAwayCompatibleShow();
        } else {
          el._x_transition ? el._x_transition.in(show) : clickAwayCompatibleShow();
        }
        return;
      }
      el._x_hidePromise = el._x_transition ? new Promise((resolve, reject) => {
        el._x_transition.out(() => {
        }, () => resolve(hide));
        el._x_transitioning.beforeCancel(() => reject({ isFromCancelledTransition: true }));
      }) : Promise.resolve(hide);
      queueMicrotask(() => {
        let closest = closestHide(el);
        if (closest) {
          if (!closest._x_hideChildren)
            closest._x_hideChildren = [];
          closest._x_hideChildren.push(el);
        } else {
          queueMicrotask(() => {
            let hideAfterChildren = (el2) => {
              let carry = Promise.all([
                el2._x_hidePromise,
                ...(el2._x_hideChildren || []).map(hideAfterChildren)
              ]).then(([i]) => i());
              delete el2._x_hidePromise;
              delete el2._x_hideChildren;
              return carry;
            };
            hideAfterChildren(el).catch((e) => {
              if (!e.isFromCancelledTransition)
                throw e;
            });
          });
        }
      });
    };
    function closestHide(el) {
      let parent = el.parentNode;
      if (!parent)
        return;
      return parent._x_hidePromise ? parent : closestHide(parent);
    }
    function transition(el, setFunction, { during, start: start2, end } = {}, before = () => {
    }, after = () => {
    }) {
      if (el._x_transitioning)
        el._x_transitioning.cancel();
      if (Object.keys(during).length === 0 && Object.keys(start2).length === 0 && Object.keys(end).length === 0) {
        before();
        after();
        return;
      }
      let undoStart, undoDuring, undoEnd;
      performTransition(el, {
        start() {
          undoStart = setFunction(el, start2);
        },
        during() {
          undoDuring = setFunction(el, during);
        },
        before,
        end() {
          undoStart();
          undoEnd = setFunction(el, end);
        },
        after,
        cleanup() {
          undoDuring();
          undoEnd();
        }
      });
    }
    function performTransition(el, stages) {
      let interrupted, reachedBefore, reachedEnd;
      let finish = once(() => {
        mutateDom(() => {
          interrupted = true;
          if (!reachedBefore)
            stages.before();
          if (!reachedEnd) {
            stages.end();
            releaseNextTicks();
          }
          stages.after();
          if (el.isConnected)
            stages.cleanup();
          delete el._x_transitioning;
        });
      });
      el._x_transitioning = {
        beforeCancels: [],
        beforeCancel(callback) {
          this.beforeCancels.push(callback);
        },
        cancel: once(function() {
          while (this.beforeCancels.length) {
            this.beforeCancels.shift()();
          }
          ;
          finish();
        }),
        finish
      };
      mutateDom(() => {
        stages.start();
        stages.during();
      });
      holdNextTicks();
      requestAnimationFrame(() => {
        if (interrupted)
          return;
        let duration = Number(getComputedStyle(el).transitionDuration.replace(/,.*/, "").replace("s", "")) * 1e3;
        let delay = Number(getComputedStyle(el).transitionDelay.replace(/,.*/, "").replace("s", "")) * 1e3;
        if (duration === 0)
          duration = Number(getComputedStyle(el).animationDuration.replace("s", "")) * 1e3;
        mutateDom(() => {
          stages.before();
        });
        reachedBefore = true;
        requestAnimationFrame(() => {
          if (interrupted)
            return;
          mutateDom(() => {
            stages.end();
          });
          releaseNextTicks();
          setTimeout(el._x_transitioning.finish, duration + delay);
          reachedEnd = true;
        });
      });
    }
    function modifierValue(modifiers, key, fallback) {
      if (modifiers.indexOf(key) === -1)
        return fallback;
      const rawValue = modifiers[modifiers.indexOf(key) + 1];
      if (!rawValue)
        return fallback;
      if (key === "scale") {
        if (isNaN(rawValue))
          return fallback;
      }
      if (key === "duration") {
        let match = rawValue.match(/([0-9]+)ms/);
        if (match)
          return match[1];
      }
      if (key === "origin") {
        if (["top", "right", "left", "center", "bottom"].includes(modifiers[modifiers.indexOf(key) + 2])) {
          return [rawValue, modifiers[modifiers.indexOf(key) + 2]].join(" ");
        }
      }
      return rawValue;
    }
    var isCloning = false;
    function skipDuringClone(callback, fallback = () => {
    }) {
      return (...args) => isCloning ? fallback(...args) : callback(...args);
    }
    function clone(oldEl, newEl) {
      if (!newEl._x_dataStack)
        newEl._x_dataStack = oldEl._x_dataStack;
      isCloning = true;
      dontRegisterReactiveSideEffects(() => {
        cloneTree(newEl);
      });
      isCloning = false;
    }
    function cloneTree(el) {
      let hasRunThroughFirstEl = false;
      let shallowWalker = (el2, callback) => {
        walk(el2, (el3, skip) => {
          if (hasRunThroughFirstEl && isRoot(el3))
            return skip();
          hasRunThroughFirstEl = true;
          callback(el3, skip);
        });
      };
      initTree(el, shallowWalker);
    }
    function dontRegisterReactiveSideEffects(callback) {
      let cache = effect;
      overrideEffect((callback2, el) => {
        let storedEffect = cache(callback2);
        release(storedEffect);
        return () => {
        };
      });
      callback();
      overrideEffect(cache);
    }
    function bind(el, name, value, modifiers = []) {
      if (!el._x_bindings)
        el._x_bindings = reactive({});
      el._x_bindings[name] = value;
      name = modifiers.includes("camel") ? camelCase(name) : name;
      switch (name) {
        case "value":
          bindInputValue(el, value);
          break;
        case "style":
          bindStyles(el, value);
          break;
        case "class":
          bindClasses(el, value);
          break;
        default:
          bindAttribute(el, name, value);
          break;
      }
    }
    function bindInputValue(el, value) {
      if (el.type === "radio") {
        if (el.attributes.value === void 0) {
          el.value = value;
        }
        if (window.fromModel) {
          el.checked = checkedAttrLooseCompare(el.value, value);
        }
      } else if (el.type === "checkbox") {
        if (Number.isInteger(value)) {
          el.value = value;
        } else if (!Number.isInteger(value) && !Array.isArray(value) && typeof value !== "boolean" && ![null, void 0].includes(value)) {
          el.value = String(value);
        } else {
          if (Array.isArray(value)) {
            el.checked = value.some((val) => checkedAttrLooseCompare(val, el.value));
          } else {
            el.checked = !!value;
          }
        }
      } else if (el.tagName === "SELECT") {
        updateSelect(el, value);
      } else {
        if (el.value === value)
          return;
        el.value = value;
      }
    }
    function bindClasses(el, value) {
      if (el._x_undoAddedClasses)
        el._x_undoAddedClasses();
      el._x_undoAddedClasses = setClasses(el, value);
    }
    function bindStyles(el, value) {
      if (el._x_undoAddedStyles)
        el._x_undoAddedStyles();
      el._x_undoAddedStyles = setStyles(el, value);
    }
    function bindAttribute(el, name, value) {
      if ([null, void 0, false].includes(value) && attributeShouldntBePreservedIfFalsy(name)) {
        el.removeAttribute(name);
      } else {
        if (isBooleanAttr(name))
          value = name;
        setIfChanged(el, name, value);
      }
    }
    function setIfChanged(el, attrName, value) {
      if (el.getAttribute(attrName) != value) {
        el.setAttribute(attrName, value);
      }
    }
    function updateSelect(el, value) {
      const arrayWrappedValue = [].concat(value).map((value2) => {
        return value2 + "";
      });
      Array.from(el.options).forEach((option) => {
        option.selected = arrayWrappedValue.includes(option.value);
      });
    }
    function camelCase(subject) {
      return subject.toLowerCase().replace(/-(\w)/g, (match, char) => char.toUpperCase());
    }
    function checkedAttrLooseCompare(valueA, valueB) {
      return valueA == valueB;
    }
    function isBooleanAttr(attrName) {
      const booleanAttributes = [
        "disabled",
        "checked",
        "required",
        "readonly",
        "hidden",
        "open",
        "selected",
        "autofocus",
        "itemscope",
        "multiple",
        "novalidate",
        "allowfullscreen",
        "allowpaymentrequest",
        "formnovalidate",
        "autoplay",
        "controls",
        "loop",
        "muted",
        "playsinline",
        "default",
        "ismap",
        "reversed",
        "async",
        "defer",
        "nomodule"
      ];
      return booleanAttributes.includes(attrName);
    }
    function attributeShouldntBePreservedIfFalsy(name) {
      return !["aria-pressed", "aria-checked", "aria-expanded", "aria-selected"].includes(name);
    }
    function getBinding(el, name, fallback) {
      if (el._x_bindings && el._x_bindings[name] !== void 0)
        return el._x_bindings[name];
      let attr = el.getAttribute(name);
      if (attr === null)
        return typeof fallback === "function" ? fallback() : fallback;
      if (isBooleanAttr(name)) {
        return !![name, "true"].includes(attr);
      }
      if (attr === "")
        return true;
      return attr;
    }
    function debounce(func, wait) {
      var timeout;
      return function() {
        var context = this, args = arguments;
        var later = function() {
          timeout = null;
          func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }
    function throttle(func, limit) {
      let inThrottle;
      return function() {
        let context = this, args = arguments;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    }
    function plugin(callback) {
      callback(alpine_default);
    }
    var stores = {};
    var isReactive = false;
    function store(name, value) {
      if (!isReactive) {
        stores = reactive(stores);
        isReactive = true;
      }
      if (value === void 0) {
        return stores[name];
      }
      stores[name] = value;
      if (typeof value === "object" && value !== null && value.hasOwnProperty("init") && typeof value.init === "function") {
        stores[name].init();
      }
      initInterceptors(stores[name]);
    }
    function getStores() {
      return stores;
    }
    var binds = {};
    function bind2(name, object) {
      binds[name] = typeof object !== "function" ? () => object : object;
    }
    function injectBindingProviders(obj) {
      Object.entries(binds).forEach(([name, callback]) => {
        Object.defineProperty(obj, name, {
          get() {
            return (...args) => {
              return callback(...args);
            };
          }
        });
      });
      return obj;
    }
    var datas = {};
    function data(name, callback) {
      datas[name] = callback;
    }
    function injectDataProviders(obj, context) {
      Object.entries(datas).forEach(([name, callback]) => {
        Object.defineProperty(obj, name, {
          get() {
            return (...args) => {
              return callback.bind(context)(...args);
            };
          },
          enumerable: false
        });
      });
      return obj;
    }
    var Alpine = {
      get reactive() {
        return reactive;
      },
      get release() {
        return release;
      },
      get effect() {
        return effect;
      },
      get raw() {
        return raw;
      },
      version: "3.9.0",
      flushAndStopDeferringMutations,
      disableEffectScheduling,
      setReactivityEngine,
      closestDataStack,
      skipDuringClone,
      addRootSelector,
      addInitSelector,
      addScopeToNode,
      deferMutations,
      mapAttributes,
      evaluateLater,
      setEvaluator,
      mergeProxies,
      findClosest,
      closestRoot,
      interceptor,
      transition,
      setStyles,
      mutateDom,
      directive,
      throttle,
      debounce,
      evaluate,
      initTree,
      nextTick,
      prefixed: prefix,
      prefix: setPrefix,
      plugin,
      magic,
      store,
      start,
      clone,
      bound: getBinding,
      $data: scope,
      data,
      bind: bind2
    };
    var alpine_default = Alpine;
    function makeMap(str, expectsLowerCase) {
      const map = /* @__PURE__ */ Object.create(null);
      const list = str.split(",");
      for (let i = 0; i < list.length; i++) {
        map[list[i]] = true;
      }
      return expectsLowerCase ? (val) => !!map[val.toLowerCase()] : (val) => !!map[val];
    }
    var PatchFlagNames = {
      [1]: `TEXT`,
      [2]: `CLASS`,
      [4]: `STYLE`,
      [8]: `PROPS`,
      [16]: `FULL_PROPS`,
      [32]: `HYDRATE_EVENTS`,
      [64]: `STABLE_FRAGMENT`,
      [128]: `KEYED_FRAGMENT`,
      [256]: `UNKEYED_FRAGMENT`,
      [512]: `NEED_PATCH`,
      [1024]: `DYNAMIC_SLOTS`,
      [2048]: `DEV_ROOT_FRAGMENT`,
      [-1]: `HOISTED`,
      [-2]: `BAIL`
    };
    var slotFlagsText = {
      [1]: "STABLE",
      [2]: "DYNAMIC",
      [3]: "FORWARDED"
    };
    var specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
    var isBooleanAttr2 = /* @__PURE__ */ makeMap(specialBooleanAttrs + `,async,autofocus,autoplay,controls,default,defer,disabled,hidden,loop,open,required,reversed,scoped,seamless,checked,muted,multiple,selected`);
    var EMPTY_OBJ = true ? Object.freeze({}) : {};
    var EMPTY_ARR = true ? Object.freeze([]) : [];
    var extend = Object.assign;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var hasOwn = (val, key) => hasOwnProperty.call(val, key);
    var isArray = Array.isArray;
    var isMap = (val) => toTypeString(val) === "[object Map]";
    var isString = (val) => typeof val === "string";
    var isSymbol = (val) => typeof val === "symbol";
    var isObject = (val) => val !== null && typeof val === "object";
    var objectToString = Object.prototype.toString;
    var toTypeString = (value) => objectToString.call(value);
    var toRawType = (value) => {
      return toTypeString(value).slice(8, -1);
    };
    var isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
    var cacheStringFunction = (fn) => {
      const cache = /* @__PURE__ */ Object.create(null);
      return (str) => {
        const hit = cache[str];
        return hit || (cache[str] = fn(str));
      };
    };
    var camelizeRE = /-(\w)/g;
    var camelize = cacheStringFunction((str) => {
      return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
    });
    var hyphenateRE = /\B([A-Z])/g;
    var hyphenate = cacheStringFunction((str) => str.replace(hyphenateRE, "-$1").toLowerCase());
    var capitalize = cacheStringFunction((str) => str.charAt(0).toUpperCase() + str.slice(1));
    var toHandlerKey = cacheStringFunction((str) => str ? `on${capitalize(str)}` : ``);
    var hasChanged = (value, oldValue) => value !== oldValue && (value === value || oldValue === oldValue);
    var targetMap = /* @__PURE__ */ new WeakMap();
    var effectStack = [];
    var activeEffect;
    var ITERATE_KEY = Symbol(true ? "iterate" : "");
    var MAP_KEY_ITERATE_KEY = Symbol(true ? "Map key iterate" : "");
    function isEffect(fn) {
      return fn && fn._isEffect === true;
    }
    function effect2(fn, options = EMPTY_OBJ) {
      if (isEffect(fn)) {
        fn = fn.raw;
      }
      const effect3 = createReactiveEffect(fn, options);
      if (!options.lazy) {
        effect3();
      }
      return effect3;
    }
    function stop(effect3) {
      if (effect3.active) {
        cleanup(effect3);
        if (effect3.options.onStop) {
          effect3.options.onStop();
        }
        effect3.active = false;
      }
    }
    var uid = 0;
    function createReactiveEffect(fn, options) {
      const effect3 = function reactiveEffect() {
        if (!effect3.active) {
          return fn();
        }
        if (!effectStack.includes(effect3)) {
          cleanup(effect3);
          try {
            enableTracking();
            effectStack.push(effect3);
            activeEffect = effect3;
            return fn();
          } finally {
            effectStack.pop();
            resetTracking();
            activeEffect = effectStack[effectStack.length - 1];
          }
        }
      };
      effect3.id = uid++;
      effect3.allowRecurse = !!options.allowRecurse;
      effect3._isEffect = true;
      effect3.active = true;
      effect3.raw = fn;
      effect3.deps = [];
      effect3.options = options;
      return effect3;
    }
    function cleanup(effect3) {
      const { deps } = effect3;
      if (deps.length) {
        for (let i = 0; i < deps.length; i++) {
          deps[i].delete(effect3);
        }
        deps.length = 0;
      }
    }
    var shouldTrack = true;
    var trackStack = [];
    function pauseTracking() {
      trackStack.push(shouldTrack);
      shouldTrack = false;
    }
    function enableTracking() {
      trackStack.push(shouldTrack);
      shouldTrack = true;
    }
    function resetTracking() {
      const last = trackStack.pop();
      shouldTrack = last === void 0 ? true : last;
    }
    function track(target, type, key) {
      if (!shouldTrack || activeEffect === void 0) {
        return;
      }
      let depsMap = targetMap.get(target);
      if (!depsMap) {
        targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
      }
      let dep = depsMap.get(key);
      if (!dep) {
        depsMap.set(key, dep = /* @__PURE__ */ new Set());
      }
      if (!dep.has(activeEffect)) {
        dep.add(activeEffect);
        activeEffect.deps.push(dep);
        if (activeEffect.options.onTrack) {
          activeEffect.options.onTrack({
            effect: activeEffect,
            target,
            type,
            key
          });
        }
      }
    }
    function trigger(target, type, key, newValue, oldValue, oldTarget) {
      const depsMap = targetMap.get(target);
      if (!depsMap) {
        return;
      }
      const effects = /* @__PURE__ */ new Set();
      const add2 = (effectsToAdd) => {
        if (effectsToAdd) {
          effectsToAdd.forEach((effect3) => {
            if (effect3 !== activeEffect || effect3.allowRecurse) {
              effects.add(effect3);
            }
          });
        }
      };
      if (type === "clear") {
        depsMap.forEach(add2);
      } else if (key === "length" && isArray(target)) {
        depsMap.forEach((dep, key2) => {
          if (key2 === "length" || key2 >= newValue) {
            add2(dep);
          }
        });
      } else {
        if (key !== void 0) {
          add2(depsMap.get(key));
        }
        switch (type) {
          case "add":
            if (!isArray(target)) {
              add2(depsMap.get(ITERATE_KEY));
              if (isMap(target)) {
                add2(depsMap.get(MAP_KEY_ITERATE_KEY));
              }
            } else if (isIntegerKey(key)) {
              add2(depsMap.get("length"));
            }
            break;
          case "delete":
            if (!isArray(target)) {
              add2(depsMap.get(ITERATE_KEY));
              if (isMap(target)) {
                add2(depsMap.get(MAP_KEY_ITERATE_KEY));
              }
            }
            break;
          case "set":
            if (isMap(target)) {
              add2(depsMap.get(ITERATE_KEY));
            }
            break;
        }
      }
      const run = (effect3) => {
        if (effect3.options.onTrigger) {
          effect3.options.onTrigger({
            effect: effect3,
            target,
            key,
            type,
            newValue,
            oldValue,
            oldTarget
          });
        }
        if (effect3.options.scheduler) {
          effect3.options.scheduler(effect3);
        } else {
          effect3();
        }
      };
      effects.forEach(run);
    }
    var isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
    var builtInSymbols = new Set(Object.getOwnPropertyNames(Symbol).map((key) => Symbol[key]).filter(isSymbol));
    var get2 = /* @__PURE__ */ createGetter();
    var shallowGet = /* @__PURE__ */ createGetter(false, true);
    var readonlyGet = /* @__PURE__ */ createGetter(true);
    var shallowReadonlyGet = /* @__PURE__ */ createGetter(true, true);
    var arrayInstrumentations = {};
    ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
      const method = Array.prototype[key];
      arrayInstrumentations[key] = function(...args) {
        const arr = toRaw(this);
        for (let i = 0, l = this.length; i < l; i++) {
          track(arr, "get", i + "");
        }
        const res = method.apply(arr, args);
        if (res === -1 || res === false) {
          return method.apply(arr, args.map(toRaw));
        } else {
          return res;
        }
      };
    });
    ["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
      const method = Array.prototype[key];
      arrayInstrumentations[key] = function(...args) {
        pauseTracking();
        const res = method.apply(this, args);
        resetTracking();
        return res;
      };
    });
    function createGetter(isReadonly = false, shallow = false) {
      return function get3(target, key, receiver) {
        if (key === "__v_isReactive") {
          return !isReadonly;
        } else if (key === "__v_isReadonly") {
          return isReadonly;
        } else if (key === "__v_raw" && receiver === (isReadonly ? shallow ? shallowReadonlyMap : readonlyMap : shallow ? shallowReactiveMap : reactiveMap).get(target)) {
          return target;
        }
        const targetIsArray = isArray(target);
        if (!isReadonly && targetIsArray && hasOwn(arrayInstrumentations, key)) {
          return Reflect.get(arrayInstrumentations, key, receiver);
        }
        const res = Reflect.get(target, key, receiver);
        if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
          return res;
        }
        if (!isReadonly) {
          track(target, "get", key);
        }
        if (shallow) {
          return res;
        }
        if (isRef(res)) {
          const shouldUnwrap = !targetIsArray || !isIntegerKey(key);
          return shouldUnwrap ? res.value : res;
        }
        if (isObject(res)) {
          return isReadonly ? readonly(res) : reactive2(res);
        }
        return res;
      };
    }
    var set2 = /* @__PURE__ */ createSetter();
    var shallowSet = /* @__PURE__ */ createSetter(true);
    function createSetter(shallow = false) {
      return function set3(target, key, value, receiver) {
        let oldValue = target[key];
        if (!shallow) {
          value = toRaw(value);
          oldValue = toRaw(oldValue);
          if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
            oldValue.value = value;
            return true;
          }
        }
        const hadKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
        const result = Reflect.set(target, key, value, receiver);
        if (target === toRaw(receiver)) {
          if (!hadKey) {
            trigger(target, "add", key, value);
          } else if (hasChanged(value, oldValue)) {
            trigger(target, "set", key, value, oldValue);
          }
        }
        return result;
      };
    }
    function deleteProperty(target, key) {
      const hadKey = hasOwn(target, key);
      const oldValue = target[key];
      const result = Reflect.deleteProperty(target, key);
      if (result && hadKey) {
        trigger(target, "delete", key, void 0, oldValue);
      }
      return result;
    }
    function has(target, key) {
      const result = Reflect.has(target, key);
      if (!isSymbol(key) || !builtInSymbols.has(key)) {
        track(target, "has", key);
      }
      return result;
    }
    function ownKeys(target) {
      track(target, "iterate", isArray(target) ? "length" : ITERATE_KEY);
      return Reflect.ownKeys(target);
    }
    var mutableHandlers = {
      get: get2,
      set: set2,
      deleteProperty,
      has,
      ownKeys
    };
    var readonlyHandlers = {
      get: readonlyGet,
      set(target, key) {
        if (true) {
          console.warn(`Set operation on key "${String(key)}" failed: target is readonly.`, target);
        }
        return true;
      },
      deleteProperty(target, key) {
        if (true) {
          console.warn(`Delete operation on key "${String(key)}" failed: target is readonly.`, target);
        }
        return true;
      }
    };
    var shallowReactiveHandlers = extend({}, mutableHandlers, {
      get: shallowGet,
      set: shallowSet
    });
    var shallowReadonlyHandlers = extend({}, readonlyHandlers, {
      get: shallowReadonlyGet
    });
    var toReactive = (value) => isObject(value) ? reactive2(value) : value;
    var toReadonly = (value) => isObject(value) ? readonly(value) : value;
    var toShallow = (value) => value;
    var getProto = (v) => Reflect.getPrototypeOf(v);
    function get$1(target, key, isReadonly = false, isShallow = false) {
      target = target["__v_raw"];
      const rawTarget = toRaw(target);
      const rawKey = toRaw(key);
      if (key !== rawKey) {
        !isReadonly && track(rawTarget, "get", key);
      }
      !isReadonly && track(rawTarget, "get", rawKey);
      const { has: has2 } = getProto(rawTarget);
      const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
      if (has2.call(rawTarget, key)) {
        return wrap(target.get(key));
      } else if (has2.call(rawTarget, rawKey)) {
        return wrap(target.get(rawKey));
      } else if (target !== rawTarget) {
        target.get(key);
      }
    }
    function has$1(key, isReadonly = false) {
      const target = this["__v_raw"];
      const rawTarget = toRaw(target);
      const rawKey = toRaw(key);
      if (key !== rawKey) {
        !isReadonly && track(rawTarget, "has", key);
      }
      !isReadonly && track(rawTarget, "has", rawKey);
      return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
    }
    function size(target, isReadonly = false) {
      target = target["__v_raw"];
      !isReadonly && track(toRaw(target), "iterate", ITERATE_KEY);
      return Reflect.get(target, "size", target);
    }
    function add(value) {
      value = toRaw(value);
      const target = toRaw(this);
      const proto = getProto(target);
      const hadKey = proto.has.call(target, value);
      if (!hadKey) {
        target.add(value);
        trigger(target, "add", value, value);
      }
      return this;
    }
    function set$1(key, value) {
      value = toRaw(value);
      const target = toRaw(this);
      const { has: has2, get: get3 } = getProto(target);
      let hadKey = has2.call(target, key);
      if (!hadKey) {
        key = toRaw(key);
        hadKey = has2.call(target, key);
      } else if (true) {
        checkIdentityKeys(target, has2, key);
      }
      const oldValue = get3.call(target, key);
      target.set(key, value);
      if (!hadKey) {
        trigger(target, "add", key, value);
      } else if (hasChanged(value, oldValue)) {
        trigger(target, "set", key, value, oldValue);
      }
      return this;
    }
    function deleteEntry(key) {
      const target = toRaw(this);
      const { has: has2, get: get3 } = getProto(target);
      let hadKey = has2.call(target, key);
      if (!hadKey) {
        key = toRaw(key);
        hadKey = has2.call(target, key);
      } else if (true) {
        checkIdentityKeys(target, has2, key);
      }
      const oldValue = get3 ? get3.call(target, key) : void 0;
      const result = target.delete(key);
      if (hadKey) {
        trigger(target, "delete", key, void 0, oldValue);
      }
      return result;
    }
    function clear() {
      const target = toRaw(this);
      const hadItems = target.size !== 0;
      const oldTarget = true ? isMap(target) ? new Map(target) : new Set(target) : void 0;
      const result = target.clear();
      if (hadItems) {
        trigger(target, "clear", void 0, void 0, oldTarget);
      }
      return result;
    }
    function createForEach(isReadonly, isShallow) {
      return function forEach(callback, thisArg) {
        const observed = this;
        const target = observed["__v_raw"];
        const rawTarget = toRaw(target);
        const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
        !isReadonly && track(rawTarget, "iterate", ITERATE_KEY);
        return target.forEach((value, key) => {
          return callback.call(thisArg, wrap(value), wrap(key), observed);
        });
      };
    }
    function createIterableMethod(method, isReadonly, isShallow) {
      return function(...args) {
        const target = this["__v_raw"];
        const rawTarget = toRaw(target);
        const targetIsMap = isMap(rawTarget);
        const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
        const isKeyOnly = method === "keys" && targetIsMap;
        const innerIterator = target[method](...args);
        const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
        !isReadonly && track(rawTarget, "iterate", isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY);
        return {
          next() {
            const { value, done } = innerIterator.next();
            return done ? { value, done } : {
              value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
              done
            };
          },
          [Symbol.iterator]() {
            return this;
          }
        };
      };
    }
    function createReadonlyMethod(type) {
      return function(...args) {
        if (true) {
          const key = args[0] ? `on key "${args[0]}" ` : ``;
          console.warn(`${capitalize(type)} operation ${key}failed: target is readonly.`, toRaw(this));
        }
        return type === "delete" ? false : this;
      };
    }
    var mutableInstrumentations = {
      get(key) {
        return get$1(this, key);
      },
      get size() {
        return size(this);
      },
      has: has$1,
      add,
      set: set$1,
      delete: deleteEntry,
      clear,
      forEach: createForEach(false, false)
    };
    var shallowInstrumentations = {
      get(key) {
        return get$1(this, key, false, true);
      },
      get size() {
        return size(this);
      },
      has: has$1,
      add,
      set: set$1,
      delete: deleteEntry,
      clear,
      forEach: createForEach(false, true)
    };
    var readonlyInstrumentations = {
      get(key) {
        return get$1(this, key, true);
      },
      get size() {
        return size(this, true);
      },
      has(key) {
        return has$1.call(this, key, true);
      },
      add: createReadonlyMethod("add"),
      set: createReadonlyMethod("set"),
      delete: createReadonlyMethod("delete"),
      clear: createReadonlyMethod("clear"),
      forEach: createForEach(true, false)
    };
    var shallowReadonlyInstrumentations = {
      get(key) {
        return get$1(this, key, true, true);
      },
      get size() {
        return size(this, true);
      },
      has(key) {
        return has$1.call(this, key, true);
      },
      add: createReadonlyMethod("add"),
      set: createReadonlyMethod("set"),
      delete: createReadonlyMethod("delete"),
      clear: createReadonlyMethod("clear"),
      forEach: createForEach(true, true)
    };
    var iteratorMethods = ["keys", "values", "entries", Symbol.iterator];
    iteratorMethods.forEach((method) => {
      mutableInstrumentations[method] = createIterableMethod(method, false, false);
      readonlyInstrumentations[method] = createIterableMethod(method, true, false);
      shallowInstrumentations[method] = createIterableMethod(method, false, true);
      shallowReadonlyInstrumentations[method] = createIterableMethod(method, true, true);
    });
    function createInstrumentationGetter(isReadonly, shallow) {
      const instrumentations = shallow ? isReadonly ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly ? readonlyInstrumentations : mutableInstrumentations;
      return (target, key, receiver) => {
        if (key === "__v_isReactive") {
          return !isReadonly;
        } else if (key === "__v_isReadonly") {
          return isReadonly;
        } else if (key === "__v_raw") {
          return target;
        }
        return Reflect.get(hasOwn(instrumentations, key) && key in target ? instrumentations : target, key, receiver);
      };
    }
    var mutableCollectionHandlers = {
      get: createInstrumentationGetter(false, false)
    };
    var shallowCollectionHandlers = {
      get: createInstrumentationGetter(false, true)
    };
    var readonlyCollectionHandlers = {
      get: createInstrumentationGetter(true, false)
    };
    var shallowReadonlyCollectionHandlers = {
      get: createInstrumentationGetter(true, true)
    };
    function checkIdentityKeys(target, has2, key) {
      const rawKey = toRaw(key);
      if (rawKey !== key && has2.call(target, rawKey)) {
        const type = toRawType(target);
        console.warn(`Reactive ${type} contains both the raw and reactive versions of the same object${type === `Map` ? ` as keys` : ``}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`);
      }
    }
    var reactiveMap = /* @__PURE__ */ new WeakMap();
    var shallowReactiveMap = /* @__PURE__ */ new WeakMap();
    var readonlyMap = /* @__PURE__ */ new WeakMap();
    var shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
    function targetTypeMap(rawType) {
      switch (rawType) {
        case "Object":
        case "Array":
          return 1;
        case "Map":
        case "Set":
        case "WeakMap":
        case "WeakSet":
          return 2;
        default:
          return 0;
      }
    }
    function getTargetType(value) {
      return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
    }
    function reactive2(target) {
      if (target && target["__v_isReadonly"]) {
        return target;
      }
      return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers, reactiveMap);
    }
    function readonly(target) {
      return createReactiveObject(target, true, readonlyHandlers, readonlyCollectionHandlers, readonlyMap);
    }
    function createReactiveObject(target, isReadonly, baseHandlers, collectionHandlers, proxyMap) {
      if (!isObject(target)) {
        if (true) {
          console.warn(`value cannot be made reactive: ${String(target)}`);
        }
        return target;
      }
      if (target["__v_raw"] && !(isReadonly && target["__v_isReactive"])) {
        return target;
      }
      const existingProxy = proxyMap.get(target);
      if (existingProxy) {
        return existingProxy;
      }
      const targetType = getTargetType(target);
      if (targetType === 0) {
        return target;
      }
      const proxy = new Proxy(target, targetType === 2 ? collectionHandlers : baseHandlers);
      proxyMap.set(target, proxy);
      return proxy;
    }
    function toRaw(observed) {
      return observed && toRaw(observed["__v_raw"]) || observed;
    }
    function isRef(r) {
      return Boolean(r && r.__v_isRef === true);
    }
    magic("nextTick", () => nextTick);
    magic("dispatch", (el) => dispatch.bind(dispatch, el));
    magic("watch", (el) => (key, callback) => {
      let evaluate2 = evaluateLater(el, key);
      let firstTime = true;
      let oldValue;
      effect(() => evaluate2((value) => {
        JSON.stringify(value);
        if (!firstTime) {
          queueMicrotask(() => {
            callback(value, oldValue);
            oldValue = value;
          });
        } else {
          oldValue = value;
        }
        firstTime = false;
      }));
    });
    magic("store", getStores);
    magic("data", (el) => scope(el));
    magic("root", (el) => closestRoot(el));
    magic("refs", (el) => {
      if (el._x_refs_proxy)
        return el._x_refs_proxy;
      el._x_refs_proxy = mergeProxies(getArrayOfRefObject(el));
      return el._x_refs_proxy;
    });
    function getArrayOfRefObject(el) {
      let refObjects = [];
      let currentEl = el;
      while (currentEl) {
        if (currentEl._x_refs)
          refObjects.push(currentEl._x_refs);
        currentEl = currentEl.parentNode;
      }
      return refObjects;
    }
    var globalIdMemo = {};
    function findAndIncrementId(name) {
      if (!globalIdMemo[name])
        globalIdMemo[name] = 0;
      return ++globalIdMemo[name];
    }
    function closestIdRoot(el, name) {
      return findClosest(el, (element) => {
        if (element._x_ids && element._x_ids[name])
          return true;
      });
    }
    function setIdRoot(el, name) {
      if (!el._x_ids)
        el._x_ids = {};
      if (!el._x_ids[name])
        el._x_ids[name] = findAndIncrementId(name);
    }
    magic("id", (el) => (name, key = null) => {
      let root = closestIdRoot(el, name);
      let id = root ? root._x_ids[name] : findAndIncrementId(name);
      return key ? `${name}-${id}-${key}` : `${name}-${id}`;
    });
    magic("el", (el) => el);
    directive("modelable", (el, { expression }, { effect: effect3, evaluate: evaluate2, evaluateLater: evaluateLater2 }) => {
      let func = evaluateLater2(expression);
      let innerGet = () => {
        let result;
        func((i) => result = i);
        return result;
      };
      let evaluateInnerSet = evaluateLater2(`${expression} = __placeholder`);
      let innerSet = (val) => evaluateInnerSet(() => {
      }, { scope: { __placeholder: val } });
      let initialValue = innerGet();
      if (el._x_modelable_hook)
        initialValue = el._x_modelable_hook(initialValue);
      innerSet(initialValue);
      queueMicrotask(() => {
        if (!el._x_model)
          return;
        let outerGet = el._x_model.get;
        let outerSet = el._x_model.set;
        effect3(() => innerSet(outerGet()));
        effect3(() => outerSet(innerGet()));
      });
    });
    directive("teleport", (el, { expression }, { cleanup: cleanup2 }) => {
      if (el.tagName.toLowerCase() !== "template")
        warn("x-teleport can only be used on a <template> tag", el);
      let target = document.querySelector(expression);
      if (!target)
        warn(`Cannot find x-teleport element for selector: "${expression}"`);
      let clone2 = el.content.cloneNode(true).firstElementChild;
      el._x_teleport = clone2;
      clone2._x_teleportBack = el;
      if (el._x_forwardEvents) {
        el._x_forwardEvents.forEach((eventName) => {
          clone2.addEventListener(eventName, (e) => {
            e.stopPropagation();
            el.dispatchEvent(new e.constructor(e.type, e));
          });
        });
      }
      addScopeToNode(clone2, {}, el);
      mutateDom(() => {
        target.appendChild(clone2);
        initTree(clone2);
        clone2._x_ignore = true;
      });
      cleanup2(() => clone2.remove());
    });
    var handler = () => {
    };
    handler.inline = (el, { modifiers }, { cleanup: cleanup2 }) => {
      modifiers.includes("self") ? el._x_ignoreSelf = true : el._x_ignore = true;
      cleanup2(() => {
        modifiers.includes("self") ? delete el._x_ignoreSelf : delete el._x_ignore;
      });
    };
    directive("ignore", handler);
    directive("effect", (el, { expression }, { effect: effect3 }) => effect3(evaluateLater(el, expression)));
    function on(el, event, modifiers, callback) {
      let listenerTarget = el;
      let handler3 = (e) => callback(e);
      let options = {};
      let wrapHandler = (callback2, wrapper) => (e) => wrapper(callback2, e);
      if (modifiers.includes("dot"))
        event = dotSyntax(event);
      if (modifiers.includes("camel"))
        event = camelCase2(event);
      if (modifiers.includes("passive"))
        options.passive = true;
      if (modifiers.includes("capture"))
        options.capture = true;
      if (modifiers.includes("window"))
        listenerTarget = window;
      if (modifiers.includes("document"))
        listenerTarget = document;
      if (modifiers.includes("prevent"))
        handler3 = wrapHandler(handler3, (next, e) => {
          e.preventDefault();
          next(e);
        });
      if (modifiers.includes("stop"))
        handler3 = wrapHandler(handler3, (next, e) => {
          e.stopPropagation();
          next(e);
        });
      if (modifiers.includes("self"))
        handler3 = wrapHandler(handler3, (next, e) => {
          e.target === el && next(e);
        });
      if (modifiers.includes("away") || modifiers.includes("outside")) {
        listenerTarget = document;
        handler3 = wrapHandler(handler3, (next, e) => {
          if (el.contains(e.target))
            return;
          if (el.offsetWidth < 1 && el.offsetHeight < 1)
            return;
          if (el._x_isShown === false)
            return;
          next(e);
        });
      }
      handler3 = wrapHandler(handler3, (next, e) => {
        if (isKeyEvent(event)) {
          if (isListeningForASpecificKeyThatHasntBeenPressed(e, modifiers)) {
            return;
          }
        }
        next(e);
      });
      if (modifiers.includes("debounce")) {
        let nextModifier = modifiers[modifiers.indexOf("debounce") + 1] || "invalid-wait";
        let wait = isNumeric(nextModifier.split("ms")[0]) ? Number(nextModifier.split("ms")[0]) : 250;
        handler3 = debounce(handler3, wait);
      }
      if (modifiers.includes("throttle")) {
        let nextModifier = modifiers[modifiers.indexOf("throttle") + 1] || "invalid-wait";
        let wait = isNumeric(nextModifier.split("ms")[0]) ? Number(nextModifier.split("ms")[0]) : 250;
        handler3 = throttle(handler3, wait);
      }
      if (modifiers.includes("once")) {
        handler3 = wrapHandler(handler3, (next, e) => {
          next(e);
          listenerTarget.removeEventListener(event, handler3, options);
        });
      }
      listenerTarget.addEventListener(event, handler3, options);
      return () => {
        listenerTarget.removeEventListener(event, handler3, options);
      };
    }
    function dotSyntax(subject) {
      return subject.replace(/-/g, ".");
    }
    function camelCase2(subject) {
      return subject.toLowerCase().replace(/-(\w)/g, (match, char) => char.toUpperCase());
    }
    function isNumeric(subject) {
      return !Array.isArray(subject) && !isNaN(subject);
    }
    function kebabCase2(subject) {
      return subject.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[_\s]/, "-").toLowerCase();
    }
    function isKeyEvent(event) {
      return ["keydown", "keyup"].includes(event);
    }
    function isListeningForASpecificKeyThatHasntBeenPressed(e, modifiers) {
      let keyModifiers = modifiers.filter((i) => {
        return !["window", "document", "prevent", "stop", "once"].includes(i);
      });
      if (keyModifiers.includes("debounce")) {
        let debounceIndex = keyModifiers.indexOf("debounce");
        keyModifiers.splice(debounceIndex, isNumeric((keyModifiers[debounceIndex + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
      }
      if (keyModifiers.length === 0)
        return false;
      if (keyModifiers.length === 1 && keyToModifiers(e.key).includes(keyModifiers[0]))
        return false;
      const systemKeyModifiers = ["ctrl", "shift", "alt", "meta", "cmd", "super"];
      const selectedSystemKeyModifiers = systemKeyModifiers.filter((modifier) => keyModifiers.includes(modifier));
      keyModifiers = keyModifiers.filter((i) => !selectedSystemKeyModifiers.includes(i));
      if (selectedSystemKeyModifiers.length > 0) {
        const activelyPressedKeyModifiers = selectedSystemKeyModifiers.filter((modifier) => {
          if (modifier === "cmd" || modifier === "super")
            modifier = "meta";
          return e[`${modifier}Key`];
        });
        if (activelyPressedKeyModifiers.length === selectedSystemKeyModifiers.length) {
          if (keyToModifiers(e.key).includes(keyModifiers[0]))
            return false;
        }
      }
      return true;
    }
    function keyToModifiers(key) {
      if (!key)
        return [];
      key = kebabCase2(key);
      let modifierToKeyMap = {
        ctrl: "control",
        slash: "/",
        space: "-",
        spacebar: "-",
        cmd: "meta",
        esc: "escape",
        up: "arrow-up",
        down: "arrow-down",
        left: "arrow-left",
        right: "arrow-right",
        period: ".",
        equal: "="
      };
      modifierToKeyMap[key] = key;
      return Object.keys(modifierToKeyMap).map((modifier) => {
        if (modifierToKeyMap[modifier] === key)
          return modifier;
      }).filter((modifier) => modifier);
    }
    directive("model", (el, { modifiers, expression }, { effect: effect3, cleanup: cleanup2 }) => {
      let evaluate2 = evaluateLater(el, expression);
      let assignmentExpression = `${expression} = rightSideOfExpression($event, ${expression})`;
      let evaluateAssignment = evaluateLater(el, assignmentExpression);
      var event = el.tagName.toLowerCase() === "select" || ["checkbox", "radio"].includes(el.type) || modifiers.includes("lazy") ? "change" : "input";
      let assigmentFunction = generateAssignmentFunction(el, modifiers, expression);
      let removeListener = on(el, event, modifiers, (e) => {
        evaluateAssignment(() => {
        }, { scope: {
          $event: e,
          rightSideOfExpression: assigmentFunction
        } });
      });
      cleanup2(() => removeListener());
      let evaluateSetModel = evaluateLater(el, `${expression} = __placeholder`);
      el._x_model = {
        get() {
          let result;
          evaluate2((value) => result = value);
          return result;
        },
        set(value) {
          evaluateSetModel(() => {
          }, { scope: { __placeholder: value } });
        }
      };
      el._x_forceModelUpdate = () => {
        evaluate2((value) => {
          if (value === void 0 && expression.match(/\./))
            value = "";
          window.fromModel = true;
          mutateDom(() => bind(el, "value", value));
          delete window.fromModel;
        });
      };
      effect3(() => {
        if (modifiers.includes("unintrusive") && document.activeElement.isSameNode(el))
          return;
        el._x_forceModelUpdate();
      });
    });
    function generateAssignmentFunction(el, modifiers, expression) {
      if (el.type === "radio") {
        mutateDom(() => {
          if (!el.hasAttribute("name"))
            el.setAttribute("name", expression);
        });
      }
      return (event, currentValue) => {
        return mutateDom(() => {
          if (event instanceof CustomEvent && event.detail !== void 0) {
            return event.detail || event.target.value;
          } else if (el.type === "checkbox") {
            if (Array.isArray(currentValue)) {
              let newValue = modifiers.includes("number") ? safeParseNumber(event.target.value) : event.target.value;
              return event.target.checked ? currentValue.concat([newValue]) : currentValue.filter((el2) => !checkedAttrLooseCompare2(el2, newValue));
            } else {
              return event.target.checked;
            }
          } else if (el.tagName.toLowerCase() === "select" && el.multiple) {
            return modifiers.includes("number") ? Array.from(event.target.selectedOptions).map((option) => {
              let rawValue = option.value || option.text;
              return safeParseNumber(rawValue);
            }) : Array.from(event.target.selectedOptions).map((option) => {
              return option.value || option.text;
            });
          } else {
            let rawValue = event.target.value;
            return modifiers.includes("number") ? safeParseNumber(rawValue) : modifiers.includes("trim") ? rawValue.trim() : rawValue;
          }
        });
      };
    }
    function safeParseNumber(rawValue) {
      let number = rawValue ? parseFloat(rawValue) : null;
      return isNumeric2(number) ? number : rawValue;
    }
    function checkedAttrLooseCompare2(valueA, valueB) {
      return valueA == valueB;
    }
    function isNumeric2(subject) {
      return !Array.isArray(subject) && !isNaN(subject);
    }
    directive("cloak", (el) => queueMicrotask(() => mutateDom(() => el.removeAttribute(prefix("cloak")))));
    addInitSelector(() => `[${prefix("init")}]`);
    directive("init", skipDuringClone((el, { expression }) => {
      if (typeof expression === "string") {
        return !!expression.trim() && evaluate(el, expression, {}, false);
      }
      return evaluate(el, expression, {}, false);
    }));
    directive("text", (el, { expression }, { effect: effect3, evaluateLater: evaluateLater2 }) => {
      let evaluate2 = evaluateLater2(expression);
      effect3(() => {
        evaluate2((value) => {
          mutateDom(() => {
            el.textContent = value;
          });
        });
      });
    });
    directive("html", (el, { expression }, { effect: effect3, evaluateLater: evaluateLater2 }) => {
      let evaluate2 = evaluateLater2(expression);
      effect3(() => {
        evaluate2((value) => {
          el.innerHTML = value;
        });
      });
    });
    mapAttributes(startingWith(":", into(prefix("bind:"))));
    directive("bind", (el, { value, modifiers, expression, original }, { effect: effect3 }) => {
      if (!value) {
        return applyBindingsObject(el, expression, original, effect3);
      }
      if (value === "key")
        return storeKeyForXFor(el, expression);
      let evaluate2 = evaluateLater(el, expression);
      effect3(() => evaluate2((result) => {
        if (result === void 0 && expression.match(/\./))
          result = "";
        mutateDom(() => bind(el, value, result, modifiers));
      }));
    });
    function applyBindingsObject(el, expression, original, effect3) {
      let bindingProviders = {};
      injectBindingProviders(bindingProviders);
      let getBindings = evaluateLater(el, expression);
      let cleanupRunners = [];
      while (cleanupRunners.length)
        cleanupRunners.pop()();
      getBindings((bindings) => {
        let attributes = Object.entries(bindings).map(([name, value]) => ({ name, value }));
        let staticAttributes = attributesOnly(attributes);
        attributes = attributes.map((attribute) => {
          if (staticAttributes.find((attr) => attr.name === attribute.name)) {
            return {
              name: `x-bind:${attribute.name}`,
              value: `"${attribute.value}"`
            };
          }
          return attribute;
        });
        directives(el, attributes, original).map((handle) => {
          cleanupRunners.push(handle.runCleanups);
          handle();
        });
      }, { scope: bindingProviders });
    }
    function storeKeyForXFor(el, expression) {
      el._x_keyExpression = expression;
    }
    addRootSelector(() => `[${prefix("data")}]`);
    directive("data", skipDuringClone((el, { expression }, { cleanup: cleanup2 }) => {
      expression = expression === "" ? "{}" : expression;
      let magicContext = {};
      injectMagics(magicContext, el);
      let dataProviderContext = {};
      injectDataProviders(dataProviderContext, magicContext);
      let data2 = evaluate(el, expression, { scope: dataProviderContext });
      if (data2 === void 0)
        data2 = {};
      injectMagics(data2, el);
      let reactiveData = reactive(data2);
      initInterceptors(reactiveData);
      let undo = addScopeToNode(el, reactiveData);
      reactiveData["init"] && evaluate(el, reactiveData["init"]);
      cleanup2(() => {
        undo();
        reactiveData["destroy"] && evaluate(el, reactiveData["destroy"]);
      });
    }));
    directive("show", (el, { modifiers, expression }, { effect: effect3 }) => {
      let evaluate2 = evaluateLater(el, expression);
      let hide = () => mutateDom(() => {
        el.style.display = "none";
        el._x_isShown = false;
      });
      let show = () => mutateDom(() => {
        if (el.style.length === 1 && el.style.display === "none") {
          el.removeAttribute("style");
        } else {
          el.style.removeProperty("display");
        }
        el._x_isShown = true;
      });
      let clickAwayCompatibleShow = () => setTimeout(show);
      let toggle = once((value) => value ? show() : hide(), (value) => {
        if (typeof el._x_toggleAndCascadeWithTransitions === "function") {
          el._x_toggleAndCascadeWithTransitions(el, value, show, hide);
        } else {
          value ? clickAwayCompatibleShow() : hide();
        }
      });
      let oldValue;
      let firstTime = true;
      effect3(() => evaluate2((value) => {
        if (!firstTime && value === oldValue)
          return;
        if (modifiers.includes("immediate"))
          value ? clickAwayCompatibleShow() : hide();
        toggle(value);
        oldValue = value;
        firstTime = false;
      }));
    });
    directive("for", (el, { expression }, { effect: effect3, cleanup: cleanup2 }) => {
      let iteratorNames = parseForExpression(expression);
      let evaluateItems = evaluateLater(el, iteratorNames.items);
      let evaluateKey = evaluateLater(el, el._x_keyExpression || "index");
      el._x_prevKeys = [];
      el._x_lookup = {};
      effect3(() => loop(el, iteratorNames, evaluateItems, evaluateKey));
      cleanup2(() => {
        Object.values(el._x_lookup).forEach((el2) => el2.remove());
        delete el._x_prevKeys;
        delete el._x_lookup;
      });
    });
    function loop(el, iteratorNames, evaluateItems, evaluateKey) {
      let isObject2 = (i) => typeof i === "object" && !Array.isArray(i);
      let templateEl = el;
      evaluateItems((items) => {
        if (isNumeric3(items) && items >= 0) {
          items = Array.from(Array(items).keys(), (i) => i + 1);
        }
        if (items === void 0)
          items = [];
        let lookup = el._x_lookup;
        let prevKeys = el._x_prevKeys;
        let scopes = [];
        let keys = [];
        if (isObject2(items)) {
          items = Object.entries(items).map(([key, value]) => {
            let scope2 = getIterationScopeVariables(iteratorNames, value, key, items);
            evaluateKey((value2) => keys.push(value2), { scope: { index: key, ...scope2 } });
            scopes.push(scope2);
          });
        } else {
          for (let i = 0; i < items.length; i++) {
            let scope2 = getIterationScopeVariables(iteratorNames, items[i], i, items);
            evaluateKey((value) => keys.push(value), { scope: { index: i, ...scope2 } });
            scopes.push(scope2);
          }
        }
        let adds = [];
        let moves = [];
        let removes = [];
        let sames = [];
        for (let i = 0; i < prevKeys.length; i++) {
          let key = prevKeys[i];
          if (keys.indexOf(key) === -1)
            removes.push(key);
        }
        prevKeys = prevKeys.filter((key) => !removes.includes(key));
        let lastKey = "template";
        for (let i = 0; i < keys.length; i++) {
          let key = keys[i];
          let prevIndex = prevKeys.indexOf(key);
          if (prevIndex === -1) {
            prevKeys.splice(i, 0, key);
            adds.push([lastKey, i]);
          } else if (prevIndex !== i) {
            let keyInSpot = prevKeys.splice(i, 1)[0];
            let keyForSpot = prevKeys.splice(prevIndex - 1, 1)[0];
            prevKeys.splice(i, 0, keyForSpot);
            prevKeys.splice(prevIndex, 0, keyInSpot);
            moves.push([keyInSpot, keyForSpot]);
          } else {
            sames.push(key);
          }
          lastKey = key;
        }
        for (let i = 0; i < removes.length; i++) {
          let key = removes[i];
          if (!!lookup[key]._x_effects) {
            lookup[key]._x_effects.forEach(dequeueJob);
          }
          lookup[key].remove();
          lookup[key] = null;
          delete lookup[key];
        }
        for (let i = 0; i < moves.length; i++) {
          let [keyInSpot, keyForSpot] = moves[i];
          let elInSpot = lookup[keyInSpot];
          let elForSpot = lookup[keyForSpot];
          let marker = document.createElement("div");
          mutateDom(() => {
            elForSpot.after(marker);
            elInSpot.after(elForSpot);
            elForSpot._x_currentIfEl && elForSpot.after(elForSpot._x_currentIfEl);
            marker.before(elInSpot);
            elInSpot._x_currentIfEl && elInSpot.after(elInSpot._x_currentIfEl);
            marker.remove();
          });
          refreshScope(elForSpot, scopes[keys.indexOf(keyForSpot)]);
        }
        for (let i = 0; i < adds.length; i++) {
          let [lastKey2, index] = adds[i];
          let lastEl = lastKey2 === "template" ? templateEl : lookup[lastKey2];
          if (lastEl._x_currentIfEl)
            lastEl = lastEl._x_currentIfEl;
          let scope2 = scopes[index];
          let key = keys[index];
          let clone2 = document.importNode(templateEl.content, true).firstElementChild;
          addScopeToNode(clone2, reactive(scope2), templateEl);
          mutateDom(() => {
            lastEl.after(clone2);
            initTree(clone2);
          });
          if (typeof key === "object") {
            warn("x-for key cannot be an object, it must be a string or an integer", templateEl);
          }
          lookup[key] = clone2;
        }
        for (let i = 0; i < sames.length; i++) {
          refreshScope(lookup[sames[i]], scopes[keys.indexOf(sames[i])]);
        }
        templateEl._x_prevKeys = keys;
      });
    }
    function parseForExpression(expression) {
      let forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/;
      let stripParensRE = /^\s*\(|\)\s*$/g;
      let forAliasRE = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/;
      let inMatch = expression.match(forAliasRE);
      if (!inMatch)
        return;
      let res = {};
      res.items = inMatch[2].trim();
      let item = inMatch[1].replace(stripParensRE, "").trim();
      let iteratorMatch = item.match(forIteratorRE);
      if (iteratorMatch) {
        res.item = item.replace(forIteratorRE, "").trim();
        res.index = iteratorMatch[1].trim();
        if (iteratorMatch[2]) {
          res.collection = iteratorMatch[2].trim();
        }
      } else {
        res.item = item;
      }
      return res;
    }
    function getIterationScopeVariables(iteratorNames, item, index, items) {
      let scopeVariables = {};
      if (/^\[.*\]$/.test(iteratorNames.item) && Array.isArray(item)) {
        let names = iteratorNames.item.replace("[", "").replace("]", "").split(",").map((i) => i.trim());
        names.forEach((name, i) => {
          scopeVariables[name] = item[i];
        });
      } else if (/^\{.*\}$/.test(iteratorNames.item) && !Array.isArray(item) && typeof item === "object") {
        let names = iteratorNames.item.replace("{", "").replace("}", "").split(",").map((i) => i.trim());
        names.forEach((name) => {
          scopeVariables[name] = item[name];
        });
      } else {
        scopeVariables[iteratorNames.item] = item;
      }
      if (iteratorNames.index)
        scopeVariables[iteratorNames.index] = index;
      if (iteratorNames.collection)
        scopeVariables[iteratorNames.collection] = items;
      return scopeVariables;
    }
    function isNumeric3(subject) {
      return !Array.isArray(subject) && !isNaN(subject);
    }
    function handler2() {
    }
    handler2.inline = (el, { expression }, { cleanup: cleanup2 }) => {
      let root = closestRoot(el);
      if (!root._x_refs)
        root._x_refs = {};
      root._x_refs[expression] = el;
      cleanup2(() => delete root._x_refs[expression]);
    };
    directive("ref", handler2);
    directive("if", (el, { expression }, { effect: effect3, cleanup: cleanup2 }) => {
      let evaluate2 = evaluateLater(el, expression);
      let show = () => {
        if (el._x_currentIfEl)
          return el._x_currentIfEl;
        let clone2 = el.content.cloneNode(true).firstElementChild;
        addScopeToNode(clone2, {}, el);
        mutateDom(() => {
          el.after(clone2);
          initTree(clone2);
        });
        el._x_currentIfEl = clone2;
        el._x_undoIf = () => {
          walk(clone2, (node) => {
            if (!!node._x_effects) {
              node._x_effects.forEach(dequeueJob);
            }
          });
          clone2.remove();
          delete el._x_currentIfEl;
        };
        return clone2;
      };
      let hide = () => {
        if (!el._x_undoIf)
          return;
        el._x_undoIf();
        delete el._x_undoIf;
      };
      effect3(() => evaluate2((value) => {
        value ? show() : hide();
      }));
      cleanup2(() => el._x_undoIf && el._x_undoIf());
    });
    directive("id", (el, { expression }, { evaluate: evaluate2 }) => {
      let names = evaluate2(expression);
      names.forEach((name) => setIdRoot(el, name));
    });
    mapAttributes(startingWith("@", into(prefix("on:"))));
    directive("on", skipDuringClone((el, { value, modifiers, expression }, { cleanup: cleanup2 }) => {
      let evaluate2 = expression ? evaluateLater(el, expression) : () => {
      };
      if (el.tagName.toLowerCase() === "template") {
        if (!el._x_forwardEvents)
          el._x_forwardEvents = [];
        if (!el._x_forwardEvents.includes(value))
          el._x_forwardEvents.push(value);
      }
      let removeListener = on(el, value, modifiers, (e) => {
        evaluate2(() => {
        }, { scope: { $event: e }, params: [e] });
      });
      cleanup2(() => removeListener());
    }));
    alpine_default.setEvaluator(normalEvaluator);
    alpine_default.setReactivityEngine({ reactive: reactive2, effect: effect2, release: stop, raw: toRaw });
    var src_default = alpine_default;
    window.Alpine = src_default;
    queueMicrotask(() => {
      src_default.start();
    });
  })();

  // js/webrequest-ui.js
  var import_core = __toESM(require_core());

  // js/webrequest-form.js
  var forms = document.querySelectorAll("form[webrequest]");
  var isHtml = (input) => /<[a-z]+\d?(\s+[\w-]+=("[^"]*"|'[^']*'))*\s*\/?>|&#?\w+;/i.test(input);
  forms.forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const url = form.getAttribute("action") || document.location.origin + document.location.pathname;
      const outputId = form.getAttribute("webrequest") || "webrequest-output";
      const body = new URLSearchParams();
      const headers = {};
      for (const pair of new FormData(form)) {
        if (pair[0] != "Authorization") {
          body.append(pair[0], pair[1] + "");
        } else {
          headers[pair[0]] = pair[1] + "";
        }
      }
      let output = document.getElementById(outputId);
      if (!output) {
        output = document.createElement("div");
        output.setAttribute("id", outputId);
        form.appendChild(output);
      }
      fetch(url, {
        headers,
        method: "POST",
        body,
        mode: "cors"
      }).then((response) => {
        output.parentElement.style.display = "block";
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.startsWith("image/")) {
          return response.blob().then((blob) => {
            let reader = new FileReader();
            reader.onload = () => {
              output.innerHTML = '<div class="form-control image-output" id="' + outputId + '-image"></div>';
              let img = document.createElement("img");
              img.src = reader.result;
              document.getElementById(outputId + "-image").appendChild(img);
            };
            reader.readAsDataURL(blob);
          });
        } else {
          return response.text().then((text) => {
            if (isHtml(text)) {
              output.innerHTML = '<div class="form-control html-output" id="' + outputId + '-html"></div>';
              document.getElementById(outputId + "-html").innerHTML = text;
            } else {
              output.innerHTML = '<textarea class="form-control text-output" id="' + outputId + '-text" rows="4" readonly></textarea>';
              document.getElementById(outputId + "-text").value = text;
            }
          });
        }
      });
    }, false);
  });
})();
//# sourceMappingURL=webrequest-ui.js.map
