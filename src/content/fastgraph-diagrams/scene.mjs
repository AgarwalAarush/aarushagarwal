// Source-grounded, deterministic teaching scenes. Coordinates are illustrative.
export const scene = {
  version: 2,
  sourceRevision: 'ad4392eee16734a1001e82764a13144379d931e9',
  sources: {
    pca: 'fastgraphcompute/extensions/binned_select_knn.py#L13-L39',
    shells: 'fastgraphcompute/extensions/binstepper.h#L43-L104',
    stop: 'fastgraphcompute/extensions/binned_select_knn_cuda_kernel.cu#L210-L283',
  },
  pca: {
    claim: 'An orthonormal PCA projection creates an index; full-space distances still rank candidates.',
    objects: ['original-points', 'query', 'candidate', 'principal-axis', 'projected-points', 'bins', 'full-distance', 'projected-distance'],
    beats: ['Original features', 'Find the PCA axis', 'Project into bins'],
    scope: 'Illustrative 2D to 1D projection for readability. The library uses at least two binning dimensions; the page benchmark uses 8D to 3D.',
    omissions: ['Subsampling', 'FP32 tolerances', 'CUDA execution'],
    invariant: 'Every projected pairwise distance is at most its full-space distance.',
  },
  binstepper: {
    claim: 'Visit each new shell boundary once; stop only after filling K and passing the conservative distance bound.',
    objects: ['query-bin', 'shell-0', 'shell-1', 'shell-2', 'unvisited-bins', 'top-k', 'radius', 'lower-bound'],
    beats: ['Query bin', 'First shell', 'Second shell · stop'],
    scope: 'One query in a 7 by 7 grid, bin width 1, K=4 including self. The animation follows one query; timing is illustrative, not GPU performance.',
    omissions: ['Direction constraints', 'Ragged graph offsets', 'Concurrent GPU queries'],
    invariant: 'At stop, all unvisited points are farther than the farthest retained neighbor.',
  },
};

export const pcaPoints = [
  [-2.6,0],[-2.2,.24],[-2,-.264],[-1.6,.6],[-1.1,-.96/1.1],[-.75,.18],[-.4,-.3375],
  [0,0],[.4,.3375],[.75,-.18],[1.1,.96/1.1],[1.6,-.6],[2,.264],[2.2,-.24],[2.6,0],
].map(([u,v],i) => ({id:`point-${i}`,u,v,x:.8*u-.6*v,y:.6*u+.8*v}));

export const query = {id:'q',x:3.5,y:3.5};
export const binPoints = [query,
  {id:'a',x:3.75,y:3.65},{id:'b',x:4.3,y:3.65},{id:'c',x:3.6,y:4.6},{id:'d',x:2.3,y:3.8},
  {id:'e',x:4.65,y:2.25},{id:'f',x:2.15,y:2.4},{id:'g',x:5.2,y:3.9},{id:'h',x:1.6,y:4.1},
  {id:'i',x:2.8,y:5.3},{id:'j',x:4.4,y:1.35},{id:'k',x:5.5,y:5.7},{id:'l',x:.6,y:3.2},
  {id:'m',x:6.4,y:4.1},{id:'n',x:2.4,y:.5},{id:'o',x:4.3,y:6.4},{id:'p',x:.7,y:.8},
  {id:'r',x:6.2,y:6.3},{id:'s',x:.8,y:5.2},{id:'t',x:5.9,y:.6},
];
export const distance = pt => Math.hypot(pt.x-query.x,pt.y-query.y);
export const shell = pt => Math.max(Math.abs(Math.floor(pt.x)-3),Math.abs(Math.floor(pt.y)-3));
export function binState(step) {
  const visited=binPoints.filter(pt=>shell(pt)<=step);
  const best=[...visited].sort((a,b)=>distance(a)-distance(b)).slice(0,4);
  const filled=best.length===4;
  const radius=filled?distance(best[3]):null;
  return {visited,best,filled,radius,bound:step,stop:filled && step>radius,newBins:step===0?1:8*step,visitedBins:(2*step+1)**2};
}

export const duration=14000;
export const posterTime=11500;
export const palettes={
  light:{bg:'#faf9f6',ink:'#242924',muted:'#70766e',line:'#d9ddd5',grid:'#e5e8e1',dot:'#7f897b',accent:'#b75430',tint:'#f2dfd3',teal:'#286c59',wash:'#e8eee7'},
  dark:{bg:'#20231f',ink:'#f0f2e9',muted:'#aeb7a7',line:'#475043',grid:'#363e32',dot:'#a5b19d',accent:'#e9a481',tint:'#4b3529',teal:'#9bc7ac',wash:'#2e4032'},
};
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const lerp=(a,b,t)=>a+(b-a)*t;
const round=x=>Number(x.toFixed(3));
// cubic-bezier(.77, 0, .175, 1), shared explanation-motion easing.
export function ease(x) {
  x=clamp(x); let lo=0,hi=1,t=x;
  const cubic=(t,a,b)=>3*(1-t)*(1-t)*t*a+3*(1-t)*t*t*b+t*t*t;
  for(let i=0;i<16;i++){t=(lo+hi)/2;if(cubic(t,.77,.175)<x)lo=t;else hi=t;}
  return cubic(t,0,1);
}
const progress=(t,start,end)=>ease((t-start)/(end-start));
const escapeText=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
export function layout(kind,width=720) {
  const w=Math.max(280,Math.min(920,width)),narrow=w<560;
  if(kind==='pca') return {w,h:narrow?568:342,narrow,a:{x:narrow?w/2:w*.25,y:154},b:{x:narrow?w/2:w*.75,y:narrow?418:154},scale:Math.min(52,(narrow?w:w/2)/6.7)};
  const size=Math.min(narrow?w-42:w*.55-28,322),x=16,y=34;
  return {w,h:narrow?size+335:408,narrow,size,x,y,cx:x+size/2,cy:y+size/2,s:size/7,rx:narrow?18:w*.60,ry:narrow?size+82:58};
}
export const cells=Array.from({length:3},(_,d)=>{
  const row=[];
  for(let x=0;x<7;x++)for(let y=0;y<7;y++)if(Math.max(Math.abs(x-3),Math.abs(y-3))===d)row.push({x,y,d,id:`cell-${x}-${y}`});
  return row;
}).flat();
// A bin is committed after its inspection interval. The highlighted bin is current.
export function searchState(time) {
  const completed=time<1000?0:time<2000?1:time<5000?1+Math.floor((time-2000)/375):time<9800?9+Math.floor((time-5000)/300):25;
  const visited=cells.slice(0,completed);
  const seen=binPoints.filter(pt=>pt.id==='q'||visited.some(c=>c.x===Math.floor(pt.x)&&c.y===Math.floor(pt.y)));
  const best=[...seen].sort((a,b)=>distance(a)-distance(b)).slice(0,4);
  const radius=best.length===4?distance(best[3]):null;
  const bound=completed>=25?2:completed>=9?1:0;
  return {completed,visited,best,radius,bound,stop:completed===25&&bound>radius,active:completed<25?cells[completed]:null};
}
export function stateAt(kind,time) {
  if(kind==='pca') return {axis:progress(time,1000,2000),project:progress(time,2400,4400),transfer:progress(time,5000,7200),bins:progress(time,6900,7700),compare:progress(time,8000,9000)};
  return searchState(time);
}
export function caption(kind,time) {
  if(kind==='pca') return time<2200?'Find the direction that captures the cloud’s structure.':time<5000?'Project copies of the points onto the PCA axis. Keep the original features.':time<7900?'Use the projected coordinates to place points into spatial bins.':'Search with projected bounds. Rank neighbors with full-space distances.';
  const s=searchState(time);
  return s.stop?'The bound exceeds the neighbor radius. The outer 24 bins can be skipped.':s.completed>=9?'The first shell is not enough to stop. Inspect only the next boundary.':s.completed>=1?'Expand through neighboring bins and keep the closest candidates.':'Start with the query’s bin. The query itself occupies the first neighbor slot.';
}

// Every animated property belongs to a stable SVG object. The browser updates
// transforms, opacity and semantic text in place; it never rebuilds the diagram per frame.
export function frame(kind,time,width=720,theme='light') {
  const p=palettes[theme],l=layout(kind,width),out={};
  const set=(id,attrs)=>{out[id]=attrs;};
  const fade=time>13300?1-progress(time,13300,14000):time<400?progress(time,0,400):1;
  set('scene-content',{opacity:round(fade)});
  if(kind==='pca') {
    const s=stateAt(kind,time),a=l.a,b=l.b,k=l.scale;
    set('principal-axis',{opacity:round(s.axis)});
    set('axis-label',{opacity:round(s.axis*(1-s.transfer))});
    // Hide the axis label only while the projected cloud crosses its region.
    set('x-axis-label',{opacity:round(1-progress(time,4900,5100)+progress(time,7200,7500))});
    set('index-label',{opacity:round(s.bins)});
    set('index-point-labels',{opacity:round(progress(time,7300,7800))});
    set('index-grid',{opacity:round(s.bins)});
    set('original-distance',{opacity:round(s.compare)});
    set('distance-note',{opacity:round(s.compare)});
    set('index-distance',{opacity:round(s.compare)});
    set('index-distance-note',{opacity:round(s.compare)});
    set('distance-comparison',{opacity:round(s.compare)});
    set('projection-lines',{opacity:round(s.project*(1-s.transfer))});
    for(const pt of pcaPoints) {
      const sx=a.x+pt.x*k,sy=a.y-pt.y*k;
      const px=a.x+.8*pt.u*k,py=a.y-.6*pt.u*k;
      const tx=b.x+pt.u*k,ty=b.y;
      const x=lerp(lerp(sx,px,s.project),tx,s.transfer),y=lerp(lerp(sy,py,s.project),ty,s.transfer);
      set(`moving-${pt.id}`,{transform:`translate(${round(x)} ${round(y)})`,opacity:round(progress(time,2200,2550))});
    }
  } else {
    const s=searchState(time),visited=new Set(s.visited.map(c=>c.id)),k=l.s;
    for(let x=0;x<7;x++)for(let y=0;y<7;y++) {
      const id=`cell-${x}-${y}`,active=s.active?.id===id;
      set(id,{fill:visited.has(id)?(s.stop?p.wash:p.tint):p.bg,stroke:active?p.accent:p.grid,'stroke-width':active?2:1});
    }
    for(const pt of binPoints) {
      const best=s.best.some(b=>b.id===pt.id),seen=s.visited.some(c=>c.x===Math.floor(pt.x)&&c.y===Math.floor(pt.y));
      set(`point-${pt.id}`,{fill:pt.id==='q'?p.accent:best?p.teal:seen?p.dot:p.line});
      if(pt.id!=='q')set(`neighbor-${pt.id}`,{opacity:best?1:0});
    }
    set('radius',{opacity:s.radius===null?0:1,transform:`translate(${round(l.cx)} ${round(l.cy)}) scale(${round((s.radius||1)*k)})`});
    set('bound',{opacity:round(progress(time,9800,10400)),transform:`translate(${round(l.cx)} ${round(l.cy)}) scale(${round(2*k)})`});
    set('stop-equation',{opacity:round(progress(time,10400,11000))});
    set('stop-detail',{opacity:round(progress(time,10400,11000))});
    set('bins-count',{'text':`${s.completed} / 49 bins inspected`});
    for(let i=0;i<4;i++) {
      const pt=s.best[i];
      set(`slot-id-${i}`,{text:pt?pt.id:'—',fill:pt?p.ink:p.muted});
      set(`slot-distance-${i}`,{text:pt?distance(pt).toFixed(2):'—',fill:pt?p.ink:p.muted});
    }
    set('radius-description',{text:s.radius===null?'Neighbor set still incomplete':`Farthest retained distance: ${s.radius.toFixed(2)}`});
  }
  return out;
}
function diagram(kind,width,theme,time) {
  const p=palettes[theme],l=layout(kind,width),updates=frame(kind,time,width,theme);
  const tag=(name,id,attrs={},text='')=>{
    const props={...attrs,...(updates[id]||{})};const copy=props.text??text;delete props.text;
    return `<${name}${id?` id="${id}"`:''}${Object.entries(props).map(([key,value])=>` ${key}="${escapeText(value)}"`).join('')}>${copy?escapeText(copy):''}</${name}>`;
  };
  const text=(id,x,y,value,attrs={})=>tag('text',id,{x:round(x),y:round(y),fill:p.ink,'font-size':14,'font-family':'Inter, Arial, sans-serif',...attrs},value);
  const line=(id,x1,y1,x2,y2,attrs={})=>tag('line',id,{x1:round(x1),y1:round(y1),x2:round(x2),y2:round(y2),stroke:p.line,...attrs});
  const dot=(id,x,y,fill,r=4,attrs={})=>tag('circle',id,{cx:round(x),cy:round(y),r,fill,...attrs});
  const group=(id,children,attrs={})=>`<g id="${id}" ${Object.entries({...attrs,...updates[id]}).map(([k,v])=>`${k}="${escapeText(v)}"`).join(' ')}>${children}</g>`;
  const label=(id,x,y,value,attrs={})=>text(id,x,y,value,{'font-family':'JetBrains Mono, monospace','font-size':10.5,'letter-spacing':1.2,fill:p.muted,...attrs});
  let body='';
  if(kind==='pca') {
    const {a,b,scale:k}=l;
    body+=label('features-label',18,24,'ORIGINAL FEATURES');
    body+=label('index-label',l.narrow?18:l.w*.52,l.narrow?304:24,'PCA SEARCH INDEX');
    body+=line('',a.x-k*2.9,a.y,a.x+k*2.9,a.y)+line('',a.x,a.y-k*2.35,a.x,a.y+k*2.35);
    body+=text('x-axis-label',a.x+k*2.8,a.y+20,'x₁',{'font-family':'Georgia, serif','font-size':15,fill:p.muted});
    body+=text('',a.x+10,a.y-k*2.15,'x₂',{'font-family':'Georgia, serif','font-size':15,fill:p.muted});
    body+=line('principal-axis',a.x-k*2.8*.8,a.y+k*2.8*.6,a.x+k*2.8*.8,a.y-k*2.8*.6,{stroke:p.teal,'stroke-width':1.5});
    body+=label('axis-label',a.x+k*.95,a.y-k*1.9,'PC1',{fill:p.teal});
    let guides='';
    for(const pt of pcaPoints)guides+=line('',a.x+pt.x*k,a.y-pt.y*k,a.x+.8*pt.u*k,a.y-.6*pt.u*k,{stroke:p.teal,'stroke-dasharray':'2 5',opacity:.45});
    body+=group('projection-lines',guides);
    let bins='';
    for(let i=0;i<6;i++){
      bins+=tag('rect','',{x:round(b.x+(i-3)*k),y:b.y-38,width:round(k),height:76,rx:0,fill:i===3?p.wash:p.bg,stroke:p.line});
      bins+=label('',b.x+(i-2.5)*k,b.y+62,String(i),{'text-anchor':'middle','letter-spacing':0});
    }
    bins+=line('',b.x-3*k,b.y,b.x+3*k,b.y,{stroke:p.teal,'stroke-width':1});
    body+=group('index-grid',bins);
    const candidate=pcaPoints[11];
    body+=line('original-distance',a.x,a.y,a.x+candidate.x*k,a.y-candidate.y*k,{stroke:p.accent,'stroke-width':2});
    for(const pt of pcaPoints) body+=dot(`original-${pt.id}`,a.x+pt.x*k,a.y-pt.y*k,pt.id===candidate.id?p.accent:pt.id==='point-7'?p.ink:p.dot,pt.id===candidate.id?5:3.5);
    body+=text('',a.x+9,a.y+20,'q',{'font-family':'Georgia, serif','font-style':'italic'});
    body+=text('',a.x+candidate.x*k+9,a.y-candidate.y*k+4,'p',{'font-family':'Georgia, serif','font-style':'italic'});
    for(const pt of pcaPoints)body+=dot(`moving-${pt.id}`,0,0,pt.id===candidate.id?p.accent:p.teal,pt.id===candidate.id?5:3.5,{stroke:p.bg,'stroke-width':1});
    body+=group('index-distance',line('',b.x,b.y-69,b.x+1.6*k,b.y-69,{stroke:p.teal,'stroke-width':2})+line('',b.x,b.y-74,b.x,b.y-64,{stroke:p.teal})+line('',b.x+1.6*k,b.y-74,b.x+1.6*k,b.y-64,{stroke:p.teal}));
    body+=group('index-point-labels',text('',b.x,b.y+23,'q',{'font-family':'Georgia, serif','font-style':'italic','text-anchor':'middle'})+text('',b.x+1.6*k,b.y+23,'p',{'font-family':'Georgia, serif','font-style':'italic','text-anchor':'middle'}));
    body+=text('index-distance-note',b.x+.8*k,b.y-82,'1.60',{'font-family':'Georgia, serif','font-size':21,'text-anchor':'middle',fill:p.teal});
    body+=text('distance-note',a.x,a.y+132,'Original distance  1.71',{'text-anchor':'middle',fill:p.muted,'font-size':13});
    body+=text('distance-comparison',b.x,b.y+132,'1.60 ≤ 1.71',{'text-anchor':'middle','font-family':'Georgia, serif','font-size':27,fill:p.teal});
  } else {
    const {s:k,x:ox,y:oy,size,rx,ry}=l;const X=x=>ox+x*k,Y=y=>oy+(7-y)*k;
    body+=label('',ox,17,'BIN SPACE');
    for(let x=0;x<7;x++)for(let y=0;y<7;y++) body+=tag('rect',`cell-${x}-${y}`,{x:round(X(x)),y:round(Y(y+1)),width:round(k),height:round(k),fill:p.bg,stroke:p.grid});
    for(const pt of binPoints)if(pt.id!=='q')body+=line(`neighbor-${pt.id}`,l.cx,l.cy,X(pt.x),Y(pt.y),{stroke:p.teal,'stroke-width':1.6});
    body+=tag('circle','radius',{cx:0,cy:0,r:1,fill:'none',stroke:p.teal,'stroke-width':1.5,'vector-effect':'non-scaling-stroke'});
    body+=tag('circle','bound',{cx:0,cy:0,r:1,fill:'none',stroke:p.accent,'stroke-dasharray':'4 4','stroke-width':1.3,'vector-effect':'non-scaling-stroke'});
    for(const pt of binPoints)body+=dot(`point-${pt.id}`,X(pt.x),Y(pt.y),p.dot,pt.id==='q'?5.5:3.8);
    body+=text('',l.cx-15,l.cy+20,'q',{'font-family':'Georgia, serif','font-style':'italic'});
    body+=label('bins-count',ox,oy+size+28,'');
    body+=label('',rx,ry,'NEAREST SO FAR · K = 4');
    const slotsWidth=l.narrow?l.w-36:l.w-rx-16,slot=slotsWidth/4;
    for(let i=0;i<4;i++){
      body+=line('',rx+i*slot,ry+14,rx+i*slot+slot-8,ry+14);
      body+=text(`slot-id-${i}`,rx+i*slot+4,ry+43,'',{'font-family':'Georgia, serif','font-style':'italic','font-size':24});
      body+=text(`slot-distance-${i}`,rx+i*slot+4,ry+67,'',{'font-family':'JetBrains Mono, monospace','font-size':12,fill:p.muted});
    }
    body+=text('radius-description',rx,ry+103,'',{'font-size':12,fill:p.muted});
    body+=group('stop-equation',label('',rx,ry+156,'SAFE TO STOP',{fill:p.teal})+text('',rx,ry+200,'2.00 > 1.10',{'font-family':'Georgia, serif','font-size':l.narrow?34:Math.min(36,(l.w-rx)/7),fill:p.teal}));
    body+=text('stop-detail',rx,ry+225,'lower bound > neighbor radius',{'font-size':12,fill:p.muted});
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${l.w}" height="${l.h}" viewBox="0 0 ${l.w} ${l.h}" role="img" aria-labelledby="diagram-title"><title id="diagram-title">${escapeText(kind==='pca'?scene.pca.claim:scene.binstepper.claim)}</title><rect width="${l.w}" height="${l.h}" fill="${p.bg}"/>${group('scene-content',body)}</svg>`;
}
export function renderDiagram(kind,time=posterTime,theme='light',width=720) {return diagram(kind,width,theme,time);}
export function render({time=posterTime,theme='light',poster=false}={}) {return renderDiagram('pca',poster?posterTime:time,theme,720);}
export const sampleTimes=[0,400,1000,1500,2000,2200,2400,3300,4400,5000,6100,6900,7200,7700,8000,8500,9000,9800,10100,10400,10700,11000,12500,13300,13650,13990];
export const reviewFiles=['scene.mjs','frame.html','review.md','../../../scripts/build-fastgraph-diagrams.mjs'];

export function createPlayback(reduced=false) {
  return {
    time:reduced?posterTime:0,paused:reduced,poster:reduced,visible:false,hidden:false,
    get playing(){return !this.paused&&this.visible&&!this.hidden;},
    advance(delta){if(this.playing)this.time=(this.time+Math.max(0,delta))%duration;return this.time;},
    toggle(){if(this.poster){this.poster=false;this.time=0;this.paused=false;}else this.paused=!this.paused;},
    reduce(value){if(value){this.time=posterTime;this.paused=true;this.poster=true;}},
  };
}
