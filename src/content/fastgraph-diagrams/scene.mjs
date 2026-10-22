// Source-grounded, deterministic teaching scenes. Coordinates are illustrative.
export const scene = {
  version: 1,
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
    scope: 'One query in a 7 by 7 grid, bin width 1, K=4 including self. Each view is after a complete shell, not a GPU timing or thread-order animation.',
    omissions: ['Direction constraints', 'Ragged graph offsets', 'Bin traversal order within a shell'],
    invariant: 'At stop, all unvisited points are farther than the farthest retained neighbor.',
  },
};

export const palettes = {
  light: {bg:'#fbfaf7', ink:'#292b29', muted:'#62665f', grid:'#d7dbd3', faint:'#edf0e9', accent:'#aa481f', tint:'#f8e8dc', teal:'#126756', tealTint:'#e2eee8', dot:'#777d73'},
  dark: {bg:'#202321', ink:'#edf0e9', muted:'#b5bdb2', grid:'#465047', faint:'#2b312c', accent:'#f3ad82', tint:'#493429', teal:'#85d6bc', tealTint:'#293f37', dot:'#a3ad9e'},
};
const f = n => Number(n.toFixed(3));
const txt = (x,y,text,p,extra='') => `<text x="${x}" y="${y}" fill="${p.ink}" font-family="Arial, sans-serif" font-size="14" ${extra}>${text}</text>`;
const line = (x1,y1,x2,y2,color,extra='') => `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${color}" ${extra}/>`;
const circle = (x,y,r,fill,extra='') => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${fill}" ${extra}/>`;
const svg = (id,description,body,p,width=360,height=300) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="${id}-title"><title id="${id}-title">${description}</title><rect width="${width}" height="${height}" fill="${p.bg}"/>${body}</svg>`;

// Symmetric samples have zero mean and zero cross-covariance in this basis.
// The direction with greatest variance is therefore exactly the chosen PCA axis.
export const pcaPoints = [
  [-2.6,0],[-2.2,.24],[-2,-.264],[-1.6,.6],[-1.1,-.96/1.1],[-.75,.18],[-.4,-.3375],
  [0,0],[.4,.3375],[.75,-.18],[1.1,.96/1.1],[1.6,-.6],[2,.264],[2.2,-.24],[2.6,0],
].map(([u,v],i) => ({id:`point-${i}`,u,v,x:.8*u-.6*v,y:.6*u+.8*v}));

export function renderPca(step=2, theme='light') {
  const p=palettes[theme]; const scale=48; const X=x=>180+x*scale; const Y=y=>149-y*scale;
  const candidate=pcaPoints[11]; const query=pcaPoints[7];
  let left = txt(18,26,'Original feature space',p);
  left += line(30,149,330,149,p.grid)+line(180,35,180,265,p.grid);
  left += txt(313,170,'x₁',p)+txt(188,48,'x₂',p);
  if(step>=1) {
    left += line(X(-2.8*.8),Y(-2.8*.6),X(2.8*.8),Y(2.8*.6),p.teal,'stroke-width="2"');
    left += txt(249,57,'PC1',p,`style="fill:${p.teal}"`);
  }
  if(step===2) {
    for(const pt of pcaPoints) left += line(X(pt.x),Y(pt.y),X(.8*pt.u),Y(.6*pt.u),p.grid,'stroke-dasharray="3 3"');
    left += line(X(query.x),Y(query.y),X(candidate.x),Y(candidate.y),p.accent,'stroke-width="2"');
    left += line(X(0),Y(0),X(.8*candidate.u),Y(.6*candidate.u),p.teal,'stroke-width="3"');
  }
  for(const pt of pcaPoints) left+=circle(X(pt.x),Y(pt.y),pt.id===candidate.id?6:4,pt.id===candidate.id?p.accent:p.dot,`id="original-${pt.id}"`);
  left+=`<path d="M180 142 l7 7 -7 7 -7 -7 Z" fill="${p.teal}"/>`;
  left+=txt(189,169,'q',p)+txt(X(candidate.x)+10,Y(candidate.y)+4,'p',p);
  if(step===2) left+=circle(X(.8*candidate.u),Y(.6*candidate.u),4,p.bg,`stroke="${p.teal}" stroke-width="2"`);
  left+=txt(18,284,step===2?'Full distance q → p = 1.71':'Same points throughout the example',p,`style="fill:${p.muted};font-size:13px"`);
  let right=txt(18,26,'Compact search index',p);
  if(step===2) {
    const B=u=>180+u*50;
    for(let i=0;i<6;i++) {
      const x=30+i*50;
      right+=`<rect x="${x}" y="87" width="50" height="100" fill="${i===3?p.tealTint:p.faint}" stroke="${p.grid}"/>`;
      right+=txt(x+25,214,String(i),p,'text-anchor="middle"');
    }
    right+=line(30,137,330,137,p.teal);
    pcaPoints.forEach(pt=>{right+=circle(B(pt.u),137,pt.id===candidate.id?6:4,pt.id===candidate.id?p.accent:p.dot,`id="projected-${pt.id}"`);});
    right+=`<path d="M180 130 l7 7 -7 7 -7 -7 Z" fill="${p.teal}"/>`;
    right+=txt(180,119,'q',p,'text-anchor="middle"')+txt(B(candidate.u),119,'p',p,'text-anchor="middle"');
    right+=line(180,62,B(candidate.u),62,p.teal,'stroke-width="2"');
    right+=line(180,57,180,67,p.teal)+line(B(candidate.u),57,B(candidate.u),67,p.teal);
    right+=txt(220,51,'1.60',p,'text-anchor="middle"');
    right+=txt(180,240,'Bin along the retained PCA coordinate',p,'text-anchor="middle" style="font-size:13px"');
    right+=txt(18,284,'Projected distance 1.60 ≤ full distance 1.71',p,`style="fill:${p.muted};font-size:13px"`);
  } else {
    right+=line(42,137,318,137,p.grid,'stroke-dasharray="4 5"');
    right+=txt(180,120,step===0?'The index has not been built.':'Keep the direction of greatest variance.',p,'text-anchor="middle" style="font-size:13px"');
    right+=txt(180,165,step===0?'First, find a useful direction in the data.':'Next, project each point onto that axis.',p,'text-anchor="middle" style="font-size:13px"');
  }
  return [svg('pca-original','Original points, the principal axis, and original-space distances.',left,p),svg('pca-index','PCA projection places the same points in one-dimensional bins. Their projected distances are lower bounds.',right,p)];
}

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
export function renderBins(step=2,theme='light') {
  const p=palettes[theme],state=binState(step),s=38,ox=47,oy=31;
  const X=x=>ox+x*s,Y=y=>oy+(7-y)*s;
  let body='';
  for(let x=0;x<7;x++) for(let y=0;y<7;y++) {
    const d=Math.max(Math.abs(x-3),Math.abs(y-3));
    body+=`<rect id="bin-${x}-${y}" x="${X(x)}" y="${Y(y+1)}" width="${s}" height="${s}" fill="${d===step?p.tint:d<step?p.tealTint:p.bg}" stroke="${p.grid}"/>`;
  }
  if(state.filled) body+=circle(X(query.x),Y(query.y),f(state.radius*s),'none',`stroke="${p.teal}" stroke-width="2"`);
  if(state.stop) body+=circle(X(query.x),Y(query.y),step*s,'none',`stroke="${p.accent}" stroke-width="1.5" stroke-dasharray="5 4"`);
  for(const pt of binPoints) {
    if(pt.id==='q') continue;
    const best=state.best.some(b=>b.id===pt.id),visited=shell(pt)<=step;
    if(best) body+=line(X(query.x),Y(query.y),X(pt.x),Y(pt.y),p.teal,'stroke-width="1.5"');
    body+=circle(X(pt.x),Y(pt.y),best?5:3.5,best?p.teal:visited?p.dot:p.grid,`id="candidate-${pt.id}"`);
  }
  const qx=X(query.x),qy=Y(query.y);
  body+=`<path d="M${qx} ${qy-7} l7 7 -7 7 -7 -7 Z" fill="${p.accent}"/>`;
  body+=txt(qx-17,qy+18,'q',p);
  body+=txt(180,321,state.stop?'24 outer bins remain unvisited':`Only the shell boundary is new: ${state.newBins} ${step===0?'bin':'bins'}`,p,'text-anchor="middle" style="font-size:13px"');
  return svg('bin-grid',`After shell ${step}: ${state.visitedBins} bins visited, ${state.best.length} of 4 neighbors retained. ${state.stop?'The stopping bound is satisfied.':'Continue searching.'}`,body,p,360,340);
}

export function render({time=2,theme='light',poster=false}={}) {
  const step=poster?2:Math.max(0,Math.min(2,Math.round(time)));
  // Standalone poster shares precisely the geometry used by the live figures.
  const panels=[...renderPca(step,theme),renderBins(step,theme)];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="340" viewBox="0 0 1080 340"><rect width="1080" height="340" fill="${palettes[theme].bg}"/>${panels[0].replace('<svg ','<svg x="0" y="0" width="360" height="300" ')}${panels[1].replace('<svg ','<svg x="360" y="0" width="360" height="300" ')}${panels[2].replace('<svg ','<svg x="720" y="0" width="360" height="340" ')}</svg>`;
}
export const sampleTimes=[0,1,2];
export const posterTime=2;
export const reviewFiles=['scene.mjs','frame.html','review.md'];
