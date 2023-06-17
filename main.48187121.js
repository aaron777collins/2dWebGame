(()=>{"use strict";var e,t={196:(e,t,i)=>{i.d(t,{o:()=>T});var n=i(365),a=i(131),r=i(643),o=i(138),s=i(221),c=i(122),l=i(188),m=i(881),d=i(466),p=i.n(d);const h={idle:{startFrame:0,endFrame:5,framesMissing:0},idleRight:{startFrame:6,endFrame:11,framesMissing:0},idleBack:{startFrame:12,endFrame:17,framesMissing:0},walk:{startFrame:18,endFrame:23,framesMissing:0},walkRight:{startFrame:24,endFrame:29,framesMissing:0},walkBack:{startFrame:30,endFrame:35,framesMissing:0},attack:{startFrame:36,endFrame:41,framesMissing:2},attackRight:{startFrame:42,endFrame:47,framesMissing:2},attackBack:{startFrame:48,endFrame:53,framesMissing:2},die:{startFrame:54,endFrame:59,framesMissing:3},mostRecentDirection:"normal",currentAnimation:"idle",previousAnimation:"",animationElapsedTime:0,animationDuration:100,animationTimeOffset:0,x_tiles:6,y_tiles:10};class u{constructor(e){this.character=e}updateAnimations(){this.updateCharacterAnimation()}updateCharacterAnimation(){h.previousAnimation!==h.currentAnimation&&(h.animationTimeOffset=-T.domElement.ownerDocument.defaultView.performance.now()),h.previousAnimation=h.currentAnimation;const e=h[h.currentAnimation];if(e&&(h.animationElapsedTime+=h.animationTimeOffset+T.domElement.ownerDocument.defaultView.performance.now(),h.animationElapsedTime>=h.animationDuration)){const t=e.startFrame,i=e.endFrame,n=(t+Math.floor(h.animationElapsedTime/h.animationDuration)-1)%(i-t+1);if(n>=i-t+1-e.framesMissing)return this.character.attacking=!1,"right"===h.mostRecentDirection?h.currentAnimation="idleRight":"back"===h.mostRecentDirection?h.currentAnimation="idleBack":h.currentAnimation="idle",void this.updateCharacterAnimation();this.character.flipped?(this.character.sprite.material.map=this.character.textures[i-n],this.character.sprite.material.map.offset.x=-1*Math.abs(this.character.sprite.material.map.offset.x),this.character.sprite.material.map.repeat.x=-1*Math.abs(this.character.sprite.material.map.repeat.x)):(this.character.sprite.material.map=this.character.textures[t+n],this.character.sprite.material.map.offset.x=Math.abs(this.character.sprite.material.map.offset.x),this.character.sprite.material.map.repeat.x=Math.abs(this.character.sprite.material.map.repeat.x)),this.character.sprite.material.needsUpdate=!0,h.animationElapsedTime=0}}}var w,f=i(661);function k(e,t,i,n=!1){const a=[];for(let n=0;n<i;n++)for(let r=t-1;r>=0;r--){const o=e.clone();o.needsUpdate=!0,o.repeat.set(1/t,1/i),o.offset.set(r/t,n/i),a.push(o)}return a}class y{constructor(e,t){this.blockAnimation=e,this.blockType=t}setSprite(e){this.sprite=e}updateBlock(){this.blockAnimation.updateAnimation(this.sprite)}}!function(e){e[e.Solid=0]="Solid",e[e.NonSolid=1]="NonSolid",e[e.NonSolidAndNonVisible=2]="NonSolidAndNonVisible",e[e.NonSolidAndNonVisibleAndNonCollidable=3]="NonSolidAndNonVisibleAndNonCollidable"}(w||(w={}));class g{constructor(e,t,i,n,a){this.startFrame=e,this.endFrame=t,this.framesMissing=i,this.animationElapsedTime=0,this.animationDuration=n,this.animationTimeOffset=0,this.textures=a}updateAnimation(e){const t={startFrame:this.startFrame,endFrame:this.endFrame,framesMissing:this.framesMissing};if(t){if(!this.textures)throw console.log("No block textures"),new Error("No block textures");if(this.animationElapsedTime+=this.animationTimeOffset+T.domElement.ownerDocument.defaultView.performance.now(),this.animationElapsedTime>=this.animationDuration){const i=t.startFrame,n=t.endFrame,a=(i+Math.floor(this.animationElapsedTime/this.animationDuration)-1)%(n-i+1);if(a>=n-i+1-t.framesMissing)return this.animationElapsedTime=0,void this.updateAnimation(e);this.texture=this.textures[i+a],this.texture.offset.x=Math.abs(this.texture.offset.x),this.texture.repeat.x=Math.abs(this.texture.repeat.x),this.texture.needsUpdate=!0,this.animationElapsedTime=0,e.material.map=this.texture}}}}let b,x=0,A=0;const v=new class{constructor(){this.blockAnimationMap=new Map,this.blockTypeMap=new Map,this.blocks=[]}createBlock(e,t){const i=new y(e,t);return this.blocks.push(i),i}updateBlocks(){for(const e of this.blocks)e.updateBlock()}async createBlockAnimationMap(){let e=new Promise(((e,t)=>{(new s.d).load("static/blocks.png",(function(t){e(t)}))}));const t=k(await e,5,2).reverse();t.forEach((e=>{e.wrapS=f.rpg}));const i=new g(0,4,0,1e3,t);this.blockAnimationMap.set("grass1",i);const n=new g(5,9,0,1e3,t);this.blockAnimationMap.set("grass2",n)}createBlockTypeMap(){this.blockTypeMap.set("grass1",w.Solid),this.blockTypeMap.set("grass2",w.Solid)}createBlockInstance(e,t,i){const n=this.blockAnimationMap.get(e),a=this.blockTypeMap.get(e),r=this.createBlock(n,a),o=new c.x({map:r.blockAnimation.texture,color:16777215});o.side=f.ehD,o.transparent=!0;const s=new l.j(o);return s.scale.set(50,50,1),r.setSprite(s),s.position.set(i.x,i.y,i.z),t.add(s),r}},F=new n.x,M=new a.i(window.innerWidth/-2,window.innerWidth/2,window.innerHeight/2,window.innerHeight/-2,1,1e3);M.position.z=10;const E=new r.C;E.setSize(window.innerWidth,window.innerHeight),document.body.appendChild(E.domElement);const T=new(p());function D(e){if(x=(e-A)/1e3,e<A+1e3/120)return function(e){!function(e){if(!O.attacking){O.flipped=function(){let e=O.flipped;return!S.LEFT||S.UP||S.DOWN?(S.RIGHT||S.UP||S.DOWN)&&(e=!1):e=!0,e}();let t=O.speed*e;S.LEFT?(O.velocity.x=-t,h.currentAnimation="walkRight",h.mostRecentDirection="right"):S.RIGHT&&(O.velocity.x=t,h.currentAnimation="walkRight",h.mostRecentDirection="right"),S.UP?(O.velocity.y=t,h.currentAnimation="walkBack",h.mostRecentDirection="back"):S.DOWN&&(O.velocity.y=-t,h.currentAnimation="walk",h.mostRecentDirection="normal"),S.SPACE&&!O.attacking&&(O.attacking=!0,console.log(2*e),O.velocity.x/=O.slowDownCoefficientOnAttack*(1+e),O.velocity.y/=O.slowDownCoefficientOnAttack*(1+e),"normal"===h.mostRecentDirection?h.currentAnimation="attack":"back"===h.mostRecentDirection?h.currentAnimation="attackBack":"right"===h.mostRecentDirection?h.currentAnimation="attackRight":h.currentAnimation="attack")}O.velocity.x*=O.speedFrictionRatio*(1-e),Math.abs(O.velocity.x)<.01*e&&(O.velocity.x=0),O.velocity.y*=O.speedFrictionRatio*(1-e),Math.abs(O.velocity.y)<.01*e&&(O.velocity.y=0);let t=O.attacking;Object.keys(S).forEach((e=>{S[e]&&(t=!0)})),t||0!==O.velocity.x||0!==O.velocity.y||("normal"===h.mostRecentDirection?h.currentAnimation="idle":"back"===h.mostRecentDirection?h.currentAnimation="idleBack":"right"===h.mostRecentDirection?h.currentAnimation="idleRight":h.currentAnimation="idle"),O.sprite.position.x+=O.velocity.x,O.sprite.position.y+=O.velocity.y}(e)}(x),void window.requestAnimationFrame(D);A=e,T.begin(),R(),T.end(),window.requestAnimationFrame(D)}function R(){b.updateAnimations(),v.updateBlocks(),E.render(F,M)}window.addEventListener("resize",(function(){M.left=window.innerWidth/-2,M.right=window.innerWidth/2,M.top=window.innerHeight/2,M.bottom=window.innerHeight/-2,M.updateProjectionMatrix(),E.setSize(window.innerWidth,window.innerHeight),R()}),!1);const O={sprite:null,flipped:!1,velocity:new o.F(0,0),speed:100,speedFrictionRatio:.9,textures:[],attacking:!1,slowDownCoefficientOnAttack:.1},S={UP:!1,DOWN:!1,LEFT:!1,RIGHT:!1,SPACE:!1};function B(e){switch(e.code){case"ArrowLeft":S.LEFT=!0,S.RIGHT=!1;break;case"ArrowRight":S.RIGHT=!0,S.LEFT=!1;break;case"ArrowUp":S.UP=!0,S.DOWN=!1;break;case"ArrowDown":S.DOWN=!0,S.UP=!1;break;case"Space":S.SPACE=!0}}function C(e){switch(e.code){case"ArrowLeft":S.LEFT=!1;break;case"ArrowRight":S.RIGHT=!1;break;case"ArrowUp":S.UP=!1;break;case"ArrowDown":S.DOWN=!1;break;case"Space":S.SPACE=!1}}function N(){document.getElementById("help-text").style.display="none",window.removeEventListener("keydown",N)}window.addEventListener("DOMContentLoaded",(()=>{!function(){const e=document.createElement("div");e.innerHTML="Use the arrow keys to move and space to attack",e.style.position="absolute",e.style.top="50%",e.style.left="50%",e.style.transform="translate(-50%, -50%)",e.style.color="white",e.style.fontSize="20px",e.style.fontFamily="sans-serif",e.style.zIndex="1",e.id="help-text",document.body.appendChild(e),window.addEventListener("keydown",N)}(),document.body.appendChild(T.dom),T.showPanel(0),function(){const e=(new s.d).load("static/background.jpg"),t=new c.x({map:e,color:16777215}),i=new l.j(t);i.scale.set(2e3,1e3,1),i.position.set(0,0,-5),F.add(i)}();const e=(new s.d).load("static/character.png",(async t=>{const i=function(e,t,i=1,n=1){const a=k(e,i,n).reverse();a.forEach((e=>{e.wrapS=f.rpg}));const r=new c.x({map:a[0],color:16777215});r.side=f.ehD,r.transparent=!0;const o=new l.j(r);return o.scale.set(100,100,1),t.add(o),{sprite:o,textures:a}}(e,F,h.x_tiles,h.y_tiles);O.sprite=i.sprite,O.textures=i.textures,window.addEventListener("keydown",B),window.addEventListener("keyup",C),b=new u(O),await v.createBlockAnimationMap(),v.createBlockTypeMap(),v.createBlockInstance("grass1",F,new m.P(-150,0,-1)),v.createBlockInstance("grass2",F,new m.P(-150,-50,-1)),window.requestAnimationFrame(D)}),(e=>{const t=document.createElement("div");t.style.position="absolute",t.style.top="50%",t.style.left="50%",t.style.transform="translate(-50%, -50%)",t.innerText=`${Math.round(e.loaded/e.total*100)}%`,document.body.appendChild(t)}),(e=>{console.error("Unexpected error while loading texture: ",e);const t=document.createElement("div");t.style.position="absolute",t.style.top="50%",t.style.left="50%",t.style.transform="translate(-50%, -50%)",t.innerText="Unexpected error while loading texture",document.body.appendChild(t)}))}))}},i={};function n(e){var a=i[e];if(void 0!==a)return a.exports;var r=i[e]={exports:{}};return t[e].call(r.exports,r,r.exports,n),r.exports}n.m=t,e=[],n.O=(t,i,a,r)=>{if(!i){var o=1/0;for(m=0;m<e.length;m++){for(var[i,a,r]=e[m],s=!0,c=0;c<i.length;c++)(!1&r||o>=r)&&Object.keys(n.O).every((e=>n.O[e](i[c])))?i.splice(c--,1):(s=!1,r<o&&(o=r));if(s){e.splice(m--,1);var l=a();void 0!==l&&(t=l)}}return t}r=r||0;for(var m=e.length;m>0&&e[m-1][2]>r;m--)e[m]=e[m-1];e[m]=[i,a,r]},n.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return n.d(t,{a:t}),t},n.d=(e,t)=>{for(var i in t)n.o(t,i)&&!n.o(e,i)&&Object.defineProperty(e,i,{enumerable:!0,get:t[i]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var e={179:0};n.O.j=t=>0===e[t];var t=(t,i)=>{var a,r,[o,s,c]=i,l=0;if(o.some((t=>0!==e[t]))){for(a in s)n.o(s,a)&&(n.m[a]=s[a]);if(c)var m=c(n)}for(t&&t(i);l<o.length;l++)r=o[l],n.o(e,r)&&e[r]&&e[r][0](),e[r]=0;return n.O(m)},i=self.webpackChunk=self.webpackChunk||[];i.forEach(t.bind(null,0)),i.push=t.bind(null,i.push.bind(i))})();var a=n.O(void 0,[374],(()=>n(196)));a=n.O(a)})();