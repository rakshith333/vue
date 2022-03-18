import NProgress from "nprogress";
import { defineComponent, ref, onMounted, createApp, useSSRContext, mergeProps, withCtx, createVNode, toDisplayString, createTextVNode, resolveComponent, openBlock, createBlock, createElementBlock, createElementVNode, unref } from "vue";
import { createRouter, createMemoryHistory, useRouter } from "vue-router";
import { renderToString } from "@vue/server-renderer";
import { renderHeadToString, createHead, useHead } from "@vueuse/head";
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderAttr, ssrRenderSlot, ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import { useI18n, createI18n } from "vue-i18n";
import TWEEN from "tween";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { library, icon } from "@fortawesome/fontawesome-svg-core";
const install = ({ isClient, router }) => {
  if (isClient) {
    router.beforeEach(() => {
      NProgress.start();
    });
    router.afterEach(() => {
      NProgress.done();
    });
  }
};
var __glob_7_0 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  install
});
var windi = "";
var main$1 = "";
const S = "/";
function withPrefix(string, prefix) {
  return string.startsWith(prefix) ? string : prefix + string;
}
function withoutPrefix(string, prefix) {
  return string.startsWith(prefix) ? string.slice(prefix.length) : string;
}
function withSuffix(string, suffix) {
  return string.endsWith(suffix) ? string : string + suffix;
}
function withoutSuffix(string, suffix) {
  return string.endsWith(suffix) ? string.slice(0, -1 * suffix.length) : string;
}
function createUrl(urlLike) {
  if (typeof urlLike === "string" && !(urlLike || "").includes("://")) {
    urlLike = "http://e.g" + withPrefix(urlLike, S);
  }
  return new URL(urlLike.toString());
}
function getFullPath(url, routeBase) {
  url = createUrl(url);
  url.pathname = withSuffix(url.pathname, S);
  let fullPath = withoutPrefix(url.href, url.origin);
  if (routeBase) {
    routeBase = withSuffix(withPrefix(routeBase, S), S);
    if (fullPath.indexOf(routeBase) === 0) {
      fullPath = withPrefix(fullPath.replace(routeBase, ""), S);
    }
  }
  return fullPath;
}
function addPagePropsGetterToRoutes(routes2) {
  routes2.forEach((staticRoute) => {
    const originalProps = staticRoute.props;
    staticRoute.props = (route) => {
      const resolvedProps = originalProps === true ? route.params : typeof originalProps === "function" ? originalProps(route) : originalProps;
      return {
        ...(route.meta.hmr || {}).value,
        ...route.meta.state || {},
        ...resolvedProps || {}
      };
    };
  });
}
function defer() {
  const deferred = { status: "pending" };
  deferred.promise = new Promise((resolve, reject) => {
    deferred.resolve = (value) => {
      deferred.status = "resolved";
      return resolve(value);
    };
    deferred.reject = (error) => {
      deferred.status = "rejected";
      return reject(error);
    };
  });
  return deferred;
}
const isRedirect = ({ status = 0 }) => status >= 300 && status < 400;
function useSsrResponse() {
  const deferred = defer();
  let response = {};
  const writeResponse = (params) => {
    Object.assign(response, params);
    if (isRedirect(params)) {
      deferred.resolve(response);
    }
  };
  return {
    deferred,
    response,
    writeResponse,
    isRedirect: () => isRedirect(response),
    redirect: (location, status = 302) => writeResponse({ headers: { location }, status })
  };
}
const UNSAFE_CHARS_REGEXP = /[<>\/\u2028\u2029]/g;
const ESCAPED_CHARS = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
function escapeUnsafeChars(unsafeChar) {
  return ESCAPED_CHARS[unsafeChar];
}
function serializeState(state) {
  try {
    state = JSON.stringify(state || {}).replace(/\\/g, String.raw`\\`).replace(/'/g, String.raw`\'`).replace(UNSAFE_CHARS_REGEXP, escapeUnsafeChars);
    return `'${state}'`;
  } catch (error) {
    console.error("[SSR] On state serialization -", error, state);
    return "{}";
  }
}
function findDependencies(modules, manifest) {
  const files = new Set();
  for (const id of modules || []) {
    for (const file of manifest[id] || []) {
      files.add(file);
    }
  }
  return [...files];
}
function renderPreloadLinks(files) {
  let link = "";
  for (const file of files || []) {
    if (file.endsWith(".js")) {
      link += `<link rel="modulepreload" crossorigin href="${file}">`;
    } else if (file.endsWith(".css")) {
      link += `<link rel="stylesheet" href="${file}">`;
    }
  }
  return link;
}
const containerId = "app";
const containerRE = new RegExp(`<div id="${containerId}"([\\s\\w\\-"'=[\\]]*)><\\/div>`);
function buildHtmlDocument(template, { htmlAttrs, bodyAttrs, headTags, body, initialState }) {
  if (htmlAttrs) {
    template = template.replace("<html", `<html ${htmlAttrs} `);
  }
  if (bodyAttrs) {
    template = template.replace("<body", `<body ${bodyAttrs} `);
  }
  if (headTags) {
    template = template.replace("</head>", `
${headTags}
</head>`);
  }
  return template.replace(containerRE, (_, d1) => `<div id="${containerId}" data-server-rendered="true"${d1 || ""}>${body || ""}</div>

  <script>window.__INITIAL_STATE__=${initialState || "'{}'"}<\/script>`);
}
const getEmptyHtmlParts = () => ({
  headTags: "",
  htmlAttrs: "",
  bodyAttrs: "",
  body: "",
  initialState: void 0,
  dependencies: []
});
const viteSSR$1 = function viteSSR(options, hook) {
  const renderer2 = hook || options;
  const { transformState = serializeState } = options;
  return async function(url, {
    manifest,
    preload = false,
    skip = false,
    template = `<!DOCTYPE html>
<html lang="en">
<head>


<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-52JJBQP');<\/script>
  <!-- End Google Tag Manager -->


  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- <link rel="icon" href="/LogoSolidCorrected.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/LogoSolidCorrected.svg">
  <link rel="mask-icon" href="/LogoSolidCorrected.svg" color="#00aba9"> -->
  <link id="fevitag" rel="icon" href="/assets/favicon.b95fd6ae.svg" type="image/svg+xml">
  <link id="fevitag" rel="apple-touch-icon" href="/assets/favicon.b95fd6ae.svg">
  <link id="fevitag" rel="mask-icon" href="/assets/favicon.b95fd6ae.svg" color="#00aba9">
  <meta name="msapplication-TileColor" content="#00aba9">
  <meta name="theme-color" content="#ffffff">

  <!-- <script src = "https://cdn.jsdelivr.net/npm/three@0.136.0/build/three.min.js" > <\/script>
  <script src = "https://cdn.jsdelivr.net/npm/three@0.136.0/examples/js/controls/OrbitControls.js">  <\/script>
  <script src = "https://cdn.jsdelivr.net/npm/three@0.136.0/examples/js/loaders/DRACOLoader.js">  <\/script>
  <script src = "https://cdn.jsdelivr.net/npm/three@0.136.0/examples/js/loaders/GLTFLoader.js">  <\/script> -->


  <script type="module" crossorigin src="/assets/index.96818c55.js"><\/script>
  <link rel="modulepreload" href="/assets/vendor.f537fa13.js">
  <link rel="stylesheet" href="/assets/index.6f423984.css">
<link rel="manifest" href="/manifest.webmanifest"></head>
<body>



  <!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-52JJBQP"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->


  <div id="app"></div>
  <script>
    (function() {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      // console.log(prefersDark);
    //   const faviconTag = document.getElementById("fevitag");
    //   const changeFavicon = () => {
    //   if (prefersDark) {
    //     // console.log("dark"); 
    //     faviconTag.href = '/LogoSolidCorrectedDark.svg';
    //   }
    //   else {
    //     // console.log("light"); 
    //     faviconTag.href = '/LogoSolidCorrected.svg';
    //   }
    // };
    // changeFavicon();
      const setting = localStorage.getItem('color-schema') || 'auto'
      if (setting === 'dark' || (prefersDark && setting !== 'light'))
        document.documentElement.classList.toggle('dark', true)
    })()
  <\/script>
  
</body>
</html>
`,
    ...extra
  } = {}) {
    if (skip) {
      return { html: template, ...getEmptyHtmlParts() };
    }
    url = createUrl(url);
    const { deferred, response, writeResponse, redirect, isRedirect: isRedirect2 } = useSsrResponse();
    const context = {
      url,
      isClient: false,
      initialState: {},
      redirect,
      writeResponse,
      ...extra
    };
    const payload = await Promise.race([
      renderer2(context, { ...extra, isRedirect: isRedirect2 }),
      deferred.promise
    ]);
    if (isRedirect2())
      return response;
    const htmlParts = {
      ...getEmptyHtmlParts(),
      ...payload,
      initialState: await transformState(context.initialState || {}, serializeState)
    };
    if (manifest) {
      htmlParts.dependencies = findDependencies(context.modules, manifest);
      if (preload && htmlParts.dependencies.length > 0) {
        htmlParts.headTags += renderPreloadLinks(htmlParts.dependencies);
      }
    }
    return {
      html: buildHtmlDocument(template, htmlParts),
      ...htmlParts,
      ...response
    };
  };
};
const ClientOnly = defineComponent({
  name: "ClientOnly",
  setup(_, { slots }) {
    const show = ref(false);
    onMounted(() => {
      show.value = true;
    });
    return () => show.value && slots.default ? slots.default() : null;
  }
});
const CONTEXT_SYMBOL = Symbol();
function provideContext(app, context) {
  app.provide(CONTEXT_SYMBOL, context);
}
const viteSSR2 = function viteSSR3(App, { routes: routes2, base, routerOptions = {}, pageProps = { passToPage: true }, ...options }, hook) {
  if (pageProps && pageProps.passToPage) {
    addPagePropsGetterToRoutes(routes2);
  }
  return viteSSR$1(options, async (context, { isRedirect: isRedirect2, ...extra }) => {
    const app = createApp(App);
    const routeBase = base && withoutSuffix(base(context), "/");
    const router = createRouter({
      ...routerOptions,
      history: createMemoryHistory(routeBase),
      routes: routes2
    });
    router.beforeEach((to) => {
      to.meta.state = extra.initialState || null;
    });
    provideContext(app, context);
    const fullPath = getFullPath(context.url, routeBase);
    const { head } = hook && await hook({
      app,
      router,
      initialRoute: router.resolve(fullPath),
      ...context
    }) || {};
    app.use(router);
    router.push(fullPath);
    await router.isReady();
    if (isRedirect2())
      return {};
    Object.assign(context.initialState || {}, (router.currentRoute.value.meta || {}).state || {});
    const body = await renderToString(app, context);
    if (isRedirect2())
      return {};
    const { headTags = "", htmlAttrs = "", bodyAttrs = "" } = head ? renderHeadToString(head) : {};
    return { body, headTags, htmlAttrs, bodyAttrs };
  });
};
const PROPS_PREFIX = "/props";
function findRoutePropsGetter(route) {
  const { meta = {} } = route;
  if (meta.propsGetter === false) {
    return false;
  }
  let getter;
  if (meta.propsGetter) {
    getter = meta.propsGetter instanceof Function ? meta.propsGetter(route) : meta.propsGetter;
  }
  getter = getter || route.name;
  return getter ? PROPS_PREFIX + "/" + getter : false;
}
function buildPropsRoute(route) {
  const propsGetter = findRoutePropsGetter(route);
  if (!propsGetter || !"|hi-name|home|".includes(`|${propsGetter.slice(PROPS_PREFIX.length + 1)}|`)) {
    return null;
  }
  const { matched: _1, meta: _2, redirectedFrom: _3, ...data } = route;
  const url = createUrl(route.href || route.fullPath);
  url.pathname = PROPS_PREFIX + url.pathname;
  const fullPath = getFullPath(url);
  return {
    ...data,
    propsGetter,
    fullPath
  };
}
function resolvePropsRoute(routes2, path, base) {
  const url = createUrl(path);
  url.pathname = withoutPrefix(url.pathname, PROPS_PREFIX + "/");
  const routeBase = base && withoutSuffix(base({ url }), "/");
  const fullPath = getFullPath(url, routeBase);
  const router = createRouter({
    routes: routes2,
    history: createMemoryHistory(routeBase)
  });
  return buildPropsRoute(router.resolve(fullPath));
}
function vitedge(App, { routes: routes2, base, ...options }, hook) {
  return {
    resolve: (url) => resolvePropsRoute(routes2, url, base),
    render: viteSSR2(App, { routes: routes2, base, ...options }, async ({ app, router, isClient, initialState, initialRoute }) => {
      const head = createHead();
      app.use(head);
      app.component(ClientOnly.name, ClientOnly);
      if (hook) {
        await hook({
          app,
          router,
          isClient,
          initialState,
          initialRoute
        });
      }
      return { head };
    })
  };
}
var _imports_0$7 = "/assets/HERO.7e4209b2.mp4";
;
var HeroFinal_vue_vue_type_style_index_0_scoped_true_lang = "";
var _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$r = {
  data() {
    return {
      scTimer: 0,
      scY: 0
    };
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
    document.getElementById("myvideo1").play();
  },
  methods: {
    handleScroll() {
      if (this.scTimer)
        return;
      this.scTimer = setTimeout(() => {
        this.scY = window.scrollY;
        clearTimeout(this.scTimer);
        this.scTimer = 0;
      }, 100);
    }
  }
};
function _sfc_ssrRender$j(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative mx-auto pt-12 md:pt-16 xl:pt-0 justify-center" }, _attrs))} data-v-3ed5888a><div class="videowrapper flex flex-wrap lg:flex" style="${ssrRenderStyle({ "-webkit-mask-image": "-webkit-gradient(linear, left 80%, left bottom, from(rgba(0,0,0,1)), to(rgba(0,0,0,0)))" })}" data-v-3ed5888a><video id="myvideo1" loop autoplay="autoplay" muted playsinline class="mx-auto object-cover" style="${ssrRenderStyle({ "controls": "hidden", "width": "100vw" })}" data-v-3ed5888a><source${ssrRenderAttr("src", _imports_0$7)} type="video/mp4" data-v-3ed5888a></video></div><div class="w-full flex justify-center" data-v-3ed5888a><div class="absolute text-gray-200 2xl:bottom-44 lg:bottom-24 md:bottom-8 lg:block hidden inset-x-1/2" data-v-3ed5888a><div style="${ssrRenderStyle($data.scY <= 100 ? null : { display: "none" })}" id="scroll-down-animation" data-v-3ed5888a><span class="mouse h-12 w-6" data-v-3ed5888a><span class="move" data-v-3ed5888a></span></span></div></div></div><div class="w-full flex justify-center" data-v-3ed5888a><div class="absolute text-gray-200 sm:bottom-1/4 bottom-4 block 2xl:mb-6 mx-auto" data-v-3ed5888a><button id="TrailerButton" class="border-3 rounded-full p-2 font-bold" data-v-3ed5888a><a href="https://youtu.be/dRr5fF3VIh4" target="_blank" data-v-3ed5888a> Watch Trailer </a></button></div></div></div>`);
}
const _sfc_setup$r = _sfc_main$r.setup;
_sfc_main$r.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("src/components/HeroFinal.vue");
  return _sfc_setup$r ? _sfc_setup$r(props, ctx) : void 0;
};
var __vite_components_0$6 = /* @__PURE__ */ _export_sfc(_sfc_main$r, [["ssrRender", _sfc_ssrRender$j], ["__scopeId", "data-v-3ed5888a"]]);
const _sfc_main$q = {};
function _sfc_ssrRender$i(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "grid grid-cols-12" }, _attrs))}><div class="col-span-10 col-start-2">`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</div></div>`);
}
const _sfc_setup$q = _sfc_main$q.setup;
_sfc_main$q.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("src/components/Gutter.vue");
  return _sfc_setup$q ? _sfc_setup$q(props, ctx) : void 0;
};
var __vite_components_0$5 = /* @__PURE__ */ _export_sfc(_sfc_main$q, [["ssrRender", _sfc_ssrRender$i]]);
;
var SectionHeading_vue_vue_type_style_index_0_scoped_true_lang = "";
const _sfc_main$p = {
  props: {
    sectionTitle: {
      type: String,
      required: true,
      default: " "
    },
    description: {
      type: String,
      required: false,
      default: " "
    }
  },
  data() {
    return {};
  }
};
function _sfc_ssrRender$h(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Gutter = __vite_components_0$5;
  _push(ssrRenderComponent(_component_Gutter, mergeProps({ class: "" }, _attrs), {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<div class="flex flex-col flex-wrap relative w-full xl:py-12 pt-6 justify-center content-center items-center text-gray-200 dark:text-gray-200 lg:text-5xl md:text-4xl text-3xl leading-normal tracking-wide text-center font-bold" data-v-02118fb0${_scopeId}><div class="" data-v-02118fb0${_scopeId}><p class="animate__animated animate__heartBeat animate__delay-2s animate__slow animate__repeat-infinite" data-v-02118fb0${_scopeId}>${ssrInterpolate($props.sectionTitle)}</p><p class="w-full text-gray-100 my-2 md:my-4 font-light lg:text-xl md:text-lg text-lg dark:text-gray-200" data-v-02118fb0${_scopeId}>${ssrInterpolate($props.description)}</p></div></div>`);
      } else {
        return [
          createVNode("div", { class: "flex flex-col flex-wrap relative w-full xl:py-12 pt-6 justify-center content-center items-center text-gray-200 dark:text-gray-200 lg:text-5xl md:text-4xl text-3xl leading-normal tracking-wide text-center font-bold" }, [
            createVNode("div", { class: "" }, [
              createVNode("p", { class: "animate__animated animate__heartBeat animate__delay-2s animate__slow animate__repeat-infinite" }, toDisplayString($props.sectionTitle), 1),
              createVNode("p", { class: "w-full text-gray-100 my-2 md:my-4 font-light lg:text-xl md:text-lg text-lg dark:text-gray-200" }, toDisplayString($props.description), 1)
            ])
          ])
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup$p = _sfc_main$p.setup;
_sfc_main$p.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("src/components/SectionHeading.vue");
  return _sfc_setup$p ? _sfc_setup$p(props, ctx) : void 0;
};
var __vite_components_1$2 = /* @__PURE__ */ _export_sfc(_sfc_main$p, [["ssrRender", _sfc_ssrRender$h], ["__scopeId", "data-v-02118fb0"]]);
const _sfc_main$o = {
  methods: {
    submitBtn() {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      const eml = document.getElementById("email1");
      const emailid = document.getElementById("email1").value;
      const raw = {
        fields: [
          {
            name: "email",
            value: ""
          }
        ]
      };
      raw.fields[0].value = emailid;
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(raw),
        redirect: "follow"
      };
      fetch("https://api.hsforms.com/submissions/v3/integration/submit/7572988/a6a64e77-7f72-46d3-9a47-d0dab7466c5a", requestOptions).then((result) => {
        if (result.ok && emailid !== null) {
          alert("Thankyou for subscribing!!");
          eml.ariaPlaceholder = "Thankyou!!";
          eml.value = "";
        } else {
          eml.ariaPlaceholder = "Enter Your Email";
          eml.value = "";
          throw new Error("Something went wrong");
        }
      }).catch((error) => {
        eml.ariaPlaceholder = "Invalid Email";
      });
    }
  }
};
function _sfc_ssrRender$g(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative xl:pb-24 pb-12 sm:pt-0 pt-8" }, _attrs))}><div class="w-full bg-fixed bg-cover xl:py-24 py-12 lazyload" style="${ssrRenderStyle({ "background-image": "URL(/showcasepics/Cma_1.jpg)", "-webkit-background-size": "cover", "-moz-background-size": "cover", "position": "relative" })}"><div class="container mx-auto"><div data-aos="zoom-out" class="xl:w-3/5 lg:w-3/5 w-10/12 mx-auto p-8 bg-black bg-opacity-60"><h1 class="xl:text-5xl lg:text-5xl text-3xl text-shadow-xl text-center text-gray-200 pb-8"> Sign Up for the <span class="font-bold">FREE BETA</span></h1><p class="text-xl text-center text-gray-200 pb-16 xl:w-10/12 mx-auto"> You can subscribe to our newsletter to get to know about our latest products and exciting offers. </p><div class="flex flex-col xl:flex-row lg:flex-row md:flex-row w-full justify-center"><input id="email1" type="text" placeholder="Your Email" aria-label="email" class="focus:outline-none xl:w-6/12 lg:w-9/12 w-full mb-2 xl:mb-0 lg:mb-0 md:mb-0 md:w-8/12 py-3 px-4 focus:border-our-blue border border-white rounded shadow text-black"><button id="ClickSubscribeButton1" class="focus:outline-none font-bold hidden xl:block lg:block md:block sm:block bg-our-blue focus:our-blue py-3 px-8 rounded text-gray-200 hover:ring-2 hover:ring-our-blue text-lg xl:ml-5 lg:ml-5 md:ml-5 bg-opacity-100"> Subscribe </button><button id="ClickSubscribeMobileButton1" class="focus:outline-none font-bold block xl:hidden lg:hidden md:hidden sm:hidden bg-our-blue focus:our-blue transition duration-150 ease-in-out hover:ring-2 hover:ring-our-blue rounded text-gray-200 px-6 py-2 text-sm mt-2"> Subscribe </button></div></div></div></div></div>`);
}
const _sfc_setup$o = _sfc_main$o.setup;
_sfc_main$o.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("src/components/CTA1.vue");
  return _sfc_setup$o ? _sfc_setup$o(props, ctx) : void 0;
};
var __vite_components_2$1 = /* @__PURE__ */ _export_sfc(_sfc_main$o, [["ssrRender", _sfc_ssrRender$g]]);
var _imports_0$6 = "/assets/WEBSITE_VIDEOS_1_T_720.4ad80197.mp4";
var _imports_1$3 = "/assets/WEBSITE_VIDEOS_2.2_T_720.cd2b013d.mp4";
var _imports_2$2 = "/assets/WEBSITE_VIDEOS_3.4_T_720.bf843f7c.mp4";
var _imports_3$2 = "/assets/WEBSITE_VIDEOS_4.3_T_720.e302cfad.mp4";
var _imports_4$2 = "/assets/WEBSITE_VIDEOS_5.2_T_720.8606e6b1.mp4";
var _imports_5$2 = "/assets/WebWalkthroughFinal.76fd839d.mp4";
;
var TimelineUI_vue_vue_type_style_index_0_scoped_true_lang = "";
const _sfc_main$n = {};
function _sfc_ssrRender$f(_ctx, _push, _parent, _attrs) {
  const _component_Gutter = __vite_components_0$5;
  _push(ssrRenderComponent(_component_Gutter, _attrs, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<div class="pt-0 text-gray-200" data-v-14e51e67${_scopeId}><div class="grid row-section" data-v-14e51e67${_scopeId}><div class="my-auto content-center" data-v-14e51e67${_scopeId}><p class="section-heading-below-large" data-v-14e51e67${_scopeId}> Import 3D models </p><video autoplay loop muted playsinline class="w-full" data-v-14e51e67${_scopeId}><source${ssrRenderAttr("src", _imports_0$6)} type="video/mp4" data-v-14e51e67${_scopeId}> Your browser does not support the video tag. </video></div><div class="h-full content-center" data-v-14e51e67${_scopeId}><div class="lg:my-16" data-v-14e51e67${_scopeId}><p class="section-heading-above-large" data-v-14e51e67${_scopeId}> Import 3D models </p><p class="section-para" data-v-14e51e67${_scopeId}> Bring in models from a wide range of supported 3d formats or instantly sync modeling changes from industry leading 3D modeling applications like <b data-v-14e51e67${_scopeId}><i data-v-14e51e67${_scopeId}> SketchUp, Revit, 3DS Max, Navisworks, Archicad and Rhino </i></b></p></div></div></div><div class="grid row-section" data-v-14e51e67${_scopeId}><div class="h-full content-center lg:order-first order-last" data-v-14e51e67${_scopeId}><div class="lg:my-16" data-v-14e51e67${_scopeId}><p class="section-heading-above-large" data-v-14e51e67${_scopeId}> Build your scene </p><p class="section-para" data-v-14e51e67${_scopeId}> Easily create and populate scenes with the drag and drop library, mass placement and dynamic terrain editing tools </p></div></div><div class="my-auto content-center" data-v-14e51e67${_scopeId}><p class="section-heading-below-large" data-v-14e51e67${_scopeId}> Build your scene </p><video autoplay loop muted playsinline class="w-full" data-v-14e51e67${_scopeId}><source${ssrRenderAttr("src", _imports_1$3)} type="video/mp4" data-v-14e51e67${_scopeId}> Your browser does not support the video tag. </video></div></div><div class="grid row-section" data-v-14e51e67${_scopeId}><div class="my-auto content-center" data-v-14e51e67${_scopeId}><p class="section-heading-below-large" data-v-14e51e67${_scopeId}> Light it up </p><video autoplay loop muted playsinline class="w-full" data-v-14e51e67${_scopeId}><source${ssrRenderAttr("src", _imports_2$2)} type="video/mp4" data-v-14e51e67${_scopeId}> Your browser does not support the video tag. </video></div><div class="h-full content-center" data-v-14e51e67${_scopeId}><div class="lg:my-16" data-v-14e51e67${_scopeId}><p class="section-heading-above-large" data-v-14e51e67${_scopeId}> Light it up </p><p class="section-para" data-v-14e51e67${_scopeId}> Simulate natural lighting and weather conditions with HDRI lighting and dynamic sky and weathering systems </p></div></div></div><div class="grid row-section" data-v-14e51e67${_scopeId}><div class="h-full content-center lg:order-first order-last" data-v-14e51e67${_scopeId}><div class="lg:my-16" data-v-14e51e67${_scopeId}><p class="section-heading-above-large" data-v-14e51e67${_scopeId}> Apply materials </p><p class="section-para" data-v-14e51e67${_scopeId}> Make any scene look realistic be applying physically based materials with photo scanned textures from the curated library or create new materials by importing your own textures </p></div></div><div class="my-auto content-center" data-v-14e51e67${_scopeId}><p class="section-heading-below-large" data-v-14e51e67${_scopeId}> Apply materials </p><video autoplay loop muted playsinline class="w-full" data-v-14e51e67${_scopeId}><source${ssrRenderAttr("src", _imports_3$2)} type="video/mp4" data-v-14e51e67${_scopeId}> Your browser does not support the video tag. </video></div></div><div class="grid row-section" data-v-14e51e67${_scopeId}><div class="my-auto content-center" data-v-14e51e67${_scopeId}><p class="section-heading-below-large" data-v-14e51e67${_scopeId}> Export </p><video autoplay loop muted playsinline class="w-full" data-v-14e51e67${_scopeId}><source${ssrRenderAttr("src", _imports_4$2)} type="video/mp4" data-v-14e51e67${_scopeId}> Your browser does not support the video tag. </video></div><div class="h-full content-center" data-v-14e51e67${_scopeId}><div class="lg:my-16" data-v-14e51e67${_scopeId}><p class="section-heading-above-large" data-v-14e51e67${_scopeId}> Export </p><p class="section-para" data-v-14e51e67${_scopeId}> Render highly photorealistic images, image sequences and videos with support for 360-degree monoscopic and stereoscopic formats </p><p class="section-para" data-v-14e51e67${_scopeId}> Publish interactive, embeddable, virtual reality walkthroughs that can be viewed on any device with a web browser </p></div></div></div><div class="grid row-section" data-v-14e51e67${_scopeId}><div class="h-full content-center lg:order-first order-last" data-v-14e51e67${_scopeId}><div class="lg:my-28" data-v-14e51e67${_scopeId}><p class="section-heading-above-large" data-v-14e51e67${_scopeId}> Present in VR </p><p class="section-para" data-v-14e51e67${_scopeId}> Present and showcase your designs as interactive VR walkthroughs on any device that can run a web browser </p></div></div><div class="my-auto content-center" data-v-14e51e67${_scopeId}><p class="section-heading-below-large" data-v-14e51e67${_scopeId}> Present in VR </p><video autoplay loop muted playsinline class="w-full" data-v-14e51e67${_scopeId}><source${ssrRenderAttr("src", _imports_5$2)} type="video/mp4" data-v-14e51e67${_scopeId}> Your browser does not support the video tag. </video></div></div></div>`);
      } else {
        return [
          createVNode("div", {
            class: "pt-0 text-gray-200",
            onScroll: ($event) => _ctx.myFunction()
          }, [
            createVNode("div", { class: "grid row-section" }, [
              createVNode("div", { class: "my-auto content-center" }, [
                createVNode("p", { class: "section-heading-below-large" }, " Import 3D models "),
                createVNode("video", {
                  autoplay: "",
                  loop: "",
                  muted: "",
                  playsinline: "",
                  class: "w-full"
                }, [
                  createVNode("source", {
                    src: _imports_0$6,
                    type: "video/mp4"
                  }),
                  createTextVNode(" Your browser does not support the video tag. ")
                ])
              ]),
              createVNode("div", { class: "h-full content-center" }, [
                createVNode("div", { class: "lg:my-16" }, [
                  createVNode("p", { class: "section-heading-above-large" }, " Import 3D models "),
                  createVNode("p", { class: "section-para" }, [
                    createTextVNode(" Bring in models from a wide range of supported 3d formats or instantly sync modeling changes from industry leading 3D modeling applications like "),
                    createVNode("b", null, [
                      createVNode("i", null, " SketchUp, Revit, 3DS Max, Navisworks, Archicad and Rhino ")
                    ])
                  ])
                ])
              ])
            ]),
            createVNode("div", { class: "grid row-section" }, [
              createVNode("div", { class: "h-full content-center lg:order-first order-last" }, [
                createVNode("div", { class: "lg:my-16" }, [
                  createVNode("p", { class: "section-heading-above-large" }, " Build your scene "),
                  createVNode("p", { class: "section-para" }, " Easily create and populate scenes with the drag and drop library, mass placement and dynamic terrain editing tools ")
                ])
              ]),
              createVNode("div", { class: "my-auto content-center" }, [
                createVNode("p", { class: "section-heading-below-large" }, " Build your scene "),
                createVNode("video", {
                  autoplay: "",
                  loop: "",
                  muted: "",
                  playsinline: "",
                  class: "w-full"
                }, [
                  createVNode("source", {
                    src: _imports_1$3,
                    type: "video/mp4"
                  }),
                  createTextVNode(" Your browser does not support the video tag. ")
                ])
              ])
            ]),
            createVNode("div", { class: "grid row-section" }, [
              createVNode("div", { class: "my-auto content-center" }, [
                createVNode("p", { class: "section-heading-below-large" }, " Light it up "),
                createVNode("video", {
                  autoplay: "",
                  loop: "",
                  muted: "",
                  playsinline: "",
                  class: "w-full"
                }, [
                  createVNode("source", {
                    src: _imports_2$2,
                    type: "video/mp4"
                  }),
                  createTextVNode(" Your browser does not support the video tag. ")
                ])
              ]),
              createVNode("div", { class: "h-full content-center" }, [
                createVNode("div", { class: "lg:my-16" }, [
                  createVNode("p", { class: "section-heading-above-large" }, " Light it up "),
                  createVNode("p", { class: "section-para" }, " Simulate natural lighting and weather conditions with HDRI lighting and dynamic sky and weathering systems ")
                ])
              ])
            ]),
            createVNode("div", { class: "grid row-section" }, [
              createVNode("div", { class: "h-full content-center lg:order-first order-last" }, [
                createVNode("div", { class: "lg:my-16" }, [
                  createVNode("p", { class: "section-heading-above-large" }, " Apply materials "),
                  createVNode("p", { class: "section-para" }, " Make any scene look realistic be applying physically based materials with photo scanned textures from the curated library or create new materials by importing your own textures ")
                ])
              ]),
              createVNode("div", { class: "my-auto content-center" }, [
                createVNode("p", { class: "section-heading-below-large" }, " Apply materials "),
                createVNode("video", {
                  autoplay: "",
                  loop: "",
                  muted: "",
                  playsinline: "",
                  class: "w-full"
                }, [
                  createVNode("source", {
                    src: _imports_3$2,
                    type: "video/mp4"
                  }),
                  createTextVNode(" Your browser does not support the video tag. ")
                ])
              ])
            ]),
            createVNode("div", { class: "grid row-section" }, [
              createVNode("div", { class: "my-auto content-center" }, [
                createVNode("p", { class: "section-heading-below-large" }, " Export "),
                createVNode("video", {
                  autoplay: "",
                  loop: "",
                  muted: "",
                  playsinline: "",
                  class: "w-full"
                }, [
                  createVNode("source", {
                    src: _imports_4$2,
                    type: "video/mp4"
                  }),
                  createTextVNode(" Your browser does not support the video tag. ")
                ])
              ]),
              createVNode("div", { class: "h-full content-center" }, [
                createVNode("div", { class: "lg:my-16" }, [
                  createVNode("p", { class: "section-heading-above-large" }, " Export "),
                  createVNode("p", { class: "section-para" }, " Render highly photorealistic images, image sequences and videos with support for 360-degree monoscopic and stereoscopic formats "),
                  createVNode("p", { class: "section-para" }, " Publish interactive, embeddable, virtual reality walkthroughs that can be viewed on any device with a web browser ")
                ])
              ])
            ]),
            createVNode("div", { class: "grid row-section" }, [
              createVNode("div", { class: "h-full content-center lg:order-first order-last" }, [
                createVNode("div", { class: "lg:my-28" }, [
                  createVNode("p", { class: "section-heading-above-large" }, " Present in VR "),
                  createVNode("p", { class: "section-para" }, " Present and showcase your designs as interactive VR walkthroughs on any device that can run a web browser ")
                ])
              ]),
              createVNode("div", { class: "my-auto content-center" }, [
                createVNode("p", { class: "section-heading-below-large" }, " Present in VR "),
                createVNode("video", {
                  autoplay: "",
                  loop: "",
                  muted: "",
                  playsinline: "",
                  class: "w-full"
                }, [
                  createVNode("source", {
                    src: _imports_5$2,
                    type: "video/mp4"
                  }),
                  createTextVNode(" Your browser does not support the video tag. ")
                ])
              ])
            ])
          ], 40, ["onScroll"])
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup$n = _sfc_main$n.setup;
_sfc_main$n.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("src/components/TimelineUI.vue");
  return _sfc_setup$n ? _sfc_setup$n(props, ctx) : void 0;
};
var __vite_components_3 = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["ssrRender", _sfc_ssrRender$f], ["__scopeId", "data-v-14e51e67"]]);
var _imports_0$5 = "/assets/StudioUI.e17c3c79.webp";
;
var Studio1_vue_vue_type_style_index_0_scoped_true_lang = "";
const _sfc_main$m = {
  name: "Stitch",
  components: {},
  methods: {
    scrollToTop() {
      window.scrollTo(0, 0);
    }
  }
};
function _sfc_ssrRender$e(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Gutter = __vite_components_0$5;
  _push(ssrRenderComponent(_component_Gutter, mergeProps({ class: "" }, _attrs), {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<div id="Studio" class="pb-12 xl:pb-24 pb-8 xl:pt-16 sm:my-0 my-6 grid grid-cols-8 items-center" data-v-79d58290${_scopeId}><div class="w-full shadow-2xl col-span-8 lg:col-span-5 px-0 order-first lg:order-last" data-v-79d58290${_scopeId}><img class="w-full lazyload"${ssrRenderAttr("src", _imports_0$5)} alt="" srcset="" data-v-79d58290${_scopeId}></div><div class="grid w-full h-full self-center content-center col-span-8 lg:col-span-3" data-v-79d58290${_scopeId}><div class="border-black lg:py-8 lg:px-8 py-4" data-v-79d58290${_scopeId}><p class="lg:text-4xl md:text-3xl text-2xl text-center text-gray-200 dark:text-gray-200" data-v-79d58290${_scopeId}> RENDERPUB <span class="font-bold text-our-blue" data-v-79d58290${_scopeId}>STUDIO</span></p><p class="md:text-md xl:text-lg text-base md:pt-4 pt-2 text-center text-gray-200 dark:text-gray-200" data-v-79d58290${_scopeId}><span class="font-bold" data-v-79d58290${_scopeId}>Realtime ray traced renderer </span> with an extensive library of render ready objects, materials, decals, visual effects and all the tools you need to create high fidelity visuals quickly. </p><div class="flex mb-6 md:mb-8 md:mb-0 mt-4" data-v-79d58290${_scopeId}><button id="StudioPageButton" class="mx-auto w-1/2 focus:outline-none hover:ring-2 hover:ring-our-blue bg-our-blue rounded text-gray-200 px-4 py-2 xl:px-4 xl:py-4 font-bold text-base md:text-lg" data-v-79d58290${_scopeId}> Coming Soon </button></div></div></div></div>`);
      } else {
        return [
          createVNode("div", {
            id: "Studio",
            class: "pb-12 xl:pb-24 pb-8 xl:pt-16 sm:my-0 my-6 grid grid-cols-8 items-center"
          }, [
            createVNode("div", { class: "w-full shadow-2xl col-span-8 lg:col-span-5 px-0 order-first lg:order-last" }, [
              createVNode("img", {
                class: "w-full lazyload",
                src: _imports_0$5,
                alt: "",
                srcset: ""
              })
            ]),
            createVNode("div", { class: "grid w-full h-full self-center content-center col-span-8 lg:col-span-3" }, [
              createVNode("div", { class: "border-black lg:py-8 lg:px-8 py-4" }, [
                createVNode("p", { class: "lg:text-4xl md:text-3xl text-2xl text-center text-gray-200 dark:text-gray-200" }, [
                  createTextVNode(" RENDERPUB "),
                  createVNode("span", { class: "font-bold text-our-blue" }, "STUDIO")
                ]),
                createVNode("p", { class: "md:text-md xl:text-lg text-base md:pt-4 pt-2 text-center text-gray-200 dark:text-gray-200" }, [
                  createVNode("span", { class: "font-bold" }, "Realtime ray traced renderer "),
                  createTextVNode(" with an extensive library of render ready objects, materials, decals, visual effects and all the tools you need to create high fidelity visuals quickly. ")
                ]),
                createVNode("div", { class: "flex mb-6 md:mb-8 md:mb-0 mt-4" }, [
                  createVNode("button", {
                    id: "StudioPageButton",
                    class: "mx-auto w-1/2 focus:outline-none hover:ring-2 hover:ring-our-blue bg-our-blue rounded text-gray-200 px-4 py-2 xl:px-4 xl:py-4 font-bold text-base md:text-lg"
                  }, " Coming Soon ")
                ])
              ])
            ])
          ])
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup$m = _sfc_main$m.setup;
_sfc_main$m.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("src/components/Studio1.vue");
  return _sfc_setup$m ? _sfc_setup$m(props, ctx) : void 0;
};
var __vite_components_4 = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["ssrRender", _sfc_ssrRender$e], ["__scopeId", "data-v-79d58290"]]);
var _imports_0$4 = "/assets/Stitch.119b2d6f.webp";
;
var Stitch_vue_vue_type_style_index_0_scoped_true_lang = "";
const _sfc_main$l = {
  name: "Stitch",
  components: {},
  methods: {
    scrollToTop() {
      window.scrollTo(0, 0);
    }
  }
};
function _sfc_ssrRender$d(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Gutter = __vite_components_0$5;
  _push(ssrRenderComponent(_component_Gutter, mergeProps({ class: "" }, _attrs), {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<div id="Stitch" class="py-12 xl:py-24 grid grid-cols-8 items-center" data-v-8b107474${_scopeId}><div class="w-full shadow-2xl col-span-8 lg:col-span-5 px-0" data-v-8b107474${_scopeId}><img class="w-full lazyload"${ssrRenderAttr("src", _imports_0$4)} alt="" srcset="" data-v-8b107474${_scopeId}></div><div class="grid w-full h-full self-center content-center col-span-8 lg:col-span-3" data-v-8b107474${_scopeId}><div class="border-black lg:py-8 lg:px-8 py-4" data-v-8b107474${_scopeId}><p class="lg:text-4xl md:text-3xl text-2xl text-center text-gray-200 dark:text-gray-200" data-v-8b107474${_scopeId}> RENDERPUB <span class="font-bold text-our-blue" data-v-8b107474${_scopeId}>STITCH</span></p><p class="md:text-md xl:text-lg text-base md:pt-4 pt-2 text-center text-gray-200 dark:text-gray-200" data-v-8b107474${_scopeId}> Use renders from any third party rendering application to create interactive VR walkthroughs and publish them on the Renderpub Spaces platform. </p><div class="flex mb-6 md:mb-8 md:mb-0 mt-4" data-v-8b107474${_scopeId}><button id="StitchPageButton" class="mx-auto w-1/2 focus:outline-none hover:ring-2 hover:ring-our-blue bg-our-blue rounded text-gray-200 px-4 py-2 xl:px-4 xl:py-4 font-bold text-base md:text-lg" data-v-8b107474${_scopeId}> Coming Soon </button></div></div></div></div>`);
      } else {
        return [
          createVNode("div", {
            id: "Stitch",
            class: "py-12 xl:py-24 grid grid-cols-8 items-center"
          }, [
            createVNode("div", { class: "w-full shadow-2xl col-span-8 lg:col-span-5 px-0" }, [
              createVNode("img", {
                class: "w-full lazyload",
                src: _imports_0$4,
                alt: "",
                srcset: ""
              })
            ]),
            createVNode("div", { class: "grid w-full h-full self-center content-center col-span-8 lg:col-span-3" }, [
              createVNode("div", { class: "border-black lg:py-8 lg:px-8 py-4" }, [
                createVNode("p", { class: "lg:text-4xl md:text-3xl text-2xl text-center text-gray-200 dark:text-gray-200" }, [
                  createTextVNode(" RENDERPUB "),
                  createVNode("span", { class: "font-bold text-our-blue" }, "STITCH")
                ]),
                createVNode("p", { class: "md:text-md xl:text-lg text-base md:pt-4 pt-2 text-center text-gray-200 dark:text-gray-200" }, " Use renders from any third party rendering application to create interactive VR walkthroughs and publish them on the Renderpub Spaces platform. "),
                createVNode("div", { class: "flex mb-6 md:mb-8 md:mb-0 mt-4" }, [
                  createVNode("button", {
                    id: "StitchPageButton",
                    class: "mx-auto w-1/2 focus:outline-none hover:ring-2 hover:ring-our-blue bg-our-blue rounded text-gray-200 px-4 py-2 xl:px-4 xl:py-4 font-bold text-base md:text-lg"
                  }, " Coming Soon ")
                ])
              ])
            ])
          ])
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup$l = _sfc_main$l.setup;
_sfc_main$l.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("src/components/Stitch.vue");
  return _sfc_setup$l ? _sfc_setup$l(props, ctx) : void 0;
};
var __vite_components_5 = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["ssrRender", _sfc_ssrRender$d], ["__scopeId", "data-v-8b107474"]]);
;
var SpacesSection_vue_vue_type_style_index_0_lang = "";
let THREE$1;
let container;
let SpacesContentCenterAligned, SpacesContentLeftAligned;
let camera, scene, renderer;
let aspectRatio;
let targetRotationX = 0.5;
let mouseX = 0;
let mouseXOnMouseDown = 0;
let mouseY = 0;
const slowingFactor = 0.1;
let mousedownflag = 0;
let sphereMesh;
let windowHalfX;
let windowHalfY;
const _sfc_main$k = {
  async mounted() {
    THREE$1 = await import("https://cdn.skypack.dev/three@0.136.0");
    this.init();
  },
  methods: {
    init() {
      container = document.getElementById("SpacesContainer");
      SpacesContentCenterAligned = document.getElementById("Spaces2");
      SpacesContentLeftAligned = document.getElementById("SpacesContent");
      windowHalfX = container.clientWidth / 2;
      windowHalfY = container.clientHeight / 2;
      camera = new THREE$1.PerspectiveCamera(30, container.clientWidth / container.clientHeight, 1, 1e5);
      camera.position.z = -4e3;
      scene = new THREE$1.Scene();
      const backTexture = new THREE$1.TextureLoader().load("/NEWRENDERS/bgpano.webp", render2);
      backTexture.mapping = THREE$1.EquirectangularReflectionMapping;
      backTexture.minFilter = backTexture.magFilter = THREE$1.LinearFilter;
      scene.background = backTexture;
      const ambient = new THREE$1.AmbientLight(16777215);
      scene.add(ambient);
      renderer = new THREE$1.WebGLRenderer({ alpha: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(renderer.domElement);
      createScene();
      animate();
      container.addEventListener("mousedown", onDocumentMouseDown, false);
      container.addEventListener("mousemove", onDocumentMouseMove);
      container.addEventListener("mouseup", onDocumentMouseUp, false);
      container.addEventListener("mouseout", onDocumentMouseOut, false);
      container.addEventListener("touchstart ", onDocumentMouseDown, false);
      container.addEventListener("touchmove  ", onDocumentMouseMove, false);
      container.addEventListener("touchend   ", onDocumentMouseUp, false);
      container.addEventListener("touchcancel ", onDocumentMouseOut, false);
      window.addEventListener("resize", onWindowResize);
      function mapRange(min1, max1, min2, max2, v1) {
        return (v1 - min1) / (max1 - min1) * (max2 - min2) + min2;
      }
      function onWindowResize() {
        windowHalfX = container.clientWidth / 2;
        windowHalfY = container.clientHeight / 2;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        aspectRatio = container.clientWidth / container.clientHeight;
        if (aspectRatio <= 0.7)
          sphereMesh.scale.x = sphereMesh.scale.y = sphereMesh.scale.z = mapRange(0.4, 0.7, 0.5, 1, aspectRatio) * 44;
        else
          sphereMesh.scale.x = sphereMesh.scale.y = sphereMesh.scale.z = 44;
        sphereMesh.position.x = mapRange(1, 3.5, 800, -1e3, aspectRatio);
        renderer.setSize(container.clientWidth, container.clientHeight);
      }
      function createScene() {
        aspectRatio = container.clientWidth / container.clientHeight;
        const s = aspectRatio >= 0.7 ? 44 : mapRange(0.4, 0.7, 0.5, 1, aspectRatio) * 44;
        const geometry = new THREE$1.SphereGeometry(16, 32, 32);
        const mat1 = new THREE$1.MeshStandardMaterial({
          side: THREE$1.DoubleSide,
          transparent: true,
          opacity: 0
        });
        sphereMesh = new THREE$1.Mesh(geometry, mat1);
        sphereMesh.position.x = mapRange(1, 3.5, 800, -1e3, aspectRatio);
        sphereMesh.scale.x = sphereMesh.scale.y = sphereMesh.scale.z = s;
        scene.add(sphereMesh);
      }
      function onDocumentMouseMove(event) {
        event.clientX / container.clientWidth;
        event.clientY / container.clientHeight;
        mouseX = event.clientX - windowHalfX;
        mouseY = event.clientY - windowHalfY;
        if (mousedownflag) {
          targetRotationX = (mouseX - mouseXOnMouseDown) * 25e-5;
        }
      }
      function onDocumentMouseDown(event) {
        event.preventDefault();
        mouseXOnMouseDown = event.clientX - windowHalfX;
        event.clientY - windowHalfY;
        mousedownflag = 1;
      }
      function onDocumentMouseUp(event) {
        mousedownflag = 0;
      }
      function onDocumentMouseOut(event) {
        mousedownflag = 0;
      }
      function rotateAroundWorldAxis(object, axis, radians) {
        if (axis == "x")
          object.rotation.y += radians;
        if (axis == "y")
          object.rotation.x += radians;
      }
      function render2() {
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.updateProjectionMatrix();
        camera.position.y += (-mouseY - camera.position.y) * 0.05;
        if (aspectRatio <= 1.4) {
          camera.lookAt(sphereMesh.position);
          SpacesContentLeftAligned.style.display = "none";
          SpacesContentCenterAligned.style.display = "block";
          document.getElementById("SpacesContent").classList.add("w-full");
        } else {
          camera.lookAt(new THREE$1.Vector3(1200, 0, 0));
          SpacesContentLeftAligned.style.display = "block";
          SpacesContentCenterAligned.style.display = "none";
          if (document.getElementById("SpacesContent").classList.contains("w-full")) {
            document.getElementById("SpacesContent").classList.remove("w-full");
          }
        }
        rotateAroundWorldAxis(sphereMesh, "x", targetRotationX);
        targetRotationX = targetRotationX * (1 - slowingFactor);
        renderer.render(scene, camera);
      }
      function animate() {
        requestAnimationFrame(animate);
        render2();
      }
    }
  }
};
function _sfc_ssrRender$c(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Gutter = __vite_components_0$5;
  _push(`<div${ssrRenderAttrs(mergeProps({
    id: "spacesdiv",
    class: "bg-black bg-opacity-60 pt-24 xl:pt-48"
  }, _attrs))}><div id="SpacesContainer" class="relative w-full h-full object-cover" style="${ssrRenderStyle({})}"><div id="SpacesContent" class="text-gray-200 bg-black bg-opacity-60 h-full lg:w-1/3 sm:w-1/2 w-5/12 md:py-18"><div id="Spaces1" class="grid grid-cols-8 items-center absolute" style="${ssrRenderStyle({ "display": "block", "margin-top": "0" })}">`);
  _push(ssrRenderComponent(_component_Gutter, null, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<div class="grid inline-block align-middle w-full h-full self-center content-center col-span-3"${_scopeId}><div class="sm:px-8 sm:py-12 lg:py-24"${_scopeId}><p class="lg:text-4xl md:text-3xl text-2xl text-center text-gray-200 dark:text-gray-200"${_scopeId}> RENDERPUB <span class="font-bold text-our-blue"${_scopeId}>SPACES</span></p><p class="md:text-md xl:text-lg text-base md:pt-4 pt-2 text-center text-gray-200 dark:text-gray-200"${_scopeId}><span class="font-bold"${_scopeId}> Photorealistic decentralized metaverse platform </span> for experiencing architectural spaces interactively in mobile, web and VR. </p><div class="flex mb-6 md:mb-8 md:mb-0 mt-4"${_scopeId}><button id="SpacesPageButton" class="text-center mx-auto w-1/2 focus:outline-none hover:ring-2 hover:ring-our-blue bg-our-blue rounded text-gray-200 px-4 py-2 xl:px-4 xl:py-4 font-bold text-base md:text-lg"${_scopeId}> Coming Soon </button></div></div></div>`);
      } else {
        return [
          createVNode("div", { class: "grid inline-block align-middle w-full h-full self-center content-center col-span-3" }, [
            createVNode("div", { class: "sm:px-8 sm:py-12 lg:py-24" }, [
              createVNode("p", { class: "lg:text-4xl md:text-3xl text-2xl text-center text-gray-200 dark:text-gray-200" }, [
                createTextVNode(" RENDERPUB "),
                createVNode("span", { class: "font-bold text-our-blue" }, "SPACES")
              ]),
              createVNode("p", { class: "md:text-md xl:text-lg text-base md:pt-4 pt-2 text-center text-gray-200 dark:text-gray-200" }, [
                createVNode("span", { class: "font-bold" }, " Photorealistic decentralized metaverse platform "),
                createTextVNode(" for experiencing architectural spaces interactively in mobile, web and VR. ")
              ]),
              createVNode("div", { class: "flex mb-6 md:mb-8 md:mb-0 mt-4" }, [
                createVNode("button", {
                  id: "SpacesPageButton",
                  class: "text-center mx-auto w-1/2 focus:outline-none hover:ring-2 hover:ring-our-blue bg-our-blue rounded text-gray-200 px-4 py-2 xl:px-4 xl:py-4 font-bold text-base md:text-lg"
                }, " Coming Soon ")
              ])
            ])
          ])
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div></div><div id="Spaces2" class="grid grid-cols-8" style="${ssrRenderStyle({ "display": "none" })}">`);
  _push(ssrRenderComponent(_component_Gutter, null, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<div class="grid w-full h-full col-span-8"${_scopeId}><div class="border-black lg:py-8 lg:px-8 py-4"${_scopeId}><p class="lg:text-4xl md:text-3xl text-2xl text-center text-gray-200 dark:text-gray-200"${_scopeId}> RENDERPUB <span class="font-bold text-our-blue"${_scopeId}>SPACES</span></p><p class="md:text-md xl:text-lg text-base md:pt-4 pt-2 text-center text-gray-200 dark:text-gray-200"${_scopeId}><span class="font-bold"${_scopeId}>Realtime ray traced renderer </span> with an extensive library of render ready objects, materials, decals, visual effects and all the tools you need to create high fidelity visuals quickly. </p><div class="flex mb-6 md:mb-8 md:mb-0 mt-4"${_scopeId}><button id="SpacesPageButton" class="mx-auto w-1/2 focus:outline-none hover:ring-2 hover:ring-our-blue bg-our-blue rounded text-gray-200 px-4 py-2 xl:px-4 xl:py-4 font-bold text-base md:text-lg"${_scopeId}> Coming Soon </button></div></div></div>`);
      } else {
        return [
          createVNode("div", { class: "grid w-full h-full col-span-8" }, [
            createVNode("div", { class: "border-black lg:py-8 lg:px-8 py-4" }, [
              createVNode("p", { class: "lg:text-4xl md:text-3xl text-2xl text-center text-gray-200 dark:text-gray-200" }, [
                createTextVNode(" RENDERPUB "),
                createVNode("span", { class: "font-bold text-our-blue" }, "SPACES")
              ]),
              createVNode("p", { class: "md:text-md xl:text-lg text-base md:pt-4 pt-2 text-center text-gray-200 dark:text-gray-200" }, [
                createVNode("span", { class: "font-bold" }, "Realtime ray traced renderer "),
                createTextVNode(" with an extensive library of render ready objects, materials, decals, visual effects and all the tools you need to create high fidelity visuals quickly. ")
              ]),
              createVNode("div", { class: "flex mb-6 md:mb-8 md:mb-0 mt-4" }, [
                createVNode("button", {
                  id: "SpacesPageButton",
                  class: "mx-auto w-1/2 focus:outline-none hover:ring-2 hover:ring-our-blue bg-our-blue rounded text-gray-200 px-4 py-2 xl:px-4 xl:py-4 font-bold text-base md:text-lg"
                }, " Coming Soon ")
              ])
            ])
          ])
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div>`);
}
const _sfc_setup$k = _sfc_main$k.setup;
_sfc_main$k.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("src/components/WebviewerScripts/SpacesSection.vue");
  return _sfc_setup$k ? _sfc_setup$k(props, ctx) : void 0;
};
var __vite_components_0$4 = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["ssrRender", _sfc_ssrRender$c]]);
;
var Spaces2_vue_vue_type_style_index_0_scoped_true_lang = "";
const _sfc_main$j = {
  name: "Spaces",
  components: {},
  methods: {
    scrollToTop() {
      window.scrollTo(0, 0);
    }
  }
};
function _sfc_ssrRender$b(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_ClientOnly = resolveComponent("ClientOnly");
  const _component_SpacesSection = __vite_components_0$4;
  _push(ssrRenderComponent(_component_ClientOnly, _attrs, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent(_component_SpacesSection, { id: "Spaces" }, null, _parent2, _scopeId));
      } else {
        return [
          createVNode(_component_SpacesSection, { id: "Spaces" })
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup$j = _sfc_main$j.setup;
_sfc_main$j.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("src/components/Spaces2.vue");
  return _sfc_setup$j ? _sfc_setup$j(props, ctx) : void 0;
};
var __vite_components_6 = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["ssrRender", _sfc_ssrRender$b], ["__scopeId", "data-v-151063b8"]]);
var _imports_0$3 = "/assets/Architectural2.8c47f26d.svg";
var _imports_1$2 = "/assets/Real_estate2.42a95541.svg";
var _imports_2$1 = "/assets/visualstores2.65ed2fd4.svg";
var _imports_3$1 = "/assets/showcase_portfolios2.cf4806b7.svg";
var _imports_4$1 = "/assets/iterations2.19902ac2.svg";
var _imports_5$1 = "/assets/collaborate2.ea473e07.svg";
const _sfc_main$i = {
  name: "IconAndText"
};
function _sfc_ssrRender$a(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Gutter = __vite_components_0$5;
  _push(ssrRenderComponent(_component_Gutter, _attrs, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<section class="max-w-8xl mx-auto container"${_scopeId}><div${_scopeId}><div class="mt-4 md:mt-8 lg:mt-16 flex flex-wrap justify-between px-4"${_scopeId}><div class="flex sm:w-full md:w-5/12 pb-10 md:pb-20"${_scopeId}><div class="w-20 h-20 relative mr-5"${_scopeId}><div class="absolute top-0 right-0 bg-[#e8ffff] rounded w-16 h-16 mt-2 mr-1"${_scopeId}></div><div class="absolute text-gray-200 bottom-0 left-0 bg-our-blue rounded w-16 h-16 flex items-center justify-center mt-2 mr-3 p-3"${_scopeId}><img${ssrRenderAttr("src", _imports_0$3)} alt=""${_scopeId}></div></div><div class="w-10/12"${_scopeId}><h4 class="text-lg font-bold leading-tight text-gray-200"${_scopeId}>Architectural Presentations</h4><p class="text-base text-gray-200 leading-normal pt-2"${_scopeId}>Present architectural designs to clients and stakeholders as highly photorealistic, interactive VR experiences.</p></div></div><div class="flex sm:w-full md:w-5/12 pb-10 md:pb-20"${_scopeId}><div class="w-20 h-20 relative mr-5"${_scopeId}><div class="absolute top-0 right-0 bg-[#e8ffff] rounded w-16 h-16 mt-2 mr-1"${_scopeId}></div><div class="absolute text-gray-200 bottom-0 left-0 bg-our-blue rounded w-16 h-16 flex items-center justify-center mt-2 mr-3 p-3"${_scopeId}><img${ssrRenderAttr("src", _imports_1$2)} alt=""${_scopeId}></div></div><div class="w-10/12"${_scopeId}><h4 class="text-lg font-bold leading-tight text-gray-200"${_scopeId}>Real Estate Marketing</h4><p class="text-base text-gray-200 leading-normal pt-2"${_scopeId}>Market real estate remotely through VR walkthroughs embedded on your site instead of physical on-site visits.</p></div></div><div class="flex sm:w-full md:w-5/12 pb-10 md:pb-20"${_scopeId}><div class="w-20 h-20 relative mr-5"${_scopeId}><div class="absolute top-0 right-0 bg-[#e8ffff] rounded w-16 h-16 mt-2 mr-1"${_scopeId}></div><div class="absolute text-gray-200 bottom-0 left-0 bg-our-blue rounded w-16 h-16 flex items-center justify-center mt-2 mr-3 p-3"${_scopeId}><img${ssrRenderAttr("src", _imports_2$1)} alt=""${_scopeId}></div></div><div class="w-10/12"${_scopeId}><h4 class="text-lg font-bold leading-tight text-gray-200"${_scopeId}>Virtual Stores</h4><p class="text-base text-gray-200 leading-normal pt-2"${_scopeId}>Create your own virtual store front and sell products by creating buy links to objects in your 3D environment.</p></div></div><div class="flex sm:w-full md:w-5/12 pb-10 md:pb-20"${_scopeId}><div class="w-20 h-20 relative mr-5"${_scopeId}><div class="absolute top-0 right-0 bg-[#e8ffff] rounded w-16 h-16 mt-2 mr-1"${_scopeId}></div><div class="absolute text-gray-200 bottom-0 left-0 bg-our-blue rounded w-16 h-16 flex items-center justify-center mt-2 mr-3 p-3"${_scopeId}><img${ssrRenderAttr("src", _imports_3$1)} alt=""${_scopeId}></div></div><div class="w-10/12"${_scopeId}><h4 class="text-lg font-bold leading-tight text-gray-200"${_scopeId}>Showcase Portfolios</h4><p class="text-base text-gray-200 leading-normal pt-2"${_scopeId}>Show off your architectural portfolio in interactive VR so people can immersively experience your designs in 3D rather than see in 2D.</p></div></div><div class="flex sm:w-full md:w-5/12 pb-10 md:pb-20"${_scopeId}><div class="w-20 h-20 relative mr-5"${_scopeId}><div class="absolute top-0 right-0 bg-[#e8ffff] rounded w-16 h-16 mt-2 mr-1"${_scopeId}></div><div class="absolute text-gray-200 bottom-0 left-0 bg-our-blue rounded w-16 h-16 flex items-center justify-center mt-2 mr-3 p-3"${_scopeId}><img${ssrRenderAttr("src", _imports_4$1)} alt=""${_scopeId}></div></div><div class="w-10/12"${_scopeId}><h4 class="text-lg font-bold leading-tight text-gray-200"${_scopeId}>Design Iterations</h4><p class="text-base text-gray-200 leading-normal pt-2"${_scopeId}>Realtime rendering and one-click publishing to VR make iterations feasible at any stage in the design process.</p></div></div><div class="flex sm:w-full md:w-5/12 pb-10 md:pb-20"${_scopeId}><div class="w-20 h-20 relative mr-5"${_scopeId}><div class="absolute top-0 right-0 bg-[#e8ffff] rounded w-16 h-16 mt-2 mr-1"${_scopeId}></div><div class="absolute text-gray-200 bottom-0 left-0 bg-our-blue rounded w-16 h-16 flex items-center justify-center mt-2 mr-3 p-3"${_scopeId}><img${ssrRenderAttr("src", _imports_5$1)} alt=""${_scopeId}></div></div><div class="w-10/12"${_scopeId}><h4 class="text-lg font-bold leading-tight text-gray-200"${_scopeId}>Collaborate in VR</h4><p class="text-base text-gray-200 leading-normal pt-2"${_scopeId}>Designers, clients and multiple stake holders can collaborate using notes, comments and group video calling features in VR.</p></div></div></div></div></section>`);
      } else {
        return [
          createVNode("section", { class: "max-w-8xl mx-auto container" }, [
            createVNode("div", null, [
              createVNode("div", { class: "mt-4 md:mt-8 lg:mt-16 flex flex-wrap justify-between px-4" }, [
                createVNode("div", { class: "flex sm:w-full md:w-5/12 pb-10 md:pb-20" }, [
                  createVNode("div", { class: "w-20 h-20 relative mr-5" }, [
                    createVNode("div", { class: "absolute top-0 right-0 bg-[#e8ffff] rounded w-16 h-16 mt-2 mr-1" }),
                    createVNode("div", { class: "absolute text-gray-200 bottom-0 left-0 bg-our-blue rounded w-16 h-16 flex items-center justify-center mt-2 mr-3 p-3" }, [
                      createVNode("img", {
                        src: _imports_0$3,
                        alt: ""
                      })
                    ])
                  ]),
                  createVNode("div", { class: "w-10/12" }, [
                    createVNode("h4", { class: "text-lg font-bold leading-tight text-gray-200" }, "Architectural Presentations"),
                    createVNode("p", { class: "text-base text-gray-200 leading-normal pt-2" }, "Present architectural designs to clients and stakeholders as highly photorealistic, interactive VR experiences.")
                  ])
                ]),
                createVNode("div", { class: "flex sm:w-full md:w-5/12 pb-10 md:pb-20" }, [
                  createVNode("div", { class: "w-20 h-20 relative mr-5" }, [
                    createVNode("div", { class: "absolute top-0 right-0 bg-[#e8ffff] rounded w-16 h-16 mt-2 mr-1" }),
                    createVNode("div", { class: "absolute text-gray-200 bottom-0 left-0 bg-our-blue rounded w-16 h-16 flex items-center justify-center mt-2 mr-3 p-3" }, [
                      createVNode("img", {
                        src: _imports_1$2,
                        alt: ""
                      })
                    ])
                  ]),
                  createVNode("div", { class: "w-10/12" }, [
                    createVNode("h4", { class: "text-lg font-bold leading-tight text-gray-200" }, "Real Estate Marketing"),
                    createVNode("p", { class: "text-base text-gray-200 leading-normal pt-2" }, "Market real estate remotely through VR walkthroughs embedded on your site instead of physical on-site visits.")
                  ])
                ]),
                createVNode("div", { class: "flex sm:w-full md:w-5/12 pb-10 md:pb-20" }, [
                  createVNode("div", { class: "w-20 h-20 relative mr-5" }, [
                    createVNode("div", { class: "absolute top-0 right-0 bg-[#e8ffff] rounded w-16 h-16 mt-2 mr-1" }),
                    createVNode("div", { class: "absolute text-gray-200 bottom-0 left-0 bg-our-blue rounded w-16 h-16 flex items-center justify-center mt-2 mr-3 p-3" }, [
                      createVNode("img", {
                        src: _imports_2$1,
                        alt: ""
                      })
                    ])
                  ]),
                  createVNode("div", { class: "w-10/12" }, [
                    createVNode("h4", { class: "text-lg font-bold leading-tight text-gray-200" }, "Virtual Stores"),
                    createVNode("p", { class: "text-base text-gray-200 leading-normal pt-2" }, "Create your own virtual store front and sell products by creating buy links to objects in your 3D environment.")
                  ])
                ]),
                createVNode("div", { class: "flex sm:w-full md:w-5/12 pb-10 md:pb-20" }, [
                  createVNode("div", { class: "w-20 h-20 relative mr-5" }, [
                    createVNode("div", { class: "absolute top-0 right-0 bg-[#e8ffff] rounded w-16 h-16 mt-2 mr-1" }),
                    createVNode("div", { class: "absolute text-gray-200 bottom-0 left-0 bg-our-blue rounded w-16 h-16 flex items-center justify-center mt-2 mr-3 p-3" }, [
                      createVNode("img", {
                        src: _imports_3$1,
                        alt: ""
                      })
                    ])
                  ]),
                  createVNode("div", { class: "w-10/12" }, [
                    createVNode("h4", { class: "text-lg font-bold leading-tight text-gray-200" }, "Showcase Portfolios"),
                    createVNode("p", { class: "text-base text-gray-200 leading-normal pt-2" }, "Show off your architectural portfolio in interactive VR so people can immersively experience your designs in 3D rather than see in 2D.")
                  ])
                ]),
                createVNode("div", { class: "flex sm:w-full md:w-5/12 pb-10 md:pb-20" }, [
                  createVNode("div", { class: "w-20 h-20 relative mr-5" }, [
                    createVNode("div", { class: "absolute top-0 right-0 bg-[#e8ffff] rounded w-16 h-16 mt-2 mr-1" }),
                    createVNode("div", { class: "absolute text-gray-200 bottom-0 left-0 bg-our-blue rounded w-16 h-16 flex items-center justify-center mt-2 mr-3 p-3" }, [
                      createVNode("img", {
                        src: _imports_4$1,
                        alt: ""
                      })
                    ])
                  ]),
                  createVNode("div", { class: "w-10/12" }, [
                    createVNode("h4", { class: "text-lg font-bold leading-tight text-gray-200" }, "Design Iterations"),
                    createVNode("p", { class: "text-base text-gray-200 leading-normal pt-2" }, "Realtime rendering and one-click publishing to VR make iterations feasible at any stage in the design process.")
                  ])
                ]),
                createVNode("div", { class: "flex sm:w-full md:w-5/12 pb-10 md:pb-20" }, [
                  createVNode("div", { class: "w-20 h-20 relative mr-5" }, [
                    createVNode("div", { class: "absolute top-0 right-0 bg-[#e8ffff] rounded w-16 h-16 mt-2 mr-1" }),
                    createVNode("div", { class: "absolute text-gray-200 bottom-0 left-0 bg-our-blue rounded w-16 h-16 flex items-center justify-center mt-2 mr-3 p-3" }, [
                      createVNode("img", {
                        src: _imports_5$1,
                        alt: ""
                      })
                    ])
                  ]),
                  createVNode("div", { class: "w-10/12" }, [
                    createVNode("h4", { class: "text-lg font-bold leading-tight text-gray-200" }, "Collaborate in VR"),
                    createVNode("p", { class: "text-base text-gray-200 leading-normal pt-2" }, "Designers, clients and multiple stake holders can collaborate using notes, comments and group video calling features in VR.")
                  ])
                ])
              ])
            ])
          ])
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup$i = _sfc_main$i.setup;
_sfc_main$i.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("src/components/UseCases1.vue");
  return _sfc_setup$i ? _sfc_setup$i(props, ctx) : void 0;
};
var __vite_components_7 = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["ssrRender", _sfc_ssrRender$a]]);
var _imports_0$2 = "/assets/CV.4aa023f8.webp";
var _imports_1$1 = "/assets/tables.0085.dab856e7.webp";
var _imports_2 = "/assets/DORM555.d2c7c4c2.webp";
var _imports_3 = "/assets/housesketchup.0085.bb36b5fc.webp";
var _imports_4 = "/assets/Glass_B_2.7515fade.webp";
var _imports_5 = "/assets/highresscreenshot00128.a99fac02.webp";
var _imports_6 = "/assets/room.0087.2.a36cc386.webp";
var _imports_7 = "/assets/singlesofas.0085.4614cdd7.webp";
var _imports_8 = "/assets/cs_modern_living_room_sequence.0002.a2e5cf80.webp";
var _imports_9 = "/assets/MV.4118b449.webp";
;
var Showcase_vue_vue_type_style_index_0_scoped_true_lang = "";
const _sfc_main$h = {
  data() {
    return {
      image: null,
      popup: false
    };
  },
  mounted() {
    document.addEventListener("scroll", this.changeOp);
  },
  unmounted() {
    document.removeEventListener("scroll", this.changeOp);
  },
  methods: {
    mouseover(event) {
      const ele = event.currentTarget;
      ele.style.opacity = 0.9;
    },
    mouseleave(event) {
      const ele = event.currentTarget;
      ele.style.opacity = 1;
    },
    popover(event) {
      if (this.popup === false) {
        document.getElementById("showcaseholder").style.opacity = "0.2";
        document.getElementById("showcasepopup").style.zIndex = "5";
        document.getElementById("showcasepopup").style.opacity = "1";
        document.getElementById("pagetop").style.display = "none";
        this.image = event.currentTarget.getAttribute("src");
        this.popup = true;
        event.stopPropagation();
      } else {
        document.getElementById("showcaseholder").style.opacity = "1";
        document.getElementById("showcasepopup").style.zIndex = "-1";
        document.getElementById("showcasepopup").style.opacity = "0";
        document.getElementById("pagetop").style.display = "block";
        this.popup = false;
        event.stopPropagation();
      }
    },
    closer() {
      document.getElementById("showcaseholder").style.opacity = "1";
      document.getElementById("showcasepopup").style.zIndex = "-1";
      document.getElementById("showcasepopup").style.opacity = "0";
      document.getElementById("pagetop").style.display = "block";
      this.popup = false;
    },
    popovermobile(event) {
      const eles = document.getElementsByClassName("pic");
      for (const e of eles)
        e.style.opacity = 0.5;
      const ele = event.currentTarget;
      ele.style.opacity = 1;
    },
    changeOp() {
      const eles = document.getElementsByClassName("pic");
      for (const e of eles)
        e.style.opacity = 1;
    }
  }
};
function _sfc_ssrRender$9(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Gutter = __vite_components_0$5;
  _push(`<!--[-->`);
  _push(ssrRenderComponent(_component_Gutter, { class: "" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<div id="inlargeScreen" class="xl:pb-24 pb-12 relative" data-v-48d0d9b2${_scopeId}><div id="showcaseholder" class="showcasecontainer grid grid-rows-4 grid-flow-col justify-around border-black" style="${ssrRenderStyle({ "z-index": "0" })}" data-v-48d0d9b2${_scopeId}><img data-aos="fade-up" data-aos-anchor-placement="center-bottom"${ssrRenderAttr("src", _imports_0$2)} class="border-red-500 lazyload w-full h-full hover:cursor-pointer" style="${ssrRenderStyle({ "width": "30vw", "height": "15vw", "padding": "4px" })}" alt="showcase image" srcset="" data-v-48d0d9b2${_scopeId}><img data-aos="fade-up" data-aos-anchor-placement="center-bottom"${ssrRenderAttr("src", _imports_1$1)} class="border-red-500 lazyload hover:cursor-pointer" style="${ssrRenderStyle({ "width": "30vw", "height": "15vw", "padding": "4px" })}" alt="showcase image" srcset="" data-v-48d0d9b2${_scopeId}><img data-aos="fade-up" data-aos-anchor-placement="center-bottom"${ssrRenderAttr("src", _imports_2)} class="row-span-2 border-blue-500 lazyload object-cover hover:cursor-pointer" style="${ssrRenderStyle({ "width": "30vw", "height": "30vw", "padding": "4px" })}" alt="showcase image" srcset="" data-v-48d0d9b2${_scopeId}><img data-aos="fade-up" data-aos-anchor-placement="center-bottom"${ssrRenderAttr("src", _imports_3)} class="border-red-500 h-full w-full lazyload hover:cursor-pointer" style="${ssrRenderStyle({ "width": "30vw", "height": "15vw", "padding": "4px" })}" alt="showcase image" srcset="" data-v-48d0d9b2${_scopeId}><img data-aos="fade-up" data-aos-anchor-placement="center-bottom"${ssrRenderAttr("src", _imports_4)} class="border-red-500 h-full w-full lazyload hover:cursor-pointer" style="${ssrRenderStyle({ "width": "30vw", "height": "15vw", "padding": "4px" })}" alt="showcase image" srcset="" data-v-48d0d9b2${_scopeId}><img data-aos="fade-up" data-aos-anchor-placement="center-bottom"${ssrRenderAttr("src", _imports_5)} class="border-red-500 lazyload hover:cursor-pointer" style="${ssrRenderStyle({ "width": "30vw", "height": "15vw", "padding": "4px" })}" alt="showcase image" srcset="" data-v-48d0d9b2${_scopeId}><img data-aos="fade-up" data-aos-anchor-placement="center-bottom"${ssrRenderAttr("src", _imports_6)} class="border-red-500 lazyload hover:cursor-pointer" style="${ssrRenderStyle({ "width": "30vw", "height": "15vw", "padding": "4px" })}" alt="showcase image" srcset="" data-v-48d0d9b2${_scopeId}><img data-aos="fade-up" data-aos-anchor-placement="center-bottom"${ssrRenderAttr("src", _imports_7)} class="row-span-2 border-blue-500 w-full h-full lazyload object-cover hover:cursor-pointer" style="${ssrRenderStyle({ "width": "30vw", "height": "30vw", "padding": "4px" })}" alt="showcase image" srcset="" data-v-48d0d9b2${_scopeId}><img data-aos="fade-up" data-aos-anchor-placement="center-bottom"${ssrRenderAttr("src", _imports_8)} class="border-red-500 lazyload hover:cursor-pointer" style="${ssrRenderStyle({ "width": "30vw", "height": "15vw", "padding": "4px" })}" alt="showcase image" srcset="" data-v-48d0d9b2${_scopeId}><img data-aos="fade-up" data-aos-anchor-placement="center-bottom"${ssrRenderAttr("src", _imports_9)} class="border-red-500 lazyload hover:cursor-pointer" style="${ssrRenderStyle({ "width": "30vw", "height": "15vw", "padding": "4px" })}" alt="showcase image" srcset="" data-v-48d0d9b2${_scopeId}></div><div id="showcasepopup" data-v-48d0d9b2${_scopeId}><img class="image object-contain"${ssrRenderAttr("src", $data.image)} alt="" data-v-48d0d9b2${_scopeId}></div></div>`);
      } else {
        return [
          createVNode("div", {
            id: "inlargeScreen",
            class: "xl:pb-24 pb-12 relative"
          }, [
            createVNode("div", {
              id: "showcaseholder",
              class: "showcasecontainer grid grid-rows-4 grid-flow-col justify-around border-black",
              style: { "z-index": "0" }
            }, [
              createVNode("img", {
                "data-aos": "fade-up",
                "data-aos-anchor-placement": "center-bottom",
                src: _imports_0$2,
                class: "border-red-500 lazyload w-full h-full hover:cursor-pointer",
                style: { "width": "30vw", "height": "15vw", "padding": "4px" },
                alt: "showcase image",
                srcset: "",
                onClick: ($event) => $options.popover($event),
                onMouseover: ($event) => $options.mouseover($event),
                onMouseleave: ($event) => $options.mouseleave($event)
              }, null, 40, ["onClick", "onMouseover", "onMouseleave"]),
              createVNode("img", {
                "data-aos": "fade-up",
                "data-aos-anchor-placement": "center-bottom",
                src: _imports_1$1,
                class: "border-red-500 lazyload hover:cursor-pointer",
                style: { "width": "30vw", "height": "15vw", "padding": "4px" },
                alt: "showcase image",
                srcset: "",
                onClick: ($event) => $options.popover($event),
                onMouseover: ($event) => $options.mouseover($event),
                onMouseleave: ($event) => $options.mouseleave($event)
              }, null, 40, ["onClick", "onMouseover", "onMouseleave"]),
              createVNode("img", {
                "data-aos": "fade-up",
                "data-aos-anchor-placement": "center-bottom",
                src: _imports_2,
                class: "row-span-2 border-blue-500 lazyload object-cover hover:cursor-pointer",
                style: { "width": "30vw", "height": "30vw", "padding": "4px" },
                alt: "showcase image",
                srcset: "",
                onClick: ($event) => $options.popover($event),
                onMouseover: ($event) => $options.mouseover($event),
                onMouseleave: ($event) => $options.mouseleave($event)
              }, null, 40, ["onClick", "onMouseover", "onMouseleave"]),
              createVNode("img", {
                "data-aos": "fade-up",
                "data-aos-anchor-placement": "center-bottom",
                src: _imports_3,
                class: "border-red-500 h-full w-full lazyload hover:cursor-pointer",
                style: { "width": "30vw", "height": "15vw", "padding": "4px" },
                alt: "showcase image",
                srcset: "",
                onClick: ($event) => $options.popover($event),
                onMouseover: ($event) => $options.mouseover($event),
                onMouseleave: ($event) => $options.mouseleave($event)
              }, null, 40, ["onClick", "onMouseover", "onMouseleave"]),
              createVNode("img", {
                "data-aos": "fade-up",
                "data-aos-anchor-placement": "center-bottom",
                src: _imports_4,
                class: "border-red-500 h-full w-full lazyload hover:cursor-pointer",
                style: { "width": "30vw", "height": "15vw", "padding": "4px" },
                alt: "showcase image",
                srcset: "",
                onClick: ($event) => $options.popover($event),
                onMouseover: ($event) => $options.mouseover($event),
                onMouseleave: ($event) => $options.mouseleave($event)
              }, null, 40, ["onClick", "onMouseover", "onMouseleave"]),
              createVNode("img", {
                "data-aos": "fade-up",
                "data-aos-anchor-placement": "center-bottom",
                src: _imports_5,
                class: "border-red-500 lazyload hover:cursor-pointer",
                style: { "width": "30vw", "height": "15vw", "padding": "4px" },
                alt: "showcase image",
                srcset: "",
                onClick: ($event) => $options.popover($event),
                onMouseover: ($event) => $options.mouseover($event),
                onMouseleave: ($event) => $options.mouseleave($event)
              }, null, 40, ["onClick", "onMouseover", "onMouseleave"]),
              createVNode("img", {
                "data-aos": "fade-up",
                "data-aos-anchor-placement": "center-bottom",
                src: _imports_6,
                class: "border-red-500 lazyload hover:cursor-pointer",
                style: { "width": "30vw", "height": "15vw", "padding": "4px" },
                alt: "showcase image",
                srcset: "",
                onClick: ($event) => $options.popover($event),
                onMouseover: ($event) => $options.mouseover($event),
                onMouseleave: ($event) => $options.mouseleave($event)
              }, null, 40, ["onClick", "onMouseover", "onMouseleave"]),
              createVNode("img", {
                "data-aos": "fade-up",
                "data-aos-anchor-placement": "center-bottom",
                src: _imports_7,
                class: "row-span-2 border-blue-500 w-full h-full lazyload object-cover hover:cursor-pointer",
                style: { "width": "30vw", "height": "30vw", "padding": "4px" },
                alt: "showcase image",
                srcset: "",
                onClick: ($event) => $options.popover($event),
                onMouseover: ($event) => $options.mouseover($event),
                onMouseleave: ($event) => $options.mouseleave($event)
              }, null, 40, ["onClick", "onMouseover", "onMouseleave"]),
              createVNode("img", {
                "data-aos": "fade-up",
                "data-aos-anchor-placement": "center-bottom",
                src: _imports_8,
                class: "border-red-500 lazyload hover:cursor-pointer",
                style: { "width": "30vw", "height": "15vw", "padding": "4px" },
                alt: "showcase image",
                srcset: "",
                onClick: ($event) => $options.popover($event),
                onMouseover: ($event) => $options.mouseover($event),
                onMouseleave: ($event) => $options.mouseleave($event)
              }, null, 40, ["onClick", "onMouseover", "onMouseleave"]),
              createVNode("img", {
                "data-aos": "fade-up",
                "data-aos-anchor-placement": "center-bottom",
                src: _imports_9,
                class: "border-red-500 lazyload hover:cursor-pointer",
                style: { "width": "30vw", "height": "15vw", "padding": "4px" },
                alt: "showcase image",
                srcset: "",
                onClick: ($event) => $options.popover($event),
                onMouseover: ($event) => $options.mouseover($event),
                onMouseleave: ($event) => $options.mouseleave($event)
              }, null, 40, ["onClick", "onMouseover", "onMouseleave"])
            ]),
            createVNode("div", { id: "showcasepopup" }, [
              createVNode("img", {
                class: "image object-contain",
                src: $data.image,
                alt: ""
              }, null, 8, ["src"])
            ])
          ])
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<div id="insmallScreen" data-v-48d0d9b2><div id="showcaseholder2" class="showcasecontainer justify-around border-black pt-6 pb-12" style="${ssrRenderStyle({ "z-index": "0" })}" data-v-48d0d9b2><img${ssrRenderAttr("src", _imports_0$2)} class="pic w-full h-full py-1 lazyload" style="${ssrRenderStyle({})}" alt="showcase image" srcset="" data-v-48d0d9b2><img${ssrRenderAttr("src", _imports_1$1)} class="pic w-full h-full py-1 lazyload" style="${ssrRenderStyle({})}" alt="showcase image" srcset="" data-v-48d0d9b2><img${ssrRenderAttr("src", _imports_2)} class="pic w-full h-full py-1 lazyload" style="${ssrRenderStyle({})}" alt="showcase image" srcset="" data-v-48d0d9b2><img${ssrRenderAttr("src", _imports_3)} class="pic w-full h-full py-1 lazyload" style="${ssrRenderStyle({})}" alt="showcase image" srcset="" data-v-48d0d9b2><img${ssrRenderAttr("src", _imports_4)} class="pic w-full h-full py-1 lazyload" style="${ssrRenderStyle({})}" alt="showcase image" srcset="" data-v-48d0d9b2><img${ssrRenderAttr("src", _imports_5)} class="pic w-full h-full py-1 lazyload" style="${ssrRenderStyle({})}" alt="showcase image" srcset="" data-v-48d0d9b2><img${ssrRenderAttr("src", _imports_6)} class="pic w-full h-full py-1 lazyload" style="${ssrRenderStyle({})}" alt="showcase image" srcset="" data-v-48d0d9b2><img${ssrRenderAttr("src", _imports_7)} class="pic w-full h-full py-1 lazyload" style="${ssrRenderStyle({})}" alt="showcase image" srcset="" data-v-48d0d9b2><img${ssrRenderAttr("src", _imports_8)} class="pic w-full h-full py-1 lazyload" style="${ssrRenderStyle({})}" alt="showcase image" srcset="" data-v-48d0d9b2><img${ssrRenderAttr("src", _imports_9)} class="pic w-full h-full py-1 lazyload" style="${ssrRenderStyle({})}" alt="showcase image" srcset="" data-v-48d0d9b2></div></div><!--]-->`);
}
const _sfc_setup$h = _sfc_main$h.setup;
_sfc_main$h.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("src/components/Showcase.vue");
  return _sfc_setup$h ? _sfc_setup$h(props, ctx) : void 0;
};
var __vite_components_8 = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["ssrRender", _sfc_ssrRender$9], ["__scopeId", "data-v-48d0d9b2"]]);
var _imports_0$1 = "/assets/UnrealEngineLogo.e498a646.webp";
var _imports_1 = "/assets/NVIDIA-DLSS-2-0.ff02095b.webp";
const _sfc_main$g = {};
function _sfc_ssrRender$8(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "2xl:container 2xl:mx-auto mx-auto px-16 flex justify-center items-center space-y-8 md:space-y-12 flex-col xl:pb-24 pb-12 sm:pt-0 pt-6" }, _attrs))}><div><div class="flex justify-start items-start flex-col space-y-8 md:space-y-0 md:flex-row md:space-x-6 lg:space-x-8"><div class="w-full flex justify-center items-center space-y-6 md:space-y-8 flex-col"><div class="w-full"><img class="lg:object-cover w-full lazyload"${ssrRenderAttr("src", _imports_0$1)} alt="Unreal Engine"></div><div class="flex justify-center items-center flex-col space-y-4"><p class="md:px-2 text-center leading-6 text-gray-200"> Unreal Engine is an open source realtime graphics and game engine that is leading the way in advancing the state of real time 3D rendering. </p></div></div><div class="w-full flex justify-start items-start space-y-6 md:space-y-8 flex-col sm:pt-0 pt-8"><div class="w-full"><img class="lg:object-cover w-full lazyload"${ssrRenderAttr("src", _imports_1)} alt="NVIDIA DLSS"></div><div class="flex justify-start items-center flex-col space-y-4"><p class="md:px-2 text-center leading-6 text-gray-200"> NVIDIA DLSS is a deep learning nueral network that boosts frame rates while providing sharp visuals and increasing output resolution in ray traced 3D rendering applications. </p></div></div></div></div></div>`);
}
const _sfc_setup$g = _sfc_main$g.setup;
_sfc_main$g.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("src/components/Technology1.vue");
  return _sfc_setup$g ? _sfc_setup$g(props, ctx) : void 0;
};
var __vite_components_9 = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["ssrRender", _sfc_ssrRender$8]]);
const _sfc_main$f = {
  methods: {
    submitBtn() {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      const eml = document.getElementById("email2");
      const emailid = document.getElementById("email2").value;
      const raw = {
        fields: [
          {
            name: "email",
            value: ""
          }
        ]
      };
      raw.fields[0].value = emailid;
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(raw),
        redirect: "follow"
      };
      fetch("https://api.hsforms.com/submissions/v3/integration/submit/7572988/a6a64e77-7f72-46d3-9a47-d0dab7466c5a", requestOptions).then((result) => {
        if (result.ok && emailid !== null) {
          alert("Thankyou for subscribing!!");
          eml.ariaPlaceholder = "Thankyou!!";
          eml.value = "";
        } else {
          eml.ariaPlaceholder = "Enter Your Email";
          eml.value = "";
          throw new Error("Something went wrong");
        }
      }).catch((error) => {
        eml.ariaPlaceholder = "Invalid Email";
      });
    }
  }
};
function _sfc_ssrRender$7(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "xl:pb-24 pb-12 sm:pt-0 pt-8" }, _attrs))}><div class="w-full bg-fixed bg-cover xl:py-24 py-12 lazyload" style="${ssrRenderStyle({ "background-image": "URL(/NEWRENDERS/ASH_BATHROOM_3.jpeg)" })}"><div class="container mx-auto"><div data-aos="zoom-out" class="xl:w-3/5 lg:w-3/5 w-10/12 mx-auto p-8 bg-black bg-opacity-60"><h1 class="xl:text-5xl lg:text-5xl text-3xl text-shadow-xl text-center text-gray-200 pb-8"> Sign Up for the <span class="font-bold">FREE BETA</span></h1><p class="text-xl text-center text-gray-200 pb-16 xl:w-10/12 mx-auto"> You can subscribe to our newsletter to get to know about our latest products and exciting offers. </p><div class="flex flex-col xl:flex-row lg:flex-row md:flex-row w-full justify-center"><input id="email2" type="text" placeholder="Your Email" aria-label="email" class="focus:outline-none xl:w-6/12 lg:w-9/12 w-full mb-2 xl:mb-0 lg:mb-0 md:mb-0 md:w-8/12 py-3 px-4 focus:border-our-blue border border-white rounded shadow text-black"><button id="ClickSubscribeButton2" class="focus:outline-none font-bold hidden xl:block lg:block md:block sm:block bg-our-blue focus:our-blue py-3 px-8 rounded text-gray-200 hover:ring-2 hover:ring-our-blue text-lg xl:ml-5 lg:ml-5 md:ml-5 bg-opacity-100"> Subscribe </button><button id="ClickSubscribeMobileButton2" class="focus:outline-none font-bold block xl:hidden lg:hidden md:hidden sm:hidden bg-our-blue focus:our-blue transition duration-150 ease-in-out hover:ring-2 hover:ring-our-blue rounded text-gray-200 px-6 py-2 text-sm mt-2"> Subscribe </button></div></div></div></div></div>`);
}
const _sfc_setup$f = _sfc_main$f.setup;
_sfc_main$f.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("src/components/CTA2.vue");
  return _sfc_setup$f ? _sfc_setup$f(props, ctx) : void 0;
};
var __vite_components_10 = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["ssrRender", _sfc_ssrRender$7]]);
;
var FAQ_vue_vue_type_style_index_0_scoped_true_lang = "";
const _sfc_main$e = {
  name: "GrayBgSimple",
  mounted() {
    this.registerClickEventListener();
  },
  methods: {
    registerClickEventListener() {
      const faqs = document.getElementsByClassName("faq");
      for (let i = 0; i < faqs.length; i++) {
        faqs[i].addEventListener("click", (e) => {
          e.stopPropagation();
          console.log(e.currentTarget);
          e.preventDefault();
          const target = e.currentTarget;
          const plusIcon = target.querySelector("[data-plus]");
          const minusIcon = target.querySelector("[data-minus]");
          const content = target.querySelector("[data-content]");
          content.classList.toggle("hidden");
          if (content.classList.contains("hidden")) {
            plusIcon.style.display = "block";
            minusIcon.style.display = "none";
          } else {
            plusIcon.style.display = "none";
            minusIcon.style.display = "block";
          }
        }, true);
      }
    }
  }
};
function _sfc_ssrRender$6(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Gutter = __vite_components_0$5;
  _push(ssrRenderComponent(_component_Gutter, mergeProps({ class: "" }, _attrs), {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<div class="xl:pb-24 pb-12 sm:pt-0 pt-6" data-v-949e8f78${_scopeId}><div class="w-full" data-v-949e8f78${_scopeId}><ul data-v-949e8f78${_scopeId}><li class="faq py-6 border-gray-200 border-solid border-b" data-v-949e8f78${_scopeId}><div class="flex justify-between items-center cursor-pointer" data-v-949e8f78${_scopeId}><p class="text-gray-200 text-base md:text-xl xl:text-2xl w-10/12 dark:text-gray-200" data-v-949e8f78${_scopeId}> What is Renderpub? </p><div data-menu class="cursor-pointer" data-v-949e8f78${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" data-plus class="hidden icon icon-tabler icon-tabler-circle-plus" width="36" height="36" viewBox="0 0 24 24" stroke-width="1.5" stroke="#A0AEC0" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-label="Open" data-v-949e8f78${_scopeId}><path stroke="none" d="M0 0h24v24H0z" data-v-949e8f78${_scopeId}></path><circle cx="12" cy="12" r="9" data-v-949e8f78${_scopeId}></circle><line x1="9" y1="12" x2="15" y2="12" data-v-949e8f78${_scopeId}></line><line x1="12" y1="9" x2="12" y2="15" data-v-949e8f78${_scopeId}></line></svg><svg xmlns="http://www.w3.org/2000/svg" data-minus class="icon icon-tabler icon-tabler-circle-minus" width="36" height="36" viewBox="0 0 24 24" stroke-width="1.5" stroke="#A0AEC0" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-label="Close" data-v-949e8f78${_scopeId}><path stroke="none" d="M0 0h24v24H0z" data-v-949e8f78${_scopeId}></path><circle cx="12" cy="12" r="9" data-v-949e8f78${_scopeId}></circle><line x1="9" y1="12" x2="15" y2="12" data-v-949e8f78${_scopeId}></line></svg></div></div><div data-content class="pt-2 md:pt-3 lg:pt-5 px-4 md:px-8 text-gray-200 text-sm md:text-base xl:text-lg rounded-b-lg dark:text-gray-200" data-v-949e8f78${_scopeId}> Renderpub is a software suite built for architectural visualization use cases. It consists of <ol class="px-4 md:px-8 text-gray-200 text-sm md:text-base xl:text-lg rounded-b-lg dark:text-gray-200" data-v-949e8f78${_scopeId}><li data-v-949e8f78${_scopeId}>Renderpub Studio - A real time, ray traced, rendering application to produce highly photorealistic images, videos and interactive VR experiences from 3D models.</li><li data-v-949e8f78${_scopeId}>Renderpub Spaces - A web platform to experience architectural spaces interactively and immersively in VR</li><li data-v-949e8f78${_scopeId}>Renderpub Stitch - An application to convert 3D models to interactive VR walkthroughs using pre rendered panoramic images.</li></ol></div></li><li class="faq py-6 border-gray-200 border-solid border-b" data-v-949e8f78${_scopeId}><div class="flex justify-between items-center cursor-pointer" data-v-949e8f78${_scopeId}><p class="text-gray-200 text-base md:text-xl xl:text-2xl w-10/12 dark:text-gray-200" data-v-949e8f78${_scopeId}> How do I get started? </p><div data-menu class="cursor-pointer" data-v-949e8f78${_scopeId}><svg data-plus xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-circle-plus" width="36" height="36" viewBox="0 0 24 24" stroke-width="1.5" stroke="#A0AEC0" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-label="Open" data-v-949e8f78${_scopeId}><path stroke="none" d="M0 0h24v24H0z" data-v-949e8f78${_scopeId}></path><circle cx="12" cy="12" r="9" data-v-949e8f78${_scopeId}></circle><line x1="9" y1="12" x2="15" y2="12" data-v-949e8f78${_scopeId}></line><line x1="12" y1="9" x2="12" y2="15" data-v-949e8f78${_scopeId}></line></svg><svg data-minus xmlns="http://www.w3.org/2000/svg" class="hidden icon icon-tabler icon-tabler-circle-minus" width="36" height="36" viewBox="0 0 24 24" stroke-width="1.5" stroke="#A0AEC0" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-label="Close" data-v-949e8f78${_scopeId}><path stroke="none" d="M0 0h24v24H0z" data-v-949e8f78${_scopeId}></path><circle cx="12" cy="12" r="9" data-v-949e8f78${_scopeId}></circle><line x1="9" y1="12" x2="15" y2="12" data-v-949e8f78${_scopeId}></line></svg></div></div><p data-content class="hidden pt-2 md:pt-3 lg:pt-5 text-gray-200 px-4 md:px-8 text-sm md:text-base xl:text-lg rounded-b-lg dark:text-gray-200" data-v-949e8f78${_scopeId}> The best way to get started with the Renderpub Suite is by downloading the launcher which will be made available at beta launch time. </p></li><li class="faq py-6 border-gray-200 border-solid border-b" data-v-949e8f78${_scopeId}><div class="flex justify-between items-center cursor-pointer" data-v-949e8f78${_scopeId}><p class="text-gray-200 text-base md:text-xl xl:text-2xl w-10/12 dark:text-gray-200" data-v-949e8f78${_scopeId}> How does Renderpub integrate with other software? </p><div data-menu class="cursor-pointer" data-v-949e8f78${_scopeId}><svg data-plus xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-circle-plus" width="36" height="36" viewBox="0 0 24 24" stroke-width="1.5" stroke="#A0AEC0" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-label="Open" data-v-949e8f78${_scopeId}><path stroke="none" d="M0 0h24v24H0z" data-v-949e8f78${_scopeId}></path><circle cx="12" cy="12" r="9" data-v-949e8f78${_scopeId}></circle><line x1="9" y1="12" x2="15" y2="12" data-v-949e8f78${_scopeId}></line><line x1="12" y1="9" x2="12" y2="15" data-v-949e8f78${_scopeId}></line></svg><svg data-minus xmlns="http://www.w3.org/2000/svg" class="hidden icon icon-tabler icon-tabler-circle-minus" width="36" height="36" viewBox="0 0 24 24" stroke-width="1.5" stroke="#A0AEC0" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-label="Close" data-v-949e8f78${_scopeId}><path stroke="none" d="M0 0h24v24H0z" data-v-949e8f78${_scopeId}></path><circle cx="12" cy="12" r="9" data-v-949e8f78${_scopeId}></circle><line x1="9" y1="12" x2="15" y2="12" data-v-949e8f78${_scopeId}></line></svg></div></div><p data-content class="hidden pt-2 md:pt-3 lg:pt-5 text-gray-200 px-4 md:px-8 text-sm md:text-base xl:text-lg rounded-b-lg dark:text-gray-200" data-v-949e8f78${_scopeId}> Renderpub Studio can import 3D models created in any 3D modeling software when exported to fbx, obj, dae, gltf, 3ds and 3dm formats. In addition to importing, there are DirectLink Plugins for real time syncing of scenes between Renderpub Studio and 3D modeling applications like SketchUp, Archicad, Rhino, Revit, and 3ds Max. </p></li><li class="faq py-6 border-gray-200 border-solid border-b" data-v-949e8f78${_scopeId}><div class="flex justify-between items-center cursor-pointer" data-v-949e8f78${_scopeId}><p class="text-gray-200 text-base md:text-xl xl:text-2xl w-10/12 dark:text-gray-200" data-v-949e8f78${_scopeId}> What is the pricing model? </p><div data-menu class="cursor-pointer" data-v-949e8f78${_scopeId}><svg data-plus xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-circle-plus" width="36" height="36" viewBox="0 0 24 24" stroke-width="1.5" stroke="#A0AEC0" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-label="Open" data-v-949e8f78${_scopeId}><path stroke="none" d="M0 0h24v24H0z" data-v-949e8f78${_scopeId}></path><circle cx="12" cy="12" r="9" data-v-949e8f78${_scopeId}></circle><line x1="9" y1="12" x2="15" y2="12" data-v-949e8f78${_scopeId}></line><line x1="12" y1="9" x2="12" y2="15" data-v-949e8f78${_scopeId}></line></svg><svg data-minus xmlns="http://www.w3.org/2000/svg" class="hidden icon icon-tabler icon-tabler-circle-minus" width="36" height="36" viewBox="0 0 24 24" stroke-width="1.5" stroke="#A0AEC0" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-label="Close" data-v-949e8f78${_scopeId}><path stroke="none" d="M0 0h24v24H0z" data-v-949e8f78${_scopeId}></path><circle cx="12" cy="12" r="9" data-v-949e8f78${_scopeId}></circle><line x1="9" y1="12" x2="15" y2="12" data-v-949e8f78${_scopeId}></line></svg></div></div><p data-content class="hidden pt-2 md:pt-3 lg:pt-5 text-gray-200 px-4 md:px-8 text-sm md:text-base xl:text-lg rounded-b-lg dark:text-gray-200" data-v-949e8f78${_scopeId}> All products in the Renderpub Suite are free for all purposes during the beta run. Definitive pricing will be made available before production release. </p></li><li class="faq py-6 border-gray-200 border-solid border-b" data-v-949e8f78${_scopeId}><div class="flex justify-between items-center cursor-pointer" data-v-949e8f78${_scopeId}><p class="text-gray-200 text-base md:text-xl xl:text-2xl w-10/12 dark:text-gray-200" data-v-949e8f78${_scopeId}> What are the minimum system requirements to run Renderpub Suite? </p><div data-menu class="cursor-pointer" data-v-949e8f78${_scopeId}><svg data-plus xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-circle-plus" width="36" height="36" viewBox="0 0 24 24" stroke-width="1.5" stroke="#A0AEC0" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-label="Open" data-v-949e8f78${_scopeId}><path stroke="none" d="M0 0h24v24H0z" data-v-949e8f78${_scopeId}></path><circle cx="12" cy="12" r="9" data-v-949e8f78${_scopeId}></circle><line x1="9" y1="12" x2="15" y2="12" data-v-949e8f78${_scopeId}></line><line x1="12" y1="9" x2="12" y2="15" data-v-949e8f78${_scopeId}></line></svg><svg data-minus xmlns="http://www.w3.org/2000/svg" class="hidden icon icon-tabler icon-tabler-circle-minus" width="36" height="36" viewBox="0 0 24 24" stroke-width="1.5" stroke="#A0AEC0" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-label="Close" data-v-949e8f78${_scopeId}><path stroke="none" d="M0 0h24v24H0z" data-v-949e8f78${_scopeId}></path><circle cx="12" cy="12" r="9" data-v-949e8f78${_scopeId}></circle><line x1="9" y1="12" x2="15" y2="12" data-v-949e8f78${_scopeId}></line></svg></div></div><div data-content class="hidden pt-2 md:pt-3 lg:pt-5 text-gray-200 px-4 md:px-8 text-sm md:text-base xl:text-lg rounded-b-lg dark:text-gray-200" data-v-949e8f78${_scopeId}><ul class="pt-2 md:pt-3 lg:pt-5 text-gray-200 px-4 md:px-8 text-sm md:text-base xl:text-lg rounded-b-lg dark:text-gray-200" data-v-949e8f78${_scopeId}><li data-v-949e8f78${_scopeId}>Renderpub Studio:<br data-v-949e8f78${_scopeId}><ol data-v-949e8f78${_scopeId}><li data-v-949e8f78${_scopeId}>OS: 64bit Windows10</li><li data-v-949e8f78${_scopeId}>GPU: GTX 1060 6GB or higher, DX12 and RTX compatible</li><li data-v-949e8f78${_scopeId}>Memory: 16GB RAM, 40GB Disk Space</li><li data-v-949e8f78${_scopeId}>CPU: Benchmark score &gt; 2000</li></ol></li><li class="pt-6" data-v-949e8f78${_scopeId}> Renderpub Spaces:<br data-v-949e8f78${_scopeId}> Any device that can run a modern web browser </li><li class="pt-6" data-v-949e8f78${_scopeId}>Renderpub Stitch:<br data-v-949e8f78${_scopeId}><ol data-v-949e8f78${_scopeId}><li data-v-949e8f78${_scopeId}>OS: Windows10 v1809 and higher with DirectX 12</li><li data-v-949e8f78${_scopeId}>GPU: DirectX 11 compatible</li><li data-v-949e8f78${_scopeId}>Memory: 8GB RAM, 2GB Disk Space</li><li data-v-949e8f78${_scopeId}>CPU: Benchmark score &gt; 2000</li></ol></li></ul></div></li><li class="faq py-6 border-gray-200 border-solid border-b" data-v-949e8f78${_scopeId}><div class="flex justify-between items-center cursor-pointer" data-v-949e8f78${_scopeId}><p class="text-gray-200 text-base md:text-xl xl:text-2xl w-10/12 dark:text-gray-200" data-v-949e8f78${_scopeId}> Do I need a Head Mounted Display (HMD) to use Renderpub? </p><div data-menu class="cursor-pointer" data-v-949e8f78${_scopeId}><svg data-plus xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-circle-plus" width="36" height="36" viewBox="0 0 24 24" stroke-width="1.5" stroke="#A0AEC0" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-label="Open" data-v-949e8f78${_scopeId}><path stroke="none" d="M0 0h24v24H0z" data-v-949e8f78${_scopeId}></path><circle cx="12" cy="12" r="9" data-v-949e8f78${_scopeId}></circle><line x1="9" y1="12" x2="15" y2="12" data-v-949e8f78${_scopeId}></line><line x1="12" y1="9" x2="12" y2="15" data-v-949e8f78${_scopeId}></line></svg><svg data-minus xmlns="http://www.w3.org/2000/svg" class="hidden icon icon-tabler icon-tabler-circle-minus" width="36" height="36" viewBox="0 0 24 24" stroke-width="1.5" stroke="#A0AEC0" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-label="Close" data-v-949e8f78${_scopeId}><path stroke="none" d="M0 0h24v24H0z" data-v-949e8f78${_scopeId}></path><circle cx="12" cy="12" r="9" data-v-949e8f78${_scopeId}></circle><line x1="9" y1="12" x2="15" y2="12" data-v-949e8f78${_scopeId}></line></svg></div></div><p data-content class="hidden pt-2 md:pt-3 lg:pt-5 text-gray-200 px-4 md:px-8 text-sm md:text-base xl:text-lg rounded-b-lg dark:text-gray-200" data-v-949e8f78${_scopeId}> While an HMD is not necessary, the interactive walkthroughs on Renderpub Spaces can be viewed immersively in VR using an HMD. </p></li><li class="faq py-6 border-gray-200 border-solid border-b" data-v-949e8f78${_scopeId}><div class="flex justify-between items-center cursor-pointer" data-v-949e8f78${_scopeId}><p class="text-gray-200 text-base md:text-xl xl:text-2xl w-10/12 dark:text-gray-200" data-v-949e8f78${_scopeId}> Where can I find support? </p><div data-menu class="cursor-pointer" data-v-949e8f78${_scopeId}><svg data-plus xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-circle-plus" width="36" height="36" viewBox="0 0 24 24" stroke-width="1.5" stroke="#A0AEC0" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-label="Open" data-v-949e8f78${_scopeId}><path stroke="none" d="M0 0h24v24H0z" data-v-949e8f78${_scopeId}></path><circle cx="12" cy="12" r="9" data-v-949e8f78${_scopeId}></circle><line x1="9" y1="12" x2="15" y2="12" data-v-949e8f78${_scopeId}></line><line x1="12" y1="9" x2="12" y2="15" data-v-949e8f78${_scopeId}></line></svg><svg data-minus xmlns="http://www.w3.org/2000/svg" class="hidden icon icon-tabler icon-tabler-circle-minus" width="36" height="36" viewBox="0 0 24 24" stroke-width="1.5" stroke="#A0AEC0" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-label="Close" data-v-949e8f78${_scopeId}><path stroke="none" d="M0 0h24v24H0z" data-v-949e8f78${_scopeId}></path><circle cx="12" cy="12" r="9" data-v-949e8f78${_scopeId}></circle><line x1="9" y1="12" x2="15" y2="12" data-v-949e8f78${_scopeId}></line></svg></div></div><p data-content class="hidden pt-2 md:pt-3 lg:pt-5 text-gray-200 px-4 md:px-8 text-sm md:text-base xl:text-lg rounded-b-lg dark:text-gray-200" data-v-949e8f78${_scopeId}> The best place to find community and support is the Renderpub <a id="discordlink" href="https://discord.gg/KtYtxfzs" target="_blank" style="${ssrRenderStyle({ "text-decoration": "underline" })}" data-v-949e8f78${_scopeId}>Discord Server.</a> Additionally, you can reach us at info@renderpub.com for correspondence. </p></li><li class="faq py-6 border-gray-200 border-solid border-b" data-v-949e8f78${_scopeId}><div class="flex justify-between items-center cursor-pointer" data-v-949e8f78${_scopeId}><p class="text-gray-200 text-base md:text-xl xl:text-2xl w-10/12 dark:text-gray-200" data-v-949e8f78${_scopeId}> Where can I find learning resources? </p><div data-menu class="cursor-pointer" data-v-949e8f78${_scopeId}><svg data-plus xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-circle-plus" width="36" height="36" viewBox="0 0 24 24" stroke-width="1.5" stroke="#A0AEC0" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-label="Open" data-v-949e8f78${_scopeId}><path stroke="none" d="M0 0h24v24H0z" data-v-949e8f78${_scopeId}></path><circle cx="12" cy="12" r="9" data-v-949e8f78${_scopeId}></circle><line x1="9" y1="12" x2="15" y2="12" data-v-949e8f78${_scopeId}></line><line x1="12" y1="9" x2="12" y2="15" data-v-949e8f78${_scopeId}></line></svg><svg data-minus xmlns="http://www.w3.org/2000/svg" class="hidden icon icon-tabler icon-tabler-circle-minus" width="36" height="36" viewBox="0 0 24 24" stroke-width="1.5" stroke="#A0AEC0" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-label="Close" data-v-949e8f78${_scopeId}><path stroke="none" d="M0 0h24v24H0z" data-v-949e8f78${_scopeId}></path><circle cx="12" cy="12" r="9" data-v-949e8f78${_scopeId}></circle><line x1="9" y1="12" x2="15" y2="12" data-v-949e8f78${_scopeId}></line></svg></div></div><p data-content class="hidden pt-2 md:pt-3 lg:pt-5 text-gray-200 px-4 md:px-8 text-sm md:text-base xl:text-lg rounded-b-lg dark:text-gray-200" data-v-949e8f78${_scopeId}> A video tutorial series will be posted on youtube that will help users get familiar with the tools. Documentation and in-app tutorials are also being worked on and will be made available during the beta phase. </p></li></ul></div></div>`);
      } else {
        return [
          createVNode("div", { class: "xl:pb-24 pb-12 sm:pt-0 pt-6" }, [
            createVNode("div", { class: "w-full" }, [
              createVNode("ul", null, [
                createVNode("li", { class: "faq py-6 border-gray-200 border-solid border-b" }, [
                  createVNode("div", { class: "flex justify-between items-center cursor-pointer" }, [
                    createVNode("p", { class: "text-gray-200 text-base md:text-xl xl:text-2xl w-10/12 dark:text-gray-200" }, " What is Renderpub? "),
                    createVNode("div", {
                      "data-menu": "",
                      class: "cursor-pointer"
                    }, [
                      (openBlock(), createBlock("svg", {
                        xmlns: "http://www.w3.org/2000/svg",
                        "data-plus": "",
                        class: "hidden icon icon-tabler icon-tabler-circle-plus",
                        width: "36",
                        height: "36",
                        viewBox: "0 0 24 24",
                        "stroke-width": "1.5",
                        stroke: "#A0AEC0",
                        fill: "none",
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "aria-label": "Open"
                      }, [
                        createVNode("path", {
                          stroke: "none",
                          d: "M0 0h24v24H0z"
                        }),
                        createVNode("circle", {
                          cx: "12",
                          cy: "12",
                          r: "9"
                        }),
                        createVNode("line", {
                          x1: "9",
                          y1: "12",
                          x2: "15",
                          y2: "12"
                        }),
                        createVNode("line", {
                          x1: "12",
                          y1: "9",
                          x2: "12",
                          y2: "15"
                        })
                      ])),
                      (openBlock(), createBlock("svg", {
                        xmlns: "http://www.w3.org/2000/svg",
                        "data-minus": "",
                        class: "icon icon-tabler icon-tabler-circle-minus",
                        width: "36",
                        height: "36",
                        viewBox: "0 0 24 24",
                        "stroke-width": "1.5",
                        stroke: "#A0AEC0",
                        fill: "none",
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "aria-label": "Close"
                      }, [
                        createVNode("path", {
                          stroke: "none",
                          d: "M0 0h24v24H0z"
                        }),
                        createVNode("circle", {
                          cx: "12",
                          cy: "12",
                          r: "9"
                        }),
                        createVNode("line", {
                          x1: "9",
                          y1: "12",
                          x2: "15",
                          y2: "12"
                        })
                      ]))
                    ])
                  ]),
                  createVNode("div", {
                    "data-content": "",
                    class: "pt-2 md:pt-3 lg:pt-5 px-4 md:px-8 text-gray-200 text-sm md:text-base xl:text-lg rounded-b-lg dark:text-gray-200"
                  }, [
                    createTextVNode(" Renderpub is a software suite built for architectural visualization use cases. It consists of "),
                    createVNode("ol", { class: "px-4 md:px-8 text-gray-200 text-sm md:text-base xl:text-lg rounded-b-lg dark:text-gray-200" }, [
                      createVNode("li", null, "Renderpub Studio - A real time, ray traced, rendering application to produce highly photorealistic images, videos and interactive VR experiences from 3D models."),
                      createVNode("li", null, "Renderpub Spaces - A web platform to experience architectural spaces interactively and immersively in VR"),
                      createVNode("li", null, "Renderpub Stitch - An application to convert 3D models to interactive VR walkthroughs using pre rendered panoramic images.")
                    ])
                  ])
                ]),
                createVNode("li", { class: "faq py-6 border-gray-200 border-solid border-b" }, [
                  createVNode("div", { class: "flex justify-between items-center cursor-pointer" }, [
                    createVNode("p", { class: "text-gray-200 text-base md:text-xl xl:text-2xl w-10/12 dark:text-gray-200" }, " How do I get started? "),
                    createVNode("div", {
                      "data-menu": "",
                      class: "cursor-pointer"
                    }, [
                      (openBlock(), createBlock("svg", {
                        "data-plus": "",
                        xmlns: "http://www.w3.org/2000/svg",
                        class: "icon icon-tabler icon-tabler-circle-plus",
                        width: "36",
                        height: "36",
                        viewBox: "0 0 24 24",
                        "stroke-width": "1.5",
                        stroke: "#A0AEC0",
                        fill: "none",
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "aria-label": "Open"
                      }, [
                        createVNode("path", {
                          stroke: "none",
                          d: "M0 0h24v24H0z"
                        }),
                        createVNode("circle", {
                          cx: "12",
                          cy: "12",
                          r: "9"
                        }),
                        createVNode("line", {
                          x1: "9",
                          y1: "12",
                          x2: "15",
                          y2: "12"
                        }),
                        createVNode("line", {
                          x1: "12",
                          y1: "9",
                          x2: "12",
                          y2: "15"
                        })
                      ])),
                      (openBlock(), createBlock("svg", {
                        "data-minus": "",
                        xmlns: "http://www.w3.org/2000/svg",
                        class: "hidden icon icon-tabler icon-tabler-circle-minus",
                        width: "36",
                        height: "36",
                        viewBox: "0 0 24 24",
                        "stroke-width": "1.5",
                        stroke: "#A0AEC0",
                        fill: "none",
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "aria-label": "Close"
                      }, [
                        createVNode("path", {
                          stroke: "none",
                          d: "M0 0h24v24H0z"
                        }),
                        createVNode("circle", {
                          cx: "12",
                          cy: "12",
                          r: "9"
                        }),
                        createVNode("line", {
                          x1: "9",
                          y1: "12",
                          x2: "15",
                          y2: "12"
                        })
                      ]))
                    ])
                  ]),
                  createVNode("p", {
                    "data-content": "",
                    class: "hidden pt-2 md:pt-3 lg:pt-5 text-gray-200 px-4 md:px-8 text-sm md:text-base xl:text-lg rounded-b-lg dark:text-gray-200"
                  }, " The best way to get started with the Renderpub Suite is by downloading the launcher which will be made available at beta launch time. ")
                ]),
                createVNode("li", { class: "faq py-6 border-gray-200 border-solid border-b" }, [
                  createVNode("div", { class: "flex justify-between items-center cursor-pointer" }, [
                    createVNode("p", { class: "text-gray-200 text-base md:text-xl xl:text-2xl w-10/12 dark:text-gray-200" }, " How does Renderpub integrate with other software? "),
                    createVNode("div", {
                      "data-menu": "",
                      class: "cursor-pointer"
                    }, [
                      (openBlock(), createBlock("svg", {
                        "data-plus": "",
                        xmlns: "http://www.w3.org/2000/svg",
                        class: "icon icon-tabler icon-tabler-circle-plus",
                        width: "36",
                        height: "36",
                        viewBox: "0 0 24 24",
                        "stroke-width": "1.5",
                        stroke: "#A0AEC0",
                        fill: "none",
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "aria-label": "Open"
                      }, [
                        createVNode("path", {
                          stroke: "none",
                          d: "M0 0h24v24H0z"
                        }),
                        createVNode("circle", {
                          cx: "12",
                          cy: "12",
                          r: "9"
                        }),
                        createVNode("line", {
                          x1: "9",
                          y1: "12",
                          x2: "15",
                          y2: "12"
                        }),
                        createVNode("line", {
                          x1: "12",
                          y1: "9",
                          x2: "12",
                          y2: "15"
                        })
                      ])),
                      (openBlock(), createBlock("svg", {
                        "data-minus": "",
                        xmlns: "http://www.w3.org/2000/svg",
                        class: "hidden icon icon-tabler icon-tabler-circle-minus",
                        width: "36",
                        height: "36",
                        viewBox: "0 0 24 24",
                        "stroke-width": "1.5",
                        stroke: "#A0AEC0",
                        fill: "none",
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "aria-label": "Close"
                      }, [
                        createVNode("path", {
                          stroke: "none",
                          d: "M0 0h24v24H0z"
                        }),
                        createVNode("circle", {
                          cx: "12",
                          cy: "12",
                          r: "9"
                        }),
                        createVNode("line", {
                          x1: "9",
                          y1: "12",
                          x2: "15",
                          y2: "12"
                        })
                      ]))
                    ])
                  ]),
                  createVNode("p", {
                    "data-content": "",
                    class: "hidden pt-2 md:pt-3 lg:pt-5 text-gray-200 px-4 md:px-8 text-sm md:text-base xl:text-lg rounded-b-lg dark:text-gray-200"
                  }, " Renderpub Studio can import 3D models created in any 3D modeling software when exported to fbx, obj, dae, gltf, 3ds and 3dm formats. In addition to importing, there are DirectLink Plugins for real time syncing of scenes between Renderpub Studio and 3D modeling applications like SketchUp, Archicad, Rhino, Revit, and 3ds Max. ")
                ]),
                createVNode("li", { class: "faq py-6 border-gray-200 border-solid border-b" }, [
                  createVNode("div", { class: "flex justify-between items-center cursor-pointer" }, [
                    createVNode("p", { class: "text-gray-200 text-base md:text-xl xl:text-2xl w-10/12 dark:text-gray-200" }, " What is the pricing model? "),
                    createVNode("div", {
                      "data-menu": "",
                      class: "cursor-pointer"
                    }, [
                      (openBlock(), createBlock("svg", {
                        "data-plus": "",
                        xmlns: "http://www.w3.org/2000/svg",
                        class: "icon icon-tabler icon-tabler-circle-plus",
                        width: "36",
                        height: "36",
                        viewBox: "0 0 24 24",
                        "stroke-width": "1.5",
                        stroke: "#A0AEC0",
                        fill: "none",
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "aria-label": "Open"
                      }, [
                        createVNode("path", {
                          stroke: "none",
                          d: "M0 0h24v24H0z"
                        }),
                        createVNode("circle", {
                          cx: "12",
                          cy: "12",
                          r: "9"
                        }),
                        createVNode("line", {
                          x1: "9",
                          y1: "12",
                          x2: "15",
                          y2: "12"
                        }),
                        createVNode("line", {
                          x1: "12",
                          y1: "9",
                          x2: "12",
                          y2: "15"
                        })
                      ])),
                      (openBlock(), createBlock("svg", {
                        "data-minus": "",
                        xmlns: "http://www.w3.org/2000/svg",
                        class: "hidden icon icon-tabler icon-tabler-circle-minus",
                        width: "36",
                        height: "36",
                        viewBox: "0 0 24 24",
                        "stroke-width": "1.5",
                        stroke: "#A0AEC0",
                        fill: "none",
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "aria-label": "Close"
                      }, [
                        createVNode("path", {
                          stroke: "none",
                          d: "M0 0h24v24H0z"
                        }),
                        createVNode("circle", {
                          cx: "12",
                          cy: "12",
                          r: "9"
                        }),
                        createVNode("line", {
                          x1: "9",
                          y1: "12",
                          x2: "15",
                          y2: "12"
                        })
                      ]))
                    ])
                  ]),
                  createVNode("p", {
                    "data-content": "",
                    class: "hidden pt-2 md:pt-3 lg:pt-5 text-gray-200 px-4 md:px-8 text-sm md:text-base xl:text-lg rounded-b-lg dark:text-gray-200"
                  }, " All products in the Renderpub Suite are free for all purposes during the beta run. Definitive pricing will be made available before production release. ")
                ]),
                createVNode("li", { class: "faq py-6 border-gray-200 border-solid border-b" }, [
                  createVNode("div", { class: "flex justify-between items-center cursor-pointer" }, [
                    createVNode("p", { class: "text-gray-200 text-base md:text-xl xl:text-2xl w-10/12 dark:text-gray-200" }, " What are the minimum system requirements to run Renderpub Suite? "),
                    createVNode("div", {
                      "data-menu": "",
                      class: "cursor-pointer"
                    }, [
                      (openBlock(), createBlock("svg", {
                        "data-plus": "",
                        xmlns: "http://www.w3.org/2000/svg",
                        class: "icon icon-tabler icon-tabler-circle-plus",
                        width: "36",
                        height: "36",
                        viewBox: "0 0 24 24",
                        "stroke-width": "1.5",
                        stroke: "#A0AEC0",
                        fill: "none",
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "aria-label": "Open"
                      }, [
                        createVNode("path", {
                          stroke: "none",
                          d: "M0 0h24v24H0z"
                        }),
                        createVNode("circle", {
                          cx: "12",
                          cy: "12",
                          r: "9"
                        }),
                        createVNode("line", {
                          x1: "9",
                          y1: "12",
                          x2: "15",
                          y2: "12"
                        }),
                        createVNode("line", {
                          x1: "12",
                          y1: "9",
                          x2: "12",
                          y2: "15"
                        })
                      ])),
                      (openBlock(), createBlock("svg", {
                        "data-minus": "",
                        xmlns: "http://www.w3.org/2000/svg",
                        class: "hidden icon icon-tabler icon-tabler-circle-minus",
                        width: "36",
                        height: "36",
                        viewBox: "0 0 24 24",
                        "stroke-width": "1.5",
                        stroke: "#A0AEC0",
                        fill: "none",
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "aria-label": "Close"
                      }, [
                        createVNode("path", {
                          stroke: "none",
                          d: "M0 0h24v24H0z"
                        }),
                        createVNode("circle", {
                          cx: "12",
                          cy: "12",
                          r: "9"
                        }),
                        createVNode("line", {
                          x1: "9",
                          y1: "12",
                          x2: "15",
                          y2: "12"
                        })
                      ]))
                    ])
                  ]),
                  createVNode("div", {
                    "data-content": "",
                    class: "hidden pt-2 md:pt-3 lg:pt-5 text-gray-200 px-4 md:px-8 text-sm md:text-base xl:text-lg rounded-b-lg dark:text-gray-200"
                  }, [
                    createVNode("ul", { class: "pt-2 md:pt-3 lg:pt-5 text-gray-200 px-4 md:px-8 text-sm md:text-base xl:text-lg rounded-b-lg dark:text-gray-200" }, [
                      createVNode("li", null, [
                        createTextVNode("Renderpub Studio:"),
                        createVNode("br"),
                        createVNode("ol", null, [
                          createVNode("li", null, "OS: 64bit Windows10"),
                          createVNode("li", null, "GPU: GTX 1060 6GB or higher, DX12 and RTX compatible"),
                          createVNode("li", null, "Memory: 16GB RAM, 40GB Disk Space"),
                          createVNode("li", null, "CPU: Benchmark score > 2000")
                        ])
                      ]),
                      createVNode("li", { class: "pt-6" }, [
                        createTextVNode(" Renderpub Spaces:"),
                        createVNode("br"),
                        createTextVNode(" Any device that can run a modern web browser ")
                      ]),
                      createVNode("li", { class: "pt-6" }, [
                        createTextVNode("Renderpub Stitch:"),
                        createVNode("br"),
                        createVNode("ol", null, [
                          createVNode("li", null, "OS: Windows10 v1809 and higher with DirectX 12"),
                          createVNode("li", null, "GPU: DirectX 11 compatible"),
                          createVNode("li", null, "Memory: 8GB RAM, 2GB Disk Space"),
                          createVNode("li", null, "CPU: Benchmark score > 2000")
                        ])
                      ])
                    ])
                  ])
                ]),
                createVNode("li", { class: "faq py-6 border-gray-200 border-solid border-b" }, [
                  createVNode("div", { class: "flex justify-between items-center cursor-pointer" }, [
                    createVNode("p", { class: "text-gray-200 text-base md:text-xl xl:text-2xl w-10/12 dark:text-gray-200" }, " Do I need a Head Mounted Display (HMD) to use Renderpub? "),
                    createVNode("div", {
                      "data-menu": "",
                      class: "cursor-pointer"
                    }, [
                      (openBlock(), createBlock("svg", {
                        "data-plus": "",
                        xmlns: "http://www.w3.org/2000/svg",
                        class: "icon icon-tabler icon-tabler-circle-plus",
                        width: "36",
                        height: "36",
                        viewBox: "0 0 24 24",
                        "stroke-width": "1.5",
                        stroke: "#A0AEC0",
                        fill: "none",
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "aria-label": "Open"
                      }, [
                        createVNode("path", {
                          stroke: "none",
                          d: "M0 0h24v24H0z"
                        }),
                        createVNode("circle", {
                          cx: "12",
                          cy: "12",
                          r: "9"
                        }),
                        createVNode("line", {
                          x1: "9",
                          y1: "12",
                          x2: "15",
                          y2: "12"
                        }),
                        createVNode("line", {
                          x1: "12",
                          y1: "9",
                          x2: "12",
                          y2: "15"
                        })
                      ])),
                      (openBlock(), createBlock("svg", {
                        "data-minus": "",
                        xmlns: "http://www.w3.org/2000/svg",
                        class: "hidden icon icon-tabler icon-tabler-circle-minus",
                        width: "36",
                        height: "36",
                        viewBox: "0 0 24 24",
                        "stroke-width": "1.5",
                        stroke: "#A0AEC0",
                        fill: "none",
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "aria-label": "Close"
                      }, [
                        createVNode("path", {
                          stroke: "none",
                          d: "M0 0h24v24H0z"
                        }),
                        createVNode("circle", {
                          cx: "12",
                          cy: "12",
                          r: "9"
                        }),
                        createVNode("line", {
                          x1: "9",
                          y1: "12",
                          x2: "15",
                          y2: "12"
                        })
                      ]))
                    ])
                  ]),
                  createVNode("p", {
                    "data-content": "",
                    class: "hidden pt-2 md:pt-3 lg:pt-5 text-gray-200 px-4 md:px-8 text-sm md:text-base xl:text-lg rounded-b-lg dark:text-gray-200"
                  }, " While an HMD is not necessary, the interactive walkthroughs on Renderpub Spaces can be viewed immersively in VR using an HMD. ")
                ]),
                createVNode("li", { class: "faq py-6 border-gray-200 border-solid border-b" }, [
                  createVNode("div", { class: "flex justify-between items-center cursor-pointer" }, [
                    createVNode("p", { class: "text-gray-200 text-base md:text-xl xl:text-2xl w-10/12 dark:text-gray-200" }, " Where can I find support? "),
                    createVNode("div", {
                      "data-menu": "",
                      class: "cursor-pointer"
                    }, [
                      (openBlock(), createBlock("svg", {
                        "data-plus": "",
                        xmlns: "http://www.w3.org/2000/svg",
                        class: "icon icon-tabler icon-tabler-circle-plus",
                        width: "36",
                        height: "36",
                        viewBox: "0 0 24 24",
                        "stroke-width": "1.5",
                        stroke: "#A0AEC0",
                        fill: "none",
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "aria-label": "Open"
                      }, [
                        createVNode("path", {
                          stroke: "none",
                          d: "M0 0h24v24H0z"
                        }),
                        createVNode("circle", {
                          cx: "12",
                          cy: "12",
                          r: "9"
                        }),
                        createVNode("line", {
                          x1: "9",
                          y1: "12",
                          x2: "15",
                          y2: "12"
                        }),
                        createVNode("line", {
                          x1: "12",
                          y1: "9",
                          x2: "12",
                          y2: "15"
                        })
                      ])),
                      (openBlock(), createBlock("svg", {
                        "data-minus": "",
                        xmlns: "http://www.w3.org/2000/svg",
                        class: "hidden icon icon-tabler icon-tabler-circle-minus",
                        width: "36",
                        height: "36",
                        viewBox: "0 0 24 24",
                        "stroke-width": "1.5",
                        stroke: "#A0AEC0",
                        fill: "none",
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "aria-label": "Close"
                      }, [
                        createVNode("path", {
                          stroke: "none",
                          d: "M0 0h24v24H0z"
                        }),
                        createVNode("circle", {
                          cx: "12",
                          cy: "12",
                          r: "9"
                        }),
                        createVNode("line", {
                          x1: "9",
                          y1: "12",
                          x2: "15",
                          y2: "12"
                        })
                      ]))
                    ])
                  ]),
                  createVNode("p", {
                    "data-content": "",
                    class: "hidden pt-2 md:pt-3 lg:pt-5 text-gray-200 px-4 md:px-8 text-sm md:text-base xl:text-lg rounded-b-lg dark:text-gray-200"
                  }, [
                    createTextVNode(" The best place to find community and support is the Renderpub "),
                    createVNode("a", {
                      id: "discordlink",
                      href: "https://discord.gg/KtYtxfzs",
                      target: "_blank",
                      style: { "text-decoration": "underline" }
                    }, "Discord Server."),
                    createTextVNode(" Additionally, you can reach us at info@renderpub.com for correspondence. ")
                  ])
                ]),
                createVNode("li", { class: "faq py-6 border-gray-200 border-solid border-b" }, [
                  createVNode("div", { class: "flex justify-between items-center cursor-pointer" }, [
                    createVNode("p", { class: "text-gray-200 text-base md:text-xl xl:text-2xl w-10/12 dark:text-gray-200" }, " Where can I find learning resources? "),
                    createVNode("div", {
                      "data-menu": "",
                      class: "cursor-pointer"
                    }, [
                      (openBlock(), createBlock("svg", {
                        "data-plus": "",
                        xmlns: "http://www.w3.org/2000/svg",
                        class: "icon icon-tabler icon-tabler-circle-plus",
                        width: "36",
                        height: "36",
                        viewBox: "0 0 24 24",
                        "stroke-width": "1.5",
                        stroke: "#A0AEC0",
                        fill: "none",
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "aria-label": "Open"
                      }, [
                        createVNode("path", {
                          stroke: "none",
                          d: "M0 0h24v24H0z"
                        }),
                        createVNode("circle", {
                          cx: "12",
                          cy: "12",
                          r: "9"
                        }),
                        createVNode("line", {
                          x1: "9",
                          y1: "12",
                          x2: "15",
                          y2: "12"
                        }),
                        createVNode("line", {
                          x1: "12",
                          y1: "9",
                          x2: "12",
                          y2: "15"
                        })
                      ])),
                      (openBlock(), createBlock("svg", {
                        "data-minus": "",
                        xmlns: "http://www.w3.org/2000/svg",
                        class: "hidden icon icon-tabler icon-tabler-circle-minus",
                        width: "36",
                        height: "36",
                        viewBox: "0 0 24 24",
                        "stroke-width": "1.5",
                        stroke: "#A0AEC0",
                        fill: "none",
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "aria-label": "Close"
                      }, [
                        createVNode("path", {
                          stroke: "none",
                          d: "M0 0h24v24H0z"
                        }),
                        createVNode("circle", {
                          cx: "12",
                          cy: "12",
                          r: "9"
                        }),
                        createVNode("line", {
                          x1: "9",
                          y1: "12",
                          x2: "15",
                          y2: "12"
                        })
                      ]))
                    ])
                  ]),
                  createVNode("p", {
                    "data-content": "",
                    class: "hidden pt-2 md:pt-3 lg:pt-5 text-gray-200 px-4 md:px-8 text-sm md:text-base xl:text-lg rounded-b-lg dark:text-gray-200"
                  }, " A video tutorial series will be posted on youtube that will help users get familiar with the tools. Documentation and in-app tutorials are also being worked on and will be made available during the beta phase. ")
                ])
              ])
            ])
          ])
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup$e = _sfc_main$e.setup;
_sfc_main$e.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("src/components/FAQ.vue");
  return _sfc_setup$e ? _sfc_setup$e(props, ctx) : void 0;
};
var __vite_components_11 = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["ssrRender", _sfc_ssrRender$6], ["__scopeId", "data-v-949e8f78"]]);
var block0$2 = {};
const _sfc_main$d = /* @__PURE__ */ defineComponent({
  __ssrInlineRender: true,
  props: {
    message: String
  },
  setup(__props) {
    ref("");
    useRouter();
    useI18n();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_HeroFinal = __vite_components_0$6;
      const _component_SectionHeading = __vite_components_1$2;
      const _component_CTA1 = __vite_components_2$1;
      const _component_TimelineUI = __vite_components_3;
      const _component_Studio1 = __vite_components_4;
      const _component_Stitch = __vite_components_5;
      const _component_Spaces2 = __vite_components_6;
      const _component_UseCases1 = __vite_components_7;
      const _component_Showcase = __vite_components_8;
      const _component_Technology1 = __vite_components_9;
      const _component_CTA2 = __vite_components_10;
      const _component_FAQ = __vite_components_11;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_HeroFinal, null, null, _parent));
      _push(ssrRenderComponent(_component_SectionHeading, {
        "section-title": "The Complete Architectural Visualization Toolkit",
        description: "3D Modeling,  Realtime Rendering,  Virtual Reality",
        class: "lg:pb-32 sm:pb-24 pb-16"
      }, null, _parent));
      _push(ssrRenderComponent(_component_CTA1, null, null, _parent));
      _push(ssrRenderComponent(_component_SectionHeading, {
        "section-title": "Workflow",
        description: "",
        class: ""
      }, null, _parent));
      _push(ssrRenderComponent(_component_TimelineUI, null, null, _parent));
      _push(ssrRenderComponent(_component_SectionHeading, {
        "section-title": "Product Suite",
        description: "",
        class: "pt-32 -mt-20 sm:-mt-0"
      }, null, _parent));
      _push(ssrRenderComponent(_component_Studio1, { id: "StudioSection" }, null, _parent));
      _push(ssrRenderComponent(_component_Stitch, { id: "StitchSection" }, null, _parent));
      _push(ssrRenderComponent(_component_Spaces2, { id: "SpacesSection" }, null, _parent));
      _push(ssrRenderComponent(_component_SectionHeading, {
        "section-title": "Usecases",
        class: "md:pt-32 pt-16",
        description: ""
      }, null, _parent));
      _push(ssrRenderComponent(_component_UseCases1, null, null, _parent));
      _push(ssrRenderComponent(_component_SectionHeading, {
        id: "Showcase",
        "section-title": "Showcase",
        class: "",
        description: ""
      }, null, _parent));
      _push(ssrRenderComponent(_component_Showcase, null, null, _parent));
      _push(ssrRenderComponent(_component_SectionHeading, {
        "section-title": "Technology",
        class: "",
        description: "Built with the power of Unreal Engine. Made faster with NVIDIA's Deep Learning Super Sampling (DLSS)."
      }, null, _parent));
      _push(ssrRenderComponent(_component_Technology1, null, null, _parent));
      _push(ssrRenderComponent(_component_CTA2, null, null, _parent));
      _push(ssrRenderComponent(_component_SectionHeading, {
        id: "FAQ",
        "section-title": "Frequently Asked Questions",
        description: ""
      }, null, _parent));
      _push(ssrRenderComponent(_component_FAQ, null, null, _parent));
      _push(`<!--]-->`);
    };
  }
});
if (typeof block0$2 === "function")
  block0$2(_sfc_main$d);
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("src/pages/index.vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
const routes$1 = [{ "name": "home", "path": "/", "component": _sfc_main$d, "props": true, "meta": { "layout": "home" } }, { "name": "about", "path": "/about", "component": () => Promise.resolve().then(function() {
  return about;
}), "props": true, "meta": { "propsGetter": false } }, { "name": "README", "path": "/readme", "component": () => Promise.resolve().then(function() {
  return README;
}), "props": true, "meta": { "propsGetter": false } }, { "name": "userId", "path": "/:userId/:projectId", "component": () => Promise.resolve().then(function() {
  return _projectId_$1;
}), "props": true, "meta": { "layout": "home" } }, { "name": "hi-name", "path": "/hi/:name", "component": () => Promise.resolve().then(function() {
  return _name_;
}), "props": true }, { "name": "all", "path": "/:all(.*)*", "component": () => Promise.resolve().then(function() {
  return ____all_;
}), "props": true, "meta": { "layout": 404, "propsGetter": false } }];
;
var Footer_vue_vue_type_style_index_0_scoped_true_lang = "";
const _sfc_main$c = {
  name: "Index",
  data() {
    return {
      auto: true,
      light: false,
      dark: false
    };
  },
  mounted() {
  },
  methods: {
    toggle(event) {
      if (event.target.value === "auto") {
        this.auto = true;
        this.light = false;
        this.dark = false;
      }
      if (event.target.value === "light") {
        this.auto = false;
        this.light = true;
        this.dark = false;
      }
      if (event.target.value === "dark") {
        this.auto = false;
        this.light = false;
        this.dark = true;
      }
    },
    scrollToTop() {
      window.scrollTo(0, 0);
    }
  }
};
function _sfc_ssrRender$5(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "" }, _attrs))} data-v-1e190e0d><footer id="footer" class="relative z-25 sm:pt-24 pt-16" style="${ssrRenderStyle({ "background-color": "hsl(0, 0%, 6%)" })}" data-v-1e190e0d><div class="mx-auto container px-4 xl:px-12 2xl:px-4" data-v-1e190e0d><div class="lg:flex" data-v-1e190e0d><div class="w-full lg:w-1/2 mb-16 lg:mb-0 flex" data-v-1e190e0d><div class="w-full lg:w-1/2 px-6" data-v-1e190e0d><ul data-v-1e190e0d><li data-v-1e190e0d><a class="text-xs lg:text-sm leading-none hover:text-brand dark:hover:text-brand text-gray-200 dark:text-gray-200" href="javascript:void(0);" data-v-1e190e0d>Forum <sup data-v-1e190e0d>(Soon)</sup></a></li><li class="mt-6" data-v-1e190e0d><a class="text-xs lg:text-sm leading-none hover:text-brand dark:hover:text-brand text-gray-200 dark:text-gray-200" href="/#FAQ" data-v-1e190e0d>FAQ</a></li><li class="mt-6" data-v-1e190e0d><a href="javascript:void(0);" class="text-xs lg:text-sm leading-none hover:text-brand dark:hover:text-brand text-gray-200 dark:text-gray-200" data-v-1e190e0d>Documentation <sup data-v-1e190e0d>(Soon)</sup></a></li></ul></div><div class="w-full lg:w-1/2 lg:text-left text-center px-6" data-v-1e190e0d><ul data-v-1e190e0d><li id="SpacesFooterButton" data-v-1e190e0d><a class="text-xs lg:text-sm leading-none hover:text-brand dark:hover:text-brand text-gray-200 dark:text-gray-200" href="/#Spaces" data-v-1e190e0d> Spaces <sup data-v-1e190e0d>(Soon)</sup></a></li><li id="StudioFooterButton" class="mt-6" data-v-1e190e0d><a class="text-xs lg:text-sm leading-none hover:text-brand dark:hover:text-brand text-gray-200 dark:text-gray-200" href="/#Studio" data-v-1e190e0d> Studio <sup data-v-1e190e0d>(Soon)</sup></a></li><li id="StitchFooterButton" class="mt-6" data-v-1e190e0d><a class="text-xs lg:text-sm leading-none hover:text-brand dark:hover:text-brand text-gray-200 dark:text-gray-200" href="/#Stitch" data-v-1e190e0d> Stitch <sup data-v-1e190e0d>(Soon)</sup></a></li></ul></div></div><div class="w-full lg:w-1/2 flex" data-v-1e190e0d><div class="w-full lg:w-1/2 px-6" data-v-1e190e0d><ul data-v-1e190e0d><li data-v-1e190e0d><a href="javascript:void(0);" class="text-xs lg:text-sm leading-none hover:text-brand dark:hover:text-brand text-gray-200 dark:text-gray-200" data-v-1e190e0d>Privacy policy</a></li><li class="mt-6" data-v-1e190e0d><a class="text-xs lg:text-sm leading-none hover:text-brand dark:hover:text-brand text-gray-200 dark:text-gray-200" href="javascript:void(0);" data-v-1e190e0d>Terms of service</a></li></ul></div><div class="w-full lg:w-1/2 px-6 justify-center" data-v-1e190e0d><div class="grid md:grid-cols-3 sm:grid-cols-3 grid-cols-3 gap-2 justify-center mb-6 m-auto item-center" data-v-1e190e0d><div class="justify-center" data-v-1e190e0d><a href="https://www.facebook.com/renderpub/" target="_blank" rel="noopener" style="${ssrRenderStyle({ "line-height": "0", "font-size": "0", "color": "transparent" })}" data-v-1e190e0d><div class="sm:pl-4 md:pt-3" data-v-1e190e0d><svg class="footer-icon feather feather-twitter text-gray-200 dark:text-gray-200 cursor-pointer hover:text-brand dark:hover:text-brand" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40" height="40" viewBox="0 0 50 50" style="${ssrRenderStyle({ "fill": "#ffffff" })}" data-v-1e190e0d><path d="M 9 4 C 6.2504839 4 4 6.2504839 4 9 L 4 41 C 4 43.749516 6.2504839 46 9 46 L 25.832031 46 A 1.0001 1.0001 0 0 0 26.158203 46 L 31.832031 46 A 1.0001 1.0001 0 0 0 32.158203 46 L 41 46 C 43.749516 46 46 43.749516 46 41 L 46 9 C 46 6.2504839 43.749516 4 41 4 L 9 4 z M 9 6 L 41 6 C 42.668484 6 44 7.3315161 44 9 L 44 41 C 44 42.668484 42.668484 44 41 44 L 33 44 L 33 30 L 36.820312 30 L 38.220703 23 L 33 23 L 33 21 C 33 20.442508 33.05305 20.398929 33.240234 20.277344 C 33.427419 20.155758 34.005822 20 35 20 L 38 20 L 38 14.369141 L 37.429688 14.097656 C 37.429688 14.097656 35.132647 13 32 13 C 29.75 13 27.901588 13.896453 26.71875 15.375 C 25.535912 16.853547 25 18.833333 25 21 L 25 23 L 22 23 L 22 30 L 25 30 L 25 44 L 9 44 C 7.3315161 44 6 42.668484 6 41 L 6 9 C 6 7.3315161 7.3315161 6 9 6 z M 32 15 C 34.079062 15 35.38736 15.458455 36 15.701172 L 36 18 L 35 18 C 33.849178 18 32.926956 18.0952 32.150391 18.599609 C 31.373826 19.104024 31 20.061492 31 21 L 31 25 L 35.779297 25 L 35.179688 28 L 31 28 L 31 44 L 27 44 L 27 28 L 24 28 L 24 25 L 27 25 L 27 21 C 27 19.166667 27.464088 17.646453 28.28125 16.625 C 29.098412 15.603547 30.25 15 32 15 z" data-v-1e190e0d></path></svg></div>facebook </a></div><div class="justify-center" data-v-1e190e0d><a href="https://twitter.com/renderpub" target="_blank" rel="noopener" style="${ssrRenderStyle({ "line-height": "0", "font-size": "0", "color": "transparent" })}" data-v-1e190e0d><div class="sm:pl-4 md:pt-3" data-v-1e190e0d><svg class="footer-icon feather feather-twitter text-gray-200 dark:text-gray-200 cursor-pointer hover:text-brand dark:hover:text-brand" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40" height="40" viewBox="0 0 50 50" style="${ssrRenderStyle({ "fill": "#ffffff" })}" data-v-1e190e0d><path d="M 34.21875 5.46875 C 28.238281 5.46875 23.375 10.332031 23.375 16.3125 C 23.375 16.671875 23.464844 17.023438 23.5 17.375 C 16.105469 16.667969 9.566406 13.105469 5.125 7.65625 C 4.917969 7.394531 4.597656 7.253906 4.261719 7.277344 C 3.929688 7.300781 3.632813 7.492188 3.46875 7.78125 C 2.535156 9.386719 2 11.234375 2 13.21875 C 2 15.621094 2.859375 17.820313 4.1875 19.625 C 3.929688 19.511719 3.648438 19.449219 3.40625 19.3125 C 3.097656 19.148438 2.726563 19.15625 2.425781 19.335938 C 2.125 19.515625 1.941406 19.839844 1.9375 20.1875 L 1.9375 20.3125 C 1.9375 23.996094 3.84375 27.195313 6.65625 29.15625 C 6.625 29.152344 6.59375 29.164063 6.5625 29.15625 C 6.21875 29.097656 5.871094 29.21875 5.640625 29.480469 C 5.410156 29.742188 5.335938 30.105469 5.4375 30.4375 C 6.554688 33.910156 9.40625 36.5625 12.9375 37.53125 C 10.125 39.203125 6.863281 40.1875 3.34375 40.1875 C 2.582031 40.1875 1.851563 40.148438 1.125 40.0625 C 0.65625 40 0.207031 40.273438 0.0507813 40.71875 C -0.109375 41.164063 0.0664063 41.660156 0.46875 41.90625 C 4.980469 44.800781 10.335938 46.5 16.09375 46.5 C 25.425781 46.5 32.746094 42.601563 37.65625 37.03125 C 42.566406 31.460938 45.125 24.226563 45.125 17.46875 C 45.125 17.183594 45.101563 16.90625 45.09375 16.625 C 46.925781 15.222656 48.5625 13.578125 49.84375 11.65625 C 50.097656 11.285156 50.070313 10.789063 49.777344 10.445313 C 49.488281 10.101563 49 9.996094 48.59375 10.1875 C 48.078125 10.417969 47.476563 10.441406 46.9375 10.625 C 47.648438 9.675781 48.257813 8.652344 48.625 7.5 C 48.75 7.105469 48.613281 6.671875 48.289063 6.414063 C 47.964844 6.160156 47.511719 6.128906 47.15625 6.34375 C 45.449219 7.355469 43.558594 8.066406 41.5625 8.5 C 39.625 6.6875 37.074219 5.46875 34.21875 5.46875 Z M 34.21875 7.46875 C 36.769531 7.46875 39.074219 8.558594 40.6875 10.28125 C 40.929688 10.53125 41.285156 10.636719 41.625 10.5625 C 42.929688 10.304688 44.167969 9.925781 45.375 9.4375 C 44.679688 10.375 43.820313 11.175781 42.8125 11.78125 C 42.355469 12.003906 42.140625 12.53125 42.308594 13.011719 C 42.472656 13.488281 42.972656 13.765625 43.46875 13.65625 C 44.46875 13.535156 45.359375 13.128906 46.3125 12.875 C 45.457031 13.800781 44.519531 14.636719 43.5 15.375 C 43.222656 15.578125 43.070313 15.90625 43.09375 16.25 C 43.109375 16.65625 43.125 17.058594 43.125 17.46875 C 43.125 23.71875 40.726563 30.503906 36.15625 35.6875 C 31.585938 40.871094 24.875 44.5 16.09375 44.5 C 12.105469 44.5 8.339844 43.617188 4.9375 42.0625 C 9.15625 41.738281 13.046875 40.246094 16.1875 37.78125 C 16.515625 37.519531 16.644531 37.082031 16.511719 36.683594 C 16.378906 36.285156 16.011719 36.011719 15.59375 36 C 12.296875 35.941406 9.535156 34.023438 8.0625 31.3125 C 8.117188 31.3125 8.164063 31.3125 8.21875 31.3125 C 9.207031 31.3125 10.183594 31.1875 11.09375 30.9375 C 11.53125 30.808594 11.832031 30.402344 11.816406 29.945313 C 11.800781 29.488281 11.476563 29.097656 11.03125 29 C 7.472656 28.28125 4.804688 25.382813 4.1875 21.78125 C 5.195313 22.128906 6.226563 22.402344 7.34375 22.4375 C 7.800781 22.464844 8.214844 22.179688 8.355469 21.746094 C 8.496094 21.3125 8.324219 20.835938 7.9375 20.59375 C 5.5625 19.003906 4 16.296875 4 13.21875 C 4 12.078125 4.296875 11.03125 4.6875 10.03125 C 9.6875 15.519531 16.6875 19.164063 24.59375 19.5625 C 24.90625 19.578125 25.210938 19.449219 25.414063 19.210938 C 25.617188 18.96875 25.695313 18.648438 25.625 18.34375 C 25.472656 17.695313 25.375 17.007813 25.375 16.3125 C 25.375 11.414063 29.320313 7.46875 34.21875 7.46875 Z" data-v-1e190e0d></path></svg></div>twitter </a></div><div class="justify-center" data-v-1e190e0d><a href="https://www.youtube.com/channel/UC3jY9vZeOkyXnWlX0atxEjQ" target="_blank" rel="noopener" style="${ssrRenderStyle({ "line-height": "0", "font-size": "0", "color": "transparent" })}" data-v-1e190e0d><div class="sm:pl-4 md:pt-3" data-v-1e190e0d><svg class="footer-icon feather feather-twitter text-gray-200 dark:text-gray-200 cursor-pointer hover:text-brand dark:hover:text-brand" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40" height="40" viewBox="0 0 50 50" style="${ssrRenderStyle({ "fill": "#ffffff" })}" data-v-1e190e0d><path d="M 24.402344 9 C 17.800781 9 11.601563 9.5 8.300781 10.199219 C 6.101563 10.699219 4.199219 12.199219 3.800781 14.5 C 3.402344 16.898438 3 20.5 3 25 C 3 29.5 3.398438 33 3.898438 35.5 C 4.300781 37.699219 6.199219 39.300781 8.398438 39.800781 C 11.902344 40.5 17.898438 41 24.5 41 C 31.101563 41 37.097656 40.5 40.597656 39.800781 C 42.800781 39.300781 44.699219 37.800781 45.097656 35.5 C 45.5 33 46 29.402344 46.097656 24.902344 C 46.097656 20.402344 45.597656 16.800781 45.097656 14.300781 C 44.699219 12.101563 42.800781 10.5 40.597656 10 C 37.097656 9.5 31 9 24.402344 9 Z M 24.402344 11 C 31.601563 11 37.398438 11.597656 40.199219 12.097656 C 41.699219 12.5 42.898438 13.5 43.097656 14.800781 C 43.699219 18 44.097656 21.402344 44.097656 24.902344 C 44 29.199219 43.5 32.699219 43.097656 35.199219 C 42.800781 37.097656 40.800781 37.699219 40.199219 37.902344 C 36.597656 38.601563 30.597656 39.097656 24.597656 39.097656 C 18.597656 39.097656 12.5 38.699219 9 37.902344 C 7.5 37.5 6.300781 36.5 6.101563 35.199219 C 5.300781 32.398438 5 28.699219 5 25 C 5 20.398438 5.402344 17 5.800781 14.902344 C 6.101563 13 8.199219 12.398438 8.699219 12.199219 C 12 11.5 18.101563 11 24.402344 11 Z M 19 17 L 19 33 L 33 25 Z M 21 20.402344 L 29 25 L 21 29.597656 Z" data-v-1e190e0d></path></svg></div>youtube </a></div><div class="justify-center" data-v-1e190e0d><a href="https://www.instagram.com/renderpub_official/" target="_blank" rel="noopener" style="${ssrRenderStyle({ "line-height": "0", "font-size": "0", "color": "transparent" })}" data-v-1e190e0d><div class="sm:pl-4 md:pb-3" data-v-1e190e0d><svg class="footer-icon feather feather-twitter text-gray-200 dark:text-gray-200 cursor-pointer hover:text-brand dark:hover:text-brand" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40" height="40" viewBox="0 0 50 50" style="${ssrRenderStyle({ "fill": "#ffffff" })}" data-v-1e190e0d><path d="M 16 3 C 8.8324839 3 3 8.8324839 3 16 L 3 34 C 3 41.167516 8.8324839 47 16 47 L 34 47 C 41.167516 47 47 41.167516 47 34 L 47 16 C 47 8.8324839 41.167516 3 34 3 L 16 3 z M 16 5 L 34 5 C 40.086484 5 45 9.9135161 45 16 L 45 34 C 45 40.086484 40.086484 45 34 45 L 16 45 C 9.9135161 45 5 40.086484 5 34 L 5 16 C 5 9.9135161 9.9135161 5 16 5 z M 37 11 A 2 2 0 0 0 35 13 A 2 2 0 0 0 37 15 A 2 2 0 0 0 39 13 A 2 2 0 0 0 37 11 z M 25 14 C 18.936712 14 14 18.936712 14 25 C 14 31.063288 18.936712 36 25 36 C 31.063288 36 36 31.063288 36 25 C 36 18.936712 31.063288 14 25 14 z M 25 16 C 29.982407 16 34 20.017593 34 25 C 34 29.982407 29.982407 34 25 34 C 20.017593 34 16 29.982407 16 25 C 16 20.017593 20.017593 16 25 16 z" data-v-1e190e0d></path></svg></div>instagram </a></div><div class="justify-center" data-v-1e190e0d><a href="http://linkedin.com/company/renderpub" target="_blank" rel="noopener" style="${ssrRenderStyle({ "line-height": "0", "font-size": "0", "color": "transparent" })}" data-v-1e190e0d><div class="sm:pl-4 md:pb-4" data-v-1e190e0d><svg class="footer-icon feather feather-twitter text-gray-200 dark:text-gray-200 cursor-pointer hover:text-brand dark:hover:text-brand" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40" height="40" viewBox="0 0 50 50" style="${ssrRenderStyle({ "fill": "#ffffff" })}" data-v-1e190e0d><path d="M 9 4 C 6.2504839 4 4 6.2504839 4 9 L 4 41 C 4 43.749516 6.2504839 46 9 46 L 41 46 C 43.749516 46 46 43.749516 46 41 L 46 9 C 46 6.2504839 43.749516 4 41 4 L 9 4 z M 9 6 L 41 6 C 42.668484 6 44 7.3315161 44 9 L 44 41 C 44 42.668484 42.668484 44 41 44 L 9 44 C 7.3315161 44 6 42.668484 6 41 L 6 9 C 6 7.3315161 7.3315161 6 9 6 z M 14 11.011719 C 12.904779 11.011719 11.919219 11.339079 11.189453 11.953125 C 10.459687 12.567171 10.011719 13.484511 10.011719 14.466797 C 10.011719 16.333977 11.631285 17.789609 13.691406 17.933594 A 0.98809878 0.98809878 0 0 0 13.695312 17.935547 A 0.98809878 0.98809878 0 0 0 14 17.988281 C 16.27301 17.988281 17.988281 16.396083 17.988281 14.466797 A 0.98809878 0.98809878 0 0 0 17.986328 14.414062 C 17.884577 12.513831 16.190443 11.011719 14 11.011719 z M 14 12.988281 C 15.392231 12.988281 15.94197 13.610038 16.001953 14.492188 C 15.989803 15.348434 15.460091 16.011719 14 16.011719 C 12.614594 16.011719 11.988281 15.302225 11.988281 14.466797 C 11.988281 14.049083 12.140703 13.734298 12.460938 13.464844 C 12.78117 13.19539 13.295221 12.988281 14 12.988281 z M 11 19 A 1.0001 1.0001 0 0 0 10 20 L 10 39 A 1.0001 1.0001 0 0 0 11 40 L 17 40 A 1.0001 1.0001 0 0 0 18 39 L 18 33.134766 L 18 20 A 1.0001 1.0001 0 0 0 17 19 L 11 19 z M 20 19 A 1.0001 1.0001 0 0 0 19 20 L 19 39 A 1.0001 1.0001 0 0 0 20 40 L 26 40 A 1.0001 1.0001 0 0 0 27 39 L 27 29 C 27 28.170333 27.226394 27.345035 27.625 26.804688 C 28.023606 26.264339 28.526466 25.940057 29.482422 25.957031 C 30.468166 25.973981 30.989999 26.311669 31.384766 26.841797 C 31.779532 27.371924 32 28.166667 32 29 L 32 39 A 1.0001 1.0001 0 0 0 33 40 L 39 40 A 1.0001 1.0001 0 0 0 40 39 L 40 28.261719 C 40 25.300181 39.122788 22.95433 37.619141 21.367188 C 36.115493 19.780044 34.024172 19 31.8125 19 C 29.710483 19 28.110853 19.704889 27 20.423828 L 27 20 A 1.0001 1.0001 0 0 0 26 19 L 20 19 z M 12 21 L 16 21 L 16 33.134766 L 16 38 L 12 38 L 12 21 z M 21 21 L 25 21 L 25 22.560547 A 1.0001 1.0001 0 0 0 26.798828 23.162109 C 26.798828 23.162109 28.369194 21 31.8125 21 C 33.565828 21 35.069366 21.582581 36.167969 22.742188 C 37.266572 23.901794 38 25.688257 38 28.261719 L 38 38 L 34 38 L 34 29 C 34 27.833333 33.720468 26.627107 32.990234 25.646484 C 32.260001 24.665862 31.031834 23.983076 29.517578 23.957031 C 27.995534 23.930001 26.747519 24.626988 26.015625 25.619141 C 25.283731 26.611293 25 27.829667 25 29 L 25 38 L 21 38 L 21 21 z" data-v-1e190e0d></path></svg></div>linkedin </a></div><div class="justify-center" data-v-1e190e0d><a href="https://in.pinterest.com/renderpub/" target="_blank" rel="noopener" style="${ssrRenderStyle({ "line-height": "0", "font-size": "0", "color": "transparent" })}" data-v-1e190e0d><div class="sm:pl-4 md:pb-3" data-v-1e190e0d><svg class="footer-icon feather feather-twitter text-gray-200 dark:text-gray-200 cursor-pointer hover:text-brand dark:hover:text-brand" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40" height="40" viewBox="0 0 50 50" style="${ssrRenderStyle({ "fill": "#ffffff" })}" data-v-1e190e0d><path d="M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609825 4 46 13.390175 46 25 C 46 36.609825 36.609825 46 25 46 C 22.876355 46 20.82771 45.682142 18.896484 45.097656 C 19.75673 43.659418 20.867347 41.60359 21.308594 39.90625 C 21.570728 38.899887 22.648438 34.794922 22.648438 34.794922 C 23.348841 36.132057 25.395277 37.263672 27.574219 37.263672 C 34.058123 37.263672 38.732422 31.300682 38.732422 23.890625 C 38.732422 16.78653 32.935409 11.472656 25.476562 11.472656 C 16.196831 11.472656 11.271484 17.700825 11.271484 24.482422 C 11.271484 27.636307 12.94892 31.562193 15.634766 32.8125 C 16.041611 33.001865 16.260073 32.919834 16.353516 32.525391 C 16.425459 32.226044 16.788267 30.766792 16.951172 30.087891 C 17.003269 29.871239 16.978043 29.68405 16.802734 29.470703 C 15.913793 28.392399 15.201172 26.4118 15.201172 24.564453 C 15.201172 19.822048 18.791452 15.232422 24.908203 15.232422 C 30.18976 15.232422 33.888672 18.832872 33.888672 23.980469 C 33.888672 29.796219 30.95207 33.826172 27.130859 33.826172 C 25.020554 33.826172 23.440361 32.080359 23.947266 29.939453 C 24.555054 27.38426 25.728516 24.626944 25.728516 22.78125 C 25.728516 21.130713 24.842754 19.753906 23.007812 19.753906 C 20.850369 19.753906 19.117188 21.984457 19.117188 24.974609 C 19.117187 26.877359 19.761719 28.166016 19.761719 28.166016 C 19.761719 28.166016 17.630543 37.176514 17.240234 38.853516 C 16.849091 40.52931 16.953851 42.786365 17.115234 44.466797 C 9.421139 41.352465 4 33.819328 4 25 C 4 13.390175 13.390175 4 25 4 z" data-v-1e190e0d></path></svg></div>pinterest </a></div></div></div></div></div></div></footer></div>`);
}
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("src/components/Footer.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
var __vite_components_2 = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["ssrRender", _sfc_ssrRender$5], ["__scopeId", "data-v-1e190e0d"]]);
const _sfc_main$b = {};
function _sfc_ssrRender$4(_ctx, _push, _parent, _attrs) {
  const _component_router_view = resolveComponent("router-view");
  const _component_Footer = __vite_components_2;
  _push(`<main${ssrRenderAttrs(mergeProps({ class: "px-4 py-10 text-center text-gray-700 dark:text-gray-200" }, _attrs))}>`);
  _push(ssrRenderComponent(_component_router_view, _ctx.$attrs, null, _parent));
  _push(ssrRenderComponent(_component_Footer, { class: "bg-gray-100" }, null, _parent));
  _push(`<div class="mt-5 mx-auto text-center opacity-25 text-sm"> [Default Layout] </div></main>`);
}
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("src/layouts/default.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
var __layout_0 = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["ssrRender", _sfc_ssrRender$4]]);
const layouts = {
  "404": () => Promise.resolve().then(function() {
    return _404;
  }),
  "default": __layout_0,
  "home": () => Promise.resolve().then(function() {
    return home$1;
  })
};
function setupLayouts(routes2) {
  return routes2.map((route) => {
    var _a;
    return {
      path: route.path,
      component: layouts[((_a = route.meta) == null ? void 0 : _a.layout) || "default"],
      children: [route]
    };
  });
}
const _sfc_main$a = /* @__PURE__ */ defineComponent({
  __ssrInlineRender: true,
  setup(__props) {
    const title = "Renderpub";
    const description = "Renderpub - Architecting the Metaverse";
    useHead({
      title,
      meta: [
        { name: "description", content: description },
        { name: "description", content: description },
        { property: "og:title", content: title },
        {
          property: "og:image",
          content: "https://storage.googleapis.com/spaces.renderpub.com/RenderpubOG.jpg"
        }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_view = resolveComponent("router-view");
      _push(ssrRenderComponent(_component_router_view, _attrs, null, _parent));
    };
  }
});
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("src/App.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const SUPPORTED_LANGUAGES = [
  {
    locale: "en",
    name: "English",
    default: true
  },
  {
    locale: "es",
    name: "Spanish"
  },
  {
    locale: "fr",
    name: "French"
  },
  {
    locale: "it",
    name: "Italian"
  },
  {
    locale: "ja",
    name: "Japanese"
  },
  {
    locale: "ko",
    name: "Korean"
  },
  {
    locale: "tr",
    name: "Turkish"
  },
  {
    locale: "vi",
    name: "Vietnamese"
  },
  {
    locale: "zh-CN",
    name: "Chinese"
  }
];
const SUPPORTED_LOCALES = SUPPORTED_LANGUAGES.map((l) => l.locale);
const DEFAULT_LANGUAGE = SUPPORTED_LANGUAGES.find((l) => l.default);
const DEFAULT_LOCALE = DEFAULT_LANGUAGE == null ? void 0 : DEFAULT_LANGUAGE.locale;
function extractLocaleFromPath(path = "") {
  const [_, maybeLocale] = path.split("/");
  return SUPPORTED_LOCALES.includes(maybeLocale) ? maybeLocale : DEFAULT_LOCALE;
}
const DEFAULT_FORMAT$1 = {
  short: {
    year: "numeric",
    month: "short",
    day: "numeric"
  },
  medium: {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric"
  },
  long: {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
    hour: "numeric",
    minute: "numeric"
  },
  month: {
    month: "long"
  }
};
const DATE_FORMATS = Object.freeze({
  ...SUPPORTED_LOCALES.reduce((acc, l) => ({ ...acc, [l]: DEFAULT_FORMAT$1 }), {})
});
const DEFAULT_FORMAT = {
  USD: {
    style: "currency",
    currency: "USD"
  },
  EUR: {
    style: "currency",
    currency: "EUR"
  },
  JPY: {
    style: "currency",
    currency: "JPY"
  },
  CAD: {
    style: "currency",
    currency: "CAD"
  },
  AUD: {
    style: "currency",
    currency: "AUD"
  },
  SGD: {
    style: "currency",
    currency: "SGD"
  },
  GBP: {
    style: "currency",
    currency: "GBP"
  },
  decimal: {
    style: "decimal"
  }
};
const NUMBER_FORMATS = Object.freeze({
  ...SUPPORTED_LOCALES.reduce((acc, l) => ({ ...acc, [l]: DEFAULT_FORMAT }), {})
});
const messageImports = { "./translations/en.json": () => Promise.resolve().then(function() {
  return en$1;
}), "./translations/es.json": () => Promise.resolve().then(function() {
  return es$1;
}), "./translations/fr.json": () => Promise.resolve().then(function() {
  return fr$1;
}), "./translations/it.json": () => Promise.resolve().then(function() {
  return it$1;
}), "./translations/ja.json": () => Promise.resolve().then(function() {
  return ja$1;
}), "./translations/ko.json": () => Promise.resolve().then(function() {
  return ko$1;
}), "./translations/tr.json": () => Promise.resolve().then(function() {
  return tr$1;
}), "./translations/vi.json": () => Promise.resolve().then(function() {
  return vi$1;
}), "./translations/zh-CN.json": () => Promise.resolve().then(function() {
  return zhCN$1;
}) };
function importLocale(locale) {
  const [, importLocale2] = Object.entries(messageImports).find(([key]) => key.includes(`/${locale}.`)) || [];
  return importLocale2 && importLocale2();
}
async function installI18n(app, locale = "") {
  locale = SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
  const messages = await importLocale(locale);
  const i18n = createI18n({
    legacy: false,
    locale,
    fallbackLocale: DEFAULT_LOCALE,
    messages: {
      [locale]: messages.default || messages
    },
    datetimeFormats: DATE_FORMATS,
    numberFormats: NUMBER_FORMATS
  });
  app.use(i18n);
}
const routes = setupLayouts(routes$1);
var main = vitedge(_sfc_main$a, {
  routes,
  base: ({ url }) => {
    const locale = extractLocaleFromPath(url.pathname);
    return locale === DEFAULT_LOCALE ? "/" : `/${locale}/`;
  }
}, async (ctx) => {
  Object.values({ "./modules/nprogress.ts": __glob_7_0 }).map((i) => {
    var _a;
    return (_a = i.install) == null ? void 0 : _a.call(i, ctx);
  });
  const { app, initialRoute } = ctx;
  await installI18n(app, extractLocaleFromPath(initialRoute.href));
});
const _hoisted_1$2 = {
  xmlns: "http://www.w3.org/2000/svg",
  "xmlns:xlink": "http://www.w3.org/1999/xlink",
  width: "1.2em",
  height: "1.2em",
  preserveAspectRatio: "xMidYMid meet",
  viewBox: "0 0 32 32"
};
const _hoisted_2$2 = /* @__PURE__ */ createElementVNode("path", {
  d: "M28 6v20H4V6h24m0-2H4a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h24a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z",
  fill: "currentColor"
}, null, -1);
const _hoisted_3$2 = /* @__PURE__ */ createElementVNode("path", {
  d: "M6 8h10v2H6z",
  fill: "currentColor"
}, null, -1);
const _hoisted_4$2 = /* @__PURE__ */ createElementVNode("path", {
  d: "M6 12h10v2H6z",
  fill: "currentColor"
}, null, -1);
const _hoisted_5$2 = /* @__PURE__ */ createElementVNode("path", {
  d: "M6 16h6v2H6z",
  fill: "currentColor"
}, null, -1);
const _hoisted_6 = [
  _hoisted_2$2,
  _hoisted_3$2,
  _hoisted_4$2,
  _hoisted_5$2
];
function render$2(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$2, _hoisted_6);
}
var __vite_components_0$3 = { name: "carbon-dicom-overlay", render: render$2 };
const _sfc_main$9 = {
  __ssrInlineRender: true,
  setup(__props, { expose }) {
    const frontmatter = { "title": "About" };
    expose({ frontmatter });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_carbon_dicom_overlay = __vite_components_0$3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "prose prose-sm m-auto text-left" }, _attrs))}><div class="text-center">`);
      _push(ssrRenderComponent(_component_carbon_dicom_overlay, { class: "text-4xl -mb-6 m-auto" }, null, _parent));
      _push(`<h3>About</h3></div><p><a href="https://github.com/frandiox/vitessedge-template">Vitessedge</a> is an opinionated <a href="https://github.com/vitejs/vite">Vite</a> starter template made by <a href="https://github.com/antfu">@antfu</a> and <a href="https://github.com/frandiox">@frandiox</a> for mocking apps swiftly. With <strong>file-based routing</strong>, <strong>components auto importing</strong>, <strong>markdown support</strong>, I18n, PWA and uses <strong>Tailwind</strong> v2 for UI. Its fullstack and SSR capabilities in Cloudflare Workers are added via <a href="https://github.com/frandiox/vitedge">Vitedge</a>.</p><pre class="language-js"><code class="language-js"><span class="token comment">// syntax highlighting example</span>
<span class="token keyword">function</span> <span class="token function">vitesse</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> foo <span class="token operator">=</span> <span class="token string">&#39;bar&#39;</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>foo<span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre></div>`);
    };
  }
};
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("src/pages/about.md");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
var about = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _sfc_main$9
});
const _sfc_main$8 = {
  __ssrInlineRender: true,
  setup(__props, { expose }) {
    const frontmatter = {};
    expose({ frontmatter });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "prose prose-sm m-auto text-left" }, _attrs))}><h2>File-based Routing</h2><p>Routes will auto-generated for Vue files in this dir with the same file structure. Check out <a href="https://github.com/hannoeru/vite-plugin-pages"><code>vite-plugin-pages</code></a> for more details.</p><h3>Path Aliasing</h3><p><code>~/</code> is aliased to <code>./src/</code> folder.</p><p>For example, instead of having</p><pre class="language-ts"><code class="language-ts"><span class="token keyword">import</span> utils <span class="token keyword">from</span> <span class="token string">&#39;../../../../utils&#39;</span>
</code></pre><p>now you can use</p><pre class="language-ts"><code class="language-ts"><span class="token keyword">import</span> utils <span class="token keyword">from</span> <span class="token string">&#39;~/utils&#39;</span>
</code></pre></div>`);
    };
  }
};
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("src/pages/README.md");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
var README = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _sfc_main$8
});
async function getFileData(path) {
  const promise = fetch(path, {
    headers: {
      "Content-Type": "application/json"
    }
  }).catch((error) => console.log(`Failed because: ${error}`));
  return promise;
}
function isDesktop() {
  return true;
}
function getClientX$1(e) {
  return typeof e.clientX === "undefined" ? e.touches[0].clientX : e.clientX;
}
function getClientY$1(e) {
  return typeof e.clientY === "undefined" ? e.touches[0].clientY : e.clientY;
}
const cdnPath = "https://spaces.renderpub.com/";
const defaults = {
  WIDTH: 1280,
  HEIGHT: 720,
  DEFAULT_SCENE_NUMBER: 0,
  DEFAULT_HOTSPOT_NO: 0,
  ZERO: 0,
  ONE: 1,
  CAMERA_MIN: 0.1,
  CAMERA_MAX: 1e4,
  CAMERA_FOV: 70,
  CAMERA_TARGET_OFFSET: 1e-4,
  CURSOR_RADIUS: 0.15,
  CURSOR_COLOR: 16042496,
  CURSOR_OPACITY: 0.4,
  CURSOR_ORBIT_SCALE: 2,
  HOTSPOT_GROUP_NAME: "hotspots",
  HOTSPOT_SHOW_FOR_DESCTOPE: true,
  HOTSPOT_COLOR: 16042496,
  HOTSPOT_COLOR_ACTIVE: 8388352,
  HOTSPOT_OPACITY: 0.4,
  HOTSPOT_SHOW_FOR_MOBILE: false,
  HOTSPOT_ANIMATE: 0,
  HOTSPOT_RADIUS: 20,
  WIREFRAME: false,
  TRANSPARENT: false,
  MAIN_GROUP_NAME: "room",
  SHADER_ROTATION_X: 0,
  SHADER_ROTATION_Y: 0,
  SHADER_ROTATION_Z: 0,
  TIME_CHANGE_POSITION: 1e3,
  TWEEN_DELAY_MOVEMENT: 50,
  STREAM_CUBEMAPS_CNT: 10
};
const config = {
  panoramaIsActive: false,
  expectedResources: 1
};
function CursorObject(THREE2, scene2, camera2, domElement, controls, radius, rpWebvrContainer) {
  this.domElement = domElement !== void 0 ? domElement : document;
  const scope = this;
  const raycaster = new THREE2.Raycaster();
  const mouse = new THREE2.Vector2();
  const targetObjects = [];
  new THREE2.Vector3();
  const geometry = new THREE2.PlaneGeometry(radius / 2, radius / 2);
  geometry.rotateX(-Math.PI / 2);
  const material = new THREE2.MeshBasicMaterial({ transparent: 0, opacity: defaults.CURSOR_OPACITY, depthWrite: false, depthTest: false });
  const texture = new THREE2.TextureLoader().load(`${cdnPath}hotspot_image.webp`);
  material.alphaMap = texture;
  material.alphaMap.minFilter = THREE2.LinearFilter;
  const sphereInter = new THREE2.Mesh(geometry, material);
  sphereInter.renderOrder = 10;
  sphereInter.visible = true;
  scene2.add(sphereInter);
  scope.enabled = true;
  const hideSphereSpeed = 0.05;
  let sphereScale = 1;
  let showCursore = true;
  function onDocumentMouseMove(event) {
    event.preventDefault();
    if (scope.enabled === false)
      return;
    mouse.x = (getClientX$1(event) - rpWebvrContainer.getBoundingClientRect().left) / (rpWebvrContainer.getBoundingClientRect().right - rpWebvrContainer.getBoundingClientRect().left) * 2 - 1;
    mouse.y = -((getClientY$1(event) - rpWebvrContainer.getBoundingClientRect().top) / (rpWebvrContainer.getBoundingClientRect().bottom - rpWebvrContainer.getBoundingClientRect().top)) * 2 + 1;
    showCursore = true;
  }
  function onDocumentMouseOut(event) {
    event.preventDefault();
    sphereInter.show = false;
    showCursore = false;
  }
  function onDocumentTouchStart(event) {
    if (scope.enabled === false)
      return;
    mouse.x = event.changedTouches["0"].clientX / rpWebvrContainer.getBoundingClientRect().width * 2 - 1;
    mouse.y = -(event.changedTouches["0"].clientY / rpWebvrContainer.getBoundingClientRect().height) * 2 + 1;
    showCursore = true;
  }
  scope.domElement.addEventListener("mousemove", onDocumentMouseMove, false);
  scope.domElement.addEventListener("mouseout", onDocumentMouseOut, false);
  scope.domElement.addEventListener("touchstart", onDocumentTouchStart, false);
  scope.domElement.addEventListener("touchmove", onDocumentMouseMove, false);
  scope.domElement.addEventListener("touchend", onDocumentMouseOut, false);
  this.addTargetObject = function(obj) {
    targetObjects.push(obj);
  };
  function toggleSpehreInter() {
    let k = hideSphereSpeed;
    if (!sphereInter.show)
      k = -hideSphereSpeed;
    let v = sphereInter.material.opacity + k;
    if (v < 0)
      v = 0;
    if (v > defaults.HOTSPOT_OPACITY)
      v = defaults.HOTSPOT_OPACITY;
    if (v == sphereInter.material.opacity)
      return;
    sphereInter.material.opacity = v;
  }
  this.update = function() {
    if (scope.enabled === false)
      sphereInter.show = false;
    toggleSpehreInter();
    if (scope.enabled === false)
      return;
    const isRotating = controls.isRotating;
    if (isRotating) {
      sphereInter.show = true;
      return;
    }
    raycaster.setFromCamera(mouse, camera2);
    const intersects = raycaster.intersectObjects(targetObjects, true);
    if (intersects.length > 0 && showCursore) {
      sphereInter.show = true;
      sphereInter.scale.set(defaults.CURSOR_ORBIT_SCALE, defaults.CURSOR_ORBIT_SCALE, defaults.CURSOR_ORBIT_SCALECURSOR_ORBIT_SCALE);
      sphereInter.position.copy(intersects[0].point);
      const normalMatrix = new THREE2.Matrix4();
      normalMatrix.makeRotationFromQuaternion(intersects[0].object.quaternion);
      normalMatrix.copy(normalMatrix).invert();
      normalMatrix.transpose();
      {
        sphereScale = defaults.CURSOR_ORBIT_SCALE;
      }
      sphereInter.scale.set(sphereScale, sphereScale, sphereScale);
      const normal = intersects[0].face.normal;
      normal.applyMatrix4(normalMatrix);
      const side = new THREE2.Vector3();
      side.crossVectors(normal, new THREE2.Vector3(normal.z, -normal.x, normal.y));
      const up = new THREE2.Vector3();
      up.crossVectors(side, normal);
      side.crossVectors(up, normal);
      const orientMatrix = new THREE2.Matrix4();
      orientMatrix.makeBasis(up, normal, side);
      sphereInter.setRotationFromMatrix(orientMatrix);
    } else {
      sphereInter.show = false;
    }
  };
  this.getPosition = function() {
    return sphereInter.visible || !utils.isDesktop() ? sphereInter.position : null;
  };
}
function Measure(THREE2, renderer2, scene2, camera2) {
  const sceneScale = 0.013;
  const lengthCof = 1;
  const scope = this;
  const mouse = new THREE2.Vector2();
  let mouseStart = new THREE2.Vector2();
  let canAddPoint = false;
  const raycaster = new THREE2.Raycaster();
  const color = 16042496;
  let isActive = false;
  let rulers = [];
  let activeRuler = null;
  const domElement = renderer2 !== void 0 && renderer2.domElement !== void 0 ? renderer2.domElement : document;
  let isUserInteracting = false;
  let orientationChange = false;
  const cameraObjVector = new THREE2.Vector3();
  new THREE2.Vector3();
  new THREE2.Vector3();
  let labelScale = 1;
  const frustum = new THREE2.Frustum();
  scope.toggleMeasure = function() {
    isActive = !isActive;
  };
  scope.disableMeasure = function() {
    if (isActive) {
      scope.toggleMeasure();
      mouseStart = new THREE2.Vector2();
      clearActiveRuler(scene2);
      activeRuler = null;
      canAddPoint = false;
    }
  };
  const getMousePos = function(event) {
    mouse.x = getClientX(event) / domElement.clientWidth * 2 - 1;
    console.log(domElement.clientWidth);
    mouse.y = -(getClientY(event) / domElement.clientHeight) * 2 + 1;
  };
  const createHtmlHotspot = function(title, ruler) {
    const hotspotHtml = document.createElement("div");
    hotspotHtml.classList.add("hotspot");
    const span = document.createElement("span");
    span.innerHTML = "0 mm";
    hotspotHtml.appendChild(span);
    const closeBtn = document.createElement("i");
    closeBtn.classList.add("fa");
    closeBtn.classList.add("fa-times");
    closeBtn.setAttribute("aria-hidden", "true");
    closeBtn.setAttribute("title", "Delete measurements");
    hotspotHtml.appendChild(closeBtn);
    closeBtn.onclick = function(e) {
      scene2.remove(ruler.p1);
      scene2.remove(ruler.p2);
      scene2.remove(ruler.label);
      scene2.remove(ruler.line);
      document.getElementsByTagName("body")[0].removeChild(hotspotHtml);
    };
    document.getElementsByTagName("body")[0].appendChild(hotspotHtml);
    ruler.htmlLabel = hotspotHtml;
  };
  scope.removeRulers = function() {
    rulers.forEach((ruler) => {
      if (ruler && ruler.htmlLabel) {
        scene2.remove(ruler.p1);
        scene2.remove(ruler.p2);
        scene2.remove(ruler.label);
        scene2.remove(ruler.line);
        try {
          document.getElementsByTagName("body")[0].removeChild(ruler.htmlLabel);
        } catch (e) {
        }
      }
    });
    rulers = [];
  };
  scope.hide = function() {
    rulers.forEach((ruler) => {
      if (ruler && ruler.htmlLabel) {
        ruler.p1.visible = false;
        ruler.p2.visible = false;
        ruler.line.visible = false;
        ruler.htmlLabel.style.opacity = "0.0";
      }
    });
  };
  scope.show = function() {
    rulers.forEach((ruler) => {
      if (ruler && ruler.htmlLabel) {
        ruler.p1.visible = true;
        ruler.p2.visible = true;
        ruler.line.visible = true;
        ruler.htmlLabel.style.opacity = "1.0";
      }
    });
  };
  const toScreenPosition = function(obj, camera3) {
    const vector = new THREE2.Vector3();
    const widthHalf = 0.5 * renderer2.context.canvas.width;
    const heightHalf = 0.5 * renderer2.context.canvas.height;
    obj.updateMatrixWorld();
    vector.setFromMatrixPosition(obj.matrixWorld);
    vector.project(camera3);
    vector.x = vector.x * widthHalf + widthHalf;
    vector.y = -(vector.y * heightHalf) + heightHalf;
    return { x: vector.x, y: vector.y };
  };
  var clearActiveRuler = function(scene3) {
    if (activeRuler) {
      if (activeRuler.p1)
        scene3.remove(activeRuler.p1);
      if (activeRuler.p2)
        scene3.remove(activeRuler.p2);
      if (activeRuler.line)
        scene3.remove(activeRuler.line);
      if (activeRuler.label)
        scene3.remove(activeRuler.label);
      if (activeRuler.htmlLabel) {
        try {
          document.getElementsByTagName("body")[0].removeChild(activeRuler.htmlLabel);
        } catch (e) {
        }
      }
      activeRuler = null;
    }
  };
  const recalculateLabelSize = function(camera3) {
    rulers.forEach((ruler) => {
      if (!ruler)
        return;
      cameraObjVector.subVectors(ruler.label.position, camera3.position);
      labelScale = camera3.position.distanceTo(ruler.label.position);
      {
        ruler.label.scale.set(16 * labelScale / 100, 4 * labelScale / 100, 1);
      }
    });
  };
  const updateScreenPosition = function() {
    rulers.forEach((ruler) => {
      if (!ruler || !ruler.htmlLabel)
        return;
      frustum.setFromMatrix(new THREE2.Matrix4().multiplyMatrices(camera2.projectionMatrix, camera2.matrixWorldInverse));
      ruler.position2d = toScreenPosition(ruler.label, camera2);
      if (frustum.containsPoint(ruler.label.position)) {
        ruler.position2d = toScreenPosition(ruler.label, camera2);
        ruler.htmlLabel.style.display = "block";
        ruler.htmlLabel.style.left = `${Math.floor(ruler.position2d.x / window.devicePixelRatio)}px`;
        ruler.htmlLabel.style.top = `${Math.floor(ruler.position2d.y / window.devicePixelRatio)}px`;
        ruler.htmlLabel.style.zIndex = 590 - Math.floor(camera2.position.distanceTo(ruler.label.position));
      } else {
        ruler.htmlLabel.style.display = "none";
      }
    });
  };
  const getLengthBetweenPoint = function(pointA, pointB) {
    const dir = pointB.clone().sub(pointA);
    return (dir.length() * 1e3 / lengthCof).toFixed(0);
  };
  const getPointInBetweenByPerc = function(pointA, pointB, percentage) {
    let dir = pointB.clone().sub(pointA);
    const len = dir.length();
    dir = dir.normalize().multiplyScalar(len * percentage);
    return pointA.clone().add(dir);
  };
  const onDocumentDown = function(event) {
    event.preventDefault();
    if (isActive) {
      isUserInteracting = true;
      orientationChange = false;
      canAddPoint = false;
      getMousePos(event);
      mouseStart.copy(mouse);
    }
  };
  const onDocumentMove = function(event) {
    event.preventDefault();
    if (isActive) {
      getMousePos(event);
      if (isUserInteracting && !mouseStart.equals(mouse)) {
        canAddPoint = false;
        orientationChange = true;
      }
    }
  };
  const onDocumentUp = function(event) {
    event.preventDefault();
    if (isActive) {
      isUserInteracting = false;
      canAddPoint = !orientationChange;
    }
  };
  domElement.addEventListener("contextmenu", (ev) => {
    ev.preventDefault();
    scope.disableMeasure();
    return false;
  }, false);
  domElement.addEventListener("mousedown", onDocumentDown, false);
  domElement.addEventListener("mousemove", onDocumentMove, false);
  domElement.addEventListener("mouseup", onDocumentUp, false);
  domElement.addEventListener("touchstart", onDocumentDown, false);
  domElement.addEventListener("touchmove", onDocumentMove, false);
  domElement.addEventListener("touchend", onDocumentUp, false);
  this.targetObjects = [];
  this.isActive = function() {
    return isActive;
  };
  this.processIntersections = function() {
    if (isActive) {
      raycaster.setFromCamera(mouse, camera2);
      const intersects = raycaster.intersectObjects(scope.targetObjects);
      if (intersects.length > 0) {
        if (!activeRuler && canAddPoint) {
          var coneGeometry = new THREE2.ConeGeometry(1 * sceneScale, 10 * sceneScale, 16);
          coneGeometry.rotateX(-Math.PI / 2);
          coneGeometry.translate(0, 0, 4.99 * sceneScale);
          var sphere = new THREE2.Mesh(coneGeometry, new THREE2.MeshLambertMaterial({ color }));
          sphere.position.copy(intersects[0].point);
          scene2.add(sphere);
          activeRuler = { p1: sphere };
          rulers.push(activeRuler);
        } else if (activeRuler && !activeRuler.p2) {
          var coneGeometry = new THREE2.ConeGeometry(1 * sceneScale, 10 * sceneScale, 16);
          coneGeometry.rotateX(-Math.PI / 2);
          coneGeometry.translate(0, 0, 4.99 * sceneScale);
          var sphere = new THREE2.Mesh(coneGeometry, new THREE2.MeshLambertMaterial({ color }));
          sphere.position.copy(intersects[0].point);
          scene2.add(sphere);
          activeRuler.p2 = sphere;
          const geometry = new Geometry();
          geometry.vertices.push(activeRuler.p1.position, activeRuler.p2.position);
          const line = new THREE2.Line(geometry, new THREE2.LineBasicMaterial({ color, linewidth: 10 }));
          line.frustumCulled = false;
          scene2.add(line);
          activeRuler.line = line;
          const label = new THREE2.Object3D();
          scene2.add(label);
          activeRuler.label = label;
          createHtmlHotspot("0", activeRuler);
        }
        if (activeRuler && activeRuler.p2) {
          activeRuler.p2.position.copy(intersects[0].point);
          activeRuler.line.geometry.vertices[1].copy(intersects[0].point);
          activeRuler.line.geometry.verticesNeedUpdate = true;
          activeRuler.p2.lookAt(activeRuler.p1.position);
          activeRuler.p1.lookAt(activeRuler.p2.position);
          activeRuler.label.position.copy(getPointInBetweenByPerc(activeRuler.p1.position, activeRuler.p2.position, 0.5));
          const length = getLengthBetweenPoint(activeRuler.p1.position, activeRuler.p2.position);
          if (length != activeRuler.length) {
            activeRuler.needUpdate = true;
            activeRuler.length = length;
            activeRuler.htmlLabel.querySelector("span").innerHTML = `${activeRuler.length} mm`;
          }
          if (canAddPoint) {
            setTimeout(() => {
            }, 500);
            activeRuler = null;
          }
        }
        canAddPoint = false;
      }
    } else {
      clearActiveRuler(scene2);
      recalculateLabelSize(camera2);
    }
    updateScreenPosition();
  };
  this.calculateVisibility = function(camera3) {
    rulers.forEach((ruler) => {
      if (!ruler)
        return;
      {
        ruler.label.material.depthTest = false;
      }
    });
  };
}
function VREffect(THREE2, renderer2, onError) {
  let vrDisplay, vrDisplays;
  const eyeTranslationL = new THREE2.Vector3();
  const eyeTranslationR = new THREE2.Vector3();
  let renderRectL, renderRectR;
  let frameData = null;
  if ("VRFrameData" in window)
    frameData = new window.VRFrameData();
  function gotVRDisplays(displays) {
    vrDisplays = displays;
    if (displays.length > 0)
      vrDisplay = displays[0];
    else if (onError)
      onError("HMD not available");
  }
  if (navigator.getVRDisplays) {
    navigator.getVRDisplays().then(gotVRDisplays).catch(() => {
      console.warn("THREE.VREffect: Unable to get VR Displays");
    });
  }
  this.isPresenting = false;
  this.scale = 1;
  const scope = this;
  let rendererSize = new THREE2.Vector2();
  renderer2.getSize(rendererSize);
  let rendererUpdateStyle = false;
  let rendererPixelRatio = renderer2.getPixelRatio();
  this.getVRDisplay = function() {
    return vrDisplay;
  };
  this.setVRDisplay = function(value) {
    vrDisplay = value;
  };
  this.getVRDisplays = function() {
    console.warn("THREE.VREffect: getVRDisplays() is being deprecated.");
    return vrDisplays;
  };
  this.setSize = function(width, height, updateStyle) {
    rendererSize = { width, height };
    rendererUpdateStyle = updateStyle;
    if (scope.isPresenting) {
      const eyeParamsL = vrDisplay.getEyeParameters("left");
      renderer2.setPixelRatio(1);
      renderer2.setSize(eyeParamsL.renderWidth * 2, eyeParamsL.renderHeight, false);
    } else {
      renderer2.setPixelRatio(rendererPixelRatio);
      renderer2.setSize(width, height, updateStyle);
    }
  };
  const canvas = renderer2.domElement;
  const defaultLeftBounds = [0, 0, 0.5, 1];
  const defaultRightBounds = [0.5, 0, 0.5, 1];
  function onVRDisplayPresentChange() {
    const wasPresenting = scope.isPresenting;
    scope.isPresenting = vrDisplay !== void 0 && vrDisplay.isPresenting;
    if (scope.isPresenting) {
      const eyeParamsL = vrDisplay.getEyeParameters("left");
      const eyeWidth = eyeParamsL.renderWidth;
      const eyeHeight = eyeParamsL.renderHeight;
      if (!wasPresenting) {
        rendererPixelRatio = renderer2.getPixelRatio();
        rendererSize = renderer2.getSize();
        renderer2.setPixelRatio(1);
        renderer2.setSize(eyeWidth * 2, eyeHeight, false);
      }
    } else if (wasPresenting) {
      renderer2.setPixelRatio(rendererPixelRatio);
      renderer2.setSize(rendererSize.width, rendererSize.height, rendererUpdateStyle);
    }
  }
  window.addEventListener("vrdisplaypresentchange", onVRDisplayPresentChange, false);
  this.setFullScreen = function(boolean) {
    return new Promise((resolve, reject) => {
      if (vrDisplay === void 0) {
        reject(new Error("No VR hardware found."));
        return;
      }
      if (scope.isPresenting === boolean) {
        resolve();
        return;
      }
      if (boolean)
        resolve(vrDisplay.requestPresent([{ source: canvas }]));
      else
        resolve(vrDisplay.exitPresent());
    });
  };
  this.requestPresent = function() {
    return this.setFullScreen(true);
  };
  this.exitPresent = function() {
    return this.setFullScreen(false);
  };
  this.requestAnimationFrame = function(f) {
    if (vrDisplay !== void 0)
      return vrDisplay.requestAnimationFrame(f);
    else
      return window.requestAnimationFrame(f);
  };
  this.cancelAnimationFrame = function(h) {
    if (vrDisplay !== void 0)
      vrDisplay.cancelAnimationFrame(h);
    else
      window.cancelAnimationFrame(h);
  };
  this.submitFrame = function() {
    if (vrDisplay !== void 0 && scope.isPresenting)
      vrDisplay.submitFrame();
  };
  this.autoSubmitFrame = true;
  const cameraL = new THREE2.PerspectiveCamera();
  cameraL.layers.enable(1);
  const cameraR = new THREE2.PerspectiveCamera();
  cameraR.layers.enable(2);
  this.render = function(scene2, camera2, renderTarget, forceClear) {
    if (vrDisplay && scope.isPresenting) {
      const autoUpdate = scene2.autoUpdate;
      if (autoUpdate) {
        scene2.updateMatrixWorld();
        scene2.autoUpdate = false;
      }
      const eyeParamsL = vrDisplay.getEyeParameters("left");
      const eyeParamsR = vrDisplay.getEyeParameters("right");
      eyeTranslationL.fromArray(eyeParamsL.offset);
      eyeTranslationR.fromArray(eyeParamsR.offset);
      if (Array.isArray(scene2)) {
        console.warn("THREE.VREffect.render() no longer supports arrays. Use object.layers instead.");
        scene2 = scene2[0];
      }
      const size = renderer2.getSize();
      const layers = vrDisplay.getLayers();
      let leftBounds;
      let rightBounds;
      if (layers.length) {
        const layer = layers[0];
        leftBounds = layer.leftBounds !== null && layer.leftBounds.length === 4 ? layer.leftBounds : defaultLeftBounds;
        rightBounds = layer.rightBounds !== null && layer.rightBounds.length === 4 ? layer.rightBounds : defaultRightBounds;
      } else {
        leftBounds = defaultLeftBounds;
        rightBounds = defaultRightBounds;
      }
      renderRectL = { x: Math.round(size.width * leftBounds[0]), y: Math.round(size.height * leftBounds[1]), width: Math.round(size.width * leftBounds[2]), height: Math.round(size.height * leftBounds[3]) };
      renderRectR = { x: Math.round(size.width * rightBounds[0]), y: Math.round(size.height * rightBounds[1]), width: Math.round(size.width * rightBounds[2]), height: Math.round(size.height * rightBounds[3]) };
      if (renderTarget) {
        renderer2.setRenderTarget(renderTarget);
        renderTarget.scissorTest = true;
      } else {
        renderer2.setRenderTarget(null);
        renderer2.setScissorTest(true);
      }
      if (renderer2.autoClear || forceClear)
        renderer2.clear();
      if (camera2.parent === null)
        camera2.updateMatrixWorld();
      camera2.matrixWorld.decompose(cameraL.position, cameraL.quaternion, cameraL.scale);
      camera2.matrixWorld.decompose(cameraR.position, cameraR.quaternion, cameraR.scale);
      const scale = this.scale;
      eyeTranslationL.x = eyeTranslationL.x * 0;
      eyeTranslationR.x = eyeTranslationR.x * 0;
      cameraL.translateOnAxis(eyeTranslationL, scale);
      cameraR.translateOnAxis(eyeTranslationR, scale);
      if (vrDisplay.getFrameData) {
        vrDisplay.depthNear = camera2.near;
        vrDisplay.depthFar = camera2.far;
        vrDisplay.getFrameData(frameData);
        cameraL.projectionMatrix.elements = frameData.leftProjectionMatrix;
        cameraR.projectionMatrix.elements = frameData.rightProjectionMatrix;
      } else {
        cameraL.projectionMatrix = fovToProjection(eyeParamsL.fieldOfView, true, camera2.near, camera2.far);
        cameraR.projectionMatrix = fovToProjection(eyeParamsR.fieldOfView, true, camera2.near, camera2.far);
      }
      if (renderTarget) {
        renderTarget.viewport.set(renderRectL.x, renderRectL.y, renderRectL.width, renderRectL.height);
        renderTarget.scissor.set(renderRectL.x, renderRectL.y, renderRectL.width, renderRectL.height);
      } else {
        renderer2.setViewport(renderRectL.x, renderRectL.y, renderRectL.width, renderRectL.height);
        renderer2.setScissor(renderRectL.x, renderRectL.y, renderRectL.width, renderRectL.height);
      }
      renderer2.render(scene2, cameraL, renderTarget, forceClear);
      if (renderTarget) {
        renderTarget.viewport.set(renderRectR.x, renderRectR.y, renderRectR.width, renderRectR.height);
        renderTarget.scissor.set(renderRectR.x, renderRectR.y, renderRectR.width, renderRectR.height);
      } else {
        renderer2.setViewport(renderRectR.x, renderRectR.y, renderRectR.width, renderRectR.height);
        renderer2.setScissor(renderRectR.x, renderRectR.y, renderRectR.width, renderRectR.height);
      }
      renderer2.render(scene2, cameraR, renderTarget, forceClear);
      if (renderTarget) {
        renderTarget.viewport.set(0, 0, size.width, size.height);
        renderTarget.scissor.set(0, 0, size.width, size.height);
        renderTarget.scissorTest = false;
        renderer2.setRenderTarget(null);
      } else {
        renderer2.setViewport(0, 0, size.width, size.height);
        renderer2.setScissorTest(false);
      }
      if (autoUpdate)
        scene2.autoUpdate = true;
      if (scope.autoSubmitFrame)
        scope.submitFrame();
      return;
    }
    renderer2.render(scene2, camera2, renderTarget, forceClear);
  };
  this.dispose = function() {
    window.removeEventListener("vrdisplaypresentchange", onVRDisplayPresentChange, false);
  };
  function fovToNDCScaleOffset(fov) {
    const pxscale = 2 / (fov.leftTan + fov.rightTan);
    const pxoffset = (fov.leftTan - fov.rightTan) * pxscale * 0.5;
    const pyscale = 2 / (fov.upTan + fov.downTan);
    const pyoffset = (fov.upTan - fov.downTan) * pyscale * 0.5;
    return { scale: [pxscale, pyscale], offset: [pxoffset, pyoffset] };
  }
  function fovPortToProjection(fov, rightHanded, zNear, zFar) {
    rightHanded = rightHanded === void 0 ? true : rightHanded;
    zNear = zNear === void 0 ? 0.01 : zNear;
    zFar = zFar === void 0 ? 1e4 : zFar;
    const handednessScale = rightHanded ? -1 : 1;
    const mobj = new THREE2.Matrix4();
    const m = mobj.elements;
    const scaleAndOffset = fovToNDCScaleOffset(fov);
    m[0 * 4 + 0] = scaleAndOffset.scale[0];
    m[0 * 4 + 1] = 0;
    m[0 * 4 + 2] = scaleAndOffset.offset[0] * handednessScale;
    m[0 * 4 + 3] = 0;
    m[1 * 4 + 0] = 0;
    m[1 * 4 + 1] = scaleAndOffset.scale[1];
    m[1 * 4 + 2] = -scaleAndOffset.offset[1] * handednessScale;
    m[1 * 4 + 3] = 0;
    m[2 * 4 + 0] = 0;
    m[2 * 4 + 1] = 0;
    m[2 * 4 + 2] = zFar / (zNear - zFar) * -handednessScale;
    m[2 * 4 + 3] = zFar * zNear / (zNear - zFar);
    m[3 * 4 + 0] = 0;
    m[3 * 4 + 1] = 0;
    m[3 * 4 + 2] = handednessScale;
    m[3 * 4 + 3] = 0;
    mobj.transpose();
    return mobj;
  }
  function fovToProjection(fov, rightHanded, zNear, zFar) {
    const DEG2RAD = Math.PI / 180;
    const fovPort = { upTan: Math.tan(fov.upDegrees * DEG2RAD), downTan: Math.tan(fov.downDegrees * DEG2RAD), leftTan: Math.tan(fov.leftDegrees * DEG2RAD), rightTan: Math.tan(fov.rightDegrees * DEG2RAD) };
    return fovPortToProjection(fovPort, rightHanded, zNear, zFar);
  }
}
function Hotspots(THREE2, scene2, locations) {
  const raycaster = new THREE2.Raycaster();
  const scope = this;
  const geometry = new THREE2.PlaneGeometry(defaults.HOTSPOT_RADIUS, defaults.HOTSPOT_RADIUS);
  geometry.translate(-0, -0, 0.05);
  geometry.rotateX(-Math.PI / 2);
  const group = scene2.getObjectByName(defaults.MAIN_GROUP_NAME);
  const hotspots = new THREE2.Group();
  hotspots.name = defaults.HOTSPOT_GROUP_NAME;
  const material = new THREE2.MeshBasicMaterial({ transparent: 1, opacity: defaults.HOTSPOT_OPACITY });
  const texture = new THREE2.TextureLoader().load(`${cdnPath}hotspot_image.webp`);
  material.alphaMap = texture;
  material.alphaMap.minFilter = THREE2.LinearFilter;
  for (const positionName in locations) {
    const pos = locations[positionName].position;
    raycaster.set(pos, new THREE2.Vector3(0, -1, 0));
    const intersects = raycaster.intersectObject(group, false);
    if (intersects.length > 0) {
      const hotspot = new THREE2.Mesh(geometry, material);
      hotspot.renderOrder = 3;
      hotspot.position.copy(intersects[0].point);
      hotspot.name = positionName;
      hotspots.add(hotspot);
      locations[positionName].hotspot = hotspot.position;
    }
  }
  scope.objects = hotspots.children;
  scene2.add(hotspots);
  this.update = function() {
  };
  this.changeActiveLocation = function(name) {
    if (hotspots && hotspots.children) {
      hotspots.children.forEach((hotspot) => {
        hotspot.visible = name !== hotspot.name;
      });
    }
  };
  this.show = function() {
    if (hotspots && hotspots.children) {
      hotspots.children.forEach((hotspot) => {
        hotspot.visible = true;
      });
    }
  };
  this.hide = function() {
    if (hotspots && hotspots.children) {
      hotspots.children.forEach((hotspot) => {
        hotspot.visible = false;
      });
    }
  };
}
function getShaders() {
  return {
    uniforms: { progress: { type: "f", value: 0 } },
    vertexShader: [
      "uniform vec3 uBoxPosition0;",
      "uniform vec3 uBoxPosition1;",
      "uniform mat3 uRotXMatrix;",
      "uniform mat3 uRotYMatrix;",
      "uniform mat3 uRotZMatrix;",
      "",
      "varying vec3 vWorldPosition0;",
      "varying vec3 vWorldPosition1;",
      "",
      "void main()",
      "{",
      "   vec4 worldPosition = modelMatrix * vec4(position, 1.0);",
      "   vWorldPosition0 = (worldPosition.xyz - uBoxPosition0) * vec3( 1.0, 1.0, -1.0);",
      "   vWorldPosition1 = (worldPosition.xyz - uBoxPosition1) * vec3( 1.0, 1.0, -1.0);",
      "   vWorldPosition0 = uRotYMatrix * uRotZMatrix * uRotXMatrix * vWorldPosition0;",
      "   vWorldPosition1 = uRotYMatrix * uRotZMatrix * uRotXMatrix * vWorldPosition1;",
      "",
      "   vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
      "   gl_Position = projectionMatrix * mvPosition;",
      "}"
    ].join("\n"),
    fragmentShader: [
      "uniform float uProgress;",
      "uniform samplerCube uBoxMap0;",
      "uniform samplerCube uBoxMap1;",
      "",
      "varying vec3 vWorldPosition0;",
      "varying vec3 vWorldPosition1;",
      "",
      "void main( void ) {",
      "",
      "   vec4 colorFromBox0 = textureCube(uBoxMap0, vWorldPosition0.xyz);",
      "   vec4 colorFromBox1 = textureCube(uBoxMap1, vWorldPosition1.xyz);",
      "   vec3 color = mix(colorFromBox0.xyz, colorFromBox1.xyz, uProgress);",
      "   gl_FragColor = vec4( color,  1.0 ); ",
      "}"
    ].join("\n")
  };
}
let touchFlag = 0;
function Tags(THREE2, container2, renderer2, scene2, camera2, tagsData, radius, rpWebvrContainer) {
  this.domElement = renderer2.domElement !== void 0 ? renderer2.domElement : document;
  const scope = this;
  const raycaster = new THREE2.Raycaster();
  const mouse = new THREE2.Vector2();
  scope.enabled = true;
  const tagGroup = new THREE2.Group();
  tagGroup.name = "Tags";
  function createTextLabel() {
    const card = document.createElement("div");
    card.className = "text-label";
    card.style.position = "absolute";
    card.hidden = false;
    card.style.overflow = "hidden";
    return {
      element: card,
      parent: false,
      position: new THREE2.Vector3(0, 0, 0),
      setHTML(name, description, medialink, mediatype) {
        const cardContent = document.createElement("div");
        cardContent.style.padding = "10px";
        cardContent.style.display = "none";
        cardContent.style.backgroundColor = "rgba(24, 24, 27, 0.8)";
        cardContent.style.border = "8px solid rgba(24, 24, 27, 1)";
        cardContent.style.color = "#FAFAFA";
        cardContent.style.width = "340px";
        cardContent.innerHTML = "";
        cardContent.hidden = false;
        cardContent.style.overflow = "hidden";
        cardContent.style.padding = "10px";
        cardContent.style.borderRadius = "4px";
        const iconContainer = document.createElement("img");
        iconContainer.src = `${cdnPath}icons8-info%20(4).svg`;
        iconContainer.style.border = "0px solid red";
        iconContainer.style.width = "32px";
        card.addEventListener("touchstart", (e) => {
          touchFlag = 1;
        }, false);
        card.addEventListener("touchend", (e) => {
          touchFlag = 0;
        }, false);
        card.addEventListener("mouseover", mOver_tags, false);
        card.addEventListener("mouseout", mOut_tags, false);
        const cardTitle = document.createElement("div");
        cardTitle.innerText = `${name}`;
        cardTitle.style.fontWeight = "bold";
        cardTitle.style.paddingBottom = "20px";
        library.add(faExternalLinkAlt);
        const popOut = document.createElement("a");
        popOut.setAttribute("id", "test");
        popOut.innerHTML = icon({ prefix: "fas", iconName: "external-link-alt" }).html;
        popOut.style.fontSize = "15px";
        popOut.style.position = "absolute";
        popOut.style.display = "inline";
        popOut.style.right = "20px";
        popOut.setAttribute("href", medialink);
        popOut.setAttribute("target", "_blank");
        cardContent.appendChild(popOut);
        function videoCode() {
          const VID_REGEX = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
          try {
            var check = `${medialink}`.match(VID_REGEX)[1];
          } catch (e) {
            var check = "njX2bu-_Vw4";
          }
          return check;
        }
        let media;
        if (mediatype == "Video") {
          media = document.createElement("iframe");
          media.setAttribute("src", `https://www.youtube.com/embed/${videoCode()}?enablejsapi=1`);
        } else if (mediatype == "Image") {
          media = document.createElement("img");
          media.setAttribute("src", `${medialink}`);
        } else {
          media = document.createElement("div");
          media.innerHTML = `Go to ${medialink}`;
        }
        media.setAttribute("width", "100%");
        media.style.paddingBottom = "20px";
        function stopThis(cardContent2) {
          const iframeWindow = cardContent2.getElementsByTagName("iframe")[0].contentWindow;
          iframeWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', "*");
        }
        const show = function(cardContent2) {
          cardContent2.style.display = "block";
          scope.domElement.addEventListener("touchstart", ontouchstart, false);
        };
        const hide = function(cardContent2) {
          if (mediatype == "Video")
            stopThis(cardContent2);
          cardContent2.style.display = "none";
        };
        function mOver_tags() {
          if (touchFlag == 0) {
            window.mytimeout = setTimeout(() => {
              show(cardContent);
            }, 600);
          } else {
            show(cardContent);
          }
        }
        function mOut_tags() {
          hide(cardContent);
          clearTimeout(window.mytimeout);
        }
        function ontouchstart() {
          hide(cardContent);
        }
        const cardDescription = document.createElement("div");
        cardDescription.innerText = description;
        cardContent.appendChild(cardTitle);
        cardContent.appendChild(media);
        cardContent.appendChild(cardDescription);
        this.element.appendChild(iconContainer);
        this.element.appendChild(cardContent);
      },
      setParent(threejsobj) {
        this.parent = threejsobj;
      },
      updatePosition() {
        if (parent) {
          const tempPos = new THREE2.Vector3();
          tempPos.copy(this.parent.position);
          tempPos.add(this.parent.circle.position);
          this.position.copy(tempPos);
        }
        const coords2d = this.get2DCoords(this.position, camera2);
        if (!this.parent.textVisible || coords2d.x < 0 || coords2d.y < 0 || coords2d.x >= rpWebvrContainer.getBoundingClientRect().width - 20 || coords2d.y >= rpWebvrContainer.getBoundingClientRect().height - 20 || coords2d.z >= 1) {
          this.element.hidden = true;
          return;
        } else {
          this.element.hidden = false;
        }
        if (this.parent.name == "t1")
          ;
        this.element.style.left = `${coords2d.x}px`;
        this.element.style.top = `${coords2d.y}px`;
      },
      get2DCoords(position, camera3) {
        const vector = position.project(camera3);
        vector.x = (vector.x + 1) / 2 * rpWebvrContainer.getBoundingClientRect().width;
        vector.y = -(vector.y - 1) / 2 * rpWebvrContainer.getBoundingClientRect().height;
        return vector;
      }
    };
  }
  function createTag(name, position, height, color, medialink, description, mediatype) {
    const tempGroup = new THREE2.Group();
    tempGroup.name = name;
    const points = [];
    points.push(new THREE2.Vector3(0, 0, 0));
    points.push(new THREE2.Vector3(0, height, 0));
    const circleGeometry = new THREE2.CircleGeometry(1, 1);
    const circleMaterial = new THREE2.MeshBasicMaterial({
      color: 65535,
      side: THREE2.DoubleSide
    });
    const circle = new THREE2.Mesh(circleGeometry, circleMaterial);
    circle.renderOrder = 100;
    circle.name = "Circle";
    circle.visible = false;
    circle.position.copy(new THREE2.Vector3(0, height, 0));
    const text = createTextLabel();
    tempGroup.circle = circle;
    tempGroup.add(circle);
    tempGroup.position.copy(position);
    tempGroup.textTag = text;
    tempGroup.textVisible = true;
    tempGroup.description = description;
    tempGroup.color = color;
    tempGroup.medialink = medialink;
    tempGroup.mediatype = mediatype;
    text.setHTML(name, description, medialink, mediatype);
    text.setParent(tempGroup);
    const tagsUI = document.getElementById("tagsUI");
    tagsUI.appendChild(text.element);
    return tempGroup;
  }
  function onDocumentMouseMove(event) {
    event.preventDefault();
    if (scope.enabled === false)
      return;
    mouse.x = getClientX$1(event) / rpWebvrContainer.getBoundingClientRect().width * 2 - 1;
    mouse.y = -(getClientY$1(event) / rpWebvrContainer.getBoundingClientRect().height) * 2 + 1;
  }
  function onDocumentMouseOut(event) {
    event.preventDefault();
  }
  function onDocumentTouchStart(event) {
    if (scope.enabled === false)
      return;
    mouse.x = event.changedTouches["0"].clientX / rpWebvrContainer.getBoundingClientRect().width * 2 - 1;
    mouse.y = -(event.changedTouches["0"].clientY / rpWebvrContainer.getBoundingClientRect().height) * 2 + 1;
  }
  function main2() {
    for (let i = 0; i < tagsData.length; i++) {
      const tag = createTag(tagsData[i].name, tagsData[i].location, tagsData[i].height, tagsData[i].color, tagsData[i].medialink, tagsData[i].description, tagsData[i].mediatype);
      tagGroup.add(tag);
    }
    scene2.add(tagGroup);
  }
  scope.domElement.addEventListener("mousemove", onDocumentMouseMove, false);
  scope.domElement.addEventListener("mouseout", onDocumentMouseOut, false);
  scope.domElement.addEventListener("touchstart", onDocumentTouchStart, false);
  scope.domElement.addEventListener("touchmove", onDocumentMouseMove, false);
  scope.domElement.addEventListener("touchend", onDocumentMouseOut, false);
  this.updateTagVisiblity = function() {
    tagGroup.traverse((child) => {
      if (child.circle) {
        let tempPos = new THREE2.Vector3();
        tempPos = tempPos.copy(child.position);
        tempPos = tempPos.add(child.circle.position);
        tempPos = tempPos.sub(camera2.position).normalize();
        raycaster.camera = camera2;
        raycaster.set(camera2.position, tempPos);
        const intersects = raycaster.intersectObjects(scene2.children, true);
        if (intersects[0].object.parent.name == child.name)
          child.textVisible = true;
        else
          child.textVisible = false;
      }
    });
  };
  this.update = function() {
    tagGroup.traverse((child) => {
      if (child.circle) {
        child.circle.quaternion.copy(camera2.quaternion);
        child.textTag.updatePosition();
      }
    });
  };
  main2();
  this.updateTagVisiblity();
}
;
var webviewer_vue_vue_type_style_index_0_lang = "";
let THREE;
let OrbitControls;
let GLTFLoader;
let DRACOLoader;
let computeBoundsTree;
let disposeBoundsTree;
let acceleratedRaycast;
const _sfc_main$7 = {
  props: {
    userId: {
      type: String,
      required: true,
      default: " "
    },
    projectId: {
      type: String,
      required: true,
      default: " "
    },
    startScene: {
      type: String,
      required: true,
      default: " "
    },
    startHotspot: {
      type: String,
      required: true,
      default: " "
    }
  },
  async mounted() {
    THREE = await import("https://cdn.skypack.dev/three@0.136.0");
    const OrbitControlsModule = await import("https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js");
    OrbitControls = OrbitControlsModule.OrbitControls;
    const GLTFLoaderModule = await import("https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader.js");
    GLTFLoader = GLTFLoaderModule.GLTFLoader;
    const DRACOLoaderModule = await import("https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/DRACOLoader.js");
    DRACOLoader = DRACOLoaderModule.DRACOLoader;
    const BVH = await import("https://cdn.skypack.dev/three-mesh-bvh@0.5.5");
    computeBoundsTree = BVH.computeBoundsTree;
    disposeBoundsTree = BVH.disposeBoundsTree;
    acceleratedRaycast = BVH.acceleratedRaycast;
    this.webVr(this.userId, this.projectId, this.startScene, this.startHotspot);
  },
  methods: {
    webVr(userid, projectid, startScene, startHotspot) {
      let rpWebvrContainer, container2, element;
      let touchMoveFlag = 0;
      let raycaster;
      let camera2, cursor;
      let scene2, renderer2, effect;
      let controls;
      let renderRequested = false;
      let maxAnisotropy = 6;
      let shaderMaterial;
      const mouseDownPos = {};
      const mouseUpPos = {};
      let clicked = 0;
      let currentScene = 0;
      let currenthotspot = 0;
      let tags;
      let cubeMap0 = new THREE.CubeTexture();
      let cubeMap1 = new THREE.CubeTexture();
      new THREE.Clock();
      const sceneConfig = { db: "", mdl: "", map: "", size: 0, uid: -1, scale: 1, data: {}, cursorRadius: 0.15, tagsRadius: 0.05 };
      const locations = {};
      let startPosition;
      let currentPosition, nextPosition;
      let allDataLoaded = true;
      const manager = new THREE.LoadingManager();
      const manager2 = new THREE.LoadingManager();
      const manager3 = new THREE.LoadingManager();
      const gltfLoadingManager = new THREE.LoadingManager();
      let loadingScreen;
      let hotspots;
      let positionIsMoving = false;
      let IsCameraRotating = false;
      let globalImagesArray = [];
      const streamedCubeMaps = [];
      const shaderBoxMap = ["uBoxMap0", "uBoxMap1"];
      const shaderBoxMapPosition = ["uBoxPosition0", "uBoxPosition1"];
      let shaderBoxMapState = 0;
      const subV = new THREE.Vector3();
      const loadDummy = document.getElementById("load-dummy");
      document.getElementById("progress-bg");
      document.getElementById("progress-preview");
      document.getElementById("progress-bar");
      document.getElementById("load-progress");
      document.getElementById("tagsUI");
      function getData() {
        sceneConfig.db = `${cdnPath}spacesDemo/${userid}/${projectid}/Data/payload.json`;
        const jsonData = getFileData(sceneConfig.db).then((data) => data.json());
        jsonData.then((data) => dataParse(data));
      }
      function dataParse(data) {
        if (startScene)
          currentScene = startScene;
        else
          currentScene = data.initialScene;
        if (startHotspot)
          currenthotspot = startHotspot;
        else
          currenthotspot = data.scenes[currentScene].initialView;
        startPosition = currenthotspot;
        sceneConfig.data = data;
        sceneConfig.path = data.scenes[data.initialScene].path;
        sceneConfig.onSceneUpdate = function(callback) {
        };
        switch (sceneConfig.data.sceneUnits) {
          case "Meters":
            sceneConfig.scale = 1;
            sceneConfig.cursorRadius = 0.15;
            sceneConfig.tagsRadius = 0.05;
            break;
          case "Centimeters":
            sceneConfig.scale = 0.01;
            sceneConfig.cursorRadius = 15;
            sceneConfig.tagsRadius = 5;
            break;
          case "Feet":
            sceneConfig.scale = 0.3;
            sceneConfig.cursorRadius = 0.5;
            sceneConfig.tagsRadius = 0.15;
            break;
          case "inches":
            sceneConfig.scale = 0.0254;
            sceneConfig.cursorRadius = 6;
            sceneConfig.tagsRadius = 2;
            break;
          default:
            sceneConfig.scale = 1;
            sceneConfig.cursorRadius = 0.15;
            sceneConfig.tagsRadius = 0.05;
            break;
        }
        sceneConfig.mdl = data.scenes[currentScene].modelPath;
        sceneConfig.size = data.scenes[currentScene].size;
        init();
        loadSceneGLTF(currentScene, currenthotspot);
        loadTags(currentScene);
        requestRenderIfNotRequested();
      }
      getData();
      function resize() {
        let tmr;
        const w = rpWebvrContainer.getBoundingClientRect().width;
        const h = rpWebvrContainer.getBoundingClientRect().height;
        camera2.aspect = w / h;
        camera2.updateProjectionMatrix();
        renderer2.setSize(w, h);
        effect.setSize(w, h);
        window.removeEventListener("resize", resize, true);
        clearTimeout(tmr);
        tmr = setTimeout(() => {
          window.addEventListener("resize", resize, false);
        }, 1e3);
        requestRenderIfNotRequested();
      }
      function visibleElement(el, state) {
        const display = state ? "inherit" : "none";
        if (el instanceof HTMLCollection) {
          for (const i in el) {
            if (typeof el[i] === "object")
              el[i].style.display = display;
          }
          return;
        }
        el.style.display = display;
      }
      function IsAdjacent(h1, h2) {
        const origin = h1.position;
        const dest = new THREE.Vector3().subVectors(h2.position, new THREE.Vector3(0, 113.4, 0));
        console.log(origin);
        console.log(dest);
        const geometry = new THREE.SphereGeometry(15, 32, 16);
        const material1 = new THREE.MeshBasicMaterial({ color: 16711680 });
        const material2 = new THREE.MeshBasicMaterial({ color: 65280 });
        const sphere1 = new THREE.Mesh(geometry, material1);
        const sphere2 = new THREE.Mesh(geometry, material2);
        sphere1.position.set(origin.x, origin.y, origin.z);
        sphere2.position.set(dest.x, dest.y, dest.z);
        const normal = new THREE.Vector3();
        normal.subVectors(dest, origin).normalize();
        raycaster.set(origin, normal);
        const intersects = raycaster.intersectObjects(locations, true);
        if (intersects.length > 0) {
          console.log(intersects[0].object.name);
          return intersects[0].object == h2;
        } else {
          console.log("no hits");
          return false;
        }
      }
      function onDocumentMouseUp(e) {
        if (e.type.startsWith("touch")) {
          if (touchMoveFlag == 1)
            IsCameraRotating = true;
        } else {
          mouseUpPos.x = e.offsetX;
          mouseUpPos.y = e.offsetY;
          if (mouseDownPos.x != mouseUpPos.x && mouseDownPos.y != mouseUpPos.y)
            IsCameraRotating = true;
          else
            IsCameraRotating = false;
        }
        const cursorPosition = cursor.getPosition();
        if (cursorPosition && !IsCameraRotating && !controls.fovChanged && allDataLoaded) {
          let nextPosition2 = currentPosition;
          let distanceToNextPosition = Infinity;
          for (const positionName in locations) {
            let pos = locations[positionName].hotspot;
            if (!pos)
              pos = locations[positionName].position;
            const distance = cursorPosition.distanceTo(pos);
            if (distance < distanceToNextPosition) {
              distanceToNextPosition = distance;
              nextPosition2 = locations[positionName];
            }
          }
          if (nextPosition2 != currentPosition) {
            const adjacent = IsAdjacent(currentPosition, nextPosition2);
            console.log(adjacent);
            streamCubeMap(nextPosition2.name);
          }
        }
        IsCameraRotating = false;
      }
      function onDocumentMouseDown(e) {
        console.log(e);
        mouseDownPos.x = e.offsetX;
        mouseDownPos.y = e.offsetY;
      }
      function onDocumentMouseMove(e) {
        requestRenderIfNotRequested();
      }
      function onCameraRotationStarted() {
      }
      function onCameraRotationEnded() {
      }
      function onCameraRotationChanged() {
        requestRenderIfNotRequested();
      }
      function onDocumentTouchStart(e) {
        onDocumentMouseDown(e);
        const t = e.touches.length;
        if (t != 1)
          return false;
        onDocumentMouseUp(e);
        e.preventDefault();
      }
      function onDocumentTouchMove(e) {
        touchMoveFlag = 1;
      }
      function onDocumentTouchEnd(e) {
        touchMoveFlag = 0;
        onDocumentMouseUp(e);
      }
      function resizeRendererToDisplaySize(renderer3) {
        const canvas = renderer3.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
          camera2.aspect = width / height;
          camera2.updateProjectionMatrix();
          renderer3.setSize(width, height, false);
          effect.setSize(width, height);
        }
        return needResize;
      }
      function render2() {
        renderRequested = void 0;
        if (resizeRendererToDisplaySize(renderer2)) {
          const canvas = renderer2.domElement;
          camera2.aspect = canvas.clientWidth / canvas.clientHeight;
          camera2.updateProjectionMatrix();
        }
        if (hotspots)
          hotspots.update();
        if (clicked == 1)
          TWEEN.update();
        cursor.update();
        tags.update();
        controls.update();
        effect.render(scene2, camera2);
      }
      function requestRenderIfNotRequested() {
        if (!renderRequested) {
          renderRequested = true;
          requestAnimationFrame(render2);
        }
      }
      function cancelStream() {
        for (const i in globalImagesArray) {
          const url = globalImagesArray[i].src;
          if (!isStreamed(url) && url.includes("@"))
            globalImagesArray[i].src = "";
        }
        globalImagesArray = [];
      }
      function getInverse(v) {
        if (v == 1)
          return 0;
        else
          return 1;
      }
      function addStreamCubeMap(name) {
        if (isCubeMapStreamed(name))
          return false;
        streamedCubeMaps.push(`${name}@`);
        return true;
      }
      function isCubeMapStreamed(name) {
        return streamedCubeMaps.includes(`${name}@`);
      }
      function updateCubemap2(targetCubemap, sourceCubemap) {
        targetCubemap.value = sourceCubemap;
        try {
          if (targetCubemap.value.image && targetCubemap.value.image.length > 0 && sourceCubemap.image.length > 0) {
            for (let i = 0; i < targetCubemap.image.length; i++)
              targetCubemap.value.image[i] = sourceCubemap.image[i].cloneNode();
          } else {
            targetCubemap.value.image = sourceCubemap.image.slice();
          }
          targetCubemap.value.needsUpdate = true;
        } catch (e) {
        }
      }
      function streamNearCubeMaps(name, cancel = true) {
        const max = defaults.STREAM_CUBEMAPS_CNT;
        setTimeout(() => {
          if (cancel)
            cancelStream();
          const arr = [];
          for (const pos in locations) {
            const distance = locations[name].position.distanceTo(locations[pos].position);
            arr.push({ name: pos, dist: distance.toFixed(3) });
          }
          arr.sort((a, b) => {
            return a.dist - b.dist;
          });
          if (arr.length > 1)
            arr.shift();
          let loaded = 0;
          for (const i in arr) {
            var tempName = arr[i].name;
            if (!tempName)
              continue;
            if (isCubeMapStreamed(tempName))
              continue;
            if (loaded >= max)
              break;
            loaded++;
            const urls = getCubemapUrls(tempName);
            new THREE.CubeTextureLoader(manager3).load(urls, () => {
              addStreamCubeMap(tempName);
            });
          }
        }, 100);
      }
      function goToPosition(object3D) {
        clicked = 1;
        if (positionIsMoving)
          return;
        const origState = shaderBoxMapState;
        shaderBoxMapState = getInverse(shaderBoxMapState);
        positionIsMoving = true;
        nextPosition = object3D;
        const state = shaderBoxMap[shaderBoxMapState];
        const statePosition = shaderBoxMapPosition[shaderBoxMapState];
        const currentStatePosition = shaderBoxMapPosition[origState];
        shaderMaterial.uniforms[statePosition].value = object3D.position;
        shaderMaterial.uniforms[currentStatePosition].value = currentPosition.position;
        visibleElement(loadDummy, false);
        updateCubemap2(shaderMaterial.uniforms[state], object3D.data.cubeTexture);
        new TWEEN.Tween(camera2.position).to(object3D.position, defaults.TIME_CHANGE_POSITION).easing(TWEEN.Easing.Cubic.InOut).onUpdate(function() {
          controls.enabled = true;
          cursor.enabled = false;
          const vector = new THREE.Vector3();
          vector.set(this.x, this.y, this.z);
          setCameraPos(vector);
          if (currentPosition && nextPosition && currentPosition != nextPosition) {
            const totalLength = subV.subVectors(nextPosition.position, currentPosition.position).length();
            const progressLength = subV.subVectors(camera2.position, currentPosition.position).length();
            if (shaderMaterial.uniforms.uProgress) {
              let v = progressLength / totalLength;
              if (shaderBoxMapState == 0)
                v = 1 - v;
              shaderMaterial.uniforms.uProgress.value = v.toFixed(3);
              requestRenderIfNotRequested();
            }
          }
        }).onComplete(() => {
          clicked = 0;
          renderer2.renderLists.dispose();
          camera2.position.copy(object3D.position);
          currentPosition = object3D;
          controls.update();
          controls.enabled = true;
          cursor.enabled = true;
          if (hotspots)
            hotspots.changeActiveLocation(object3D.name);
          positionIsMoving = false;
          streamNearCubeMaps(currentPosition.name, true);
          tags.updateTagVisiblity();
        }).delay(defaults.TWEEN_DELAY_MOVEMENT).start();
      }
      function streamNextPositon(Object3D) {
        if (Object3D.expectedResources < config.expectedResources)
          return false;
        setTimeout(() => {
          positionIsMoving = false;
          goToPosition(Object3D);
        }, 0);
        return true;
      }
      function streamCubeMap(name) {
        if (!locations[name])
          return false;
        if (positionIsMoving)
          return false;
        positionIsMoving = true;
        allDataLoaded = false;
        cursor.enabled = false;
        cancelStream();
        const urls = getCubemapUrls(name);
        locations[name].expectedResources = 0;
        const cubeTexture = new THREE.CubeTextureLoader(manager2).load(urls, () => {
          addStreamCubeMap(name);
          locations[name].expectedResources++;
          streamNextPositon(locations[name]);
        });
        cubeTexture.mapping = THREE.CubeRefractionMapping;
        cubeTexture.magFilter = THREE.LinearFilter;
        cubeTexture.minFilter = THREE.LinearFilter;
        locations[name].data.cubeTexture = cubeTexture;
      }
      function init() {
        THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
        THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
        THREE.Mesh.prototype.raycast = acceleratedRaycast;
        raycaster = new THREE.Raycaster();
        rpWebvrContainer = document.getElementById("RPWebVR");
        container2 = document.createElement("div");
        container2.classList.add("container");
        rpWebvrContainer.appendChild(container2);
        camera2 = new THREE.PerspectiveCamera(defaults.CAMERA_FOV, rpWebvrContainer.getBoundingClientRect().width / rpWebvrContainer.getBoundingClientRect().height, defaults.CAMERA_MIN, defaults.CAMERA_MAX);
        scene2 = new THREE.Scene();
        const geometry = new THREE.SphereGeometry(38, 60, 40);
        geometry.scale(-1, 1, 1);
        new THREE.LoadingManager(() => {
          loadingScreen = document.getElementById("loading-screen");
          loadingScreen.classList.add("fade-out");
          loadingScreen.addEventListener("transitionend", onTransitionEnd);
        });
        renderer2 = new THREE.WebGLRenderer({ antialias: isDesktop(), preserveDrawingBuffer: true });
        element = renderer2.domElement;
        container2.appendChild(element);
        maxAnisotropy = renderer2.capabilities.getMaxAnisotropy();
        effect = new VREffect(THREE, renderer2);
        effect.setSize(rpWebvrContainer.getBoundingClientRect().width, rpWebvrContainer.getBoundingClientRect().height);
        controls = new OrbitControls(camera2, renderer2.domElement);
        controls.enableZoom = true;
        controls.enablePan = false;
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.rotateSpeed = -0.4;
        controls.update();
        cursor = new CursorObject(THREE, scene2, camera2, renderer2.domElement, controls, sceneConfig.cursorRadius, rpWebvrContainer);
        new Measure(THREE, renderer2, scene2, camera2);
        scene2.add(camera2);
        const light = new THREE.HemisphereLight(1048575, 4473924, 1);
        light.position.set(0, 1, 0);
        scene2.add(light);
        controls.addEventListener("change", onCameraRotationChanged);
        controls.addEventListener("start", onCameraRotationStarted);
        controls.addEventListener("end", onCameraRotationEnded);
        window.addEventListener("resize", resize);
        renderer2.domElement.addEventListener("mouseup", onDocumentMouseUp, false);
        renderer2.domElement.addEventListener("mousedown", (e) => {
          onDocumentMouseDown(e);
        }, false);
        renderer2.domElement.addEventListener("mousemove", (e) => {
          onDocumentMouseMove();
        });
        renderer2.domElement.addEventListener("touchstart", onDocumentTouchStart, false);
        renderer2.domElement.addEventListener("touchend", onDocumentTouchEnd, false);
        renderer2.domElement.addEventListener("touchmove", onDocumentTouchMove, false);
      }
      function onTransitionEnd(event) {
        event.target.remove();
      }
      function loadTags(sceneNo = 0) {
        const tagsData = sceneConfig.data.scenes[sceneNo].tags;
        const tempTags = [];
        for (let i = 0; i < tagsData.length; i++) {
          const tempTag = tagsData[i];
          const tag = {};
          tag.name = tempTag.name;
          tag.location = new THREE.Vector3(tempTag.location[0], tempTag.location[1], tempTag.location[2]);
          tag.height = tempTag.height;
          tag.color = tempTag.color;
          tag.medialink = tempTag.mediaLink;
          tag.description = tempTag.description;
          tag.mediatype = tempTag.mediaType;
          tempTags.push(tag);
        }
        tags = new Tags(THREE, container2, renderer2, scene2, camera2, tempTags, sceneConfig.tagsRadius, rpWebvrContainer);
      }
      function loadSceneGLTF(sceneNo = 0, hostspotNo = 0) {
        const mainGroup = scene2.getObjectByName(defaults.MAIN_GROUP_NAME);
        scene2.remove(mainGroup);
        const hotspotsGroup = scene2.getObjectByName(defaults.HOTSPOT_GROUP_NAME);
        scene2.remove(hotspotsGroup);
        shaderMaterial = new THREE.ShaderMaterial({ vertexShader: getShaders().vertexShader, fragmentShader: getShaders().fragmentShader });
        shaderMaterial.transparent = defaults.TRANSPARENT;
        shaderMaterial.wireframe = defaults.WIREFRAME;
        const loader = new GLTFLoader(gltfLoadingManager);
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath("https://unpkg.com/three@0.136.0/examples/js/libs/draco/");
        loader.setDRACOLoader(dracoLoader);
        sceneConfig.mdl = `${cdnPath}spacesDemo/${userid}/${projectid}/Data/WorldMesh.glb`;
        loader.load(sceneConfig.mdl, (object) => {
          object.scene.children[0];
          cubeMap0 = new THREE.CubeTexture();
          cubeMap1 = new THREE.CubeTexture();
          const rotXAngleInRadians = THREE.Math.degToRad(defaults.SHADER_ROTATION_X);
          const rotYAngleInRadians = THREE.Math.degToRad(defaults.SHADER_ROTATION_Y);
          const rotZAngleInRadians = THREE.Math.degToRad(defaults.SHADER_ROTATION_Z);
          const sy = Math.sin(rotYAngleInRadians);
          const cy = Math.cos(rotYAngleInRadians);
          const sz = Math.sin(rotZAngleInRadians);
          const cz = Math.cos(rotZAngleInRadians);
          const sx = Math.sin(rotXAngleInRadians);
          const cx = Math.cos(rotXAngleInRadians);
          const rotYMatrix = new THREE.Matrix3();
          rotYMatrix.set(cy, 0, sy, 0, 1, 0, -sy, 0, cy);
          const rotZMatrix = new THREE.Matrix3();
          rotZMatrix.set(cz, -sz, 0, sz, cz, 0, 0, 0, 1);
          const rotXMatrix = new THREE.Matrix3();
          rotXMatrix.set(1, 0, 0, 0, cx, -sx, 0, sx, cx);
          shaderMaterial.uniforms = {
            uProgress: { value: getShaders().uniforms.progress.value },
            uBoxMap0: { value: cubeMap0 },
            uBoxPosition0: { value: camera2.position },
            uBoxMap1: { value: cubeMap1 },
            uBoxPosition1: { value: camera2.position },
            uRotYMatrix: { value: rotYMatrix },
            uRotZMatrix: { value: rotXMatrix },
            uRotXMatrix: { value: rotZMatrix }
          };
          const tempLocs = new THREE.Object3D();
          for (let i = 0; i < sceneConfig.data.scenes[sceneNo].viewpoints.length; i++) {
            const tempObject = new THREE.Object3D();
            const tempData = sceneConfig.data.scenes[sceneNo].viewpoints[i];
            tempObject.name = tempData.name;
            tempObject.position.copy(new THREE.Vector3(tempData.location[0], tempData.location[1], tempData.location[2]));
            tempLocs.add(tempObject);
          }
          tempLocs.traverse((child) => {
            if (child.name) {
              locations[child.name] = child;
              locations[child.name].data = { cubeTexture: {} };
            }
          });
          object.scene.children[0].traverse((child) => {
            child.originalMaterial = child.material;
            if (Array.isArray(child.originalMaterial)) {
              child.originalMaterial.forEach((material) => {
                if (!material.map) {
                  material.emissive = new THREE.Color(1, 1, 1);
                  material.emissiveIntensity = 0.2;
                }
              });
            } else {
              const material = new THREE.MeshBasicMaterial({ color: 65280 });
              child.originalMaterial = material;
              child.originalMaterial.emissive = new THREE.Color(1, 1, 1);
              child.originalMaterial.emissiveIntensity = 0.2;
            }
            child.shaderMaterial = shaderMaterial;
            child.material = child.shaderMaterial;
            child.renderOrder = 2;
            child.geometry.computeBoundsTree();
            cursor.addTargetObject(child);
          });
          object.scene.children[0].name = defaults.MAIN_GROUP_NAME;
          scene2.add(object.scene.children[0]);
          requestRenderIfNotRequested();
          new KeyControls(camera2, locations);
          setTimeout(() => {
            initCubeMaps(() => {
              cubeMap0.image = currentPosition.data.cubeTexture.image.slice();
              cubeMap0.needsUpdate = true;
              cubeMap0.mapping = THREE.CubeRefractionMapping;
              cubeMap0.minFilter = THREE.LinearFilter;
              cubeMap1.image = currentPosition.data.cubeTexture.image.slice();
              cubeMap1.needsUpdate = true;
              cubeMap1.mapping = THREE.CubeRefractionMapping;
              cubeMap1.minFilter = THREE.LinearFilter;
              initHotspots();
              loadTags(currentScene);
              requestRenderIfNotRequested();
              streamNearCubeMaps(startPosition, false);
            });
          }, 20);
        }, (xhr) => {
          requestRenderIfNotRequested();
        }, (error) => {
          console.log("Error loading GLTF");
          console.log(error);
        });
      }
      function initCubeMaps(callback, callback2) {
        currentPosition = locations[startPosition];
        camera2.rotation.copy(currentPosition.rotation);
        setCameraPos(currentPosition.position);
        const urls = getCubemapUrls(currentPosition.name);
        const cubeTexture = new THREE.CubeTextureLoader(manager).load(urls, callback);
        cubeTexture.mapping = THREE.CubeRefractionMapping;
        cubeTexture.minFilter = THREE.LinearFilter;
        cubeTexture.magFilter = THREE.LinearFilter;
        cubeTexture.minFilter = THREE.LinearFilter;
        cubeTexture.anisotropy = maxAnisotropy;
        locations[startPosition].data.cubeTexture = cubeTexture;
      }
      function getCubemapUrls(pos) {
        const out = [];
        const format = "webp";
        for (let i = 1; i <= 16; i = i + 3) {
          var tempPath;
          if (i < 10)
            tempPath = `${cdnPath}spacesDemo/${userid}/${projectid}/Walk0/Hotspot${pos}/000${i}.${format}`;
          else
            tempPath = `${cdnPath}spacesDemo/${userid}/${projectid}/Walk0/Hotspot${pos}/00${i}.${format}`;
          out.push(tempPath);
        }
        return out;
      }
      function setCameraPos(v) {
        camera2.position.copy(v);
        camera2.translateZ(-defaults.CAMERA_TARGET_OFFSET);
        controls.target.copy(camera2.position);
        camera2.translateZ(defaults.CAMERA_TARGET_OFFSET);
        camera2.updateProjectionMatrix();
      }
      function initHotspots() {
        {
          const hotspotsGroup = scene2.getObjectByName(defaults.HOTSPOT_GROUP_NAME);
          scene2.remove(hotspotsGroup);
          hotspots = new Hotspots(THREE, scene2, locations);
          hotspots.changeActiveLocation(startPosition);
        }
      }
      function setProgress2(p, l, t) {
        p = Math.round(p, 2);
        if (p < 95)
          visibleElement(loadDummy, true);
        if (p >= 99)
          allDataLoaded = true;
      }
      gltfLoadingManager.onProgress = function(item, loaded, total) {
        const p = loaded / total * 100;
        setProgress2(p);
      };
      manager2.onProgress = function(item, loaded, total) {
        const p = loaded / total * 100;
        setProgress2(p);
      };
      manager2.onLoad = function() {
        positionIsMoving = false;
      };
      manager.onProgress = function(item, loaded, total) {
      };
      window.onload = function() {
      };
      function KeyControls(camera3, locations2) {
        const maxAngel = Math.PI / 2;
        const minCameraAngel = Math.PI / 8;
        const actions = { forward: [38, 87], back: [40, 83], left: [37, 65], right: [39, 68], chageMode: [32] };
        const findClosestLocation = function(direction) {
          const cameraWorldDirection = new THREE.Vector3();
          camera3.getWorldDirection(cameraWorldDirection);
          cameraWorldDirection.y = 0;
          switch (direction) {
            case "back":
              cameraWorldDirection.multiplyScalar(-1);
              break;
            case "left":
              cameraWorldDirection.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
              break;
            case "right":
              cameraWorldDirection.applyAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 2);
              break;
          }
          let minAngle = Math.PI * 2;
          let newLocationName;
          let minDistance = Infinity;
          for (const locationName in locations2) {
            const camToLocationVector = new THREE.Vector3();
            camToLocationVector.subVectors(locations2[locationName].position, camera3.position).normalize();
            camToLocationVector.y = 0;
            const angle = camToLocationVector.angleTo(cameraWorldDirection);
            if (!isNaN(angle)) {
              const tempDistance = camera3.position.distanceTo(locations2[locationName].position);
              if (angle < minAngle && angle >= minCameraAngel || angle < minCameraAngel && tempDistance < minDistance) {
                minAngle = angle;
                minDistance = tempDistance;
                newLocationName = locationName;
              }
            }
          }
          if (minAngle < maxAngel) {
            if (locations2[newLocationName] != currentPosition)
              streamCubeMap(newLocationName);
          }
        };
        document.body.onkeyup = function(e) {
          for (const actionName in actions) {
            if (actions[actionName].includes(e.keyCode)) {
              findClosestLocation(actionName);
              break;
            }
          }
        };
      }
    }
  }
};
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({
    id: "RPWebVR",
    class: "relative w-full h-full object-cover"
  }, _attrs))}><div id="load-dummy" class="text-white"><div></div></div><div id="tagsUI" style="${ssrRenderStyle({ "position": "absolute", "width": "100%" })}"></div></div>`);
}
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("src/components/WebviewerScripts/webviewer.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
var __vite_components_1$1 = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["ssrRender", _sfc_ssrRender$3]]);
;
var _projectId__vue_vue_type_style_index_0_scoped_true_lang = "";
var block0$1 = {};
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __ssrInlineRender: true,
  props: {
    message: String,
    userId: {
      type: String,
      required: true
    },
    projectId: {
      type: String,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    useRouter();
    useI18n();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Gutter = __vite_components_0$5;
      const _component_ClientOnly = resolveComponent("ClientOnly");
      const _component_Webviewer = __vite_components_1$1;
      _push(ssrRenderComponent(_component_Gutter, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="" data-v-207a3da1${_scopeId}><p class="text-white my-20" data-v-207a3da1${_scopeId}> Hello there, ${ssrInterpolate(props.userId)} and ur project is ${ssrInterpolate(props.projectId)}. </p><div id="test1" class="content-center mt-10 aspect-video" data-v-207a3da1${_scopeId}>`);
            _push2(ssrRenderComponent(_component_ClientOnly, { id: "test1" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_Webviewer, { "user-id": props.userId, "project-id": props.projectId, "start-scene": "0", "start-hotspot": "0" }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_Webviewer, { "user-id": props.userId, "project-id": props.projectId, "start-scene": "0", "start-hotspot": "0" }, null, 16)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "" }, [
                createVNode("p", { class: "text-white my-20" }, " Hello there, " + toDisplayString(props.userId) + " and ur project is " + toDisplayString(props.projectId) + ". ", 1),
                createVNode("div", {
                  id: "test1",
                  class: "content-center mt-10 aspect-video"
                }, [
                  createVNode(_component_ClientOnly, { id: "test1" }, {
                    default: withCtx(() => [
                      createVNode(_component_Webviewer, { "user-id": props.userId, "project-id": props.projectId, "start-scene": "0", "start-hotspot": "0" }, null, 16)
                    ]),
                    _: 1
                  })
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
if (typeof block0$1 === "function")
  block0$1(_sfc_main$6);
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("src/pages/[userId]/[projectId].vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
var _projectId_ = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-207a3da1"]]);
var _projectId_$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _projectId_
});
const _hoisted_1$1 = {
  xmlns: "http://www.w3.org/2000/svg",
  "xmlns:xlink": "http://www.w3.org/1999/xlink",
  width: "1.2em",
  height: "1.2em",
  preserveAspectRatio: "xMidYMid meet",
  viewBox: "0 0 32 32"
};
const _hoisted_2$1 = /* @__PURE__ */ createElementVNode("path", {
  d: "M21.677 14l-1.245-3.114A2.986 2.986 0 0 0 17.646 9h-4.092a3.002 3.002 0 0 0-1.544.428L7 12.434V18h2v-4.434l3-1.8v11.931l-3.462 5.194L10.202 30L14 24.303V11h3.646a.995.995 0 0 1 .928.629L20.323 16H26v-2z",
  fill: "currentColor"
}, null, -1);
const _hoisted_3$1 = /* @__PURE__ */ createElementVNode("path", {
  d: "M17.051 18.316L19 24.162V30h2v-6.162l-2.051-6.154l-1.898.632z",
  fill: "currentColor"
}, null, -1);
const _hoisted_4$1 = /* @__PURE__ */ createElementVNode("path", {
  d: "M16.5 8A3.5 3.5 0 1 1 20 4.5A3.504 3.504 0 0 1 16.5 8zm0-5A1.5 1.5 0 1 0 18 4.5A1.502 1.502 0 0 0 16.5 3z",
  fill: "currentColor"
}, null, -1);
const _hoisted_5$1 = [
  _hoisted_2$1,
  _hoisted_3$1,
  _hoisted_4$1
];
function render$1(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$1, _hoisted_5$1);
}
var __vite_components_0$2 = { name: "carbon-pedestrian", render: render$1 };
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __ssrInlineRender: true,
  props: {
    message: String,
    name: {
      type: String,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    useRouter();
    const { t } = useI18n();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_carbon_pedestrian = __vite_components_0$2;
      _push(`<div${ssrRenderAttrs(_attrs)}><p class="text-4xl">`);
      _push(ssrRenderComponent(_component_carbon_pedestrian, { class: "inline-block" }, null, _parent));
      _push(`</p><p> Hello, ${ssrInterpolate(props.name)}</p><p class="text-sm opacity-50"><em>${ssrInterpolate(unref(t)("intro.dynamic-route"))}</em></p><div><button class="btn m-3 text-sm mt-8">${ssrInterpolate(unref(t)("button.back"))}</button></div> Message from API: ${ssrInterpolate(props.message)}</div>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("src/pages/hi/[name].vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
var _name_ = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _sfc_main$5
});
var block0 = {};
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}>${ssrInterpolate(unref(t)("not-found"))}</div>`);
    };
  }
});
if (typeof block0 === "function")
  block0(_sfc_main$4);
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("src/pages/[...all].vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
var ____all_ = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _sfc_main$4
});
const _hoisted_1 = {
  xmlns: "http://www.w3.org/2000/svg",
  "xmlns:xlink": "http://www.w3.org/1999/xlink",
  width: "1.2em",
  height: "1.2em",
  preserveAspectRatio: "xMidYMid meet",
  viewBox: "0 0 32 32"
};
const _hoisted_2 = /* @__PURE__ */ createElementVNode("path", {
  d: "M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2zm0 26a12 12 0 1 1 12-12a12 12 0 0 1-12 12z",
  fill: "currentColor"
}, null, -1);
const _hoisted_3 = /* @__PURE__ */ createElementVNode("path", {
  d: "M15 8h2v11h-2z",
  fill: "currentColor"
}, null, -1);
const _hoisted_4 = /* @__PURE__ */ createElementVNode("path", {
  d: "M16 22a1.5 1.5 0 1 0 1.5 1.5A1.5 1.5 0 0 0 16 22z",
  fill: "currentColor"
}, null, -1);
const _hoisted_5 = [
  _hoisted_2,
  _hoisted_3,
  _hoisted_4
];
function render(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1, _hoisted_5);
}
var __vite_components_0$1 = { name: "carbon-warning", render };
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    const { t } = useI18n();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_carbon_warning = __vite_components_0$1;
      const _component_router_view = resolveComponent("router-view");
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "px-4 py-10 text-center text-teal-700 dark:text-gray-200" }, _attrs))}><div><p class="text-4xl">`);
      _push(ssrRenderComponent(_component_carbon_warning, { class: "inline-block" }, null, _parent));
      _push(`</p></div>`);
      _push(ssrRenderComponent(_component_router_view, _ctx.$attrs, null, _parent));
      _push(`<div><button class="btn m-3 text-sm mt-8">${ssrInterpolate(unref(t)("button.back"))}</button></div></main>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("src/layouts/404.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var _404 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _sfc_main$3
});
var _imports_0 = "/assets/RenderpubWebsiteLogoWithFont.45d945e2.svg";
const _sfc_main$2 = {
  data() {
    return {
      profilePhoto: "https://tuk-cdn.s3.amazonaws.com/assets/components/boxed_layout/bl_1.png"
    };
  },
  mounted() {
    const body = document.getElementsByTagName("body")[0];
    body.addEventListener("click", () => {
      const single = document.getElementById("productul");
      if (!single.classList.contains("hidden"))
        single.classList.add("hidden");
      const MainList = document.getElementById("mobileul");
      const closeIcon = document.getElementsByClassName("close-m-menu")[0];
      const showIcon = document.getElementsByClassName("show-m-menu")[0];
      if (!MainList.classList.contains("hidden")) {
        MainList == null ? void 0 : MainList.classList.add("hidden");
        showIcon.classList.remove("hidden");
        closeIcon.classList.add("hidden");
      }
    }, false);
  },
  methods: {
    dropdownHandler(event) {
      const single = event.currentTarget.getElementsByTagName("ul")[0];
      single.classList.toggle("hidden");
      event.stopPropagation();
    },
    close() {
      const single = document.getElementById("productul");
      console.log(single == null ? void 0 : single.classList);
    },
    dropdownHandler1(event) {
      const single = event.currentTarget.parentElement;
      const second = single.parentElement;
      const third = second.parentElement;
      const fourth = third.parentElement;
      fourth.classList.toggle("hidden");
      const showIcon = document.getElementsByClassName("show-m-menu")[0];
      showIcon.classList.remove("hidden");
      const closeIcon = document.getElementsByClassName("close-m-menu")[0];
      closeIcon.classList.add("hidden");
    },
    dropdownHandler2(event) {
      const single = event.currentTarget.parentElement;
      single.classList.toggle("hidden");
      const showIcon = document.getElementsByClassName("show-m-menu")[0];
      showIcon.classList.remove("hidden");
      const closeIcon = document.getElementsByClassName("close-m-menu")[0];
      closeIcon.classList.add("hidden");
    },
    MenuHandler(el, val) {
      const MainList = el.currentTarget.parentElement.getElementsByTagName("ul")[0];
      const closeIcon = el.currentTarget.parentElement.getElementsByClassName("close-m-menu")[0];
      const showIcon = el.currentTarget.parentElement.getElementsByClassName("show-m-menu")[0];
      if (val) {
        MainList.classList.remove("hidden");
        el.currentTarget.classList.add("hidden");
        closeIcon.classList.remove("hidden");
      } else {
        showIcon.classList.remove("hidden");
        MainList.classList.add("hidden");
        el.currentTarget.classList.add("hidden");
      }
      el.stopPropagation();
    },
    scrollToTop() {
      window.scrollTo(0, 0);
    }
  }
};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_router_link = resolveComponent("router-link");
  _push(`<nav${ssrRenderAttrs(mergeProps({
    class: "w-full grid shadow-md z-200 relative md:h-16 h-12 border-b border-gray-800",
    style: { "background": "rgb(07, 07, 07)" }
  }, _attrs))}><div class="justify-between container px-10 flex items-center lg:items-stretch mx-auto"><div class="flex items-center">`);
  _push(ssrRenderComponent(_component_router_link, { to: "/" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<div class="mr-10 flex items-center"${_scopeId}><img${ssrRenderAttr("src", _imports_0)} alt="Renderpub" class="xl:4/5 lg:w-3/4 w-1/2"${_scopeId}></div>`);
      } else {
        return [
          createVNode("div", { class: "mr-10 flex items-center" }, [
            createVNode("img", {
              src: _imports_0,
              alt: "Renderpub",
              class: "xl:4/5 lg:w-3/4 w-1/2"
            })
          ])
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<ul class="pr-32 xl:flex hidden items-center h-full"><li class="hover:text-our-blue cursor-pointer h-full flex items-center text-gray-200 tracking-normal">`);
  _push(ssrRenderComponent(_component_router_link, { to: "/" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Home `);
      } else {
        return [
          createTextVNode(" Home ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li class="hover:text-our-blue cursor-pointer h-full flex items-center text-gray-200 mx-10 tracking-normal relative"><ul id="productul" class="shadow py-1 w-32 left-0 mt-16 -ml-4 font-bold absolute hidden top-0" style="${ssrRenderStyle({ "background": "#27272a" })}"><a id="SpacesMenuButton" href="/#Spaces"><li id="SpacesMenuButton" class="cursor-pointer text-gray-200 text-sm leading-3 tracking-normal py-3 hover:bg-our-blue hover:text-white px-3"> Spaces </li></a><a id="StudioMenuButton" href="/#Studio"><li id="StudioMenuButton" class="cursor-pointer text-gray-200 text-sm leading-3 tracking-normal py-3 hover:bg-our-blue hover:text-white px-3"> Studio </li></a><a id="StitchMenuButton" href="/#Stitch"><li id="StitchMenuButton" class="cursor-pointer text-gray-200 text-sm leading-3 tracking-normal py-3 hover:bg-our-blue hover:text-white px-3"> Stitch </li></a></ul> Products <div class="ml-2"><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-chevron-down" width="16" height="16" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z"></path><polyline points="6 9 12 15 18 9"></polyline></svg></div></li><a href="#Showcase"><li class="hover:text-our-blue cursor-pointer h-full flex items-center text-gray-200 mr-10 tracking-normal"> Showcase </li></a></ul></div><div class="visible xl:hidden flex items-center"><ul id="mobileul" class="z-50 py-2 absolute top-0 left-0 right-0 shadow mt-12 md:mt-16 hidden" style="${ssrRenderStyle({ "background": "#27272a" })}">`);
  _push(ssrRenderComponent(_component_router_link, { to: "/" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<li class="flex xl:hidden cursor-pointer text-gray-200 text-base leading-3 tracking-normal mt-2 py-3 hover:text-our-blue focus:outline-none"${_scopeId}><div class="flex items-center"${_scopeId}><span class="leading-6 ml-2 font-bold"${_scopeId}>Home</span></div></li>`);
      } else {
        return [
          createVNode("li", { class: "flex xl:hidden cursor-pointer text-gray-200 text-base leading-3 tracking-normal mt-2 py-3 hover:text-our-blue focus:outline-none" }, [
            createVNode("div", { class: "flex items-center" }, [
              createVNode("span", { class: "leading-6 ml-2 font-bold" }, "Home")
            ])
          ])
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<li class="xl:hidden flex-col cursor-pointer text-gray-200 text-base leading-3 tracking-normal py-3 hover:text-our-blue focus:outline-none flex justify-center"><div class="flex items-center"><span class="leading-6 ml-2 font-bold">Products</span><div class="ml-2"><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-chevron-down" width="16" height="16" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z"></path><polyline points="6 9 12 15 18 9"></polyline></svg></div></div><ul class="ml-2 mt-3 hidden"><a href="#Spaces"><li id="SpacesMenuButton" class="cursor-pointer text-gray-200 text-sm leading-3 tracking-normal py-3 hover:bg-our-blue hover:text-white px-3 font-normal"> Spaces </li></a><a href="#Studio"><li id="StudioMenuButton" class="cursor-pointer text-gray-200 text-sm leading-3 tracking-normal py-3 hover:bg-our-blue hover:text-white px-3 font-normal"> Studio </li></a><a href="#Stitch"><li id="StitchMenuButton" class="cursor-pointer text-gray-200 text-sm leading-3 tracking-normal py-3 hover:bg-our-blue hover:text-white px-3 font-normal"> Stitch </li></a></ul></li><a href="#Showcase"><li class="xl:hidden cursor-pointer text-gray-200 text-base leading-3 tracking-normal py-3 hover:text-our-blue flex items-center focus:outline-none"><span class="leading-6 ml-2 font-bold">Showcase</span></li></a></ul><svg aria-haspopup="true" aria-label="Main Menu" xmlns="http://www.w3.org/2000/svg" class="show-m-menu icon icon-tabler icon-tabler-menu" width="28" height="28" viewBox="0 0 24 24" stroke-width="1.5" stroke="#fff" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z"></path><line x1="4" y1="8" x2="20" y2="8"></line><line x1="4" y1="16" x2="20" y2="16"></line></svg><div class="hidden close-m-menu"><svg aria-label="Close" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#fff" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z"></path><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></div></div></div></nav>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("src/components/Navigation.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var __vite_components_0 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$2]]);
;
var ScrollBase_vue_vue_type_style_index_0_scoped_true_lang = "";
const _sfc_main$1 = {
  el: "#app",
  data() {
    return {
      scTimer: 0,
      scY: 0
    };
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll() {
      if (this.scTimer)
        return;
      this.scTimer = setTimeout(() => {
        this.scY = window.scrollY;
        clearTimeout(this.scTimer);
        this.scTimer = 0;
      }, 100);
    },
    toTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  }
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ id: "container" }, _attrs))} data-v-25d3820a>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`<div${ssrRenderAttrs(mergeProps({
    style: $data.scY > 100 ? null : { display: "none" },
    id: "pagetop",
    class: "fixed block bg-transparent z-30 right-4 bottom-12 svg-container rounded-full border-2 border-white"
  }, _attrs))} data-v-25d3820a><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="arcs" data-v-25d3820a><path d="M18 15l-6-6-6 6" data-v-25d3820a></path></svg></div></div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("src/components/ScrollBase.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var __vite_components_1 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-25d3820a"]]);
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_Navigation = __vite_components_0;
  const _component_router_view = resolveComponent("router-view");
  const _component_ScrollBase = __vite_components_1;
  const _component_Footer = __vite_components_2;
  _push(`<div${ssrRenderAttrs(_attrs)}>`);
  _push(ssrRenderComponent(_component_Navigation, { style: { "position": "fixed", "top": "0", "width": "100%", "z-index": "99" } }, null, _parent));
  _push(ssrRenderComponent(_component_router_view, _ctx.$attrs, null, _parent));
  _push(ssrRenderComponent(_component_ScrollBase, null, null, _parent));
  _push(ssrRenderComponent(_component_Footer, { class: "bg-gray-100" }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("src/layouts/home.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var home = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
var home$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": home
});
var en = {
  "button": {
    "about": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["About"]);
    },
    "back": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["Back"]);
    },
    "go": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["GO"]);
    },
    "home": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["Home"]);
    },
    "toggle_dark": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["Toggle dark mode"]);
    },
    "toggle_langs": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["Change languages"]);
    }
  },
  "intro": {
    "desc": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["Opinionated Vite Starter Template"]);
    },
    "dynamic-route": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["Demo of dynamic route"]);
    },
    "hi": (ctx) => {
      const { normalize: _normalize, interpolate: _interpolate, named: _named } = ctx;
      return _normalize(["Hi, ", _interpolate(_named("name")), "!"]);
    },
    "whats-your-name": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["What's your name?"]);
    }
  },
  "not-found": (ctx) => {
    const { normalize: _normalize } = ctx;
    return _normalize(["Not found"]);
  }
};
var en$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": en
});
var es = {
  "button": {
    "about": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["Acerca de"]);
    },
    "back": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["Atr\xE1s"]);
    },
    "go": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["Ir"]);
    },
    "home": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["Inicio"]);
    },
    "toggle_dark": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["Alternar modo oscuro"]);
    },
    "toggle_langs": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["Cambiar idiomas"]);
    }
  },
  "intro": {
    "desc": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["Plantilla de Inicio de Vite Dogm\xE1tica"]);
    },
    "dynamic-route": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["Demo de ruta din\xE1mica"]);
    },
    "hi": (ctx) => {
      const { normalize: _normalize, interpolate: _interpolate, named: _named } = ctx;
      return _normalize(["\xA1Hola, ", _interpolate(_named("name")), "!"]);
    },
    "whats-your-name": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["\xBFC\xF3mo te llamas?"]);
    }
  },
  "not-found": (ctx) => {
    const { normalize: _normalize } = ctx;
    return _normalize(["No se ha encontrado"]);
  }
};
var es$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": es
});
var fr = {
  "button": {
    "about": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["\xC0 propos de"]);
    },
    "back": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["Retour"]);
    },
    "go": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["Essayer"]);
    },
    "home": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["Maison"]);
    },
    "toggle_dark": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["Basculer en mode sombre"]);
    },
    "toggle_langs": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["Changer de langue"]);
    }
  },
  "intro": {
    "desc": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["Example d'application Vite"]);
    },
    "dynamic-route": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["D\xE9mo de route dynamique"]);
    },
    "hi": (ctx) => {
      const { normalize: _normalize, interpolate: _interpolate, named: _named } = ctx;
      return _normalize(["Salut, ", _interpolate(_named("name")), " !"]);
    },
    "whats-your-name": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["Comment t'appelles-tu ?"]);
    }
  },
  "not-found": (ctx) => {
    const { normalize: _normalize } = ctx;
    return _normalize(["Page non trouv\xE9e"]);
  }
};
var fr$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": fr
});
var it = {
  "button": {
    "about": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["Su di me"]);
    },
    "back": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["Indietro"]);
    },
    "go": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["Vai"]);
    },
    "home": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["Home"]);
    },
    "toggle_dark": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["Attiva/disattiva modalit\xE0 scura"]);
    },
    "toggle_langs": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["Cambia lingua"]);
    }
  },
  "intro": {
    "desc": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["Modello per una Applicazione Vite"]);
    },
    "dynamic-route": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["Demo di rotta dinamica"]);
    },
    "hi": (ctx) => {
      const { normalize: _normalize, interpolate: _interpolate, named: _named } = ctx;
      return _normalize(["Ciao, ", _interpolate(_named("name")), "!"]);
    },
    "whats-your-name": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["Come ti chiami?"]);
    }
  },
  "not-found": (ctx) => {
    const { normalize: _normalize } = ctx;
    return _normalize(["Non trovato"]);
  }
};
var it$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": it
});
var ja = {
  "button": {
    "about": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["\u3053\u308C\u306F\uFF1F"]);
    },
    "back": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["\u623B\u308B"]);
    },
    "go": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["\u9032\u3080"]);
    },
    "home": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["\u30DB\u30FC\u30E0"]);
    },
    "toggle_dark": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["\u30C0\u30FC\u30AF\u30E2\u30FC\u30C9\u5207\u308A\u66FF\u3048"]);
    },
    "toggle_langs": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["\u8A00\u8A9E\u5207\u308A\u66FF\u3048"]);
    }
  },
  "intro": {
    "desc": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["\u56FA\u57F7\u3055\u308C\u305F Vite \u30B9\u30BF\u30FC\u30BF\u30FC\u30C6\u30F3\u30D7\u30EC\u30FC\u30C8"]);
    },
    "dynamic-route": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["\u52D5\u7684\u30EB\u30FC\u30C8\u306E\u30C7\u30E2"]);
    },
    "hi": (ctx) => {
      const { normalize: _normalize, interpolate: _interpolate, named: _named } = ctx;
      return _normalize(["\u3053\u3093\u306B\u3061\u306F\u3001", _interpolate(_named("name")), "\uFF01"]);
    },
    "whats-your-name": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["\u3042\u306A\u305F\u306E\u540D\u524D\u306F\uFF1F"]);
    }
  },
  "not-found": (ctx) => {
    const { normalize: _normalize } = ctx;
    return _normalize(["\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3067\u3057\u305F"]);
  }
};
var ja$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": ja
});
var ko = {
  "button": {
    "about": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["\uC18C\uAC1C"]);
    },
    "back": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["\uB4A4\uB85C\uAC00\uAE30"]);
    },
    "go": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["\uC774\uB3D9"]);
    },
    "home": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["\uD648"]);
    },
    "toggle_dark": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["\uB2E4\uD06C\uBAA8\uB4DC \uD1A0\uAE00"]);
    },
    "toggle_langs": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["\uC5B8\uC5B4 \uBCC0\uACBD"]);
    }
  },
  "intro": {
    "desc": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["Vite \uC560\uD50C\uB9AC\uCF00\uC774\uC158 \uD15C\uD50C\uB9BF"]);
    },
    "dynamic-route": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["\uB2E4\uC774\uB098\uBBF9 \uB77C\uC6B0\uD2B8 \uB370\uBAA8"]);
    },
    "hi": (ctx) => {
      const { normalize: _normalize, interpolate: _interpolate, named: _named } = ctx;
      return _normalize(["\uC548\uB155, ", _interpolate(_named("name")), "!"]);
    },
    "whats-your-name": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["\uC774\uB984\uC774 \uBB50\uC608\uC694?"]);
    }
  },
  "not-found": (ctx) => {
    const { normalize: _normalize } = ctx;
    return _normalize(["\uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4"]);
  }
};
var ko$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": ko
});
var tr = {
  "button": {
    "about": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["Hakk\u0131mda"]);
    },
    "back": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["Geri"]);
    },
    "go": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["\u0130LER\u0130"]);
    },
    "home": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["Anasayfa"]);
    },
    "toggle_dark": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["Karanl\u0131k modu de\u011Fi\u015Ftir"]);
    },
    "toggle_langs": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["Dilleri de\u011Fi\u015Ftir"]);
    }
  },
  "intro": {
    "desc": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["G\xF6r\xFC\u015Fl\xFC Vite Ba\u015Flang\u0131\xE7 \u015Eablonu"]);
    },
    "dynamic-route": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["Dinamik rota demosu"]);
    },
    "hi": (ctx) => {
      const { normalize: _normalize, interpolate: _interpolate, named: _named } = ctx;
      return _normalize(["Merhaba, ", _interpolate(_named("name")), "!"]);
    },
    "whats-your-name": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["Ad\u0131n\u0131z nedir ?"]);
    }
  },
  "not-found": (ctx) => {
    const { normalize: _normalize } = ctx;
    return _normalize(["Bulunamad\u0131"]);
  }
};
var tr$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": tr
});
var vi = {
  "button": {
    "back": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["Quay l\u1EA1i"]);
    },
    "go": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["\u0110i"]);
    }
  },
  "intro": {
    "desc": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["\xDD ki\u1EBFn c\xE1 nh\xE2n Vite Template \u0111\u1EC3 b\u1EAFt \u0111\u1EA7u"]);
    },
    "dynamic-route": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["B\u1EA3n gi\u1EDBi thi\u1EC7u v\u1EC1 dynamic route"]);
    },
    "hi": (ctx) => {
      const { normalize: _normalize, interpolate: _interpolate, named: _named } = ctx;
      return _normalize(["Hi, ", _interpolate(_named("name")), "!"]);
    },
    "whats-your-name": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["T\xEAn b\u1EA1n l\xE0 g\xEC?"]);
    }
  },
  "not-found": (ctx) => {
    const { normalize: _normalize } = ctx;
    return _normalize(["Kh\xF4ng t\xECm th\u1EA5y"]);
  }
};
var vi$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": vi
});
var zhCN = {
  "button": {
    "about": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["\u5173\u4E8E"]);
    },
    "back": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["\u8FD4\u56DE"]);
    },
    "go": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["\u786E\u5B9A"]);
    },
    "home": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["\u9996\u9875"]);
    },
    "toggle_dark": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["\u5207\u6362\u6DF1\u8272\u6A21\u5F0F"]);
    },
    "toggle_langs": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["\u5207\u6362\u8BED\u8A00"]);
    }
  },
  "intro": {
    "desc": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["\u56FA\u6267\u5DF1\u89C1\u7684 Vite \u9879\u76EE\u6A21\u677F"]);
    },
    "dynamic-route": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["\u52A8\u6001\u8DEF\u7531\u6F14\u793A"]);
    },
    "hi": (ctx) => {
      const { normalize: _normalize, interpolate: _interpolate, named: _named } = ctx;
      return _normalize(["\u4F60\u597D\uFF0C", _interpolate(_named("name")), "\uFF01"]);
    },
    "whats-your-name": (ctx) => {
      const { normalize: _normalize } = ctx;
      return _normalize(["\u8F93\u5165\u4F60\u7684\u540D\u5B57"]);
    }
  },
  "not-found": (ctx) => {
    const { normalize: _normalize } = ctx;
    return _normalize(["\u672A\u627E\u5230\u9875\u9762"]);
  }
};
var zhCN$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": zhCN
});
export { main as default };
