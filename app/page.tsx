import {flushSync} from 'react-dom';
import {registerAtlasTools} from './agent-tools';
import {useEffect,useMemo,useRef,useState} from 'react';
import {Activity,ArrowUpRight,ChevronRight,Focus,Info,Layers3,Pause,RotateCcw,RotateCw,Search,X} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {Slider} from '@/components/ui/slider';
import {Switch} from '@/components/ui/switch';
import {Sheet,SheetContent,SheetTitle,SheetDescription} from '@/components/ui/sheet';
import {Combobox,ComboboxInput,ComboboxContent,ComboboxList,ComboboxItem,ComboboxEmpty} from '@/components/ui/combobox';
import AnatomyScene from './scene';
import {DEFAULT_VISIBLE,SYSTEMS,EXPLANATIONS,explanation,type Atlas,type Concept,type SceneState,type SystemId,type View} from './anatomy';
import {getTranslation} from './translations';

const initial:SceneState={explode:0,visible:DEFAULT_VISIBLE,selected:[],isolate:false,view:'three-quarter',rotate:false,reset:0};

export default function Home(){
 const detailTitle=useRef<HTMLHeadingElement>(null);
 const [atlas,setAtlas]=useState<Atlas|null>(null),[state,setState]=useState(initial),[progress,setProgress]=useState(0),[error,setError]=useState(''),[panel,setPanel]=useState<'layers'|'search'|null>(null),[details,setDetails]=useState(false),[about,setAbout]=useState(false),[query,setQuery]=useState(''),[chosen,setChosen]=useState<Concept|null>(null);

 useEffect(()=>{
  const abort=new AbortController();setProgress(0);setError('');setAtlas(null);setChosen(null);setDetails(false);setState({...initial,visible:DEFAULT_VISIBLE});
  fetch('/models/atlas.json',{signal:abort.signal})
   .then(r=>{if(!r.ok)throw new Error('Анатомичният каталог не можа да бъде зареден.');return r.json();})
   .then(data=>setAtlas(data as Atlas))
   .catch(e=>{if(e.name!=='AbortError')setError(e.message);});
  return()=>abort.abort();
 },[]);

 useEffect(()=>{
  const key=(e:KeyboardEvent)=>{if(e.key==='/'&&!(e.target instanceof HTMLInputElement)&&!(e.target instanceof HTMLTextAreaElement)){e.preventDefault();setPanel('search');setDetails(false);}};
  window.addEventListener('keydown',key);
  return()=>window.removeEventListener('keydown',key);
 },[]);

 const parts=useMemo(()=>new Map(atlas?.parts.map(p=>[p.id,p])),[atlas]);
 const counts=useMemo(()=>Object.fromEntries(SYSTEMS.map(s=>[s.id,atlas?.parts.filter(p=>p.system===s.id).length??0])),[atlas]);
 const activeSystems=SYSTEMS.filter(s=>counts[s.id]>0);
 const selectedParts=state.selected.map(id=>parts.get(id)).filter(p=>!!p),selected=selectedParts[0],system=SYSTEMS.find(s=>s.id===selected?.system);
 const visibleCount=atlas?.parts.filter(p=>state.isolate?state.selected.includes(p.id):state.visible.includes(p.system)||state.selected.includes(p.id)).length??0;

 const results=useMemo(()=>{
  if(!atlas)return[];
  const term=query.toLowerCase().trim();
  if(!term)return ['heart','brain','liver','stomach','spleen','pancreas','urinary bladder','trachea'].map(name=>atlas.concepts.find(c=>c.name.toLowerCase()===name)).filter((x):x is Concept=>!!x);
  return atlas.concepts.filter(c=>{
   const tr=getTranslation(c.name);
   return c.name.toLowerCase().includes(term) ||
          tr.bg.toLowerCase().includes(term) ||
          tr.latin.toLowerCase().includes(term) ||
          c.id.toLowerCase().includes(term);
  }).sort((a,b)=>a.name.length-b.name.length).slice(0,80);
 },[atlas,query]);

 const choose=(c:Concept)=>{setChosen(c);setState(s=>({...s,selected:c.elements,isolate:false,rotate:false}));setDetails(true);setPanel(null);};
 useEffect(()=>{if(!atlas)return;return registerAtlasTools(atlas,c=>flushSync(()=>choose(c)));},[atlas]);

 const choosePart=(id:string)=>{const p=parts.get(id);if(!p)return;setChosen({id:p.conceptId,name:p.name,elements:[id]});setState(s=>({...s,selected:[id],isolate:false,rotate:false}));setDetails(true);setPanel(null);};
 const toggle=(id:SystemId)=>{setDetails(false);setState(s=>({...s,selected:[],isolate:false,visible:s.visible.includes(id)?s.visible.filter(x=>x!==id):[...s.visible,id]}));};
 const reset=()=>{setState(s=>({...initial,visible:DEFAULT_VISIBLE,reset:s.reset+1}));setChosen(null);setDetails(false);setPanel(null);};
 const openPanel=(next:'layers'|'search')=>{setDetails(false);setPanel(p=>p===next?null:next);};

 const chosenTranslation = chosen ? getTranslation(chosen.name) : null;

 return <main className="studio">
  {atlas&&<AnatomyScene atlas={atlas} state={{...state,inspectorOpen:details&&selectedParts.length>0}} onSelect={choosePart} onProgress={n=>{setProgress(n);if(n===100)setError('');}} onError={setError}/>}
  <div className="vignette"/>
  <header className="identity">
   <div className="eyebrow"><span className="status-dot"/> ИНТЕРАКТИВНА АНАТОМИЯ</div>
   <h1>Анатомичен атлас<Badge variant="outline" className="edition">3D</Badge></h1>
   <div className="identity-meta">{atlas?atlas.parts.length.toLocaleString('bg-BG'):'2,234'} моделирани структури <span>·</span> BodyParts3D</div>
  </header>
  <nav className="top-actions" aria-label="Панели на визуализатора">
   <Button variant="ghost" className={panel==='search'?'active':''} onClick={()=>openPanel('search')} aria-label="Търсене на анатомична структура">
    <Search size={18}/><span>Търсене на структура</span><kbd>/</kbd>
   </Button>
   <Button variant="ghost" className="icon-button" aria-label="Относно атласа" onClick={()=>{setDetails(false);setPanel(null);setAbout(true);}}>
    <Info size={18}/>
   </Button>
  </nav>
  <section className={`layers-panel glass ${panel==='layers'?'mobile-open':''}`} aria-label="Анатомични слоеве и системи">
   <div className="panel-heading">
    <span>Органни системи</span>
    <Button variant="ghost" className="mobile-only icon-button" onClick={()=>setPanel(null)} aria-label="Затваряне на панела"><X size={18}/></Button>
    <Badge variant="secondary" className="desktop-only small-number">{activeSystems.length}</Badge>
   </div>
   <div className="layer-presets">
    <Button variant="ghost" aria-pressed={activeSystems.every(x=>state.visible.includes(x.id))} onClick={()=>setState(s=>({...s,selected:[],isolate:false,visible:activeSystems.map(x=>x.id)}))}>Всички</Button>
    <Button variant="ghost" aria-pressed={state.visible.length===1&&state.visible[0]==='skeletal'} onClick={()=>setState(s=>({...s,selected:[],isolate:false,visible:['skeletal']}))}>Скелет</Button>
    <Button variant="ghost" aria-pressed={state.visible.length===6&&['cardiac','respiratory','digestive','urinary','endocrine','reproductive'].every(id=>state.visible.includes(id as SystemId))} onClick={()=>setState(s=>({...s,selected:[],isolate:false,visible:['cardiac','respiratory','digestive','urinary','endocrine','reproductive']}))}>Органи</Button>
   </div>
   <div className="system-list">
    {activeSystems.map(s=>(
     <div className={`system-row ${state.visible.includes(s.id)?'enabled':''}`} key={s.id}>
      <Button variant="ghost" className="system-name" title={`Показване само на ${s.name.toLowerCase()}`} onClick={()=>setState(v=>({...v,visible:[s.id],isolate:false,selected:[]}))}>
       <span className="system-dot" style={{background:s.color}}/>{s.name}
       <span className="system-count">{counts[s.id]}</span>
      </Button>
      <Switch checked={state.visible.includes(s.id)} onCheckedChange={()=>toggle(s.id)} aria-label={`Превключване на ${s.name.toLowerCase()}`} />
     </div>
    ))}
   </div>
   <div className="panel-foot">
    <span>{visibleCount.toLocaleString('bg-BG')} видими елемента</span>
    <Button variant="ghost" onClick={()=>setState(s=>({...s,visible:[],selected:[],isolate:false}))}>Скриване на всички</Button>
   </div>
  </section>
  {panel==='search'&&<section className="search-panel glass" aria-label="Търсене на анатомия">
   <div className="panel-heading">
    <span>Търсене на анатомична структура</span>
    <Button variant="ghost" className="icon-button" onClick={()=>setPanel(null)} aria-label="Затваряне на търсенето"><X size={18}/></Button>
   </div>
   <Combobox<Concept> items={results} value={null} onValueChange={value=>{if(value)choose(value);}} inputValue={query} onInputValueChange={setQuery} itemToStringLabel={c=>getTranslation(c.name).bg} filter={null} open onOpenChange={open=>{if(!open)setPanel(null);}}>
    <ComboboxInput autoFocus placeholder="Сърце, бедрена кост, M. biceps, черепен нерв…" aria-label="Търсене на наименовани анатомични структури на български или латински" showTrigger={false}/>
    <ComboboxContent className="anatomy-search-results">
     <ComboboxEmpty>Няма намерени структури.</ComboboxEmpty>
     <ComboboxList>{(c:Concept)=>{
      const tr=getTranslation(c.name);
      return (
       <ComboboxItem key={c.id} value={c}>
        <div className="search-result-name" style={{display:'flex',flexDirection:'column',gap:1,textAlign:'left'}}>
         <span style={{fontWeight:500}}>{tr.bg}</span>
         {tr.latin&&tr.latin!==tr.bg&&<span style={{fontSize:11,opacity:0.75,fontStyle:'italic',color:'#458a85'}}>{tr.latin}</span>}
        </div>
        <span className="small-number">{c.elements.length} {c.elements.length===1?'елемент':'елемента'}</span>
       </ComboboxItem>
      );
     }}</ComboboxList>
    </ComboboxContent>
   </Combobox>
   <p className="search-note">{query?'Показване на до 80 съвпадения. Уточнете термина за намиране на по-малки структури.':'Търсете органи, мускули, кости и съдове на български или латински език.'}</p>
  </section>}
  <nav className="view-controls glass" aria-label="Управление на изгледа">
   {(['three-quarter','front','side','back'] as View[]).map((v,i)=>(
    <Button variant="ghost" key={v} className={state.view===v?'active':''} aria-pressed={state.view===v} disabled={state.explode>.8&&v!=='front'} onClick={()=>setState(s=>({...s,view:v,reset:s.reset+1,rotate:false}))} title={v==='three-quarter'?'Изглед ¾':v==='front'?'Преден изглед (Anterior)':v==='side'?'Страничен изглед (Lateral)':'Заден изглед (Posterior)'} aria-label={v==='three-quarter'?'Изглед ¾':v==='front'?'Преден изглед (Anterior)':v==='side'?'Страничен изглед (Lateral)':'Заден изглед (Posterior)'}>
     <span>{['¾','F','S','B'][i]}</span>
    </Button>
   ))}
   <i/>
   <Button variant="ghost" disabled={state.explode>=.4} aria-label={state.rotate?'Спиране на въртенето':'Автоматично въртене'} title={state.rotate?'Спиране на въртенето':'Автоматично въртене'} className={state.rotate?'active':''} onClick={()=>setState(s=>({...s,rotate:!s.rotate}))}>
    {state.rotate?<Pause size={17}/>:<RotateCw size={18}/>}
   </Button>
   <Button variant="ghost" aria-label="Възстановяване на изгледа и слоевете" title="Възстановяване" onClick={reset}>
    <RotateCcw size={17}/>
   </Button>
  </nav>
  <div className="scene-caption">
   <span className="caption-line"/>
   <span>{state.isolate?(chosenTranslation?`${chosenTranslation.bg.toUpperCase()} · ${chosenTranslation.latin.toUpperCase()}`:'ИЗОЛИРАНА СТРУКТУРА'):state.explode>.95?'АНАТОМИЧЕН ОПИС':state.explode>.05?'РАЗДЕЛЕНИ СТРУКТУРИ':'ВЪЗРАСТЕН ЧОВЕК · МЪЖКА АНАТОМИЯ'}</span>
   <span className="caption-line"/>
  </div>
  <div className="bottom-dock glass">
   <Button variant="ghost" className="mobile-only dock-layers" onClick={()=>openPanel('layers')} aria-label="Органни системи"><Layers3 size={20}/><span>Системи</span></Button>
   <div className="explode-control">
    <div className="explode-label">
     <label id="explode-label">Анатомично разделяне (дисекция)</label>
     <output>{Math.round(state.explode*100)}<span>%</span></output>
    </div>
    <Slider aria-labelledby="explode-label" min={0} max={100} step={1} value={[state.explode*100]} onValueChange={v=>setState(s=>({...s,explode:(Array.isArray(v)?v[0]:v)/100,view:(Array.isArray(v)?v[0]:v)>80?'front':s.view,rotate:false}))}/>
    <div className="slider-endpoints"><span>Сглобено тяло</span><span>Всички части</span></div>
   </div>
   <Button variant="ghost" className="dock-reset" onClick={reset} aria-label="Възстановяване на позицията"><RotateCcw size={18}/><span>Възстановяване</span></Button>
  </div>
  <footer className="studio-footer">
   <span>{state.explode>.8?'Плъзнете за панорама':'Плъзнете за завъртане'} <b>·</b> Мащабирайте с колелце / щипване <b>·</b> Натиснете част за детайли</span>
   <Button variant="ghost" onClick={()=>{setDetails(false);setPanel(null);setAbout(true);}}>Източник и лиценз <ArrowUpRight size={12}/></Button>
  </footer>
  {progress<100&&!error&&<div className="loading glass" role="status"><Activity size={18}/><div><strong>Подготовка на 3D модела</strong><span>{progress}% · Зареждане на {atlas?.parts.length.toLocaleString('bg-BG')??'2,234'} структури</span><div className="loading-track"><i style={{width:`${progress}%`}}/></div></div></div>}
  {error&&<div className="loading glass error" role="alert"><p>{error}</p><Button variant="ghost" onClick={()=>location.reload()}>Презареждане на визуализатора</Button></div>}
  <Sheet open={details&&selectedParts.length>0} modal={false} disablePointerDismissal onOpenChange={setDetails}>
   <SheetContent initialFocus={detailTitle} className={`detail-sheet glass ${state.isolate?'is-isolated':''}`} showCloseButton={true}>
    <div className="detail-header">
     <div className="detail-accent" style={{background:system?.color}}/>
     <div className="eyebrow">{system?.name??'АНАТОМИЯ'}</div>
     <div style={{display:'flex',flexDirection:'column',gap:4}}>
      <SheetTitle ref={detailTitle} tabIndex={-1} className="structure-title">
       {chosenTranslation?.bg || chosen?.name}
      </SheetTitle>
      {chosenTranslation?.latin && chosenTranslation.latin !== chosenTranslation.bg && (
       <div style={{fontSize:16,fontStyle:'italic',color:'#458a85',fontWeight:500,letterSpacing:'-0.2px'}}>
        {chosenTranslation.latin}
       </div>
      )}
     </div>
    </div>
    <div className="detail-scroll" key={`${chosen?.id}-${state.isolate}`}>
     <SheetDescription className="structure-description">
      {chosen&&selected?explanation(chosen.name,selected.system):''}
     </SheetDescription>
     {chosen&&!EXPLANATIONS[chosen.name.toLowerCase()]&&<span className="context-note">Органна система · структурата е валидирана по Terminologia Anatomica</span>}
     <div className="structure-meta">
      <span>Анатомичен FMA код<strong>{chosen?.id}</strong></span>
      <span>Избрани елементи<strong>{state.selected.length.toLocaleString('bg-BG')}</strong></span>
     </div>
     {selectedParts.length>1&&<div className="member-list">
      <h3>Включени анатомични части</h3>
      {selectedParts.slice(0,50).map(p=>{
       const pTr=getTranslation(p.name);
       return (
        <Button variant="ghost" key={p.id} onClick={()=>choosePart(p.id)} style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
         <div style={{display:'flex',flexDirection:'column',textAlign:'left'}}>
          <span>{pTr.bg}</span>
          {pTr.latin&&pTr.latin!==pTr.bg&&<span style={{fontSize:11,fontStyle:'italic',opacity:0.75,color:'#458a85'}}>{pTr.latin}</span>}
         </div>
         <ChevronRight size={14}/>
        </Button>
       );
      })}
      {selectedParts.length>50&&<p>И още {selectedParts.length-50} моделирани елемента.</p>}
     </div>}
     <a className="source-link" href="https://lifesciencedb.jp/bp3d/" target="_blank" rel="noreferrer">Преглед на научния източник (BodyParts3D) <ArrowUpRight size={14}/></a>
    </div>
    <div className="detail-actions">
     <Button className={`primary-action ${state.isolate?'active':''}`} onClick={()=>setState(s=>({...s,isolate:!s.isolate,explode:0}))}>
      <Focus size={18}/>{state.isolate?'Показване на цялото тяло':'Изолиране на структурата'}<ChevronRight size={16}/>
     </Button>
     <Button variant="ghost" className="secondary-action" onClick={()=>{setState(s=>({...s,selected:[],isolate:false}));setDetails(false);}}>Изчистване на избора</Button>
    </div>
   </SheetContent>
  </Sheet>
  <Sheet open={about} onOpenChange={setAbout}>
   <SheetContent className="about-sheet glass">
    <div className="eyebrow">ИЗТОЧНИК И ОБХВАТ</div>
    <SheetTitle className="structure-title">Човешкото тяло в 3D пространство.</SheetTitle>
    <SheetDescription>Интерактивен 3D атлас на нормалната човешка анатомия по данни от BodyParts3D.</SheetDescription>
    <div className="about-copy">
     <p><strong>Референтен мъжки анатомичен модел · BodyParts3D</strong><br/>2,234 отделни триизмерни полигонални мрежи и 3,432 наименовани FMA концепции от стандартизиран модел на възрастен мъж.</p>
     <p>Моделът представя нормалната макроскопска анатомия. Всяка наименована концепция може да включва множество отделни съставни части, като всяка изходна геометрия се визуализира в реално време.</p>
     <p>Органните групи и цветовото кодиране са създадени за медицинско и университетско обучение. Геометрията е оптимизирана за плавна работа в уеб браузър при стриктно спазване на анатомичните пропорции и международната номенклатура (Terminologia Anatomica).</p>
     <h3>Научен източник и лиценз</h3>
     <p>BodyParts3D, © The Database Center for Life Science, лицензиран под Creative Commons Attribution 4.0 International (CC BY 4.0).</p>
     <a href="https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html" target="_blank" rel="noreferrer">Условия на лиценза <ArrowUpRight size={14}/></a>
     <a href="https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html" target="_blank" rel="noreferrer">Оригинална геометрия и таблици <ArrowUpRight size={14}/></a>
     <a href="https://academic.oup.com/nar/article/37/suppl_1/D782/1000752" target="_blank" rel="noreferrer">Научна публикация (Mitsuhashi et al., 2009) <ArrowUpRight size={14}/></a>
    </div>
   </SheetContent>
  </Sheet>
 </main>;
}
