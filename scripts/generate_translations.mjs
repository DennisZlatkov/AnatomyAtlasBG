import fs from 'fs';

const atlas = JSON.parse(fs.readFileSync('public/models/atlas.json', 'utf8'));

console.log(`Analyzing ${atlas.parts.length} parts and ${atlas.concepts.length} concepts...`);

// Comprehensive Root Dictionary
// Medical Bulgarian and Terminologia Anatomica Latin
const CANONICAL_MAP = {
  // Skeleton - Cranium & Face
  'frontal bone': { bg: 'Челна кост', latin: 'Os frontale' },
  'parietal bone': { bg: 'Теменна кост', latin: 'Os parietale' },
  'occipital bone': { bg: 'Тилна кост', latin: 'Os occipitale' },
  'temporal bone': { bg: 'Слепоочна кост', latin: 'Os temporale' },
  'sphenoid bone': { bg: 'Клиновидна кост', latin: 'Os sphenoidale' },
  'ethmoid': { bg: 'Решетъчна кост', latin: 'Os ethmoidale' },
  'mandible': { bg: 'Долна челюст', latin: 'Mandibula' },
  'maxilla': { bg: 'Горна челюст', latin: 'Maxilla' },
  'zygomatic bone': { bg: 'Ябълчна кост', latin: 'Os zygomaticum' },
  'nasal bone': { bg: 'Носна кост', latin: 'Os nasale' },
  'lacrimal bone': { bg: 'Слъзна кост', latin: 'Os lacrimale' },
  'palatine bone': { bg: 'Небцова кост', latin: 'Os palatinum' },
  'vomer': { bg: 'Ралник', latin: 'Vomer' },
  'hyoid bone': { bg: 'Подезична кост', latin: 'Os hyoideum' },

  // Spine & Thorax
  'atlas': { bg: 'Атлас (I шиен прешлен)', latin: 'Atlas (C1)' },
  'axis': { bg: 'Аксис (II шиен прешлен)', latin: 'Axis (C2)' },
  'sternum': { bg: 'Гръдна кост', latin: 'Sternum' },
  'body of sternum': { bg: 'Тяло на гръдната кост', latin: 'Corpus sterni' },
  'manubrium': { bg: 'Дръжка на гръдната кост', latin: 'Manubrium sterni' },
  'xiphoid process': { bg: 'Мечовиден израстък', latin: 'Processus xiphoideus' },
  'sacrum': { bg: 'Кръстцова кост', latin: 'Os sacrum' },
  'coccyx': { bg: 'Опашна кост', latin: 'Os coccygis' },
  'diaphragm': { bg: 'Диафрагма', latin: 'Diaphragma' },
  'pubic symphysis': { bg: 'Срамно съчленение (симфиза)', latin: 'Symphysis pubica' },

  // Upper Limb Bones
  'clavicle': { bg: 'Ключица', latin: 'Clavicula' },
  'scapula': { bg: 'Лопатка', latin: 'Scapula' },
  'humerus': { bg: 'Раменна кост', latin: 'Humerus' },
  'radius': { bg: 'Лъчева кост', latin: 'Radius' },
  'ulna': { bg: 'Лакътна кост', latin: 'Ulna' },
  'scaphoid': { bg: 'Ладиевидна кост на китката', latin: 'Os scaphoideum' },
  'lunate': { bg: 'Полулунна кост', latin: 'Os lunatum' },
  'triquetral': { bg: 'Тристенна кост', latin: 'Os triquetrum' },
  'triquetrum': { bg: 'Тристенна кост', latin: 'Os triquetrum' },
  'pisiform': { bg: 'Граховидна кост', latin: 'Os pisiforme' },
  'trapezium': { bg: 'Трапецовидна кост', latin: 'Os trapezium' },
  'trapezoid': { bg: 'Трапецоидна кост', latin: 'Os trapezoideum' },
  'capitate': { bg: 'Главеста кост', latin: 'Os capitatum' },
  'hamate': { bg: 'Кукеста кост', latin: 'Os hamatum' },

  // Lower Limb Bones
  'hip bone': { bg: 'Тазова кост', latin: 'Os coxae' },
  'ilium': { bg: 'Хълбочна кост', latin: 'Os ilii' },
  'ischium': { bg: 'Седалищна кост', latin: 'Os ischii' },
  'pubis': { bg: 'Срамна кост', latin: 'Os pubis' },
  'femur': { bg: 'Бедрена кост', latin: 'Os femoris' },
  'patella': { bg: 'Капачка', latin: 'Patella' },
  'tibia': { bg: 'Голям пищял', latin: 'Tibia' },
  'fibula': { bg: 'Малък пищял', latin: 'Fibula' },
  'calcaneus': { bg: 'Петна кост', latin: 'Calcaneus' },
  'talus': { bg: 'Скочна кост', latin: 'Talus' },
  'navicular bone of left foot': { bg: 'Ладиевидна кост на ходилото (лява)', latin: 'Os naviculare pedis sinistri' },
  'navicular bone of right foot': { bg: 'Ладиевидна кост на ходилото (дясна)', latin: 'Os naviculare pedis dextri' },
  'navicular': { bg: 'Ладиевидна кост на ходилото', latin: 'Os naviculare' },
  'medial cuneiform bone': { bg: 'Медиална клиновидна кост', latin: 'Os cuneiforme mediale' },
  'intermediate cuneiform bone': { bg: 'Междинна клиновидна кост', latin: 'Os cuneiforme intermedium' },
  'lateral cuneiform bone': { bg: 'Латерална клиновидна кост', latin: 'Os cuneiforme laterale' },
  'cuboid bone': { bg: 'Кубовидна кост', latin: 'Os cuboideum' },

  // Cartilages
  'cricoid cartilage': { bg: 'Пръстеновиден хрущял', latin: 'Cartilago cricoidea' },
  'thyroid cartilage': { bg: 'Щитовиден хрущял', latin: 'Cartilago thyroidea' },
  'arytenoid cartilage': { bg: 'Пирамидален хрущял', latin: 'Cartilago arytenoidea' },
  'corniculate cartilage': { bg: 'Рогчест хрущял', latin: 'Cartilago corniculata' },
  'cuneiform cartilage': { bg: 'Клиновиден хрущял на ларинкса', latin: 'Cartilago cuneiformis' },
  'epiglottis': { bg: 'Надгръклянник (Епиглотис)', latin: 'Epiglottis' },

  // Major Muscles
  'biceps brachii': { bg: 'Двуглав мишничен мускул', latin: 'M. biceps brachii' },
  'triceps brachii': { bg: 'Триглав мишничен мускул', latin: 'M. triceps brachii' },
  'brachialis': { bg: 'Мишничен мускул', latin: 'M. brachialis' },
  'coracobrachialis': { bg: 'Клюновидно-мишничен мускул', latin: 'M. coracobrachialis' },
  'deltoid': { bg: 'Делтовиден мускул', latin: 'M. deltoideus' },
  'pectoralis major': { bg: 'Голям гръден мускул', latin: 'M. pectoralis major' },
  'pectoralis minor': { bg: 'Малък гръден мускул', latin: 'M. pectoralis minor' },
  'subclavius': { bg: 'Подключичен мускул', latin: 'M. subclavius' },
  'serratus anterior': { bg: 'Преден зъбчат мускул', latin: 'M. serratus anterior' },
  'serratus posterior': { bg: 'Заден зъбчат мускул', latin: 'M. serratus posterior' },
  'trapezius': { bg: 'Трапецовиден мускул', latin: 'M. trapezius' },
  'latissimus dorsi': { bg: 'Широк гръбен мускул', latin: 'M. latissimus dorsi' },
  'rhomboid major': { bg: 'Голям ромбовиден мускул', latin: 'M. rhomboideus major' },
  'rhomboid minor': { bg: 'Малък ромбовиден мускул', latin: 'M. rhomboideus minor' },
  'levator scapulae': { bg: 'Повдигач на лопатката', latin: 'M. levator scapulae' },
  'supraspinatus': { bg: 'Надбодлест мускул', latin: 'M. supraspinatus' },
  'infraspinatus': { bg: 'Подбодлест мускул', latin: 'M. infraspinatus' },
  'teres major': { bg: 'Голям кръгъл мускул', latin: 'M. teres major' },
  'teres minor': { bg: 'Малък кръгъл мускул', latin: 'M. teres minor' },
  'subscapularis': { bg: 'Подлопатъчен мускул', latin: 'M. subscapularis' },
  'rectus abdominis': { bg: 'Прав коремен мускул', latin: 'M. rectus abdominis' },
  'external oblique': { bg: 'Външен кос коремен мускул', latin: 'M. obliquus externus abdominis' },
  'internal oblique': { bg: 'Вътрешен кос коремен мускул', latin: 'M. obliquus internus abdominis' },
  'transversus abdominis': { bg: 'Напречен коремен мускул', latin: 'M. transversus abdominis' },
  'linea alba': { bg: 'Бяла линия на корема', latin: 'Linea alba' },
  'quadratus lumborum': { bg: 'Квадратен поясен мускул', latin: 'M. quadratus lumborum' },
  'psoas major': { bg: 'Голям поясен мускул', latin: 'M. psoas major' },
  'psoas minor': { bg: 'Малък поясен мускул', latin: 'M. psoas minor' },
  'iliacus': { bg: 'Хълбочен мускул', latin: 'M. iliacus' },

  'gluteus maximus': { bg: 'Голям седалищен мускул', latin: 'M. gluteus maximus' },
  'gluteus medius': { bg: 'Среден седалищен мускул', latin: 'M. gluteus medius' },
  'gluteus minimus': { bg: 'Малък седалищен мускул', latin: 'M. gluteus minimus' },
  'piriformis': { bg: 'Крушовиден мускул', latin: 'M. piriformis' },
  'obturator internus': { bg: 'Вътрешен запушващ мускул', latin: 'M. obturatorius internus' },
  'obturator externus': { bg: 'Външен запушващ мускул', latin: 'M. obturatorius externus' },
  'gemellus superior': { bg: 'Горен мускул близнак', latin: 'M. gemellus superior' },
  'gemellus inferior': { bg: 'Долен мускул близнак', latin: 'M. gemellus inferior' },
  'quadratus femoris': { bg: 'Квадратен бедрен мускул', latin: 'M. quadratus femoris' },
  'tensor fasciae latae': { bg: 'Обтегач на широката бедрена фасция', latin: 'M. tensor fasciae latae' },

  'rectus femoris': { bg: 'Прав бедрен мускул', latin: 'M. rectus femoris' },
  'vastus lateralis': { bg: 'Страничен широк бедрен мускул', latin: 'M. vastus lateralis' },
  'vastus medialis': { bg: 'Медиален широк бедрен мускул', latin: 'M. vastus medialis' },
  'vastus intermedius': { bg: 'Междинен широк бедрен мускул', latin: 'M. vastus intermedius' },
  'sartorius': { bg: 'Шивашки мускул', latin: 'M. sartorius' },
  'biceps femoris': { bg: 'Двуглав бедрен мускул', latin: 'M. biceps femoris' },
  'semitendinosus': { bg: 'Полусухожилен мускул', latin: 'M. semitendinosus' },
  'semimembranosus': { bg: 'Полуципест мускул', latin: 'M. semimembranosus' },
  'gracilis': { bg: 'Нежен (стройен) мускул', latin: 'M. gracilis' },
  'pectineus': { bg: 'Гребенест мускул', latin: 'M. pectineus' },
  'adductor longus': { bg: 'Дълъг привеждач', latin: 'M. adductor longus' },
  'adductor brevis': { bg: 'Къс привеждач', latin: 'M. adductor brevis' },
  'adductor magnus': { bg: 'Голям привеждач', latin: 'M. adductor magnus' },

  'gastrocnemius': { bg: 'Двуглав прасцев мускул', latin: 'M. gastrocnemius' },
  'soleus': { bg: 'Листовиден мускул', latin: 'M. soleus' },
  'plantaris': { bg: 'Ходилен мускул', latin: 'M. plantaris' },
  'popliteus': { bg: 'Задколянен мускул', latin: 'M. popliteus' },
  'tibialis anterior': { bg: 'Преден голямопищялен мускул', latin: 'M. tibialis anterior' },
  'tibialis posterior': { bg: 'Заден голямопищялен мускул', latin: 'M. tibialis posterior' },
  'fibularis longus': { bg: 'Дълъг малкопищялен мускул', latin: 'M. fibularis longus' },
  'fibularis brevis': { bg: 'Къс малкопищялен мускул', latin: 'M. fibularis brevis' },
  'fibularis tertius': { bg: 'Трети малкопищялен мускул', latin: 'M. fibularis tertius' },

  'sternocleidomastoid': { bg: 'Гръдно-ключично-сисовиден мускул', latin: 'M. sternocleidomastoideus' },
  'platysma': { bg: 'Подкожен шиен мускул (Платизма)', latin: 'Platysma' },
  'masseter': { bg: 'Дъвкателен мускул', latin: 'M. masseter' },
  'temporalis': { bg: 'Слепоочен мускул', latin: 'M. temporalis' },
  'medial pterygoid': { bg: 'Медиален криловиден мускул', latin: 'M. pterygoideus medialis' },
  'lateral pterygoid': { bg: 'Латерален криловиден мускул', latin: 'M. pterygoideus lateralis' },
  'buccinator': { bg: 'Тръбачески мускул', latin: 'M. buccinator' },
  'orbicularis oris': { bg: 'Кръгов мускул на устата', latin: 'M. orbicularis oris' },
  'orbicularis oculi': { bg: 'Кръгов мускул на окото', latin: 'M. orbicularis oculi' },

  'pronator teres': { bg: 'Кръгъл пронатор', latin: 'M. pronator teres' },
  'pronator quadratus': { bg: 'Квадратен пронатор', latin: 'M. pronator quadratus' },
  'supinator': { bg: 'Супинатор', latin: 'M. supinator' },
  'brachioradialis': { bg: 'Мишнично-лъчев мускул', latin: 'M. brachioradialis' },
  'anconeus': { bg: 'Лакътен мускул', latin: 'M. anconeus' },
  'palmaris longus': { bg: 'Дълъг дланен мускул', latin: 'M. palmaris longus' },
  'iliotibial tract': { bg: 'Хълбочно-пищялно сухожилие', latin: 'Tractus iliotibialis' },

  // Spine deep & intercostals
  'external intercostal muscle': { bg: 'Външен междуребрен мускул', latin: 'M. intercostalis externus' },
  'internal intercostal muscle': { bg: 'Вътрешен междуребрен мускул', latin: 'M. intercostalis internus' },
  'innermost intercostal muscle': { bg: 'Най-вътрешен междуребрен мускул', latin: 'M. intercostalis intimus' },
  'spinalis': { bg: 'Бодлест мускул на гърба', latin: 'M. spinalis' },
  'longissimus': { bg: 'Най-дълъг мускул на гърба', latin: 'M. longissimus' },
  'iliocostalis': { bg: 'Хълбочно-ребрен мускул', latin: 'M. iliocostalis' },
  'splenius capitis': { bg: 'Ремъчен мускул на главата', latin: 'M. splenius capitis' },
  'splenius cervicis': { bg: 'Ремъчен мускул на шията', latin: 'M. splenius cervicis' },
  'levator ani': { bg: 'Повдигач на ануса', latin: 'M. levator ani' },
  'external anal sphincter': { bg: 'Външен сфинктер на ануса', latin: 'M. sphincter ani externus' },
  'superficial perineal muscle': { bg: 'Повърхностен мускул на перинеума', latin: 'M. transversus perinei superficialis' },
  'thoracic rotator': { bg: 'Гръден ротаторен мускул', latin: 'M. rotator thoracis' },

  // Organs & Heart
  'heart': { bg: 'Сърце', latin: 'Cor' },
  'brain': { bg: 'Главен мозък', latin: 'Encephalon' },
  'cerebellum': { bg: 'Малък мозък', latin: 'Cerebellum' },
  'pons': { bg: 'Мост (Понс)', latin: 'Pons' },
  'medulla oblongata': { bg: 'Продълговат мозък', latin: 'Medulla oblongata' },
  'thalamus': { bg: 'Таламус', latin: 'Thalamus' },
  'hypothalamus': { bg: 'Хипоталамус', latin: 'Hypothalamus' },
  'corpus callosum': { bg: 'Мазолесто тяло', latin: 'Corpus callosum' },
  'hippocampus': { bg: 'Хипокамп', latin: 'Hippocampus' },
  'third ventricle': { bg: 'Трети мозъчен вентрикул', latin: 'Ventriculus tertius' },
  'fourth ventricle': { bg: 'Четвърти мозъчен вентрикул', latin: 'Ventriculus quartus' },
  'lateral ventricle': { bg: 'Страничен мозъчен вентрикул', latin: 'Ventriculus lateralis' },
  'anterior commissure': { bg: 'Предна мозъчна комисура', latin: 'Commissura anterior' },
  'spinal cord': { bg: 'Гръбначен мозък', latin: 'Medulla spinalis' },

  'liver': { bg: 'Черен дроб', latin: 'Hepar' },
  'gallbladder': { bg: 'Жлъчен мехур', latin: 'Vesica biliaris / fellea' },
  'stomach': { bg: 'Стомах', latin: 'Gaster' },
  'spleen': { bg: 'Слезка (далак)', latin: 'Lien / Splen' },
  'pancreas': { bg: 'Панкреас', latin: 'Pancreas' },
  'urinary bladder': { bg: 'Пикочен мехур', latin: 'Vesica urinaria' },
  'ureter': { bg: 'Пикочопровод', latin: 'Ureter' },
  'urethra': { bg: 'Пикочен канал (уретра)', latin: 'Urethra' },
  'trachea': { bg: 'Трахея', latin: 'Trachea' },
  'kidney': { bg: 'Бъбрек', latin: 'Ren' },
  'lung': { bg: 'Бял дроб', latin: 'Pulmo' },
  'right lung': { bg: 'Десен бял дроб', latin: 'Pulmo dexter' },
  'left lung': { bg: 'Ляв бял дроб', latin: 'Pulmo sinister' },
  'esophagus': { bg: 'Хранопровод', latin: 'Oesophagus' },
  'duodenum': { bg: 'Дванадесетопръстник', latin: 'Duodenum' },
  'jejunum': { bg: 'Празно черво', latin: 'Jejunum' },
  'ileum': { bg: 'Хълбочно черво', latin: 'Ileum' },
  'cecum': { bg: 'Сляпо черво', latin: 'Caecum' },
  'appendix': { bg: 'Апендикс', latin: 'Appendix vermiformis' },
  'colon': { bg: 'Ободно черво', latin: 'Colon' },
  'rectum': { bg: 'Право черво', latin: 'Rectum' },
  'prostate': { bg: 'Простатна жлеза', latin: 'Prostata' },
  'testis': { bg: 'Семенник (тестис)', latin: 'Testis' },
  'epididymis': { bg: 'Надсеменник', latin: 'Epididymis' },
  'thyroid gland': { bg: 'Щитовидна жлеза', latin: 'Glandula thyroidea' },
  'thymus': { bg: 'Тимус', latin: 'Thymus' },

  // Heart valves & vessels
  'aorta': { bg: 'Аорта', latin: 'Aorta' },
  'arch of aorta': { bg: 'Аортна дъга', latin: 'Arcus aortae' },
  'ascending aorta': { bg: 'Възходяща аорта', latin: 'Aorta ascendens' },
  'descending aorta': { bg: 'Низходяща аорта', latin: 'Aorta descendens' },
  'inferior vena cava': { bg: 'Долна куха вена', latin: 'Vena cava inferior' },
  'superior vena cava': { bg: 'Горна куха вена', latin: 'Vena cava superior' },
  'pulmonary trunk': { bg: 'Белодробен ствол', latin: 'Truncus pulmonalis' },
  'aortic valve': { bg: 'Аортна клапа', latin: 'Valva aortae' },
  'mitral valve': { bg: 'Митрална клапа', latin: 'Valva mitralis' },
  'tricuspid valve': { bg: 'Трикуспидална клапа', latin: 'Valva tricuspidalis' },
  'pulmonary valve': { bg: 'Белодробна клапа', latin: 'Valva trunci pulmonalis' },
  'bronchial tree': { bg: 'Бронхиално дърво', latin: 'Arbor bronchialis' }
};

// Sort keys descending so longer phrases match first
const SORTED_KEYS = Object.keys(CANONICAL_MAP).sort((a, b) => b.length - a.length);

const NUM_BG = {
  first: 'I', second: 'II', third: 'III', fourth: 'IV', fifth: 'V', sixth: 'VI',
  seventh: 'VII', eighth: 'VIII', ninth: 'IX', tenth: 'X', eleventh: 'XI', twelfth: 'XII'
};

function translateTerm(rawName) {
  if (!rawName) return { bg: '', latin: '' };
  const raw = rawName.trim();
  const lower = raw.toLowerCase();

  const isLeft = lower.startsWith('left ') || lower.includes(' of left ') || lower.includes(' left ');
  const isRight = lower.startsWith('right ') || lower.includes(' of right ') || lower.includes(' right ');

  const sideBgMasc = isLeft ? 'ляв' : isRight ? 'десен' : '';
  const sideBgFem = isLeft ? 'лява' : isRight ? 'дясна' : '';
  const sideBgNeut = isLeft ? 'ляво' : isRight ? 'дясно' : '';

  const sideLatMasc = isLeft ? 'sinister' : isRight ? 'dexter' : '';
  const sideLatFem = isLeft ? 'sinistra' : isRight ? 'dextra' : '';
  const sideLatNeut = isLeft ? 'sinistrum' : isRight ? 'dextrum' : '';

  // Clean base
  let clean = lower
    .replace(/^left\s+/i, '')
    .replace(/^right\s+/i, '')
    .replace(/\s+of\s+left\s+/i, ' of ')
    .replace(/\s+of\s+right\s+/i, ' of ')
    .replace(/\s+of\s+left$/i, '')
    .replace(/\s+of\s+right$/i, '')
    .trim();

  // 1. Vertebrae
  const vertMatch = clean.match(/(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|eleventh|twelfth)\s+(cervical|thoracic|lumbar)\s+vertebra/i);
  if (vertMatch) {
    const num = vertMatch[1].toLowerCase();
    const type = vertMatch[2].toLowerCase();
    const typeBg = type === 'cervical' ? 'шиен' : type === 'thoracic' ? 'гръден' : 'поясен';
    const typeLat = type === 'cervical' ? 'cervicalis' : type === 'thoracic' ? 'thoracica' : 'lumbaris';
    return {
      bg: `${NUM_BG[num]} ${typeBg} прешлен`,
      latin: `Vertebra ${typeLat} ${NUM_BG[num]}`
    };
  }

  // Intervertebral disks
  if (clean.includes('intervertebral disk')) {
    const ofIdx = clean.indexOf(' of ');
    if (ofIdx !== -1) {
      const rest = clean.slice(ofIdx + 4);
      const sub = translateTerm(rest);
      return {
        bg: `Междупрешленен диск (${sub.bg})`,
        latin: `Discus intervertebralis (${sub.latin})`
      };
    }
    return {
      bg: 'Междупрешленен диск',
      latin: 'Discus intervertebralis'
    };
  }

  // 2. Ribs
  const ribMatch = clean.match(/(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|eleventh|twelfth)\s+rib/i);
  if (ribMatch) {
    const num = ribMatch[1].toLowerCase();
    return {
      bg: `${NUM_BG[num]} ребро${sideBgNeut ? ` (${sideBgNeut})` : ''}`,
      latin: `Costa ${NUM_BG[num]}${sideLatFem ? ` ${sideLatFem}` : ''}`
    };
  }

  // Costal cartilages
  const costCartMatch = clean.match(/(first|second|third|fourth|fifth|sixth|seventh)\s+costal\s+cartilage/i);
  if (costCartMatch) {
    const num = costCartMatch[1].toLowerCase();
    return {
      bg: `${NUM_BG[num]} ребрен хрущял${sideBgMasc ? ` (${sideBgMasc})` : ''}`,
      latin: `Cartilago costalis ${NUM_BG[num]}${sideLatFem ? ` ${sideLatFem}` : ''}`
    };
  }

  // 3. Metacarpals & Metatarsals
  const metaMatch = clean.match(/(first|second|third|fourth|fifth)\s+(metacarpal|metatarsal)\s+bone/i);
  if (metaMatch) {
    const num = metaMatch[1].toLowerCase();
    const isMeta = metaMatch[2].toLowerCase() === 'metacarpal';
    return {
      bg: `${NUM_BG[num]} ${isMeta ? 'предкиткена' : 'предходилна'} кост${sideBgFem ? ` (${sideBgFem})` : ''}`,
      latin: `Os ${isMeta ? 'metacarpale' : 'metatarsale'} ${NUM_BG[num]}${sideLatNeut ? ` ${sideLatNeut}` : ''}`
    };
  }

  // 4. Phalanges
  const phalanxMatch = clean.match(/(distal|middle|proximal)\s+phalanx\s+of\s+(.+)/i);
  if (phalanxMatch) {
    const pType = phalanxMatch[1].toLowerCase();
    const pTypeBg = pType === 'distal' ? 'Дистална' : pType === 'middle' ? 'Средна' : 'Проксимална';
    const pTypeLat = pType === 'distal' ? 'distalis' : pType === 'middle' ? 'media' : 'proximalis';
    const digitName = phalanxMatch[2].trim();
    return {
      bg: `${pTypeBg} фаланга (${digitName})${sideBgFem ? ` (${sideBgFem})` : ''}`,
      latin: `Phalanx ${pTypeLat}${sideLatFem ? ` ${sideLatFem}` : ''} (${digitName})`
    };
  }

  // 5. Teeth & Gingiva
  if (clean.includes('tooth')) {
    const toothType = clean.includes('incisor') ? 'резец' : clean.includes('canine') ? 'кучешки зъб' : clean.includes('premolar') ? 'предкътник (премолар)' : 'кътник (молар)';
    const arch = clean.includes('upper') ? 'горен' : 'долен';
    return {
      bg: `${toothType.charAt(0).toUpperCase() + toothType.slice(1)} (${arch}${sideBgMasc ? `, ${sideBgMasc}` : ''})`,
      latin: `Dens ${clean.includes('incisor') ? 'incisivus' : clean.includes('canine') ? 'caninus' : clean.includes('premolar') ? 'premolaris' : 'molaris'}${sideLatMasc ? ` ${sideLatMasc}` : ''}`
    };
  }
  if (clean.includes('gingiva')) {
    const arch = clean.includes('upper') ? 'горна' : 'долна';
    return {
      bg: `Венец на ${arch} челюст`,
      latin: `Gingiva ${arch === 'горна' ? 'maxillae' : 'mandibulae'}`
    };
  }

  // 6. Check sorted canonical map with word boundaries
  for (const key of SORTED_KEYS) {
    const regex = new RegExp(`\\b${key}\\b`, 'i');
    if (clean === key || regex.test(clean)) {
      const val = CANONICAL_MAP[key];
      const isFem = val.bg.endsWith('кост') || val.bg.endsWith('артерия') || val.bg.endsWith('вена') || val.bg.endsWith('капачка') || val.bg.endsWith('жлеза') || val.bg.endsWith('клапа') || val.bg.endsWith('линия');
      const isNeut = val.bg.endsWith('ребро') || val.bg.endsWith('тяло') || val.bg.endsWith('сърце') || val.bg.endsWith('черво') || val.bg.endsWith('дърво');
      const sideBg = isNeut ? sideBgNeut : isFem ? sideBgFem : sideBgMasc;
      const sideLat = isNeut ? sideLatNeut : isFem ? sideLatFem : sideLatMasc;

      let bgRes = val.bg;
      let latRes = val.latin;

      if (clean.startsWith('long head of')) {
        bgRes = `Дълга глава на ${val.bg}`;
        latRes = `Caput longum ${val.latin}`;
      } else if (clean.startsWith('short head of')) {
        bgRes = `Къса глава на ${val.bg}`;
        latRes = `Caput breve ${val.latin}`;
      } else if (clean.startsWith('lateral head of')) {
        bgRes = `Латерална глава на ${val.bg}`;
        latRes = `Caput laterale ${val.latin}`;
      } else if (clean.startsWith('medial head of')) {
        bgRes = `Медиална глава на ${val.bg}`;
        latRes = `Caput mediale ${val.latin}`;
      } else if (clean.startsWith('clavicular part of')) {
        bgRes = `Ключична част на ${val.bg}`;
        latRes = `Pars clavicularis ${val.latin}`;
      } else if (clean.startsWith('sternocostal part of')) {
        bgRes = `Гръдно-ребрена част на ${val.bg}`;
        latRes = `Pars sternocostalis ${val.latin}`;
      } else if (clean.startsWith('abdominal part of')) {
        bgRes = `Коремна част на ${val.bg}`;
        latRes = `Pars abdominalis ${val.latin}`;
      } else if (clean.startsWith('acromial part of')) {
        bgRes = `Акромиална част на ${val.bg}`;
        latRes = `Pars acromialis ${val.latin}`;
      } else if (clean.startsWith('spinal part of')) {
        bgRes = `Гръбначна (бодлеста) част на ${val.bg}`;
        latRes = `Pars spinalis ${val.latin}`;
      } else if (clean.startsWith('ascending part of')) {
        bgRes = `Възходяща част на ${val.bg}`;
        latRes = `Pars ascendens ${val.latin}`;
      } else if (clean.startsWith('descending part of')) {
        bgRes = `Низходяща част на ${val.bg}`;
        latRes = `Pars descendens ${val.latin}`;
      } else if (clean.startsWith('transverse part of')) {
        bgRes = `Напречна част на ${val.bg}`;
        latRes = `Pars transversa ${val.latin}`;
      } else if (clean.startsWith('zone of')) {
        bgRes = `Зона на ${val.bg}`;
        latRes = `Regio ${val.latin}`;
      } else if (clean.startsWith('tendon of')) {
        bgRes = `Сухожилие на ${val.bg}`;
        latRes = `Tendo ${val.latin}`;
      }

      return {
        bg: sideBg ? `${bgRes} (${sideBg})` : bgRes,
        latin: sideLat ? `${latRes} (${sideLat})` : latRes
      };
    }
  }

  // 7. Arteries
  if (clean.includes('artery')) {
    const artBase = clean.replace('artery', '').replace('branch of', 'клон на').trim();
    const capArt = artBase.charAt(0).toUpperCase() + artBase.slice(1);
    return {
      bg: `${capArt} артерия${sideBgFem ? ` (${sideBgFem})` : ''}`,
      latin: `Arteria ${artBase}${sideLatFem ? ` ${sideLatFem}` : ''}`
    };
  }

  // 8. Veins
  if (clean.includes('vein')) {
    const veinBase = clean.replace('vein', '').trim();
    const capVein = veinBase.charAt(0).toUpperCase() + veinBase.slice(1);
    return {
      bg: `${capVein} вена${sideBgFem ? ` (${sideBgFem})` : ''}`,
      latin: `Vena ${veinBase}${sideLatFem ? ` ${sideLatFem}` : ''}`
    };
  }

  // 9. Nerves
  if (clean.includes('nerve')) {
    const nerveBase = clean.replace('nerve', '').trim();
    const capNerve = nerveBase.charAt(0).toUpperCase() + nerveBase.slice(1);
    return {
      bg: `${capNerve} нерв${sideBgMasc ? ` (${sideBgMasc})` : ''}`,
      latin: `Nervus ${nerveBase}${sideLatMasc ? ` ${sideLatMasc}` : ''}`
    };
  }

  // 10. Ligaments
  if (clean.includes('ligament')) {
    const ligBase = clean.replace('ligament', '').trim();
    const capLig = ligBase.charAt(0).toUpperCase() + ligBase.slice(1);
    return {
      bg: `Връзка (лигамент) ${capLig}${sideBgFem ? ` (${sideBgFem})` : ''}`,
      latin: `Ligamentum ${ligBase}${sideLatNeut ? ` ${sideLatNeut}` : ''}`
    };
  }

  // Default fallback
  const cap = clean.charAt(0).toUpperCase() + clean.slice(1);
  return {
    bg: sideBgMasc ? `${cap} (${sideBgMasc})` : cap,
    latin: sideLatMasc ? `${cap} (${sideLatMasc})` : cap
  };
}

// Generate the whole translation map for all parts and concepts
const dict = {};

atlas.parts.forEach(p => {
  const t = translateTerm(p.name);
  dict[p.name] = t;
  dict[p.name.toLowerCase()] = t;
});

atlas.concepts.forEach(c => {
  const t = translateTerm(c.name);
  dict[c.name] = t;
  dict[c.name.toLowerCase()] = t;
});

console.log(`Generated translations for ${Object.keys(dict).length} unique anatomical terms and aliases.`);

// Check samples
console.log('\nVerified Sample Translations:');
['Left femur', 'Long head of right biceps brachii', 'Frontal bone', 'Tenth thoracic vertebra', 'Heart', 'heart', 'Sternum', 'sternum', 'Aortic valve', 'Mitral valve', 'Third ventricle', 'Spinalis'].forEach(sample => {
  console.log(`- ${sample} => BG: "${dict[sample]?.bg}", Latin: "${dict[sample]?.latin}"`);
});

// Save as JSON dictionary
fs.writeFileSync('public/models/translations.json', JSON.stringify(dict, null, 2));

// Generate TypeScript module app/translations.ts
const tsContent = `// Bulgarian & Latin Anatomical Translations Dictionary
// Generated for complete human atlas localization

export interface TermTranslation {
  bg: string;
  latin: string;
}

// Pre-compiled fast dictionary
import translationsData from '../public/models/translations.json';

const TRANSLATIONS: Record<string, TermTranslation> = translationsData as Record<string, TermTranslation>;

export function getTranslation(name: string): TermTranslation {
  if (!name) return { bg: '', latin: '' };
  const found = TRANSLATIONS[name] || TRANSLATIONS[name.toLowerCase()];
  if (found) return found;
  return { bg: name, latin: name };
}

export function formatBilingualName(name: string): { primary: string; secondary: string } {
  const trans = getTranslation(name);
  if (trans.latin && trans.latin !== trans.bg) {
    return {
      primary: trans.bg,
      secondary: trans.latin
    };
  }
  return {
    primary: trans.bg || name,
    secondary: trans.latin || name
  };
}
`;

fs.writeFileSync('app/translations.ts', tsContent);
console.log('Saved app/translations.ts and public/models/translations.json successfully.');
