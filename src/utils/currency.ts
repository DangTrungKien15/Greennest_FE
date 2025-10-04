/**
 * Format currency in Vietnamese format (e.g., 200.000đ)
 * @param amount - The amount to format
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number | string | undefined): string => {
  // Convert to number and handle invalid values
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (numAmount === null || numAmount === undefined || isNaN(numAmount)) {
    console.warn('Invalid amount for formatCurrency:', amount);
    return '0đ';
  }
  
  // Format with Vietnamese locale (comma as thousands separator)
  return new Intl.NumberFormat('vi-VN').format(numAmount as number) + 'đ';
};

/**
 * Format currency with decimal places (e.g., 200.000,00đ)
 * @param amount - The amount to format
 * @returns Formatted currency string with decimals
 */
export const formatCurrencyWithDecimals = (amount: number | string | undefined): string => {
  // Convert to number and handle invalid values
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (numAmount === null || numAmount === undefined || isNaN(numAmount)) {
    console.warn('Invalid amount for formatCurrencyWithDecimals:', amount);
    return '0,00đ';
  }
  
  // Format with Vietnamese locale including decimal places
  return new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numAmount as number) + 'đ';
};
