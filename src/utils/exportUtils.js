export const exportToCSV = (transactions, filename = 'transactions') => {
  const headers = ['ID', 'Date', 'Description', 'Category', 'Type', 'Amount', 'Note'];
  const rows = transactions.map((tx) => [
    tx.id,
    tx.date,
    `"${tx.description.replace(/"/g, '""')}"`,
    tx.category,
    tx.type,
    tx.type === 'expense' ? -tx.amount : tx.amount,
    `"${(tx.note || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  downloadFile(csvContent, `${filename}_${getTimestamp()}.csv`, 'text/csv;charset=utf-8;');
};

export const exportToJSON = (transactions, filename = 'transactions') => {
  const data = JSON.stringify(
    {
      exported_at: new Date().toISOString(),
      total_records: transactions.length,
      transactions,
    },
    null,
    2
  );
  downloadFile(data, `${filename}_${getTimestamp()}.json`, 'application/json');
};

const downloadFile = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const getTimestamp = () => {
  return new Date().toISOString().slice(0, 10);
};
