var E=(r=0)=>e=>`\x1B[${e+r}m`,B=(r=0)=>e=>`\x1B[${38+r};5;${e}m`,j=(r=0)=>(e,t,o)=>`\
\x1B[${38+r};2;${e};${t};${o}m`,l={modifier:{reset:[0,0],bold:[1,22],dim:[2,22],
italic:[3,23],underline:[4,24],overline:[53,55],inverse:[7,27],hidden:[8,28],strikethrough:[
9,29]},color:{black:[30,39],red:[31,39],green:[32,39],yellow:[33,39],blue:[34,39],
magenta:[35,39],cyan:[36,39],white:[37,39],blackBright:[90,39],gray:[90,39],grey:[
90,39],redBright:[91,39],greenBright:[92,39],yellowBright:[93,39],blueBright:[94,
39],magentaBright:[95,39],cyanBright:[96,39],whiteBright:[97,39]},bgColor:{bgBlack:[
40,49],bgRed:[41,49],bgGreen:[42,49],bgYellow:[43,49],bgBlue:[44,49],bgMagenta:[
45,49],bgCyan:[46,49],bgWhite:[47,49],bgBlackBright:[100,49],bgGray:[100,49],bgGrey:[
100,49],bgRedBright:[101,49],bgGreenBright:[102,49],bgYellowBright:[103,49],bgBlueBright:[
104,49],bgMagentaBright:[105,49],bgCyanBright:[106,49],bgWhiteBright:[107,49]}},
re=Object.keys(l.modifier),v=Object.keys(l.color),P=Object.keys(l.bgColor),te=[...v,
...P];function G(){let r=new Map;for(let[e,t]of Object.entries(l)){for(let[o,n]of Object.
entries(t))l[o]={open:`\x1B[${n[0]}m`,close:`\x1B[${n[1]}m`},t[o]=l[o],r.set(n[0],
n[1]);Object.defineProperty(l,e,{value:t,enumerable:!1})}return Object.defineProperty(
l,"codes",{value:r,enumerable:!1}),l.color.close="\x1B[39m",l.bgColor.close="\x1B[4\
9m",l.color.ansi=E(),l.color.ansi256=B(),l.color.ansi16m=j(),l.bgColor.ansi=E(10),
l.bgColor.ansi256=B(10),l.bgColor.ansi16m=j(10),Object.defineProperties(l,{rgbToAnsi256:{
value(e,t,o){return e===t&&t===o?e<8?16:e>248?231:Math.round((e-8)/247*24)+232:16+
36*Math.round(e/255*5)+6*Math.round(t/255*5)+Math.round(o/255*5)},enumerable:!1},
hexToRgb:{value(e){let t=/[a-f\d]{6}|[a-f\d]{3}/i.exec(e.toString(16));if(!t)return[
0,0,0];let[o]=t;o.length===3&&(o=[...o].map(i=>i+i).join(""));let n=Number.parseInt(
o,16);return[n>>16&255,n>>8&255,n&255]},enumerable:!1},hexToAnsi256:{value:e=>l.
rgbToAnsi256(...l.hexToRgb(e)),enumerable:!1},ansi256ToAnsi:{value(e){if(e<8)return 30+
e;if(e<16)return 90+(e-8);let t,o,n;if(e>=232)t=((e-232)*10+8)/255,o=t,n=t;else{
e-=16;let f=e%36;t=Math.floor(e/36)/5,o=Math.floor(f/6)/5,n=f%6/5}let i=Math.max(
t,o,n)*2;if(i===0)return 30;let s=30+(Math.round(n)<<2|Math.round(o)<<1|Math.round(
t));return i===2&&(s+=60),s},enumerable:!1},rgbToAnsi:{value:(e,t,o)=>l.ansi256ToAnsi(
l.rgbToAnsi256(e,t,o)),enumerable:!1},hexToAnsi:{value:e=>l.ansi256ToAnsi(l.hexToAnsi256(
e)),enumerable:!1}}),l}var _=G(),g=_;import T from"node:process";import Y from"node:os";import L from"node:tty";function u(r,e=globalThis.
Deno?globalThis.Deno.args:T.argv){let t=r.startsWith("-")?"":r.length===1?"-":"-\
-",o=e.indexOf(t+r),n=e.indexOf("--");return o!==-1&&(n===-1||o<n)}var{env:a}=T,
O;u("no-color")||u("no-colors")||u("color=false")||u("color=never")?O=0:(u("colo\
r")||u("colors")||u("color=true")||u("color=always"))&&(O=1);function K(){if("FO\
RCE_COLOR"in a)return a.FORCE_COLOR==="true"?1:a.FORCE_COLOR==="false"?0:a.FORCE_COLOR.
length===0?1:Math.min(Number.parseInt(a.FORCE_COLOR,10),3)}function D(r){return r===
0?!1:{level:r,hasBasic:!0,has256:r>=2,has16m:r>=3}}function V(r,{streamIsTTY:e,sniffFlags:t=!0}={}){
let o=K();o!==void 0&&(O=o);let n=t?O:o;if(n===0)return 0;if(t){if(u("color=16m")||
u("color=full")||u("color=truecolor"))return 3;if(u("color=256"))return 2}if("TF\
_BUILD"in a&&"AGENT_NAME"in a)return 1;if(r&&!e&&n===void 0)return 0;let i=n||0;
if(a.TERM==="dumb")return i;if(T.platform==="win32"){let s=Y.release().split(".");
return Number(s[0])>=10&&Number(s[2])>=10586?Number(s[2])>=14931?3:2:1}if("CI"in
a)return["GITHUB_ACTIONS","GITEA_ACTIONS","CIRCLECI"].some(s=>s in a)?3:["TRAVIS",
"APPVEYOR","GITLAB_CI","BUILDKITE","DRONE"].some(s=>s in a)||a.CI_NAME==="codesh\
ip"?1:i;if("TEAMCITY_VERSION"in a)return/^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(a.TEAMCITY_VERSION)?
1:0;if(a.COLORTERM==="truecolor"||a.TERM==="xterm-kitty")return 3;if("TERM_PROGR\
AM"in a){let s=Number.parseInt((a.TERM_PROGRAM_VERSION||"").split(".")[0],10);switch(a.
TERM_PROGRAM){case"iTerm.app":return s>=3?3:2;case"Apple_Terminal":return 2}}return/-256(color)?$/i.
test(a.TERM)?2:/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(
a.TERM)||"COLORTERM"in a?1:i}function S(r,e={}){let t=V(r,{streamIsTTY:r&&r.isTTY,
...e});return D(t)}var U={stdout:S({isTTY:L.isatty(1)}),stderr:S({isTTY:L.isatty(
2)})},k=U;function $(r,e,t){let o=r.indexOf(e);if(o===-1)return r;let n=e.length,i=0,s="";
do s+=r.slice(i,o)+e+t,i=o+n,o=r.indexOf(e,i);while(o!==-1);return s+=r.slice(i),
s}function N(r,e,t,o){let n=0,i="";do{let s=r[o-1]==="\r";i+=r.slice(n,s?o-1:o)+
e+(s?`\r
`:`
`)+t,n=o+1,o=r.indexOf(`
`,n)}while(o!==-1);return i+=r.slice(n),i}var{stdout:w,stderr:F}=k,A=Symbol("GENERATOR"),b=Symbol("STYLER"),h=Symbol("IS_E\
MPTY"),I=["ansi","ansi","ansi256","ansi16m"],d=Object.create(null),J=(r,e={})=>{
if(e.level&&!(Number.isInteger(e.level)&&e.level>=0&&e.level<=3))throw new Error(
"The `level` option should be an integer from 0 to 3");let t=w?w.level:0;r.level=
e.level===void 0?t:e.level};var q=r=>{let e=(...t)=>t.join(" ");return J(e,r),Object.setPrototypeOf(e,m.prototype),
e};function m(r){return q(r)}Object.setPrototypeOf(m.prototype,Function.prototype);
for(let[r,e]of Object.entries(g))d[r]={get(){let t=x(this,R(e.open,e.close,this[b]),
this[h]);return Object.defineProperty(this,r,{value:t}),t}};d.visible={get(){let r=x(
this,this[b],!0);return Object.defineProperty(this,"visible",{value:r}),r}};var M=(r,e,t,...o)=>r===
"rgb"?e==="ansi16m"?g[t].ansi16m(...o):e==="ansi256"?g[t].ansi256(g.rgbToAnsi256(
...o)):g[t].ansi(g.rgbToAnsi(...o)):r==="hex"?M("rgb",e,t,...g.hexToRgb(...o)):g[t][r](
...o),W=["rgb","hex","ansi256"];for(let r of W){d[r]={get(){let{level:t}=this;return function(...o){
let n=R(M(r,I[t],"color",...o),g.color.close,this[b]);return x(this,n,this[h])}}};
let e="bg"+r[0].toUpperCase()+r.slice(1);d[e]={get(){let{level:t}=this;return function(...o){
let n=R(M(r,I[t],"bgColor",...o),g.bgColor.close,this[b]);return x(this,n,this[h])}}}}
var H=Object.defineProperties(()=>{},{...d,level:{enumerable:!0,get(){return this[A].
level},set(r){this[A].level=r}}}),R=(r,e,t)=>{let o,n;return t===void 0?(o=r,n=e):
(o=t.openAll+r,n=e+t.closeAll),{open:r,close:e,openAll:o,closeAll:n,parent:t}},x=(r,e,t)=>{
let o=(...n)=>z(o,n.length===1?""+n[0]:n.join(" "));return Object.setPrototypeOf(
o,H),o[A]=r,o[b]=e,o[h]=t,o},z=(r,e)=>{if(r.level<=0||!e)return r[h]?"":e;let t=r[b];
if(t===void 0)return e;let{openAll:o,closeAll:n}=t;if(e.includes("\x1B"))for(;t!==
void 0;)e=$(e,t.close,t.open),t=t.parent;let i=e.indexOf(`
`);return i!==-1&&(e=N(e,n,o,i)),o+e+n};Object.defineProperties(m.prototype,d);var Q=m(),
ge=m({level:F?F.level:0});var c=Q;var p={orange:"#ff8800",gold:"#CDAA35",darkGrey:"#3B3B3B",dark:"#0e0e0e",lightGrey:"\
#C5C5C5",darkPurple:"#6C0BA9",purple:"#A020F0",lightPurple:"#C576F6",darkGreen:"\
#035800"};Object.assign(c,{orange:c.hex(p.orange),gold:c.hex(p.gold),darkGrey:c.
hex(p.darkGrey),dark:c.hex(p.dark),lightGrey:c.hex(p.lightGrey),purple:c.hex(p.darkPurple),
lightPurple:c.hex(p.lightPurple),darkGreen:c.hex("#035800")});function C(r,e,t=0){switch(typeof r){case"string":return e?.quoteStrings?`"${r}"`:
r;case"boolean":case"number":case"undefined":return r.toString();case"function":
return r.toString();case"object":return r===null?"null":Array.isArray(r)?r.length===
0?"[]":X(r,e,t):Object.keys(r).length===0?"{}":Z(r,e,t);default:throw new Error(
`Unsupported object type: ${typeof r}`)}}function X(r,e,t){return`[
${r.map(n=>`${" ".repeat(t+2)}${C(n,e,t+2)}`).join(`,
`)}
${" ".repeat(t)}]`}function Z(r,e,t=0){let o=e?.objectKeyModifier??(s=>s),n=e?.objectValueModifier??
(s=>`${s}`);return`{
${(e?.sortObjectKeys?Object.entries(r).sort(([s],[f])=>s.localeCompare(f)):Object.
entries(r)).map(([s,f])=>f==null||typeof f=="string"||typeof f=="number"||typeof f==
"boolean"?`${" ".repeat(t+2)}${o(s)}: ${n(f)}`:`${" ".repeat(t+2)}${o(s)}: ${C(f,
e,t+2)}`).join(`,
`)}
${" ".repeat(t)}}`}function y(r){let e=c.bold;switch(r){case"info":e=e.blue;break;case"warn":e=e.yellow;
break;case"error":e=e.red;break}return c.dim.gray(e(r))}function xe(r,e={prefix:!0}){
let t=(n,i=e.prefix)=>`${i?`[${c.green(r)}]: `:""}${c.grey(C(n,e))}`;return{info:(...n)=>{
let i=n.flatMap(s=>typeof s=="string"?s.split(`
`):s);if(ee(n)){for(let s of i)console.log(`${y("info")}: ${t(s,e.prefix)}`);return}
console.log(`${y("info")}: ${n.map(s=>t(s,e.prefix)).join(" ")}`)},warn:(...n)=>console.
warn(`${y("warn")}: ${n.map(i=>t(i,e.prefix)).join(" ")}`),error:(...n)=>console.
error(`${y("error")}: ${n.map(i=>t(i,e.prefix)).join(" ")}`),singleError:n=>console.
error(`${y("error")}: ${n.message}`),createLogMessage:t}}function ee(r){return r.
some(e=>typeof e=="string"&&e.includes(`
`))}export{xe as createLogger,y as formatLogLevel};
