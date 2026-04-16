import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Unsplash photo IDs — each maps to a real, hotlink-friendly image
// Format: https://images.unsplash.com/photo-{ID}?auto=format&fit=crop&w=900&q=80
const treeImages: Record<string, string> = {
  // Avocado tree with fruits
  'aguacate':
    'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=900&q=80',
  // Mango tropical fruit tree
  'arbol-de-mango':
    'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=900&q=80',
  // Oak forest / tree
  'roble':
    'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=80',
  // Citrus / lime tree
  'limon-dulce':
    'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=900&q=80',
  // Palm trees
  'palmera':
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
  // Guava fruit / tropical tree
  'guayaba':
    'https://images.unsplash.com/photo-1618897996318-5a901fa5fb2e?auto=format&fit=crop&w=900&q=80',
  // Pine forest
  'pino':
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80',
  // Arbutus / red berry ornamental tree
  'madrono':
    'https://images.unsplash.com/photo-1569598861671-1f72e28c55a1?auto=format&fit=crop&w=900&q=80',
  // Flamboyant / red flowering tree
  'malinche-napoleon':
    'https://images.unsplash.com/photo-1534531173927-aeb928d54385?auto=format&fit=crop&w=900&q=80',
  // Tropical soursop / green fruit tree
  'guanabana':
    'https://images.unsplash.com/photo-1591086643-06df66e5b9e0?auto=format&fit=crop&w=900&q=80',
  // Bamboo forest
  'bambu':
    'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=900&q=80',
  // Giant bamboo grove
  'bambum':
    'https://images.unsplash.com/photo-1559827291-72f3dc9fb1b7?auto=format&fit=crop&w=900&q=80',
  // Peach / stone fruit tree
  'melocoton':
    'https://images.unsplash.com/photo-1625839460573-56ee4dd9b11a?auto=format&fit=crop&w=900&q=80',
  // Ceiba / massive tropical tree
  'ceiba':
    'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=900&q=80',
  // Ficus / tropical fig tree
  'laurel-de-la-india':
    'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=80',
  // Almond tree in bloom
  'almendro':
    'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=900&q=80',
  // Teak / tropical hardwood
  'teca':
    'https://images.unsplash.com/photo-1564419320461-6870880221ad?auto=format&fit=crop&w=900&q=80',
};

async function main() {
  let updated = 0;
  for (const [slug, imageUrl] of Object.entries(treeImages)) {
    const result = await prisma.tree.updateMany({
      where: { slug },
      data: { imageUrl },
    });
    if (result.count > 0) {
      console.log(`✅ ${slug}`);
      updated++;
    } else {
      console.log(`⚠️  Not found: ${slug}`);
    }
  }
  console.log(`\nUpdated ${updated}/${Object.keys(treeImages).length} trees.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
