export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatMonth = (month) => {
  const [year, monthNum] = month.split('-');
  return new Date(`${year}-${monthNum}-01`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });
};

export const getChartData = (transactions) => {
  const data = {};

  // Last 30 days
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    data[dateStr] = { income: 0, expense: 0, date: dateStr };
  }

  transactions.forEach((t) => {
    const dateStr = new Date(t.date).toISOString().split('T')[0];
    if (data[dateStr]) {
      if (t.type === 'income') {
        data[dateStr].income += t.amount;
      } else {
        data[dateStr].expense += t.amount;
      }
    }
  });

  return Object.values(data);
};

export const getCategoryBreakdown = (transactions) => {
  const breakdown = {};

  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      const categoryName = t.category?.name || 'Other';
      if (!breakdown[categoryName]) {
        breakdown[categoryName] = 0;
      }
      breakdown[categoryName] += t.amount;
    });

  return Object.entries(breakdown)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};

export const calculateSummary = (transactions) => {
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    income,
    expense,
    balance: income - expense,
  };
};
