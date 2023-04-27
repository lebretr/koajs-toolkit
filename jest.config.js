/** @returns {Promise<import('jest').Config>} */
module.export = async () => {
    return {
        transform: {},
        collectCoverageFrom: [
          '**/*.{js,jsx}',
          '!*.config.js',
          '!*.eslintrc.js',
          '!**/coverage/**',
          '!**/node_modules/**',
          '!**/sandbox/**',
          '!**/test/**',
          '!**/vendor/**',
        ],
        verbose: true,
    };
};