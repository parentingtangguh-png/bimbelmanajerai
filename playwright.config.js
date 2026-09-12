import { defineConfig } from '@playwright/test';
export default defineConfig({
  // A cold Vite server needs ~10s before the login screen paints, and longer right after many files
  // were edited. The default 5s expect timeout turned that into a failure with the page still on
  // "Memuat…", so the waits are sized to the slow first boot rather than the warm one.
  testDir:'./tests/browser',timeout:60000,expect:{timeout:20000},workers:1,
  use:{baseURL:'http://127.0.0.1:5173',channel:'chrome',headless:true,screenshot:'only-on-failure'},
  webServer:{command:'npm run dev',url:'http://127.0.0.1:5173',reuseExistingServer:true}
});
