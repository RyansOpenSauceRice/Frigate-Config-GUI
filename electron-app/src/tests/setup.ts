/// <reference types="@types/jest" />
/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom';

// Mock the electron API
window.electronAPI = {
  importConfig: jest.fn(),
  exportConfig: jest.fn(),
  validateConfig: jest.fn()
};