import '@testing-library/jest-dom';

// Mock the electron API
window.electronAPI = {
  importConfig: jest.fn(),
  exportConfig: jest.fn(),
  validateConfig: jest.fn()
};