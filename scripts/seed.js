import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const zodiacSigns = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
]

async function main() {
  for (const sign of zodiacSigns) {
    await prisma.zodiac.upsert({
      where: { name: sign },
      update: {},
      create: { name: sign },
    })
  }
  console.log('Zodiac signs seeded successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })