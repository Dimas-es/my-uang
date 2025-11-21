import type { Category as PrismaCategory, CategoryFlow } from "@prisma/client";
import type { Category, Transaction } from "@/app/types";
import { prisma } from "@/lib/prisma";
import { renderIcon, type IconKey } from "@/lib/iconMap";
import { defaultCategories, type CategorySeed } from "@/data/defaultCategories";

const DEFAULT_ICON_CLASS = "h-6 w-6";

export type CategoryOption = {
  id: string;
  label: string;
  iconKey: IconKey;
  iconBg: string;
  flow: Transaction["type"];
};

export type CategoryFetchOptions = {
  iconClassName?: string;
  flow?: CategoryFlow;
};

function filterSeeds(flow?: CategoryFlow): CategorySeed[] {
  return defaultCategories.filter((seed) => (flow ? seed.flow === flow : true));
}

function mapSeedToCategory(seed: CategorySeed, iconClassName: string): Category {
  return {
    id: seed.id,
    label: seed.label,
    iconBg: seed.iconBg,
    icon: renderIcon(seed.icon, iconClassName),
    flow: seed.flow,
    iconKey: seed.icon,
  };
}

function mapRecordToCategory(record: PrismaCategory, iconClassName: string): Category {
  return {
    id: record.id,
    label: record.label,
    iconBg: record.iconBg,
    icon: renderIcon(record.icon, iconClassName),
    flow: record.flow as Transaction["type"],
    iconKey: record.icon as IconKey,
  };
}

function mapRecordToOption(record: PrismaCategory): CategoryOption {
  return {
    id: record.id,
    label: record.label,
    iconKey: record.icon as IconKey,
    iconBg: record.iconBg,
    flow: record.flow as Transaction["type"],
  };
}

function mapSeedToOption(seed: CategorySeed): CategoryOption {
  return {
    id: seed.id,
    label: seed.label,
    iconKey: seed.icon,
    iconBg: seed.iconBg,
    flow: seed.flow,
  };
}

export async function fetchCategories(options: CategoryFetchOptions = {}): Promise<Category[]> {
  const iconClassName = options.iconClassName ?? DEFAULT_ICON_CLASS;
  const flowFilter = options.flow;
  try {
    const records = await prisma.category.findMany({
      where: flowFilter ? { flow: flowFilter } : undefined,
      orderBy: { label: "asc" },
    });

    if (records.length === 0) {
      return filterSeeds(flowFilter).map((seed) => mapSeedToCategory(seed, iconClassName));
    }

    return records.map((record) => mapRecordToCategory(record, iconClassName));
  } catch (error) {
    console.error("[fetchCategories] Failed to load from database, falling back to default data", error);
    return filterSeeds(flowFilter).map((seed) => mapSeedToCategory(seed, iconClassName));
  }
}

export async function fetchCategoryOptions(flow?: CategoryFlow): Promise<CategoryOption[]> {
  try {
    const records = await prisma.category.findMany({
      where: flow ? { flow } : undefined,
      orderBy: { label: "asc" },
    });

    if (records.length === 0) {
      return filterSeeds(flow).map(mapSeedToOption);
    }

    return records.map(mapRecordToOption);
  } catch (error) {
    console.error("[fetchCategoryOptions] Failed to load from database, falling back to default data", error);
    return filterSeeds(flow).map(mapSeedToOption);
  }
}

export async function fetchCategoryMap(
  options: CategoryFetchOptions = {},
): Promise<Record<Category["id"], Category>> {
  const list = await fetchCategories(options);
  return list.reduce<Record<Category["id"], Category>>((acc, category) => {
    acc[category.id] = category;
    return acc;
  }, {});
}


