const https = require('https');
const fs = require('fs');
const iconv = require('iconv-lite');

const URL = 'https://www8.cao.go.jp/chosei/shukujitsu/syukujitsu.csv';

https.get(URL, (res) => {
  const chunks = [];
  res.on('data', (chunk) => chunks.push(chunk));
  res.on('end', () => {
    const buffer = Buffer.concat(chunks);
    const utf8Text = iconv.decode(buffer, 'Shift_JIS');

    // UTF-8 CSVとして保存
    fs.writeFileSync('docs/holidays.csv', utf8Text);

    // JSON変換
    const lines = utf8Text.trim().split('\n');
    const headers = lines[0].split(',');
    const holidays = lines.slice(1).map(line => {
      const [date, name] = line.split(',');
      return { date, name: name.replace(/\r/g, '') };
    });

    fs.writeFileSync('docs/holidays.json', JSON.stringify(holidays, null, 2));
    console.log('✅ 変換完了');
  });
});
