module.exports = {
    preset: 'ts-jest', // Use this if you're using TypeScript
    // testEnvironment: 'jest-environment-jsdom',
    testEnvironment: 'jsdom', // to test browser code
    // testEnvironment: 'node',
    setupFiles: ['<rootDir>/jest.setup.js'],
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.test.json'
        }
    },
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            tsconfig: 'frontend/tsconfig.json'
        }]
    },
    moduleNameMapper: {
        '^user-service$': '<rootDir>/backend/src/user-service',
        '^collab-service$': '<rootDir>/backend/src/collab-service',
        '^@ant-design/icons$': '<rootDir>/frontend/node_modules/@ant-design/icons',
        '^antd$': '<rootDir>/frontend/node_modules/antd',
    },  
};
