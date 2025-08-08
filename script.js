submitButton.addEventListener('click', async () => {
fetch('https://script.google.com/macros/s/AKfycbyOGC00pgRKzD6G6CktIViHuo8_JgNVPexglgITrQMU1KGuVmXuf4xgOr2zjSqjmdsF/exec', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ test: true }),
  mode: 'cors'
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error('送信失敗:', err));
});
