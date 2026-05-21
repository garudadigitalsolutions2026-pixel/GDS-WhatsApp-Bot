// ─── Restaurant Configuration ────────────────────────────────────────────────

// Edit RESTAURANT and MENU_ITEMS to match the real restaurant's details.
// Prices are in INR (₹). Set available: false to hide an item.

export const RESTAURANT = {
    name: process.env.RESTAURANT_NAME || 'GDS Kitchen',
    tagline: process.env.RESTAURANT_TAGLINE || 'Fresh food, fast delivery 🍽️',
    deliveryFee: Number(process.env.DELIVERY_FEE ?? 30),
    estimatedDelivery: process.env.ESTIMATED_DELIVERY || '30–45 minutes',
    ownerPhone: process.env.RESTAURANT_PHONE, // WhatsApp number to receive orders
};

// Each item needs: id (unique string), name, category, price (INR), available
export const MENU_ITEMS = [
    // ── Starters ────────────────────────────────────────────────────────────────
  { id: 's1', name: 'Veg Spring Rolls (6 pcs)', category: 'Starters', price: 120, available: true },
  { id: 's2', name: 'Paneer Tikka', category: 'Starters', price: 180, available: true },
  { id: 's3', name: 'Chicken Wings', category: 'Starters', price: 220, available: true },

    // ── Main Course ─────────────────────────────────────────────────────────────
  { id: 'm1', name: 'Butter Chicken', category: 'Main Course', price: 280, available: true },
  { id: 'm2', name: 'Paneer Butter Masala', category: 'Main Course', price: 240, available: true },
  { id: 'm3', name: 'Dal Makhani', category: 'Main Course', price: 200, available: true },
  { id: 'm4', name: 'Veg Biryani', category: 'Main Course', price: 220, available: true },
  { id: 'm5', name: 'Chicken Biryani', category: 'Main Course', price: 280, available: true },

    // ── Breads ──────────────────────────────────────────────────────────────────
  { id: 'b1', name: 'Butter Naan', category: 'Breads', price: 40, available: true },
  { id: 'b2', name: 'Garlic Naan', category: 'Breads', price: 50, available: true },
  { id: 'b3', name: 'Tandoori Roti', category: 'Breads', price: 30, available: true },

    // ── Desserts ────────────────────────────────────────────────────────────────
  { id: 'd1', name: 'Gulab Jamun (2 pcs)', category: 'Desserts', price: 80, available: true },
  { id: 'd2', name: 'Ice Cream (2 scoops)', category: 'Desserts', price: 100, available: true },

    // ── Drinks ──────────────────────────────────────────────────────────────────
  { id: 'r1', name: 'Mango Lassi', category: 'Drinks', price: 80, available: true },
  { id: 'r2', name: 'Cold Coffee', category: 'Drinks', price: 120, available: true },
  { id: 'r3', name: 'Fresh Lime Soda', category: 'Drinks', price: 60, available: true },
  ];

// ─── Helpers ─────────────────────────────────────────────────────────────────
export const availableItems = MENU_ITEMS.filter((i) => i.available);

export function getItemById(id) {
    return availableItems.find((i) => i.id === id);
}

// Returns items indexed 1-N (used so customers can type a number to order)
export function getNumberedItems() {
    return availableItems.map((item, idx) => ({ ...item, num: idx + 1 }));
}

export function getItemByNumber(n) {
    return getNumberedItems().find((i) => i.num === n);
}

export function formatMenuText() {
    const numbered = getNumberedItems();
    const categories = [...new Set(numbered.map((i) => i.category))];
    const lines = [
          `🍽️ ${RESTAURANT.name} Menu`,
          RESTAURANT.tagline,
          '',
        ];

  for (const cat of categories) {
        lines.push(`*── ${cat} ──*`);
        numbered
          .filter((i) => i.category === cat)
          .forEach((i) => lines.push(`  ${i.num}. ${i.name} — ₹${i.price}`));
        lines.push('');
  }

  lines.push(`🛵 Delivery fee: ₹${RESTAURANT.deliveryFee}`);
    lines.push('');
    lines.push('👉 Type a number to add an item to your cart.');
    lines.push('   Type done when finished, menu to see this again, or cancel to start over.');
    return lines.join('\n');
}

export function formatCartText(cart) {
    if (cart.length === 0) return 'Your cart is empty.';
    const lines = ['🛒 Your Cart:', ''];
    let subtotal = 0;
    cart.forEach((entry, idx) => {
          const lineTotal = entry.item.price * entry.qty;
          subtotal += lineTotal;
          lines.push(`  ${idx + 1}. ${entry.item.name} × ${entry.qty} = ₹${lineTotal}`);
    });
    const total = subtotal + RESTAURANT.deliveryFee;
    lines.push('');
    lines.push(`Subtotal: ₹${subtotal}`);
    lines.push(`Delivery: ₹${RESTAURANT.deliveryFee}`);
    lines.push(`*Total:   ₹${total}*`);
    return lines.join('\n');
}

export function cartTotal(cart) {
    const subtotal = cart.reduce((sum, e) => sum + e.item.price * e.qty, 0);
    return subtotal + RESTAURANT.deliveryFee;
}
