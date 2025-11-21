import { createElement } from "react";
import type { IconType } from "react-icons";
import {
  FiActivity,
  FiBook,
  FiCamera,
  FiCalendar,
  FiCheck,
  FiCoffee,
  FiDelete,
  FiDollarSign,
  FiDroplet,
  FiGift,
  FiGrid,
  FiHardDrive,
  FiHeart,
  FiHome,
  FiMonitor,
  FiMinus,
  FiNavigation,
  FiPackage,
  FiPhone,
  FiPlus,
  FiScissors,
  FiSend,
  FiSettings,
  FiShoppingBag,
  FiShoppingCart,
  FiStar,
  FiTarget,
  FiTool,
  FiTruck,
  FiUser,
  FiUsers,
  FiZap,
} from "react-icons/fi";

export const iconRegistry = {
  FiActivity,
  FiBook,
  FiCamera,
  FiCalendar,
  FiCheck,
  FiCoffee,
  FiDelete,
  FiDollarSign,
  FiDroplet,
  FiGift,
  FiGrid,
  FiHardDrive,
  FiHeart,
  FiHome,
  FiMonitor,
  FiMinus,
  FiNavigation,
  FiPackage,
  FiPhone,
  FiPlus,
  FiScissors,
  FiSend,
  FiSettings,
  FiShoppingBag,
  FiShoppingCart,
  FiStar,
  FiTarget,
  FiTool,
  FiTruck,
  FiUser,
  FiUsers,
  FiZap,
} as const;

export type IconKey = keyof typeof iconRegistry;

const DEFAULT_ICON_KEY: IconKey = "FiGrid";

export function getIconComponent(iconName: string): IconType {
  return iconRegistry[(iconName ?? DEFAULT_ICON_KEY) as IconKey] ?? iconRegistry[DEFAULT_ICON_KEY];
}

export function renderIcon(iconName: string, className = "h-6 w-6") {
  const Icon = getIconComponent(iconName);
  return createElement(Icon, { className });
}


