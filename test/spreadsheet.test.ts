import { fetchValues, insertValuesToSpreadSheet } from '../src/spreadsheet';
// import { mocked } from 'ts-jest/utils';

// GASサービスのモック化
const mockUrlFetchApp = {
  fetch: jest.fn(),
};
const mockSpreadsheetApp = {
  getActiveSpreadsheet: jest.fn(),
};
const mockSheet = {
  getRange: jest.fn(),
  setValues: jest.fn(),
};
const mockRange = {
  setValues: jest.fn(),
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
global.UrlFetchApp = mockUrlFetchApp as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
global.SpreadsheetApp = mockSpreadsheetApp as any;

describe('spreadsheet.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchValues', () => {
    it('should fetch and parse the posts from jsonplaceholder', () => {
      const mockResponse = {
        getContentText: jest.fn().mockReturnValue(
          JSON.stringify([
            {
              userId: 1,
              id: 1,
              title: 'test title',
              body: 'test body',
            },
          ])
        ),
      };
      mockUrlFetchApp.fetch.mockReturnValue(mockResponse);

      const result = fetchValues();
      expect(result).toEqual([['test title', 1]]);
      expect(mockUrlFetchApp.fetch).toHaveBeenCalledWith(
        'https://jsonplaceholder.typicode.com/posts'
      );
    });
  });

  describe('insertValuesToSpreadSheet', () => {
    it('should insert fetched values into the active spreadsheet', () => {
      const mockValues = [['test title', 1]];
      // jest.mocked(fetchValues).mockReturnValue(mockValues);
      mockSpreadsheetApp.getActiveSpreadsheet.mockReturnValue({
        getActiveSheet: jest.fn().mockReturnValue(mockSheet),
      });
      mockSheet.getRange.mockReturnValue(mockRange);

      insertValuesToSpreadSheet();

      expect(mockSpreadsheetApp.getActiveSpreadsheet).toHaveBeenCalled();
      expect(mockSheet.getRange).toHaveBeenCalledWith(
        `A1:B${mockValues.length}`
      );
      expect(mockRange.setValues).toHaveBeenCalledWith(mockValues);
    });
  });
});
