import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AuthContext from './AuthContext';  // Replace with the actual root component where the timeout mechanism is implemented
import { AuthProvider } from './AuthContext'; // Import the provider or component
import '@testing-library/jest-dom';
import { useNavigate } from 'react-router-dom';

jest.useFakeTimers();

beforeEach(() => {
    // Mocking the sessionStorage (or localStorage) to simulate the last activity timestamp
    Storage.prototype.setItem = jest.fn();
    Storage.prototype.getItem = jest.fn().mockReturnValue(Date.now().toString());
    Storage.prototype.removeItem = jest.fn();
  
    // Mocking the navigate function to check if redirection happens
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(jest.fn());
});

describe('Automatic logout after inactivity', () => {
    test('logs user out after 1 hour of inactivity', async () => {
        <AuthProvider>
            <AuthContext />
        </AuthProvider>
        // const { getByText, getByRole } = render(<AuthContext />);
  
        // Simulating user activity (e.g., mouse click or keyboard input)
        fireEvent.click(getByRole('button', { name: /Some button/i }));  // Replace with an actual UI element in your app
        
        // Simulate passage of time (1 hour of inactivity)
        const lastActivityTime = Date.now();
        Storage.prototype.getItem.mockReturnValue((lastActivityTime - 3600001).toString()); // 1 hour and 1 ms ago

        // Trigger the logout function (this could depend on your app's logic, for example, checking the last activity timestamp)
        jest.advanceTimersByTime(3600001);  // Advance time by 1 hour and 1 ms

        // Ensure the user has been logged out (check for redirection to login or removal of session data)
        await waitFor(() => {
            expect(Storage.prototype.removeItem).toHaveBeenCalledWith('userSession');  // Example of clearing user session data
            expect(useNavigate()).toHaveBeenCalledWith('/login');  // Ensure the user is redirected to login page
        });
    });
  
    test('does not log out if user is active within 1 hour', async () => {
        const { getByText, getByRole } = render(<AuthContext />);

        // Simulate user activity within 1 hour
        fireEvent.click(getByRole('button', { name: /Some button/i }));  // Simulate user click

        // Simulate that the user was last active 30 minutes ago
        const lastActivityTimestamp = Date.now();
        Storage.prototype.getItem.mockReturnValue((lastActivityTimestamp - 1800000).toString()); // 30 minutes ago

        // Trigger the logout check (simulate time passing)
        jest.advanceTimersByTime(1800000);  // 30 minutes of simulated time

        // Ensure the user is not logged out (the session is still active)
        await waitFor(() => {
            expect(Storage.prototype.removeItem).not.toHaveBeenCalled();
            expect(useNavigate()).not.toHaveBeenCalled();
        });
    });
  
    test('checks user inactivity after app reload', async () => {
        const { getByText, getByRole } = render(<AuthContext />);

        // Simulate app reload by re-rendering
        fireEvent.click(getByRole('button', { name: /Some button/i }));  // User interaction

        // Simulate user inactivity after app reload
        const lastActivityTimestamp = Date.now();
        Storage.prototype.getItem.mockReturnValue((lastActivityTimestamp - 3600001).toString()); // 1 hour and 1 ms ago

        // Fast forward time by 1 hour
        jest.advanceTimersByTime(3600001);

        // Ensure the app logs out the user after inactivity (by removing session data)
        await waitFor(() => {
            expect(Storage.prototype.removeItem).toHaveBeenCalledWith('userSession');
            expect(useNavigate()).toHaveBeenCalledWith('/login');
        });
    });
});


/*
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { act } from 'react-dom/test-utils';
import { saveToken } from '../utils/auth-utils';

jest.mock('../utils/auth-utils', () => ({
    getToken: jest.fn(),
    saveToken: jest.fn(),
    deleteToken: jest.fn(),
    isTokenExpired: jest.fn(),
}));

jest.mock('antd', () => ({
    App: {
      useApp: () => ({
        message: {
          info: jest.fn(),
        },
      }),
    },
}));

const TestComponent = () => {
    const { isAuthenticated, loginUser , logoutUser  } = useAuth();
  
    // Simulate user login
    const handleLogin = async () => {
        await loginUser ({ email: 'test@example.com', password: 'password' });
    };
  
    return (
        <div>
            <button onClick={handleLogin}>Login</button>
            {isAuthenticated && <button onClick={logoutUser }>Logout</button>}
        </div>
    );
  };
  
    describe('AuthContext', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });
  
        test('logs out user after 1 hour of inactivity', async () => {
            const mockToken = 'mockToken';
            (getToken as jest.Mock).mockReturnValue(mockToken);
            (isTokenExpired as jest.Mock).mockReturnValue(false); // Token is valid
    
            render(
                <AuthProvider>
                <TestComponent />
                </AuthProvider>
            );
    
            // Simulate user login
            const loginButton = screen.getByText('Login');
            act(() => {
                loginButton.click();
            });
        
            // Wait for the user to be authenticated
            await waitFor(() => {
                expect(screen.getByText('Logout')).toBeInTheDocument();
            });
        
            // Simulate inactivity for 1 hour (3600000 ms)
            act(() => {
                jest.advanceTimersByTime(3600000);
            });
        
            // Check if the user is logged out
            await waitFor(() => {
                expect(screen.queryByText('Logout')).not.toBeInTheDocument();
            });
        
            // Check if the message was called
            const { message } = require('antd').App.useApp();
            expect(message.info).toHaveBeenCalledWith("You have been logged out due to inactivity.");
        });
    });
  
    // Enable Jest timers
    beforeAll(() => {
        jest.useFakeTimers();
    });

    afterAll(() => {
        jest.useRealTimers();
    });
*/