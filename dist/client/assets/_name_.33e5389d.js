import{o as a,c,a as e,j as d,u as p,l as m,g as _,t,y as s,f as h}from"./vendor.f537fa13.js";const v={xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",width:"1.2em",height:"1.2em",preserveAspectRatio:"xMidYMid meet",viewBox:"0 0 32 32"},x=e("path",{d:"M21.677 14l-1.245-3.114A2.986 2.986 0 0 0 17.646 9h-4.092a3.002 3.002 0 0 0-1.544.428L7 12.434V18h2v-4.434l3-1.8v11.931l-3.462 5.194L10.202 30L14 24.303V11h3.646a.995.995 0 0 1 .928.629L20.323 16H26v-2z",fill:"currentColor"},null,-1),f=e("path",{d:"M17.051 18.316L19 24.162V30h2v-6.162l-2.051-6.154l-1.898.632z",fill:"currentColor"},null,-1),g=e("path",{d:"M16.5 8A3.5 3.5 0 1 1 20 4.5A3.504 3.504 0 0 1 16.5 8zm0-5A1.5 1.5 0 1 0 18 4.5A1.502 1.502 0 0 0 16.5 3z",fill:"currentColor"},null,-1),w=[x,f,g];function b(o,n){return a(),c("svg",v,w)}var k={name:"carbon-pedestrian",render:b};const A={class:"text-4xl"},M={class:"text-sm opacity-50"},L=d({props:{message:String,name:{type:String,required:!0}},setup(o){const n=o,i=p(),{t:r}=m();return(V,l)=>{const u=k;return a(),c("div",null,[e("p",A,[_(u,{class:"inline-block"})]),e("p",null," Hello, "+t(n.name),1),e("p",M,[e("em",null,t(s(r)("intro.dynamic-route")),1)]),e("div",null,[e("button",{class:"btn m-3 text-sm mt-8",onClick:l[0]||(l[0]=y=>s(i).back())},t(s(r)("button.back")),1)]),h(" Message from API: "+t(n.message),1)])}}});export{L as default};