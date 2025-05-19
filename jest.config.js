/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    collectCoverage: true,
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleDirectories: ['node_modules', 'src'],
    moduleNameMapper: {
        '@/(.*)': '<rootDir>/src/$1',
    },
    transformIgnorePatterns: [
        // *no* leading/trailing `/` here, just the regexp body
        'node_modules/(?!(wagmi|@wagmi/core|viem)/)',
    ],
}
