// Deterministic HTML and SVG exports of the same animated scene.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {scene,renderDiagram,caption,posterTime} from '../src/content/fastgraph-diagrams/scene.mjs';
const root=new URL('../',import.meta.url);
const template=readFileSync(new URL('src/content/fastgraph-diagrams/frame.html',root),'utf8');
const code=readFileSync(new URL('src/content/fastgraph-diagrams/scene.mjs',root),'utf8').replace(/^export /gm,'');
const descriptions={
  pca:{label:'01 / PCA projection',title:'A better space to search.',intro:'Align the index with the data. Preserve the original distances.',scope:'Illustrative 2D → 1D projection; the benchmark uses 8D → 3D. Pacing is explanatory.',source:scene.sources.pca},
  binstepper:{label:'02 / Binstepper',title:'Search the boundary. Skip the rest.',intro:'Expand from one query, retain its closest neighbors, and stop when the bound permits.',scope:'One query · bin width 1 · K = 4, including self. Pacing is explanatory.',source:scene.sources.shells},
};
const output=new URL('public/generated/fastgraph/',root);mkdirSync(output,{recursive:true});
for(const kind of ['pca','binstepper']){
  const d=descriptions[kind],poster=renderDiagram(kind,posterTime);
  const vars={TITLE:d.title,LABEL:d.label,INTRO:d.intro,KIND:kind,SCENE:code,POSTER:poster,DESCRIPTION:scene[kind].claim,EXPLANATION:caption(kind,posterTime),SCOPE:d.scope,SOURCE:`https://github.com/AgarwalAarush/FastGraphCompute/blob/${scene.sourceRevision}/${d.source}`};
  writeFileSync(new URL(`src/content/fastgraph-diagrams/${kind}.html`,root),template.replace(/__([A-Z]+)__/g,(_,key)=>vars[key]));
  const font=readFileSync(new URL('public/fonts/JetBrainsMono-Regular.woff2',root)).toString('base64');
  const portable=poster.replace('</title>',`</title><style>@font-face{font-family:'JetBrains Mono';src:url(data:font/woff2;base64,${font}) format('woff2')}</style>`);
  writeFileSync(new URL(`${kind}-1.svg`,output),portable+'\n');
  console.log(`Built animated ${kind}`);
}
