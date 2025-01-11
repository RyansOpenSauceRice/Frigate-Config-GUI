/** @jest-environment jsdom */
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('Frigate Config GUI')).toBeInTheDocument();
  });

  it('shows import, export, and validate buttons', () => {
    render(<App />);
    expect(screen.getByText('Import')).toBeInTheDocument();
    expect(screen.getByText('Export')).toBeInTheDocument();
    expect(screen.getByText('Validate')).toBeInTheDocument();
  });

  it('shows all configuration tabs', () => {
    render(<App />);
    expect(screen.getByText('Cameras')).toBeInTheDocument();
    expect(screen.getByText('MQTT')).toBeInTheDocument();
    expect(screen.getByText('Audio')).toBeInTheDocument();
  });

  it('switches between tabs', () => {
    render(<App />);
    
    // Click MQTT tab
    fireEvent.click(screen.getByText('MQTT'));
    expect(screen.getByText('MQTT Configuration')).toBeInTheDocument();

    // Click Audio tab
    fireEvent.click(screen.getByText('Audio'));
    expect(screen.getByText('Audio Detection Configuration')).toBeInTheDocument();
  });
});