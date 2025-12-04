// returns number: how many USD for 1 GEL
export async function fetchExchangeRate() {
  try {
    const key = import.meta.env.VITE_EXCHANGE_API_KEY;
    if (!key) {
      console.warn("No exchange API key provided, using fallback rate 0.35");
      return 0.35; // fallback
    }
    // exchangerate-api endpoint (v6)
    const res = await fetch(
      `https://v6.exchangerate-api.com/v6/${key}/latest/GEL`
    );
    if (!res.ok) throw new Error(`Rate fetch failed ${res.status}`);
    const json = await res.json(); // { result, conversion_rates: { USD: 0.xx, ... } }
    const usdRate = json?.conversion_rates?.USD;
    if (!usdRate) throw new Error("USD rate not found");
    return usdRate; // USD per 1 GEL
  } catch (err) {
    console.error("fetchExchangeRate error:", err);
    // fallback sensible value
    return 0.35;
  }
}
