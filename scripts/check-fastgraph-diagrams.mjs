import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {pcaPoints,binPoints,binState,distance,shell,renderPca,renderBins} from '../src/content/fastgraph-diagrams/scene.mjs';
// The illustrated axis really is the first principal component of these samples.
const sum = fn => pcaPoints.reduce((s,p)=>s+fn(p),0);
assert(Math.abs(sum(p=>p.u))<1e-10);
assert(Math.abs(sum(p=>p.v))<1e-10);
assert(Math.abs(sum(p=>p.u*p.v))<1e-10);
assert(sum(p=>p.u*p.u)>sum(p=>p.v*p.v));
for(const a of pcaPoints) for(const b of pcaPoints) {
  assert(Math.abs(a.u-b.u)<=Math.hypot(a.x-b.x,a.y-b.y)+1e-10);
}
assert.equal(Math.hypot(pcaPoints[11].x,pcaPoints[11].y).toFixed(2),'1.71');
assert.equal(pcaPoints[11].u.toFixed(2),'1.60');
// Shells partition the grid: no rescanning, no omitted bins inside the boundary.
const seen=new Set();
for(let step=0;step<=3;step++) {
  let added=0;
  for(let x=0;x<7;x++) for(let y=0;y<7;y++) if(Math.max(Math.abs(x-3),Math.abs(y-3))===step) {
    assert(!seen.has(`${x},${y}`));seen.add(`${x},${y}`);added++;
  }
  assert.equal(added,step===0?1:8*step);
  assert.equal(seen.size,(2*step+1)**2);
}
assert.deepEqual([0,1,2].map(s=>binState(s).stop),[false,false,true]);
const end=binState(2);
assert.deepEqual(end.best.map(p=>p.id),[...binPoints].sort((a,b)=>distance(a)-distance(b)).slice(0,4).map(p=>p.id));
assert.equal(end.radius.toFixed(2),'1.10');
assert(binPoints.filter(p=>shell(p)>2).every(p=>distance(p)>=end.bound && distance(p)>end.radius));
for(const theme of ['light','dark']) for(const step of [0,1,2]) {
  for(const svg of [...renderPca(step,theme),renderBins(step,theme)]) {
    assert(!/NaN|undefined/.test(svg));
    const ids=[...svg.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
    assert.equal(new Set(ids).size,ids.length);
  }
}
for(const name of ['pca','binstepper']) {
  const html=readFileSync(`src/content/fastgraph-diagrams/${name}.html`,'utf8');
  assert(!/__([A-Z]+)__/.test(html));
  new Function(html.match(/<script>([\s\S]*?)<\/script>/)[1]);
}
console.log('Passed: PCA covariance and contraction, shell partition, safe stopping, brute-force neighbors, SVG identities, generated JavaScript.');
// Execute the shipped inline script against a minimal DOM adapter. Exercise real
// event handlers, state changes and appearance propagation without a browser install.
const {runInNewContext}=await import('node:vm');
for(const kind of ['pca','binstepper']) {
  const html=readFileSync(`src/content/fastgraph-diagrams/${kind}.html`,'utf8');
  const elements=new Map(['panels','explanation'].map(id=>[id,{innerHTML:'',textContent:''}]));
  const buttons=[0,1,2].map(step=>({dataset:{step:String(step)},attributes:{},setAttribute(k,v){this.attributes[k]=v;},addEventListener(type,handler){this[type]=handler;}}));
  let dark=false,themeObserver;
  const window={parent:{document:{documentElement:{classList:{contains:()=>dark}}}},addEventListener(){}};
  const document={documentElement:{dataset:{}},getElementById:id=>elements.get(id),querySelectorAll:()=>buttons,querySelector:()=>({getBoundingClientRect:()=>({height:500})})};
  runInNewContext(html.match(/<script>([\s\S]*?)<\/script>/)[1],{
    window,document,matchMedia:()=>({matches:false,addEventListener(){}}),
    MutationObserver:class {constructor(fn){themeObserver=fn;}observe(){}},
    ResizeObserver:class {observe(){}},
  });
  for(const step of [0,1,2,0,2]) {
    buttons[step].click();
    assert.equal(buttons.filter(b=>b.attributes['aria-pressed']==='true').length,1);
    assert.equal(buttons[step].attributes['aria-pressed'],'true');
    assert(!/undefined|NaN/.test(elements.get('panels').innerHTML));
    if(kind==='binstepper') assert(elements.get('explanation').textContent.includes(['only two','eight bins','sixteen bins'][step]));
    else assert(elements.get('explanation').textContent.includes(['Start with','PCA finds','Project onto'][step]));
  }
  dark=true;themeObserver();assert.equal(document.documentElement.dataset.theme,'dark');
  assert(elements.get('panels').innerHTML.includes('#202321'));
}
console.log('Passed: shipped control handlers, selected states, explanations, repeat navigation and inherited dark appearance.');
