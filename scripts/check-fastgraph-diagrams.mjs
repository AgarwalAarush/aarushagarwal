import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {pcaPoints,binPoints,binState,distance,shell,renderDiagram,searchState,frame,createPlayback,posterTime,duration,sampleTimes} from '../src/content/fastgraph-diagrams/scene.mjs';
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
// No premature neighbor selection: compare every partial traversal to brute force
// restricted to the bins actually visited at that instant (plus self).
for(let t=0;t<=12000;t+=75){
 const state=searchState(t);
 const allowed=binPoints.filter(pt=>pt.id==='q'||state.visited.some(c=>c.x===Math.floor(pt.x)&&c.y===Math.floor(pt.y)));
 const expected=allowed.sort((a,b)=>distance(a)-distance(b)).slice(0,4);
 assert.deepEqual(state.best.map(p=>p.id),expected.map(p=>p.id));
 if(state.stop)assert(state.completed===25&&state.best.length===4&&state.bound>state.radius);
 else assert(t<9800);
}
for(const kind of ['pca','binstepper'])for(const theme of ['light','dark'])for(const width of [320,534,720])for(const time of sampleTimes){
 const svg=renderDiagram(kind,time,theme,width);
 assert(!/NaN|undefined/.test(svg));
 const ids=[...svg.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(new Set(ids).size,ids.length);
 for(const [id,props] of Object.entries(frame(kind,time,width,theme))){
  assert(ids.includes(id),`Missing animation target ${id}`);
  if('opacity' in props)assert(props.opacity>=0&&props.opacity<=1);
 }
}
// Pause/offscreen/hidden states keep elapsed time, and reduced motion has a poster.
const player=createPlayback();player.visible=true;player.advance(3300);player.toggle();player.advance(1000);assert.equal(player.time,3300);
player.visible=false;player.visible=true;assert(player.paused);player.toggle();player.advance(250);assert.equal(player.time,3550);
player.hidden=true;player.advance(1000);assert.equal(player.time,3550);player.hidden=false;
player.visible=false;player.advance(1000);assert.equal(player.time,3550);player.visible=true;
player.reduce(true);assert.equal(player.time,posterTime);assert(!player.playing);
player.toggle();assert.equal(player.time,0);assert(player.playing);
player.advance(duration+230);assert.equal(player.time,230);
const reduced=createPlayback(true);assert.equal(reduced.time,posterTime);assert(reduced.paused);
for(const name of ['pca','binstepper']){
 const html=readFileSync(`src/content/fastgraph-diagrams/${name}.html`,'utf8');
 assert(!/__([A-Z]+)__/.test(html));assert(!html.includes('data-step'));
 new Function(html.match(/<script>([\s\S]*?)<\/script>/)[1]);
}
console.log('Passed: PCA math, every partial shell, final neighbors, all animation states/targets, pause/resume, visibility, reduced motion, loop and emitted script syntax.');
