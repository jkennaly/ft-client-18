import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        "setupFiles": [
            "./tests/setupVitest.js"
        ],
        globals: true,
        restoreMocks: true,
        include: ['./tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}']
    },
})