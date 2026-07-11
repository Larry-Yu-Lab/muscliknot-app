const fs = require('fs');
let content = fs.readFileSync('utils/i18n.ts', 'utf8');

// The new translations we need to add to each language map
const newTranslations = {
  en: {
    inst_step1: 'Get into a comfortable starting position.',
    inst_step3: 'Breathe deeply and maintain the position for the duration.',
    inst_step4: 'Relax and repeat as necessary.',
    db_neck_title: 'Neck Release & Stretch',
    db_neck_desc: 'Gentle neck stretches to relieve tension from looking down at screens.',
    db_lower_back_title: 'Lower Back Decompression',
    db_lower_back_desc: 'Relieve pressure in the lower back with these gentle movements.',
    db_leg_title: 'Full Leg Flush',
    db_leg_desc: 'Improve circulation and reduce soreness in the legs.'
  },
  zh: {
    inst_step1: '找到一个舒适的起始姿势。',
    inst_step3: '深呼吸并在该持续时间内保持姿势。',
    inst_step4: '放松并根据需要重复。',
    db_neck_title: '颈部放松与拉伸',
    db_neck_desc: '温和的颈部拉伸，缓解看屏幕带来的紧张感。',
    db_lower_back_title: '下背部减压',
    db_lower_back_desc: '通过这些轻柔的动作缓解下背部压力。',
    db_leg_title: '全腿血液循环',
    db_leg_desc: '促进腿部血液循环，减少酸痛。'
  },
  fr: {
    inst_step1: 'Installez-vous dans une position de départ confortable.',
    inst_step3: 'Respirez profondément et maintenez la position pendant toute la durée.',
    inst_step4: 'Détendez-vous et répétez si nécessaire.',
    db_neck_title: 'Relâchement et étirement du cou',
    db_neck_desc: 'Étirements doux du cou pour soulager la tension causée par le fait de regarder les écrans.',
    db_lower_back_title: 'Décompression du bas du dos',
    db_lower_back_desc: 'Soulagez la pression dans le bas du dos avec ces mouvements doux.',
    db_leg_title: 'Vidange complète des jambes',
    db_leg_desc: 'Améliorez la circulation et réduisez la douleur dans les jambes.'
  },
  es: {
    inst_step1: 'Póngase en una posición inicial cómoda.',
    inst_step3: 'Respire profundamente y mantenga la posición durante la duración.',
    inst_step4: 'Relájese y repita según sea necesario.',
    db_neck_title: 'Liberación y estiramiento del cuello',
    db_neck_desc: 'Estiramientos suaves del cuello para aliviar la tensión por mirar las pantallas.',
    db_lower_back_title: 'Descompresión de la zona lumbar',
    db_lower_back_desc: 'Alivie la presión en la zona lumbar con estos movimientos suaves.',
    db_leg_title: 'Descarga completa de piernas',
    db_leg_desc: 'Mejore la circulación y reduzca el dolor en las piernas.'
  }
};

['en', 'zh', 'fr', 'es'].forEach(lang => {
    // Find the regex for the start of the language map, e.g. `    en: {`
    const regex = new RegExp(`    ${lang}: \\{`);
    // Format the new properties
    const props = Object.entries(newTranslations[lang]).map(([k, v]) => `        ${k}: \`${v}\`,`).join('\n');
    content = content.replace(regex, `    ${lang}: {\n${props}`);
});

fs.writeFileSync('utils/i18n.ts', content);
