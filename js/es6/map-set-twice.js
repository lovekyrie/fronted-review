const samuraiClanMap = new Map();

const samurai1 = { name: "Toyotomi" };
const samurai2 = { name: "Takeda" };
const samurai3 = { name: "Akiyama" };

const oda = { clan: "Oda" };
const tokugawa = { clan: "Tokugawa" };
const takeda = { clan: "Takeda" };

samuraiClanMap.set(samurai1, oda);
samuraiClanMap.set(samurai2, tokugawa);
// 第二次设置会覆盖第一次
samuraiClanMap.set(samurai2, takeda);

console.log(samuraiClanMap.size === 3);
console.log(samuraiClanMap.get(samurai2));
