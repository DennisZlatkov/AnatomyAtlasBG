export type SystemId = 'skeletal'|'muscular'|'arterial'|'venous'|'nervous'|'digestive'|'respiratory'|'urinary'|'reproductive'|'lymphatic'|'endocrine'|'integumentary'|'connective'|'sensory'|'cardiac';

export const SYSTEMS: {id:SystemId;name:string;color:string;description:string}[] = [
  {id:'skeletal',name:'Скелет (Skeleton)',color:'#e2d9ba',description:'Костите образуват опорния скелет на тялото, защитават вътрешните органи и служат за захващане на мускулите. Тяхната костна тъкан складира минерали и участва в кръвотворенето.'},
  {id:'muscular',name:'Мускули (Musculi)',color:'#a85b50',description:'Скелетните мускули осигуряват движение чрез съкращение и теглене на сухожилните си залавни места. Те движат ставите, поддържат стойката и генерират телесна топлина.'},
  {id:'cardiac',name:'Сърце (Cor)',color:'#b96760',description:'Сърцето е четирикухинен мускулен орган, действащ като помпа. Неговите клапи насочват кръвотока през малкия (белодробен) и големия (системен) кръг на кръвообращението.'},
  {id:'sensory',name:'Сетивни органи (Organa sensuum)',color:'#b0c8ce',description:'Осигуряват специалните сетива: зрение, слух, равновесие и обоняние. Техните специализирани рецептори предават нервни импулси към централната нервна система.'},
  {id:'arterial',name:'Артерии (Arteriae)',color:'#c05245',description:'Артериалните съдове изнасят кръвта под високо налягане от сърцето към периферията и органите или към белите дробове за насищане с кислород.'},
  {id:'venous',name:'Вени (Venae)',color:'#527c9f',description:'Венозната система връща дезоксигенираната кръв от тъканите към сърцето. Повърхностните и дълбоките вени притежават клапи за еднопосочен кръвоток.'},
  {id:'nervous',name:'Нервна система (Systema nervosum)',color:'#d8b565',description:'Главният мозък, гръбначният мозък и периферните нерви провеждат и интегрират сигнали за сетивност, моторна координация и регулация на жизнените функции.'},
  {id:'respiratory',name:'Дихателна система (Systema respiratorium)',color:'#b98991',description:'Дихателните пътища и белите дробове осъществяват външното дишане и газообмена на кислород и въглероден диоксид между алвеолите и капилярната кръв.'},
  {id:'digestive',name:'Храносмилателна система (Systema digestorium)',color:'#b8916b',description:'Храносмилателният тракт приема, смила и абсорбира хранителни вещества и вода, като извежда несмлените остатъци.'},
  {id:'urinary',name:'Отделителна система (Systema urinarium)',color:'#b47961',description:'Бъбреците филтрират кръвта, образуват урина и поддържат водно-електролитния и киселинно-алкалния баланс в организма.'},
  {id:'lymphatic',name:'Лимфна система (Systema lymphaticum)',color:'#879f7c',description:'Лимфните съдове дренират излишната интерстициална течност, а лимфните възли осигуряват имунен надзор и защита.'},
  {id:'endocrine',name:'Ендокринна система (Systema endocrinum)',color:'#c5a09a',description:'Жлезите с вътрешна секреция отделят хормони директно в кръвта за регулация на метаболизма, растежа и адаптацията към стрес.'},
  {id:'reproductive',name:'Възпроизводителна система (Systema genitalium)',color:'#bda098',description:'Органите отговарят за производството, узряването и транспорта на полови клетки и синтеза на полови хормони.'},
  {id:'integumentary',name:'Повърхност на тялото (Integumentum commune)',color:'#ba9b7d',description:'Кожната покривка осигурява външна анатомична граница, механична бариера, терморегулация и сетивност.'},
  {id:'connective',name:'Съединителна тъкан (Textus connectivus)',color:'#aec3bb',description:'Хрущялите, фасциите и ставните връзки осигуряват механична опора, разделят анатомичните структури и предават натоварването.'},
];

export interface Part {
  id: string;
  name: string;
  conceptId: string;
  system: SystemId;
  chunk: number;
  positions: number;
  normals: number;
  indices: number;
  vertexCount: number;
  indexCount: number;
  bounds: [number[], number[]];
}

export interface Concept {
  id: string;
  name: string;
  elements: string[];
}

export interface Atlas {
  version: string;
  sex?: 'male';
  source?: string;
  scope?: string;
  parts: Part[];
  concepts: Concept[];
  chunks: { url: string; bytes: number; gzip?: string; gzipBytes?: number }[];
  triangles: number;
}

export type View = 'three-quarter' | 'front' | 'back' | 'side';

export interface SceneState {
  inspectorOpen?: boolean;
  explode: number;
  visible: SystemId[];
  selected: string[];
  isolate: boolean;
  view: View;
  rotate: boolean;
  reset: number;
}

export const DEFAULT_VISIBLE: SystemId[] = [
  'cardiac', 'sensory', 'skeletal', 'muscular', 'arterial',
  'venous', 'nervous', 'respiratory', 'digestive', 'urinary',
  'lymphatic', 'endocrine', 'reproductive', 'connective'
];

export const EXPLANATIONS: Record<string, string> = {
  'heart': 'Сърцето (Cor) е централна мускулна помпа в гръдния кош. Дясната му половина изпраща кръв към белите дробове, а лявата – към системното артериално русло на тялото.',
  'liver': 'Черният дроб (Hepar) е най-големият паренхимен орган и жлеза, разположен под дясната половина на диафрагмата. Преработва усвоените хранителни вещества, отделя жлъчка и синтезира плазмени белтъци.',
  'brain': 'Главният мозък (Encephalon) е висшият орган на централната нервна система. Неговите дялове отговарят за възприятията, волевите движения, паметта, речта и вегетативния контрол.',
  'stomach': 'Стомахът (Gaster) е мускулен разширен резервоар между хранопровода и дванадесетопръстника. Разгражда храната чрез кисел стомашен сок и ензими.',
  'spleen': 'Слезката (Lien / Splen) е периферен лимфоиден орган в горната лява част на коремната кухина. Филтрира кръвта, елиминира остарелите еритроцити и участва в имунния отговор.',
  'pancreas': 'Панкреасът (Pancreas) е жлеза със смесена функция зад стомаха. Отделя храносмилателни ензими в дуоденума и секретира инсулин и глюкагон в кръвния ток.',
  'urinary bladder': 'Пикочният мехур (Vesica urinaria) е мускулен резервоар в малкия таз, който съхранява урината, постъпваща от бъбреците през уретерите.',
  'trachea': 'Трахеята (Trachea) е дихателна тръба, съставена от хрущялни полупръстени, която свързва ларинкса с главните бронхи и поддържа проходимостта на дихателните пътища.',
  'diaphragm': 'Диафрагмата (Diaphragma) е широка плоска мускулна преграда между гръдната и коремната кухина. При съкращението си увеличава обема на гръдния кош и е главният двигател на вдишването.',
};

export function explanation(name: string, system: SystemId): string {
  const lower = name.toLowerCase();
  return EXPLANATIONS[lower] ?? SYSTEMS.find(s => s.id === system)?.description ?? '';
}
