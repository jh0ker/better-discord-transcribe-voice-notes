/**
 * @name TranscribeVoiceNotes
 * @version 0.0.1
 * @author jh0ker
 * @authorId 325250926795554816
 * @description Transcribes voice notes in Discord using STT (speech-to-text). Requires your own OpenAI API key (or compatible API).
 */
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
(function(React) {
  "use strict";
  function _interopNamespaceDefault(e) {
    const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
    if (e) {
      for (const k in e) {
        if (k !== "default") {
          const d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: () => e[k]
          });
        }
      }
    }
    n.default = e;
    return Object.freeze(n);
  }
  const React__namespace = /* @__PURE__ */ _interopNamespaceDefault(React);
  class Subscribable {
    constructor() {
      this.listeners = /* @__PURE__ */ new Set();
      this.subscribe = this.subscribe.bind(this);
    }
    subscribe(listener) {
      const identity = {
        listener
      };
      this.listeners.add(identity);
      this.onSubscribe();
      return () => {
        this.listeners.delete(identity);
        this.onUnsubscribe();
      };
    }
    hasListeners() {
      return this.listeners.size > 0;
    }
    onSubscribe() {
    }
    onUnsubscribe() {
    }
  }
  const isServer = typeof window === "undefined" || "Deno" in window;
  function noop$1() {
    return void 0;
  }
  function functionalUpdate(updater, input) {
    return typeof updater === "function" ? updater(input) : updater;
  }
  function isValidTimeout(value) {
    return typeof value === "number" && value >= 0 && value !== Infinity;
  }
  function timeUntilStale(updatedAt, staleTime) {
    return Math.max(updatedAt + (staleTime || 0) - Date.now(), 0);
  }
  function parseQueryArgs(arg1, arg2, arg3) {
    if (!isQueryKey(arg1)) {
      return arg1;
    }
    if (typeof arg2 === "function") {
      return {
        ...arg3,
        queryKey: arg1,
        queryFn: arg2
      };
    }
    return {
      ...arg2,
      queryKey: arg1
    };
  }
  function parseMutationArgs(arg1, arg2, arg3) {
    if (isQueryKey(arg1)) {
      if (typeof arg2 === "function") {
        return {
          ...arg3,
          mutationKey: arg1,
          mutationFn: arg2
        };
      }
      return {
        ...arg2,
        mutationKey: arg1
      };
    }
    if (typeof arg1 === "function") {
      return {
        ...arg2,
        mutationFn: arg1
      };
    }
    return {
      ...arg1
    };
  }
  function parseFilterArgs(arg1, arg2, arg3) {
    return isQueryKey(arg1) ? [{
      ...arg2,
      queryKey: arg1
    }, arg3] : [arg1 || {}, arg2];
  }
  function matchQuery(filters, query) {
    const {
      type = "all",
      exact,
      fetchStatus,
      predicate,
      queryKey,
      stale
    } = filters;
    if (isQueryKey(queryKey)) {
      if (exact) {
        if (query.queryHash !== hashQueryKeyByOptions(queryKey, query.options)) {
          return false;
        }
      } else if (!partialMatchKey(query.queryKey, queryKey)) {
        return false;
      }
    }
    if (type !== "all") {
      const isActive = query.isActive();
      if (type === "active" && !isActive) {
        return false;
      }
      if (type === "inactive" && isActive) {
        return false;
      }
    }
    if (typeof stale === "boolean" && query.isStale() !== stale) {
      return false;
    }
    if (typeof fetchStatus !== "undefined" && fetchStatus !== query.state.fetchStatus) {
      return false;
    }
    if (predicate && !predicate(query)) {
      return false;
    }
    return true;
  }
  function matchMutation(filters, mutation) {
    const {
      exact,
      fetching,
      predicate,
      mutationKey
    } = filters;
    if (isQueryKey(mutationKey)) {
      if (!mutation.options.mutationKey) {
        return false;
      }
      if (exact) {
        if (hashQueryKey(mutation.options.mutationKey) !== hashQueryKey(mutationKey)) {
          return false;
        }
      } else if (!partialMatchKey(mutation.options.mutationKey, mutationKey)) {
        return false;
      }
    }
    if (typeof fetching === "boolean" && mutation.state.status === "loading" !== fetching) {
      return false;
    }
    if (predicate && !predicate(mutation)) {
      return false;
    }
    return true;
  }
  function hashQueryKeyByOptions(queryKey, options) {
    const hashFn = (options == null ? void 0 : options.queryKeyHashFn) || hashQueryKey;
    return hashFn(queryKey);
  }
  function hashQueryKey(queryKey) {
    return JSON.stringify(queryKey, (_, val) => isPlainObject(val) ? Object.keys(val).sort().reduce((result, key) => {
      result[key] = val[key];
      return result;
    }, {}) : val);
  }
  function partialMatchKey(a, b) {
    return partialDeepEqual(a, b);
  }
  function partialDeepEqual(a, b) {
    if (a === b) {
      return true;
    }
    if (typeof a !== typeof b) {
      return false;
    }
    if (a && b && typeof a === "object" && typeof b === "object") {
      return !Object.keys(b).some((key) => !partialDeepEqual(a[key], b[key]));
    }
    return false;
  }
  function replaceEqualDeep(a, b) {
    if (a === b) {
      return a;
    }
    const array = isPlainArray(a) && isPlainArray(b);
    if (array || isPlainObject(a) && isPlainObject(b)) {
      const aSize = array ? a.length : Object.keys(a).length;
      const bItems = array ? b : Object.keys(b);
      const bSize = bItems.length;
      const copy = array ? [] : {};
      let equalItems = 0;
      for (let i = 0; i < bSize; i++) {
        const key = array ? i : bItems[i];
        copy[key] = replaceEqualDeep(a[key], b[key]);
        if (copy[key] === a[key]) {
          equalItems++;
        }
      }
      return aSize === bSize && equalItems === aSize ? a : copy;
    }
    return b;
  }
  function shallowEqualObjects(a, b) {
    if (a && !b || b && !a) {
      return false;
    }
    for (const key in a) {
      if (a[key] !== b[key]) {
        return false;
      }
    }
    return true;
  }
  function isPlainArray(value) {
    return Array.isArray(value) && value.length === Object.keys(value).length;
  }
  function isPlainObject(o) {
    if (!hasObjectPrototype(o)) {
      return false;
    }
    const ctor = o.constructor;
    if (typeof ctor === "undefined") {
      return true;
    }
    const prot = ctor.prototype;
    if (!hasObjectPrototype(prot)) {
      return false;
    }
    if (!prot.hasOwnProperty("isPrototypeOf")) {
      return false;
    }
    return true;
  }
  function hasObjectPrototype(o) {
    return Object.prototype.toString.call(o) === "[object Object]";
  }
  function isQueryKey(value) {
    return Array.isArray(value);
  }
  function sleep$1(timeout) {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  }
  function scheduleMicrotask(callback) {
    sleep$1(0).then(callback);
  }
  function getAbortController() {
    if (typeof AbortController === "function") {
      return new AbortController();
    }
    return;
  }
  function replaceData(prevData, data, options) {
    if (options.isDataEqual != null && options.isDataEqual(prevData, data)) {
      return prevData;
    } else if (typeof options.structuralSharing === "function") {
      return options.structuralSharing(prevData, data);
    } else if (options.structuralSharing !== false) {
      return replaceEqualDeep(prevData, data);
    }
    return data;
  }
  class FocusManager extends Subscribable {
    constructor() {
      super();
      this.setup = (onFocus) => {
        if (!isServer && window.addEventListener) {
          const listener = () => onFocus();
          window.addEventListener("visibilitychange", listener, false);
          window.addEventListener("focus", listener, false);
          return () => {
            window.removeEventListener("visibilitychange", listener);
            window.removeEventListener("focus", listener);
          };
        }
        return;
      };
    }
    onSubscribe() {
      if (!this.cleanup) {
        this.setEventListener(this.setup);
      }
    }
    onUnsubscribe() {
      if (!this.hasListeners()) {
        var _this$cleanup;
        (_this$cleanup = this.cleanup) == null ? void 0 : _this$cleanup.call(this);
        this.cleanup = void 0;
      }
    }
    setEventListener(setup) {
      var _this$cleanup2;
      this.setup = setup;
      (_this$cleanup2 = this.cleanup) == null ? void 0 : _this$cleanup2.call(this);
      this.cleanup = setup((focused) => {
        if (typeof focused === "boolean") {
          this.setFocused(focused);
        } else {
          this.onFocus();
        }
      });
    }
    setFocused(focused) {
      const changed = this.focused !== focused;
      if (changed) {
        this.focused = focused;
        this.onFocus();
      }
    }
    onFocus() {
      this.listeners.forEach(({
        listener
      }) => {
        listener();
      });
    }
    isFocused() {
      if (typeof this.focused === "boolean") {
        return this.focused;
      }
      if (typeof document === "undefined") {
        return true;
      }
      return [void 0, "visible", "prerender"].includes(document.visibilityState);
    }
  }
  const focusManager = new FocusManager();
  const onlineEvents = ["online", "offline"];
  class OnlineManager extends Subscribable {
    constructor() {
      super();
      this.setup = (onOnline) => {
        if (!isServer && window.addEventListener) {
          const listener = () => onOnline();
          onlineEvents.forEach((event) => {
            window.addEventListener(event, listener, false);
          });
          return () => {
            onlineEvents.forEach((event) => {
              window.removeEventListener(event, listener);
            });
          };
        }
        return;
      };
    }
    onSubscribe() {
      if (!this.cleanup) {
        this.setEventListener(this.setup);
      }
    }
    onUnsubscribe() {
      if (!this.hasListeners()) {
        var _this$cleanup;
        (_this$cleanup = this.cleanup) == null ? void 0 : _this$cleanup.call(this);
        this.cleanup = void 0;
      }
    }
    setEventListener(setup) {
      var _this$cleanup2;
      this.setup = setup;
      (_this$cleanup2 = this.cleanup) == null ? void 0 : _this$cleanup2.call(this);
      this.cleanup = setup((online) => {
        if (typeof online === "boolean") {
          this.setOnline(online);
        } else {
          this.onOnline();
        }
      });
    }
    setOnline(online) {
      const changed = this.online !== online;
      if (changed) {
        this.online = online;
        this.onOnline();
      }
    }
    onOnline() {
      this.listeners.forEach(({
        listener
      }) => {
        listener();
      });
    }
    isOnline() {
      if (typeof this.online === "boolean") {
        return this.online;
      }
      if (typeof navigator === "undefined" || typeof navigator.onLine === "undefined") {
        return true;
      }
      return navigator.onLine;
    }
  }
  const onlineManager = new OnlineManager();
  function defaultRetryDelay(failureCount) {
    return Math.min(1e3 * 2 ** failureCount, 3e4);
  }
  function canFetch(networkMode) {
    return (networkMode != null ? networkMode : "online") === "online" ? onlineManager.isOnline() : true;
  }
  class CancelledError {
    constructor(options) {
      this.revert = options == null ? void 0 : options.revert;
      this.silent = options == null ? void 0 : options.silent;
    }
  }
  function isCancelledError(value) {
    return value instanceof CancelledError;
  }
  function createRetryer(config) {
    let isRetryCancelled = false;
    let failureCount = 0;
    let isResolved = false;
    let continueFn;
    let promiseResolve;
    let promiseReject;
    const promise = new Promise((outerResolve, outerReject) => {
      promiseResolve = outerResolve;
      promiseReject = outerReject;
    });
    const cancel = (cancelOptions) => {
      if (!isResolved) {
        reject(new CancelledError(cancelOptions));
        config.abort == null ? void 0 : config.abort();
      }
    };
    const cancelRetry = () => {
      isRetryCancelled = true;
    };
    const continueRetry = () => {
      isRetryCancelled = false;
    };
    const shouldPause = () => !focusManager.isFocused() || config.networkMode !== "always" && !onlineManager.isOnline();
    const resolve = (value) => {
      if (!isResolved) {
        isResolved = true;
        config.onSuccess == null ? void 0 : config.onSuccess(value);
        continueFn == null ? void 0 : continueFn();
        promiseResolve(value);
      }
    };
    const reject = (value) => {
      if (!isResolved) {
        isResolved = true;
        config.onError == null ? void 0 : config.onError(value);
        continueFn == null ? void 0 : continueFn();
        promiseReject(value);
      }
    };
    const pause = () => {
      return new Promise((continueResolve) => {
        continueFn = (value) => {
          const canContinue = isResolved || !shouldPause();
          if (canContinue) {
            continueResolve(value);
          }
          return canContinue;
        };
        config.onPause == null ? void 0 : config.onPause();
      }).then(() => {
        continueFn = void 0;
        if (!isResolved) {
          config.onContinue == null ? void 0 : config.onContinue();
        }
      });
    };
    const run = () => {
      if (isResolved) {
        return;
      }
      let promiseOrValue;
      try {
        promiseOrValue = config.fn();
      } catch (error) {
        promiseOrValue = Promise.reject(error);
      }
      Promise.resolve(promiseOrValue).then(resolve).catch((error) => {
        var _config$retry, _config$retryDelay;
        if (isResolved) {
          return;
        }
        const retry = (_config$retry = config.retry) != null ? _config$retry : 3;
        const retryDelay = (_config$retryDelay = config.retryDelay) != null ? _config$retryDelay : defaultRetryDelay;
        const delay = typeof retryDelay === "function" ? retryDelay(failureCount, error) : retryDelay;
        const shouldRetry = retry === true || typeof retry === "number" && failureCount < retry || typeof retry === "function" && retry(failureCount, error);
        if (isRetryCancelled || !shouldRetry) {
          reject(error);
          return;
        }
        failureCount++;
        config.onFail == null ? void 0 : config.onFail(failureCount, error);
        sleep$1(delay).then(() => {
          if (shouldPause()) {
            return pause();
          }
          return;
        }).then(() => {
          if (isRetryCancelled) {
            reject(error);
          } else {
            run();
          }
        });
      });
    };
    if (canFetch(config.networkMode)) {
      run();
    } else {
      pause().then(run);
    }
    return {
      promise,
      cancel,
      continue: () => {
        const didContinue = continueFn == null ? void 0 : continueFn();
        return didContinue ? promise : Promise.resolve();
      },
      cancelRetry,
      continueRetry
    };
  }
  const defaultLogger = console;
  function createNotifyManager() {
    let queue = [];
    let transactions = 0;
    let notifyFn = (callback) => {
      callback();
    };
    let batchNotifyFn = (callback) => {
      callback();
    };
    const batch = (callback) => {
      let result;
      transactions++;
      try {
        result = callback();
      } finally {
        transactions--;
        if (!transactions) {
          flush();
        }
      }
      return result;
    };
    const schedule = (callback) => {
      if (transactions) {
        queue.push(callback);
      } else {
        scheduleMicrotask(() => {
          notifyFn(callback);
        });
      }
    };
    const batchCalls = (callback) => {
      return (...args) => {
        schedule(() => {
          callback(...args);
        });
      };
    };
    const flush = () => {
      const originalQueue = queue;
      queue = [];
      if (originalQueue.length) {
        scheduleMicrotask(() => {
          batchNotifyFn(() => {
            originalQueue.forEach((callback) => {
              notifyFn(callback);
            });
          });
        });
      }
    };
    const setNotifyFunction = (fn) => {
      notifyFn = fn;
    };
    const setBatchNotifyFunction = (fn) => {
      batchNotifyFn = fn;
    };
    return {
      batch,
      batchCalls,
      schedule,
      setNotifyFunction,
      setBatchNotifyFunction
    };
  }
  const notifyManager = createNotifyManager();
  class Removable {
    destroy() {
      this.clearGcTimeout();
    }
    scheduleGc() {
      this.clearGcTimeout();
      if (isValidTimeout(this.cacheTime)) {
        this.gcTimeout = setTimeout(() => {
          this.optionalRemove();
        }, this.cacheTime);
      }
    }
    updateCacheTime(newCacheTime) {
      this.cacheTime = Math.max(this.cacheTime || 0, newCacheTime != null ? newCacheTime : isServer ? Infinity : 5 * 60 * 1e3);
    }
    clearGcTimeout() {
      if (this.gcTimeout) {
        clearTimeout(this.gcTimeout);
        this.gcTimeout = void 0;
      }
    }
  }
  class Query extends Removable {
    constructor(config) {
      super();
      this.abortSignalConsumed = false;
      this.defaultOptions = config.defaultOptions;
      this.setOptions(config.options);
      this.observers = [];
      this.cache = config.cache;
      this.logger = config.logger || defaultLogger;
      this.queryKey = config.queryKey;
      this.queryHash = config.queryHash;
      this.initialState = config.state || getDefaultState$1(this.options);
      this.state = this.initialState;
      this.scheduleGc();
    }
    get meta() {
      return this.options.meta;
    }
    setOptions(options) {
      this.options = {
        ...this.defaultOptions,
        ...options
      };
      this.updateCacheTime(this.options.cacheTime);
    }
    optionalRemove() {
      if (!this.observers.length && this.state.fetchStatus === "idle") {
        this.cache.remove(this);
      }
    }
    setData(newData, options) {
      const data = replaceData(this.state.data, newData, this.options);
      this.dispatch({
        data,
        type: "success",
        dataUpdatedAt: options == null ? void 0 : options.updatedAt,
        manual: options == null ? void 0 : options.manual
      });
      return data;
    }
    setState(state, setStateOptions) {
      this.dispatch({
        type: "setState",
        state,
        setStateOptions
      });
    }
    cancel(options) {
      var _this$retryer;
      const promise = this.promise;
      (_this$retryer = this.retryer) == null ? void 0 : _this$retryer.cancel(options);
      return promise ? promise.then(noop$1).catch(noop$1) : Promise.resolve();
    }
    destroy() {
      super.destroy();
      this.cancel({
        silent: true
      });
    }
    reset() {
      this.destroy();
      this.setState(this.initialState);
    }
    isActive() {
      return this.observers.some((observer) => observer.options.enabled !== false);
    }
    isDisabled() {
      return this.getObserversCount() > 0 && !this.isActive();
    }
    isStale() {
      return this.state.isInvalidated || !this.state.dataUpdatedAt || this.observers.some((observer) => observer.getCurrentResult().isStale);
    }
    isStaleByTime(staleTime = 0) {
      return this.state.isInvalidated || !this.state.dataUpdatedAt || !timeUntilStale(this.state.dataUpdatedAt, staleTime);
    }
    onFocus() {
      var _this$retryer2;
      const observer = this.observers.find((x) => x.shouldFetchOnWindowFocus());
      if (observer) {
        observer.refetch({
          cancelRefetch: false
        });
      }
      (_this$retryer2 = this.retryer) == null ? void 0 : _this$retryer2.continue();
    }
    onOnline() {
      var _this$retryer3;
      const observer = this.observers.find((x) => x.shouldFetchOnReconnect());
      if (observer) {
        observer.refetch({
          cancelRefetch: false
        });
      }
      (_this$retryer3 = this.retryer) == null ? void 0 : _this$retryer3.continue();
    }
    addObserver(observer) {
      if (!this.observers.includes(observer)) {
        this.observers.push(observer);
        this.clearGcTimeout();
        this.cache.notify({
          type: "observerAdded",
          query: this,
          observer
        });
      }
    }
    removeObserver(observer) {
      if (this.observers.includes(observer)) {
        this.observers = this.observers.filter((x) => x !== observer);
        if (!this.observers.length) {
          if (this.retryer) {
            if (this.abortSignalConsumed) {
              this.retryer.cancel({
                revert: true
              });
            } else {
              this.retryer.cancelRetry();
            }
          }
          this.scheduleGc();
        }
        this.cache.notify({
          type: "observerRemoved",
          query: this,
          observer
        });
      }
    }
    getObserversCount() {
      return this.observers.length;
    }
    invalidate() {
      if (!this.state.isInvalidated) {
        this.dispatch({
          type: "invalidate"
        });
      }
    }
    fetch(options, fetchOptions) {
      var _this$options$behavio, _context$fetchOptions;
      if (this.state.fetchStatus !== "idle") {
        if (this.state.dataUpdatedAt && fetchOptions != null && fetchOptions.cancelRefetch) {
          this.cancel({
            silent: true
          });
        } else if (this.promise) {
          var _this$retryer4;
          (_this$retryer4 = this.retryer) == null ? void 0 : _this$retryer4.continueRetry();
          return this.promise;
        }
      }
      if (options) {
        this.setOptions(options);
      }
      if (!this.options.queryFn) {
        const observer = this.observers.find((x) => x.options.queryFn);
        if (observer) {
          this.setOptions(observer.options);
        }
      }
      if (process.env.NODE_ENV !== "production") {
        if (!Array.isArray(this.options.queryKey)) {
          this.logger.error("As of v4, queryKey needs to be an Array. If you are using a string like 'repoData', please change it to an Array, e.g. ['repoData']");
        }
      }
      const abortController = getAbortController();
      const queryFnContext = {
        queryKey: this.queryKey,
        pageParam: void 0,
        meta: this.meta
      };
      const addSignalProperty = (object) => {
        Object.defineProperty(object, "signal", {
          enumerable: true,
          get: () => {
            if (abortController) {
              this.abortSignalConsumed = true;
              return abortController.signal;
            }
            return void 0;
          }
        });
      };
      addSignalProperty(queryFnContext);
      const fetchFn = () => {
        if (!this.options.queryFn) {
          return Promise.reject("Missing queryFn for queryKey '" + this.options.queryHash + "'");
        }
        this.abortSignalConsumed = false;
        return this.options.queryFn(queryFnContext);
      };
      const context = {
        fetchOptions,
        options: this.options,
        queryKey: this.queryKey,
        state: this.state,
        fetchFn
      };
      addSignalProperty(context);
      (_this$options$behavio = this.options.behavior) == null ? void 0 : _this$options$behavio.onFetch(context);
      this.revertState = this.state;
      if (this.state.fetchStatus === "idle" || this.state.fetchMeta !== ((_context$fetchOptions = context.fetchOptions) == null ? void 0 : _context$fetchOptions.meta)) {
        var _context$fetchOptions2;
        this.dispatch({
          type: "fetch",
          meta: (_context$fetchOptions2 = context.fetchOptions) == null ? void 0 : _context$fetchOptions2.meta
        });
      }
      const onError = (error) => {
        if (!(isCancelledError(error) && error.silent)) {
          this.dispatch({
            type: "error",
            error
          });
        }
        if (!isCancelledError(error)) {
          var _this$cache$config$on, _this$cache$config, _this$cache$config$on2, _this$cache$config2;
          (_this$cache$config$on = (_this$cache$config = this.cache.config).onError) == null ? void 0 : _this$cache$config$on.call(_this$cache$config, error, this);
          (_this$cache$config$on2 = (_this$cache$config2 = this.cache.config).onSettled) == null ? void 0 : _this$cache$config$on2.call(_this$cache$config2, this.state.data, error, this);
          if (process.env.NODE_ENV !== "production") {
            this.logger.error(error);
          }
        }
        if (!this.isFetchingOptimistic) {
          this.scheduleGc();
        }
        this.isFetchingOptimistic = false;
      };
      this.retryer = createRetryer({
        fn: context.fetchFn,
        abort: abortController == null ? void 0 : abortController.abort.bind(abortController),
        onSuccess: (data) => {
          var _this$cache$config$on3, _this$cache$config3, _this$cache$config$on4, _this$cache$config4;
          if (typeof data === "undefined") {
            if (process.env.NODE_ENV !== "production") {
              this.logger.error("Query data cannot be undefined. Please make sure to return a value other than undefined from your query function. Affected query key: " + this.queryHash);
            }
            onError(new Error(this.queryHash + " data is undefined"));
            return;
          }
          this.setData(data);
          (_this$cache$config$on3 = (_this$cache$config3 = this.cache.config).onSuccess) == null ? void 0 : _this$cache$config$on3.call(_this$cache$config3, data, this);
          (_this$cache$config$on4 = (_this$cache$config4 = this.cache.config).onSettled) == null ? void 0 : _this$cache$config$on4.call(_this$cache$config4, data, this.state.error, this);
          if (!this.isFetchingOptimistic) {
            this.scheduleGc();
          }
          this.isFetchingOptimistic = false;
        },
        onError,
        onFail: (failureCount, error) => {
          this.dispatch({
            type: "failed",
            failureCount,
            error
          });
        },
        onPause: () => {
          this.dispatch({
            type: "pause"
          });
        },
        onContinue: () => {
          this.dispatch({
            type: "continue"
          });
        },
        retry: context.options.retry,
        retryDelay: context.options.retryDelay,
        networkMode: context.options.networkMode
      });
      this.promise = this.retryer.promise;
      return this.promise;
    }
    dispatch(action) {
      const reducer = (state) => {
        var _action$meta, _action$dataUpdatedAt;
        switch (action.type) {
          case "failed":
            return {
              ...state,
              fetchFailureCount: action.failureCount,
              fetchFailureReason: action.error
            };
          case "pause":
            return {
              ...state,
              fetchStatus: "paused"
            };
          case "continue":
            return {
              ...state,
              fetchStatus: "fetching"
            };
          case "fetch":
            return {
              ...state,
              fetchFailureCount: 0,
              fetchFailureReason: null,
              fetchMeta: (_action$meta = action.meta) != null ? _action$meta : null,
              fetchStatus: canFetch(this.options.networkMode) ? "fetching" : "paused",
              ...!state.dataUpdatedAt && {
                error: null,
                status: "loading"
              }
            };
          case "success":
            return {
              ...state,
              data: action.data,
              dataUpdateCount: state.dataUpdateCount + 1,
              dataUpdatedAt: (_action$dataUpdatedAt = action.dataUpdatedAt) != null ? _action$dataUpdatedAt : Date.now(),
              error: null,
              isInvalidated: false,
              status: "success",
              ...!action.manual && {
                fetchStatus: "idle",
                fetchFailureCount: 0,
                fetchFailureReason: null
              }
            };
          case "error":
            const error = action.error;
            if (isCancelledError(error) && error.revert && this.revertState) {
              return {
                ...this.revertState,
                fetchStatus: "idle"
              };
            }
            return {
              ...state,
              error,
              errorUpdateCount: state.errorUpdateCount + 1,
              errorUpdatedAt: Date.now(),
              fetchFailureCount: state.fetchFailureCount + 1,
              fetchFailureReason: error,
              fetchStatus: "idle",
              status: "error"
            };
          case "invalidate":
            return {
              ...state,
              isInvalidated: true
            };
          case "setState":
            return {
              ...state,
              ...action.state
            };
        }
      };
      this.state = reducer(this.state);
      notifyManager.batch(() => {
        this.observers.forEach((observer) => {
          observer.onQueryUpdate(action);
        });
        this.cache.notify({
          query: this,
          type: "updated",
          action
        });
      });
    }
  }
  function getDefaultState$1(options) {
    const data = typeof options.initialData === "function" ? options.initialData() : options.initialData;
    const hasData = typeof data !== "undefined";
    const initialDataUpdatedAt = hasData ? typeof options.initialDataUpdatedAt === "function" ? options.initialDataUpdatedAt() : options.initialDataUpdatedAt : 0;
    return {
      data,
      dataUpdateCount: 0,
      dataUpdatedAt: hasData ? initialDataUpdatedAt != null ? initialDataUpdatedAt : Date.now() : 0,
      error: null,
      errorUpdateCount: 0,
      errorUpdatedAt: 0,
      fetchFailureCount: 0,
      fetchFailureReason: null,
      fetchMeta: null,
      isInvalidated: false,
      status: hasData ? "success" : "loading",
      fetchStatus: "idle"
    };
  }
  class QueryCache extends Subscribable {
    constructor(config) {
      super();
      this.config = config || {};
      this.queries = [];
      this.queriesMap = {};
    }
    build(client, options, state) {
      var _options$queryHash;
      const queryKey = options.queryKey;
      const queryHash = (_options$queryHash = options.queryHash) != null ? _options$queryHash : hashQueryKeyByOptions(queryKey, options);
      let query = this.get(queryHash);
      if (!query) {
        query = new Query({
          cache: this,
          logger: client.getLogger(),
          queryKey,
          queryHash,
          options: client.defaultQueryOptions(options),
          state,
          defaultOptions: client.getQueryDefaults(queryKey)
        });
        this.add(query);
      }
      return query;
    }
    add(query) {
      if (!this.queriesMap[query.queryHash]) {
        this.queriesMap[query.queryHash] = query;
        this.queries.push(query);
        this.notify({
          type: "added",
          query
        });
      }
    }
    remove(query) {
      const queryInMap = this.queriesMap[query.queryHash];
      if (queryInMap) {
        query.destroy();
        this.queries = this.queries.filter((x) => x !== query);
        if (queryInMap === query) {
          delete this.queriesMap[query.queryHash];
        }
        this.notify({
          type: "removed",
          query
        });
      }
    }
    clear() {
      notifyManager.batch(() => {
        this.queries.forEach((query) => {
          this.remove(query);
        });
      });
    }
    get(queryHash) {
      return this.queriesMap[queryHash];
    }
    getAll() {
      return this.queries;
    }
    find(arg1, arg2) {
      const [filters] = parseFilterArgs(arg1, arg2);
      if (typeof filters.exact === "undefined") {
        filters.exact = true;
      }
      return this.queries.find((query) => matchQuery(filters, query));
    }
    findAll(arg1, arg2) {
      const [filters] = parseFilterArgs(arg1, arg2);
      return Object.keys(filters).length > 0 ? this.queries.filter((query) => matchQuery(filters, query)) : this.queries;
    }
    notify(event) {
      notifyManager.batch(() => {
        this.listeners.forEach(({
          listener
        }) => {
          listener(event);
        });
      });
    }
    onFocus() {
      notifyManager.batch(() => {
        this.queries.forEach((query) => {
          query.onFocus();
        });
      });
    }
    onOnline() {
      notifyManager.batch(() => {
        this.queries.forEach((query) => {
          query.onOnline();
        });
      });
    }
  }
  class Mutation extends Removable {
    constructor(config) {
      super();
      this.defaultOptions = config.defaultOptions;
      this.mutationId = config.mutationId;
      this.mutationCache = config.mutationCache;
      this.logger = config.logger || defaultLogger;
      this.observers = [];
      this.state = config.state || getDefaultState();
      this.setOptions(config.options);
      this.scheduleGc();
    }
    setOptions(options) {
      this.options = {
        ...this.defaultOptions,
        ...options
      };
      this.updateCacheTime(this.options.cacheTime);
    }
    get meta() {
      return this.options.meta;
    }
    setState(state) {
      this.dispatch({
        type: "setState",
        state
      });
    }
    addObserver(observer) {
      if (!this.observers.includes(observer)) {
        this.observers.push(observer);
        this.clearGcTimeout();
        this.mutationCache.notify({
          type: "observerAdded",
          mutation: this,
          observer
        });
      }
    }
    removeObserver(observer) {
      this.observers = this.observers.filter((x) => x !== observer);
      this.scheduleGc();
      this.mutationCache.notify({
        type: "observerRemoved",
        mutation: this,
        observer
      });
    }
    optionalRemove() {
      if (!this.observers.length) {
        if (this.state.status === "loading") {
          this.scheduleGc();
        } else {
          this.mutationCache.remove(this);
        }
      }
    }
    continue() {
      var _this$retryer$continu, _this$retryer;
      return (_this$retryer$continu = (_this$retryer = this.retryer) == null ? void 0 : _this$retryer.continue()) != null ? _this$retryer$continu : this.execute();
    }
    async execute() {
      const executeMutation = () => {
        var _this$options$retry;
        this.retryer = createRetryer({
          fn: () => {
            if (!this.options.mutationFn) {
              return Promise.reject("No mutationFn found");
            }
            return this.options.mutationFn(this.state.variables);
          },
          onFail: (failureCount, error) => {
            this.dispatch({
              type: "failed",
              failureCount,
              error
            });
          },
          onPause: () => {
            this.dispatch({
              type: "pause"
            });
          },
          onContinue: () => {
            this.dispatch({
              type: "continue"
            });
          },
          retry: (_this$options$retry = this.options.retry) != null ? _this$options$retry : 0,
          retryDelay: this.options.retryDelay,
          networkMode: this.options.networkMode
        });
        return this.retryer.promise;
      };
      const restored = this.state.status === "loading";
      try {
        var _this$mutationCache$c3, _this$mutationCache$c4, _this$options$onSucce, _this$options2, _this$mutationCache$c5, _this$mutationCache$c6, _this$options$onSettl, _this$options3;
        if (!restored) {
          var _this$mutationCache$c, _this$mutationCache$c2, _this$options$onMutat, _this$options;
          this.dispatch({
            type: "loading",
            variables: this.options.variables
          });
          await ((_this$mutationCache$c = (_this$mutationCache$c2 = this.mutationCache.config).onMutate) == null ? void 0 : _this$mutationCache$c.call(_this$mutationCache$c2, this.state.variables, this));
          const context = await ((_this$options$onMutat = (_this$options = this.options).onMutate) == null ? void 0 : _this$options$onMutat.call(_this$options, this.state.variables));
          if (context !== this.state.context) {
            this.dispatch({
              type: "loading",
              context,
              variables: this.state.variables
            });
          }
        }
        const data = await executeMutation();
        await ((_this$mutationCache$c3 = (_this$mutationCache$c4 = this.mutationCache.config).onSuccess) == null ? void 0 : _this$mutationCache$c3.call(_this$mutationCache$c4, data, this.state.variables, this.state.context, this));
        await ((_this$options$onSucce = (_this$options2 = this.options).onSuccess) == null ? void 0 : _this$options$onSucce.call(_this$options2, data, this.state.variables, this.state.context));
        await ((_this$mutationCache$c5 = (_this$mutationCache$c6 = this.mutationCache.config).onSettled) == null ? void 0 : _this$mutationCache$c5.call(_this$mutationCache$c6, data, null, this.state.variables, this.state.context, this));
        await ((_this$options$onSettl = (_this$options3 = this.options).onSettled) == null ? void 0 : _this$options$onSettl.call(_this$options3, data, null, this.state.variables, this.state.context));
        this.dispatch({
          type: "success",
          data
        });
        return data;
      } catch (error) {
        try {
          var _this$mutationCache$c7, _this$mutationCache$c8, _this$options$onError, _this$options4, _this$mutationCache$c9, _this$mutationCache$c10, _this$options$onSettl2, _this$options5;
          await ((_this$mutationCache$c7 = (_this$mutationCache$c8 = this.mutationCache.config).onError) == null ? void 0 : _this$mutationCache$c7.call(_this$mutationCache$c8, error, this.state.variables, this.state.context, this));
          if (process.env.NODE_ENV !== "production") {
            this.logger.error(error);
          }
          await ((_this$options$onError = (_this$options4 = this.options).onError) == null ? void 0 : _this$options$onError.call(_this$options4, error, this.state.variables, this.state.context));
          await ((_this$mutationCache$c9 = (_this$mutationCache$c10 = this.mutationCache.config).onSettled) == null ? void 0 : _this$mutationCache$c9.call(_this$mutationCache$c10, void 0, error, this.state.variables, this.state.context, this));
          await ((_this$options$onSettl2 = (_this$options5 = this.options).onSettled) == null ? void 0 : _this$options$onSettl2.call(_this$options5, void 0, error, this.state.variables, this.state.context));
          throw error;
        } finally {
          this.dispatch({
            type: "error",
            error
          });
        }
      }
    }
    dispatch(action) {
      const reducer = (state) => {
        switch (action.type) {
          case "failed":
            return {
              ...state,
              failureCount: action.failureCount,
              failureReason: action.error
            };
          case "pause":
            return {
              ...state,
              isPaused: true
            };
          case "continue":
            return {
              ...state,
              isPaused: false
            };
          case "loading":
            return {
              ...state,
              context: action.context,
              data: void 0,
              failureCount: 0,
              failureReason: null,
              error: null,
              isPaused: !canFetch(this.options.networkMode),
              status: "loading",
              variables: action.variables
            };
          case "success":
            return {
              ...state,
              data: action.data,
              failureCount: 0,
              failureReason: null,
              error: null,
              status: "success",
              isPaused: false
            };
          case "error":
            return {
              ...state,
              data: void 0,
              error: action.error,
              failureCount: state.failureCount + 1,
              failureReason: action.error,
              isPaused: false,
              status: "error"
            };
          case "setState":
            return {
              ...state,
              ...action.state
            };
        }
      };
      this.state = reducer(this.state);
      notifyManager.batch(() => {
        this.observers.forEach((observer) => {
          observer.onMutationUpdate(action);
        });
        this.mutationCache.notify({
          mutation: this,
          type: "updated",
          action
        });
      });
    }
  }
  function getDefaultState() {
    return {
      context: void 0,
      data: void 0,
      error: null,
      failureCount: 0,
      failureReason: null,
      isPaused: false,
      status: "idle",
      variables: void 0
    };
  }
  class MutationCache extends Subscribable {
    constructor(config) {
      super();
      this.config = config || {};
      this.mutations = [];
      this.mutationId = 0;
    }
    build(client, options, state) {
      const mutation = new Mutation({
        mutationCache: this,
        logger: client.getLogger(),
        mutationId: ++this.mutationId,
        options: client.defaultMutationOptions(options),
        state,
        defaultOptions: options.mutationKey ? client.getMutationDefaults(options.mutationKey) : void 0
      });
      this.add(mutation);
      return mutation;
    }
    add(mutation) {
      this.mutations.push(mutation);
      this.notify({
        type: "added",
        mutation
      });
    }
    remove(mutation) {
      this.mutations = this.mutations.filter((x) => x !== mutation);
      this.notify({
        type: "removed",
        mutation
      });
    }
    clear() {
      notifyManager.batch(() => {
        this.mutations.forEach((mutation) => {
          this.remove(mutation);
        });
      });
    }
    getAll() {
      return this.mutations;
    }
    find(filters) {
      if (typeof filters.exact === "undefined") {
        filters.exact = true;
      }
      return this.mutations.find((mutation) => matchMutation(filters, mutation));
    }
    findAll(filters) {
      return this.mutations.filter((mutation) => matchMutation(filters, mutation));
    }
    notify(event) {
      notifyManager.batch(() => {
        this.listeners.forEach(({
          listener
        }) => {
          listener(event);
        });
      });
    }
    resumePausedMutations() {
      var _this$resuming;
      this.resuming = ((_this$resuming = this.resuming) != null ? _this$resuming : Promise.resolve()).then(() => {
        const pausedMutations = this.mutations.filter((x) => x.state.isPaused);
        return notifyManager.batch(() => pausedMutations.reduce((promise, mutation) => promise.then(() => mutation.continue().catch(noop$1)), Promise.resolve()));
      }).then(() => {
        this.resuming = void 0;
      });
      return this.resuming;
    }
  }
  function infiniteQueryBehavior() {
    return {
      onFetch: (context) => {
        context.fetchFn = () => {
          var _context$fetchOptions, _context$fetchOptions2, _context$fetchOptions3, _context$fetchOptions4, _context$state$data, _context$state$data2;
          const refetchPage = (_context$fetchOptions = context.fetchOptions) == null ? void 0 : (_context$fetchOptions2 = _context$fetchOptions.meta) == null ? void 0 : _context$fetchOptions2.refetchPage;
          const fetchMore = (_context$fetchOptions3 = context.fetchOptions) == null ? void 0 : (_context$fetchOptions4 = _context$fetchOptions3.meta) == null ? void 0 : _context$fetchOptions4.fetchMore;
          const pageParam = fetchMore == null ? void 0 : fetchMore.pageParam;
          const isFetchingNextPage = (fetchMore == null ? void 0 : fetchMore.direction) === "forward";
          const isFetchingPreviousPage = (fetchMore == null ? void 0 : fetchMore.direction) === "backward";
          const oldPages = ((_context$state$data = context.state.data) == null ? void 0 : _context$state$data.pages) || [];
          const oldPageParams = ((_context$state$data2 = context.state.data) == null ? void 0 : _context$state$data2.pageParams) || [];
          let newPageParams = oldPageParams;
          let cancelled = false;
          const addSignalProperty = (object) => {
            Object.defineProperty(object, "signal", {
              enumerable: true,
              get: () => {
                var _context$signal;
                if ((_context$signal = context.signal) != null && _context$signal.aborted) {
                  cancelled = true;
                } else {
                  var _context$signal2;
                  (_context$signal2 = context.signal) == null ? void 0 : _context$signal2.addEventListener("abort", () => {
                    cancelled = true;
                  });
                }
                return context.signal;
              }
            });
          };
          const queryFn = context.options.queryFn || (() => Promise.reject("Missing queryFn for queryKey '" + context.options.queryHash + "'"));
          const buildNewPages = (pages, param, page, previous) => {
            newPageParams = previous ? [param, ...newPageParams] : [...newPageParams, param];
            return previous ? [page, ...pages] : [...pages, page];
          };
          const fetchPage = (pages, manual, param, previous) => {
            if (cancelled) {
              return Promise.reject("Cancelled");
            }
            if (typeof param === "undefined" && !manual && pages.length) {
              return Promise.resolve(pages);
            }
            const queryFnContext = {
              queryKey: context.queryKey,
              pageParam: param,
              meta: context.options.meta
            };
            addSignalProperty(queryFnContext);
            const queryFnResult = queryFn(queryFnContext);
            const promise2 = Promise.resolve(queryFnResult).then((page) => buildNewPages(pages, param, page, previous));
            return promise2;
          };
          let promise;
          if (!oldPages.length) {
            promise = fetchPage([]);
          } else if (isFetchingNextPage) {
            const manual = typeof pageParam !== "undefined";
            const param = manual ? pageParam : getNextPageParam(context.options, oldPages);
            promise = fetchPage(oldPages, manual, param);
          } else if (isFetchingPreviousPage) {
            const manual = typeof pageParam !== "undefined";
            const param = manual ? pageParam : getPreviousPageParam(context.options, oldPages);
            promise = fetchPage(oldPages, manual, param, true);
          } else {
            newPageParams = [];
            const manual = typeof context.options.getNextPageParam === "undefined";
            const shouldFetchFirstPage = refetchPage && oldPages[0] ? refetchPage(oldPages[0], 0, oldPages) : true;
            promise = shouldFetchFirstPage ? fetchPage([], manual, oldPageParams[0]) : Promise.resolve(buildNewPages([], oldPageParams[0], oldPages[0]));
            for (let i = 1; i < oldPages.length; i++) {
              promise = promise.then((pages) => {
                const shouldFetchNextPage = refetchPage && oldPages[i] ? refetchPage(oldPages[i], i, oldPages) : true;
                if (shouldFetchNextPage) {
                  const param = manual ? oldPageParams[i] : getNextPageParam(context.options, pages);
                  return fetchPage(pages, manual, param);
                }
                return Promise.resolve(buildNewPages(pages, oldPageParams[i], oldPages[i]));
              });
            }
          }
          const finalPromise = promise.then((pages) => ({
            pages,
            pageParams: newPageParams
          }));
          return finalPromise;
        };
      }
    };
  }
  function getNextPageParam(options, pages) {
    return options.getNextPageParam == null ? void 0 : options.getNextPageParam(pages[pages.length - 1], pages);
  }
  function getPreviousPageParam(options, pages) {
    return options.getPreviousPageParam == null ? void 0 : options.getPreviousPageParam(pages[0], pages);
  }
  class QueryClient {
    constructor(config = {}) {
      this.queryCache = config.queryCache || new QueryCache();
      this.mutationCache = config.mutationCache || new MutationCache();
      this.logger = config.logger || defaultLogger;
      this.defaultOptions = config.defaultOptions || {};
      this.queryDefaults = [];
      this.mutationDefaults = [];
      this.mountCount = 0;
      if (process.env.NODE_ENV !== "production" && config.logger) {
        this.logger.error("Passing a custom logger has been deprecated and will be removed in the next major version.");
      }
    }
    mount() {
      this.mountCount++;
      if (this.mountCount !== 1)
        return;
      this.unsubscribeFocus = focusManager.subscribe(() => {
        if (focusManager.isFocused()) {
          this.resumePausedMutations();
          this.queryCache.onFocus();
        }
      });
      this.unsubscribeOnline = onlineManager.subscribe(() => {
        if (onlineManager.isOnline()) {
          this.resumePausedMutations();
          this.queryCache.onOnline();
        }
      });
    }
    unmount() {
      var _this$unsubscribeFocu, _this$unsubscribeOnli;
      this.mountCount--;
      if (this.mountCount !== 0)
        return;
      (_this$unsubscribeFocu = this.unsubscribeFocus) == null ? void 0 : _this$unsubscribeFocu.call(this);
      this.unsubscribeFocus = void 0;
      (_this$unsubscribeOnli = this.unsubscribeOnline) == null ? void 0 : _this$unsubscribeOnli.call(this);
      this.unsubscribeOnline = void 0;
    }
    isFetching(arg1, arg2) {
      const [filters] = parseFilterArgs(arg1, arg2);
      filters.fetchStatus = "fetching";
      return this.queryCache.findAll(filters).length;
    }
    isMutating(filters) {
      return this.mutationCache.findAll({
        ...filters,
        fetching: true
      }).length;
    }
    getQueryData(queryKey, filters) {
      var _this$queryCache$find;
      return (_this$queryCache$find = this.queryCache.find(queryKey, filters)) == null ? void 0 : _this$queryCache$find.state.data;
    }
    ensureQueryData(arg1, arg2, arg3) {
      const parsedOptions = parseQueryArgs(arg1, arg2, arg3);
      const cachedData = this.getQueryData(parsedOptions.queryKey);
      return cachedData ? Promise.resolve(cachedData) : this.fetchQuery(parsedOptions);
    }
    getQueriesData(queryKeyOrFilters) {
      return this.getQueryCache().findAll(queryKeyOrFilters).map(({
        queryKey,
        state
      }) => {
        const data = state.data;
        return [queryKey, data];
      });
    }
    setQueryData(queryKey, updater, options) {
      const query = this.queryCache.find(queryKey);
      const prevData = query == null ? void 0 : query.state.data;
      const data = functionalUpdate(updater, prevData);
      if (typeof data === "undefined") {
        return void 0;
      }
      const parsedOptions = parseQueryArgs(queryKey);
      const defaultedOptions = this.defaultQueryOptions(parsedOptions);
      return this.queryCache.build(this, defaultedOptions).setData(data, {
        ...options,
        manual: true
      });
    }
    setQueriesData(queryKeyOrFilters, updater, options) {
      return notifyManager.batch(() => this.getQueryCache().findAll(queryKeyOrFilters).map(({
        queryKey
      }) => [queryKey, this.setQueryData(queryKey, updater, options)]));
    }
    getQueryState(queryKey, filters) {
      var _this$queryCache$find2;
      return (_this$queryCache$find2 = this.queryCache.find(queryKey, filters)) == null ? void 0 : _this$queryCache$find2.state;
    }
    removeQueries(arg1, arg2) {
      const [filters] = parseFilterArgs(arg1, arg2);
      const queryCache = this.queryCache;
      notifyManager.batch(() => {
        queryCache.findAll(filters).forEach((query) => {
          queryCache.remove(query);
        });
      });
    }
    resetQueries(arg1, arg2, arg3) {
      const [filters, options] = parseFilterArgs(arg1, arg2, arg3);
      const queryCache = this.queryCache;
      const refetchFilters = {
        type: "active",
        ...filters
      };
      return notifyManager.batch(() => {
        queryCache.findAll(filters).forEach((query) => {
          query.reset();
        });
        return this.refetchQueries(refetchFilters, options);
      });
    }
    cancelQueries(arg1, arg2, arg3) {
      const [filters, cancelOptions = {}] = parseFilterArgs(arg1, arg2, arg3);
      if (typeof cancelOptions.revert === "undefined") {
        cancelOptions.revert = true;
      }
      const promises = notifyManager.batch(() => this.queryCache.findAll(filters).map((query) => query.cancel(cancelOptions)));
      return Promise.all(promises).then(noop$1).catch(noop$1);
    }
    invalidateQueries(arg1, arg2, arg3) {
      const [filters, options] = parseFilterArgs(arg1, arg2, arg3);
      return notifyManager.batch(() => {
        var _ref, _filters$refetchType;
        this.queryCache.findAll(filters).forEach((query) => {
          query.invalidate();
        });
        if (filters.refetchType === "none") {
          return Promise.resolve();
        }
        const refetchFilters = {
          ...filters,
          type: (_ref = (_filters$refetchType = filters.refetchType) != null ? _filters$refetchType : filters.type) != null ? _ref : "active"
        };
        return this.refetchQueries(refetchFilters, options);
      });
    }
    refetchQueries(arg1, arg2, arg3) {
      const [filters, options] = parseFilterArgs(arg1, arg2, arg3);
      const promises = notifyManager.batch(() => this.queryCache.findAll(filters).filter((query) => !query.isDisabled()).map((query) => {
        var _options$cancelRefetc;
        return query.fetch(void 0, {
          ...options,
          cancelRefetch: (_options$cancelRefetc = options == null ? void 0 : options.cancelRefetch) != null ? _options$cancelRefetc : true,
          meta: {
            refetchPage: filters.refetchPage
          }
        });
      }));
      let promise = Promise.all(promises).then(noop$1);
      if (!(options != null && options.throwOnError)) {
        promise = promise.catch(noop$1);
      }
      return promise;
    }
    fetchQuery(arg1, arg2, arg3) {
      const parsedOptions = parseQueryArgs(arg1, arg2, arg3);
      const defaultedOptions = this.defaultQueryOptions(parsedOptions);
      if (typeof defaultedOptions.retry === "undefined") {
        defaultedOptions.retry = false;
      }
      const query = this.queryCache.build(this, defaultedOptions);
      return query.isStaleByTime(defaultedOptions.staleTime) ? query.fetch(defaultedOptions) : Promise.resolve(query.state.data);
    }
    prefetchQuery(arg1, arg2, arg3) {
      return this.fetchQuery(arg1, arg2, arg3).then(noop$1).catch(noop$1);
    }
    fetchInfiniteQuery(arg1, arg2, arg3) {
      const parsedOptions = parseQueryArgs(arg1, arg2, arg3);
      parsedOptions.behavior = infiniteQueryBehavior();
      return this.fetchQuery(parsedOptions);
    }
    prefetchInfiniteQuery(arg1, arg2, arg3) {
      return this.fetchInfiniteQuery(arg1, arg2, arg3).then(noop$1).catch(noop$1);
    }
    resumePausedMutations() {
      return this.mutationCache.resumePausedMutations();
    }
    getQueryCache() {
      return this.queryCache;
    }
    getMutationCache() {
      return this.mutationCache;
    }
    getLogger() {
      return this.logger;
    }
    getDefaultOptions() {
      return this.defaultOptions;
    }
    setDefaultOptions(options) {
      this.defaultOptions = options;
    }
    setQueryDefaults(queryKey, options) {
      const result = this.queryDefaults.find((x) => hashQueryKey(queryKey) === hashQueryKey(x.queryKey));
      if (result) {
        result.defaultOptions = options;
      } else {
        this.queryDefaults.push({
          queryKey,
          defaultOptions: options
        });
      }
    }
    getQueryDefaults(queryKey) {
      if (!queryKey) {
        return void 0;
      }
      const firstMatchingDefaults = this.queryDefaults.find((x) => partialMatchKey(queryKey, x.queryKey));
      if (process.env.NODE_ENV !== "production") {
        const matchingDefaults = this.queryDefaults.filter((x) => partialMatchKey(queryKey, x.queryKey));
        if (matchingDefaults.length > 1) {
          this.logger.error("[QueryClient] Several query defaults match with key '" + JSON.stringify(queryKey) + "'. The first matching query defaults are used. Please check how query defaults are registered. Order does matter here. cf. https://react-query.tanstack.com/reference/QueryClient#queryclientsetquerydefaults.");
        }
      }
      return firstMatchingDefaults == null ? void 0 : firstMatchingDefaults.defaultOptions;
    }
    setMutationDefaults(mutationKey, options) {
      const result = this.mutationDefaults.find((x) => hashQueryKey(mutationKey) === hashQueryKey(x.mutationKey));
      if (result) {
        result.defaultOptions = options;
      } else {
        this.mutationDefaults.push({
          mutationKey,
          defaultOptions: options
        });
      }
    }
    getMutationDefaults(mutationKey) {
      if (!mutationKey) {
        return void 0;
      }
      const firstMatchingDefaults = this.mutationDefaults.find((x) => partialMatchKey(mutationKey, x.mutationKey));
      if (process.env.NODE_ENV !== "production") {
        const matchingDefaults = this.mutationDefaults.filter((x) => partialMatchKey(mutationKey, x.mutationKey));
        if (matchingDefaults.length > 1) {
          this.logger.error("[QueryClient] Several mutation defaults match with key '" + JSON.stringify(mutationKey) + "'. The first matching mutation defaults are used. Please check how mutation defaults are registered. Order does matter here. cf. https://react-query.tanstack.com/reference/QueryClient#queryclientsetmutationdefaults.");
        }
      }
      return firstMatchingDefaults == null ? void 0 : firstMatchingDefaults.defaultOptions;
    }
    defaultQueryOptions(options) {
      if (options != null && options._defaulted) {
        return options;
      }
      const defaultedOptions = {
        ...this.defaultOptions.queries,
        ...this.getQueryDefaults(options == null ? void 0 : options.queryKey),
        ...options,
        _defaulted: true
      };
      if (!defaultedOptions.queryHash && defaultedOptions.queryKey) {
        defaultedOptions.queryHash = hashQueryKeyByOptions(defaultedOptions.queryKey, defaultedOptions);
      }
      if (typeof defaultedOptions.refetchOnReconnect === "undefined") {
        defaultedOptions.refetchOnReconnect = defaultedOptions.networkMode !== "always";
      }
      if (typeof defaultedOptions.useErrorBoundary === "undefined") {
        defaultedOptions.useErrorBoundary = !!defaultedOptions.suspense;
      }
      return defaultedOptions;
    }
    defaultMutationOptions(options) {
      if (options != null && options._defaulted) {
        return options;
      }
      return {
        ...this.defaultOptions.mutations,
        ...this.getMutationDefaults(options == null ? void 0 : options.mutationKey),
        ...options,
        _defaulted: true
      };
    }
    clear() {
      this.queryCache.clear();
      this.mutationCache.clear();
    }
  }
  class MutationObserver extends Subscribable {
    constructor(client, options) {
      super();
      this.client = client;
      this.setOptions(options);
      this.bindMethods();
      this.updateResult();
    }
    bindMethods() {
      this.mutate = this.mutate.bind(this);
      this.reset = this.reset.bind(this);
    }
    setOptions(options) {
      var _this$currentMutation;
      const prevOptions = this.options;
      this.options = this.client.defaultMutationOptions(options);
      if (!shallowEqualObjects(prevOptions, this.options)) {
        this.client.getMutationCache().notify({
          type: "observerOptionsUpdated",
          mutation: this.currentMutation,
          observer: this
        });
      }
      (_this$currentMutation = this.currentMutation) == null ? void 0 : _this$currentMutation.setOptions(this.options);
    }
    onUnsubscribe() {
      if (!this.hasListeners()) {
        var _this$currentMutation2;
        (_this$currentMutation2 = this.currentMutation) == null ? void 0 : _this$currentMutation2.removeObserver(this);
      }
    }
    onMutationUpdate(action) {
      this.updateResult();
      const notifyOptions = {
        listeners: true
      };
      if (action.type === "success") {
        notifyOptions.onSuccess = true;
      } else if (action.type === "error") {
        notifyOptions.onError = true;
      }
      this.notify(notifyOptions);
    }
    getCurrentResult() {
      return this.currentResult;
    }
    reset() {
      this.currentMutation = void 0;
      this.updateResult();
      this.notify({
        listeners: true
      });
    }
    mutate(variables, options) {
      this.mutateOptions = options;
      if (this.currentMutation) {
        this.currentMutation.removeObserver(this);
      }
      this.currentMutation = this.client.getMutationCache().build(this.client, {
        ...this.options,
        variables: typeof variables !== "undefined" ? variables : this.options.variables
      });
      this.currentMutation.addObserver(this);
      return this.currentMutation.execute();
    }
    updateResult() {
      const state = this.currentMutation ? this.currentMutation.state : getDefaultState();
      const result = {
        ...state,
        isLoading: state.status === "loading",
        isSuccess: state.status === "success",
        isError: state.status === "error",
        isIdle: state.status === "idle",
        mutate: this.mutate,
        reset: this.reset
      };
      this.currentResult = result;
    }
    notify(options) {
      notifyManager.batch(() => {
        if (this.mutateOptions && this.hasListeners()) {
          if (options.onSuccess) {
            var _this$mutateOptions$o, _this$mutateOptions, _this$mutateOptions$o2, _this$mutateOptions2;
            (_this$mutateOptions$o = (_this$mutateOptions = this.mutateOptions).onSuccess) == null ? void 0 : _this$mutateOptions$o.call(_this$mutateOptions, this.currentResult.data, this.currentResult.variables, this.currentResult.context);
            (_this$mutateOptions$o2 = (_this$mutateOptions2 = this.mutateOptions).onSettled) == null ? void 0 : _this$mutateOptions$o2.call(_this$mutateOptions2, this.currentResult.data, null, this.currentResult.variables, this.currentResult.context);
          } else if (options.onError) {
            var _this$mutateOptions$o3, _this$mutateOptions3, _this$mutateOptions$o4, _this$mutateOptions4;
            (_this$mutateOptions$o3 = (_this$mutateOptions3 = this.mutateOptions).onError) == null ? void 0 : _this$mutateOptions$o3.call(_this$mutateOptions3, this.currentResult.error, this.currentResult.variables, this.currentResult.context);
            (_this$mutateOptions$o4 = (_this$mutateOptions4 = this.mutateOptions).onSettled) == null ? void 0 : _this$mutateOptions$o4.call(_this$mutateOptions4, void 0, this.currentResult.error, this.currentResult.variables, this.currentResult.context);
          }
        }
        if (options.listeners) {
          this.listeners.forEach(({
            listener
          }) => {
            listener(this.currentResult);
          });
        }
      });
    }
  }
  var shim = { exports: {} };
  var useSyncExternalStoreShim_production_min = {};
  /**
   * @license React
   * use-sync-external-store-shim.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var hasRequiredUseSyncExternalStoreShim_production_min;
  function requireUseSyncExternalStoreShim_production_min() {
    if (hasRequiredUseSyncExternalStoreShim_production_min)
      return useSyncExternalStoreShim_production_min;
    hasRequiredUseSyncExternalStoreShim_production_min = 1;
    var e = React;
    function h(a, b) {
      return a === b && (0 !== a || 1 / a === 1 / b) || a !== a && b !== b;
    }
    var k = "function" === typeof Object.is ? Object.is : h, l = e.useState, m = e.useEffect, n = e.useLayoutEffect, p = e.useDebugValue;
    function q(a, b) {
      var d = b(), f = l({ inst: { value: d, getSnapshot: b } }), c = f[0].inst, g = f[1];
      n(function() {
        c.value = d;
        c.getSnapshot = b;
        r(c) && g({ inst: c });
      }, [a, d, b]);
      m(function() {
        r(c) && g({ inst: c });
        return a(function() {
          r(c) && g({ inst: c });
        });
      }, [a]);
      p(d);
      return d;
    }
    function r(a) {
      var b = a.getSnapshot;
      a = a.value;
      try {
        var d = b();
        return !k(a, d);
      } catch (f) {
        return true;
      }
    }
    function t(a, b) {
      return b();
    }
    var u = "undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement ? t : q;
    useSyncExternalStoreShim_production_min.useSyncExternalStore = void 0 !== e.useSyncExternalStore ? e.useSyncExternalStore : u;
    return useSyncExternalStoreShim_production_min;
  }
  var useSyncExternalStoreShim_development = {};
  /**
   * @license React
   * use-sync-external-store-shim.development.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var hasRequiredUseSyncExternalStoreShim_development;
  function requireUseSyncExternalStoreShim_development() {
    if (hasRequiredUseSyncExternalStoreShim_development)
      return useSyncExternalStoreShim_development;
    hasRequiredUseSyncExternalStoreShim_development = 1;
    if (process.env.NODE_ENV !== "production") {
      (function() {
        if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== "undefined" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart === "function") {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
        }
        var React$1 = React;
        var ReactSharedInternals = React$1.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
        function error(format) {
          {
            {
              for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                args[_key2 - 1] = arguments[_key2];
              }
              printWarning("error", format, args);
            }
          }
        }
        function printWarning(level, format, args) {
          {
            var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
            var stack = ReactDebugCurrentFrame.getStackAddendum();
            if (stack !== "") {
              format += "%s";
              args = args.concat([stack]);
            }
            var argsWithFormat = args.map(function(item) {
              return String(item);
            });
            argsWithFormat.unshift("Warning: " + format);
            Function.prototype.apply.call(console[level], console, argsWithFormat);
          }
        }
        function is(x, y) {
          return x === y && (x !== 0 || 1 / x === 1 / y) || x !== x && y !== y;
        }
        var objectIs = typeof Object.is === "function" ? Object.is : is;
        var useState = React$1.useState, useEffect = React$1.useEffect, useLayoutEffect = React$1.useLayoutEffect, useDebugValue = React$1.useDebugValue;
        var didWarnOld18Alpha = false;
        var didWarnUncachedGetSnapshot = false;
        function useSyncExternalStore2(subscribe, getSnapshot, getServerSnapshot) {
          {
            if (!didWarnOld18Alpha) {
              if (React$1.startTransition !== void 0) {
                didWarnOld18Alpha = true;
                error("You are using an outdated, pre-release alpha of React 18 that does not support useSyncExternalStore. The use-sync-external-store shim will not work correctly. Upgrade to a newer pre-release.");
              }
            }
          }
          var value = getSnapshot();
          {
            if (!didWarnUncachedGetSnapshot) {
              var cachedValue = getSnapshot();
              if (!objectIs(value, cachedValue)) {
                error("The result of getSnapshot should be cached to avoid an infinite loop");
                didWarnUncachedGetSnapshot = true;
              }
            }
          }
          var _useState = useState({
            inst: {
              value,
              getSnapshot
            }
          }), inst = _useState[0].inst, forceUpdate = _useState[1];
          useLayoutEffect(function() {
            inst.value = value;
            inst.getSnapshot = getSnapshot;
            if (checkIfSnapshotChanged(inst)) {
              forceUpdate({
                inst
              });
            }
          }, [subscribe, value, getSnapshot]);
          useEffect(function() {
            if (checkIfSnapshotChanged(inst)) {
              forceUpdate({
                inst
              });
            }
            var handleStoreChange = function() {
              if (checkIfSnapshotChanged(inst)) {
                forceUpdate({
                  inst
                });
              }
            };
            return subscribe(handleStoreChange);
          }, [subscribe]);
          useDebugValue(value);
          return value;
        }
        function checkIfSnapshotChanged(inst) {
          var latestGetSnapshot = inst.getSnapshot;
          var prevValue = inst.value;
          try {
            var nextValue = latestGetSnapshot();
            return !objectIs(prevValue, nextValue);
          } catch (error2) {
            return true;
          }
        }
        function useSyncExternalStore$1(subscribe, getSnapshot, getServerSnapshot) {
          return getSnapshot();
        }
        var canUseDOM = !!(typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined");
        var isServerEnvironment = !canUseDOM;
        var shim2 = isServerEnvironment ? useSyncExternalStore$1 : useSyncExternalStore2;
        var useSyncExternalStore$2 = React$1.useSyncExternalStore !== void 0 ? React$1.useSyncExternalStore : shim2;
        useSyncExternalStoreShim_development.useSyncExternalStore = useSyncExternalStore$2;
        if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== "undefined" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop === "function") {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
        }
      })();
    }
    return useSyncExternalStoreShim_development;
  }
  if (process.env.NODE_ENV === "production") {
    shim.exports = requireUseSyncExternalStoreShim_production_min();
  } else {
    shim.exports = requireUseSyncExternalStoreShim_development();
  }
  var shimExports = shim.exports;
  const useSyncExternalStore = shimExports.useSyncExternalStore;
  const defaultContext = /* @__PURE__ */ React__namespace.createContext(void 0);
  const QueryClientSharingContext = /* @__PURE__ */ React__namespace.createContext(false);
  function getQueryClientContext(context, contextSharing) {
    if (context) {
      return context;
    }
    if (contextSharing && typeof window !== "undefined") {
      if (!window.ReactQueryClientContext) {
        window.ReactQueryClientContext = defaultContext;
      }
      return window.ReactQueryClientContext;
    }
    return defaultContext;
  }
  const useQueryClient = ({
    context
  } = {}) => {
    const queryClient2 = React__namespace.useContext(getQueryClientContext(context, React__namespace.useContext(QueryClientSharingContext)));
    if (!queryClient2) {
      throw new Error("No QueryClient set, use QueryClientProvider to set one");
    }
    return queryClient2;
  };
  const QueryClientProvider = ({
    client,
    children,
    context,
    contextSharing = false
  }) => {
    React__namespace.useEffect(() => {
      client.mount();
      return () => {
        client.unmount();
      };
    }, [client]);
    if (process.env.NODE_ENV !== "production" && contextSharing) {
      client.getLogger().error("The contextSharing option has been deprecated and will be removed in the next major version");
    }
    const Context = getQueryClientContext(context, contextSharing);
    return /* @__PURE__ */ React__namespace.createElement(QueryClientSharingContext.Provider, {
      value: !context && contextSharing
    }, /* @__PURE__ */ React__namespace.createElement(Context.Provider, {
      value: client
    }, children));
  };
  function shouldThrowError(_useErrorBoundary, params) {
    if (typeof _useErrorBoundary === "function") {
      return _useErrorBoundary(...params);
    }
    return !!_useErrorBoundary;
  }
  function useMutation(arg1, arg2, arg3) {
    const options = parseMutationArgs(arg1, arg2, arg3);
    const queryClient2 = useQueryClient({
      context: options.context
    });
    const [observer] = React__namespace.useState(() => new MutationObserver(queryClient2, options));
    React__namespace.useEffect(() => {
      observer.setOptions(options);
    }, [observer, options]);
    const result = useSyncExternalStore(React__namespace.useCallback((onStoreChange) => observer.subscribe(notifyManager.batchCalls(onStoreChange)), [observer]), () => observer.getCurrentResult(), () => observer.getCurrentResult());
    const mutate = React__namespace.useCallback((variables, mutateOptions) => {
      observer.mutate(variables, mutateOptions).catch(noop);
    }, [observer]);
    if (result.error && shouldThrowError(observer.options.useErrorBoundary, [result.error])) {
      throw result.error;
    }
    return {
      ...result,
      mutate,
      mutateAsync: result.mutate
    };
  }
  function noop() {
  }
  const VERSION = "4.67.3";
  let auto = false;
  let kind = void 0;
  let fetch$1 = void 0;
  let FormData$1 = void 0;
  let File$1 = void 0;
  let ReadableStream$1 = void 0;
  let getMultipartRequestOptions = void 0;
  let getDefaultAgent = void 0;
  let fileFromPath = void 0;
  let isFsReadStream = void 0;
  function setShims(shims, options = { auto: false }) {
    if (auto) {
      throw new Error(`you must \`import 'openai/shims/${shims.kind}'\` before importing anything else from openai`);
    }
    if (kind) {
      throw new Error(`can't \`import 'openai/shims/${shims.kind}'\` after \`import 'openai/shims/${kind}'\``);
    }
    auto = options.auto;
    kind = shims.kind;
    fetch$1 = shims.fetch;
    shims.Request;
    shims.Response;
    shims.Headers;
    FormData$1 = shims.FormData;
    shims.Blob;
    File$1 = shims.File;
    ReadableStream$1 = shims.ReadableStream;
    getMultipartRequestOptions = shims.getMultipartRequestOptions;
    getDefaultAgent = shims.getDefaultAgent;
    fileFromPath = shims.fileFromPath;
    isFsReadStream = shims.isFsReadStream;
  }
  class MultipartBody {
    constructor(body) {
      this.body = body;
    }
    get [Symbol.toStringTag]() {
      return "MultipartBody";
    }
  }
  function getRuntime({ manuallyImported } = {}) {
    const recommendation = manuallyImported ? `You may need to use polyfills` : `Add one of these imports before your first \`import … from 'openai'\`:
- \`import 'openai/shims/node'\` (if you're running on Node)
- \`import 'openai/shims/web'\` (otherwise)
`;
    let _fetch, _Request, _Response, _Headers;
    try {
      _fetch = fetch;
      _Request = Request;
      _Response = Response;
      _Headers = Headers;
    } catch (error) {
      throw new Error(`this environment is missing the following Web Fetch API type: ${error.message}. ${recommendation}`);
    }
    return {
      kind: "web",
      fetch: _fetch,
      Request: _Request,
      Response: _Response,
      Headers: _Headers,
      FormData: (
        // @ts-ignore
        typeof FormData !== "undefined" ? FormData : class FormData {
          // @ts-ignore
          constructor() {
            throw new Error(`file uploads aren't supported in this environment yet as 'FormData' is undefined. ${recommendation}`);
          }
        }
      ),
      Blob: typeof Blob !== "undefined" ? Blob : class Blob {
        constructor() {
          throw new Error(`file uploads aren't supported in this environment yet as 'Blob' is undefined. ${recommendation}`);
        }
      },
      File: (
        // @ts-ignore
        typeof File !== "undefined" ? File : class File {
          // @ts-ignore
          constructor() {
            throw new Error(`file uploads aren't supported in this environment yet as 'File' is undefined. ${recommendation}`);
          }
        }
      ),
      ReadableStream: (
        // @ts-ignore
        typeof ReadableStream !== "undefined" ? ReadableStream : class ReadableStream {
          // @ts-ignore
          constructor() {
            throw new Error(`streaming isn't supported in this environment yet as 'ReadableStream' is undefined. ${recommendation}`);
          }
        }
      ),
      getMultipartRequestOptions: async (form, opts) => ({
        ...opts,
        body: new MultipartBody(form)
      }),
      getDefaultAgent: (url) => void 0,
      fileFromPath: () => {
        throw new Error("The `fileFromPath` function is only supported in Node. See the README for more details: https://www.github.com/openai/openai-node#file-uploads");
      },
      isFsReadStream: (value) => false
    };
  }
  if (!kind)
    setShims(getRuntime(), { auto: true });
  class LineDecoder {
    constructor() {
      this.buffer = [];
      this.trailingCR = false;
    }
    decode(chunk) {
      let text = this.decodeText(chunk);
      if (this.trailingCR) {
        text = "\r" + text;
        this.trailingCR = false;
      }
      if (text.endsWith("\r")) {
        this.trailingCR = true;
        text = text.slice(0, -1);
      }
      if (!text) {
        return [];
      }
      const trailingNewline = LineDecoder.NEWLINE_CHARS.has(text[text.length - 1] || "");
      let lines = text.split(LineDecoder.NEWLINE_REGEXP);
      if (trailingNewline) {
        lines.pop();
      }
      if (lines.length === 1 && !trailingNewline) {
        this.buffer.push(lines[0]);
        return [];
      }
      if (this.buffer.length > 0) {
        lines = [this.buffer.join("") + lines[0], ...lines.slice(1)];
        this.buffer = [];
      }
      if (!trailingNewline) {
        this.buffer = [lines.pop() || ""];
      }
      return lines;
    }
    decodeText(bytes) {
      if (bytes == null)
        return "";
      if (typeof bytes === "string")
        return bytes;
      if (typeof Buffer !== "undefined") {
        if (bytes instanceof Buffer) {
          return bytes.toString();
        }
        if (bytes instanceof Uint8Array) {
          return Buffer.from(bytes).toString();
        }
        throw new OpenAIError(`Unexpected: received non-Uint8Array (${bytes.constructor.name}) stream chunk in an environment with a global "Buffer" defined, which this library assumes to be Node. Please report this error.`);
      }
      if (typeof TextDecoder !== "undefined") {
        if (bytes instanceof Uint8Array || bytes instanceof ArrayBuffer) {
          this.textDecoder ?? (this.textDecoder = new TextDecoder("utf8"));
          return this.textDecoder.decode(bytes);
        }
        throw new OpenAIError(`Unexpected: received non-Uint8Array/ArrayBuffer (${bytes.constructor.name}) in a web platform. Please report this error.`);
      }
      throw new OpenAIError(`Unexpected: neither Buffer nor TextDecoder are available as globals. Please report this error.`);
    }
    flush() {
      if (!this.buffer.length && !this.trailingCR) {
        return [];
      }
      const lines = [this.buffer.join("")];
      this.buffer = [];
      this.trailingCR = false;
      return lines;
    }
  }
  LineDecoder.NEWLINE_CHARS = /* @__PURE__ */ new Set(["\n", "\r"]);
  LineDecoder.NEWLINE_REGEXP = /\r\n|[\n\r]/g;
  class Stream {
    constructor(iterator, controller) {
      this.iterator = iterator;
      this.controller = controller;
    }
    static fromSSEResponse(response, controller) {
      let consumed = false;
      async function* iterator() {
        if (consumed) {
          throw new Error("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
        }
        consumed = true;
        let done = false;
        try {
          for await (const sse of _iterSSEMessages(response, controller)) {
            if (done)
              continue;
            if (sse.data.startsWith("[DONE]")) {
              done = true;
              continue;
            }
            if (sse.event === null) {
              let data;
              try {
                data = JSON.parse(sse.data);
              } catch (e) {
                console.error(`Could not parse message into JSON:`, sse.data);
                console.error(`From chunk:`, sse.raw);
                throw e;
              }
              if (data && data.error) {
                throw new APIError(void 0, data.error, void 0, void 0);
              }
              yield data;
            } else {
              let data;
              try {
                data = JSON.parse(sse.data);
              } catch (e) {
                console.error(`Could not parse message into JSON:`, sse.data);
                console.error(`From chunk:`, sse.raw);
                throw e;
              }
              if (sse.event == "error") {
                throw new APIError(void 0, data.error, data.message, void 0);
              }
              yield { event: sse.event, data };
            }
          }
          done = true;
        } catch (e) {
          if (e instanceof Error && e.name === "AbortError")
            return;
          throw e;
        } finally {
          if (!done)
            controller.abort();
        }
      }
      return new Stream(iterator, controller);
    }
    /**
     * Generates a Stream from a newline-separated ReadableStream
     * where each item is a JSON value.
     */
    static fromReadableStream(readableStream, controller) {
      let consumed = false;
      async function* iterLines() {
        const lineDecoder = new LineDecoder();
        const iter = readableStreamAsyncIterable(readableStream);
        for await (const chunk of iter) {
          for (const line of lineDecoder.decode(chunk)) {
            yield line;
          }
        }
        for (const line of lineDecoder.flush()) {
          yield line;
        }
      }
      async function* iterator() {
        if (consumed) {
          throw new Error("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
        }
        consumed = true;
        let done = false;
        try {
          for await (const line of iterLines()) {
            if (done)
              continue;
            if (line)
              yield JSON.parse(line);
          }
          done = true;
        } catch (e) {
          if (e instanceof Error && e.name === "AbortError")
            return;
          throw e;
        } finally {
          if (!done)
            controller.abort();
        }
      }
      return new Stream(iterator, controller);
    }
    [Symbol.asyncIterator]() {
      return this.iterator();
    }
    /**
     * Splits the stream into two streams which can be
     * independently read from at different speeds.
     */
    tee() {
      const left = [];
      const right = [];
      const iterator = this.iterator();
      const teeIterator = (queue) => {
        return {
          next: () => {
            if (queue.length === 0) {
              const result = iterator.next();
              left.push(result);
              right.push(result);
            }
            return queue.shift();
          }
        };
      };
      return [
        new Stream(() => teeIterator(left), this.controller),
        new Stream(() => teeIterator(right), this.controller)
      ];
    }
    /**
     * Converts this stream to a newline-separated ReadableStream of
     * JSON stringified values in the stream
     * which can be turned back into a Stream with `Stream.fromReadableStream()`.
     */
    toReadableStream() {
      const self = this;
      let iter;
      const encoder = new TextEncoder();
      return new ReadableStream$1({
        async start() {
          iter = self[Symbol.asyncIterator]();
        },
        async pull(ctrl) {
          try {
            const { value, done } = await iter.next();
            if (done)
              return ctrl.close();
            const bytes = encoder.encode(JSON.stringify(value) + "\n");
            ctrl.enqueue(bytes);
          } catch (err) {
            ctrl.error(err);
          }
        },
        async cancel() {
          var _a2;
          await ((_a2 = iter.return) == null ? void 0 : _a2.call(iter));
        }
      });
    }
  }
  async function* _iterSSEMessages(response, controller) {
    if (!response.body) {
      controller.abort();
      throw new OpenAIError(`Attempted to iterate over a response with no body`);
    }
    const sseDecoder = new SSEDecoder();
    const lineDecoder = new LineDecoder();
    const iter = readableStreamAsyncIterable(response.body);
    for await (const sseChunk of iterSSEChunks(iter)) {
      for (const line of lineDecoder.decode(sseChunk)) {
        const sse = sseDecoder.decode(line);
        if (sse)
          yield sse;
      }
    }
    for (const line of lineDecoder.flush()) {
      const sse = sseDecoder.decode(line);
      if (sse)
        yield sse;
    }
  }
  async function* iterSSEChunks(iterator) {
    let data = new Uint8Array();
    for await (const chunk of iterator) {
      if (chunk == null) {
        continue;
      }
      const binaryChunk = chunk instanceof ArrayBuffer ? new Uint8Array(chunk) : typeof chunk === "string" ? new TextEncoder().encode(chunk) : chunk;
      let newData = new Uint8Array(data.length + binaryChunk.length);
      newData.set(data);
      newData.set(binaryChunk, data.length);
      data = newData;
      let patternIndex;
      while ((patternIndex = findDoubleNewlineIndex(data)) !== -1) {
        yield data.slice(0, patternIndex);
        data = data.slice(patternIndex);
      }
    }
    if (data.length > 0) {
      yield data;
    }
  }
  function findDoubleNewlineIndex(buffer) {
    const newline = 10;
    const carriage = 13;
    for (let i = 0; i < buffer.length - 2; i++) {
      if (buffer[i] === newline && buffer[i + 1] === newline) {
        return i + 2;
      }
      if (buffer[i] === carriage && buffer[i + 1] === carriage) {
        return i + 2;
      }
      if (buffer[i] === carriage && buffer[i + 1] === newline && i + 3 < buffer.length && buffer[i + 2] === carriage && buffer[i + 3] === newline) {
        return i + 4;
      }
    }
    return -1;
  }
  class SSEDecoder {
    constructor() {
      this.event = null;
      this.data = [];
      this.chunks = [];
    }
    decode(line) {
      if (line.endsWith("\r")) {
        line = line.substring(0, line.length - 1);
      }
      if (!line) {
        if (!this.event && !this.data.length)
          return null;
        const sse = {
          event: this.event,
          data: this.data.join("\n"),
          raw: this.chunks
        };
        this.event = null;
        this.data = [];
        this.chunks = [];
        return sse;
      }
      this.chunks.push(line);
      if (line.startsWith(":")) {
        return null;
      }
      let [fieldname, _, value] = partition(line, ":");
      if (value.startsWith(" ")) {
        value = value.substring(1);
      }
      if (fieldname === "event") {
        this.event = value;
      } else if (fieldname === "data") {
        this.data.push(value);
      }
      return null;
    }
  }
  function partition(str2, delimiter) {
    const index = str2.indexOf(delimiter);
    if (index !== -1) {
      return [str2.substring(0, index), delimiter, str2.substring(index + delimiter.length)];
    }
    return [str2, "", ""];
  }
  function readableStreamAsyncIterable(stream) {
    if (stream[Symbol.asyncIterator])
      return stream;
    const reader = stream.getReader();
    return {
      async next() {
        try {
          const result = await reader.read();
          if (result == null ? void 0 : result.done)
            reader.releaseLock();
          return result;
        } catch (e) {
          reader.releaseLock();
          throw e;
        }
      },
      async return() {
        const cancelPromise = reader.cancel();
        reader.releaseLock();
        await cancelPromise;
        return { done: true, value: void 0 };
      },
      [Symbol.asyncIterator]() {
        return this;
      }
    };
  }
  const isResponseLike = (value) => value != null && typeof value === "object" && typeof value.url === "string" && typeof value.blob === "function";
  const isFileLike = (value) => value != null && typeof value === "object" && typeof value.name === "string" && typeof value.lastModified === "number" && isBlobLike(value);
  const isBlobLike = (value) => value != null && typeof value === "object" && typeof value.size === "number" && typeof value.type === "string" && typeof value.text === "function" && typeof value.slice === "function" && typeof value.arrayBuffer === "function";
  const isUploadable = (value) => {
    return isFileLike(value) || isResponseLike(value) || isFsReadStream(value);
  };
  async function toFile(value, name, options) {
    var _a2;
    value = await value;
    if (isFileLike(value)) {
      return value;
    }
    if (isResponseLike(value)) {
      const blob = await value.blob();
      name || (name = new URL(value.url).pathname.split(/[\\/]/).pop() ?? "unknown_file");
      const data = isBlobLike(blob) ? [await blob.arrayBuffer()] : [blob];
      return new File$1(data, name, options);
    }
    const bits = await getBytes(value);
    name || (name = getName(value) ?? "unknown_file");
    if (!(options == null ? void 0 : options.type)) {
      const type = (_a2 = bits[0]) == null ? void 0 : _a2.type;
      if (typeof type === "string") {
        options = { ...options, type };
      }
    }
    return new File$1(bits, name, options);
  }
  async function getBytes(value) {
    var _a2;
    let parts = [];
    if (typeof value === "string" || ArrayBuffer.isView(value) || // includes Uint8Array, Buffer, etc.
    value instanceof ArrayBuffer) {
      parts.push(value);
    } else if (isBlobLike(value)) {
      parts.push(await value.arrayBuffer());
    } else if (isAsyncIterableIterator(value)) {
      for await (const chunk of value) {
        parts.push(chunk);
      }
    } else {
      throw new Error(`Unexpected data type: ${typeof value}; constructor: ${(_a2 = value == null ? void 0 : value.constructor) == null ? void 0 : _a2.name}; props: ${propsForError(value)}`);
    }
    return parts;
  }
  function propsForError(value) {
    const props = Object.getOwnPropertyNames(value);
    return `[${props.map((p) => `"${p}"`).join(", ")}]`;
  }
  function getName(value) {
    var _a2;
    return getStringFromMaybeBuffer(value.name) || getStringFromMaybeBuffer(value.filename) || // For fs.ReadStream
    ((_a2 = getStringFromMaybeBuffer(value.path)) == null ? void 0 : _a2.split(/[\\/]/).pop());
  }
  const getStringFromMaybeBuffer = (x) => {
    if (typeof x === "string")
      return x;
    if (typeof Buffer !== "undefined" && x instanceof Buffer)
      return String(x);
    return void 0;
  };
  const isAsyncIterableIterator = (value) => value != null && typeof value === "object" && typeof value[Symbol.asyncIterator] === "function";
  const isMultipartBody = (body) => body && typeof body === "object" && body.body && body[Symbol.toStringTag] === "MultipartBody";
  const multipartFormRequestOptions = async (opts) => {
    const form = await createForm(opts.body);
    return getMultipartRequestOptions(form, opts);
  };
  const createForm = async (body) => {
    const form = new FormData$1();
    await Promise.all(Object.entries(body || {}).map(([key, value]) => addFormValue(form, key, value)));
    return form;
  };
  const addFormValue = async (form, key, value) => {
    if (value === void 0)
      return;
    if (value == null) {
      throw new TypeError(`Received null for "${key}"; to pass null in FormData, you must use the string 'null'`);
    }
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      form.append(key, String(value));
    } else if (isUploadable(value)) {
      const file = await toFile(value);
      form.append(key, file);
    } else if (Array.isArray(value)) {
      await Promise.all(value.map((entry) => addFormValue(form, key + "[]", entry)));
    } else if (typeof value === "object") {
      await Promise.all(Object.entries(value).map(([name, prop]) => addFormValue(form, `${key}[${name}]`, prop)));
    } else {
      throw new TypeError(`Invalid value given to form, expected a string, number, boolean, object, Array, File or Blob but got ${value} instead`);
    }
  };
  var __classPrivateFieldSet$3 = globalThis && globalThis.__classPrivateFieldSet || function(receiver, state, value, kind2, f) {
    if (kind2 === "m")
      throw new TypeError("Private method is not writable");
    if (kind2 === "a" && !f)
      throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
      throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return kind2 === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
  };
  var __classPrivateFieldGet$4 = globalThis && globalThis.__classPrivateFieldGet || function(receiver, state, kind2, f) {
    if (kind2 === "a" && !f)
      throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
      throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind2 === "m" ? f : kind2 === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
  };
  var _AbstractPage_client;
  async function defaultParseResponse(props) {
    const { response } = props;
    if (props.options.stream) {
      debug("response", response.status, response.url, response.headers, response.body);
      if (props.options.__streamClass) {
        return props.options.__streamClass.fromSSEResponse(response, props.controller);
      }
      return Stream.fromSSEResponse(response, props.controller);
    }
    if (response.status === 204) {
      return null;
    }
    if (props.options.__binaryResponse) {
      return response;
    }
    const contentType = response.headers.get("content-type");
    const isJSON = (contentType == null ? void 0 : contentType.includes("application/json")) || (contentType == null ? void 0 : contentType.includes("application/vnd.api+json"));
    if (isJSON) {
      const json = await response.json();
      debug("response", response.status, response.url, response.headers, json);
      return _addRequestID(json, response);
    }
    const text = await response.text();
    debug("response", response.status, response.url, response.headers, text);
    return text;
  }
  function _addRequestID(value, response) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return value;
    }
    return Object.defineProperty(value, "_request_id", {
      value: response.headers.get("x-request-id"),
      enumerable: false
    });
  }
  class APIPromise extends Promise {
    constructor(responsePromise, parseResponse = defaultParseResponse) {
      super((resolve) => {
        resolve(null);
      });
      this.responsePromise = responsePromise;
      this.parseResponse = parseResponse;
    }
    _thenUnwrap(transform) {
      return new APIPromise(this.responsePromise, async (props) => _addRequestID(transform(await this.parseResponse(props), props), props.response));
    }
    /**
     * Gets the raw `Response` instance instead of parsing the response
     * data.
     *
     * If you want to parse the response body but still get the `Response`
     * instance, you can use {@link withResponse()}.
     *
     * 👋 Getting the wrong TypeScript type for `Response`?
     * Try setting `"moduleResolution": "NodeNext"` if you can,
     * or add one of these imports before your first `import … from 'openai'`:
     * - `import 'openai/shims/node'` (if you're running on Node)
     * - `import 'openai/shims/web'` (otherwise)
     */
    asResponse() {
      return this.responsePromise.then((p) => p.response);
    }
    /**
     * Gets the parsed response data, the raw `Response` instance and the ID of the request,
     * returned via the X-Request-ID header which is useful for debugging requests and reporting
     * issues to OpenAI.
     *
     * If you just want to get the raw `Response` instance without parsing it,
     * you can use {@link asResponse()}.
     *
     *
     * 👋 Getting the wrong TypeScript type for `Response`?
     * Try setting `"moduleResolution": "NodeNext"` if you can,
     * or add one of these imports before your first `import … from 'openai'`:
     * - `import 'openai/shims/node'` (if you're running on Node)
     * - `import 'openai/shims/web'` (otherwise)
     */
    async withResponse() {
      const [data, response] = await Promise.all([this.parse(), this.asResponse()]);
      return { data, response, request_id: response.headers.get("x-request-id") };
    }
    parse() {
      if (!this.parsedPromise) {
        this.parsedPromise = this.responsePromise.then(this.parseResponse);
      }
      return this.parsedPromise;
    }
    then(onfulfilled, onrejected) {
      return this.parse().then(onfulfilled, onrejected);
    }
    catch(onrejected) {
      return this.parse().catch(onrejected);
    }
    finally(onfinally) {
      return this.parse().finally(onfinally);
    }
  }
  class APIClient {
    constructor({
      baseURL,
      maxRetries = 2,
      timeout = 6e5,
      // 10 minutes
      httpAgent,
      fetch: overridenFetch
    }) {
      this.baseURL = baseURL;
      this.maxRetries = validatePositiveInteger("maxRetries", maxRetries);
      this.timeout = validatePositiveInteger("timeout", timeout);
      this.httpAgent = httpAgent;
      this.fetch = overridenFetch ?? fetch$1;
    }
    authHeaders(opts) {
      return {};
    }
    /**
     * Override this to add your own default headers, for example:
     *
     *  {
     *    ...super.defaultHeaders(),
     *    Authorization: 'Bearer 123',
     *  }
     */
    defaultHeaders(opts) {
      return {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": this.getUserAgent(),
        ...getPlatformHeaders(),
        ...this.authHeaders(opts)
      };
    }
    /**
     * Override this to add your own headers validation:
     */
    validateHeaders(headers, customHeaders) {
    }
    defaultIdempotencyKey() {
      return `stainless-node-retry-${uuid4()}`;
    }
    get(path, opts) {
      return this.methodRequest("get", path, opts);
    }
    post(path, opts) {
      return this.methodRequest("post", path, opts);
    }
    patch(path, opts) {
      return this.methodRequest("patch", path, opts);
    }
    put(path, opts) {
      return this.methodRequest("put", path, opts);
    }
    delete(path, opts) {
      return this.methodRequest("delete", path, opts);
    }
    methodRequest(method, path, opts) {
      return this.request(Promise.resolve(opts).then(async (opts2) => {
        const body = opts2 && isBlobLike(opts2 == null ? void 0 : opts2.body) ? new DataView(await opts2.body.arrayBuffer()) : (opts2 == null ? void 0 : opts2.body) instanceof DataView ? opts2.body : (opts2 == null ? void 0 : opts2.body) instanceof ArrayBuffer ? new DataView(opts2.body) : opts2 && ArrayBuffer.isView(opts2 == null ? void 0 : opts2.body) ? new DataView(opts2.body.buffer) : opts2 == null ? void 0 : opts2.body;
        return { method, path, ...opts2, body };
      }));
    }
    getAPIList(path, Page2, opts) {
      return this.requestAPIList(Page2, { method: "get", path, ...opts });
    }
    calculateContentLength(body) {
      if (typeof body === "string") {
        if (typeof Buffer !== "undefined") {
          return Buffer.byteLength(body, "utf8").toString();
        }
        if (typeof TextEncoder !== "undefined") {
          const encoder = new TextEncoder();
          const encoded = encoder.encode(body);
          return encoded.length.toString();
        }
      } else if (ArrayBuffer.isView(body)) {
        return body.byteLength.toString();
      }
      return null;
    }
    buildRequest(options, { retryCount = 0 } = {}) {
      var _a2;
      const { method, path, query, headers = {} } = options;
      const body = ArrayBuffer.isView(options.body) || options.__binaryRequest && typeof options.body === "string" ? options.body : isMultipartBody(options.body) ? options.body.body : options.body ? JSON.stringify(options.body, null, 2) : null;
      const contentLength = this.calculateContentLength(body);
      const url = this.buildURL(path, query);
      if ("timeout" in options)
        validatePositiveInteger("timeout", options.timeout);
      const timeout = options.timeout ?? this.timeout;
      const httpAgent = options.httpAgent ?? this.httpAgent ?? getDefaultAgent(url);
      const minAgentTimeout = timeout + 1e3;
      if (typeof ((_a2 = httpAgent == null ? void 0 : httpAgent.options) == null ? void 0 : _a2.timeout) === "number" && minAgentTimeout > (httpAgent.options.timeout ?? 0)) {
        httpAgent.options.timeout = minAgentTimeout;
      }
      if (this.idempotencyHeader && method !== "get") {
        if (!options.idempotencyKey)
          options.idempotencyKey = this.defaultIdempotencyKey();
        headers[this.idempotencyHeader] = options.idempotencyKey;
      }
      const reqHeaders = this.buildHeaders({ options, headers, contentLength, retryCount });
      const req = {
        method,
        ...body && { body },
        headers: reqHeaders,
        ...httpAgent && { agent: httpAgent },
        // @ts-ignore node-fetch uses a custom AbortSignal type that is
        // not compatible with standard web types
        signal: options.signal ?? null
      };
      return { req, url, timeout };
    }
    buildHeaders({ options, headers, contentLength, retryCount }) {
      const reqHeaders = {};
      if (contentLength) {
        reqHeaders["content-length"] = contentLength;
      }
      const defaultHeaders = this.defaultHeaders(options);
      applyHeadersMut(reqHeaders, defaultHeaders);
      applyHeadersMut(reqHeaders, headers);
      if (isMultipartBody(options.body) && kind !== "node") {
        delete reqHeaders["content-type"];
      }
      if (getHeader(headers, "x-stainless-retry-count") === void 0) {
        reqHeaders["x-stainless-retry-count"] = String(retryCount);
      }
      this.validateHeaders(reqHeaders, headers);
      return reqHeaders;
    }
    /**
     * Used as a callback for mutating the given `FinalRequestOptions` object.
     */
    async prepareOptions(options) {
    }
    /**
     * Used as a callback for mutating the given `RequestInit` object.
     *
     * This is useful for cases where you want to add certain headers based off of
     * the request properties, e.g. `method` or `url`.
     */
    async prepareRequest(request, { url, options }) {
    }
    parseHeaders(headers) {
      return !headers ? {} : Symbol.iterator in headers ? Object.fromEntries(Array.from(headers).map((header) => [...header])) : { ...headers };
    }
    makeStatusError(status, error, message, headers) {
      return APIError.generate(status, error, message, headers);
    }
    request(options, remainingRetries = null) {
      return new APIPromise(this.makeRequest(options, remainingRetries));
    }
    async makeRequest(optionsInput, retriesRemaining) {
      var _a2, _b;
      const options = await optionsInput;
      const maxRetries = options.maxRetries ?? this.maxRetries;
      if (retriesRemaining == null) {
        retriesRemaining = maxRetries;
      }
      await this.prepareOptions(options);
      const { req, url, timeout } = this.buildRequest(options, { retryCount: maxRetries - retriesRemaining });
      await this.prepareRequest(req, { url, options });
      debug("request", url, options, req.headers);
      if ((_a2 = options.signal) == null ? void 0 : _a2.aborted) {
        throw new APIUserAbortError();
      }
      const controller = new AbortController();
      const response = await this.fetchWithTimeout(url, req, timeout, controller).catch(castToError);
      if (response instanceof Error) {
        if ((_b = options.signal) == null ? void 0 : _b.aborted) {
          throw new APIUserAbortError();
        }
        if (retriesRemaining) {
          return this.retryRequest(options, retriesRemaining);
        }
        if (response.name === "AbortError") {
          throw new APIConnectionTimeoutError();
        }
        throw new APIConnectionError({ cause: response });
      }
      const responseHeaders = createResponseHeaders(response.headers);
      if (!response.ok) {
        if (retriesRemaining && this.shouldRetry(response)) {
          const retryMessage2 = `retrying, ${retriesRemaining} attempts remaining`;
          debug(`response (error; ${retryMessage2})`, response.status, url, responseHeaders);
          return this.retryRequest(options, retriesRemaining, responseHeaders);
        }
        const errText = await response.text().catch((e) => castToError(e).message);
        const errJSON = safeJSON(errText);
        const errMessage = errJSON ? void 0 : errText;
        const retryMessage = retriesRemaining ? `(error; no more retries left)` : `(error; not retryable)`;
        debug(`response (error; ${retryMessage})`, response.status, url, responseHeaders, errMessage);
        const err = this.makeStatusError(response.status, errJSON, errMessage, responseHeaders);
        throw err;
      }
      return { response, options, controller };
    }
    requestAPIList(Page2, options) {
      const request = this.makeRequest(options, null);
      return new PagePromise(this, request, Page2);
    }
    buildURL(path, query) {
      const url = isAbsoluteURL(path) ? new URL(path) : new URL(this.baseURL + (this.baseURL.endsWith("/") && path.startsWith("/") ? path.slice(1) : path));
      const defaultQuery = this.defaultQuery();
      if (!isEmptyObj(defaultQuery)) {
        query = { ...defaultQuery, ...query };
      }
      if (typeof query === "object" && query && !Array.isArray(query)) {
        url.search = this.stringifyQuery(query);
      }
      return url.toString();
    }
    stringifyQuery(query) {
      return Object.entries(query).filter(([_, value]) => typeof value !== "undefined").map(([key, value]) => {
        if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
          return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        }
        if (value === null) {
          return `${encodeURIComponent(key)}=`;
        }
        throw new OpenAIError(`Cannot stringify type ${typeof value}; Expected string, number, boolean, or null. If you need to pass nested query parameters, you can manually encode them, e.g. { query: { 'foo[key1]': value1, 'foo[key2]': value2 } }, and please open a GitHub issue requesting better support for your use case.`);
      }).join("&");
    }
    async fetchWithTimeout(url, init, ms, controller) {
      const { signal, ...options } = init || {};
      if (signal)
        signal.addEventListener("abort", () => controller.abort());
      const timeout = setTimeout(() => controller.abort(), ms);
      return this.getRequestClient().fetch.call(void 0, url, { signal: controller.signal, ...options }).finally(() => {
        clearTimeout(timeout);
      });
    }
    getRequestClient() {
      return { fetch: this.fetch };
    }
    shouldRetry(response) {
      const shouldRetryHeader = response.headers.get("x-should-retry");
      if (shouldRetryHeader === "true")
        return true;
      if (shouldRetryHeader === "false")
        return false;
      if (response.status === 408)
        return true;
      if (response.status === 409)
        return true;
      if (response.status === 429)
        return true;
      if (response.status >= 500)
        return true;
      return false;
    }
    async retryRequest(options, retriesRemaining, responseHeaders) {
      let timeoutMillis;
      const retryAfterMillisHeader = responseHeaders == null ? void 0 : responseHeaders["retry-after-ms"];
      if (retryAfterMillisHeader) {
        const timeoutMs = parseFloat(retryAfterMillisHeader);
        if (!Number.isNaN(timeoutMs)) {
          timeoutMillis = timeoutMs;
        }
      }
      const retryAfterHeader = responseHeaders == null ? void 0 : responseHeaders["retry-after"];
      if (retryAfterHeader && !timeoutMillis) {
        const timeoutSeconds = parseFloat(retryAfterHeader);
        if (!Number.isNaN(timeoutSeconds)) {
          timeoutMillis = timeoutSeconds * 1e3;
        } else {
          timeoutMillis = Date.parse(retryAfterHeader) - Date.now();
        }
      }
      if (!(timeoutMillis && 0 <= timeoutMillis && timeoutMillis < 60 * 1e3)) {
        const maxRetries = options.maxRetries ?? this.maxRetries;
        timeoutMillis = this.calculateDefaultRetryTimeoutMillis(retriesRemaining, maxRetries);
      }
      await sleep(timeoutMillis);
      return this.makeRequest(options, retriesRemaining - 1);
    }
    calculateDefaultRetryTimeoutMillis(retriesRemaining, maxRetries) {
      const initialRetryDelay = 0.5;
      const maxRetryDelay = 8;
      const numRetries = maxRetries - retriesRemaining;
      const sleepSeconds = Math.min(initialRetryDelay * Math.pow(2, numRetries), maxRetryDelay);
      const jitter = 1 - Math.random() * 0.25;
      return sleepSeconds * jitter * 1e3;
    }
    getUserAgent() {
      return `${this.constructor.name}/JS ${VERSION}`;
    }
  }
  class AbstractPage {
    constructor(client, response, body, options) {
      _AbstractPage_client.set(this, void 0);
      __classPrivateFieldSet$3(this, _AbstractPage_client, client, "f");
      this.options = options;
      this.response = response;
      this.body = body;
    }
    hasNextPage() {
      const items = this.getPaginatedItems();
      if (!items.length)
        return false;
      return this.nextPageInfo() != null;
    }
    async getNextPage() {
      const nextInfo = this.nextPageInfo();
      if (!nextInfo) {
        throw new OpenAIError("No next page expected; please check `.hasNextPage()` before calling `.getNextPage()`.");
      }
      const nextOptions = { ...this.options };
      if ("params" in nextInfo && typeof nextOptions.query === "object") {
        nextOptions.query = { ...nextOptions.query, ...nextInfo.params };
      } else if ("url" in nextInfo) {
        const params = [...Object.entries(nextOptions.query || {}), ...nextInfo.url.searchParams.entries()];
        for (const [key, value] of params) {
          nextInfo.url.searchParams.set(key, value);
        }
        nextOptions.query = void 0;
        nextOptions.path = nextInfo.url.toString();
      }
      return await __classPrivateFieldGet$4(this, _AbstractPage_client, "f").requestAPIList(this.constructor, nextOptions);
    }
    async *iterPages() {
      let page = this;
      yield page;
      while (page.hasNextPage()) {
        page = await page.getNextPage();
        yield page;
      }
    }
    async *[(_AbstractPage_client = /* @__PURE__ */ new WeakMap(), Symbol.asyncIterator)]() {
      for await (const page of this.iterPages()) {
        for (const item of page.getPaginatedItems()) {
          yield item;
        }
      }
    }
  }
  class PagePromise extends APIPromise {
    constructor(client, request, Page2) {
      super(request, async (props) => new Page2(client, props.response, await defaultParseResponse(props), props.options));
    }
    /**
     * Allow auto-paginating iteration on an unawaited list call, eg:
     *
     *    for await (const item of client.items.list()) {
     *      console.log(item)
     *    }
     */
    async *[Symbol.asyncIterator]() {
      const page = await this;
      for await (const item of page) {
        yield item;
      }
    }
  }
  const createResponseHeaders = (headers) => {
    return new Proxy(Object.fromEntries(
      // @ts-ignore
      headers.entries()
    ), {
      get(target, name) {
        const key = name.toString();
        return target[key.toLowerCase()] || target[key];
      }
    });
  };
  const requestOptionsKeys = {
    method: true,
    path: true,
    query: true,
    body: true,
    headers: true,
    maxRetries: true,
    stream: true,
    timeout: true,
    httpAgent: true,
    signal: true,
    idempotencyKey: true,
    __binaryRequest: true,
    __binaryResponse: true,
    __streamClass: true
  };
  const isRequestOptions = (obj) => {
    return typeof obj === "object" && obj !== null && !isEmptyObj(obj) && Object.keys(obj).every((k) => hasOwn(requestOptionsKeys, k));
  };
  const getPlatformProperties = () => {
    var _a2;
    if (typeof Deno !== "undefined" && Deno.build != null) {
      return {
        "X-Stainless-Lang": "js",
        "X-Stainless-Package-Version": VERSION,
        "X-Stainless-OS": normalizePlatform(Deno.build.os),
        "X-Stainless-Arch": normalizeArch(Deno.build.arch),
        "X-Stainless-Runtime": "deno",
        "X-Stainless-Runtime-Version": typeof Deno.version === "string" ? Deno.version : ((_a2 = Deno.version) == null ? void 0 : _a2.deno) ?? "unknown"
      };
    }
    if (typeof EdgeRuntime !== "undefined") {
      return {
        "X-Stainless-Lang": "js",
        "X-Stainless-Package-Version": VERSION,
        "X-Stainless-OS": "Unknown",
        "X-Stainless-Arch": `other:${EdgeRuntime}`,
        "X-Stainless-Runtime": "edge",
        "X-Stainless-Runtime-Version": process.version
      };
    }
    if (Object.prototype.toString.call(typeof process !== "undefined" ? process : 0) === "[object process]") {
      return {
        "X-Stainless-Lang": "js",
        "X-Stainless-Package-Version": VERSION,
        "X-Stainless-OS": normalizePlatform(process.platform),
        "X-Stainless-Arch": normalizeArch(process.arch),
        "X-Stainless-Runtime": "node",
        "X-Stainless-Runtime-Version": process.version
      };
    }
    const browserInfo = getBrowserInfo();
    if (browserInfo) {
      return {
        "X-Stainless-Lang": "js",
        "X-Stainless-Package-Version": VERSION,
        "X-Stainless-OS": "Unknown",
        "X-Stainless-Arch": "unknown",
        "X-Stainless-Runtime": `browser:${browserInfo.browser}`,
        "X-Stainless-Runtime-Version": browserInfo.version
      };
    }
    return {
      "X-Stainless-Lang": "js",
      "X-Stainless-Package-Version": VERSION,
      "X-Stainless-OS": "Unknown",
      "X-Stainless-Arch": "unknown",
      "X-Stainless-Runtime": "unknown",
      "X-Stainless-Runtime-Version": "unknown"
    };
  };
  function getBrowserInfo() {
    if (typeof navigator === "undefined" || !navigator) {
      return null;
    }
    const browserPatterns = [
      { key: "edge", pattern: /Edge(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
      { key: "ie", pattern: /MSIE(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
      { key: "ie", pattern: /Trident(?:.*rv\:(\d+)\.(\d+)(?:\.(\d+))?)?/ },
      { key: "chrome", pattern: /Chrome(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
      { key: "firefox", pattern: /Firefox(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
      { key: "safari", pattern: /(?:Version\W+(\d+)\.(\d+)(?:\.(\d+))?)?(?:\W+Mobile\S*)?\W+Safari/ }
    ];
    for (const { key, pattern } of browserPatterns) {
      const match = pattern.exec(navigator.userAgent);
      if (match) {
        const major = match[1] || 0;
        const minor = match[2] || 0;
        const patch = match[3] || 0;
        return { browser: key, version: `${major}.${minor}.${patch}` };
      }
    }
    return null;
  }
  const normalizeArch = (arch) => {
    if (arch === "x32")
      return "x32";
    if (arch === "x86_64" || arch === "x64")
      return "x64";
    if (arch === "arm")
      return "arm";
    if (arch === "aarch64" || arch === "arm64")
      return "arm64";
    if (arch)
      return `other:${arch}`;
    return "unknown";
  };
  const normalizePlatform = (platform) => {
    platform = platform.toLowerCase();
    if (platform.includes("ios"))
      return "iOS";
    if (platform === "android")
      return "Android";
    if (platform === "darwin")
      return "MacOS";
    if (platform === "win32")
      return "Windows";
    if (platform === "freebsd")
      return "FreeBSD";
    if (platform === "openbsd")
      return "OpenBSD";
    if (platform === "linux")
      return "Linux";
    if (platform)
      return `Other:${platform}`;
    return "Unknown";
  };
  let _platformHeaders;
  const getPlatformHeaders = () => {
    return _platformHeaders ?? (_platformHeaders = getPlatformProperties());
  };
  const safeJSON = (text) => {
    try {
      return JSON.parse(text);
    } catch (err) {
      return void 0;
    }
  };
  const startsWithSchemeRegexp = new RegExp("^(?:[a-z]+:)?//", "i");
  const isAbsoluteURL = (url) => {
    return startsWithSchemeRegexp.test(url);
  };
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const validatePositiveInteger = (name, n) => {
    if (typeof n !== "number" || !Number.isInteger(n)) {
      throw new OpenAIError(`${name} must be an integer`);
    }
    if (n < 0) {
      throw new OpenAIError(`${name} must be a positive integer`);
    }
    return n;
  };
  const castToError = (err) => {
    if (err instanceof Error)
      return err;
    if (typeof err === "object" && err !== null) {
      try {
        return new Error(JSON.stringify(err));
      } catch {
      }
    }
    return new Error(err);
  };
  const readEnv = (env) => {
    var _a2, _b, _c, _d, _e;
    if (typeof process !== "undefined") {
      return ((_b = (_a2 = process.env) == null ? void 0 : _a2[env]) == null ? void 0 : _b.trim()) ?? void 0;
    }
    if (typeof Deno !== "undefined") {
      return (_e = (_d = (_c = Deno.env) == null ? void 0 : _c.get) == null ? void 0 : _d.call(_c, env)) == null ? void 0 : _e.trim();
    }
    return void 0;
  };
  function isEmptyObj(obj) {
    if (!obj)
      return true;
    for (const _k in obj)
      return false;
    return true;
  }
  function hasOwn(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }
  function applyHeadersMut(targetHeaders, newHeaders) {
    for (const k in newHeaders) {
      if (!hasOwn(newHeaders, k))
        continue;
      const lowerKey = k.toLowerCase();
      if (!lowerKey)
        continue;
      const val = newHeaders[k];
      if (val === null) {
        delete targetHeaders[lowerKey];
      } else if (val !== void 0) {
        targetHeaders[lowerKey] = val;
      }
    }
  }
  function debug(action, ...args) {
    var _a2;
    if (typeof process !== "undefined" && ((_a2 = process == null ? void 0 : process.env) == null ? void 0 : _a2["DEBUG"]) === "true") {
      console.log(`OpenAI:DEBUG:${action}`, ...args);
    }
  }
  const uuid4 = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === "x" ? r : r & 3 | 8;
      return v.toString(16);
    });
  };
  const isRunningInBrowser = () => {
    return (
      // @ts-ignore
      typeof window !== "undefined" && // @ts-ignore
      typeof window.document !== "undefined" && // @ts-ignore
      typeof navigator !== "undefined"
    );
  };
  const isHeadersProtocol = (headers) => {
    return typeof (headers == null ? void 0 : headers.get) === "function";
  };
  const getHeader = (headers, header) => {
    var _a2;
    const lowerCasedHeader = header.toLowerCase();
    if (isHeadersProtocol(headers)) {
      const intercapsHeader = ((_a2 = header[0]) == null ? void 0 : _a2.toUpperCase()) + header.substring(1).replace(/([^\w])(\w)/g, (_m, g1, g2) => g1 + g2.toUpperCase());
      for (const key of [header, lowerCasedHeader, header.toUpperCase(), intercapsHeader]) {
        const value = headers.get(key);
        if (value) {
          return value;
        }
      }
    }
    for (const [key, value] of Object.entries(headers)) {
      if (key.toLowerCase() === lowerCasedHeader) {
        if (Array.isArray(value)) {
          if (value.length <= 1)
            return value[0];
          console.warn(`Received ${value.length} entries for the ${header} header, using the first entry.`);
          return value[0];
        }
        return value;
      }
    }
    return void 0;
  };
  function isObj(obj) {
    return obj != null && typeof obj === "object" && !Array.isArray(obj);
  }
  class OpenAIError extends Error {
  }
  class APIError extends OpenAIError {
    constructor(status, error, message, headers) {
      super(`${APIError.makeMessage(status, error, message)}`);
      this.status = status;
      this.headers = headers;
      this.request_id = headers == null ? void 0 : headers["x-request-id"];
      const data = error;
      this.error = data;
      this.code = data == null ? void 0 : data["code"];
      this.param = data == null ? void 0 : data["param"];
      this.type = data == null ? void 0 : data["type"];
    }
    static makeMessage(status, error, message) {
      const msg = (error == null ? void 0 : error.message) ? typeof error.message === "string" ? error.message : JSON.stringify(error.message) : error ? JSON.stringify(error) : message;
      if (status && msg) {
        return `${status} ${msg}`;
      }
      if (status) {
        return `${status} status code (no body)`;
      }
      if (msg) {
        return msg;
      }
      return "(no status code or body)";
    }
    static generate(status, errorResponse, message, headers) {
      if (!status) {
        return new APIConnectionError({ message, cause: castToError(errorResponse) });
      }
      const error = errorResponse == null ? void 0 : errorResponse["error"];
      if (status === 400) {
        return new BadRequestError(status, error, message, headers);
      }
      if (status === 401) {
        return new AuthenticationError(status, error, message, headers);
      }
      if (status === 403) {
        return new PermissionDeniedError(status, error, message, headers);
      }
      if (status === 404) {
        return new NotFoundError(status, error, message, headers);
      }
      if (status === 409) {
        return new ConflictError(status, error, message, headers);
      }
      if (status === 422) {
        return new UnprocessableEntityError(status, error, message, headers);
      }
      if (status === 429) {
        return new RateLimitError(status, error, message, headers);
      }
      if (status >= 500) {
        return new InternalServerError(status, error, message, headers);
      }
      return new APIError(status, error, message, headers);
    }
  }
  class APIUserAbortError extends APIError {
    constructor({ message } = {}) {
      super(void 0, void 0, message || "Request was aborted.", void 0);
      this.status = void 0;
    }
  }
  class APIConnectionError extends APIError {
    constructor({ message, cause }) {
      super(void 0, void 0, message || "Connection error.", void 0);
      this.status = void 0;
      if (cause)
        this.cause = cause;
    }
  }
  class APIConnectionTimeoutError extends APIConnectionError {
    constructor({ message } = {}) {
      super({ message: message ?? "Request timed out." });
    }
  }
  class BadRequestError extends APIError {
    constructor() {
      super(...arguments);
      this.status = 400;
    }
  }
  class AuthenticationError extends APIError {
    constructor() {
      super(...arguments);
      this.status = 401;
    }
  }
  class PermissionDeniedError extends APIError {
    constructor() {
      super(...arguments);
      this.status = 403;
    }
  }
  class NotFoundError extends APIError {
    constructor() {
      super(...arguments);
      this.status = 404;
    }
  }
  class ConflictError extends APIError {
    constructor() {
      super(...arguments);
      this.status = 409;
    }
  }
  class UnprocessableEntityError extends APIError {
    constructor() {
      super(...arguments);
      this.status = 422;
    }
  }
  class RateLimitError extends APIError {
    constructor() {
      super(...arguments);
      this.status = 429;
    }
  }
  class InternalServerError extends APIError {
  }
  class LengthFinishReasonError extends OpenAIError {
    constructor() {
      super(`Could not parse response content as the length limit was reached`);
    }
  }
  class ContentFilterFinishReasonError extends OpenAIError {
    constructor() {
      super(`Could not parse response content as the request was rejected by the content filter`);
    }
  }
  const default_format = "RFC3986";
  const formatters = {
    RFC1738: (v) => String(v).replace(/%20/g, "+"),
    RFC3986: (v) => String(v)
  };
  const RFC1738 = "RFC1738";
  const is_array$1 = Array.isArray;
  const hex_table = (() => {
    const array = [];
    for (let i = 0; i < 256; ++i) {
      array.push("%" + ((i < 16 ? "0" : "") + i.toString(16)).toUpperCase());
    }
    return array;
  })();
  const limit = 1024;
  const encode = (str2, _defaultEncoder, charset, _kind, format) => {
    if (str2.length === 0) {
      return str2;
    }
    let string = str2;
    if (typeof str2 === "symbol") {
      string = Symbol.prototype.toString.call(str2);
    } else if (typeof str2 !== "string") {
      string = String(str2);
    }
    if (charset === "iso-8859-1") {
      return escape(string).replace(/%u[0-9a-f]{4}/gi, function($0) {
        return "%26%23" + parseInt($0.slice(2), 16) + "%3B";
      });
    }
    let out = "";
    for (let j = 0; j < string.length; j += limit) {
      const segment = string.length >= limit ? string.slice(j, j + limit) : string;
      const arr = [];
      for (let i = 0; i < segment.length; ++i) {
        let c = segment.charCodeAt(i);
        if (c === 45 || // -
        c === 46 || // .
        c === 95 || // _
        c === 126 || // ~
        c >= 48 && c <= 57 || // 0-9
        c >= 65 && c <= 90 || // a-z
        c >= 97 && c <= 122 || // A-Z
        format === RFC1738 && (c === 40 || c === 41)) {
          arr[arr.length] = segment.charAt(i);
          continue;
        }
        if (c < 128) {
          arr[arr.length] = hex_table[c];
          continue;
        }
        if (c < 2048) {
          arr[arr.length] = hex_table[192 | c >> 6] + hex_table[128 | c & 63];
          continue;
        }
        if (c < 55296 || c >= 57344) {
          arr[arr.length] = hex_table[224 | c >> 12] + hex_table[128 | c >> 6 & 63] + hex_table[128 | c & 63];
          continue;
        }
        i += 1;
        c = 65536 + ((c & 1023) << 10 | segment.charCodeAt(i) & 1023);
        arr[arr.length] = hex_table[240 | c >> 18] + hex_table[128 | c >> 12 & 63] + hex_table[128 | c >> 6 & 63] + hex_table[128 | c & 63];
      }
      out += arr.join("");
    }
    return out;
  };
  function is_buffer(obj) {
    if (!obj || typeof obj !== "object") {
      return false;
    }
    return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
  }
  function maybe_map(val, fn) {
    if (is_array$1(val)) {
      const mapped = [];
      for (let i = 0; i < val.length; i += 1) {
        mapped.push(fn(val[i]));
      }
      return mapped;
    }
    return fn(val);
  }
  const has = Object.prototype.hasOwnProperty;
  const array_prefix_generators = {
    brackets(prefix) {
      return String(prefix) + "[]";
    },
    comma: "comma",
    indices(prefix, key) {
      return String(prefix) + "[" + key + "]";
    },
    repeat(prefix) {
      return String(prefix);
    }
  };
  const is_array = Array.isArray;
  const push = Array.prototype.push;
  const push_to_array = function(arr, value_or_array) {
    push.apply(arr, is_array(value_or_array) ? value_or_array : [value_or_array]);
  };
  const to_ISO = Date.prototype.toISOString;
  const defaults = {
    addQueryPrefix: false,
    allowDots: false,
    allowEmptyArrays: false,
    arrayFormat: "indices",
    charset: "utf-8",
    charsetSentinel: false,
    delimiter: "&",
    encode: true,
    encodeDotInKeys: false,
    encoder: encode,
    encodeValuesOnly: false,
    format: default_format,
    formatter: formatters[default_format],
    /** @deprecated */
    indices: false,
    serializeDate(date) {
      return to_ISO.call(date);
    },
    skipNulls: false,
    strictNullHandling: false
  };
  function is_non_nullish_primitive(v) {
    return typeof v === "string" || typeof v === "number" || typeof v === "boolean" || typeof v === "symbol" || typeof v === "bigint";
  }
  const sentinel = {};
  function inner_stringify(object, prefix, generateArrayPrefix, commaRoundTrip, allowEmptyArrays, strictNullHandling, skipNulls, encodeDotInKeys, encoder, filter, sort, allowDots, serializeDate, format, formatter, encodeValuesOnly, charset, sideChannel) {
    let obj = object;
    let tmp_sc = sideChannel;
    let step = 0;
    let find_flag = false;
    while ((tmp_sc = tmp_sc.get(sentinel)) !== void 0 && !find_flag) {
      const pos = tmp_sc.get(object);
      step += 1;
      if (typeof pos !== "undefined") {
        if (pos === step) {
          throw new RangeError("Cyclic object value");
        } else {
          find_flag = true;
        }
      }
      if (typeof tmp_sc.get(sentinel) === "undefined") {
        step = 0;
      }
    }
    if (typeof filter === "function") {
      obj = filter(prefix, obj);
    } else if (obj instanceof Date) {
      obj = serializeDate == null ? void 0 : serializeDate(obj);
    } else if (generateArrayPrefix === "comma" && is_array(obj)) {
      obj = maybe_map(obj, function(value) {
        if (value instanceof Date) {
          return serializeDate == null ? void 0 : serializeDate(value);
        }
        return value;
      });
    }
    if (obj === null) {
      if (strictNullHandling) {
        return encoder && !encodeValuesOnly ? (
          // @ts-expect-error
          encoder(prefix, defaults.encoder, charset, "key", format)
        ) : prefix;
      }
      obj = "";
    }
    if (is_non_nullish_primitive(obj) || is_buffer(obj)) {
      if (encoder) {
        const key_value = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder, charset, "key", format);
        return [
          (formatter == null ? void 0 : formatter(key_value)) + "=" + // @ts-expect-error
          (formatter == null ? void 0 : formatter(encoder(obj, defaults.encoder, charset, "value", format)))
        ];
      }
      return [(formatter == null ? void 0 : formatter(prefix)) + "=" + (formatter == null ? void 0 : formatter(String(obj)))];
    }
    const values = [];
    if (typeof obj === "undefined") {
      return values;
    }
    let obj_keys;
    if (generateArrayPrefix === "comma" && is_array(obj)) {
      if (encodeValuesOnly && encoder) {
        obj = maybe_map(obj, encoder);
      }
      obj_keys = [{ value: obj.length > 0 ? obj.join(",") || null : void 0 }];
    } else if (is_array(filter)) {
      obj_keys = filter;
    } else {
      const keys = Object.keys(obj);
      obj_keys = sort ? keys.sort(sort) : keys;
    }
    const encoded_prefix = encodeDotInKeys ? String(prefix).replace(/\./g, "%2E") : String(prefix);
    const adjusted_prefix = commaRoundTrip && is_array(obj) && obj.length === 1 ? encoded_prefix + "[]" : encoded_prefix;
    if (allowEmptyArrays && is_array(obj) && obj.length === 0) {
      return adjusted_prefix + "[]";
    }
    for (let j = 0; j < obj_keys.length; ++j) {
      const key = obj_keys[j];
      const value = (
        // @ts-ignore
        typeof key === "object" && typeof key.value !== "undefined" ? key.value : obj[key]
      );
      if (skipNulls && value === null) {
        continue;
      }
      const encoded_key = allowDots && encodeDotInKeys ? key.replace(/\./g, "%2E") : key;
      const key_prefix = is_array(obj) ? typeof generateArrayPrefix === "function" ? generateArrayPrefix(adjusted_prefix, encoded_key) : adjusted_prefix : adjusted_prefix + (allowDots ? "." + encoded_key : "[" + encoded_key + "]");
      sideChannel.set(object, step);
      const valueSideChannel = /* @__PURE__ */ new WeakMap();
      valueSideChannel.set(sentinel, sideChannel);
      push_to_array(values, inner_stringify(
        value,
        key_prefix,
        generateArrayPrefix,
        commaRoundTrip,
        allowEmptyArrays,
        strictNullHandling,
        skipNulls,
        encodeDotInKeys,
        // @ts-ignore
        generateArrayPrefix === "comma" && encodeValuesOnly && is_array(obj) ? null : encoder,
        filter,
        sort,
        allowDots,
        serializeDate,
        format,
        formatter,
        encodeValuesOnly,
        charset,
        valueSideChannel
      ));
    }
    return values;
  }
  function normalize_stringify_options(opts = defaults) {
    if (typeof opts.allowEmptyArrays !== "undefined" && typeof opts.allowEmptyArrays !== "boolean") {
      throw new TypeError("`allowEmptyArrays` option can only be `true` or `false`, when provided");
    }
    if (typeof opts.encodeDotInKeys !== "undefined" && typeof opts.encodeDotInKeys !== "boolean") {
      throw new TypeError("`encodeDotInKeys` option can only be `true` or `false`, when provided");
    }
    if (opts.encoder !== null && typeof opts.encoder !== "undefined" && typeof opts.encoder !== "function") {
      throw new TypeError("Encoder has to be a function.");
    }
    const charset = opts.charset || defaults.charset;
    if (typeof opts.charset !== "undefined" && opts.charset !== "utf-8" && opts.charset !== "iso-8859-1") {
      throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
    }
    let format = default_format;
    if (typeof opts.format !== "undefined") {
      if (!has.call(formatters, opts.format)) {
        throw new TypeError("Unknown format option provided.");
      }
      format = opts.format;
    }
    const formatter = formatters[format];
    let filter = defaults.filter;
    if (typeof opts.filter === "function" || is_array(opts.filter)) {
      filter = opts.filter;
    }
    let arrayFormat;
    if (opts.arrayFormat && opts.arrayFormat in array_prefix_generators) {
      arrayFormat = opts.arrayFormat;
    } else if ("indices" in opts) {
      arrayFormat = opts.indices ? "indices" : "repeat";
    } else {
      arrayFormat = defaults.arrayFormat;
    }
    if ("commaRoundTrip" in opts && typeof opts.commaRoundTrip !== "boolean") {
      throw new TypeError("`commaRoundTrip` must be a boolean, or absent");
    }
    const allowDots = typeof opts.allowDots === "undefined" ? !!opts.encodeDotInKeys === true ? true : defaults.allowDots : !!opts.allowDots;
    return {
      addQueryPrefix: typeof opts.addQueryPrefix === "boolean" ? opts.addQueryPrefix : defaults.addQueryPrefix,
      // @ts-ignore
      allowDots,
      allowEmptyArrays: typeof opts.allowEmptyArrays === "boolean" ? !!opts.allowEmptyArrays : defaults.allowEmptyArrays,
      arrayFormat,
      charset,
      charsetSentinel: typeof opts.charsetSentinel === "boolean" ? opts.charsetSentinel : defaults.charsetSentinel,
      commaRoundTrip: !!opts.commaRoundTrip,
      delimiter: typeof opts.delimiter === "undefined" ? defaults.delimiter : opts.delimiter,
      encode: typeof opts.encode === "boolean" ? opts.encode : defaults.encode,
      encodeDotInKeys: typeof opts.encodeDotInKeys === "boolean" ? opts.encodeDotInKeys : defaults.encodeDotInKeys,
      encoder: typeof opts.encoder === "function" ? opts.encoder : defaults.encoder,
      encodeValuesOnly: typeof opts.encodeValuesOnly === "boolean" ? opts.encodeValuesOnly : defaults.encodeValuesOnly,
      filter,
      format,
      formatter,
      serializeDate: typeof opts.serializeDate === "function" ? opts.serializeDate : defaults.serializeDate,
      skipNulls: typeof opts.skipNulls === "boolean" ? opts.skipNulls : defaults.skipNulls,
      // @ts-ignore
      sort: typeof opts.sort === "function" ? opts.sort : null,
      strictNullHandling: typeof opts.strictNullHandling === "boolean" ? opts.strictNullHandling : defaults.strictNullHandling
    };
  }
  function stringify(object, opts = {}) {
    let obj = object;
    const options = normalize_stringify_options(opts);
    let obj_keys;
    let filter;
    if (typeof options.filter === "function") {
      filter = options.filter;
      obj = filter("", obj);
    } else if (is_array(options.filter)) {
      filter = options.filter;
      obj_keys = filter;
    }
    const keys = [];
    if (typeof obj !== "object" || obj === null) {
      return "";
    }
    const generateArrayPrefix = array_prefix_generators[options.arrayFormat];
    const commaRoundTrip = generateArrayPrefix === "comma" && options.commaRoundTrip;
    if (!obj_keys) {
      obj_keys = Object.keys(obj);
    }
    if (options.sort) {
      obj_keys.sort(options.sort);
    }
    const sideChannel = /* @__PURE__ */ new WeakMap();
    for (let i = 0; i < obj_keys.length; ++i) {
      const key = obj_keys[i];
      if (options.skipNulls && obj[key] === null) {
        continue;
      }
      push_to_array(keys, inner_stringify(
        obj[key],
        key,
        // @ts-expect-error
        generateArrayPrefix,
        commaRoundTrip,
        options.allowEmptyArrays,
        options.strictNullHandling,
        options.skipNulls,
        options.encodeDotInKeys,
        options.encode ? options.encoder : null,
        options.filter,
        options.sort,
        options.allowDots,
        options.serializeDate,
        options.format,
        options.formatter,
        options.encodeValuesOnly,
        options.charset,
        sideChannel
      ));
    }
    const joined = keys.join(options.delimiter);
    let prefix = options.addQueryPrefix === true ? "?" : "";
    if (options.charsetSentinel) {
      if (options.charset === "iso-8859-1") {
        prefix += "utf8=%26%2310003%3B&";
      } else {
        prefix += "utf8=%E2%9C%93&";
      }
    }
    return joined.length > 0 ? prefix + joined : "";
  }
  class Page extends AbstractPage {
    constructor(client, response, body, options) {
      super(client, response, body, options);
      this.data = body.data || [];
      this.object = body.object;
    }
    getPaginatedItems() {
      return this.data ?? [];
    }
    // @deprecated Please use `nextPageInfo()` instead
    /**
     * This page represents a response that isn't actually paginated at the API level
     * so there will never be any next page params.
     */
    nextPageParams() {
      return null;
    }
    nextPageInfo() {
      return null;
    }
  }
  class CursorPage extends AbstractPage {
    constructor(client, response, body, options) {
      super(client, response, body, options);
      this.data = body.data || [];
    }
    getPaginatedItems() {
      return this.data ?? [];
    }
    // @deprecated Please use `nextPageInfo()` instead
    nextPageParams() {
      const info = this.nextPageInfo();
      if (!info)
        return null;
      if ("params" in info)
        return info.params;
      const params = Object.fromEntries(info.url.searchParams);
      if (!Object.keys(params).length)
        return null;
      return params;
    }
    nextPageInfo() {
      var _a2;
      const data = this.getPaginatedItems();
      if (!data.length) {
        return null;
      }
      const id = (_a2 = data[data.length - 1]) == null ? void 0 : _a2.id;
      if (!id) {
        return null;
      }
      return { params: { after: id } };
    }
  }
  class APIResource {
    constructor(client) {
      this._client = client;
    }
  }
  let Completions$2 = class Completions extends APIResource {
    create(body, options) {
      return this._client.post("/chat/completions", { body, ...options, stream: body.stream ?? false });
    }
  };
  /* @__PURE__ */ (function(Completions2) {
  })(Completions$2 || (Completions$2 = {}));
  let Chat$1 = class Chat extends APIResource {
    constructor() {
      super(...arguments);
      this.completions = new Completions$2(this._client);
    }
  };
  (function(Chat2) {
    Chat2.Completions = Completions$2;
  })(Chat$1 || (Chat$1 = {}));
  class Speech extends APIResource {
    /**
     * Generates audio from the input text.
     */
    create(body, options) {
      return this._client.post("/audio/speech", { body, ...options, __binaryResponse: true });
    }
  }
  /* @__PURE__ */ (function(Speech2) {
  })(Speech || (Speech = {}));
  class Transcriptions extends APIResource {
    create(body, options) {
      return this._client.post("/audio/transcriptions", multipartFormRequestOptions({ body, ...options }));
    }
  }
  /* @__PURE__ */ (function(Transcriptions2) {
  })(Transcriptions || (Transcriptions = {}));
  class Translations extends APIResource {
    create(body, options) {
      return this._client.post("/audio/translations", multipartFormRequestOptions({ body, ...options }));
    }
  }
  /* @__PURE__ */ (function(Translations2) {
  })(Translations || (Translations = {}));
  class Audio extends APIResource {
    constructor() {
      super(...arguments);
      this.transcriptions = new Transcriptions(this._client);
      this.translations = new Translations(this._client);
      this.speech = new Speech(this._client);
    }
  }
  (function(Audio2) {
    Audio2.Transcriptions = Transcriptions;
    Audio2.Translations = Translations;
    Audio2.Speech = Speech;
  })(Audio || (Audio = {}));
  class Batches extends APIResource {
    /**
     * Creates and executes a batch from an uploaded file of requests
     */
    create(body, options) {
      return this._client.post("/batches", { body, ...options });
    }
    /**
     * Retrieves a batch.
     */
    retrieve(batchId, options) {
      return this._client.get(`/batches/${batchId}`, options);
    }
    list(query = {}, options) {
      if (isRequestOptions(query)) {
        return this.list({}, query);
      }
      return this._client.getAPIList("/batches", BatchesPage, { query, ...options });
    }
    /**
     * Cancels an in-progress batch. The batch will be in status `cancelling` for up to
     * 10 minutes, before changing to `cancelled`, where it will have partial results
     * (if any) available in the output file.
     */
    cancel(batchId, options) {
      return this._client.post(`/batches/${batchId}/cancel`, options);
    }
  }
  class BatchesPage extends CursorPage {
  }
  (function(Batches2) {
    Batches2.BatchesPage = BatchesPage;
  })(Batches || (Batches = {}));
  class Assistants extends APIResource {
    /**
     * Create an assistant with a model and instructions.
     */
    create(body, options) {
      return this._client.post("/assistants", {
        body,
        ...options,
        headers: { "OpenAI-Beta": "assistants=v2", ...options == null ? void 0 : options.headers }
      });
    }
    /**
     * Retrieves an assistant.
     */
    retrieve(assistantId, options) {
      return this._client.get(`/assistants/${assistantId}`, {
        ...options,
        headers: { "OpenAI-Beta": "assistants=v2", ...options == null ? void 0 : options.headers }
      });
    }
    /**
     * Modifies an assistant.
     */
    update(assistantId, body, options) {
      return this._client.post(`/assistants/${assistantId}`, {
        body,
        ...options,
        headers: { "OpenAI-Beta": "assistants=v2", ...options == null ? void 0 : options.headers }
      });
    }
    list(query = {}, options) {
      if (isRequestOptions(query)) {
        return this.list({}, query);
      }
      return this._client.getAPIList("/assistants", AssistantsPage, {
        query,
        ...options,
        headers: { "OpenAI-Beta": "assistants=v2", ...options == null ? void 0 : options.headers }
      });
    }
    /**
     * Delete an assistant.
     */
    del(assistantId, options) {
      return this._client.delete(`/assistants/${assistantId}`, {
        ...options,
        headers: { "OpenAI-Beta": "assistants=v2", ...options == null ? void 0 : options.headers }
      });
    }
  }
  class AssistantsPage extends CursorPage {
  }
  (function(Assistants2) {
    Assistants2.AssistantsPage = AssistantsPage;
  })(Assistants || (Assistants = {}));
  function isRunnableFunctionWithParse(fn) {
    return typeof fn.parse === "function";
  }
  const isAssistantMessage = (message) => {
    return (message == null ? void 0 : message.role) === "assistant";
  };
  const isFunctionMessage = (message) => {
    return (message == null ? void 0 : message.role) === "function";
  };
  const isToolMessage = (message) => {
    return (message == null ? void 0 : message.role) === "tool";
  };
  var __classPrivateFieldSet$2 = globalThis && globalThis.__classPrivateFieldSet || function(receiver, state, value, kind2, f) {
    if (kind2 === "m")
      throw new TypeError("Private method is not writable");
    if (kind2 === "a" && !f)
      throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
      throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return kind2 === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
  };
  var __classPrivateFieldGet$3 = globalThis && globalThis.__classPrivateFieldGet || function(receiver, state, kind2, f) {
    if (kind2 === "a" && !f)
      throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
      throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind2 === "m" ? f : kind2 === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
  };
  var _EventStream_instances, _EventStream_connectedPromise, _EventStream_resolveConnectedPromise, _EventStream_rejectConnectedPromise, _EventStream_endPromise, _EventStream_resolveEndPromise, _EventStream_rejectEndPromise, _EventStream_listeners, _EventStream_ended, _EventStream_errored, _EventStream_aborted, _EventStream_catchingPromiseCreated, _EventStream_handleError;
  class EventStream {
    constructor() {
      _EventStream_instances.add(this);
      this.controller = new AbortController();
      _EventStream_connectedPromise.set(this, void 0);
      _EventStream_resolveConnectedPromise.set(this, () => {
      });
      _EventStream_rejectConnectedPromise.set(this, () => {
      });
      _EventStream_endPromise.set(this, void 0);
      _EventStream_resolveEndPromise.set(this, () => {
      });
      _EventStream_rejectEndPromise.set(this, () => {
      });
      _EventStream_listeners.set(this, {});
      _EventStream_ended.set(this, false);
      _EventStream_errored.set(this, false);
      _EventStream_aborted.set(this, false);
      _EventStream_catchingPromiseCreated.set(this, false);
      __classPrivateFieldSet$2(this, _EventStream_connectedPromise, new Promise((resolve, reject) => {
        __classPrivateFieldSet$2(this, _EventStream_resolveConnectedPromise, resolve, "f");
        __classPrivateFieldSet$2(this, _EventStream_rejectConnectedPromise, reject, "f");
      }), "f");
      __classPrivateFieldSet$2(this, _EventStream_endPromise, new Promise((resolve, reject) => {
        __classPrivateFieldSet$2(this, _EventStream_resolveEndPromise, resolve, "f");
        __classPrivateFieldSet$2(this, _EventStream_rejectEndPromise, reject, "f");
      }), "f");
      __classPrivateFieldGet$3(this, _EventStream_connectedPromise, "f").catch(() => {
      });
      __classPrivateFieldGet$3(this, _EventStream_endPromise, "f").catch(() => {
      });
    }
    _run(executor) {
      setTimeout(() => {
        executor().then(() => {
          this._emitFinal();
          this._emit("end");
        }, __classPrivateFieldGet$3(this, _EventStream_instances, "m", _EventStream_handleError).bind(this));
      }, 0);
    }
    _connected() {
      if (this.ended)
        return;
      __classPrivateFieldGet$3(this, _EventStream_resolveConnectedPromise, "f").call(this);
      this._emit("connect");
    }
    get ended() {
      return __classPrivateFieldGet$3(this, _EventStream_ended, "f");
    }
    get errored() {
      return __classPrivateFieldGet$3(this, _EventStream_errored, "f");
    }
    get aborted() {
      return __classPrivateFieldGet$3(this, _EventStream_aborted, "f");
    }
    abort() {
      this.controller.abort();
    }
    /**
     * Adds the listener function to the end of the listeners array for the event.
     * No checks are made to see if the listener has already been added. Multiple calls passing
     * the same combination of event and listener will result in the listener being added, and
     * called, multiple times.
     * @returns this ChatCompletionStream, so that calls can be chained
     */
    on(event, listener) {
      const listeners = __classPrivateFieldGet$3(this, _EventStream_listeners, "f")[event] || (__classPrivateFieldGet$3(this, _EventStream_listeners, "f")[event] = []);
      listeners.push({ listener });
      return this;
    }
    /**
     * Removes the specified listener from the listener array for the event.
     * off() will remove, at most, one instance of a listener from the listener array. If any single
     * listener has been added multiple times to the listener array for the specified event, then
     * off() must be called multiple times to remove each instance.
     * @returns this ChatCompletionStream, so that calls can be chained
     */
    off(event, listener) {
      const listeners = __classPrivateFieldGet$3(this, _EventStream_listeners, "f")[event];
      if (!listeners)
        return this;
      const index = listeners.findIndex((l) => l.listener === listener);
      if (index >= 0)
        listeners.splice(index, 1);
      return this;
    }
    /**
     * Adds a one-time listener function for the event. The next time the event is triggered,
     * this listener is removed and then invoked.
     * @returns this ChatCompletionStream, so that calls can be chained
     */
    once(event, listener) {
      const listeners = __classPrivateFieldGet$3(this, _EventStream_listeners, "f")[event] || (__classPrivateFieldGet$3(this, _EventStream_listeners, "f")[event] = []);
      listeners.push({ listener, once: true });
      return this;
    }
    /**
     * This is similar to `.once()`, but returns a Promise that resolves the next time
     * the event is triggered, instead of calling a listener callback.
     * @returns a Promise that resolves the next time given event is triggered,
     * or rejects if an error is emitted.  (If you request the 'error' event,
     * returns a promise that resolves with the error).
     *
     * Example:
     *
     *   const message = await stream.emitted('message') // rejects if the stream errors
     */
    emitted(event) {
      return new Promise((resolve, reject) => {
        __classPrivateFieldSet$2(this, _EventStream_catchingPromiseCreated, true, "f");
        if (event !== "error")
          this.once("error", reject);
        this.once(event, resolve);
      });
    }
    async done() {
      __classPrivateFieldSet$2(this, _EventStream_catchingPromiseCreated, true, "f");
      await __classPrivateFieldGet$3(this, _EventStream_endPromise, "f");
    }
    _emit(event, ...args) {
      if (__classPrivateFieldGet$3(this, _EventStream_ended, "f")) {
        return;
      }
      if (event === "end") {
        __classPrivateFieldSet$2(this, _EventStream_ended, true, "f");
        __classPrivateFieldGet$3(this, _EventStream_resolveEndPromise, "f").call(this);
      }
      const listeners = __classPrivateFieldGet$3(this, _EventStream_listeners, "f")[event];
      if (listeners) {
        __classPrivateFieldGet$3(this, _EventStream_listeners, "f")[event] = listeners.filter((l) => !l.once);
        listeners.forEach(({ listener }) => listener(...args));
      }
      if (event === "abort") {
        const error = args[0];
        if (!__classPrivateFieldGet$3(this, _EventStream_catchingPromiseCreated, "f") && !(listeners == null ? void 0 : listeners.length)) {
          Promise.reject(error);
        }
        __classPrivateFieldGet$3(this, _EventStream_rejectConnectedPromise, "f").call(this, error);
        __classPrivateFieldGet$3(this, _EventStream_rejectEndPromise, "f").call(this, error);
        this._emit("end");
        return;
      }
      if (event === "error") {
        const error = args[0];
        if (!__classPrivateFieldGet$3(this, _EventStream_catchingPromiseCreated, "f") && !(listeners == null ? void 0 : listeners.length)) {
          Promise.reject(error);
        }
        __classPrivateFieldGet$3(this, _EventStream_rejectConnectedPromise, "f").call(this, error);
        __classPrivateFieldGet$3(this, _EventStream_rejectEndPromise, "f").call(this, error);
        this._emit("end");
      }
    }
    _emitFinal() {
    }
  }
  _EventStream_connectedPromise = /* @__PURE__ */ new WeakMap(), _EventStream_resolveConnectedPromise = /* @__PURE__ */ new WeakMap(), _EventStream_rejectConnectedPromise = /* @__PURE__ */ new WeakMap(), _EventStream_endPromise = /* @__PURE__ */ new WeakMap(), _EventStream_resolveEndPromise = /* @__PURE__ */ new WeakMap(), _EventStream_rejectEndPromise = /* @__PURE__ */ new WeakMap(), _EventStream_listeners = /* @__PURE__ */ new WeakMap(), _EventStream_ended = /* @__PURE__ */ new WeakMap(), _EventStream_errored = /* @__PURE__ */ new WeakMap(), _EventStream_aborted = /* @__PURE__ */ new WeakMap(), _EventStream_catchingPromiseCreated = /* @__PURE__ */ new WeakMap(), _EventStream_instances = /* @__PURE__ */ new WeakSet(), _EventStream_handleError = function _EventStream_handleError2(error) {
    __classPrivateFieldSet$2(this, _EventStream_errored, true, "f");
    if (error instanceof Error && error.name === "AbortError") {
      error = new APIUserAbortError();
    }
    if (error instanceof APIUserAbortError) {
      __classPrivateFieldSet$2(this, _EventStream_aborted, true, "f");
      return this._emit("abort", error);
    }
    if (error instanceof OpenAIError) {
      return this._emit("error", error);
    }
    if (error instanceof Error) {
      const openAIError = new OpenAIError(error.message);
      openAIError.cause = error;
      return this._emit("error", openAIError);
    }
    return this._emit("error", new OpenAIError(String(error)));
  };
  function isAutoParsableResponseFormat(response_format) {
    return (response_format == null ? void 0 : response_format["$brand"]) === "auto-parseable-response-format";
  }
  function isAutoParsableTool(tool) {
    return (tool == null ? void 0 : tool["$brand"]) === "auto-parseable-tool";
  }
  function maybeParseChatCompletion(completion, params) {
    if (!params || !hasAutoParseableInput(params)) {
      return {
        ...completion,
        choices: completion.choices.map((choice) => ({
          ...choice,
          message: { ...choice.message, parsed: null, tool_calls: choice.message.tool_calls ?? [] }
        }))
      };
    }
    return parseChatCompletion(completion, params);
  }
  function parseChatCompletion(completion, params) {
    const choices = completion.choices.map((choice) => {
      var _a2;
      if (choice.finish_reason === "length") {
        throw new LengthFinishReasonError();
      }
      if (choice.finish_reason === "content_filter") {
        throw new ContentFilterFinishReasonError();
      }
      return {
        ...choice,
        message: {
          ...choice.message,
          tool_calls: ((_a2 = choice.message.tool_calls) == null ? void 0 : _a2.map((toolCall) => parseToolCall(params, toolCall))) ?? [],
          parsed: choice.message.content && !choice.message.refusal ? parseResponseFormat(params, choice.message.content) : null
        }
      };
    });
    return { ...completion, choices };
  }
  function parseResponseFormat(params, content) {
    var _a2, _b;
    if (((_a2 = params.response_format) == null ? void 0 : _a2.type) !== "json_schema") {
      return null;
    }
    if (((_b = params.response_format) == null ? void 0 : _b.type) === "json_schema") {
      if ("$parseRaw" in params.response_format) {
        const response_format = params.response_format;
        return response_format.$parseRaw(content);
      }
      return JSON.parse(content);
    }
    return null;
  }
  function parseToolCall(params, toolCall) {
    var _a2;
    const inputTool = (_a2 = params.tools) == null ? void 0 : _a2.find((inputTool2) => {
      var _a3;
      return ((_a3 = inputTool2.function) == null ? void 0 : _a3.name) === toolCall.function.name;
    });
    return {
      ...toolCall,
      function: {
        ...toolCall.function,
        parsed_arguments: isAutoParsableTool(inputTool) ? inputTool.$parseRaw(toolCall.function.arguments) : (inputTool == null ? void 0 : inputTool.function.strict) ? JSON.parse(toolCall.function.arguments) : null
      }
    };
  }
  function shouldParseToolCall(params, toolCall) {
    var _a2;
    if (!params) {
      return false;
    }
    const inputTool = (_a2 = params.tools) == null ? void 0 : _a2.find((inputTool2) => {
      var _a3;
      return ((_a3 = inputTool2.function) == null ? void 0 : _a3.name) === toolCall.function.name;
    });
    return isAutoParsableTool(inputTool) || (inputTool == null ? void 0 : inputTool.function.strict) || false;
  }
  function hasAutoParseableInput(params) {
    var _a2;
    if (isAutoParsableResponseFormat(params.response_format)) {
      return true;
    }
    return ((_a2 = params.tools) == null ? void 0 : _a2.some((t) => isAutoParsableTool(t) || t.type === "function" && t.function.strict === true)) ?? false;
  }
  function validateInputTools(tools) {
    for (const tool of tools ?? []) {
      if (tool.type !== "function") {
        throw new OpenAIError(`Currently only \`function\` tool types support auto-parsing; Received \`${tool.type}\``);
      }
      if (tool.function.strict !== true) {
        throw new OpenAIError(`The \`${tool.function.name}\` tool is not marked with \`strict: true\`. Only strict function tools can be auto-parsed`);
      }
    }
  }
  var __classPrivateFieldGet$2 = globalThis && globalThis.__classPrivateFieldGet || function(receiver, state, kind2, f) {
    if (kind2 === "a" && !f)
      throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
      throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind2 === "m" ? f : kind2 === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
  };
  var _AbstractChatCompletionRunner_instances, _AbstractChatCompletionRunner_getFinalContent, _AbstractChatCompletionRunner_getFinalMessage, _AbstractChatCompletionRunner_getFinalFunctionCall, _AbstractChatCompletionRunner_getFinalFunctionCallResult, _AbstractChatCompletionRunner_calculateTotalUsage, _AbstractChatCompletionRunner_validateParams, _AbstractChatCompletionRunner_stringifyFunctionCallResult;
  const DEFAULT_MAX_CHAT_COMPLETIONS = 10;
  class AbstractChatCompletionRunner extends EventStream {
    constructor() {
      super(...arguments);
      _AbstractChatCompletionRunner_instances.add(this);
      this._chatCompletions = [];
      this.messages = [];
    }
    _addChatCompletion(chatCompletion) {
      var _a2;
      this._chatCompletions.push(chatCompletion);
      this._emit("chatCompletion", chatCompletion);
      const message = (_a2 = chatCompletion.choices[0]) == null ? void 0 : _a2.message;
      if (message)
        this._addMessage(message);
      return chatCompletion;
    }
    _addMessage(message, emit = true) {
      if (!("content" in message))
        message.content = null;
      this.messages.push(message);
      if (emit) {
        this._emit("message", message);
        if ((isFunctionMessage(message) || isToolMessage(message)) && message.content) {
          this._emit("functionCallResult", message.content);
        } else if (isAssistantMessage(message) && message.function_call) {
          this._emit("functionCall", message.function_call);
        } else if (isAssistantMessage(message) && message.tool_calls) {
          for (const tool_call of message.tool_calls) {
            if (tool_call.type === "function") {
              this._emit("functionCall", tool_call.function);
            }
          }
        }
      }
    }
    /**
     * @returns a promise that resolves with the final ChatCompletion, or rejects
     * if an error occurred or the stream ended prematurely without producing a ChatCompletion.
     */
    async finalChatCompletion() {
      await this.done();
      const completion = this._chatCompletions[this._chatCompletions.length - 1];
      if (!completion)
        throw new OpenAIError("stream ended without producing a ChatCompletion");
      return completion;
    }
    /**
     * @returns a promise that resolves with the content of the final ChatCompletionMessage, or rejects
     * if an error occurred or the stream ended prematurely without producing a ChatCompletionMessage.
     */
    async finalContent() {
      await this.done();
      return __classPrivateFieldGet$2(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalContent).call(this);
    }
    /**
     * @returns a promise that resolves with the the final assistant ChatCompletionMessage response,
     * or rejects if an error occurred or the stream ended prematurely without producing a ChatCompletionMessage.
     */
    async finalMessage() {
      await this.done();
      return __classPrivateFieldGet$2(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalMessage).call(this);
    }
    /**
     * @returns a promise that resolves with the content of the final FunctionCall, or rejects
     * if an error occurred or the stream ended prematurely without producing a ChatCompletionMessage.
     */
    async finalFunctionCall() {
      await this.done();
      return __classPrivateFieldGet$2(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalFunctionCall).call(this);
    }
    async finalFunctionCallResult() {
      await this.done();
      return __classPrivateFieldGet$2(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalFunctionCallResult).call(this);
    }
    async totalUsage() {
      await this.done();
      return __classPrivateFieldGet$2(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_calculateTotalUsage).call(this);
    }
    allChatCompletions() {
      return [...this._chatCompletions];
    }
    _emitFinal() {
      const completion = this._chatCompletions[this._chatCompletions.length - 1];
      if (completion)
        this._emit("finalChatCompletion", completion);
      const finalMessage = __classPrivateFieldGet$2(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalMessage).call(this);
      if (finalMessage)
        this._emit("finalMessage", finalMessage);
      const finalContent = __classPrivateFieldGet$2(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalContent).call(this);
      if (finalContent)
        this._emit("finalContent", finalContent);
      const finalFunctionCall = __classPrivateFieldGet$2(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalFunctionCall).call(this);
      if (finalFunctionCall)
        this._emit("finalFunctionCall", finalFunctionCall);
      const finalFunctionCallResult = __classPrivateFieldGet$2(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalFunctionCallResult).call(this);
      if (finalFunctionCallResult != null)
        this._emit("finalFunctionCallResult", finalFunctionCallResult);
      if (this._chatCompletions.some((c) => c.usage)) {
        this._emit("totalUsage", __classPrivateFieldGet$2(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_calculateTotalUsage).call(this));
      }
    }
    async _createChatCompletion(client, params, options) {
      const signal = options == null ? void 0 : options.signal;
      if (signal) {
        if (signal.aborted)
          this.controller.abort();
        signal.addEventListener("abort", () => this.controller.abort());
      }
      __classPrivateFieldGet$2(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_validateParams).call(this, params);
      const chatCompletion = await client.chat.completions.create({ ...params, stream: false }, { ...options, signal: this.controller.signal });
      this._connected();
      return this._addChatCompletion(parseChatCompletion(chatCompletion, params));
    }
    async _runChatCompletion(client, params, options) {
      for (const message of params.messages) {
        this._addMessage(message, false);
      }
      return await this._createChatCompletion(client, params, options);
    }
    async _runFunctions(client, params, options) {
      var _a2;
      const role = "function";
      const { function_call = "auto", stream, ...restParams } = params;
      const singleFunctionToCall = typeof function_call !== "string" && (function_call == null ? void 0 : function_call.name);
      const { maxChatCompletions = DEFAULT_MAX_CHAT_COMPLETIONS } = options || {};
      const functionsByName = {};
      for (const f of params.functions) {
        functionsByName[f.name || f.function.name] = f;
      }
      const functions = params.functions.map((f) => ({
        name: f.name || f.function.name,
        parameters: f.parameters,
        description: f.description
      }));
      for (const message of params.messages) {
        this._addMessage(message, false);
      }
      for (let i = 0; i < maxChatCompletions; ++i) {
        const chatCompletion = await this._createChatCompletion(client, {
          ...restParams,
          function_call,
          functions,
          messages: [...this.messages]
        }, options);
        const message = (_a2 = chatCompletion.choices[0]) == null ? void 0 : _a2.message;
        if (!message) {
          throw new OpenAIError(`missing message in ChatCompletion response`);
        }
        if (!message.function_call)
          return;
        const { name, arguments: args } = message.function_call;
        const fn = functionsByName[name];
        if (!fn) {
          const content2 = `Invalid function_call: ${JSON.stringify(name)}. Available options are: ${functions.map((f) => JSON.stringify(f.name)).join(", ")}. Please try again`;
          this._addMessage({ role, name, content: content2 });
          continue;
        } else if (singleFunctionToCall && singleFunctionToCall !== name) {
          const content2 = `Invalid function_call: ${JSON.stringify(name)}. ${JSON.stringify(singleFunctionToCall)} requested. Please try again`;
          this._addMessage({ role, name, content: content2 });
          continue;
        }
        let parsed;
        try {
          parsed = isRunnableFunctionWithParse(fn) ? await fn.parse(args) : args;
        } catch (error) {
          this._addMessage({
            role,
            name,
            content: error instanceof Error ? error.message : String(error)
          });
          continue;
        }
        const rawContent = await fn.function(parsed, this);
        const content = __classPrivateFieldGet$2(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_stringifyFunctionCallResult).call(this, rawContent);
        this._addMessage({ role, name, content });
        if (singleFunctionToCall)
          return;
      }
    }
    async _runTools(client, params, options) {
      var _a2, _b, _c;
      const role = "tool";
      const { tool_choice = "auto", stream, ...restParams } = params;
      const singleFunctionToCall = typeof tool_choice !== "string" && ((_a2 = tool_choice == null ? void 0 : tool_choice.function) == null ? void 0 : _a2.name);
      const { maxChatCompletions = DEFAULT_MAX_CHAT_COMPLETIONS } = options || {};
      const inputTools = params.tools.map((tool) => {
        if (isAutoParsableTool(tool)) {
          if (!tool.$callback) {
            throw new OpenAIError("Tool given to `.runTools()` that does not have an associated function");
          }
          return {
            type: "function",
            function: {
              function: tool.$callback,
              name: tool.function.name,
              description: tool.function.description || "",
              parameters: tool.function.parameters,
              parse: tool.$parseRaw,
              strict: true
            }
          };
        }
        return tool;
      });
      const functionsByName = {};
      for (const f of inputTools) {
        if (f.type === "function") {
          functionsByName[f.function.name || f.function.function.name] = f.function;
        }
      }
      const tools = "tools" in params ? inputTools.map((t) => t.type === "function" ? {
        type: "function",
        function: {
          name: t.function.name || t.function.function.name,
          parameters: t.function.parameters,
          description: t.function.description,
          strict: t.function.strict
        }
      } : t) : void 0;
      for (const message of params.messages) {
        this._addMessage(message, false);
      }
      for (let i = 0; i < maxChatCompletions; ++i) {
        const chatCompletion = await this._createChatCompletion(client, {
          ...restParams,
          tool_choice,
          tools,
          messages: [...this.messages]
        }, options);
        const message = (_b = chatCompletion.choices[0]) == null ? void 0 : _b.message;
        if (!message) {
          throw new OpenAIError(`missing message in ChatCompletion response`);
        }
        if (!((_c = message.tool_calls) == null ? void 0 : _c.length)) {
          return;
        }
        for (const tool_call of message.tool_calls) {
          if (tool_call.type !== "function")
            continue;
          const tool_call_id = tool_call.id;
          const { name, arguments: args } = tool_call.function;
          const fn = functionsByName[name];
          if (!fn) {
            const content2 = `Invalid tool_call: ${JSON.stringify(name)}. Available options are: ${Object.keys(functionsByName).map((name2) => JSON.stringify(name2)).join(", ")}. Please try again`;
            this._addMessage({ role, tool_call_id, content: content2 });
            continue;
          } else if (singleFunctionToCall && singleFunctionToCall !== name) {
            const content2 = `Invalid tool_call: ${JSON.stringify(name)}. ${JSON.stringify(singleFunctionToCall)} requested. Please try again`;
            this._addMessage({ role, tool_call_id, content: content2 });
            continue;
          }
          let parsed;
          try {
            parsed = isRunnableFunctionWithParse(fn) ? await fn.parse(args) : args;
          } catch (error) {
            const content2 = error instanceof Error ? error.message : String(error);
            this._addMessage({ role, tool_call_id, content: content2 });
            continue;
          }
          const rawContent = await fn.function(parsed, this);
          const content = __classPrivateFieldGet$2(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_stringifyFunctionCallResult).call(this, rawContent);
          this._addMessage({ role, tool_call_id, content });
          if (singleFunctionToCall) {
            return;
          }
        }
      }
      return;
    }
  }
  _AbstractChatCompletionRunner_instances = /* @__PURE__ */ new WeakSet(), _AbstractChatCompletionRunner_getFinalContent = function _AbstractChatCompletionRunner_getFinalContent2() {
    return __classPrivateFieldGet$2(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalMessage).call(this).content ?? null;
  }, _AbstractChatCompletionRunner_getFinalMessage = function _AbstractChatCompletionRunner_getFinalMessage2() {
    let i = this.messages.length;
    while (i-- > 0) {
      const message = this.messages[i];
      if (isAssistantMessage(message)) {
        const { function_call, ...rest } = message;
        const ret = {
          ...rest,
          content: message.content ?? null,
          refusal: message.refusal ?? null
        };
        if (function_call) {
          ret.function_call = function_call;
        }
        return ret;
      }
    }
    throw new OpenAIError("stream ended without producing a ChatCompletionMessage with role=assistant");
  }, _AbstractChatCompletionRunner_getFinalFunctionCall = function _AbstractChatCompletionRunner_getFinalFunctionCall2() {
    var _a2, _b;
    for (let i = this.messages.length - 1; i >= 0; i--) {
      const message = this.messages[i];
      if (isAssistantMessage(message) && (message == null ? void 0 : message.function_call)) {
        return message.function_call;
      }
      if (isAssistantMessage(message) && ((_a2 = message == null ? void 0 : message.tool_calls) == null ? void 0 : _a2.length)) {
        return (_b = message.tool_calls.at(-1)) == null ? void 0 : _b.function;
      }
    }
    return;
  }, _AbstractChatCompletionRunner_getFinalFunctionCallResult = function _AbstractChatCompletionRunner_getFinalFunctionCallResult2() {
    for (let i = this.messages.length - 1; i >= 0; i--) {
      const message = this.messages[i];
      if (isFunctionMessage(message) && message.content != null) {
        return message.content;
      }
      if (isToolMessage(message) && message.content != null && typeof message.content === "string" && this.messages.some((x) => {
        var _a2;
        return x.role === "assistant" && ((_a2 = x.tool_calls) == null ? void 0 : _a2.some((y) => y.type === "function" && y.id === message.tool_call_id));
      })) {
        return message.content;
      }
    }
    return;
  }, _AbstractChatCompletionRunner_calculateTotalUsage = function _AbstractChatCompletionRunner_calculateTotalUsage2() {
    const total = {
      completion_tokens: 0,
      prompt_tokens: 0,
      total_tokens: 0
    };
    for (const { usage } of this._chatCompletions) {
      if (usage) {
        total.completion_tokens += usage.completion_tokens;
        total.prompt_tokens += usage.prompt_tokens;
        total.total_tokens += usage.total_tokens;
      }
    }
    return total;
  }, _AbstractChatCompletionRunner_validateParams = function _AbstractChatCompletionRunner_validateParams2(params) {
    if (params.n != null && params.n > 1) {
      throw new OpenAIError("ChatCompletion convenience helpers only support n=1 at this time. To use n>1, please use chat.completions.create() directly.");
    }
  }, _AbstractChatCompletionRunner_stringifyFunctionCallResult = function _AbstractChatCompletionRunner_stringifyFunctionCallResult2(rawContent) {
    return typeof rawContent === "string" ? rawContent : rawContent === void 0 ? "undefined" : JSON.stringify(rawContent);
  };
  class ChatCompletionRunner extends AbstractChatCompletionRunner {
    /** @deprecated - please use `runTools` instead. */
    static runFunctions(client, params, options) {
      const runner = new ChatCompletionRunner();
      const opts = {
        ...options,
        headers: { ...options == null ? void 0 : options.headers, "X-Stainless-Helper-Method": "runFunctions" }
      };
      runner._run(() => runner._runFunctions(client, params, opts));
      return runner;
    }
    static runTools(client, params, options) {
      const runner = new ChatCompletionRunner();
      const opts = {
        ...options,
        headers: { ...options == null ? void 0 : options.headers, "X-Stainless-Helper-Method": "runTools" }
      };
      runner._run(() => runner._runTools(client, params, opts));
      return runner;
    }
    _addMessage(message, emit = true) {
      super._addMessage(message, emit);
      if (isAssistantMessage(message) && message.content) {
        this._emit("content", message.content);
      }
    }
  }
  const STR = 1;
  const NUM = 2;
  const ARR = 4;
  const OBJ = 8;
  const NULL = 16;
  const BOOL = 32;
  const NAN = 64;
  const INFINITY = 128;
  const MINUS_INFINITY = 256;
  const INF = INFINITY | MINUS_INFINITY;
  const SPECIAL = NULL | BOOL | INF | NAN;
  const ATOM = STR | NUM | SPECIAL;
  const COLLECTION = ARR | OBJ;
  const ALL = ATOM | COLLECTION;
  const Allow = {
    STR,
    NUM,
    ARR,
    OBJ,
    NULL,
    BOOL,
    NAN,
    INFINITY,
    MINUS_INFINITY,
    INF,
    SPECIAL,
    ATOM,
    COLLECTION,
    ALL
  };
  class PartialJSON extends Error {
  }
  class MalformedJSON extends Error {
  }
  function parseJSON(jsonString, allowPartial = Allow.ALL) {
    if (typeof jsonString !== "string") {
      throw new TypeError(`expecting str, got ${typeof jsonString}`);
    }
    if (!jsonString.trim()) {
      throw new Error(`${jsonString} is empty`);
    }
    return _parseJSON(jsonString.trim(), allowPartial);
  }
  const _parseJSON = (jsonString, allow) => {
    const length = jsonString.length;
    let index = 0;
    const markPartialJSON = (msg) => {
      throw new PartialJSON(`${msg} at position ${index}`);
    };
    const throwMalformedError = (msg) => {
      throw new MalformedJSON(`${msg} at position ${index}`);
    };
    const parseAny = () => {
      skipBlank();
      if (index >= length)
        markPartialJSON("Unexpected end of input");
      if (jsonString[index] === '"')
        return parseStr();
      if (jsonString[index] === "{")
        return parseObj();
      if (jsonString[index] === "[")
        return parseArr();
      if (jsonString.substring(index, index + 4) === "null" || Allow.NULL & allow && length - index < 4 && "null".startsWith(jsonString.substring(index))) {
        index += 4;
        return null;
      }
      if (jsonString.substring(index, index + 4) === "true" || Allow.BOOL & allow && length - index < 4 && "true".startsWith(jsonString.substring(index))) {
        index += 4;
        return true;
      }
      if (jsonString.substring(index, index + 5) === "false" || Allow.BOOL & allow && length - index < 5 && "false".startsWith(jsonString.substring(index))) {
        index += 5;
        return false;
      }
      if (jsonString.substring(index, index + 8) === "Infinity" || Allow.INFINITY & allow && length - index < 8 && "Infinity".startsWith(jsonString.substring(index))) {
        index += 8;
        return Infinity;
      }
      if (jsonString.substring(index, index + 9) === "-Infinity" || Allow.MINUS_INFINITY & allow && 1 < length - index && length - index < 9 && "-Infinity".startsWith(jsonString.substring(index))) {
        index += 9;
        return -Infinity;
      }
      if (jsonString.substring(index, index + 3) === "NaN" || Allow.NAN & allow && length - index < 3 && "NaN".startsWith(jsonString.substring(index))) {
        index += 3;
        return NaN;
      }
      return parseNum();
    };
    const parseStr = () => {
      const start = index;
      let escape2 = false;
      index++;
      while (index < length && (jsonString[index] !== '"' || escape2 && jsonString[index - 1] === "\\")) {
        escape2 = jsonString[index] === "\\" ? !escape2 : false;
        index++;
      }
      if (jsonString.charAt(index) == '"') {
        try {
          return JSON.parse(jsonString.substring(start, ++index - Number(escape2)));
        } catch (e) {
          throwMalformedError(String(e));
        }
      } else if (Allow.STR & allow) {
        try {
          return JSON.parse(jsonString.substring(start, index - Number(escape2)) + '"');
        } catch (e) {
          return JSON.parse(jsonString.substring(start, jsonString.lastIndexOf("\\")) + '"');
        }
      }
      markPartialJSON("Unterminated string literal");
    };
    const parseObj = () => {
      index++;
      skipBlank();
      const obj = {};
      try {
        while (jsonString[index] !== "}") {
          skipBlank();
          if (index >= length && Allow.OBJ & allow)
            return obj;
          const key = parseStr();
          skipBlank();
          index++;
          try {
            const value = parseAny();
            Object.defineProperty(obj, key, { value, writable: true, enumerable: true, configurable: true });
          } catch (e) {
            if (Allow.OBJ & allow)
              return obj;
            else
              throw e;
          }
          skipBlank();
          if (jsonString[index] === ",")
            index++;
        }
      } catch (e) {
        if (Allow.OBJ & allow)
          return obj;
        else
          markPartialJSON("Expected '}' at end of object");
      }
      index++;
      return obj;
    };
    const parseArr = () => {
      index++;
      const arr = [];
      try {
        while (jsonString[index] !== "]") {
          arr.push(parseAny());
          skipBlank();
          if (jsonString[index] === ",") {
            index++;
          }
        }
      } catch (e) {
        if (Allow.ARR & allow) {
          return arr;
        }
        markPartialJSON("Expected ']' at end of array");
      }
      index++;
      return arr;
    };
    const parseNum = () => {
      if (index === 0) {
        if (jsonString === "-" && Allow.NUM & allow)
          markPartialJSON("Not sure what '-' is");
        try {
          return JSON.parse(jsonString);
        } catch (e) {
          if (Allow.NUM & allow) {
            try {
              if ("." === jsonString[jsonString.length - 1])
                return JSON.parse(jsonString.substring(0, jsonString.lastIndexOf(".")));
              return JSON.parse(jsonString.substring(0, jsonString.lastIndexOf("e")));
            } catch (e2) {
            }
          }
          throwMalformedError(String(e));
        }
      }
      const start = index;
      if (jsonString[index] === "-")
        index++;
      while (jsonString[index] && !",]}".includes(jsonString[index]))
        index++;
      if (index == length && !(Allow.NUM & allow))
        markPartialJSON("Unterminated number literal");
      try {
        return JSON.parse(jsonString.substring(start, index));
      } catch (e) {
        if (jsonString.substring(start, index) === "-" && Allow.NUM & allow)
          markPartialJSON("Not sure what '-' is");
        try {
          return JSON.parse(jsonString.substring(start, jsonString.lastIndexOf("e")));
        } catch (e2) {
          throwMalformedError(String(e2));
        }
      }
    };
    const skipBlank = () => {
      while (index < length && " \n\r	".includes(jsonString[index])) {
        index++;
      }
    };
    return parseAny();
  };
  const partialParse = (input) => parseJSON(input, Allow.ALL ^ Allow.NUM);
  var __classPrivateFieldSet$1 = globalThis && globalThis.__classPrivateFieldSet || function(receiver, state, value, kind2, f) {
    if (kind2 === "m")
      throw new TypeError("Private method is not writable");
    if (kind2 === "a" && !f)
      throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
      throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return kind2 === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
  };
  var __classPrivateFieldGet$1 = globalThis && globalThis.__classPrivateFieldGet || function(receiver, state, kind2, f) {
    if (kind2 === "a" && !f)
      throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
      throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind2 === "m" ? f : kind2 === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
  };
  var _ChatCompletionStream_instances, _ChatCompletionStream_params, _ChatCompletionStream_choiceEventStates, _ChatCompletionStream_currentChatCompletionSnapshot, _ChatCompletionStream_beginRequest, _ChatCompletionStream_getChoiceEventState, _ChatCompletionStream_addChunk, _ChatCompletionStream_emitToolCallDoneEvent, _ChatCompletionStream_emitContentDoneEvents, _ChatCompletionStream_endRequest, _ChatCompletionStream_getAutoParseableResponseFormat, _ChatCompletionStream_accumulateChatCompletion;
  class ChatCompletionStream extends AbstractChatCompletionRunner {
    constructor(params) {
      super();
      _ChatCompletionStream_instances.add(this);
      _ChatCompletionStream_params.set(this, void 0);
      _ChatCompletionStream_choiceEventStates.set(this, void 0);
      _ChatCompletionStream_currentChatCompletionSnapshot.set(this, void 0);
      __classPrivateFieldSet$1(this, _ChatCompletionStream_params, params, "f");
      __classPrivateFieldSet$1(this, _ChatCompletionStream_choiceEventStates, [], "f");
    }
    get currentChatCompletionSnapshot() {
      return __classPrivateFieldGet$1(this, _ChatCompletionStream_currentChatCompletionSnapshot, "f");
    }
    /**
     * Intended for use on the frontend, consuming a stream produced with
     * `.toReadableStream()` on the backend.
     *
     * Note that messages sent to the model do not appear in `.on('message')`
     * in this context.
     */
    static fromReadableStream(stream) {
      const runner = new ChatCompletionStream(null);
      runner._run(() => runner._fromReadableStream(stream));
      return runner;
    }
    static createChatCompletion(client, params, options) {
      const runner = new ChatCompletionStream(params);
      runner._run(() => runner._runChatCompletion(client, { ...params, stream: true }, { ...options, headers: { ...options == null ? void 0 : options.headers, "X-Stainless-Helper-Method": "stream" } }));
      return runner;
    }
    async _createChatCompletion(client, params, options) {
      var _a2;
      super._createChatCompletion;
      const signal = options == null ? void 0 : options.signal;
      if (signal) {
        if (signal.aborted)
          this.controller.abort();
        signal.addEventListener("abort", () => this.controller.abort());
      }
      __classPrivateFieldGet$1(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_beginRequest).call(this);
      const stream = await client.chat.completions.create({ ...params, stream: true }, { ...options, signal: this.controller.signal });
      this._connected();
      for await (const chunk of stream) {
        __classPrivateFieldGet$1(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_addChunk).call(this, chunk);
      }
      if ((_a2 = stream.controller.signal) == null ? void 0 : _a2.aborted) {
        throw new APIUserAbortError();
      }
      return this._addChatCompletion(__classPrivateFieldGet$1(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_endRequest).call(this));
    }
    async _fromReadableStream(readableStream, options) {
      var _a2;
      const signal = options == null ? void 0 : options.signal;
      if (signal) {
        if (signal.aborted)
          this.controller.abort();
        signal.addEventListener("abort", () => this.controller.abort());
      }
      __classPrivateFieldGet$1(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_beginRequest).call(this);
      this._connected();
      const stream = Stream.fromReadableStream(readableStream, this.controller);
      let chatId;
      for await (const chunk of stream) {
        if (chatId && chatId !== chunk.id) {
          this._addChatCompletion(__classPrivateFieldGet$1(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_endRequest).call(this));
        }
        __classPrivateFieldGet$1(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_addChunk).call(this, chunk);
        chatId = chunk.id;
      }
      if ((_a2 = stream.controller.signal) == null ? void 0 : _a2.aborted) {
        throw new APIUserAbortError();
      }
      return this._addChatCompletion(__classPrivateFieldGet$1(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_endRequest).call(this));
    }
    [(_ChatCompletionStream_params = /* @__PURE__ */ new WeakMap(), _ChatCompletionStream_choiceEventStates = /* @__PURE__ */ new WeakMap(), _ChatCompletionStream_currentChatCompletionSnapshot = /* @__PURE__ */ new WeakMap(), _ChatCompletionStream_instances = /* @__PURE__ */ new WeakSet(), _ChatCompletionStream_beginRequest = function _ChatCompletionStream_beginRequest2() {
      if (this.ended)
        return;
      __classPrivateFieldSet$1(this, _ChatCompletionStream_currentChatCompletionSnapshot, void 0, "f");
    }, _ChatCompletionStream_getChoiceEventState = function _ChatCompletionStream_getChoiceEventState2(choice) {
      let state = __classPrivateFieldGet$1(this, _ChatCompletionStream_choiceEventStates, "f")[choice.index];
      if (state) {
        return state;
      }
      state = {
        content_done: false,
        refusal_done: false,
        logprobs_content_done: false,
        logprobs_refusal_done: false,
        done_tool_calls: /* @__PURE__ */ new Set(),
        current_tool_call_index: null
      };
      __classPrivateFieldGet$1(this, _ChatCompletionStream_choiceEventStates, "f")[choice.index] = state;
      return state;
    }, _ChatCompletionStream_addChunk = function _ChatCompletionStream_addChunk2(chunk) {
      var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o;
      if (this.ended)
        return;
      const completion = __classPrivateFieldGet$1(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_accumulateChatCompletion).call(this, chunk);
      this._emit("chunk", chunk, completion);
      for (const choice of chunk.choices) {
        const choiceSnapshot = completion.choices[choice.index];
        if (choice.delta.content != null && ((_a2 = choiceSnapshot.message) == null ? void 0 : _a2.role) === "assistant" && ((_b = choiceSnapshot.message) == null ? void 0 : _b.content)) {
          this._emit("content", choice.delta.content, choiceSnapshot.message.content);
          this._emit("content.delta", {
            delta: choice.delta.content,
            snapshot: choiceSnapshot.message.content,
            parsed: choiceSnapshot.message.parsed
          });
        }
        if (choice.delta.refusal != null && ((_c = choiceSnapshot.message) == null ? void 0 : _c.role) === "assistant" && ((_d = choiceSnapshot.message) == null ? void 0 : _d.refusal)) {
          this._emit("refusal.delta", {
            delta: choice.delta.refusal,
            snapshot: choiceSnapshot.message.refusal
          });
        }
        if (((_e = choice.logprobs) == null ? void 0 : _e.content) != null && ((_f = choiceSnapshot.message) == null ? void 0 : _f.role) === "assistant") {
          this._emit("logprobs.content.delta", {
            content: (_g = choice.logprobs) == null ? void 0 : _g.content,
            snapshot: ((_h = choiceSnapshot.logprobs) == null ? void 0 : _h.content) ?? []
          });
        }
        if (((_i = choice.logprobs) == null ? void 0 : _i.refusal) != null && ((_j = choiceSnapshot.message) == null ? void 0 : _j.role) === "assistant") {
          this._emit("logprobs.refusal.delta", {
            refusal: (_k = choice.logprobs) == null ? void 0 : _k.refusal,
            snapshot: ((_l = choiceSnapshot.logprobs) == null ? void 0 : _l.refusal) ?? []
          });
        }
        const state = __classPrivateFieldGet$1(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_getChoiceEventState).call(this, choiceSnapshot);
        if (choiceSnapshot.finish_reason) {
          __classPrivateFieldGet$1(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_emitContentDoneEvents).call(this, choiceSnapshot);
          if (state.current_tool_call_index != null) {
            __classPrivateFieldGet$1(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_emitToolCallDoneEvent).call(this, choiceSnapshot, state.current_tool_call_index);
          }
        }
        for (const toolCall of choice.delta.tool_calls ?? []) {
          if (state.current_tool_call_index !== toolCall.index) {
            __classPrivateFieldGet$1(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_emitContentDoneEvents).call(this, choiceSnapshot);
            if (state.current_tool_call_index != null) {
              __classPrivateFieldGet$1(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_emitToolCallDoneEvent).call(this, choiceSnapshot, state.current_tool_call_index);
            }
          }
          state.current_tool_call_index = toolCall.index;
        }
        for (const toolCallDelta of choice.delta.tool_calls ?? []) {
          const toolCallSnapshot = (_m = choiceSnapshot.message.tool_calls) == null ? void 0 : _m[toolCallDelta.index];
          if (!(toolCallSnapshot == null ? void 0 : toolCallSnapshot.type)) {
            continue;
          }
          if ((toolCallSnapshot == null ? void 0 : toolCallSnapshot.type) === "function") {
            this._emit("tool_calls.function.arguments.delta", {
              name: (_n = toolCallSnapshot.function) == null ? void 0 : _n.name,
              index: toolCallDelta.index,
              arguments: toolCallSnapshot.function.arguments,
              parsed_arguments: toolCallSnapshot.function.parsed_arguments,
              arguments_delta: ((_o = toolCallDelta.function) == null ? void 0 : _o.arguments) ?? ""
            });
          } else {
            assertNever(toolCallSnapshot == null ? void 0 : toolCallSnapshot.type);
          }
        }
      }
    }, _ChatCompletionStream_emitToolCallDoneEvent = function _ChatCompletionStream_emitToolCallDoneEvent2(choiceSnapshot, toolCallIndex) {
      var _a2, _b, _c;
      const state = __classPrivateFieldGet$1(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_getChoiceEventState).call(this, choiceSnapshot);
      if (state.done_tool_calls.has(toolCallIndex)) {
        return;
      }
      const toolCallSnapshot = (_a2 = choiceSnapshot.message.tool_calls) == null ? void 0 : _a2[toolCallIndex];
      if (!toolCallSnapshot) {
        throw new Error("no tool call snapshot");
      }
      if (!toolCallSnapshot.type) {
        throw new Error("tool call snapshot missing `type`");
      }
      if (toolCallSnapshot.type === "function") {
        const inputTool = (_c = (_b = __classPrivateFieldGet$1(this, _ChatCompletionStream_params, "f")) == null ? void 0 : _b.tools) == null ? void 0 : _c.find((tool) => tool.type === "function" && tool.function.name === toolCallSnapshot.function.name);
        this._emit("tool_calls.function.arguments.done", {
          name: toolCallSnapshot.function.name,
          index: toolCallIndex,
          arguments: toolCallSnapshot.function.arguments,
          parsed_arguments: isAutoParsableTool(inputTool) ? inputTool.$parseRaw(toolCallSnapshot.function.arguments) : (inputTool == null ? void 0 : inputTool.function.strict) ? JSON.parse(toolCallSnapshot.function.arguments) : null
        });
      } else {
        assertNever(toolCallSnapshot.type);
      }
    }, _ChatCompletionStream_emitContentDoneEvents = function _ChatCompletionStream_emitContentDoneEvents2(choiceSnapshot) {
      var _a2, _b;
      const state = __classPrivateFieldGet$1(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_getChoiceEventState).call(this, choiceSnapshot);
      if (choiceSnapshot.message.content && !state.content_done) {
        state.content_done = true;
        const responseFormat = __classPrivateFieldGet$1(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_getAutoParseableResponseFormat).call(this);
        this._emit("content.done", {
          content: choiceSnapshot.message.content,
          parsed: responseFormat ? responseFormat.$parseRaw(choiceSnapshot.message.content) : null
        });
      }
      if (choiceSnapshot.message.refusal && !state.refusal_done) {
        state.refusal_done = true;
        this._emit("refusal.done", { refusal: choiceSnapshot.message.refusal });
      }
      if (((_a2 = choiceSnapshot.logprobs) == null ? void 0 : _a2.content) && !state.logprobs_content_done) {
        state.logprobs_content_done = true;
        this._emit("logprobs.content.done", { content: choiceSnapshot.logprobs.content });
      }
      if (((_b = choiceSnapshot.logprobs) == null ? void 0 : _b.refusal) && !state.logprobs_refusal_done) {
        state.logprobs_refusal_done = true;
        this._emit("logprobs.refusal.done", { refusal: choiceSnapshot.logprobs.refusal });
      }
    }, _ChatCompletionStream_endRequest = function _ChatCompletionStream_endRequest2() {
      if (this.ended) {
        throw new OpenAIError(`stream has ended, this shouldn't happen`);
      }
      const snapshot = __classPrivateFieldGet$1(this, _ChatCompletionStream_currentChatCompletionSnapshot, "f");
      if (!snapshot) {
        throw new OpenAIError(`request ended without sending any chunks`);
      }
      __classPrivateFieldSet$1(this, _ChatCompletionStream_currentChatCompletionSnapshot, void 0, "f");
      __classPrivateFieldSet$1(this, _ChatCompletionStream_choiceEventStates, [], "f");
      return finalizeChatCompletion(snapshot, __classPrivateFieldGet$1(this, _ChatCompletionStream_params, "f"));
    }, _ChatCompletionStream_getAutoParseableResponseFormat = function _ChatCompletionStream_getAutoParseableResponseFormat2() {
      var _a2;
      const responseFormat = (_a2 = __classPrivateFieldGet$1(this, _ChatCompletionStream_params, "f")) == null ? void 0 : _a2.response_format;
      if (isAutoParsableResponseFormat(responseFormat)) {
        return responseFormat;
      }
      return null;
    }, _ChatCompletionStream_accumulateChatCompletion = function _ChatCompletionStream_accumulateChatCompletion2(chunk) {
      var _a2, _b, _c, _d;
      let snapshot = __classPrivateFieldGet$1(this, _ChatCompletionStream_currentChatCompletionSnapshot, "f");
      const { choices, ...rest } = chunk;
      if (!snapshot) {
        snapshot = __classPrivateFieldSet$1(this, _ChatCompletionStream_currentChatCompletionSnapshot, {
          ...rest,
          choices: []
        }, "f");
      } else {
        Object.assign(snapshot, rest);
      }
      for (const { delta, finish_reason, index, logprobs = null, ...other } of chunk.choices) {
        let choice = snapshot.choices[index];
        if (!choice) {
          choice = snapshot.choices[index] = { finish_reason, index, message: {}, logprobs, ...other };
        }
        if (logprobs) {
          if (!choice.logprobs) {
            choice.logprobs = Object.assign({}, logprobs);
          } else {
            const { content: content2, refusal: refusal2, ...rest3 } = logprobs;
            Object.assign(choice.logprobs, rest3);
            if (content2) {
              (_a2 = choice.logprobs).content ?? (_a2.content = []);
              choice.logprobs.content.push(...content2);
            }
            if (refusal2) {
              (_b = choice.logprobs).refusal ?? (_b.refusal = []);
              choice.logprobs.refusal.push(...refusal2);
            }
          }
        }
        if (finish_reason) {
          choice.finish_reason = finish_reason;
          if (__classPrivateFieldGet$1(this, _ChatCompletionStream_params, "f") && hasAutoParseableInput(__classPrivateFieldGet$1(this, _ChatCompletionStream_params, "f"))) {
            if (finish_reason === "length") {
              throw new LengthFinishReasonError();
            }
            if (finish_reason === "content_filter") {
              throw new ContentFilterFinishReasonError();
            }
          }
        }
        Object.assign(choice, other);
        if (!delta)
          continue;
        const { content, refusal, function_call, role, tool_calls, ...rest2 } = delta;
        Object.assign(choice.message, rest2);
        if (refusal) {
          choice.message.refusal = (choice.message.refusal || "") + refusal;
        }
        if (role)
          choice.message.role = role;
        if (function_call) {
          if (!choice.message.function_call) {
            choice.message.function_call = function_call;
          } else {
            if (function_call.name)
              choice.message.function_call.name = function_call.name;
            if (function_call.arguments) {
              (_c = choice.message.function_call).arguments ?? (_c.arguments = "");
              choice.message.function_call.arguments += function_call.arguments;
            }
          }
        }
        if (content) {
          choice.message.content = (choice.message.content || "") + content;
          if (!choice.message.refusal && __classPrivateFieldGet$1(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_getAutoParseableResponseFormat).call(this)) {
            choice.message.parsed = partialParse(choice.message.content);
          }
        }
        if (tool_calls) {
          if (!choice.message.tool_calls)
            choice.message.tool_calls = [];
          for (const { index: index2, id, type, function: fn, ...rest3 } of tool_calls) {
            const tool_call = (_d = choice.message.tool_calls)[index2] ?? (_d[index2] = {});
            Object.assign(tool_call, rest3);
            if (id)
              tool_call.id = id;
            if (type)
              tool_call.type = type;
            if (fn)
              tool_call.function ?? (tool_call.function = { name: fn.name ?? "", arguments: "" });
            if (fn == null ? void 0 : fn.name)
              tool_call.function.name = fn.name;
            if (fn == null ? void 0 : fn.arguments) {
              tool_call.function.arguments += fn.arguments;
              if (shouldParseToolCall(__classPrivateFieldGet$1(this, _ChatCompletionStream_params, "f"), tool_call)) {
                tool_call.function.parsed_arguments = partialParse(tool_call.function.arguments);
              }
            }
          }
        }
      }
      return snapshot;
    }, Symbol.asyncIterator)]() {
      const pushQueue = [];
      const readQueue = [];
      let done = false;
      this.on("chunk", (chunk) => {
        const reader = readQueue.shift();
        if (reader) {
          reader.resolve(chunk);
        } else {
          pushQueue.push(chunk);
        }
      });
      this.on("end", () => {
        done = true;
        for (const reader of readQueue) {
          reader.resolve(void 0);
        }
        readQueue.length = 0;
      });
      this.on("abort", (err) => {
        done = true;
        for (const reader of readQueue) {
          reader.reject(err);
        }
        readQueue.length = 0;
      });
      this.on("error", (err) => {
        done = true;
        for (const reader of readQueue) {
          reader.reject(err);
        }
        readQueue.length = 0;
      });
      return {
        next: async () => {
          if (!pushQueue.length) {
            if (done) {
              return { value: void 0, done: true };
            }
            return new Promise((resolve, reject) => readQueue.push({ resolve, reject })).then((chunk2) => chunk2 ? { value: chunk2, done: false } : { value: void 0, done: true });
          }
          const chunk = pushQueue.shift();
          return { value: chunk, done: false };
        },
        return: async () => {
          this.abort();
          return { value: void 0, done: true };
        }
      };
    }
    toReadableStream() {
      const stream = new Stream(this[Symbol.asyncIterator].bind(this), this.controller);
      return stream.toReadableStream();
    }
  }
  function finalizeChatCompletion(snapshot, params) {
    const { id, choices, created, model, system_fingerprint, ...rest } = snapshot;
    const completion = {
      ...rest,
      id,
      choices: choices.map(({ message, finish_reason, index, logprobs, ...choiceRest }) => {
        if (!finish_reason) {
          throw new OpenAIError(`missing finish_reason for choice ${index}`);
        }
        const { content = null, function_call, tool_calls, ...messageRest } = message;
        const role = message.role;
        if (!role) {
          throw new OpenAIError(`missing role for choice ${index}`);
        }
        if (function_call) {
          const { arguments: args, name } = function_call;
          if (args == null) {
            throw new OpenAIError(`missing function_call.arguments for choice ${index}`);
          }
          if (!name) {
            throw new OpenAIError(`missing function_call.name for choice ${index}`);
          }
          return {
            ...choiceRest,
            message: {
              content,
              function_call: { arguments: args, name },
              role,
              refusal: message.refusal ?? null
            },
            finish_reason,
            index,
            logprobs
          };
        }
        if (tool_calls) {
          return {
            ...choiceRest,
            index,
            finish_reason,
            logprobs,
            message: {
              ...messageRest,
              role,
              content,
              refusal: message.refusal ?? null,
              tool_calls: tool_calls.map((tool_call, i) => {
                const { function: fn, type, id: id2, ...toolRest } = tool_call;
                const { arguments: args, name, ...fnRest } = fn || {};
                if (id2 == null) {
                  throw new OpenAIError(`missing choices[${index}].tool_calls[${i}].id
${str(snapshot)}`);
                }
                if (type == null) {
                  throw new OpenAIError(`missing choices[${index}].tool_calls[${i}].type
${str(snapshot)}`);
                }
                if (name == null) {
                  throw new OpenAIError(`missing choices[${index}].tool_calls[${i}].function.name
${str(snapshot)}`);
                }
                if (args == null) {
                  throw new OpenAIError(`missing choices[${index}].tool_calls[${i}].function.arguments
${str(snapshot)}`);
                }
                return { ...toolRest, id: id2, type, function: { ...fnRest, name, arguments: args } };
              })
            }
          };
        }
        return {
          ...choiceRest,
          message: { ...messageRest, content, role, refusal: message.refusal ?? null },
          finish_reason,
          index,
          logprobs
        };
      }),
      created,
      model,
      object: "chat.completion",
      ...system_fingerprint ? { system_fingerprint } : {}
    };
    return maybeParseChatCompletion(completion, params);
  }
  function str(x) {
    return JSON.stringify(x);
  }
  function assertNever(_x) {
  }
  class ChatCompletionStreamingRunner extends ChatCompletionStream {
    static fromReadableStream(stream) {
      const runner = new ChatCompletionStreamingRunner(null);
      runner._run(() => runner._fromReadableStream(stream));
      return runner;
    }
    /** @deprecated - please use `runTools` instead. */
    static runFunctions(client, params, options) {
      const runner = new ChatCompletionStreamingRunner(null);
      const opts = {
        ...options,
        headers: { ...options == null ? void 0 : options.headers, "X-Stainless-Helper-Method": "runFunctions" }
      };
      runner._run(() => runner._runFunctions(client, params, opts));
      return runner;
    }
    static runTools(client, params, options) {
      const runner = new ChatCompletionStreamingRunner(
        // @ts-expect-error TODO these types are incompatible
        params
      );
      const opts = {
        ...options,
        headers: { ...options == null ? void 0 : options.headers, "X-Stainless-Helper-Method": "runTools" }
      };
      runner._run(() => runner._runTools(client, params, opts));
      return runner;
    }
  }
  let Completions$1 = class Completions extends APIResource {
    parse(body, options) {
      validateInputTools(body.tools);
      return this._client.chat.completions.create(body, {
        ...options,
        headers: {
          ...options == null ? void 0 : options.headers,
          "X-Stainless-Helper-Method": "beta.chat.completions.parse"
        }
      })._thenUnwrap((completion) => parseChatCompletion(completion, body));
    }
    runFunctions(body, options) {
      if (body.stream) {
        return ChatCompletionStreamingRunner.runFunctions(this._client, body, options);
      }
      return ChatCompletionRunner.runFunctions(this._client, body, options);
    }
    runTools(body, options) {
      if (body.stream) {
        return ChatCompletionStreamingRunner.runTools(this._client, body, options);
      }
      return ChatCompletionRunner.runTools(this._client, body, options);
    }
    /**
     * Creates a chat completion stream
     */
    stream(body, options) {
      return ChatCompletionStream.createChatCompletion(this._client, body, options);
    }
  };
  class Chat extends APIResource {
    constructor() {
      super(...arguments);
      this.completions = new Completions$1(this._client);
    }
  }
  (function(Chat2) {
    Chat2.Completions = Completions$1;
  })(Chat || (Chat = {}));
  var __classPrivateFieldGet = globalThis && globalThis.__classPrivateFieldGet || function(receiver, state, kind2, f) {
    if (kind2 === "a" && !f)
      throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
      throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind2 === "m" ? f : kind2 === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
  };
  var __classPrivateFieldSet = globalThis && globalThis.__classPrivateFieldSet || function(receiver, state, value, kind2, f) {
    if (kind2 === "m")
      throw new TypeError("Private method is not writable");
    if (kind2 === "a" && !f)
      throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
      throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return kind2 === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
  };
  var _AssistantStream_instances, _AssistantStream_events, _AssistantStream_runStepSnapshots, _AssistantStream_messageSnapshots, _AssistantStream_messageSnapshot, _AssistantStream_finalRun, _AssistantStream_currentContentIndex, _AssistantStream_currentContent, _AssistantStream_currentToolCallIndex, _AssistantStream_currentToolCall, _AssistantStream_currentEvent, _AssistantStream_currentRunSnapshot, _AssistantStream_currentRunStepSnapshot, _AssistantStream_addEvent, _AssistantStream_endRequest, _AssistantStream_handleMessage, _AssistantStream_handleRunStep, _AssistantStream_handleEvent, _AssistantStream_accumulateRunStep, _AssistantStream_accumulateMessage, _AssistantStream_accumulateContent, _AssistantStream_handleRun;
  class AssistantStream extends EventStream {
    constructor() {
      super(...arguments);
      _AssistantStream_instances.add(this);
      _AssistantStream_events.set(this, []);
      _AssistantStream_runStepSnapshots.set(this, {});
      _AssistantStream_messageSnapshots.set(this, {});
      _AssistantStream_messageSnapshot.set(this, void 0);
      _AssistantStream_finalRun.set(this, void 0);
      _AssistantStream_currentContentIndex.set(this, void 0);
      _AssistantStream_currentContent.set(this, void 0);
      _AssistantStream_currentToolCallIndex.set(this, void 0);
      _AssistantStream_currentToolCall.set(this, void 0);
      _AssistantStream_currentEvent.set(this, void 0);
      _AssistantStream_currentRunSnapshot.set(this, void 0);
      _AssistantStream_currentRunStepSnapshot.set(this, void 0);
    }
    [(_AssistantStream_events = /* @__PURE__ */ new WeakMap(), _AssistantStream_runStepSnapshots = /* @__PURE__ */ new WeakMap(), _AssistantStream_messageSnapshots = /* @__PURE__ */ new WeakMap(), _AssistantStream_messageSnapshot = /* @__PURE__ */ new WeakMap(), _AssistantStream_finalRun = /* @__PURE__ */ new WeakMap(), _AssistantStream_currentContentIndex = /* @__PURE__ */ new WeakMap(), _AssistantStream_currentContent = /* @__PURE__ */ new WeakMap(), _AssistantStream_currentToolCallIndex = /* @__PURE__ */ new WeakMap(), _AssistantStream_currentToolCall = /* @__PURE__ */ new WeakMap(), _AssistantStream_currentEvent = /* @__PURE__ */ new WeakMap(), _AssistantStream_currentRunSnapshot = /* @__PURE__ */ new WeakMap(), _AssistantStream_currentRunStepSnapshot = /* @__PURE__ */ new WeakMap(), _AssistantStream_instances = /* @__PURE__ */ new WeakSet(), Symbol.asyncIterator)]() {
      const pushQueue = [];
      const readQueue = [];
      let done = false;
      this.on("event", (event) => {
        const reader = readQueue.shift();
        if (reader) {
          reader.resolve(event);
        } else {
          pushQueue.push(event);
        }
      });
      this.on("end", () => {
        done = true;
        for (const reader of readQueue) {
          reader.resolve(void 0);
        }
        readQueue.length = 0;
      });
      this.on("abort", (err) => {
        done = true;
        for (const reader of readQueue) {
          reader.reject(err);
        }
        readQueue.length = 0;
      });
      this.on("error", (err) => {
        done = true;
        for (const reader of readQueue) {
          reader.reject(err);
        }
        readQueue.length = 0;
      });
      return {
        next: async () => {
          if (!pushQueue.length) {
            if (done) {
              return { value: void 0, done: true };
            }
            return new Promise((resolve, reject) => readQueue.push({ resolve, reject })).then((chunk2) => chunk2 ? { value: chunk2, done: false } : { value: void 0, done: true });
          }
          const chunk = pushQueue.shift();
          return { value: chunk, done: false };
        },
        return: async () => {
          this.abort();
          return { value: void 0, done: true };
        }
      };
    }
    static fromReadableStream(stream) {
      const runner = new AssistantStream();
      runner._run(() => runner._fromReadableStream(stream));
      return runner;
    }
    async _fromReadableStream(readableStream, options) {
      var _a2;
      const signal = options == null ? void 0 : options.signal;
      if (signal) {
        if (signal.aborted)
          this.controller.abort();
        signal.addEventListener("abort", () => this.controller.abort());
      }
      this._connected();
      const stream = Stream.fromReadableStream(readableStream, this.controller);
      for await (const event of stream) {
        __classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_addEvent).call(this, event);
      }
      if ((_a2 = stream.controller.signal) == null ? void 0 : _a2.aborted) {
        throw new APIUserAbortError();
      }
      return this._addRun(__classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_endRequest).call(this));
    }
    toReadableStream() {
      const stream = new Stream(this[Symbol.asyncIterator].bind(this), this.controller);
      return stream.toReadableStream();
    }
    static createToolAssistantStream(threadId, runId, runs, params, options) {
      const runner = new AssistantStream();
      runner._run(() => runner._runToolAssistantStream(threadId, runId, runs, params, {
        ...options,
        headers: { ...options == null ? void 0 : options.headers, "X-Stainless-Helper-Method": "stream" }
      }));
      return runner;
    }
    async _createToolAssistantStream(run, threadId, runId, params, options) {
      var _a2;
      const signal = options == null ? void 0 : options.signal;
      if (signal) {
        if (signal.aborted)
          this.controller.abort();
        signal.addEventListener("abort", () => this.controller.abort());
      }
      const body = { ...params, stream: true };
      const stream = await run.submitToolOutputs(threadId, runId, body, {
        ...options,
        signal: this.controller.signal
      });
      this._connected();
      for await (const event of stream) {
        __classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_addEvent).call(this, event);
      }
      if ((_a2 = stream.controller.signal) == null ? void 0 : _a2.aborted) {
        throw new APIUserAbortError();
      }
      return this._addRun(__classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_endRequest).call(this));
    }
    static createThreadAssistantStream(params, thread, options) {
      const runner = new AssistantStream();
      runner._run(() => runner._threadAssistantStream(params, thread, {
        ...options,
        headers: { ...options == null ? void 0 : options.headers, "X-Stainless-Helper-Method": "stream" }
      }));
      return runner;
    }
    static createAssistantStream(threadId, runs, params, options) {
      const runner = new AssistantStream();
      runner._run(() => runner._runAssistantStream(threadId, runs, params, {
        ...options,
        headers: { ...options == null ? void 0 : options.headers, "X-Stainless-Helper-Method": "stream" }
      }));
      return runner;
    }
    currentEvent() {
      return __classPrivateFieldGet(this, _AssistantStream_currentEvent, "f");
    }
    currentRun() {
      return __classPrivateFieldGet(this, _AssistantStream_currentRunSnapshot, "f");
    }
    currentMessageSnapshot() {
      return __classPrivateFieldGet(this, _AssistantStream_messageSnapshot, "f");
    }
    currentRunStepSnapshot() {
      return __classPrivateFieldGet(this, _AssistantStream_currentRunStepSnapshot, "f");
    }
    async finalRunSteps() {
      await this.done();
      return Object.values(__classPrivateFieldGet(this, _AssistantStream_runStepSnapshots, "f"));
    }
    async finalMessages() {
      await this.done();
      return Object.values(__classPrivateFieldGet(this, _AssistantStream_messageSnapshots, "f"));
    }
    async finalRun() {
      await this.done();
      if (!__classPrivateFieldGet(this, _AssistantStream_finalRun, "f"))
        throw Error("Final run was not received.");
      return __classPrivateFieldGet(this, _AssistantStream_finalRun, "f");
    }
    async _createThreadAssistantStream(thread, params, options) {
      var _a2;
      const signal = options == null ? void 0 : options.signal;
      if (signal) {
        if (signal.aborted)
          this.controller.abort();
        signal.addEventListener("abort", () => this.controller.abort());
      }
      const body = { ...params, stream: true };
      const stream = await thread.createAndRun(body, { ...options, signal: this.controller.signal });
      this._connected();
      for await (const event of stream) {
        __classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_addEvent).call(this, event);
      }
      if ((_a2 = stream.controller.signal) == null ? void 0 : _a2.aborted) {
        throw new APIUserAbortError();
      }
      return this._addRun(__classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_endRequest).call(this));
    }
    async _createAssistantStream(run, threadId, params, options) {
      var _a2;
      const signal = options == null ? void 0 : options.signal;
      if (signal) {
        if (signal.aborted)
          this.controller.abort();
        signal.addEventListener("abort", () => this.controller.abort());
      }
      const body = { ...params, stream: true };
      const stream = await run.create(threadId, body, { ...options, signal: this.controller.signal });
      this._connected();
      for await (const event of stream) {
        __classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_addEvent).call(this, event);
      }
      if ((_a2 = stream.controller.signal) == null ? void 0 : _a2.aborted) {
        throw new APIUserAbortError();
      }
      return this._addRun(__classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_endRequest).call(this));
    }
    static accumulateDelta(acc, delta) {
      for (const [key, deltaValue] of Object.entries(delta)) {
        if (!acc.hasOwnProperty(key)) {
          acc[key] = deltaValue;
          continue;
        }
        let accValue = acc[key];
        if (accValue === null || accValue === void 0) {
          acc[key] = deltaValue;
          continue;
        }
        if (key === "index" || key === "type") {
          acc[key] = deltaValue;
          continue;
        }
        if (typeof accValue === "string" && typeof deltaValue === "string") {
          accValue += deltaValue;
        } else if (typeof accValue === "number" && typeof deltaValue === "number") {
          accValue += deltaValue;
        } else if (isObj(accValue) && isObj(deltaValue)) {
          accValue = this.accumulateDelta(accValue, deltaValue);
        } else if (Array.isArray(accValue) && Array.isArray(deltaValue)) {
          if (accValue.every((x) => typeof x === "string" || typeof x === "number")) {
            accValue.push(...deltaValue);
            continue;
          }
          for (const deltaEntry of deltaValue) {
            if (!isObj(deltaEntry)) {
              throw new Error(`Expected array delta entry to be an object but got: ${deltaEntry}`);
            }
            const index = deltaEntry["index"];
            if (index == null) {
              console.error(deltaEntry);
              throw new Error("Expected array delta entry to have an `index` property");
            }
            if (typeof index !== "number") {
              throw new Error(`Expected array delta entry \`index\` property to be a number but got ${index}`);
            }
            const accEntry = accValue[index];
            if (accEntry == null) {
              accValue.push(deltaEntry);
            } else {
              accValue[index] = this.accumulateDelta(accEntry, deltaEntry);
            }
          }
          continue;
        } else {
          throw Error(`Unhandled record type: ${key}, deltaValue: ${deltaValue}, accValue: ${accValue}`);
        }
        acc[key] = accValue;
      }
      return acc;
    }
    _addRun(run) {
      return run;
    }
    async _threadAssistantStream(params, thread, options) {
      return await this._createThreadAssistantStream(thread, params, options);
    }
    async _runAssistantStream(threadId, runs, params, options) {
      return await this._createAssistantStream(runs, threadId, params, options);
    }
    async _runToolAssistantStream(threadId, runId, runs, params, options) {
      return await this._createToolAssistantStream(runs, threadId, runId, params, options);
    }
  }
  _AssistantStream_addEvent = function _AssistantStream_addEvent2(event) {
    if (this.ended)
      return;
    __classPrivateFieldSet(this, _AssistantStream_currentEvent, event, "f");
    __classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_handleEvent).call(this, event);
    switch (event.event) {
      case "thread.created":
        break;
      case "thread.run.created":
      case "thread.run.queued":
      case "thread.run.in_progress":
      case "thread.run.requires_action":
      case "thread.run.completed":
      case "thread.run.failed":
      case "thread.run.cancelling":
      case "thread.run.cancelled":
      case "thread.run.expired":
        __classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_handleRun).call(this, event);
        break;
      case "thread.run.step.created":
      case "thread.run.step.in_progress":
      case "thread.run.step.delta":
      case "thread.run.step.completed":
      case "thread.run.step.failed":
      case "thread.run.step.cancelled":
      case "thread.run.step.expired":
        __classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_handleRunStep).call(this, event);
        break;
      case "thread.message.created":
      case "thread.message.in_progress":
      case "thread.message.delta":
      case "thread.message.completed":
      case "thread.message.incomplete":
        __classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_handleMessage).call(this, event);
        break;
      case "error":
        throw new Error("Encountered an error event in event processing - errors should be processed earlier");
    }
  }, _AssistantStream_endRequest = function _AssistantStream_endRequest2() {
    if (this.ended) {
      throw new OpenAIError(`stream has ended, this shouldn't happen`);
    }
    if (!__classPrivateFieldGet(this, _AssistantStream_finalRun, "f"))
      throw Error("Final run has not been received");
    return __classPrivateFieldGet(this, _AssistantStream_finalRun, "f");
  }, _AssistantStream_handleMessage = function _AssistantStream_handleMessage2(event) {
    const [accumulatedMessage, newContent] = __classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_accumulateMessage).call(this, event, __classPrivateFieldGet(this, _AssistantStream_messageSnapshot, "f"));
    __classPrivateFieldSet(this, _AssistantStream_messageSnapshot, accumulatedMessage, "f");
    __classPrivateFieldGet(this, _AssistantStream_messageSnapshots, "f")[accumulatedMessage.id] = accumulatedMessage;
    for (const content of newContent) {
      const snapshotContent = accumulatedMessage.content[content.index];
      if ((snapshotContent == null ? void 0 : snapshotContent.type) == "text") {
        this._emit("textCreated", snapshotContent.text);
      }
    }
    switch (event.event) {
      case "thread.message.created":
        this._emit("messageCreated", event.data);
        break;
      case "thread.message.in_progress":
        break;
      case "thread.message.delta":
        this._emit("messageDelta", event.data.delta, accumulatedMessage);
        if (event.data.delta.content) {
          for (const content of event.data.delta.content) {
            if (content.type == "text" && content.text) {
              let textDelta = content.text;
              let snapshot = accumulatedMessage.content[content.index];
              if (snapshot && snapshot.type == "text") {
                this._emit("textDelta", textDelta, snapshot.text);
              } else {
                throw Error("The snapshot associated with this text delta is not text or missing");
              }
            }
            if (content.index != __classPrivateFieldGet(this, _AssistantStream_currentContentIndex, "f")) {
              if (__classPrivateFieldGet(this, _AssistantStream_currentContent, "f")) {
                switch (__classPrivateFieldGet(this, _AssistantStream_currentContent, "f").type) {
                  case "text":
                    this._emit("textDone", __classPrivateFieldGet(this, _AssistantStream_currentContent, "f").text, __classPrivateFieldGet(this, _AssistantStream_messageSnapshot, "f"));
                    break;
                  case "image_file":
                    this._emit("imageFileDone", __classPrivateFieldGet(this, _AssistantStream_currentContent, "f").image_file, __classPrivateFieldGet(this, _AssistantStream_messageSnapshot, "f"));
                    break;
                }
              }
              __classPrivateFieldSet(this, _AssistantStream_currentContentIndex, content.index, "f");
            }
            __classPrivateFieldSet(this, _AssistantStream_currentContent, accumulatedMessage.content[content.index], "f");
          }
        }
        break;
      case "thread.message.completed":
      case "thread.message.incomplete":
        if (__classPrivateFieldGet(this, _AssistantStream_currentContentIndex, "f") !== void 0) {
          const currentContent = event.data.content[__classPrivateFieldGet(this, _AssistantStream_currentContentIndex, "f")];
          if (currentContent) {
            switch (currentContent.type) {
              case "image_file":
                this._emit("imageFileDone", currentContent.image_file, __classPrivateFieldGet(this, _AssistantStream_messageSnapshot, "f"));
                break;
              case "text":
                this._emit("textDone", currentContent.text, __classPrivateFieldGet(this, _AssistantStream_messageSnapshot, "f"));
                break;
            }
          }
        }
        if (__classPrivateFieldGet(this, _AssistantStream_messageSnapshot, "f")) {
          this._emit("messageDone", event.data);
        }
        __classPrivateFieldSet(this, _AssistantStream_messageSnapshot, void 0, "f");
    }
  }, _AssistantStream_handleRunStep = function _AssistantStream_handleRunStep2(event) {
    const accumulatedRunStep = __classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_accumulateRunStep).call(this, event);
    __classPrivateFieldSet(this, _AssistantStream_currentRunStepSnapshot, accumulatedRunStep, "f");
    switch (event.event) {
      case "thread.run.step.created":
        this._emit("runStepCreated", event.data);
        break;
      case "thread.run.step.delta":
        const delta = event.data.delta;
        if (delta.step_details && delta.step_details.type == "tool_calls" && delta.step_details.tool_calls && accumulatedRunStep.step_details.type == "tool_calls") {
          for (const toolCall of delta.step_details.tool_calls) {
            if (toolCall.index == __classPrivateFieldGet(this, _AssistantStream_currentToolCallIndex, "f")) {
              this._emit("toolCallDelta", toolCall, accumulatedRunStep.step_details.tool_calls[toolCall.index]);
            } else {
              if (__classPrivateFieldGet(this, _AssistantStream_currentToolCall, "f")) {
                this._emit("toolCallDone", __classPrivateFieldGet(this, _AssistantStream_currentToolCall, "f"));
              }
              __classPrivateFieldSet(this, _AssistantStream_currentToolCallIndex, toolCall.index, "f");
              __classPrivateFieldSet(this, _AssistantStream_currentToolCall, accumulatedRunStep.step_details.tool_calls[toolCall.index], "f");
              if (__classPrivateFieldGet(this, _AssistantStream_currentToolCall, "f"))
                this._emit("toolCallCreated", __classPrivateFieldGet(this, _AssistantStream_currentToolCall, "f"));
            }
          }
        }
        this._emit("runStepDelta", event.data.delta, accumulatedRunStep);
        break;
      case "thread.run.step.completed":
      case "thread.run.step.failed":
      case "thread.run.step.cancelled":
      case "thread.run.step.expired":
        __classPrivateFieldSet(this, _AssistantStream_currentRunStepSnapshot, void 0, "f");
        const details = event.data.step_details;
        if (details.type == "tool_calls") {
          if (__classPrivateFieldGet(this, _AssistantStream_currentToolCall, "f")) {
            this._emit("toolCallDone", __classPrivateFieldGet(this, _AssistantStream_currentToolCall, "f"));
            __classPrivateFieldSet(this, _AssistantStream_currentToolCall, void 0, "f");
          }
        }
        this._emit("runStepDone", event.data, accumulatedRunStep);
        break;
    }
  }, _AssistantStream_handleEvent = function _AssistantStream_handleEvent2(event) {
    __classPrivateFieldGet(this, _AssistantStream_events, "f").push(event);
    this._emit("event", event);
  }, _AssistantStream_accumulateRunStep = function _AssistantStream_accumulateRunStep2(event) {
    switch (event.event) {
      case "thread.run.step.created":
        __classPrivateFieldGet(this, _AssistantStream_runStepSnapshots, "f")[event.data.id] = event.data;
        return event.data;
      case "thread.run.step.delta":
        let snapshot = __classPrivateFieldGet(this, _AssistantStream_runStepSnapshots, "f")[event.data.id];
        if (!snapshot) {
          throw Error("Received a RunStepDelta before creation of a snapshot");
        }
        let data = event.data;
        if (data.delta) {
          const accumulated = AssistantStream.accumulateDelta(snapshot, data.delta);
          __classPrivateFieldGet(this, _AssistantStream_runStepSnapshots, "f")[event.data.id] = accumulated;
        }
        return __classPrivateFieldGet(this, _AssistantStream_runStepSnapshots, "f")[event.data.id];
      case "thread.run.step.completed":
      case "thread.run.step.failed":
      case "thread.run.step.cancelled":
      case "thread.run.step.expired":
      case "thread.run.step.in_progress":
        __classPrivateFieldGet(this, _AssistantStream_runStepSnapshots, "f")[event.data.id] = event.data;
        break;
    }
    if (__classPrivateFieldGet(this, _AssistantStream_runStepSnapshots, "f")[event.data.id])
      return __classPrivateFieldGet(this, _AssistantStream_runStepSnapshots, "f")[event.data.id];
    throw new Error("No snapshot available");
  }, _AssistantStream_accumulateMessage = function _AssistantStream_accumulateMessage2(event, snapshot) {
    let newContent = [];
    switch (event.event) {
      case "thread.message.created":
        return [event.data, newContent];
      case "thread.message.delta":
        if (!snapshot) {
          throw Error("Received a delta with no existing snapshot (there should be one from message creation)");
        }
        let data = event.data;
        if (data.delta.content) {
          for (const contentElement of data.delta.content) {
            if (contentElement.index in snapshot.content) {
              let currentContent = snapshot.content[contentElement.index];
              snapshot.content[contentElement.index] = __classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_accumulateContent).call(this, contentElement, currentContent);
            } else {
              snapshot.content[contentElement.index] = contentElement;
              newContent.push(contentElement);
            }
          }
        }
        return [snapshot, newContent];
      case "thread.message.in_progress":
      case "thread.message.completed":
      case "thread.message.incomplete":
        if (snapshot) {
          return [snapshot, newContent];
        } else {
          throw Error("Received thread message event with no existing snapshot");
        }
    }
    throw Error("Tried to accumulate a non-message event");
  }, _AssistantStream_accumulateContent = function _AssistantStream_accumulateContent2(contentElement, currentContent) {
    return AssistantStream.accumulateDelta(currentContent, contentElement);
  }, _AssistantStream_handleRun = function _AssistantStream_handleRun2(event) {
    __classPrivateFieldSet(this, _AssistantStream_currentRunSnapshot, event.data, "f");
    switch (event.event) {
      case "thread.run.created":
        break;
      case "thread.run.queued":
        break;
      case "thread.run.in_progress":
        break;
      case "thread.run.requires_action":
      case "thread.run.cancelled":
      case "thread.run.failed":
      case "thread.run.completed":
      case "thread.run.expired":
        __classPrivateFieldSet(this, _AssistantStream_finalRun, event.data, "f");
        if (__classPrivateFieldGet(this, _AssistantStream_currentToolCall, "f")) {
          this._emit("toolCallDone", __classPrivateFieldGet(this, _AssistantStream_currentToolCall, "f"));
          __classPrivateFieldSet(this, _AssistantStream_currentToolCall, void 0, "f");
        }
        break;
    }
  };
  class Messages extends APIResource {
    /**
     * Create a message.
     */
    create(threadId, body, options) {
      return this._client.post(`/threads/${threadId}/messages`, {
        body,
        ...options,
        headers: { "OpenAI-Beta": "assistants=v2", ...options == null ? void 0 : options.headers }
      });
    }
    /**
     * Retrieve a message.
     */
    retrieve(threadId, messageId, options) {
      return this._client.get(`/threads/${threadId}/messages/${messageId}`, {
        ...options,
        headers: { "OpenAI-Beta": "assistants=v2", ...options == null ? void 0 : options.headers }
      });
    }
    /**
     * Modifies a message.
     */
    update(threadId, messageId, body, options) {
      return this._client.post(`/threads/${threadId}/messages/${messageId}`, {
        body,
        ...options,
        headers: { "OpenAI-Beta": "assistants=v2", ...options == null ? void 0 : options.headers }
      });
    }
    list(threadId, query = {}, options) {
      if (isRequestOptions(query)) {
        return this.list(threadId, {}, query);
      }
      return this._client.getAPIList(`/threads/${threadId}/messages`, MessagesPage, {
        query,
        ...options,
        headers: { "OpenAI-Beta": "assistants=v2", ...options == null ? void 0 : options.headers }
      });
    }
    /**
     * Deletes a message.
     */
    del(threadId, messageId, options) {
      return this._client.delete(`/threads/${threadId}/messages/${messageId}`, {
        ...options,
        headers: { "OpenAI-Beta": "assistants=v2", ...options == null ? void 0 : options.headers }
      });
    }
  }
  class MessagesPage extends CursorPage {
  }
  (function(Messages2) {
    Messages2.MessagesPage = MessagesPage;
  })(Messages || (Messages = {}));
  class Steps extends APIResource {
    retrieve(threadId, runId, stepId, query = {}, options) {
      if (isRequestOptions(query)) {
        return this.retrieve(threadId, runId, stepId, {}, query);
      }
      return this._client.get(`/threads/${threadId}/runs/${runId}/steps/${stepId}`, {
        query,
        ...options,
        headers: { "OpenAI-Beta": "assistants=v2", ...options == null ? void 0 : options.headers }
      });
    }
    list(threadId, runId, query = {}, options) {
      if (isRequestOptions(query)) {
        return this.list(threadId, runId, {}, query);
      }
      return this._client.getAPIList(`/threads/${threadId}/runs/${runId}/steps`, RunStepsPage, {
        query,
        ...options,
        headers: { "OpenAI-Beta": "assistants=v2", ...options == null ? void 0 : options.headers }
      });
    }
  }
  class RunStepsPage extends CursorPage {
  }
  (function(Steps2) {
    Steps2.RunStepsPage = RunStepsPage;
  })(Steps || (Steps = {}));
  class Runs extends APIResource {
    constructor() {
      super(...arguments);
      this.steps = new Steps(this._client);
    }
    create(threadId, params, options) {
      const { include, ...body } = params;
      return this._client.post(`/threads/${threadId}/runs`, {
        query: { include },
        body,
        ...options,
        headers: { "OpenAI-Beta": "assistants=v2", ...options == null ? void 0 : options.headers },
        stream: params.stream ?? false
      });
    }
    /**
     * Retrieves a run.
     */
    retrieve(threadId, runId, options) {
      return this._client.get(`/threads/${threadId}/runs/${runId}`, {
        ...options,
        headers: { "OpenAI-Beta": "assistants=v2", ...options == null ? void 0 : options.headers }
      });
    }
    /**
     * Modifies a run.
     */
    update(threadId, runId, body, options) {
      return this._client.post(`/threads/${threadId}/runs/${runId}`, {
        body,
        ...options,
        headers: { "OpenAI-Beta": "assistants=v2", ...options == null ? void 0 : options.headers }
      });
    }
    list(threadId, query = {}, options) {
      if (isRequestOptions(query)) {
        return this.list(threadId, {}, query);
      }
      return this._client.getAPIList(`/threads/${threadId}/runs`, RunsPage, {
        query,
        ...options,
        headers: { "OpenAI-Beta": "assistants=v2", ...options == null ? void 0 : options.headers }
      });
    }
    /**
     * Cancels a run that is `in_progress`.
     */
    cancel(threadId, runId, options) {
      return this._client.post(`/threads/${threadId}/runs/${runId}/cancel`, {
        ...options,
        headers: { "OpenAI-Beta": "assistants=v2", ...options == null ? void 0 : options.headers }
      });
    }
    /**
     * A helper to create a run an poll for a terminal state. More information on Run
     * lifecycles can be found here:
     * https://platform.openai.com/docs/assistants/how-it-works/runs-and-run-steps
     */
    async createAndPoll(threadId, body, options) {
      const run = await this.create(threadId, body, options);
      return await this.poll(threadId, run.id, options);
    }
    /**
     * Create a Run stream
     *
     * @deprecated use `stream` instead
     */
    createAndStream(threadId, body, options) {
      return AssistantStream.createAssistantStream(threadId, this._client.beta.threads.runs, body, options);
    }
    /**
     * A helper to poll a run status until it reaches a terminal state. More
     * information on Run lifecycles can be found here:
     * https://platform.openai.com/docs/assistants/how-it-works/runs-and-run-steps
     */
    async poll(threadId, runId, options) {
      const headers = { ...options == null ? void 0 : options.headers, "X-Stainless-Poll-Helper": "true" };
      if (options == null ? void 0 : options.pollIntervalMs) {
        headers["X-Stainless-Custom-Poll-Interval"] = options.pollIntervalMs.toString();
      }
      while (true) {
        const { data: run, response } = await this.retrieve(threadId, runId, {
          ...options,
          headers: { ...options == null ? void 0 : options.headers, ...headers }
        }).withResponse();
        switch (run.status) {
          case "queued":
          case "in_progress":
          case "cancelling":
            let sleepInterval = 5e3;
            if (options == null ? void 0 : options.pollIntervalMs) {
              sleepInterval = options.pollIntervalMs;
            } else {
              const headerInterval = response.headers.get("openai-poll-after-ms");
              if (headerInterval) {
                const headerIntervalMs = parseInt(headerInterval);
                if (!isNaN(headerIntervalMs)) {
                  sleepInterval = headerIntervalMs;
                }
              }
            }
            await sleep(sleepInterval);
            break;
          case "requires_action":
          case "incomplete":
          case "cancelled":
          case "completed":
          case "failed":
          case "expired":
            return run;
        }
      }
    }
    /**
     * Create a Run stream
     */
    stream(threadId, body, options) {
      return AssistantStream.createAssistantStream(threadId, this._client.beta.threads.runs, body, options);
    }
    submitToolOutputs(threadId, runId, body, options) {
      return this._client.post(`/threads/${threadId}/runs/${runId}/submit_tool_outputs`, {
        body,
        ...options,
        headers: { "OpenAI-Beta": "assistants=v2", ...options == null ? void 0 : options.headers },
        stream: body.stream ?? false
      });
    }
    /**
     * A helper to submit a tool output to a run and poll for a terminal run state.
     * More information on Run lifecycles can be found here:
     * https://platform.openai.com/docs/assistants/how-it-works/runs-and-run-steps
     */
    async submitToolOutputsAndPoll(threadId, runId, body, options) {
      const run = await this.submitToolOutputs(threadId, runId, body, options);
      return await this.poll(threadId, run.id, options);
    }
    /**
     * Submit the tool outputs from a previous run and stream the run to a terminal
     * state. More information on Run lifecycles can be found here:
     * https://platform.openai.com/docs/assistants/how-it-works/runs-and-run-steps
     */
    submitToolOutputsStream(threadId, runId, body, options) {
      return AssistantStream.createToolAssistantStream(threadId, runId, this._client.beta.threads.runs, body, options);
    }
  }
  class RunsPage extends CursorPage {
  }
  (function(Runs2) {
    Runs2.RunsPage = RunsPage;
    Runs2.Steps = Steps;
    Runs2.RunStepsPage = RunStepsPage;
  })(Runs || (Runs = {}));
  class Threads extends APIResource {
    constructor() {
      super(...arguments);
      this.runs = new Runs(this._client);
      this.messages = new Messages(this._client);
    }
    create(body = {}, options) {
      if (isRequestOptions(body)) {
        return this.create({}, body);
      }
      return this._client.post("/threads", {
        body,
        ...options,
        headers: { "OpenAI-Beta": "assistants=v2", ...options == null ? void 0 : options.headers }
      });
    }
    /**
     * Retrieves a thread.
     */
    retrieve(threadId, options) {
      return this._client.get(`/threads/${threadId}`, {
        ...options,
        headers: { "OpenAI-Beta": "assistants=v2", ...options == null ? void 0 : options.headers }
      });
    }
    /**
     * Modifies a thread.
     */
    update(threadId, body, options) {
      return this._client.post(`/threads/${threadId}`, {
        body,
        ...options,
        headers: { "OpenAI-Beta": "assistants=v2", ...options == null ? void 0 : options.headers }
      });
    }
    /**
     * Delete a thread.
     */
    del(threadId, options) {
      return this._client.delete(`/threads/${threadId}`, {
        ...options,
        headers: { "OpenAI-Beta": "assistants=v2", ...options == null ? void 0 : options.headers }
      });
    }
    createAndRun(body, options) {
      return this._client.post("/threads/runs", {
        body,
        ...options,
        headers: { "OpenAI-Beta": "assistants=v2", ...options == null ? void 0 : options.headers },
        stream: body.stream ?? false
      });
    }
    /**
     * A helper to create a thread, start a run and then poll for a terminal state.
     * More information on Run lifecycles can be found here:
     * https://platform.openai.com/docs/assistants/how-it-works/runs-and-run-steps
     */
    async createAndRunPoll(body, options) {
      const run = await this.createAndRun(body, options);
      return await this.runs.poll(run.thread_id, run.id, options);
    }
    /**
     * Create a thread and stream the run back
     */
    createAndRunStream(body, options) {
      return AssistantStream.createThreadAssistantStream(body, this._client.beta.threads, options);
    }
  }
  (function(Threads2) {
    Threads2.Runs = Runs;
    Threads2.RunsPage = RunsPage;
    Threads2.Messages = Messages;
    Threads2.MessagesPage = MessagesPage;
  })(Threads || (Threads = {}));
  const allSettledWithThrow = async (promises) => {
    const results = await Promise.allSettled(promises);
    const rejected = results.filter((result) => result.status === "rejected");
    if (rejected.length) {
      for (const result of rejected) {
        console.error(result.reason);
      }
      throw new Error(`${rejected.length} promise(s) failed - see the above errors`);
    }
    const values = [];
    for (const result of results) {
      if (result.status === "fulfilled") {
        values.push(result.value);
      }
    }
    return values;
  };
  let Files$1 = class Files extends APIResource {
    /**
     * Create a vector store file by attaching a
     * [File](https://platform.openai.com/docs/api-reference/files) to a
     * [vector store](https://platform.openai.com/docs/api-reference/vector-stores/object).
     */
    create(vectorStoreId, body, options) {
      return this._client.post(`/vector_stores/${vectorStoreId}/files`, {
        body,
        ...options,
        headers: { "OpenAI-Beta": "assistants=v2", ...options == null ? void 0 : options.headers }
      });
    }
    /**
     * Retrieves a vector store file.
     */
    retrieve(vectorStoreId, fileId, options) {
      return this._client.get(`/vector_stores/${vectorStoreId}/files/${fileId}`, {
        ...options,
        headers: { "OpenAI-Beta": "assistants=v2", ...options == null ? void 0 : options.headers }
      });
    }
    list(vectorStoreId, query = {}, options) {
      if (isRequestOptions(query)) {
        return this.list(vectorStoreId, {}, query);
      }
      return this._client.getAPIList(`/vector_stores/${vectorStoreId}/files`, VectorStoreFilesPage, {
        query,
        ...options,
        headers: { "OpenAI-Beta": "assistants=v2", ...options == null ? void 0 : options.headers }
      });
    }
    /**
     * Delete a vector store file. This will remove the file from the vector store but
     * the file itself will not be deleted. To delete the file, use the
     * [delete file](https://platform.openai.com/docs/api-reference/files/delete)
     * endpoint.
     */
    del(vectorStoreId, fileId, options) {
      return this._client.delete(`/vector_stores/${vectorStoreId}/files/${fileId}`, {
        ...options,
        headers: { "OpenAI-Beta": "assistants=v2", ...options == null ? void 0 : options.headers }
      });
    }
    /**
     * Attach a file to the given vector store and wait for it to be processed.
     */
    async createAndPoll(vectorStoreId, body, options) {
      const file = await this.create(vectorStoreId, body, options);
      return await this.poll(vectorStoreId, file.id, options);
    }
    /**
     * Wait for the vector store file to finish processing.
     *
     * Note: this will return even if the file failed to process, you need to check
     * file.last_error and file.status to handle these cases
     */
    async poll(vectorStoreId, fileId, options) {
      const headers = { ...options == null ? void 0 : options.headers, "X-Stainless-Poll-Helper": "true" };
      if (options == null ? void 0 : options.pollIntervalMs) {
        headers["X-Stainless-Custom-Poll-Interval"] = options.pollIntervalMs.toString();
      }
      while (true) {
        const fileResponse = await this.retrieve(vectorStoreId, fileId, {
          ...options,
          headers
        }).withResponse();
        const file = fileResponse.data;
        switch (file.status) {
          case "in_progress":
            let sleepInterval = 5e3;
            if (options == null ? void 0 : options.pollIntervalMs) {
              sleepInterval = options.pollIntervalMs;
            } else {
              const headerInterval = fileResponse.response.headers.get("openai-poll-after-ms");
              if (headerInterval) {
                const headerIntervalMs = parseInt(headerInterval);
                if (!isNaN(headerIntervalMs)) {
                  sleepInterval = headerIntervalMs;
                }
              }
            }
            await sleep(sleepInterval);
            break;
          case "failed":
          case "completed":
            return file;
        }
      }
    }
    /**
     * Upload a file to the `files` API and then attach it to the given vector store.
     *
     * Note the file will be asynchronously processed (you can use the alternative
     * polling helper method to wait for processing to complete).
     */
    async upload(vectorStoreId, file, options) {
      const fileInfo = await this._client.files.create({ file, purpose: "assistants" }, options);
      return this.create(vectorStoreId, { file_id: fileInfo.id }, options);
    }
    /**
     * Add a file to a vector store and poll until processing is complete.
     */
    async uploadAndPoll(vectorStoreId, file, options) {
      const fileInfo = await this.upload(vectorStoreId, file, options);
      return await this.poll(vectorStoreId, fileInfo.id, options);
    }
  };
  class VectorStoreFilesPage extends CursorPage {
  }
  (function(Files2) {
    Files2.VectorStoreFilesPage = VectorStoreFilesPage;
  })(Files$1 || (Files$1 = {}));
  class FileBatches extends APIResource {
    /**
     * Create a vector store file batch.
     */
    create(vectorStoreId, body, options) {
      return this._client.post(`/vector_stores/${vectorStoreId}/file_batches`, {
        body,
        ...options,
        headers: { "OpenAI-Beta": "assistants=v2", ...options == null ? void 0 : options.headers }
      });
    }
    /**
     * Retrieves a vector store file batch.
     */
    retrieve(vectorStoreId, batchId, options) {
      return this._client.get(`/vector_stores/${vectorStoreId}/file_batches/${batchId}`, {
        ...options,
        headers: { "OpenAI-Beta": "assistants=v2", ...options == null ? void 0 : options.headers }
      });
    }
    /**
     * Cancel a vector store file batch. This attempts to cancel the processing of
     * files in this batch as soon as possible.
     */
    cancel(vectorStoreId, batchId, options) {
      return this._client.post(`/vector_stores/${vectorStoreId}/file_batches/${batchId}/cancel`, {
        ...options,
        headers: { "OpenAI-Beta": "assistants=v2", ...options == null ? void 0 : options.headers }
      });
    }
    /**
     * Create a vector store batch and poll until all files have been processed.
     */
    async createAndPoll(vectorStoreId, body, options) {
      const batch = await this.create(vectorStoreId, body);
      return await this.poll(vectorStoreId, batch.id, options);
    }
    listFiles(vectorStoreId, batchId, query = {}, options) {
      if (isRequestOptions(query)) {
        return this.listFiles(vectorStoreId, batchId, {}, query);
      }
      return this._client.getAPIList(`/vector_stores/${vectorStoreId}/file_batches/${batchId}/files`, VectorStoreFilesPage, { query, ...options, headers: { "OpenAI-Beta": "assistants=v2", ...options == null ? void 0 : options.headers } });
    }
    /**
     * Wait for the given file batch to be processed.
     *
     * Note: this will return even if one of the files failed to process, you need to
     * check batch.file_counts.failed_count to handle this case.
     */
    async poll(vectorStoreId, batchId, options) {
      const headers = { ...options == null ? void 0 : options.headers, "X-Stainless-Poll-Helper": "true" };
      if (options == null ? void 0 : options.pollIntervalMs) {
        headers["X-Stainless-Custom-Poll-Interval"] = options.pollIntervalMs.toString();
      }
      while (true) {
        const { data: batch, response } = await this.retrieve(vectorStoreId, batchId, {
          ...options,
          headers
        }).withResponse();
        switch (batch.status) {
          case "in_progress":
            let sleepInterval = 5e3;
            if (options == null ? void 0 : options.pollIntervalMs) {
              sleepInterval = options.pollIntervalMs;
            } else {
              const headerInterval = response.headers.get("openai-poll-after-ms");
              if (headerInterval) {
                const headerIntervalMs = parseInt(headerInterval);
                if (!isNaN(headerIntervalMs)) {
                  sleepInterval = headerIntervalMs;
                }
              }
            }
            await sleep(sleepInterval);
            break;
          case "failed":
          case "cancelled":
          case "completed":
            return batch;
        }
      }
    }
    /**
     * Uploads the given files concurrently and then creates a vector store file batch.
     *
     * The concurrency limit is configurable using the `maxConcurrency` parameter.
     */
    async uploadAndPoll(vectorStoreId, { files, fileIds = [] }, options) {
      if (files == null || files.length == 0) {
        throw new Error(`No \`files\` provided to process. If you've already uploaded files you should use \`.createAndPoll()\` instead`);
      }
      const configuredConcurrency = (options == null ? void 0 : options.maxConcurrency) ?? 5;
      const concurrencyLimit = Math.min(configuredConcurrency, files.length);
      const client = this._client;
      const fileIterator = files.values();
      const allFileIds = [...fileIds];
      async function processFiles(iterator) {
        for (let item of iterator) {
          const fileObj = await client.files.create({ file: item, purpose: "assistants" }, options);
          allFileIds.push(fileObj.id);
        }
      }
      const workers = Array(concurrencyLimit).fill(fileIterator).map(processFiles);
      await allSettledWithThrow(workers);
      return await this.createAndPoll(vectorStoreId, {
        file_ids: allFileIds
      });
    }
  }
  /* @__PURE__ */ (function(FileBatches2) {
  })(FileBatches || (FileBatches = {}));
  class VectorStores extends APIResource {
    constructor() {
      super(...arguments);
      this.files = new Files$1(this._client);
      this.fileBatches = new FileBatches(this._client);
    }
    /**
     * Create a vector store.
     */
    create(body, options) {
      return this._client.post("/vector_stores", {
        body,
        ...options,
        headers: { "OpenAI-Beta": "assistants=v2", ...options == null ? void 0 : options.headers }
      });
    }
    /**
     * Retrieves a vector store.
     */
    retrieve(vectorStoreId, options) {
      return this._client.get(`/vector_stores/${vectorStoreId}`, {
        ...options,
        headers: { "OpenAI-Beta": "assistants=v2", ...options == null ? void 0 : options.headers }
      });
    }
    /**
     * Modifies a vector store.
     */
    update(vectorStoreId, body, options) {
      return this._client.post(`/vector_stores/${vectorStoreId}`, {
        body,
        ...options,
        headers: { "OpenAI-Beta": "assistants=v2", ...options == null ? void 0 : options.headers }
      });
    }
    list(query = {}, options) {
      if (isRequestOptions(query)) {
        return this.list({}, query);
      }
      return this._client.getAPIList("/vector_stores", VectorStoresPage, {
        query,
        ...options,
        headers: { "OpenAI-Beta": "assistants=v2", ...options == null ? void 0 : options.headers }
      });
    }
    /**
     * Delete a vector store.
     */
    del(vectorStoreId, options) {
      return this._client.delete(`/vector_stores/${vectorStoreId}`, {
        ...options,
        headers: { "OpenAI-Beta": "assistants=v2", ...options == null ? void 0 : options.headers }
      });
    }
  }
  class VectorStoresPage extends CursorPage {
  }
  (function(VectorStores2) {
    VectorStores2.VectorStoresPage = VectorStoresPage;
    VectorStores2.Files = Files$1;
    VectorStores2.VectorStoreFilesPage = VectorStoreFilesPage;
    VectorStores2.FileBatches = FileBatches;
  })(VectorStores || (VectorStores = {}));
  class Beta extends APIResource {
    constructor() {
      super(...arguments);
      this.vectorStores = new VectorStores(this._client);
      this.chat = new Chat(this._client);
      this.assistants = new Assistants(this._client);
      this.threads = new Threads(this._client);
    }
  }
  (function(Beta2) {
    Beta2.VectorStores = VectorStores;
    Beta2.VectorStoresPage = VectorStoresPage;
    Beta2.Chat = Chat;
    Beta2.Assistants = Assistants;
    Beta2.AssistantsPage = AssistantsPage;
    Beta2.Threads = Threads;
  })(Beta || (Beta = {}));
  class Completions extends APIResource {
    create(body, options) {
      return this._client.post("/completions", { body, ...options, stream: body.stream ?? false });
    }
  }
  /* @__PURE__ */ (function(Completions2) {
  })(Completions || (Completions = {}));
  class Embeddings extends APIResource {
    /**
     * Creates an embedding vector representing the input text.
     */
    create(body, options) {
      return this._client.post("/embeddings", { body, ...options });
    }
  }
  /* @__PURE__ */ (function(Embeddings2) {
  })(Embeddings || (Embeddings = {}));
  class Files extends APIResource {
    /**
     * Upload a file that can be used across various endpoints. Individual files can be
     * up to 512 MB, and the size of all files uploaded by one organization can be up
     * to 100 GB.
     *
     * The Assistants API supports files up to 2 million tokens and of specific file
     * types. See the
     * [Assistants Tools guide](https://platform.openai.com/docs/assistants/tools) for
     * details.
     *
     * The Fine-tuning API only supports `.jsonl` files. The input also has certain
     * required formats for fine-tuning
     * [chat](https://platform.openai.com/docs/api-reference/fine-tuning/chat-input) or
     * [completions](https://platform.openai.com/docs/api-reference/fine-tuning/completions-input)
     * models.
     *
     * The Batch API only supports `.jsonl` files up to 100 MB in size. The input also
     * has a specific required
     * [format](https://platform.openai.com/docs/api-reference/batch/request-input).
     *
     * Please [contact us](https://help.openai.com/) if you need to increase these
     * storage limits.
     */
    create(body, options) {
      return this._client.post("/files", multipartFormRequestOptions({ body, ...options }));
    }
    /**
     * Returns information about a specific file.
     */
    retrieve(fileId, options) {
      return this._client.get(`/files/${fileId}`, options);
    }
    list(query = {}, options) {
      if (isRequestOptions(query)) {
        return this.list({}, query);
      }
      return this._client.getAPIList("/files", FileObjectsPage, { query, ...options });
    }
    /**
     * Delete a file.
     */
    del(fileId, options) {
      return this._client.delete(`/files/${fileId}`, options);
    }
    /**
     * Returns the contents of the specified file.
     */
    content(fileId, options) {
      return this._client.get(`/files/${fileId}/content`, { ...options, __binaryResponse: true });
    }
    /**
     * Returns the contents of the specified file.
     *
     * @deprecated The `.content()` method should be used instead
     */
    retrieveContent(fileId, options) {
      return this._client.get(`/files/${fileId}/content`, {
        ...options,
        headers: { Accept: "application/json", ...options == null ? void 0 : options.headers }
      });
    }
    /**
     * Waits for the given file to be processed, default timeout is 30 mins.
     */
    async waitForProcessing(id, { pollInterval = 5e3, maxWait = 30 * 60 * 1e3 } = {}) {
      const TERMINAL_STATES = /* @__PURE__ */ new Set(["processed", "error", "deleted"]);
      const start = Date.now();
      let file = await this.retrieve(id);
      while (!file.status || !TERMINAL_STATES.has(file.status)) {
        await sleep(pollInterval);
        file = await this.retrieve(id);
        if (Date.now() - start > maxWait) {
          throw new APIConnectionTimeoutError({
            message: `Giving up on waiting for file ${id} to finish processing after ${maxWait} milliseconds.`
          });
        }
      }
      return file;
    }
  }
  class FileObjectsPage extends Page {
  }
  (function(Files2) {
    Files2.FileObjectsPage = FileObjectsPage;
  })(Files || (Files = {}));
  class Checkpoints extends APIResource {
    list(fineTuningJobId, query = {}, options) {
      if (isRequestOptions(query)) {
        return this.list(fineTuningJobId, {}, query);
      }
      return this._client.getAPIList(`/fine_tuning/jobs/${fineTuningJobId}/checkpoints`, FineTuningJobCheckpointsPage, { query, ...options });
    }
  }
  class FineTuningJobCheckpointsPage extends CursorPage {
  }
  (function(Checkpoints2) {
    Checkpoints2.FineTuningJobCheckpointsPage = FineTuningJobCheckpointsPage;
  })(Checkpoints || (Checkpoints = {}));
  class Jobs extends APIResource {
    constructor() {
      super(...arguments);
      this.checkpoints = new Checkpoints(this._client);
    }
    /**
     * Creates a fine-tuning job which begins the process of creating a new model from
     * a given dataset.
     *
     * Response includes details of the enqueued job including job status and the name
     * of the fine-tuned models once complete.
     *
     * [Learn more about fine-tuning](https://platform.openai.com/docs/guides/fine-tuning)
     */
    create(body, options) {
      return this._client.post("/fine_tuning/jobs", { body, ...options });
    }
    /**
     * Get info about a fine-tuning job.
     *
     * [Learn more about fine-tuning](https://platform.openai.com/docs/guides/fine-tuning)
     */
    retrieve(fineTuningJobId, options) {
      return this._client.get(`/fine_tuning/jobs/${fineTuningJobId}`, options);
    }
    list(query = {}, options) {
      if (isRequestOptions(query)) {
        return this.list({}, query);
      }
      return this._client.getAPIList("/fine_tuning/jobs", FineTuningJobsPage, { query, ...options });
    }
    /**
     * Immediately cancel a fine-tune job.
     */
    cancel(fineTuningJobId, options) {
      return this._client.post(`/fine_tuning/jobs/${fineTuningJobId}/cancel`, options);
    }
    listEvents(fineTuningJobId, query = {}, options) {
      if (isRequestOptions(query)) {
        return this.listEvents(fineTuningJobId, {}, query);
      }
      return this._client.getAPIList(`/fine_tuning/jobs/${fineTuningJobId}/events`, FineTuningJobEventsPage, {
        query,
        ...options
      });
    }
  }
  class FineTuningJobsPage extends CursorPage {
  }
  class FineTuningJobEventsPage extends CursorPage {
  }
  (function(Jobs2) {
    Jobs2.FineTuningJobsPage = FineTuningJobsPage;
    Jobs2.FineTuningJobEventsPage = FineTuningJobEventsPage;
    Jobs2.Checkpoints = Checkpoints;
    Jobs2.FineTuningJobCheckpointsPage = FineTuningJobCheckpointsPage;
  })(Jobs || (Jobs = {}));
  class FineTuning extends APIResource {
    constructor() {
      super(...arguments);
      this.jobs = new Jobs(this._client);
    }
  }
  (function(FineTuning2) {
    FineTuning2.Jobs = Jobs;
    FineTuning2.FineTuningJobsPage = FineTuningJobsPage;
    FineTuning2.FineTuningJobEventsPage = FineTuningJobEventsPage;
  })(FineTuning || (FineTuning = {}));
  class Images extends APIResource {
    /**
     * Creates a variation of a given image.
     */
    createVariation(body, options) {
      return this._client.post("/images/variations", multipartFormRequestOptions({ body, ...options }));
    }
    /**
     * Creates an edited or extended image given an original image and a prompt.
     */
    edit(body, options) {
      return this._client.post("/images/edits", multipartFormRequestOptions({ body, ...options }));
    }
    /**
     * Creates an image given a prompt.
     */
    generate(body, options) {
      return this._client.post("/images/generations", { body, ...options });
    }
  }
  /* @__PURE__ */ (function(Images2) {
  })(Images || (Images = {}));
  class Models extends APIResource {
    /**
     * Retrieves a model instance, providing basic information about the model such as
     * the owner and permissioning.
     */
    retrieve(model, options) {
      return this._client.get(`/models/${model}`, options);
    }
    /**
     * Lists the currently available models, and provides basic information about each
     * one such as the owner and availability.
     */
    list(options) {
      return this._client.getAPIList("/models", ModelsPage, options);
    }
    /**
     * Delete a fine-tuned model. You must have the Owner role in your organization to
     * delete a model.
     */
    del(model, options) {
      return this._client.delete(`/models/${model}`, options);
    }
  }
  class ModelsPage extends Page {
  }
  (function(Models2) {
    Models2.ModelsPage = ModelsPage;
  })(Models || (Models = {}));
  class Moderations extends APIResource {
    /**
     * Classifies if text and/or image inputs are potentially harmful. Learn more in
     * the [moderation guide](https://platform.openai.com/docs/guides/moderation).
     */
    create(body, options) {
      return this._client.post("/moderations", { body, ...options });
    }
  }
  /* @__PURE__ */ (function(Moderations2) {
  })(Moderations || (Moderations = {}));
  class Parts extends APIResource {
    /**
     * Adds a
     * [Part](https://platform.openai.com/docs/api-reference/uploads/part-object) to an
     * [Upload](https://platform.openai.com/docs/api-reference/uploads/object) object.
     * A Part represents a chunk of bytes from the file you are trying to upload.
     *
     * Each Part can be at most 64 MB, and you can add Parts until you hit the Upload
     * maximum of 8 GB.
     *
     * It is possible to add multiple Parts in parallel. You can decide the intended
     * order of the Parts when you
     * [complete the Upload](https://platform.openai.com/docs/api-reference/uploads/complete).
     */
    create(uploadId, body, options) {
      return this._client.post(`/uploads/${uploadId}/parts`, multipartFormRequestOptions({ body, ...options }));
    }
  }
  /* @__PURE__ */ (function(Parts2) {
  })(Parts || (Parts = {}));
  class Uploads extends APIResource {
    constructor() {
      super(...arguments);
      this.parts = new Parts(this._client);
    }
    /**
     * Creates an intermediate
     * [Upload](https://platform.openai.com/docs/api-reference/uploads/object) object
     * that you can add
     * [Parts](https://platform.openai.com/docs/api-reference/uploads/part-object) to.
     * Currently, an Upload can accept at most 8 GB in total and expires after an hour
     * after you create it.
     *
     * Once you complete the Upload, we will create a
     * [File](https://platform.openai.com/docs/api-reference/files/object) object that
     * contains all the parts you uploaded. This File is usable in the rest of our
     * platform as a regular File object.
     *
     * For certain `purpose`s, the correct `mime_type` must be specified. Please refer
     * to documentation for the supported MIME types for your use case:
     *
     * - [Assistants](https://platform.openai.com/docs/assistants/tools/file-search/supported-files)
     *
     * For guidance on the proper filename extensions for each purpose, please follow
     * the documentation on
     * [creating a File](https://platform.openai.com/docs/api-reference/files/create).
     */
    create(body, options) {
      return this._client.post("/uploads", { body, ...options });
    }
    /**
     * Cancels the Upload. No Parts may be added after an Upload is cancelled.
     */
    cancel(uploadId, options) {
      return this._client.post(`/uploads/${uploadId}/cancel`, options);
    }
    /**
     * Completes the
     * [Upload](https://platform.openai.com/docs/api-reference/uploads/object).
     *
     * Within the returned Upload object, there is a nested
     * [File](https://platform.openai.com/docs/api-reference/files/object) object that
     * is ready to use in the rest of the platform.
     *
     * You can specify the order of the Parts by passing in an ordered list of the Part
     * IDs.
     *
     * The number of bytes uploaded upon completion must match the number of bytes
     * initially specified when creating the Upload object. No Parts may be added after
     * an Upload is completed.
     */
    complete(uploadId, body, options) {
      return this._client.post(`/uploads/${uploadId}/complete`, { body, ...options });
    }
  }
  (function(Uploads2) {
    Uploads2.Parts = Parts;
  })(Uploads || (Uploads = {}));
  var _a;
  class OpenAI extends APIClient {
    /**
     * API Client for interfacing with the OpenAI API.
     *
     * @param {string | undefined} [opts.apiKey=process.env['OPENAI_API_KEY'] ?? undefined]
     * @param {string | null | undefined} [opts.organization=process.env['OPENAI_ORG_ID'] ?? null]
     * @param {string | null | undefined} [opts.project=process.env['OPENAI_PROJECT_ID'] ?? null]
     * @param {string} [opts.baseURL=process.env['OPENAI_BASE_URL'] ?? https://api.openai.com/v1] - Override the default base URL for the API.
     * @param {number} [opts.timeout=10 minutes] - The maximum amount of time (in milliseconds) the client will wait for a response before timing out.
     * @param {number} [opts.httpAgent] - An HTTP agent used to manage HTTP(s) connections.
     * @param {Core.Fetch} [opts.fetch] - Specify a custom `fetch` function implementation.
     * @param {number} [opts.maxRetries=2] - The maximum number of times the client will retry a request.
     * @param {Core.Headers} opts.defaultHeaders - Default headers to include with every request to the API.
     * @param {Core.DefaultQuery} opts.defaultQuery - Default query parameters to include with every request to the API.
     * @param {boolean} [opts.dangerouslyAllowBrowser=false] - By default, client-side use of this library is not allowed, as it risks exposing your secret API credentials to attackers.
     */
    constructor({ baseURL = readEnv("OPENAI_BASE_URL"), apiKey = readEnv("OPENAI_API_KEY"), organization = readEnv("OPENAI_ORG_ID") ?? null, project = readEnv("OPENAI_PROJECT_ID") ?? null, ...opts } = {}) {
      if (apiKey === void 0) {
        throw new OpenAIError("The OPENAI_API_KEY environment variable is missing or empty; either provide it, or instantiate the OpenAI client with an apiKey option, like new OpenAI({ apiKey: 'My API Key' }).");
      }
      const options = {
        apiKey,
        organization,
        project,
        ...opts,
        baseURL: baseURL || `https://api.openai.com/v1`
      };
      if (!options.dangerouslyAllowBrowser && isRunningInBrowser()) {
        throw new OpenAIError("It looks like you're running in a browser-like environment.\n\nThis is disabled by default, as it risks exposing your secret API credentials to attackers.\nIf you understand the risks and have appropriate mitigations in place,\nyou can set the `dangerouslyAllowBrowser` option to `true`, e.g.,\n\nnew OpenAI({ apiKey, dangerouslyAllowBrowser: true });\n\nhttps://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety\n");
      }
      super({
        baseURL: options.baseURL,
        timeout: options.timeout ?? 6e5,
        httpAgent: options.httpAgent,
        maxRetries: options.maxRetries,
        fetch: options.fetch
      });
      this.completions = new Completions(this);
      this.chat = new Chat$1(this);
      this.embeddings = new Embeddings(this);
      this.files = new Files(this);
      this.images = new Images(this);
      this.audio = new Audio(this);
      this.moderations = new Moderations(this);
      this.models = new Models(this);
      this.fineTuning = new FineTuning(this);
      this.beta = new Beta(this);
      this.batches = new Batches(this);
      this.uploads = new Uploads(this);
      this._options = options;
      this.apiKey = apiKey;
      this.organization = organization;
      this.project = project;
    }
    defaultQuery() {
      return this._options.defaultQuery;
    }
    defaultHeaders(opts) {
      return {
        ...super.defaultHeaders(opts),
        "OpenAI-Organization": this.organization,
        "OpenAI-Project": this.project,
        ...this._options.defaultHeaders
      };
    }
    authHeaders(opts) {
      return { Authorization: `Bearer ${this.apiKey}` };
    }
    stringifyQuery(query) {
      return stringify(query, { arrayFormat: "brackets" });
    }
  }
  _a = OpenAI;
  OpenAI.OpenAI = _a;
  OpenAI.DEFAULT_TIMEOUT = 6e5;
  OpenAI.OpenAIError = OpenAIError;
  OpenAI.APIError = APIError;
  OpenAI.APIConnectionError = APIConnectionError;
  OpenAI.APIConnectionTimeoutError = APIConnectionTimeoutError;
  OpenAI.APIUserAbortError = APIUserAbortError;
  OpenAI.NotFoundError = NotFoundError;
  OpenAI.ConflictError = ConflictError;
  OpenAI.RateLimitError = RateLimitError;
  OpenAI.BadRequestError = BadRequestError;
  OpenAI.AuthenticationError = AuthenticationError;
  OpenAI.InternalServerError = InternalServerError;
  OpenAI.PermissionDeniedError = PermissionDeniedError;
  OpenAI.UnprocessableEntityError = UnprocessableEntityError;
  OpenAI.toFile = toFile;
  OpenAI.fileFromPath = fileFromPath;
  (function(OpenAI2) {
    OpenAI2.Page = Page;
    OpenAI2.CursorPage = CursorPage;
    OpenAI2.Completions = Completions;
    OpenAI2.Chat = Chat$1;
    OpenAI2.Embeddings = Embeddings;
    OpenAI2.Files = Files;
    OpenAI2.FileObjectsPage = FileObjectsPage;
    OpenAI2.Images = Images;
    OpenAI2.Audio = Audio;
    OpenAI2.Moderations = Moderations;
    OpenAI2.Models = Models;
    OpenAI2.ModelsPage = ModelsPage;
    OpenAI2.FineTuning = FineTuning;
    OpenAI2.Beta = Beta;
    OpenAI2.Batches = Batches;
    OpenAI2.BatchesPage = BatchesPage;
    OpenAI2.Uploads = Uploads;
  })(OpenAI || (OpenAI = {}));
  const OpenAI$1 = OpenAI;
  const openaiClient = new OpenAI$1({
    apiKey: "",
    // Loaded from settings when doing requests
    dangerouslyAllowBrowser: true
  });
  const bdApi = new BdApi("TranscribeVoiceNotes");
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchInterval: Infinity,
        retry: false,
        staleTime: Infinity,
        cacheTime: Infinity
      }
    }
  });
  const CACHE_KEY = `transcriptionCache`;
  const SETTINGS_KEY = `settings`;
  const loadTranscription = (itemId) => {
    const transcriptionCache = bdApi.Data.load(CACHE_KEY);
    if (transcriptionCache) {
      return transcriptionCache[itemId];
    }
  };
  const saveTranscription = (itemId, transcription) => {
    const transcriptionCache = bdApi.Data.load(CACHE_KEY) ?? {};
    transcriptionCache[itemId] = transcription;
    bdApi.Data.save(CACHE_KEY, transcriptionCache);
  };
  const clearTranscriptionCache = () => {
    bdApi.Data.save(CACHE_KEY, {});
  };
  const loadSettings = () => {
    const savedSettings = bdApi.Data.load(SETTINGS_KEY) ?? {};
    const defaultSettings = {
      api: {
        type: "openai",
        baseUrl: void 0,
        token: "",
        model: "whisper-1"
      }
    };
    let category;
    for (category in defaultSettings) {
      Object.assign(defaultSettings[category], savedSettings[category]);
    }
    return defaultSettings;
  };
  const saveSetting = (category, id, value) => {
    if (category === "api" && id === "baseUrl" && value === "") {
      value = void 0;
    }
    const settings = bdApi.Data.load(SETTINGS_KEY) ?? {};
    if (settings[category] === void 0) {
      settings[category] = {};
    }
    settings[category][id] = value;
    bdApi.Data.save(SETTINGS_KEY, settings);
  };
  const buttonStyle = {
    height: "var(--custom-button-button-sm-height)",
    transition: "background-color var(--custom-button-transition-duration) ease, color var(--custom-button-transition-duration) ease",
    padding: "2px 16px",
    borderRadius: "3px",
    border: "none",
    fontSize: 14,
    lineHeight: "16px",
    backgroundColor: "var(--brand-500)",
    color: "var(--white-500)"
  };
  const TranscribeButton = ({ item }) => {
    if (item.type !== "AUDIO") {
      return /* @__PURE__ */ BdApi.React.createElement(React.Fragment, null);
    }
    const [transcription, setTranscription] = React.useState(
      loadTranscription(item.uniqueId)
    );
    const transcribeItem = React.useCallback(async () => {
      console.log("Transcribing item", item);
      const settings = loadSettings();
      if (settings.api.baseUrl === void 0 && settings.api.token === "") {
        BdApi.UI.alert(
          "Invalid configuration",
          "Please configure your API access in the plugin settings."
        );
        return;
      }
      const voiceNoteResponse = await fetch(item.originalItem.proxy_url);
      const voiceNoteBlob = await voiceNoteResponse.blob();
      const voiceNoteFile = new File([voiceNoteBlob], item.originalItem.filename);
      openaiClient.baseURL = settings.api.baseUrl ?? "https://api.openai.com/v1";
      openaiClient.apiKey = settings.api.token;
      const openaiResponse = await openaiClient.audio.transcriptions.create({
        file: voiceNoteFile,
        model: settings.api.model
      });
      saveTranscription(item.uniqueId, openaiResponse.text);
      setTranscription(openaiResponse.text);
      return openaiResponse.text;
    }, [item]);
    const { isLoading, isError, failureReason, mutate } = useMutation(
      ["transcribe", item.uniqueId],
      transcribeItem
    );
    return /* @__PURE__ */ BdApi.React.createElement(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          gap: "8px"
        }
      },
      /* @__PURE__ */ BdApi.React.createElement(
        "p",
        {
          style: {
            margin: 0,
            color: "var(--text-normal)",
            lineHeight: "1.375rem",
            wordWrap: "break-word",
            whiteSpace: "break-spaces"
          }
        },
        isError && /* @__PURE__ */ BdApi.React.createElement(React.Fragment, null, "Error: ", /* @__PURE__ */ BdApi.React.createElement("br", null), /* @__PURE__ */ BdApi.React.createElement(
          "pre",
          {
            style: {
              fontFamily: '"Mononoki Nerd Font", Consolas, monospace',
              whiteSpace: "pre-wrap"
            }
          },
          JSON.stringify(failureReason, null, 2)
        )),
        transcription
      ),
      transcription === void 0 && /* @__PURE__ */ BdApi.React.createElement(
        "button",
        {
          onClick: () => mutate(),
          style: buttonStyle,
          disabled: isLoading
        },
        isLoading ? "Transcribing..." : "Transcribe"
      )
    );
  };
  const WithTranscribeButton = ({
    children,
    item
  }) => {
    return /* @__PURE__ */ BdApi.React.createElement(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          gap: "8px"
        }
      },
      /* @__PURE__ */ BdApi.React.createElement("div", null, children),
      /* @__PURE__ */ BdApi.React.createElement(QueryClientProvider, { client: queryClient }, /* @__PURE__ */ BdApi.React.createElement(TranscribeButton, { item }))
    );
  };
  const SettingsPanel = () => {
    const currentSettings = loadSettings();
    const settingsPanelConfig = makeSettingsPanelConfig(currentSettings);
    const handleClearCache = () => {
      clearTranscriptionCache();
      BdApi.UI.alert(
        "Success",
        "The transcription cache has been successfully cleared."
      );
    };
    const panel = BdApi.UI.buildSettingsPanel({
      settings: settingsPanelConfig,
      // @ts-expect-error - TODO: Proper typing would require validation
      onChange: (category, id, value) => saveSetting(category, id, value)
    });
    return /* @__PURE__ */ BdApi.React.createElement(React.Fragment, null, panel, /* @__PURE__ */ BdApi.React.createElement("button", { style: buttonStyle, onClick: handleClearCache }, "Clear transcription cache"));
  };
  function makeSettingsPanelConfig(currentSettings) {
    return [
      {
        type: "category",
        id: "api",
        name: "API Settings",
        collapsible: true,
        settings: [
          {
            type: "dropdown",
            id: "api-type",
            name: "API Type",
            note: "Currently, only OpenAI or compatible is supported.",
            value: currentSettings.api.type,
            disabled: true,
            options: [{ label: "OpenAI", value: "openai" }]
          },
          {
            type: "text",
            id: "baseUrl",
            name: "Base URL",
            note: "The base URL of the API. Leave empty for default.",
            value: currentSettings.api.baseUrl ?? ""
          },
          {
            type: "text",
            id: "token",
            name: "Token",
            note: "The token to use for the API. Will be stored unencrypted on your computer. Required.",
            value: currentSettings.api.token
          },
          {
            type: "text",
            id: "model",
            name: "Model",
            note: 'The model to use. OpenAI currently supports "whisper-1", "gpt-4o-mini-transcribe" and "gpt-4o-transcribe".',
            value: currentSettings.api.model
          }
        ]
      }
    ];
  }
  class TranscribeVoiceNotes {
    constructor(meta) {
      __publicField(this, "meta");
      this.meta = meta;
    }
    start() {
      var _a2;
      bdApi.Data.save("version", this.meta.version);
      const voiceNoteFilter = bdApi.Webpack.Filters.byStrings(
        ".duration_secs",
        ".waveform",
        ".url"
      );
      const VoiceNoteComponent = bdApi.Webpack.getModule(voiceNoteFilter, {
        searchExports: true
      });
      const VoiceNoteModule = bdApi.Webpack.getModule(
        (m) => Object.values(m).includes(VoiceNoteComponent)
      );
      const voiceNoteComponentKey = (_a2 = Object.entries(VoiceNoteModule).find(
        ([key, value]) => value === VoiceNoteComponent
      )) == null ? void 0 : _a2[0];
      if (!voiceNoteComponentKey) {
        console.error("Could not find voiceNoteComponentKey");
        return;
      }
      bdApi.Patcher.instead(
        VoiceNoteModule,
        voiceNoteComponentKey,
        (thisObject, methodArguments, OriginalComponent) => {
          const originalNode = OriginalComponent(...methodArguments);
          try {
            const props = methodArguments[0];
            if (!("item" in props)) {
              return originalNode;
            }
            const item = props["item"];
            return /* @__PURE__ */ BdApi.React.createElement(WithTranscribeButton, { item }, originalNode);
          } catch (e) {
            console.error(e);
            return originalNode;
          }
        }
      );
    }
    stop() {
      bdApi.Patcher.unpatchAll();
    }
    getSettingsPanel() {
      return SettingsPanel;
    }
  }
  module.exports = TranscribeVoiceNotes;
})(BdApi.React);
