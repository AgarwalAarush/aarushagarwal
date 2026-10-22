// Build the embedded pages and portable SVG posters from the same semantic scene.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {scene,renderPca,renderBins,binState} from '../src/content/fastgraph-diagrams/scene.mjs';
const root=new URL('../',import.meta.url);
const template=readFileSync(new URL('src/content/fastgraph-diagrams/frame.html',root),'utf8');
const code=readFileSync(new URL('src/content/fastgraph-diagrams/scene.mjs',root),'utf8').replace(/^export /gm,'');
const descriptions={
  pca:{title:'PCA: a smaller space to search',intro:'Organize points around the data’s geometry. Keep the original features for distance calculations.',scope:'Illustrative 2D → 1D example. The benchmark uses 8D → 3D.',source:scene.sources.pca,explanation:'The projected distance is a lower bound. The original features still determine which points are nearest.',legend:''},
  binstepper:{title:'Binstepper: expand the boundary, then stop',intro:'Follow one query through successive shells. Each view shows the state after a complete shell.',scope:'Illustrative 2D grid · bin width 1 · K = 4, including the query itself.',source:scene.sources.shells,explanation:'The unvisited-distance lower bound exceeds the farthest retained distance. The remaining bins can be skipped.',legend:'<span><i class="key shell"></i>Current shell</span><span><i class="key"></i>Retained neighbor</span><span><i class="key wait"></i>Unvisited point</span><span><i class="key radius"></i>Neighbor radius</span><span><i class="key bound"></i>Stopping bound</span>'}
};
const output=new URL('public/generated/fastgraph/',root);mkdirSync(output,{recursive:true});
for(const kind of ['pca','binstepper']) {
  const d=descriptions[kind];
  const panels=kind==='pca'?renderPca():[renderBins()];
  const state=binState(2);
  const poster=panels.join('')+(kind==='binstepper'?`<div class="metrics"><p>25 of 49 bins visited</p><p class="decision">2.00 > ${state.radius.toFixed(2)} → stop</p><p>24 bins safely skipped</p></div>`:'');
  const vars={TITLE:d.title,INTRO:d.intro,KIND:kind,SCENE:code,POSTER:poster,LEGEND:d.legend,EXPLANATION:d.explanation,SCOPE:d.scope,SOURCE:`https://github.com/AgarwalAarush/FastGraphCompute/blob/${scene.sourceRevision}/${d.source}`,BUTTONS:scene[kind].beats.map((beat,i)=>`<button type="button" data-step="${i}" aria-pressed="${i===2}">${beat}</button>`).join('')};
  const html=template.replace(/__([A-Z]+)__/g,(_,key)=>vars[key]);
  writeFileSync(new URL(`src/content/fastgraph-diagrams/${kind}.html`,root),html);
  panels.forEach((panel,i)=>writeFileSync(new URL(`${kind}-${i+1}.svg`,output),panel+'\n'));
  console.log(`Built ${kind}`);
}
