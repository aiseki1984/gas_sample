type PostType = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

export function insertValuesToSpreadSheet() {
  const values = fetchValues();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.getRange(`A1:B${values.length}`).setValues(values);
}

export function fetchValues() {
  const requestUrl = 'https://jsonplaceholder.typicode.com/posts';
  const response = UrlFetchApp.fetch(requestUrl);
  const res = JSON.parse(response.getContentText());
  const values = res.map((content: PostType) => {
    return [content.title, content.id];
  });
  return values;
}
