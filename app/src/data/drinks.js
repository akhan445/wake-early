// Approximate caffeine per serving, from published brand info and common references.
export const DRINKS = [
  { id: 'th-orig-m', brand: 'Tim Hortons', name: 'Original Blend (Medium)', mg: 205 },
  { id: 'th-orig-l', brand: 'Tim Hortons', name: 'Original Blend (Large)', mg: 270 },
  { id: 'th-dark-m', brand: 'Tim Hortons', name: 'Dark Roast (Medium)', mg: 180 },
  { id: 'th-icap-m', brand: 'Tim Hortons', name: 'Iced Capp (Medium)', mg: 120 },
  { id: 'sb-pike-t', brand: 'Starbucks', name: 'Pike Place (Tall)', mg: 235 },
  { id: 'sb-pike-g', brand: 'Starbucks', name: 'Pike Place (Grande)', mg: 310 },
  { id: 'sb-latte-g', brand: 'Starbucks', name: 'Caffè Latte (Grande)', mg: 150 },
  { id: 'sb-cold-g', brand: 'Starbucks', name: 'Cold Brew (Grande)', mg: 205 },
  { id: 'esp-1', brand: 'Generic', name: 'Espresso (single shot)', mg: 64 },
  { id: 'esp-2', brand: 'Generic', name: 'Espresso (double shot)', mg: 128 },
  { id: 'drip-8', brand: 'Generic', name: 'Drip coffee (8 oz)', mg: 95 },
  { id: 'redbull', brand: 'Red Bull', name: 'Energy Drink (250 ml)', mg: 80 },
  { id: 'monster', brand: 'Monster', name: 'Energy (16 oz)', mg: 160 },
  { id: 'celsius', brand: 'Celsius', name: 'Original (12 oz)', mg: 200 },
  { id: 'tea-black', brand: 'Generic', name: 'Black tea (8 oz)', mg: 47 },
  { id: 'tea-green', brand: 'Generic', name: 'Green tea (8 oz)', mg: 28 },
  { id: 'coke', brand: 'Coca-Cola', name: 'Coke (355 ml can)', mg: 34 },
]

export function searchDrinks(query) {
  const q = query.trim().toLowerCase()
  if (!q) return DRINKS
  return DRINKS.filter((d) => `${d.brand} ${d.name}`.toLowerCase().includes(q))
}
