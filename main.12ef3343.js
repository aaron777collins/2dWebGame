(()=>{"use strict";var e,t={883:(e,t,n)=>{var i=n(365),r=n(131),a=n(643),o=n(138),s=n(661),c=n(122),d=n(188),m=n(221),l=n(466),p=n.n(l);const u=new i.x,w=new r.i(window.innerWidth/-2,window.innerWidth/2,window.innerHeight/2,window.innerHeight/-2,1,1e3);w.position.z=10;const f=new a.C;f.setSize(window.innerWidth,window.innerHeight),document.body.appendChild(f.domElement);const h=new(p());function g(){h.begin(),function(){v.attacking||(v.flipped=function(){let e=v.flipped;return!A.LEFT||A.UP||A.DOWN?(A.RIGHT||A.UP||A.DOWN)&&(e=!1):e=!0,e}(),A.LEFT?(v.velocity.x=-v.speed,y.currentAnimation="walkRight",y.mostRecentDirection="right"):A.RIGHT&&(v.velocity.x=v.speed,y.currentAnimation="walkRight",y.mostRecentDirection="right"),A.UP?(v.velocity.y=v.speed,y.currentAnimation="walkBack",y.mostRecentDirection="back"):A.DOWN&&(v.velocity.y=-v.speed,y.currentAnimation="walk",y.mostRecentDirection="normal"),A.SPACE&&!v.attacking&&(v.attacking=!0,v.velocity.x/=2,v.velocity.y/=2,setTimeout((()=>{v.attacking=!1}),(y[y.currentAnimation].endFrame-y[y.currentAnimation].startFrame)*y.animationDuration),"normal"===y.mostRecentDirection?y.currentAnimation="attack":"back"===y.mostRecentDirection?y.currentAnimation="attackBack":"right"===y.mostRecentDirection?y.currentAnimation="attackRight":y.currentAnimation="attack")),v.velocity.x*=v.speedFrictionRatio,Math.abs(v.velocity.x)<.1&&(v.velocity.x=0),v.velocity.y*=v.speedFrictionRatio,Math.abs(v.velocity.y)<.1&&(v.velocity.y=0);let e=v.attacking;Object.keys(A).forEach((t=>{A[t]&&(e=!0)})),e||0!==v.velocity.x||0!==v.velocity.y||("normal"===y.mostRecentDirection?y.currentAnimation="idle":"back"===y.mostRecentDirection?y.currentAnimation="idleBack":"right"===y.mostRecentDirection?y.currentAnimation="idleRight":y.currentAnimation="idle"),v.sprite.position.x+=v.velocity.x,v.sprite.position.y+=v.velocity.y}(),k(),h.end(),requestAnimationFrame(g)}function k(){!function(){y.previousAnimation!==y.currentAnimation&&(console.log("Reset"),y.animationTimeOffset=-h.domElement.ownerDocument.defaultView.performance.now()),y.previousAnimation=y.currentAnimation;const e=y[y.currentAnimation];if(e&&(y.animationElapsedTime+=y.animationTimeOffset+h.domElement.ownerDocument.defaultView.performance.now(),y.animationElapsedTime>=y.animationDuration)){const t=e.startFrame+e.framesMissing,n=e.endFrame,i=(t+Math.floor(y.animationElapsedTime/y.animationDuration))%(n-t+1);i>n&&(y.currentAnimation="idle",v.attacking=!1),console.log(i);const r=y.firstFlipID,a=v.flipped?r:0;v.sprite.material.map=v.textures[a+t+i],v.sprite.material.needsUpdate=!0,y.animationElapsedTime=0}}(),f.render(u,w)}window.addEventListener("resize",(function(){w.left=window.innerWidth/-2,w.right=window.innerWidth/2,w.top=window.innerHeight/2,w.bottom=window.innerHeight/-2,w.updateProjectionMatrix(),f.setSize(window.innerWidth,window.innerHeight),k()}),!1);const v={sprite:null,flipped:!1,velocity:new o.F(0,0),speed:3,speedFrictionRatio:.9,textures:[],attacking:!1},y={idle:{startFrame:0,endFrame:5,framesMissing:0},idleRight:{startFrame:6,endFrame:11,framesMissing:0},idleBack:{startFrame:12,endFrame:17,framesMissing:0},walk:{startFrame:18,endFrame:23,framesMissing:0},walkRight:{startFrame:24,endFrame:29,framesMissing:0},walkBack:{startFrame:30,endFrame:35,framesMissing:0},attack:{startFrame:36,endFrame:41,framesMissing:2},attackRight:{startFrame:42,endFrame:47,framesMissing:2},attackBack:{startFrame:48,endFrame:53,framesMissing:2},die:{startFrame:54,endFrame:59,framesMissing:3},mostRecentDirection:"normal",firstFlipID:0,currentAnimation:"idle",previousAnimation:"",animationElapsedTime:0,animationDuration:1e3,animationTimeOffset:0};function F(e,t,n,i=!1){const r=[];for(let i=0;i<n;i++)for(let a=t-1;a>=0;a--){const o=e.clone();o.needsUpdate=!0,o.repeat.set(1/t,1/n),o.offset.set(a/t,i/n),r.push(o)}return r}const A={UP:!1,DOWN:!1,LEFT:!1,RIGHT:!1,SPACE:!1};function b(e){switch(e.code){case"ArrowLeft":A.LEFT=!0,A.RIGHT=!1;break;case"ArrowRight":A.RIGHT=!0,A.LEFT=!1;break;case"ArrowUp":A.UP=!0,A.DOWN=!1;break;case"ArrowDown":A.DOWN=!0,A.UP=!1;break;case"Space":A.SPACE=!0}}function x(e){switch(e.code){case"ArrowLeft":A.LEFT=!1;break;case"ArrowRight":A.RIGHT=!1;break;case"ArrowUp":A.UP=!1;break;case"ArrowDown":A.DOWN=!1;break;case"Space":A.SPACE=!1}}window.addEventListener("DOMContentLoaded",(()=>{document.body.appendChild(h.dom),h.showPanel(0),function(){const e=(new m.d).load("../../static/background.jpg"),t=new c.x({map:e,color:16777215}),n=new d.j(t);n.scale.set(2e3,1e3,1),n.position.set(0,0,-5),u.add(n)}();const e=(new m.d).load("../../static/character.png",(t=>{const n=function(e,t=1,n=1){const i=F(e,t,n).reverse(),r=F(e.clone(),t,n,!0).reverse();r.forEach((e=>{e.wrapS=s.rpg,e.repeat.x=-1*e.repeat.x}));const a=i.concat(r),o=new c.x({map:a[0],color:16777215});o.side=s.ehD,o.transparent=!0;const m=new d.j(o);return m.scale.set(100,100,1),u.add(m),y.firstFlipID=Math.floor(a.length/2),{sprite:m,textures:a}}(e,6,10);v.sprite=n.sprite,v.textures=n.textures,window.addEventListener("keydown",b),window.addEventListener("keyup",x),g()}),(e=>{const t=document.createElement("div");t.style.position="absolute",t.style.top="50%",t.style.left="50%",t.style.transform="translate(-50%, -50%)",t.innerText=`${Math.round(e.loaded/e.total*100)}%`,document.body.appendChild(t)}),(e=>{console.error("Unexpected error while loading texture: ",e);const t=document.createElement("div");t.style.position="absolute",t.style.top="50%",t.style.left="50%",t.style.transform="translate(-50%, -50%)",t.innerText="Unexpected error while loading texture",document.body.appendChild(t)}))}))}},n={};function i(e){var r=n[e];if(void 0!==r)return r.exports;var a=n[e]={exports:{}};return t[e].call(a.exports,a,a.exports,i),a.exports}i.m=t,e=[],i.O=(t,n,r,a)=>{if(!n){var o=1/0;for(m=0;m<e.length;m++){for(var[n,r,a]=e[m],s=!0,c=0;c<n.length;c++)(!1&a||o>=a)&&Object.keys(i.O).every((e=>i.O[e](n[c])))?n.splice(c--,1):(s=!1,a<o&&(o=a));if(s){e.splice(m--,1);var d=r();void 0!==d&&(t=d)}}return t}a=a||0;for(var m=e.length;m>0&&e[m-1][2]>a;m--)e[m]=e[m-1];e[m]=[n,r,a]},i.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return i.d(t,{a:t}),t},i.d=(e,t)=>{for(var n in t)i.o(t,n)&&!i.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},i.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var e={179:0};i.O.j=t=>0===e[t];var t=(t,n)=>{var r,a,[o,s,c]=n,d=0;if(o.some((t=>0!==e[t]))){for(r in s)i.o(s,r)&&(i.m[r]=s[r]);if(c)var m=c(i)}for(t&&t(n);d<o.length;d++)a=o[d],i.o(e,a)&&e[a]&&e[a][0](),e[a]=0;return i.O(m)},n=self.webpackChunk=self.webpackChunk||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))})();var r=i.O(void 0,[374],(()=>i(883)));r=i.O(r)})();