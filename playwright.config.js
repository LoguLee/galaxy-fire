
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',

  use: {
    ...devices['Desktop Chrome'],
    headless: true,
    baseURL: 'http://127.0.0.1:5173'
  },

  reporter: 'list',

  webServer: {
    command: 'npm run dev -- --host 127.0.0.1',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 30000
  }
})
