const SHEET_ID = '1ttCkR4oNPkcgcmZmgqTb-1tryXqFyONqUmKuGPUj-E0';

function doGet() {
  return HtmlService
    .createHtmlOutputFromFile('龜山支會')
    .setTitle('施助名單提交表單')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// 前端使用 google.script.run.submitFormToSheet(payload) 呼叫此函式
function submitFormToSheet(data) {
  if (!data) throw new Error('No data');

  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sh = ss.getSheetByName('data'); // 指定分頁名稱

  // 若為空表，建立表頭（A-G）
  if (sh.getLastRow() === 0) {
    sh.appendRow([
      'timestamp',
      'group',
      'names',
      'sender_display_name',
      'liff_user_id',
      'submitted_at'
    ]);
  }

  const names = (data.names || []).join(',');

  // 欄位：A時間, B單位, C名單, D送出者LINE名字, E liff_user_id, F submitted_at
  sh.appendRow([
    new Date(),
    data.group || '',
    names,
    data.display_name || '',
    data.liff_user_id || '',
    data.submitted_at || ''
  ]);

  return { ok: true, message: '已記錄到 Google Sheet' };
}

// 若你想用純 REST 方式（例如前端不在 GAS）也可保留以下 doPost
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const result = submitFormToSheet(data);
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
