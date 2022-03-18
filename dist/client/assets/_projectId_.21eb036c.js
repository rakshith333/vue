import{_ as ot,a as ve,b as hn}from"./index.96818c55.js";import{o as at,c as gn,a as pe,j as vn,u as yn,l as wn,h as bn,d as Mn,e as rt,t as st,g as ct,n as xn,m as _n}from"./vendor.f537fa13.js";Date.now===void 0&&(Date.now=function(){return new Date().valueOf()});var H=H||function(){var e=[];return{REVISION:"8",getAll:function(){return e},removeAll:function(){e=[]},add:function(t){e.push(t)},remove:function(t){var n=e.indexOf(t);n!==-1&&e.splice(n,1)},update:function(t){if(e.length===0)return!1;var n=0,i=e.length;for(t=t!==void 0?t:Date.now();n<i;)e[n].update(t)?n++:(e.splice(n,1),i--);return!0}}}();H.Tween=function(e){var t=e,n={},i={},o=1e3,r=0,l=null,c=H.Easing.Linear.None,d=H.Interpolation.Linear,m=[],A=null,y=!1,x=null,E=null;this.to=function(a,O){return O!==void 0&&(o=O),i=a,this},this.start=function(a){H.add(this),y=!1,l=a!==void 0?a:Date.now(),l+=r;for(var O in i)if(!(t[O]===null||!(O in t))){if(i[O]instanceof Array){if(i[O].length===0)continue;i[O]=[t[O]].concat(i[O])}n[O]=t[O]}return this},this.stop=function(){return H.remove(this),this},this.delay=function(a){return r=a,this},this.easing=function(a){return c=a,this},this.interpolation=function(a){return d=a,this},this.chain=function(){return m=arguments,this},this.onStart=function(a){return A=a,this},this.onUpdate=function(a){return x=a,this},this.onComplete=function(a){return E=a,this},this.update=function(a){if(a<l)return!0;y===!1&&(A!==null&&A.call(t),y=!0);var O=(a-l)/o;O=O>1?1:O;var U=c(O);for(var R in n){var v=n[R],M=i[R];M instanceof Array?t[R]=d(M,U):t[R]=v+(M-v)*U}if(x!==null&&x.call(t,U),O==1){E!==null&&E.call(t);for(var L=0,N=m.length;L<N;L++)m[L].start(a);return!1}return!0}};H.Easing={Linear:{None:function(e){return e}},Quadratic:{In:function(e){return e*e},Out:function(e){return e*(2-e)},InOut:function(e){return(e*=2)<1?.5*e*e:-.5*(--e*(e-2)-1)}},Cubic:{In:function(e){return e*e*e},Out:function(e){return--e*e*e+1},InOut:function(e){return(e*=2)<1?.5*e*e*e:.5*((e-=2)*e*e+2)}},Quartic:{In:function(e){return e*e*e*e},Out:function(e){return 1- --e*e*e*e},InOut:function(e){return(e*=2)<1?.5*e*e*e*e:-.5*((e-=2)*e*e*e-2)}},Quintic:{In:function(e){return e*e*e*e*e},Out:function(e){return--e*e*e*e*e+1},InOut:function(e){return(e*=2)<1?.5*e*e*e*e*e:.5*((e-=2)*e*e*e*e+2)}},Sinusoidal:{In:function(e){return 1-Math.cos(e*Math.PI/2)},Out:function(e){return Math.sin(e*Math.PI/2)},InOut:function(e){return .5*(1-Math.cos(Math.PI*e))}},Exponential:{In:function(e){return e===0?0:Math.pow(1024,e-1)},Out:function(e){return e===1?1:1-Math.pow(2,-10*e)},InOut:function(e){return e===0?0:e===1?1:(e*=2)<1?.5*Math.pow(1024,e-1):.5*(-Math.pow(2,-10*(e-1))+2)}},Circular:{In:function(e){return 1-Math.sqrt(1-e*e)},Out:function(e){return Math.sqrt(1- --e*e)},InOut:function(e){return(e*=2)<1?-.5*(Math.sqrt(1-e*e)-1):.5*(Math.sqrt(1-(e-=2)*e)+1)}},Elastic:{In:function(e){var t,n=.1,i=.4;return e===0?0:e===1?1:(!n||n<1?(n=1,t=i/4):t=i*Math.asin(1/n)/(2*Math.PI),-(n*Math.pow(2,10*(e-=1))*Math.sin((e-t)*(2*Math.PI)/i)))},Out:function(e){var t,n=.1,i=.4;return e===0?0:e===1?1:(!n||n<1?(n=1,t=i/4):t=i*Math.asin(1/n)/(2*Math.PI),n*Math.pow(2,-10*e)*Math.sin((e-t)*(2*Math.PI)/i)+1)},InOut:function(e){var t,n=.1,i=.4;return e===0?0:e===1?1:(!n||n<1?(n=1,t=i/4):t=i*Math.asin(1/n)/(2*Math.PI),(e*=2)<1?-.5*(n*Math.pow(2,10*(e-=1))*Math.sin((e-t)*(2*Math.PI)/i)):n*Math.pow(2,-10*(e-=1))*Math.sin((e-t)*(2*Math.PI)/i)*.5+1)}},Back:{In:function(e){var t=1.70158;return e*e*((t+1)*e-t)},Out:function(e){var t=1.70158;return--e*e*((t+1)*e+t)+1},InOut:function(e){var t=1.70158*1.525;return(e*=2)<1?.5*(e*e*((t+1)*e-t)):.5*((e-=2)*e*((t+1)*e+t)+2)}},Bounce:{In:function(e){return 1-H.Easing.Bounce.Out(1-e)},Out:function(e){return e<1/2.75?7.5625*e*e:e<2/2.75?7.5625*(e-=1.5/2.75)*e+.75:e<2.5/2.75?7.5625*(e-=2.25/2.75)*e+.9375:7.5625*(e-=2.625/2.75)*e+.984375},InOut:function(e){return e<.5?H.Easing.Bounce.In(e*2)*.5:H.Easing.Bounce.Out(e*2-1)*.5+.5}}};H.Interpolation={Linear:function(e,t){var n=e.length-1,i=n*t,o=Math.floor(i),r=H.Interpolation.Utils.Linear;return t<0?r(e[0],e[1],i):t>1?r(e[n],e[n-1],n-i):r(e[o],e[o+1>n?n:o+1],i-o)},Bezier:function(e,t){var n=0,i=e.length-1,o=Math.pow,r=H.Interpolation.Utils.Bernstein,l;for(l=0;l<=i;l++)n+=o(1-t,i-l)*o(t,l)*e[l]*r(i,l);return n},CatmullRom:function(e,t){var n=e.length-1,i=n*t,o=Math.floor(i),r=H.Interpolation.Utils.CatmullRom;return e[0]===e[n]?(t<0&&(o=Math.floor(i=n*(1+t))),r(e[(o-1+n)%n],e[o],e[(o+1)%n],e[(o+2)%n],i-o)):t<0?e[0]-(r(e[0],e[0],e[1],e[1],-i)-e[0]):t>1?e[n]-(r(e[n],e[n],e[n-1],e[n-1],i-n)-e[n]):r(e[o?o-1:0],e[o],e[n<o+1?n:o+1],e[n<o+2?n:o+2],i-o)},Utils:{Linear:function(e,t,n){return(t-e)*n+e},Bernstein:function(e,t){var n=H.Interpolation.Utils.Factorial;return n(e)/n(t)/n(e-t)},Factorial:function(){var e=[1];return function(t){var n=1,i;if(e[t])return e[t];for(i=t;i>1;i--)n*=i;return e[t]=n}}(),CatmullRom:function(e,t,n,i,o){var r=(n-e)*.5,l=(i-t)*.5,c=o*o,d=o*c;return(2*t-2*n+r+l)*d+(-3*t+3*n-2*r-l)*c+r*o+t}}};var Ae=H;/*!
 * Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com
 * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
 */var On={prefix:"fas",iconName:"external-link-alt",icon:[512,512,[],"f35d","M432,320H400a16,16,0,0,0-16,16V448H64V128H208a16,16,0,0,0,16-16V80a16,16,0,0,0-16-16H48A48,48,0,0,0,0,112V464a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V336A16,16,0,0,0,432,320ZM488,0h-128c-21.37,0-32.05,25.91-17,41l35.73,35.73L135,320.37a24,24,0,0,0,0,34L157.67,377a24,24,0,0,0,34,0L435.28,133.32,471,169c15,15,41,4.5,41-17V24A24,24,0,0,0,488,0Z"]};async function Pn(e){return fetch(e,{headers:{"Content-Type":"application/json"}}).catch(n=>console.log(`Failed because: ${n}`))}function In(){return!0}function lt(e){return typeof e.clientX=="undefined"?e.touches[0].clientX:e.clientX}function ut(e){return typeof e.clientY=="undefined"?e.touches[0].clientY:e.clientY}const ue="https://spaces.renderpub.com/",$={WIDTH:1280,HEIGHT:720,DEFAULT_SCENE_NUMBER:0,DEFAULT_HOTSPOT_NO:0,ZERO:0,ONE:1,CAMERA_MIN:.1,CAMERA_MAX:1e4,CAMERA_FOV:70,CAMERA_TARGET_OFFSET:1e-4,CURSOR_RADIUS:.15,CURSOR_COLOR:16042496,CURSOR_OPACITY:.4,CURSOR_ORBIT_SCALE:2,HOTSPOT_GROUP_NAME:"hotspots",HOTSPOT_SHOW_FOR_DESCTOPE:!0,HOTSPOT_COLOR:16042496,HOTSPOT_COLOR_ACTIVE:8388352,HOTSPOT_OPACITY:.4,HOTSPOT_SHOW_FOR_MOBILE:!1,HOTSPOT_ANIMATE:0,HOTSPOT_RADIUS:20,WIREFRAME:!1,TRANSPARENT:!1,MAIN_GROUP_NAME:"room",SHADER_ROTATION_X:0,SHADER_ROTATION_Y:0,SHADER_ROTATION_Z:0,TIME_CHANGE_POSITION:1e3,TWEEN_DELAY_MOVEMENT:50,STREAM_CUBEMAPS_CNT:10},An={panoramaIsActive:!1,expectedResources:1};function Cn(e,t,n,i,o,r,l){this.domElement=i!==void 0?i:document;const c=this,d=new e.Raycaster,m=new e.Vector2,A=[];new e.Vector3;const y=new e.PlaneGeometry(r/2,r/2);y.rotateX(-Math.PI/2);const x=new e.MeshBasicMaterial({transparent:0,opacity:$.CURSOR_OPACITY,depthWrite:!1,depthTest:!1}),E=new e.TextureLoader().load(`${ue}hotspot_image.webp`);x.alphaMap=E,x.alphaMap.minFilter=e.LinearFilter;const a=new e.Mesh(y,x);a.renderOrder=10,a.visible=!0,t.add(a),c.enabled=!0;const O=.05;let U=1,R=!0;function v(T){T.preventDefault(),c.enabled!==!1&&(m.x=(lt(T)-l.getBoundingClientRect().left)/(l.getBoundingClientRect().right-l.getBoundingClientRect().left)*2-1,m.y=-((ut(T)-l.getBoundingClientRect().top)/(l.getBoundingClientRect().bottom-l.getBoundingClientRect().top))*2+1,R=!0)}function M(T){T.preventDefault(),a.show=!1,R=!1}function L(T){c.enabled!==!1&&(m.x=T.changedTouches["0"].clientX/l.getBoundingClientRect().width*2-1,m.y=-(T.changedTouches["0"].clientY/l.getBoundingClientRect().height)*2+1,R=!0)}c.domElement.addEventListener("mousemove",v,!1),c.domElement.addEventListener("mouseout",M,!1),c.domElement.addEventListener("touchstart",L,!1),c.domElement.addEventListener("touchmove",v,!1),c.domElement.addEventListener("touchend",M,!1),this.addTargetObject=function(T){A.push(T)};function N(){let T=O;a.show||(T=-O);let I=a.material.opacity+T;I<0&&(I=0),I>$.HOTSPOT_OPACITY&&(I=$.HOTSPOT_OPACITY),I!=a.material.opacity&&(a.material.opacity=I)}this.update=function(){if(c.enabled===!1&&(a.show=!1),N(),c.enabled===!1)return;if(o.isRotating){a.show=!0;return}d.setFromCamera(m,n);const I=d.intersectObjects(A,!0);if(I.length>0&&R){a.show=!0,a.scale.set($.CURSOR_ORBIT_SCALE,$.CURSOR_ORBIT_SCALE,$.CURSOR_ORBIT_SCALECURSOR_ORBIT_SCALE),a.position.copy(I[0].point);const p=new e.Matrix4;p.makeRotationFromQuaternion(I[0].object.quaternion),p.copy(p).invert(),p.transpose(),U=$.CURSOR_ORBIT_SCALE,a.scale.set(U,U,U);const h=I[0].face.normal;h.applyMatrix4(p);const u=new e.Vector3;u.crossVectors(h,new e.Vector3(h.z,-h.x,h.y));const _=new e.Vector3;_.crossVectors(u,h),u.crossVectors(_,h);const D=new e.Matrix4;D.makeBasis(_,h,u),a.setRotationFromMatrix(D)}else a.show=!1},this.getPosition=function(){return a.visible||!utils.isDesktop()?a.position:null}}function Rn(e,t,n,i){const o=.013,r=1,l=this,c=new e.Vector2;let d=new e.Vector2,m=!1;const A=new e.Raycaster,y=16042496;let x=!1,E=[],a=null;const O=t!==void 0&&t.domElement!==void 0?t.domElement:document;let U=!1,R=!1;const v=new e.Vector3;new e.Vector3,new e.Vector3;let M=1;const L=new e.Frustum;l.toggleMeasure=function(){x=!x},l.disableMeasure=function(){x&&(l.toggleMeasure(),d=new e.Vector2,p(n),a=null,m=!1)};const N=function(f){c.x=getClientX(f)/O.clientWidth*2-1,console.log(O.clientWidth),c.y=-(getClientY(f)/O.clientHeight)*2+1},T=function(f,C){const V=document.createElement("div");V.classList.add("hotspot");const X=document.createElement("span");X.innerHTML="0 mm",V.appendChild(X);const z=document.createElement("i");z.classList.add("fa"),z.classList.add("fa-times"),z.setAttribute("aria-hidden","true"),z.setAttribute("title","Delete measurements"),V.appendChild(z),z.onclick=function(Q){n.remove(C.p1),n.remove(C.p2),n.remove(C.label),n.remove(C.line),document.getElementsByTagName("body")[0].removeChild(V)},document.getElementsByTagName("body")[0].appendChild(V),C.htmlLabel=V};l.removeRulers=function(){E.forEach(f=>{if(f&&f.htmlLabel){n.remove(f.p1),n.remove(f.p2),n.remove(f.label),n.remove(f.line);try{document.getElementsByTagName("body")[0].removeChild(f.htmlLabel)}catch{}}}),E=[]},l.hide=function(){E.forEach(f=>{f&&f.htmlLabel&&(f.p1.visible=!1,f.p2.visible=!1,f.line.visible=!1,f.htmlLabel.style.opacity="0.0")})},l.show=function(){E.forEach(f=>{f&&f.htmlLabel&&(f.p1.visible=!0,f.p2.visible=!0,f.line.visible=!0,f.htmlLabel.style.opacity="1.0")})};const I=function(f,C){const V=new e.Vector3,X=.5*t.context.canvas.width,z=.5*t.context.canvas.height;return f.updateMatrixWorld(),V.setFromMatrixPosition(f.matrixWorld),V.project(C),V.x=V.x*X+X,V.y=-(V.y*z)+z,{x:V.x,y:V.y}};var p=function(f){if(a){if(a.p1&&f.remove(a.p1),a.p2&&f.remove(a.p2),a.line&&f.remove(a.line),a.label&&f.remove(a.label),a.htmlLabel)try{document.getElementsByTagName("body")[0].removeChild(a.htmlLabel)}catch{}a=null}};const h=function(f){E.forEach(C=>{!C||(v.subVectors(C.label.position,f.position),M=f.position.distanceTo(C.label.position),C.label.scale.set(16*M/100,4*M/100,1))})},u=function(){E.forEach(f=>{!f||!f.htmlLabel||(L.setFromMatrix(new e.Matrix4().multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse)),f.position2d=I(f.label,i),L.containsPoint(f.label.position)?(f.position2d=I(f.label,i),f.htmlLabel.style.display="block",f.htmlLabel.style.left=`${Math.floor(f.position2d.x/window.devicePixelRatio)}px`,f.htmlLabel.style.top=`${Math.floor(f.position2d.y/window.devicePixelRatio)}px`,f.htmlLabel.style.zIndex=590-Math.floor(i.position.distanceTo(f.label.position))):f.htmlLabel.style.display="none")})},_=function(f,C){return(C.clone().sub(f).length()*1e3/r).toFixed(0)},D=function(f,C,V){let X=C.clone().sub(f);const z=X.length();return X=X.normalize().multiplyScalar(z*V),f.clone().add(X)},B=function(f){f.preventDefault(),x&&(U=!0,R=!1,m=!1,N(f),d.copy(c))},F=function(f){f.preventDefault(),x&&(N(f),U&&!d.equals(c)&&(m=!1,R=!0))},k=function(f){f.preventDefault(),x&&(U=!1,m=!R)};O.addEventListener("contextmenu",f=>(f.preventDefault(),l.disableMeasure(),!1),!1),O.addEventListener("mousedown",B,!1),O.addEventListener("mousemove",F,!1),O.addEventListener("mouseup",k,!1),O.addEventListener("touchstart",B,!1),O.addEventListener("touchmove",F,!1),O.addEventListener("touchend",k,!1),this.targetObjects=[],this.isActive=function(){return x},this.processIntersections=function(){if(x){A.setFromCamera(c,i);const V=A.intersectObjects(l.targetObjects);if(V.length>0){if(!a&&m){var f=new e.ConeGeometry(1*o,10*o,16);f.rotateX(-Math.PI/2),f.translate(0,0,4.99*o);var C=new e.Mesh(f,new e.MeshLambertMaterial({color:y}));C.position.copy(V[0].point),n.add(C),a={p1:C},E.push(a)}else if(a&&!a.p2){var f=new e.ConeGeometry(1*o,10*o,16);f.rotateX(-Math.PI/2),f.translate(0,0,4.99*o);var C=new e.Mesh(f,new e.MeshLambertMaterial({color:y}));C.position.copy(V[0].point),n.add(C),a.p2=C;const Q=new Geometry;Q.vertices.push(a.p1.position,a.p2.position);const K=new e.Line(Q,new e.LineBasicMaterial({color:y,linewidth:10}));K.frustumCulled=!1,n.add(K),a.line=K;const se=new e.Object3D;n.add(se),a.label=se,T("0",a)}if(a&&a.p2){a.p2.position.copy(V[0].point),a.line.geometry.vertices[1].copy(V[0].point),a.line.geometry.verticesNeedUpdate=!0,a.p2.lookAt(a.p1.position),a.p1.lookAt(a.p2.position),a.label.position.copy(D(a.p1.position,a.p2.position,.5));const X=_(a.p1.position,a.p2.position);X!=a.length&&(a.needUpdate=!0,a.length=X,a.htmlLabel.querySelector("span").innerHTML=`${a.length} mm`),m&&(setTimeout(()=>{},500),a=null)}m=!1}}else p(n),h(i);u()},this.calculateVisibility=function(f){E.forEach(C=>{!C||(C.label.material.depthTest=!1)})}}function Ln(e,t,n){let i,o;const r=new e.Vector3,l=new e.Vector3;let c,d,m=null;"VRFrameData"in window&&(m=new window.VRFrameData);function A(p){o=p,p.length>0?i=p[0]:n&&n("HMD not available")}navigator.getVRDisplays&&navigator.getVRDisplays().then(A).catch(()=>{console.warn("THREE.VREffect: Unable to get VR Displays")}),this.isPresenting=!1,this.scale=1;const y=this;let x=new e.Vector2;t.getSize(x);let E=!1,a=t.getPixelRatio();this.getVRDisplay=function(){return i},this.setVRDisplay=function(p){i=p},this.getVRDisplays=function(){return console.warn("THREE.VREffect: getVRDisplays() is being deprecated."),o},this.setSize=function(p,h,u){if(x={width:p,height:h},E=u,y.isPresenting){const _=i.getEyeParameters("left");t.setPixelRatio(1),t.setSize(_.renderWidth*2,_.renderHeight,!1)}else t.setPixelRatio(a),t.setSize(p,h,u)};const O=t.domElement,U=[0,0,.5,1],R=[.5,0,.5,1];function v(){const p=y.isPresenting;if(y.isPresenting=i!==void 0&&i.isPresenting,y.isPresenting){const h=i.getEyeParameters("left"),u=h.renderWidth,_=h.renderHeight;p||(a=t.getPixelRatio(),x=t.getSize(),t.setPixelRatio(1),t.setSize(u*2,_,!1))}else p&&(t.setPixelRatio(a),t.setSize(x.width,x.height,E))}window.addEventListener("vrdisplaypresentchange",v,!1),this.setFullScreen=function(p){return new Promise((h,u)=>{if(i===void 0){u(new Error("No VR hardware found."));return}if(y.isPresenting===p){h();return}h(p?i.requestPresent([{source:O}]):i.exitPresent())})},this.requestPresent=function(){return this.setFullScreen(!0)},this.exitPresent=function(){return this.setFullScreen(!1)},this.requestAnimationFrame=function(p){return i!==void 0?i.requestAnimationFrame(p):window.requestAnimationFrame(p)},this.cancelAnimationFrame=function(p){i!==void 0?i.cancelAnimationFrame(p):window.cancelAnimationFrame(p)},this.submitFrame=function(){i!==void 0&&y.isPresenting&&i.submitFrame()},this.autoSubmitFrame=!0;const M=new e.PerspectiveCamera;M.layers.enable(1);const L=new e.PerspectiveCamera;L.layers.enable(2),this.render=function(p,h,u,_){if(i&&y.isPresenting){const D=p.autoUpdate;D&&(p.updateMatrixWorld(),p.autoUpdate=!1);const B=i.getEyeParameters("left"),F=i.getEyeParameters("right");r.fromArray(B.offset),l.fromArray(F.offset),Array.isArray(p)&&(console.warn("THREE.VREffect.render() no longer supports arrays. Use object.layers instead."),p=p[0]);const k=t.getSize(),f=i.getLayers();let C,V;if(f.length){const z=f[0];C=z.leftBounds!==null&&z.leftBounds.length===4?z.leftBounds:U,V=z.rightBounds!==null&&z.rightBounds.length===4?z.rightBounds:R}else C=U,V=R;c={x:Math.round(k.width*C[0]),y:Math.round(k.height*C[1]),width:Math.round(k.width*C[2]),height:Math.round(k.height*C[3])},d={x:Math.round(k.width*V[0]),y:Math.round(k.height*V[1]),width:Math.round(k.width*V[2]),height:Math.round(k.height*V[3])},u?(t.setRenderTarget(u),u.scissorTest=!0):(t.setRenderTarget(null),t.setScissorTest(!0)),(t.autoClear||_)&&t.clear(),h.parent===null&&h.updateMatrixWorld(),h.matrixWorld.decompose(M.position,M.quaternion,M.scale),h.matrixWorld.decompose(L.position,L.quaternion,L.scale);const X=this.scale;r.x=r.x*0,l.x=l.x*0,M.translateOnAxis(r,X),L.translateOnAxis(l,X),i.getFrameData?(i.depthNear=h.near,i.depthFar=h.far,i.getFrameData(m),M.projectionMatrix.elements=m.leftProjectionMatrix,L.projectionMatrix.elements=m.rightProjectionMatrix):(M.projectionMatrix=I(B.fieldOfView,!0,h.near,h.far),L.projectionMatrix=I(F.fieldOfView,!0,h.near,h.far)),u?(u.viewport.set(c.x,c.y,c.width,c.height),u.scissor.set(c.x,c.y,c.width,c.height)):(t.setViewport(c.x,c.y,c.width,c.height),t.setScissor(c.x,c.y,c.width,c.height)),t.render(p,M,u,_),u?(u.viewport.set(d.x,d.y,d.width,d.height),u.scissor.set(d.x,d.y,d.width,d.height)):(t.setViewport(d.x,d.y,d.width,d.height),t.setScissor(d.x,d.y,d.width,d.height)),t.render(p,L,u,_),u?(u.viewport.set(0,0,k.width,k.height),u.scissor.set(0,0,k.width,k.height),u.scissorTest=!1,t.setRenderTarget(null)):(t.setViewport(0,0,k.width,k.height),t.setScissorTest(!1)),D&&(p.autoUpdate=!0),y.autoSubmitFrame&&y.submitFrame();return}t.render(p,h,u,_)},this.dispose=function(){window.removeEventListener("vrdisplaypresentchange",v,!1)};function N(p){const h=2/(p.leftTan+p.rightTan),u=(p.leftTan-p.rightTan)*h*.5,_=2/(p.upTan+p.downTan),D=(p.upTan-p.downTan)*_*.5;return{scale:[h,_],offset:[u,D]}}function T(p,h,u,_){h=h===void 0?!0:h,u=u===void 0?.01:u,_=_===void 0?1e4:_;const D=h?-1:1,B=new e.Matrix4,F=B.elements,k=N(p);return F[0*4+0]=k.scale[0],F[0*4+1]=0,F[0*4+2]=k.offset[0]*D,F[0*4+3]=0,F[1*4+0]=0,F[1*4+1]=k.scale[1],F[1*4+2]=-k.offset[1]*D,F[1*4+3]=0,F[2*4+0]=0,F[2*4+1]=0,F[2*4+2]=_/(u-_)*-D,F[2*4+3]=_*u/(u-_),F[3*4+0]=0,F[3*4+1]=0,F[3*4+2]=D,F[3*4+3]=0,B.transpose(),B}function I(p,h,u,_){const D=Math.PI/180,B={upTan:Math.tan(p.upDegrees*D),downTan:Math.tan(p.downDegrees*D),leftTan:Math.tan(p.leftDegrees*D),rightTan:Math.tan(p.rightDegrees*D)};return T(B,h,u,_)}}function Tn(e,t,n){const i=new e.Raycaster,o=this,r=new e.PlaneGeometry($.HOTSPOT_RADIUS,$.HOTSPOT_RADIUS);r.translate(-0,-0,.05),r.rotateX(-Math.PI/2);const l=t.getObjectByName($.MAIN_GROUP_NAME),c=new e.Group;c.name=$.HOTSPOT_GROUP_NAME;const d=new e.MeshBasicMaterial({transparent:1,opacity:$.HOTSPOT_OPACITY}),m=new e.TextureLoader().load(`${ue}hotspot_image.webp`);d.alphaMap=m,d.alphaMap.minFilter=e.LinearFilter;for(const A in n){const y=n[A].position;i.set(y,new e.Vector3(0,-1,0));const x=i.intersectObject(l,!1);if(x.length>0){const E=new e.Mesh(r,d);E.renderOrder=3,E.position.copy(x[0].point),E.name=A,c.add(E),n[A].hotspot=E.position}}o.objects=c.children,t.add(c),this.update=function(){},this.changeActiveLocation=function(A){c&&c.children&&c.children.forEach(y=>{y.visible=A!==y.name})},this.show=function(){c&&c.children&&c.children.forEach(A=>{A.visible=!0})},this.hide=function(){c&&c.children&&c.children.forEach(A=>{A.visible=!1})}}function Ce(){return{uniforms:{progress:{type:"f",value:0}},vertexShader:["uniform vec3 uBoxPosition0;","uniform vec3 uBoxPosition1;","uniform mat3 uRotXMatrix;","uniform mat3 uRotYMatrix;","uniform mat3 uRotZMatrix;","","varying vec3 vWorldPosition0;","varying vec3 vWorldPosition1;","","void main()","{","   vec4 worldPosition = modelMatrix * vec4(position, 1.0);","   vWorldPosition0 = (worldPosition.xyz - uBoxPosition0) * vec3( 1.0, 1.0, -1.0);","   vWorldPosition1 = (worldPosition.xyz - uBoxPosition1) * vec3( 1.0, 1.0, -1.0);","   vWorldPosition0 = uRotYMatrix * uRotZMatrix * uRotXMatrix * vWorldPosition0;","   vWorldPosition1 = uRotYMatrix * uRotZMatrix * uRotXMatrix * vWorldPosition1;","","   vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );","   gl_Position = projectionMatrix * mvPosition;","}"].join(`
`),fragmentShader:["uniform float uProgress;","uniform samplerCube uBoxMap0;","uniform samplerCube uBoxMap1;","","varying vec3 vWorldPosition0;","varying vec3 vWorldPosition1;","","void main( void ) {","","   vec4 colorFromBox0 = textureCube(uBoxMap0, vWorldPosition0.xyz);","   vec4 colorFromBox1 = textureCube(uBoxMap1, vWorldPosition1.xyz);","   vec3 color = mix(colorFromBox0.xyz, colorFromBox1.xyz, uProgress);","   gl_FragColor = vec4( color,  1.0 ); ","}"].join(`
`)}}/*!
 * Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com
 * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
 */function Sn(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function ft(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}function En(e,t,n){return t&&ft(e.prototype,t),n&&ft(e,n),e}function Bn(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function j(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]!=null?arguments[t]:{},i=Object.keys(n);typeof Object.getOwnPropertySymbols=="function"&&(i=i.concat(Object.getOwnPropertySymbols(n).filter(function(o){return Object.getOwnPropertyDescriptor(n,o).enumerable}))),i.forEach(function(o){Bn(e,o,n[o])})}return e}function dt(e,t){return Dn(e)||Fn(e,t)||Vn()}function Dn(e){if(Array.isArray(e))return e}function Fn(e,t){var n=[],i=!0,o=!1,r=void 0;try{for(var l=e[Symbol.iterator](),c;!(i=(c=l.next()).done)&&(n.push(c.value),!(t&&n.length===t));i=!0);}catch(d){o=!0,r=d}finally{try{!i&&l.return!=null&&l.return()}finally{if(o)throw r}}return n}function Vn(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}var mt=function(){},Re={},pt={},Nn=null,ht={mark:mt,measure:mt};try{typeof window!="undefined"&&(Re=window),typeof document!="undefined"&&(pt=document),typeof MutationObserver!="undefined"&&(Nn=MutationObserver),typeof performance!="undefined"&&(ht=performance)}catch{}var zn=Re.navigator||{},gt=zn.userAgent,vt=gt===void 0?"":gt,be=Re,Z=pt,Me=ht;be.document;var Le=!!Z.documentElement&&!!Z.head&&typeof Z.addEventListener=="function"&&typeof Z.createElement=="function";~vt.indexOf("MSIE")||~vt.indexOf("Trident/");var ae="___FONT_AWESOME___",yt="fa",wt="svg-inline--fa",jn="data-fa-i2svg";(function(){try{return!0}catch{return!1}})();var Te={GROUP:"group",SWAP_OPACITY:"swap-opacity",PRIMARY:"primary",SECONDARY:"secondary"},bt=be.FontAwesomeConfig||{};function Un(e){var t=Z.querySelector("script["+e+"]");if(t)return t.getAttribute(e)}function kn(e){return e===""?!0:e==="false"?!1:e==="true"?!0:e}if(Z&&typeof Z.querySelector=="function"){var $n=[["data-family-prefix","familyPrefix"],["data-replacement-class","replacementClass"],["data-auto-replace-svg","autoReplaceSvg"],["data-auto-add-css","autoAddCss"],["data-auto-a11y","autoA11y"],["data-search-pseudo-elements","searchPseudoElements"],["data-observe-mutations","observeMutations"],["data-mutate-approach","mutateApproach"],["data-keep-original-source","keepOriginalSource"],["data-measure-performance","measurePerformance"],["data-show-missing-icons","showMissingIcons"]];$n.forEach(function(e){var t=dt(e,2),n=t[0],i=t[1],o=kn(Un(n));o!=null&&(bt[i]=o)})}var Wn={familyPrefix:yt,replacementClass:wt,autoReplaceSvg:!0,autoAddCss:!0,autoA11y:!0,searchPseudoElements:!1,observeMutations:!0,mutateApproach:"async",keepOriginalSource:!0,measurePerformance:!1,showMissingIcons:!0},Se=j({},Wn,bt);Se.autoReplaceSvg||(Se.observeMutations=!1);var J=j({},Se);be.FontAwesomeConfig=J;var re=be||{};re[ae]||(re[ae]={});re[ae].styles||(re[ae].styles={});re[ae].hooks||(re[ae].hooks={});re[ae].shims||(re[ae].shims=[]);var te=re[ae],Gn=[],Xn=function e(){Z.removeEventListener("DOMContentLoaded",e),Ee=1,Gn.map(function(t){return t()})},Ee=!1;Le&&(Ee=(Z.documentElement.doScroll?/^loaded|^c/:/^loaded|^i|^c/).test(Z.readyState),Ee||Z.addEventListener("DOMContentLoaded",Xn));typeof global!="undefined"&&typeof global.process!="undefined"&&global.process.emit;var he={size:16,x:0,y:0,rotate:0,flipX:!1,flipY:!1};function Yn(e){if(!(!e||!Le)){var t=Z.createElement("style");t.setAttribute("type","text/css"),t.innerHTML=e;for(var n=Z.head.childNodes,i=null,o=n.length-1;o>-1;o--){var r=n[o],l=(r.tagName||"").toUpperCase();["STYLE","LINK"].indexOf(l)>-1&&(i=r)}return Z.head.insertBefore(t,i),e}}var qn="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";function xe(){for(var e=12,t="";e-- >0;)t+=qn[Math.random()*62|0];return t}function Mt(e){return"".concat(e).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function Hn(e){return Object.keys(e||{}).reduce(function(t,n){return t+"".concat(n,'="').concat(Mt(e[n]),'" ')},"").trim()}function xt(e){return Object.keys(e||{}).reduce(function(t,n){return t+"".concat(n,": ").concat(e[n],";")},"")}function _t(e){return e.size!==he.size||e.x!==he.x||e.y!==he.y||e.rotate!==he.rotate||e.flipX||e.flipY}function Ot(e){var t=e.transform,n=e.containerWidth,i=e.iconWidth,o={transform:"translate(".concat(n/2," 256)")},r="translate(".concat(t.x*32,", ").concat(t.y*32,") "),l="scale(".concat(t.size/16*(t.flipX?-1:1),", ").concat(t.size/16*(t.flipY?-1:1),") "),c="rotate(".concat(t.rotate," 0 0)"),d={transform:"".concat(r," ").concat(l," ").concat(c)},m={transform:"translate(".concat(i/2*-1," -256)")};return{outer:o,inner:d,path:m}}var Be={x:0,y:0,width:"100%",height:"100%"};function Pt(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0;return e.attributes&&(e.attributes.fill||t)&&(e.attributes.fill="black"),e}function Zn(e){return e.tag==="g"?e.children:[e]}function Qn(e){var t=e.children,n=e.attributes,i=e.main,o=e.mask,r=e.maskId,l=e.transform,c=i.width,d=i.icon,m=o.width,A=o.icon,y=Ot({transform:l,containerWidth:m,iconWidth:c}),x={tag:"rect",attributes:j({},Be,{fill:"white"})},E=d.children?{children:d.children.map(Pt)}:{},a={tag:"g",attributes:j({},y.inner),children:[Pt(j({tag:d.tag,attributes:j({},d.attributes,y.path)},E))]},O={tag:"g",attributes:j({},y.outer),children:[a]},U="mask-".concat(r||xe()),R="clip-".concat(r||xe()),v={tag:"mask",attributes:j({},Be,{id:U,maskUnits:"userSpaceOnUse",maskContentUnits:"userSpaceOnUse"}),children:[x,O]},M={tag:"defs",children:[{tag:"clipPath",attributes:{id:R},children:Zn(A)},v]};return t.push(M,{tag:"rect",attributes:j({fill:"currentColor","clip-path":"url(#".concat(R,")"),mask:"url(#".concat(U,")")},Be)}),{children:t,attributes:n}}function Jn(e){var t=e.children,n=e.attributes,i=e.main,o=e.transform,r=e.styles,l=xt(r);if(l.length>0&&(n.style=l),_t(o)){var c=Ot({transform:o,containerWidth:i.width,iconWidth:i.width});t.push({tag:"g",attributes:j({},c.outer),children:[{tag:"g",attributes:j({},c.inner),children:[{tag:i.icon.tag,children:i.icon.children,attributes:j({},i.icon.attributes,c.path)}]}]})}else t.push(i.icon);return{children:t,attributes:n}}function Kn(e){var t=e.children,n=e.main,i=e.mask,o=e.attributes,r=e.styles,l=e.transform;if(_t(l)&&n.found&&!i.found){var c=n.width,d=n.height,m={x:c/d/2,y:.5};o.style=xt(j({},r,{"transform-origin":"".concat(m.x+l.x/16,"em ").concat(m.y+l.y/16,"em")}))}return[{tag:"svg",attributes:o,children:t}]}function ei(e){var t=e.prefix,n=e.iconName,i=e.children,o=e.attributes,r=e.symbol,l=r===!0?"".concat(t,"-").concat(J.familyPrefix,"-").concat(n):r;return[{tag:"svg",attributes:{style:"display: none;"},children:[{tag:"symbol",attributes:j({},o,{id:l}),children:i}]}]}function ti(e){var t=e.icons,n=t.main,i=t.mask,o=e.prefix,r=e.iconName,l=e.transform,c=e.symbol,d=e.title,m=e.maskId,A=e.titleId,y=e.extra,x=e.watchable,E=x===void 0?!1:x,a=i.found?i:n,O=a.width,U=a.height,R=o==="fak",v=R?"":"fa-w-".concat(Math.ceil(O/U*16)),M=[J.replacementClass,r?"".concat(J.familyPrefix,"-").concat(r):"",v].filter(function(u){return y.classes.indexOf(u)===-1}).filter(function(u){return u!==""||!!u}).concat(y.classes).join(" "),L={children:[],attributes:j({},y.attributes,{"data-prefix":o,"data-icon":r,class:M,role:y.attributes.role||"img",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 ".concat(O," ").concat(U)})},N=R&&!~y.classes.indexOf("fa-fw")?{width:"".concat(O/U*16*.0625,"em")}:{};E&&(L.attributes[jn]=""),d&&L.children.push({tag:"title",attributes:{id:L.attributes["aria-labelledby"]||"title-".concat(A||xe())},children:[d]});var T=j({},L,{prefix:o,iconName:r,main:n,mask:i,maskId:m,transform:l,symbol:c,styles:j({},N,y.styles)}),I=i.found&&n.found?Qn(T):Jn(T),p=I.children,h=I.attributes;return T.children=p,T.attributes=h,c?ei(T):Kn(T)}var It=function(){};J.measurePerformance&&Me&&Me.mark&&Me.measure;var ni=function(t,n){return function(i,o,r,l){return t.call(n,i,o,r,l)}},De=function(t,n,i,o){var r=Object.keys(t),l=r.length,c=o!==void 0?ni(n,o):n,d,m,A;for(i===void 0?(d=1,A=t[r[0]]):(d=0,A=i);d<l;d++)m=r[d],A=c(A,t[m],m,t);return A};function At(e,t){var n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{},i=n.skipHooks,o=i===void 0?!1:i,r=Object.keys(t).reduce(function(l,c){var d=t[c],m=!!d.icon;return m?l[d.iconName]=d.icon:l[c]=d,l},{});typeof te.hooks.addPack=="function"&&!o?te.hooks.addPack(e,r):te.styles[e]=j({},te.styles[e]||{},r),e==="fas"&&At("fa",t)}var Ct=te.styles,ii=te.shims,Rt=function(){var t=function(o){return De(Ct,function(r,l,c){return r[c]=De(l,o,{}),r},{})};t(function(i,o,r){return o[3]&&(i[o[3]]=r),i}),t(function(i,o,r){var l=o[2];return i[r]=r,l.forEach(function(c){i[c]=r}),i});var n="far"in Ct;De(ii,function(i,o){var r=o[0],l=o[1],c=o[2];return l==="far"&&!n&&(l="fas"),i[r]={prefix:l,iconName:c},i},{})};Rt();te.styles;function Lt(e,t,n){if(e&&e[t]&&e[t][n])return{prefix:t,iconName:n,icon:e[t][n]}}function Tt(e){var t=e.tag,n=e.attributes,i=n===void 0?{}:n,o=e.children,r=o===void 0?[]:o;return typeof e=="string"?Mt(e):"<".concat(t," ").concat(Hn(i),">").concat(r.map(Tt).join(""),"</").concat(t,">")}function Fe(e){this.name="MissingIcon",this.message=e||"Icon unavailable",this.stack=new Error().stack}Fe.prototype=Object.create(Error.prototype);Fe.prototype.constructor=Fe;var _e={fill:"currentColor"},St={attributeType:"XML",repeatCount:"indefinite",dur:"2s"};j({},_e,{d:"M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z"});var Ve=j({},St,{attributeName:"opacity"});j({},_e,{cx:"256",cy:"364",r:"28"}),j({},St,{attributeName:"r",values:"28;14;28;28;14;28;"}),j({},Ve,{values:"1;0;1;1;0;1;"});j({},_e,{opacity:"1",d:"M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z"}),j({},Ve,{values:"1;0;0;0;0;1;"});j({},_e,{opacity:"0",d:"M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z"}),j({},Ve,{values:"0;0;1;1;0;0;"});te.styles;function Et(e){var t=e[0],n=e[1],i=e.slice(4),o=dt(i,1),r=o[0],l=null;return Array.isArray(r)?l={tag:"g",attributes:{class:"".concat(J.familyPrefix,"-").concat(Te.GROUP)},children:[{tag:"path",attributes:{class:"".concat(J.familyPrefix,"-").concat(Te.SECONDARY),fill:"currentColor",d:r[0]}},{tag:"path",attributes:{class:"".concat(J.familyPrefix,"-").concat(Te.PRIMARY),fill:"currentColor",d:r[1]}}]}:l={tag:"path",attributes:{fill:"currentColor",d:r}},{found:!0,width:t,height:n,icon:l}}te.styles;var oi=`svg:not(:root).svg-inline--fa {
  overflow: visible;
}

.svg-inline--fa {
  display: inline-block;
  font-size: inherit;
  height: 1em;
  overflow: visible;
  vertical-align: -0.125em;
}
.svg-inline--fa.fa-lg {
  vertical-align: -0.225em;
}
.svg-inline--fa.fa-w-1 {
  width: 0.0625em;
}
.svg-inline--fa.fa-w-2 {
  width: 0.125em;
}
.svg-inline--fa.fa-w-3 {
  width: 0.1875em;
}
.svg-inline--fa.fa-w-4 {
  width: 0.25em;
}
.svg-inline--fa.fa-w-5 {
  width: 0.3125em;
}
.svg-inline--fa.fa-w-6 {
  width: 0.375em;
}
.svg-inline--fa.fa-w-7 {
  width: 0.4375em;
}
.svg-inline--fa.fa-w-8 {
  width: 0.5em;
}
.svg-inline--fa.fa-w-9 {
  width: 0.5625em;
}
.svg-inline--fa.fa-w-10 {
  width: 0.625em;
}
.svg-inline--fa.fa-w-11 {
  width: 0.6875em;
}
.svg-inline--fa.fa-w-12 {
  width: 0.75em;
}
.svg-inline--fa.fa-w-13 {
  width: 0.8125em;
}
.svg-inline--fa.fa-w-14 {
  width: 0.875em;
}
.svg-inline--fa.fa-w-15 {
  width: 0.9375em;
}
.svg-inline--fa.fa-w-16 {
  width: 1em;
}
.svg-inline--fa.fa-w-17 {
  width: 1.0625em;
}
.svg-inline--fa.fa-w-18 {
  width: 1.125em;
}
.svg-inline--fa.fa-w-19 {
  width: 1.1875em;
}
.svg-inline--fa.fa-w-20 {
  width: 1.25em;
}
.svg-inline--fa.fa-pull-left {
  margin-right: 0.3em;
  width: auto;
}
.svg-inline--fa.fa-pull-right {
  margin-left: 0.3em;
  width: auto;
}
.svg-inline--fa.fa-border {
  height: 1.5em;
}
.svg-inline--fa.fa-li {
  width: 2em;
}
.svg-inline--fa.fa-fw {
  width: 1.25em;
}

.fa-layers svg.svg-inline--fa {
  bottom: 0;
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
  top: 0;
}

.fa-layers {
  display: inline-block;
  height: 1em;
  position: relative;
  text-align: center;
  vertical-align: -0.125em;
  width: 1em;
}
.fa-layers svg.svg-inline--fa {
  -webkit-transform-origin: center center;
          transform-origin: center center;
}

.fa-layers-counter, .fa-layers-text {
  display: inline-block;
  position: absolute;
  text-align: center;
}

.fa-layers-text {
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
          transform: translate(-50%, -50%);
  -webkit-transform-origin: center center;
          transform-origin: center center;
}

.fa-layers-counter {
  background-color: #ff253a;
  border-radius: 1em;
  -webkit-box-sizing: border-box;
          box-sizing: border-box;
  color: #fff;
  height: 1.5em;
  line-height: 1;
  max-width: 5em;
  min-width: 1.5em;
  overflow: hidden;
  padding: 0.25em;
  right: 0;
  text-overflow: ellipsis;
  top: 0;
  -webkit-transform: scale(0.25);
          transform: scale(0.25);
  -webkit-transform-origin: top right;
          transform-origin: top right;
}

.fa-layers-bottom-right {
  bottom: 0;
  right: 0;
  top: auto;
  -webkit-transform: scale(0.25);
          transform: scale(0.25);
  -webkit-transform-origin: bottom right;
          transform-origin: bottom right;
}

.fa-layers-bottom-left {
  bottom: 0;
  left: 0;
  right: auto;
  top: auto;
  -webkit-transform: scale(0.25);
          transform: scale(0.25);
  -webkit-transform-origin: bottom left;
          transform-origin: bottom left;
}

.fa-layers-top-right {
  right: 0;
  top: 0;
  -webkit-transform: scale(0.25);
          transform: scale(0.25);
  -webkit-transform-origin: top right;
          transform-origin: top right;
}

.fa-layers-top-left {
  left: 0;
  right: auto;
  top: 0;
  -webkit-transform: scale(0.25);
          transform: scale(0.25);
  -webkit-transform-origin: top left;
          transform-origin: top left;
}

.fa-lg {
  font-size: 1.3333333333em;
  line-height: 0.75em;
  vertical-align: -0.0667em;
}

.fa-xs {
  font-size: 0.75em;
}

.fa-sm {
  font-size: 0.875em;
}

.fa-1x {
  font-size: 1em;
}

.fa-2x {
  font-size: 2em;
}

.fa-3x {
  font-size: 3em;
}

.fa-4x {
  font-size: 4em;
}

.fa-5x {
  font-size: 5em;
}

.fa-6x {
  font-size: 6em;
}

.fa-7x {
  font-size: 7em;
}

.fa-8x {
  font-size: 8em;
}

.fa-9x {
  font-size: 9em;
}

.fa-10x {
  font-size: 10em;
}

.fa-fw {
  text-align: center;
  width: 1.25em;
}

.fa-ul {
  list-style-type: none;
  margin-left: 2.5em;
  padding-left: 0;
}
.fa-ul > li {
  position: relative;
}

.fa-li {
  left: -2em;
  position: absolute;
  text-align: center;
  width: 2em;
  line-height: inherit;
}

.fa-border {
  border: solid 0.08em #eee;
  border-radius: 0.1em;
  padding: 0.2em 0.25em 0.15em;
}

.fa-pull-left {
  float: left;
}

.fa-pull-right {
  float: right;
}

.fa.fa-pull-left,
.fas.fa-pull-left,
.far.fa-pull-left,
.fal.fa-pull-left,
.fab.fa-pull-left {
  margin-right: 0.3em;
}
.fa.fa-pull-right,
.fas.fa-pull-right,
.far.fa-pull-right,
.fal.fa-pull-right,
.fab.fa-pull-right {
  margin-left: 0.3em;
}

.fa-spin {
  -webkit-animation: fa-spin 2s infinite linear;
          animation: fa-spin 2s infinite linear;
}

.fa-pulse {
  -webkit-animation: fa-spin 1s infinite steps(8);
          animation: fa-spin 1s infinite steps(8);
}

@-webkit-keyframes fa-spin {
  0% {
    -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
  }
}

@keyframes fa-spin {
  0% {
    -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
  }
}
.fa-rotate-90 {
  -ms-filter: "progid:DXImageTransform.Microsoft.BasicImage(rotation=1)";
  -webkit-transform: rotate(90deg);
          transform: rotate(90deg);
}

.fa-rotate-180 {
  -ms-filter: "progid:DXImageTransform.Microsoft.BasicImage(rotation=2)";
  -webkit-transform: rotate(180deg);
          transform: rotate(180deg);
}

.fa-rotate-270 {
  -ms-filter: "progid:DXImageTransform.Microsoft.BasicImage(rotation=3)";
  -webkit-transform: rotate(270deg);
          transform: rotate(270deg);
}

.fa-flip-horizontal {
  -ms-filter: "progid:DXImageTransform.Microsoft.BasicImage(rotation=0, mirror=1)";
  -webkit-transform: scale(-1, 1);
          transform: scale(-1, 1);
}

.fa-flip-vertical {
  -ms-filter: "progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1)";
  -webkit-transform: scale(1, -1);
          transform: scale(1, -1);
}

.fa-flip-both, .fa-flip-horizontal.fa-flip-vertical {
  -ms-filter: "progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1)";
  -webkit-transform: scale(-1, -1);
          transform: scale(-1, -1);
}

:root .fa-rotate-90,
:root .fa-rotate-180,
:root .fa-rotate-270,
:root .fa-flip-horizontal,
:root .fa-flip-vertical,
:root .fa-flip-both {
  -webkit-filter: none;
          filter: none;
}

.fa-stack {
  display: inline-block;
  height: 2em;
  position: relative;
  width: 2.5em;
}

.fa-stack-1x,
.fa-stack-2x {
  bottom: 0;
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
  top: 0;
}

.svg-inline--fa.fa-stack-1x {
  height: 1em;
  width: 1.25em;
}
.svg-inline--fa.fa-stack-2x {
  height: 2em;
  width: 2.5em;
}

.fa-inverse {
  color: #fff;
}

.sr-only {
  border: 0;
  clip: rect(0, 0, 0, 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
}

.sr-only-focusable:active, .sr-only-focusable:focus {
  clip: auto;
  height: auto;
  margin: 0;
  overflow: visible;
  position: static;
  width: auto;
}

.svg-inline--fa .fa-primary {
  fill: var(--fa-primary-color, currentColor);
  opacity: 1;
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa .fa-secondary {
  fill: var(--fa-secondary-color, currentColor);
  opacity: 0.4;
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-primary {
  opacity: 0.4;
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-secondary {
  opacity: 1;
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa mask .fa-primary,
.svg-inline--fa mask .fa-secondary {
  fill: black;
}

.fad.fa-inverse {
  color: #fff;
}`;function ai(){var e=yt,t=wt,n=J.familyPrefix,i=J.replacementClass,o=oi;if(n!==e||i!==t){var r=new RegExp("\\.".concat(e,"\\-"),"g"),l=new RegExp("\\--".concat(e,"\\-"),"g"),c=new RegExp("\\.".concat(t),"g");o=o.replace(r,".".concat(n,"-")).replace(l,"--".concat(n,"-")).replace(c,".".concat(i))}return o}var ri=function(){function e(){Sn(this,e),this.definitions={}}return En(e,[{key:"add",value:function(){for(var n=this,i=arguments.length,o=new Array(i),r=0;r<i;r++)o[r]=arguments[r];var l=o.reduce(this._pullDefinitions,{});Object.keys(l).forEach(function(c){n.definitions[c]=j({},n.definitions[c]||{},l[c]),At(c,l[c]),Rt()})}},{key:"reset",value:function(){this.definitions={}}},{key:"_pullDefinitions",value:function(n,i){var o=i.prefix&&i.iconName&&i.icon?{0:i}:i;return Object.keys(o).map(function(r){var l=o[r],c=l.prefix,d=l.iconName,m=l.icon;n[c]||(n[c]={}),n[c][d]=m}),n}}]),e}();function si(){J.autoAddCss&&!Ft&&(Yn(ai()),Ft=!0)}function ci(e,t){return Object.defineProperty(e,"abstract",{get:t}),Object.defineProperty(e,"html",{get:function(){return e.abstract.map(function(i){return Tt(i)})}}),Object.defineProperty(e,"node",{get:function(){if(!!Le){var i=Z.createElement("div");return i.innerHTML=e.html,i.children}}}),e}function Bt(e){var t=e.prefix,n=t===void 0?"fa":t,i=e.iconName;if(!!i)return Lt(Dt.definitions,n,i)||Lt(te.styles,n,i)}function li(e){return function(t){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},i=(t||{}).icon?t:Bt(t||{}),o=n.mask;return o&&(o=(o||{}).icon?o:Bt(o||{})),e(i,j({},n,{mask:o}))}}var Dt=new ri,Ft=!1,ui=li(function(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=t.transform,i=n===void 0?he:n,o=t.symbol,r=o===void 0?!1:o,l=t.mask,c=l===void 0?null:l,d=t.maskId,m=d===void 0?null:d,A=t.title,y=A===void 0?null:A,x=t.titleId,E=x===void 0?null:x,a=t.classes,O=a===void 0?[]:a,U=t.attributes,R=U===void 0?{}:U,v=t.styles,M=v===void 0?{}:v;if(!!e){var L=e.prefix,N=e.iconName,T=e.icon;return ci(j({type:"icon"},e),function(){return si(),J.autoA11y&&(y?R["aria-labelledby"]="".concat(J.replacementClass,"-title-").concat(E||xe()):(R["aria-hidden"]="true",R.focusable="false")),ti({icons:{main:Et(T),mask:c?Et(c.icon):{found:!1,width:null,height:null,icon:{}}},prefix:L,iconName:N,transform:j({},he,i),symbol:r,title:y,maskId:m,titleId:E,extra:{attributes:R,styles:M,classes:O}})})}});let Ne=0;function fi(e,t,n,i,o,r,l,c){this.domElement=n.domElement!==void 0?n.domElement:document;const d=this,m=new e.Raycaster,A=new e.Vector2;d.enabled=!0;const y=new e.Group;y.name="Tags";function x(){const v=document.createElement("div");return v.className="text-label",v.style.position="absolute",v.hidden=!1,v.style.overflow="hidden",{element:v,parent:!1,position:new e.Vector3(0,0,0),setHTML(M,L,N,T){const I=document.createElement("div");I.style.padding="10px",I.style.display="none",I.style.backgroundColor="rgba(24, 24, 27, 0.8)",I.style.border="8px solid rgba(24, 24, 27, 1)",I.style.color="#FAFAFA",I.style.width="340px",I.innerHTML="",I.hidden=!1,I.style.overflow="hidden",I.style.padding="10px",I.style.borderRadius="4px";const p=document.createElement("img");p.src=`${ue}icons8-info%20(4).svg`,p.style.border="0px solid red",p.style.width="32px",v.addEventListener("touchstart",z=>{Ne=1},!1),v.addEventListener("touchend",z=>{Ne=0},!1),v.addEventListener("mouseover",f,!1),v.addEventListener("mouseout",C,!1);const h=document.createElement("div");h.innerText=`${M}`,h.style.fontWeight="bold",h.style.paddingBottom="20px",Dt.add(On);const u=document.createElement("a");u.setAttribute("id","test"),u.innerHTML=ui({prefix:"fas",iconName:"external-link-alt"}).html,u.style.fontSize="15px",u.style.position="absolute",u.style.display="inline",u.style.right="20px",u.setAttribute("href",N),u.setAttribute("target","_blank"),I.appendChild(u);function _(){const z=/(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;try{var Q=`${N}`.match(z)[1]}catch{var Q="njX2bu-_Vw4"}return Q}let D;T=="Video"?(D=document.createElement("iframe"),D.setAttribute("src",`https://www.youtube.com/embed/${_()}?enablejsapi=1`)):T=="Image"?(D=document.createElement("img"),D.setAttribute("src",`${N}`)):(D=document.createElement("div"),D.innerHTML=`Go to ${N}`),D.setAttribute("width","100%"),D.style.paddingBottom="20px";function B(z){z.getElementsByTagName("iframe")[0].contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}',"*")}const F=function(z){z.style.display="block",d.domElement.addEventListener("touchstart",V,!1)},k=function(z){T=="Video"&&B(z),z.style.display="none"};function f(){Ne==0?window.mytimeout=setTimeout(()=>{F(I)},600):F(I)}function C(){k(I),clearTimeout(window.mytimeout)}function V(){k(I)}const X=document.createElement("div");X.innerText=L,I.appendChild(h),I.appendChild(D),I.appendChild(X),this.element.appendChild(p),this.element.appendChild(I)},setParent(M){this.parent=M},updatePosition(){if(parent){const L=new e.Vector3;L.copy(this.parent.position),L.add(this.parent.circle.position),this.position.copy(L)}const M=this.get2DCoords(this.position,o);if(!this.parent.textVisible||M.x<0||M.y<0||M.x>=c.getBoundingClientRect().width-20||M.y>=c.getBoundingClientRect().height-20||M.z>=1){this.element.hidden=!0;return}else this.element.hidden=!1;this.parent.name=="t1",this.element.style.left=`${M.x}px`,this.element.style.top=`${M.y}px`},get2DCoords(M,L){const N=M.project(L);return N.x=(N.x+1)/2*c.getBoundingClientRect().width,N.y=-(N.y-1)/2*c.getBoundingClientRect().height,N}}}function E(v,M,L,N,T,I,p){const h=new e.Group;h.name=v;const u=[];u.push(new e.Vector3(0,0,0)),u.push(new e.Vector3(0,L,0));const _=new e.CircleGeometry(1,1),D=new e.MeshBasicMaterial({color:65535,side:e.DoubleSide}),B=new e.Mesh(_,D);B.renderOrder=100,B.name="Circle",B.visible=!1,B.position.copy(new e.Vector3(0,L,0));const F=x();return h.circle=B,h.add(B),h.position.copy(M),h.textTag=F,h.textVisible=!0,h.description=I,h.color=N,h.medialink=T,h.mediatype=p,F.setHTML(v,I,T,p),F.setParent(h),document.getElementById("tagsUI").appendChild(F.element),h}function a(v){v.preventDefault(),d.enabled!==!1&&(A.x=lt(v)/c.getBoundingClientRect().width*2-1,A.y=-(ut(v)/c.getBoundingClientRect().height)*2+1)}function O(v){v.preventDefault()}function U(v){d.enabled!==!1&&(A.x=v.changedTouches["0"].clientX/c.getBoundingClientRect().width*2-1,A.y=-(v.changedTouches["0"].clientY/c.getBoundingClientRect().height)*2+1)}function R(){for(let v=0;v<r.length;v++){const M=E(r[v].name,r[v].location,r[v].height,r[v].color,r[v].medialink,r[v].description,r[v].mediatype);y.add(M)}i.add(y)}d.domElement.addEventListener("mousemove",a,!1),d.domElement.addEventListener("mouseout",O,!1),d.domElement.addEventListener("touchstart",U,!1),d.domElement.addEventListener("touchmove",a,!1),d.domElement.addEventListener("touchend",O,!1),this.updateTagVisiblity=function(){y.traverse(v=>{if(v.circle){let M=new e.Vector3;M=M.copy(v.position),M=M.add(v.circle.position),M=M.sub(o.position).normalize(),m.camera=o,m.set(o.position,M),m.intersectObjects(i.children,!0)[0].object.parent.name==v.name?v.textVisible=!0:v.textVisible=!1}})},this.update=function(){y.traverse(v=>{v.circle&&(v.circle.quaternion.copy(o.quaternion),v.textTag.updatePosition())})},R(),this.updateTagVisiblity()}let g,Vt,Nt,zt,jt,Ut,kt;const di={props:{userId:{type:String,required:!0,default:" "},projectId:{type:String,required:!0,default:" "},startScene:{type:String,required:!0,default:" "},startHotspot:{type:String,required:!0,default:" "}},async mounted(){g=await ve(()=>import("https://cdn.skypack.dev/three@0.136.0"),[]),Vt=(await ve(()=>import("https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js"),[])).OrbitControls,Nt=(await ve(()=>import("https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader.js"),[])).GLTFLoader,zt=(await ve(()=>import("https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/DRACOLoader.js"),[])).DRACOLoader;const i=await ve(()=>import("https://cdn.skypack.dev/three-mesh-bvh@0.5.5"),[]);jt=i.computeBoundsTree,Ut=i.disposeBoundsTree,kt=i.acceleratedRaycast,this.webVr(this.userId,this.projectId,this.startScene,this.startHotspot)},methods:{webVr(e,t,n,i){let o,r,l,c=0,d,m,A,y,x,E,a,O=!1,U=6,R;const v={},M={};let L=0,N=0,T=0,I,p=new g.CubeTexture,h=new g.CubeTexture;new g.Clock;const u={db:"",mdl:"",map:"",size:0,uid:-1,scale:1,data:{},cursorRadius:.15,tagsRadius:.05},_={};let D,B,F,k=!0;const f=new g.LoadingManager,C=new g.LoadingManager,V=new g.LoadingManager,X=new g.LoadingManager;let z,Q,K=!1,se=!1,ye=[];const ze=[],Gt=["uBoxMap0","uBoxMap1"],je=["uBoxPosition0","uBoxPosition1"];let fe=0;const Ue=new g.Vector3,ke=document.getElementById("load-dummy");document.getElementById("progress-bg"),document.getElementById("progress-preview"),document.getElementById("progress-bar"),document.getElementById("load-progress"),document.getElementById("tagsUI");function Xt(){u.db=`${ue}spacesDemo/${e}/${t}/Data/payload.json`,Pn(u.db).then(b=>b.json()).then(b=>Yt(b))}function Yt(s){switch(n?N=n:N=s.initialScene,i?T=i:T=s.scenes[N].initialView,D=T,u.data=s,u.path=s.scenes[s.initialScene].path,u.onSceneUpdate=function(b){},u.data.sceneUnits){case"Meters":u.scale=1,u.cursorRadius=.15,u.tagsRadius=.05;break;case"Centimeters":u.scale=.01,u.cursorRadius=15,u.tagsRadius=5;break;case"Feet":u.scale=.3,u.cursorRadius=.5,u.tagsRadius=.15;break;case"inches":u.scale=.0254,u.cursorRadius=6,u.tagsRadius=2;break;default:u.scale=1,u.cursorRadius=.15,u.tagsRadius=.05;break}u.mdl=s.scenes[N].modelPath,u.size=s.scenes[N].size,ln(),fn(N,T),Ze(N),ce()}Xt();function Oe(){let s;const b=o.getBoundingClientRect().width,w=o.getBoundingClientRect().height;m.aspect=b/w,m.updateProjectionMatrix(),x.setSize(b,w),E.setSize(b,w),window.removeEventListener("resize",Oe,!0),clearTimeout(s),s=setTimeout(()=>{window.addEventListener("resize",Oe,!1)},1e3),ce()}function $e(s,b){const w=b?"inherit":"none";if(s instanceof HTMLCollection){for(const P in s)typeof s[P]=="object"&&(s[P].style.display=w);return}s.style.display=w}function qt(s,b){const w=s.position,P=new g.Vector3().subVectors(b.position,new g.Vector3(0,113.4,0));console.log(w),console.log(P);const S=new g.SphereGeometry(15,32,16),W=new g.MeshBasicMaterial({color:16711680}),G=new g.MeshBasicMaterial({color:65280}),Y=new g.Mesh(S,W),ee=new g.Mesh(S,G);Y.position.set(w.x,w.y,w.z),ee.position.set(P.x,P.y,P.z);const ne=new g.Vector3;ne.subVectors(P,w).normalize(),d.set(w,ne);const ie=d.intersectObjects(_,!0);return ie.length>0?(console.log(ie[0].object.name),ie[0].object==b):(console.log("no hits"),!1)}function Pe(s){s.type.startsWith("touch")?c==1&&(se=!0):(M.x=s.offsetX,M.y=s.offsetY,v.x!=M.x&&v.y!=M.y?se=!0:se=!1);const b=A.getPosition();if(b&&!se&&!a.fovChanged&&k){let w=B,P=1/0;for(const S in _){let W=_[S].hotspot;W||(W=_[S].position);const G=b.distanceTo(W);G<P&&(P=G,w=_[S])}if(w!=B){const S=qt(B,w);console.log(S),He(w.name)}}se=!1}function We(s){console.log(s),v.x=s.offsetX,v.y=s.offsetY}function Ht(s){ce()}function Zt(){}function Qt(){}function Jt(){ce()}function Kt(s){if(We(s),s.touches.length!=1)return!1;Pe(s),s.preventDefault()}function en(s){c=1}function tn(s){c=0,Pe(s)}function nn(s){const b=s.domElement,w=b.clientWidth,P=b.clientHeight,S=b.width!==w||b.height!==P;return S&&(m.aspect=w/P,m.updateProjectionMatrix(),s.setSize(w,P,!1),E.setSize(w,P)),S}function on(){if(O=void 0,nn(x)){const s=x.domElement;m.aspect=s.clientWidth/s.clientHeight,m.updateProjectionMatrix()}Q&&Q.update(),L==1&&Ae.update(),A.update(),I.update(),a.update(),E.render(y,m)}function ce(){O||(O=!0,requestAnimationFrame(on))}function Ge(){for(const s in ye){const b=ye[s].src;!isStreamed(b)&&b.includes("@")&&(ye[s].src="")}ye=[]}function an(s){return s==1?0:1}function Xe(s){return Ye(s)?!1:(ze.push(`${s}@`),!0)}function Ye(s){return ze.includes(`${s}@`)}function rn(s,b){s.value=b;try{if(s.value.image&&s.value.image.length>0&&b.image.length>0)for(let w=0;w<s.image.length;w++)s.value.image[w]=b.image[w].cloneNode();else s.value.image=b.image.slice();s.value.needsUpdate=!0}catch{}}function qe(s,b=!0){const w=$.STREAM_CUBEMAPS_CNT;setTimeout(()=>{b&&Ge();const P=[];for(const G in _){const Y=_[s].position.distanceTo(_[G].position);P.push({name:G,dist:Y.toFixed(3)})}P.sort((G,Y)=>G.dist-Y.dist),P.length>1&&P.shift();let S=0;for(const G in P){var W=P[G].name;if(!W||Ye(W))continue;if(S>=w)break;S++;const Y=Ie(W);new g.CubeTextureLoader(V).load(Y,()=>{Xe(W)})}},100)}function sn(s){if(L=1,K)return;const b=fe;fe=an(fe),K=!0,F=s;const w=Gt[fe],P=je[fe],S=je[b];R.uniforms[P].value=s.position,R.uniforms[S].value=B.position,$e(ke,!1),rn(R.uniforms[w],s.data.cubeTexture),new Ae.Tween(m.position).to(s.position,$.TIME_CHANGE_POSITION).easing(Ae.Easing.Cubic.InOut).onUpdate(function(){a.enabled=!0,A.enabled=!1;const W=new g.Vector3;if(W.set(this.x,this.y,this.z),Qe(W),B&&F&&B!=F){const G=Ue.subVectors(F.position,B.position).length(),Y=Ue.subVectors(m.position,B.position).length();if(R.uniforms.uProgress){let ee=Y/G;fe==0&&(ee=1-ee),R.uniforms.uProgress.value=ee.toFixed(3),ce()}}}).onComplete(()=>{L=0,x.renderLists.dispose(),m.position.copy(s.position),B=s,a.update(),a.enabled=!0,A.enabled=!0,Q&&Q.changeActiveLocation(s.name),K=!1,qe(B.name,!0),I.updateTagVisiblity()}).delay($.TWEEN_DELAY_MOVEMENT).start()}function cn(s){return s.expectedResources<An.expectedResources?!1:(setTimeout(()=>{K=!1,sn(s)},0),!0)}function He(s){if(!_[s]||K)return!1;K=!0,k=!1,A.enabled=!1,Ge();const b=Ie(s);_[s].expectedResources=0;const w=new g.CubeTextureLoader(C).load(b,()=>{Xe(s),_[s].expectedResources++,cn(_[s])});w.mapping=g.CubeRefractionMapping,w.magFilter=g.LinearFilter,w.minFilter=g.LinearFilter,_[s].data.cubeTexture=w}function ln(){g.BufferGeometry.prototype.computeBoundsTree=jt,g.BufferGeometry.prototype.disposeBoundsTree=Ut,g.Mesh.prototype.raycast=kt,d=new g.Raycaster,o=document.getElementById("RPWebVR"),r=document.createElement("div"),r.classList.add("container"),o.appendChild(r),m=new g.PerspectiveCamera($.CAMERA_FOV,o.getBoundingClientRect().width/o.getBoundingClientRect().height,$.CAMERA_MIN,$.CAMERA_MAX),y=new g.Scene,new g.SphereGeometry(38,60,40).scale(-1,1,1),new g.LoadingManager(()=>{z=document.getElementById("loading-screen"),z.classList.add("fade-out"),z.addEventListener("transitionend",un)}),x=new g.WebGLRenderer({antialias:In(),preserveDrawingBuffer:!0}),l=x.domElement,r.appendChild(l),U=x.capabilities.getMaxAnisotropy(),E=new Ln(g,x),E.setSize(o.getBoundingClientRect().width,o.getBoundingClientRect().height),a=new Vt(m,x.domElement),a.enableZoom=!0,a.enablePan=!1,a.enableDamping=!0,a.dampingFactor=.05,a.rotateSpeed=-.4,a.update(),A=new Cn(g,y,m,x.domElement,a,u.cursorRadius,o),new Rn(g,x,y,m),y.add(m);const b=new g.HemisphereLight(1048575,4473924,1);b.position.set(0,1,0),y.add(b),a.addEventListener("change",Jt),a.addEventListener("start",Zt),a.addEventListener("end",Qt),window.addEventListener("resize",Oe),x.domElement.addEventListener("mouseup",Pe,!1),x.domElement.addEventListener("mousedown",w=>{We(w)},!1),x.domElement.addEventListener("mousemove",w=>{Ht()}),x.domElement.addEventListener("touchstart",Kt,!1),x.domElement.addEventListener("touchend",tn,!1),x.domElement.addEventListener("touchmove",en,!1)}function un(s){s.target.remove()}function Ze(s=0){const b=u.data.scenes[s].tags,w=[];for(let P=0;P<b.length;P++){const S=b[P],W={};W.name=S.name,W.location=new g.Vector3(S.location[0],S.location[1],S.location[2]),W.height=S.height,W.color=S.color,W.medialink=S.mediaLink,W.description=S.description,W.mediatype=S.mediaType,w.push(W)}I=new fi(g,r,x,y,m,w,u.tagsRadius,o)}function fn(s=0,b=0){const w=y.getObjectByName($.MAIN_GROUP_NAME);y.remove(w);const P=y.getObjectByName($.HOTSPOT_GROUP_NAME);y.remove(P),R=new g.ShaderMaterial({vertexShader:Ce().vertexShader,fragmentShader:Ce().fragmentShader}),R.transparent=$.TRANSPARENT,R.wireframe=$.WIREFRAME;const S=new Nt(X),W=new zt;W.setDecoderPath("https://unpkg.com/three@0.136.0/examples/js/libs/draco/"),S.setDRACOLoader(W),u.mdl=`${ue}spacesDemo/${e}/${t}/Data/WorldMesh.glb`,S.load(u.mdl,G=>{G.scene.children[0],p=new g.CubeTexture,h=new g.CubeTexture;const Y=g.Math.degToRad($.SHADER_ROTATION_X),ee=g.Math.degToRad($.SHADER_ROTATION_Y),ne=g.Math.degToRad($.SHADER_ROTATION_Z),ie=Math.sin(ee),de=Math.cos(ee),me=Math.sin(ne),le=Math.cos(ne),ge=Math.sin(Y),Ke=Math.cos(Y),et=new g.Matrix3;et.set(de,0,ie,0,1,0,-ie,0,de);const tt=new g.Matrix3;tt.set(le,-me,0,me,le,0,0,0,1);const nt=new g.Matrix3;nt.set(1,0,0,0,Ke,-ge,0,ge,Ke),R.uniforms={uProgress:{value:Ce().uniforms.progress.value},uBoxMap0:{value:p},uBoxPosition0:{value:m.position},uBoxMap1:{value:h},uBoxPosition1:{value:m.position},uRotYMatrix:{value:et},uRotZMatrix:{value:nt},uRotXMatrix:{value:tt}};const it=new g.Object3D;for(let q=0;q<u.data.scenes[s].viewpoints.length;q++){const oe=new g.Object3D,we=u.data.scenes[s].viewpoints[q];oe.name=we.name,oe.position.copy(new g.Vector3(we.location[0],we.location[1],we.location[2])),it.add(oe)}it.traverse(q=>{q.name&&(_[q.name]=q,_[q.name].data={cubeTexture:{}})}),G.scene.children[0].traverse(q=>{if(q.originalMaterial=q.material,Array.isArray(q.originalMaterial))q.originalMaterial.forEach(oe=>{oe.map||(oe.emissive=new g.Color(1,1,1),oe.emissiveIntensity=.2)});else{const oe=new g.MeshBasicMaterial({color:65280});q.originalMaterial=oe,q.originalMaterial.emissive=new g.Color(1,1,1),q.originalMaterial.emissiveIntensity=.2}q.shaderMaterial=R,q.material=q.shaderMaterial,q.renderOrder=2,q.geometry.computeBoundsTree(),A.addTargetObject(q)}),G.scene.children[0].name=$.MAIN_GROUP_NAME,y.add(G.scene.children[0]),ce(),new pn(m,_),setTimeout(()=>{dn(()=>{p.image=B.data.cubeTexture.image.slice(),p.needsUpdate=!0,p.mapping=g.CubeRefractionMapping,p.minFilter=g.LinearFilter,h.image=B.data.cubeTexture.image.slice(),h.needsUpdate=!0,h.mapping=g.CubeRefractionMapping,h.minFilter=g.LinearFilter,mn(),Ze(N),ce(),qe(D,!1)})},20)},G=>{ce()},G=>{console.log("Error loading GLTF"),console.log(G)})}function dn(s,b){B=_[D],m.rotation.copy(B.rotation),Qe(B.position);const w=Ie(B.name),P=new g.CubeTextureLoader(f).load(w,s);P.mapping=g.CubeRefractionMapping,P.minFilter=g.LinearFilter,P.magFilter=g.LinearFilter,P.minFilter=g.LinearFilter,P.anisotropy=U,_[D].data.cubeTexture=P}function Ie(s){const b=[],w="webp";for(let S=1;S<=16;S=S+3){var P;S<10?P=`${ue}spacesDemo/${e}/${t}/Walk0/Hotspot${s}/000${S}.${w}`:P=`${ue}spacesDemo/${e}/${t}/Walk0/Hotspot${s}/00${S}.${w}`,b.push(P)}return b}function Qe(s){m.position.copy(s),m.translateZ(-$.CAMERA_TARGET_OFFSET),a.target.copy(m.position),m.translateZ($.CAMERA_TARGET_OFFSET),m.updateProjectionMatrix()}function mn(){{const s=y.getObjectByName($.HOTSPOT_GROUP_NAME);y.remove(s),Q=new Tn(g,y,_),Q.changeActiveLocation(D)}}function Je(s,b,w){s=Math.round(s,2),s<95&&$e(ke,!0),s>=99&&(k=!0)}X.onProgress=function(s,b,w){const P=b/w*100;Je(P)},C.onProgress=function(s,b,w){const P=b/w*100;Je(P)},C.onLoad=function(){K=!1},f.onProgress=function(s,b,w){},window.onload=function(){};function pn(s,b){const w=Math.PI/2,P=Math.PI/8,S={forward:[38,87],back:[40,83],left:[37,65],right:[39,68],chageMode:[32]},W=function(G){const Y=new g.Vector3;switch(s.getWorldDirection(Y),Y.y=0,G){case"back":Y.multiplyScalar(-1);break;case"left":Y.applyAxisAngle(new g.Vector3(0,1,0),Math.PI/2);break;case"right":Y.applyAxisAngle(new g.Vector3(0,1,0),-Math.PI/2);break}let ee=Math.PI*2,ne,ie=1/0;for(const de in b){const me=new g.Vector3;me.subVectors(b[de].position,s.position).normalize(),me.y=0;const le=me.angleTo(Y);if(!isNaN(le)){const ge=s.position.distanceTo(b[de].position);(le<ee&&le>=P||le<P&&ge<ie)&&(ee=le,ie=ge,ne=de)}}ee<w&&b[ne]!=B&&He(ne)};document.body.onkeyup=function(G){for(const Y in S)if(S[Y].includes(G.keyCode)){W(Y);break}}}}}},mi={id:"RPWebVR",class:"relative w-full h-full object-cover"},pi=pe("div",{id:"load-dummy",class:"text-white"},[pe("div")],-1),hi=pe("div",{id:"tagsUI",style:{position:"absolute",width:"100%"}},null,-1),gi=[pi,hi];function vi(e,t,n,i,o,r){return at(),gn("div",mi,gi)}var yi=ot(di,[["render",vi]]);var $t={};const wi={class:""},bi={class:"text-white my-20"},Mi={id:"test1",class:"content-center mt-10 aspect-video"},Wt=vn({props:{message:String,userId:{type:String,required:!0},projectId:{type:String,required:!0}},setup(e){const t=e;return yn(),wn(),(n,i)=>{const o=yi,r=bn("ClientOnly"),l=hn;return at(),Mn(l,null,{default:rt(()=>[pe("div",wi,[pe("p",bi," Hello there, "+st(t.userId)+" and ur project is "+st(t.projectId)+". ",1),pe("div",Mi,[ct(r,{id:"test1"},{default:rt(()=>[ct(o,xn(_n({"user-id":t.userId,"project-id":t.projectId,"start-scene":"0","start-hotspot":"0"})),null,16)]),_:1})])])]),_:1})}}});typeof $t=="function"&&$t(Wt);var Oi=ot(Wt,[["__scopeId","data-v-207a3da1"]]);export{Oi as default};
