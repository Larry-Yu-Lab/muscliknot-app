const fs = require('fs');

const zhTitles = {
  n1: '颈部倾斜', n2: '颈部旋转', n3: '瑜伽颈部绕环', n4: '收下巴训练', n5: '侧颈抗阻',
  s1: '肩部绕环', s2: '交叉伸臂', s3: '绕臂', s4: '鹰式手臂伸展', s5: '靠墙天使',
  s6: '侧平举', s7: '单杠悬垂',
  ub1: '猫牛式', ub2: '胸椎伸展', ub3: '弹力带面拉', ub4: '穿针引线式', ub5: '肩胛骨后缩',
  ub6: '俯身划船',
  lb1: '婴儿式', lb2: '仰卧抱膝', lb3: '髋关节铰链热身', lb4: '仰卧脊柱扭转', lb5: '骨盆中立位训练',
  lb6: '鸟狗式',
  h1: '低弓步屈髋伸展', h2: '腿部摆动', h3: '鸽子式', h4: '蚌式', h5: '侧步走',
  g1: '四字伸展', g2: '臀桥热身', g3: '快乐婴儿式', g4: '单腿臀桥', g5: '臀推',
  l1: '腿筋伸展', l2: '站立股四头肌伸展', l3: '高抬腿', l4: '低弓步瑜伽', l5: '相扑深蹲',
  l6: '保加利亚分腿蹲',
  ab1: '眼镜蛇式', ab2: '死虫动作', ab3: '船式', ab4: '抗旋推举', ab5: '平板支撑',
  ca1: '靠墙小腿拉伸', ca2: '提踵热身', ca3: '下犬式踩踏', ca4: '台阶小腿离心下落', ca5: '负重提踵',
  ft1: '足底筋膜拉伸', ft2: '脚趾张开与蜷缩', ft3: '雷电坐脚趾伸展', ft4: '短足训练', ft5: '毛巾抓取',
  y1: '拜日式', y2: '战士二式', w1: '动态热身', w2: '尺蠖爬行', p1: '伏案姿势纠正', st1: '核心爆发'
};

const frTitles = {
  n1: 'Inclinaisons du cou', n2: 'Rotations du cou', n3: 'Rouleaux de cou Yoga', n4: 'Exercice du menton rentré', n5: 'Résistance latérale du cou',
  s1: 'Roulements d’épaules', s2: 'Étirement bras croisés', s3: 'Cercles avec les bras', s4: 'Étirement bras d’aigle', s5: 'Ange contre le mur',
  s6: 'Élévation latérale', s7: 'Suspension',
  ub1: 'Étirement Chat-Vache', ub2: 'Extension thoracique', ub3: 'Tirage visage avec bande', ub4: 'Enfiler l’aiguille', ub5: 'Rétraction de l’omoplate',
  ub6: 'Rowing buste penché',
  lb1: 'Pose de l’enfant', lb2: 'Genoux à la poitrine', lb3: 'Échauffement charnière de hanche', lb4: 'Torsion vertébrale sur le dos', lb5: 'Exercice bassin neutre',
  lb6: 'Bird-Dog',
  h1: 'Fente basse', h2: 'Balancements de jambes', h3: 'Pose du pigeon', h4: 'Coquillage', h5: 'Marche latérale avec bande',
  g1: 'Étirement en quatre', g2: 'Échauffement pont fessier', g3: 'Pose du bébé heureux', g4: 'Pont fessier une jambe', g5: 'Hip Thrust',
  l1: 'Étirement ischio-jambiers', l2: 'Étirement quadriceps debout', l3: 'Montées de genoux', l4: 'Fente basse quad yoga', l5: 'Maintien squat sumo',
  l6: 'Squat bulgare',
  ab1: 'Étirement du cobra', ab2: 'Échauffement insecte mort', ab3: 'Pose du bateau', ab4: 'Presse Pallof', ab5: 'Planche',
  ca1: 'Étirement mollet mur', ca2: 'Échauffement extension mollet', ca3: 'Marche mollet chien tête en bas', ca4: 'Descente talon sur marche', ca5: 'Extension mollet lestée',
  ft1: 'Étirement fascia plantaire', ft2: 'Écartement et scrunch orteils', ft3: 'Étirement orteils foudre', ft4: 'Exercice pied court', ft5: 'Froissement de serviette',
  y1: 'Salutation au soleil', y2: 'Guerrier II', w1: 'Échauffement dynamique', w2: 'Chenille', p1: 'Correction posture de bureau', st1: 'Explosion du tronc'
};

const esTitles = {
  n1: 'Inclinaciones de cuello', n2: 'Rotaciones de cuello', n3: 'Giros de cuello Yoga', n4: 'Ejercicio de barbilla hacia adentro', n5: 'Resistencia lateral de cuello',
  s1: 'Giros de hombros', s2: 'Estiramiento de brazo cruzado', s3: 'Círculos con brazos', s4: 'Brazos de águila', s5: 'Ángel en la pared',
  s6: 'Elevación lateral', s7: 'Suspensión',
  ub1: 'Estiramiento Gato-Vaca', ub2: 'Extensión torácica', ub3: 'Tirón facial con banda', ub4: 'Enhebrar la aguja', ub5: 'Retracción escapular',
  ub6: 'Remo inclinado',
  lb1: 'Postura del niño', lb2: 'Rodillas al pecho', lb3: 'Calentamiento bisagra de cadera', lb4: 'Torsión espinal supina', lb5: 'Ejercicio pelvis neutra',
  lb6: 'Perro de muestra',
  h1: 'Zancada baja cadera', h2: 'Balanceos de piernas', h3: 'Postura de paloma', h4: 'Concha', h5: 'Paseo lateral con banda',
  g1: 'Estiramiento en cuatro', g2: 'Calentamiento puente de glúteos', g3: 'Postura del bebé feliz', g4: 'Puente de glúteos a una pierna', g5: 'Empuje de cadera',
  l1: 'Estiramiento de isquiotibiales', l2: 'Estiramiento de cuádriceps de pie', l3: 'Rodillas altas', l4: 'Zancada baja yoga', l5: 'Postura sentadilla sumo',
  l6: 'Sentadilla dividida búlgara',
  ab1: 'Estiramiento de cobra', ab2: 'Calentamiento insecto muerto', ab3: 'Postura del barco', ab4: 'Prensa Pallof', ab5: 'Plancha',
  ca1: 'Estiramiento de gemelos en pared', ca2: 'Calentamiento elevación gemelos', ca3: 'Paso gemelos perro boca abajo', ca4: 'Caída de talón en escalón', ca5: 'Elevación de gemelos con peso',
  ft1: 'Estiramiento fascia plantar', ft2: 'Apertura y pliegue de dedos', ft3: 'Estiramiento dedos rayo', ft4: 'Ejercicio pie corto', ft5: 'Arrugado de toalla',
  y1: 'Saludo al sol', y2: 'Guerrero II', w1: 'Calentamiento dinámico', w2: 'Oruga', p1: 'Corrección postura escritorio', st1: 'Explosión del núcleo'
};

let content = fs.readFileSync('utils/i18n.ts', 'utf8');

function inject(lang, dict) {
  let str = '';
  for (let key in dict) {
    str += `        ex_${key}_title: '${dict[key].replace(/'/g, "\\'")}',\n`;
  }
  const regex = new RegExp(`(    ${lang}: \\{)`);
  content = content.replace(regex, `$1\n${str}`);
}

inject('zh', zhTitles);
inject('fr', frTitles);
inject('es', esTitles);

fs.writeFileSync('utils/i18n.ts', content);
