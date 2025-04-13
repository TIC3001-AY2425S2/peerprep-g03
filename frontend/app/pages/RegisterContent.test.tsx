import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterContent from './RegisterContent';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router';

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

afterAll(() => {
    jest.restoreAllMocks();
  }
);

describe('RegisterContent', () => {
  beforeEach(() => {
    render(
      <MemoryRouter initialEntries={['/register']}>
          <RegisterContent />
       </MemoryRouter>
    );
  });

  // const weakPasswords = ['weak', 'WEAK', '12345678', 'weakweakweakweak', 'WEAKWEAKWEAKWEAK', 'weak1234', 'weak!@#$'];
  const weakPasswords = [
    'short',          // less than 12 characters
    'alllowercase',   // no uppercase letters
    'ALLUPPERCASE',   // no lowercase letters
    '12345678',       // no letters or special characters
    'password1234',   // lacks special characters
    'weakpass$123',   // less than 12 characters, though includes special characters
    '1234!@#',        // less than 12 characters
    'abcdefgH1234',   // no special characters
    'NOspecialCHAR123' // no lowercase letters
  ];

  weakPasswords.forEach((password) => {
    test(`displays error for weak password - ${password}`, async () => {
      // Fill in the form with a weak password
      fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: password } });
      fireEvent.click(screen.getByRole('button', { name: /Register/i }));
  
      // Check for error message
      await waitFor(() => {
        expect(screen.getByText(/Your password is too weak/i)).toBeInTheDocument();
      });
    });
  });

  // Test case for a valid strong password
  test('accepts a strong password - Str0ngP@ssw0rd!', async () => {
    const strongPassword = 'Str0ngP@ssw0rd!';
    
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: strongPassword } });
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));
    
    // Expect no error message for a strong password
    await waitFor(() => {
      expect(screen.queryByText(/Your password is too weak/i)).not.toBeInTheDocument();
    });
  });
});