const daimyo = { name: "Matsu", clan: "takasu" };
const proxy = new Proxy(daimyo, {
  get: (target, key) => {
    if (key === "clan") {
      return "Tokugawa";
    }
  },
});

console.log(daimyo.clan);
console.log(proxy.clan);

proxy.clan = "Tokugawa";

console.log(daimyo.clan);
console.log(proxy.clan);
