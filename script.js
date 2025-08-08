// デバッグ用のシンプルなオブジェクト
const debugFormData = {
  entries: [{
    name: 'テスト',
    hearingStatus: '聴者',
    affiliation: '一般',
    contact: 'test@example.com'
  }],
  comments: 'テスト送信です',
  totalTickets: 1
};

// fetchのbodyにこれを指定して試す
body: JSON.stringify(debugFormData)
