const fs = require('fs');

const data = JSON.parse(fs.readFileSync('sprueche.json', 'utf8'));

const escape = (val) => {
  if (val == null) return '';
  const str = String(val);
  return '"' + str.replace(/"/g, '""') + '"';
};

const header = ['spruch', 'explanation', 'category', 'source', 'rating', 'id'].join(',');
const rows = data.map(d => [
  escape(d.spruch),
  escape(d.explanation),
  escape(d.category),
  escape(d.source),
  escape(d.rating),
  escape(d.id)
].join(','));

fs.writeFileSync('sponti.csv', [header, ...rows].join('\n'));

console.log(`Written ${data.length} quotes to sponti.csv`);