-- CreateEnum
CREATE TYPE "CategoryFlow" AS ENUM ('expense', 'income');

-- AlterTable
ALTER TABLE "Category"
ADD COLUMN     "flow" "CategoryFlow" NOT NULL DEFAULT 'expense';


