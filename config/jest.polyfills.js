global.document.body.createTextRange = jest.fn(() => ({
  getBoundingClientRect: jest.fn(() => ({})),
  getClientRects: jest.fn(() => [])
}));
