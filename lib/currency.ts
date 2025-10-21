/**
 * Format currency amounts for display
 * @param amount - Amount in naira
 * @returns Formatted string (e.g., "₦3.1M", "₦500K", "₦1.2M")
 */
export function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    // For amounts >= 1M, show in millions with 1 decimal place
    const millions = amount / 1000000
    return `₦${millions.toFixed(1)}M`
  } else if (amount >= 1000) {
    // For amounts >= 1K, show in thousands with 1 decimal place
    const thousands = amount / 1000
    return `₦${thousands.toFixed(1)}K`
  } else {
    // For amounts < 1K, show full amount
    return `₦${amount.toLocaleString()}`
  }
}

/**
 * Format currency amounts for display with goal
 * @param current - Current amount raised
 * @param goal - Goal amount
 * @returns Formatted string (e.g., "₦3.1M of ₦5M")
 */
export function formatCurrencyWithGoal(current: number, goal: number): string {
  return `${formatCurrency(current)} of ${formatCurrency(goal)}`
}
