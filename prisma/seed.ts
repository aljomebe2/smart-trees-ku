import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const trees = [
  {
    commonName: 'Teca',
    scientificName: 'Tectona grandis',
    category: 'forest',
    benefits:
      'La teca es una especie forestal de alto valor; su madera es dura, resistente a la humedad y muy utilizada en construcción y mueblería. Los bosques de teca ayudan a fijar carbono y proporcionan hábitat para la fauna. Es una especie importante en reforestación y manejo forestal sostenible.',
    environmentalFact: 'Un solo árbol de teca puede almacenar más de una tonelada de CO₂ a lo largo de su vida.',
  },
  {
    commonName: 'Árbol de mango',
    scientificName: 'Mangifera indica',
    category: 'fruit',
    benefits:
      'El mango además de proporcionar fruta nutritiva, ofrece sombra y refugio en zonas tropicales. Sus flores atraen polinizadores y la copa densa reduce la temperatura del suelo. El cultivo de mango contribuye a la seguridad alimentaria y a la economía local.',
    environmentalFact: 'Los mangos pueden producir fruta durante más de 40 años, generando alimento y sombra de forma sostenible.',
  },
  {
    commonName: 'Roble',
    scientificName: 'Quercus spp.',
    category: 'forest',
    benefits:
      'Los robles son fundamentales en ecosistemas templados: albergan cientos de especies de insectos y aves, producen bellotas que alimentan fauna silvestre y su madera es valiosa. Ayudan a regular el ciclo del agua y a conservar el suelo.',
    environmentalFact: 'Un roble centenario puede albergar más de 300 especies de insectos y proporcionar oxígeno para varias personas al día.',
  },
  {
    commonName: 'Limón dulce',
    scientificName: 'Citrus limetta',
    category: 'fruit',
    benefits:
      'Los cítricos como el limón dulce aportan vitamina C y otros nutrientes; además, sus flores perfumadas atraen abejas y otros polinizadores. Los huertos de cítricos en campus mejoran la biodiversidad y ofrecen fruta fresca a la comunidad.',
    environmentalFact: 'Los árboles cítricos pueden actuar como sumideros de carbono y mejorar la calidad del aire en entornos urbanos.',
  },
  {
    commonName: 'Palmera',
    scientificName: 'Arecaceae',
    category: 'ornamental',
    benefits:
      'Las palmeras son emblemáticas en paisajes tropicales y subtropicales; proporcionan sombra, frutos y fibras. Muchas especies son resistentes a vientos y sequías, lo que las hace útiles en jardinería y restauración de zonas áridas.',
    environmentalFact: 'Las palmeras pueden vivir décadas o siglos y son clave en la estructura de muchos ecosistemas costeros.',
  },
  {
    commonName: 'Guayaba',
    scientificName: 'Psidium guajava',
    category: 'fruit',
    benefits:
      'La guayaba es rica en vitamina C y antioxidantes; el árbol es de rápido crecimiento y se adapta bien a distintos suelos. Proporciona sombra, fruta y refugio para aves que dispersan sus semillas.',
    environmentalFact: 'Un árbol de guayaba puede producir fruta durante todo el año en climas favorables, apoyando la seguridad alimentaria.',
  },
  {
    commonName: 'Pino',
    scientificName: 'Pinus spp.',
    category: 'forest',
    benefits:
      'Los pinos son esenciales en bosques templados y de montaña: fijan suelo, regulan el ciclo del agua y almacenan grandes cantidades de carbono. Proporcionan madera, resina y hábitat para fauna y hongos.',
    environmentalFact: 'Los bosques de pino pueden reducir la erosión del suelo y mejorar la infiltración del agua en cuencas hidrográficas.',
  },
  {
    commonName: 'Madroño',
    scientificName: 'Arbutus unedo',
    category: 'ornamental',
    benefits:
      'El madroño es un árbol mediterráneo que produce frutos comestibles y flores melíferas. Es resistente a la sequía y al fuego, y aporta valor paisajístico y ecológico en zonas de clima suave.',
    environmentalFact: 'El madroño puede rebrotar después de incendios, ayudando a la recuperación del ecosistema.',
  },
  {
    commonName: 'Malinche (Napoleón)',
    scientificName: 'Delonix regia',
    category: 'ornamental',
    benefits:
      'La Malinche o flamboyán es un árbol ornamental de flores rojas espectaculares. Proporciona sombra densa, reduce la temperatura en calles y plazas, y sus flores atraen polinizadores. Muy utilizado en paisajismo urbano y campus.',
    environmentalFact: 'En verano, la sombra de un flamboyán puede reducir la temperatura del suelo hasta varios grados.',
  },
  {
    commonName: 'Guanábana',
    scientificName: 'Annona muricata',
    category: 'fruit',
    benefits:
      'La guanábana produce una fruta nutritiva y se cultiva en zonas tropicales. El árbol ofrece sombra y sus flores atraen insectos beneficiosos. Tiene usos tradicionales y contribuye a la diversidad de frutales en campus.',
    environmentalFact: 'Los árboles de guanábana en agroforestería pueden mejorar la biodiversidad y el suelo.',
  },
  {
    commonName: 'Bambú',
    scientificName: 'Bambusa vulgaris',
    category: 'ornamental',
    benefits:
      'El bambú crece rápidamente y es un recurso renovable; se usa en construcción, artesanía y paisajismo. Forma densas masas que protegen el suelo y capturan CO₂. Es una alternativa sostenible a maderas de lento crecimiento.',
    environmentalFact: 'Algunas especies de bambú pueden crecer más de 1 metro al día y capturar carbono de forma muy eficiente.',
  },
  {
    commonName: 'Bambum',
    scientificName: 'Phyllostachys edulis',
    category: 'ornamental',
    benefits:
      'El bambú gigante (Phyllostachys edulis) es una especie de gran tamaño que se utiliza en construcción y paisajismo. Sus cañas son resistentes y el cultivo ayuda a estabilizar suelos y a crear barreras verdes.',
    environmentalFact: 'El bambú gigante puede alcanzar alturas de más de 20 metros y es uno de los recursos vegetales de más rápido crecimiento.',
  },
  {
    commonName: 'Melocotón',
    scientificName: 'Prunus persica',
    category: 'fruit',
    benefits:
      'El melocotonero produce fruta dulce y sus flores son una de las primeras fuentes de néctar para abejas en primavera. Los huertos de melocotón en campus fomentan la polinización y la educación sobre frutales.',
    environmentalFact: 'Los árboles frutales como el melocotonero mejoran la biodiversidad urbana y la conexión con la naturaleza.',
  },
  {
    commonName: 'Ceiba',
    scientificName: 'Ceiba pentandra',
    category: 'forest',
    benefits:
      'La ceiba es un árbol emblemático de gran tamaño; sus raíces y tronco albergan fauna y sus semillas se dispersan por el viento. Tiene importancia cultural y ecológica en muchas regiones tropicales.',
    environmentalFact: 'Las ceibas centenarias pueden albergar epífitas, aves y mamíferos, funcionando como "árboles refugio".',
  },
  {
    commonName: 'Laurel de la India',
    scientificName: 'Ficus microcarpa',
    category: 'ornamental',
    benefits:
      'El laurel de la India es un ficus muy usado en jardinería; proporciona sombra densa y es resistente a la poda. En campus y parques ayuda a reducir el calor y a mejorar la calidad del aire.',
    environmentalFact: 'Los ficus pueden absorber partículas finas del aire y contribuir a reducir la contaminación urbana.',
  },
  {
    commonName: 'Almendro',
    scientificName: 'Prunus dulcis',
    category: 'fruit',
    benefits:
      'El almendro produce almendras nutritivas y sus flores tempranas son importantes para las abejas. Es un cultivo de alto valor que puede integrarse en paisajes campus y proyectos de agricultura sostenible.',
    environmentalFact: 'Los almendros en flor son una de las primeras fuentes de polen y néctar para polinizadores en el año.',
  },
  {
    commonName: 'Aguacate',
    scientificName: 'Persea americana',
    category: 'fruit',
    benefits:
      'El aguacate aporta grasas saludables y nutrientes; el árbol es de hoja perenne y proporciona sombra y refugio. Su cultivo en campus promueve la alimentación saludable y la educación ambiental.',
    environmentalFact: 'Un árbol de aguacate maduro puede producir cientos de frutos al año y fijar carbono de forma continua.',
  },
];

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@campus.edu';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: { email: adminEmail, passwordHash, role: 'admin' },
  });

  console.log('Admin user created:', adminEmail);

  for (const t of trees) {
    const slug = slugify(t.commonName);
    await prisma.tree.upsert({
      where: { slug },
      update: {
        commonName: t.commonName,
        scientificName: t.scientificName,
        benefits: t.benefits,
        category: t.category,
        environmentalFact: t.environmentalFact,
      },
      create: {
        commonName: t.commonName,
        scientificName: t.scientificName,
        benefits: t.benefits,
        category: t.category,
        environmentalFact: t.environmentalFact,
        slug,
        visible: true,
      },
    });
  }

  console.log('Seeded', trees.length, 'trees.');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
