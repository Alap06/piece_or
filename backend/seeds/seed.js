require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Piece = require('../models/Piece');
const Setting = require('../models/Setting');

const pieces = [
  {
    name: { fr: 'Mnègech Wejh', en: 'Mnegech Wejh', ar: 'منقش وجه' },
    origin: { fr: 'Mahdia, Tunisie', en: 'Mahdia, Tunisia', ar: 'المهدية، تونس' },
    period: { fr: 'XIXe siècle', en: '19th century', ar: 'القرن التاسع عشر' },
    description: {
      fr: 'Le Mnègech Wejh est un ornement facial emblématique de la tradition bijoutière mahdoise. Porté sur le front lors des cérémonies de mariage, il incarne la beauté féminine et la prospérité familiale.',
      en: 'The Mnegech Wejh is an iconic facial ornament from the Mahdian jewelry tradition. Worn on the forehead during wedding ceremonies, it embodies feminine beauty and family prosperity.',
      ar: 'المنقش وجه هو زينة وجهية رمزية من تقاليد الحلي المهدية. يُرتدى على الجبين خلال مراسم الزفاف، ويجسّد جمال المرأة وازدهار العائلة.',
    },
    symbol: {
      fr: 'Symbole de fertilité et de protection contre le mauvais œil',
      en: 'Symbol of fertility and protection against the evil eye',
      ar: 'رمز الخصوبة والحماية من العين',
    },
    material: 'Or 18 carats, perles, émail',
    color: '#D4AF37',
    isPublished: true,
    order: 1,
    thumbnailUrl: 'https://images.unsplash.com/photo-1601821765780-754fa98637c1?w=800',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1601821765780-754fa98637c1?w=1200',
        publicId: 'sample_piece1',
        alt: 'Mnègech Wejh',
        isMain: true,
      },
    ],
  },
  {
    name: { fr: 'Sfèla', en: 'Sfela', ar: 'السفالة' },
    origin: { fr: 'Mahdia, Tunisie', en: 'Mahdia, Tunisia', ar: 'المهدية، تونس' },
    period: { fr: 'XVIIIe siècle', en: '18th century', ar: 'القرن الثامن عشر' },
    description: {
      fr: 'La Sfèla est un bracelet monumental en or massif, caractéristique du patrimoine bijoutier sahélien tunisien. Sa construction en spirales entrelacées témoigne d\'un savoir-faire exceptionnel.',
      en: 'The Sfela is a monumental solid gold bracelet characteristic of Tunisian Sahel jewelry heritage. Its interlaced spiral construction demonstrates exceptional craftsmanship.',
      ar: 'السفالة هي إسوارة من الذهب الخالص، مميزة للتراث الحلياتي للساحل التونسي. بناؤها بالحلقات المتشابكة يشهد على مهارة استثنائية.',
    },
    symbol: {
      fr: 'Symbole de statut social et de richesse familiale',
      en: 'Symbol of social status and family wealth',
      ar: 'رمز المكانة الاجتماعية والثروة العائلية',
    },
    material: 'Or 22 carats',
    color: '#C9A84C',
    isPublished: true,
    order: 2,
    thumbnailUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200',
        publicId: 'sample_piece2',
        alt: 'Sfèla',
        isMain: true,
      },
    ],
  },
  {
    name: { fr: 'Tlila', en: 'Tlila', ar: 'التليلة' },
    origin: { fr: 'Mahdia, Tunisie', en: 'Mahdia, Tunisia', ar: 'المهدية، تونس' },
    period: { fr: 'XIXe–XXe siècle', en: '19th–20th century', ar: 'القرن التاسع عشر - العشرون' },
    description: {
      fr: 'La Tlila est un collier pendentif à multiples rangs, orné de pièces d\'or et de pierres précieuses. Héritage direct des orfèvres de Mahdia, elle est portée lors des grandes occasions festives.',
      en: 'The Tlila is a multi-strand pendant necklace adorned with gold coins and precious stones. A direct heritage of Mahdia\'s goldsmiths, it is worn during major festive occasions.',
      ar: 'التليلة هي قلادة متعددة الصفوف مزينة بقطع ذهبية وأحجار كريمة. موروث مباشر من صاغة المهدية، تُرتدى في المناسبات الاحتفالية الكبرى.',
    },
    symbol: {
      fr: 'Symbole de bonheur conjugal et bénédiction divine',
      en: 'Symbol of conjugal happiness and divine blessing',
      ar: 'رمز السعادة الزوجية والبركة الإلهية',
    },
    material: 'Or 18 carats, rubis, émeraudes',
    color: '#E8C97A',
    isPublished: true,
    order: 3,
    thumbnailUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1200',
        publicId: 'sample_piece3',
        alt: 'Tlila',
        isMain: true,
      },
    ],
  },
  {
    name: { fr: 'Khlel Mahdia', en: 'Khlel Mahdia', ar: 'خلخال المهدية' },
    origin: { fr: 'Mahdia, Tunisie', en: 'Mahdia, Tunisia', ar: 'المهدية، تونس' },
    period: { fr: 'XVIIe–XVIIIe siècle', en: '17th–18th century', ar: 'القرن السابع عشر - الثامن عشر' },
    description: {
      fr: 'Le Khlel est une cheville en or forgé, ornée de clochettes tintinnabulantes. Son tintement mélodieux était considéré comme un charme protecteur contre les mauvais esprits.',
      en: 'The Khlel is a forged gold ankle bracelet adorned with tinkling bells. Its melodious sound was considered a protective charm against evil spirits.',
      ar: 'الخلخال هو قيد كاحل من الذهب المطروق مزين بأجراس رنانة. كان رنينه الموسيقي يُعدّ تميمة حماية من الأرواح الشريرة.',
    },
    symbol: {
      fr: 'Protection spirituelle et invocation de la baraka',
      en: 'Spiritual protection and invocation of baraka',
      ar: 'الحماية الروحية واستدعاء البركة',
    },
    material: 'Or 18 carats, argent doré',
    color: '#D4AF37',
    isPublished: true,
    order: 4,
    thumbnailUrl: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=1200',
        publicId: 'sample_piece4',
        alt: 'Khlel Mahdia',
        isMain: true,
      },
    ],
  },
  {
    name: { fr: 'Osbène', en: 'Osbene', ar: 'العصبة' },
    origin: { fr: 'Mahdia, Tunisie', en: 'Mahdia, Tunisia', ar: 'المهدية، تونس' },
    period: { fr: 'XXe siècle', en: '20th century', ar: 'القرن العشرون' },
    description: {
      fr: 'L\'Osbène est une couronne frontale en or finement ciselé, portée lors des cérémonies de mariage. Sa conception géométrique reflète l\'influence andalouse sur l\'art bijoutier mahdois.',
      en: 'The Osbene is a finely chiseled gold frontal crown worn during wedding ceremonies. Its geometric design reflects Andalusian influence on Mahdian jewelry art.',
      ar: 'العصبة هي تاج جبهي من الذهب المنقوش بدقة، يُرتدى في مراسم الزفاف. يعكس تصميمها الهندسي التأثير الأندلسي على فن الحلي المهدي.',
    },
    symbol: {
      fr: 'Royauté de la mariée, union sacrée',
      en: 'Bride royalty, sacred union',
      ar: 'ملكية العروس، الاتحاد المقدس',
    },
    material: 'Or 21 carats, filigrane',
    color: '#E8C97A',
    isPublished: true,
    order: 5,
    thumbnailUrl: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=1200',
        publicId: 'sample_piece5',
        alt: 'Osbène',
        isMain: true,
      },
    ],
  },
  {
    name: { fr: 'Kaf Mahdia', en: 'Kaf Mahdia', ar: 'كف المهدية' },
    origin: { fr: 'Mahdia, Tunisie', en: 'Mahdia, Tunisia', ar: 'المهدية، تونس' },
    period: { fr: 'XIXe siècle', en: '19th century', ar: 'القرن التاسع عشر' },
    description: {
      fr: 'Le Kaf est une bague plate en or représentant une main stylisée (khamsa). Ce symbole universel de protection est travaillé avec une extrême précision par les orfèvres mahdois.',
      en: 'The Kaf is a flat gold ring representing a stylized hand (khamsa). This universal protection symbol is crafted with extreme precision by Mahdian goldsmiths.',
      ar: 'الكف هو خاتم ذهبي مسطح يمثل يداً منمنمة (الخمسة). يُشكّل هذا الرمز العالمي للحماية بدقة متناهية من قبل صاغة المهدية.',
    },
    symbol: {
      fr: 'La main de Fatima — protection universelle',
      en: 'Hand of Fatima — universal protection',
      ar: 'يد فاطمة — الحماية الكونية',
    },
    material: 'Or 18 carats, émail polychrome',
    color: '#C9A84C',
    isPublished: true,
    order: 6,
    thumbnailUrl: 'https://images.unsplash.com/photo-1574068468668-a05a11f871da?w=800',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1574068468668-a05a11f871da?w=1200',
        publicId: 'sample_piece6',
        alt: 'Kaf Mahdia',
        isMain: true,
      },
    ],
  },
];

const defaultSettings = [
  { key: 'site_name', value: 'Pièces d\'Or de Mahdia', label: 'Nom du site', group: 'general', isPublic: true },
  { key: 'site_description', value: 'Plateforme culturelle — Patrimoine bijoutier de Mahdia', label: 'Description', group: 'general', isPublic: true },
  { key: 'contact_email', value: 'contact@mahdia-heritage.tn', label: 'Email de contact', group: 'contact', isPublic: true },
  { key: 'pieces_per_page', value: 12, label: 'Pièces par page', group: 'display', isPublic: true },
  { key: 'maintenance_mode', value: false, label: 'Mode maintenance', group: 'system', isPublic: false },
];

const seed = async () => {
  await connectDB();
  console.log('🌱 Starting seed...');

  // Clear existing data
  await Piece.deleteMany({});
  await Setting.deleteMany({});
  console.log('🗑️  Cleared existing pieces and settings');

  // Insert pieces
  const createdPieces = await Piece.insertMany(pieces);
  console.log(`✅ Created ${createdPieces.length} pieces`);

  // Insert settings
  await Setting.insertMany(defaultSettings);
  console.log(`✅ Created ${defaultSettings.length} settings`);

  console.log('');
  console.log('🎉 Seed completed successfully!');
  mongoose.connection.close();
};

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  mongoose.connection.close();
  process.exit(1);
});
