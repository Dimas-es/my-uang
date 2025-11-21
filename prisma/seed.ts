import { PrismaClient } from "@prisma/client";
import { defaultCategories } from "@/data/defaultCategories";

const prisma = new PrismaClient();

async function main() {
  for (const category of defaultCategories) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: {
        label: category.label,
        icon: category.icon,
        iconBg: category.iconBg,
        flow: category.flow,
      },
      create: {
        id: category.id,
        label: category.label,
        icon: category.icon,
        iconBg: category.iconBg,
        flow: category.flow,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Failed to seed database", error);
    await prisma.$disconnect();
    process.exit(1);
  });


