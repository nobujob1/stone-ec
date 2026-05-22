import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const sampleProducts = [
  {
    name: "アメジスト ブレスレット",
    description: "穏やかな紫色が美しいアメジストを使ったブレスレット。心の平和と直感力を高めるとされる癒しの石です。",
    price: 4800,
    stock: 5,
    imageUrl: "https://picsum.photos/seed/amethyst/600/600",
  },
  {
    name: "ローズクォーツ ブレスレット",
    description: "淡いピンク色が愛らしいローズクォーツのブレスレット。愛と優しさを象徴する石として人気です。",
    price: 4200,
    stock: 8,
    imageUrl: "https://picsum.photos/seed/rose/600/600",
  },
  {
    name: "ラピスラズリ ブレスレット",
    description: "深い青と金色の模様が神秘的なラピスラズリ。知恵と真実を象徴し、古代から珍重されてきた宝石です。",
    price: 6800,
    stock: 3,
    imageUrl: "https://picsum.photos/seed/lapis/600/600",
  },
  {
    name: "タイガーアイ ブレスレット",
    description: "虎の目のような光沢が特徴的なタイガーアイ。勇気と意志力を高め、目標達成をサポートします。",
    price: 3800,
    stock: 10,
    imageUrl: "https://picsum.photos/seed/tiger/600/600",
  },
  {
    name: "ムーンストーン ブレスレット",
    description: "柔らかな光を放つムーンストーン。直感と感受性を高め、新しい始まりを祝福する石です。",
    price: 5500,
    stock: 6,
    imageUrl: "https://picsum.photos/seed/moon/600/600",
  },
  {
    name: "マラカイト ブレスレット",
    description: "鮮やかな緑の縞模様が美しいマラカイト。変化と成長を促し、ネガティブなエネルギーを浄化します。",
    price: 5200,
    stock: 4,
    imageUrl: "https://picsum.photos/seed/malachite/600/600",
  },
  {
    name: "ターコイズ ブレスレット",
    description: "爽やかな青緑色が魅力のターコイズ。保護と癒しの石として世界中で愛されています。",
    price: 4500,
    stock: 7,
    imageUrl: "https://picsum.photos/seed/turquoise/600/600",
  },
  {
    name: "オブシディアン ブレスレット",
    description: "深い黒色が印象的なオブシディアン。強力な保護の石として、ネガティブなエネルギーをブロックします。",
    price: 3500,
    stock: 9,
    imageUrl: "https://picsum.photos/seed/obsidian/600/600",
  },
  {
    name: "シトリン ブレスレット",
    description: "明るい黄色が太陽のようなシトリン。豊かさと成功を引き寄せ、ポジティブなエネルギーを高めます。",
    price: 4000,
    stock: 6,
    imageUrl: "https://picsum.photos/seed/citrine/600/600",
  },
  {
    name: "アクアマリン ブレスレット",
    description: "透き通った海色が美しいアクアマリン。コミュニケーション能力を高め、心に平静をもたらします。",
    price: 7200,
    stock: 3,
    imageUrl: "https://picsum.photos/seed/aqua/600/600",
  },
  {
    name: "ガーネット ブレスレット",
    description: "深い赤色が情熱的なガーネット。活力とやる気を高め、愛情や絆を深めるとされています。",
    price: 5800,
    stock: 5,
    imageUrl: "https://picsum.photos/seed/garnet/600/600",
  },
  {
    name: "オニキス ブレスレット",
    description: "光沢のある黒が洗練された印象のオニキス。精神的な強さと自制心を高め、ストレスを和らげます。",
    price: 3200,
    stock: 12,
    imageUrl: "https://picsum.photos/seed/onyx/600/600",
  },
];

async function main() {
  // 管理者アカウント
  const passwordHash = await bcrypt.hash("admin1234", 12);
  await prisma.admin.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: { email: "admin@example.com", passwordHash },
  });
  console.log("管理者アカウントを作成しました: admin@example.com / admin1234");

  // 商品（0件の場合のみ追加）
  const count = await prisma.product.count();
  if (count === 0) {
    await prisma.product.createMany({ data: sampleProducts });
    console.log(`サンプル商品を ${sampleProducts.length} 件追加しました`);
  } else {
    console.log(`商品はすでに ${count} 件あるためスキップしました`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
