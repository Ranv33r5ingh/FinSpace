export const formatCurrency = (amount, compact = false) => {
  if (compact && Math.abs(amount) >= 1000) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(amount);
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateStr, format = 'medium') => {
  const date = new Date(dateStr + 'T12:00:00');
  if (format === 'short') {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  if (format === 'medium') {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  if (format === 'full') {
    return date.toLocaleDateString('en-US', {
      weekday: 'short', month: 'long', day: 'numeric', year: 'numeric',
    });
  }
  if (format === 'month-year') {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }
  return dateStr;
};

export const formatPercent = (value, decimals = 1) => {
  return `${Number(value).toFixed(decimals)}%`;
};

export const formatMonthKey = (key) => {
  const [year, month] = key.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

export const getMonthKey = (dateStr) => {
  return dateStr.substring(0, 7);
};

export const AVAILABLE_MONTHS = [
  { key: '2024-01', label: 'January 2024' },
  { key: '2024-02', label: 'February 2024' },
  { key: '2024-03', label: 'March 2024' },
  { key: '2024-04', label: 'April 2024' },
  { key: '2024-05', label: 'May 2024' },
  { key: '2024-06', label: 'June 2024' },
];
