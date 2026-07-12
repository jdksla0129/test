import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// AID 웹뷰는 S3 하위 경로(.../releases/{id}/)에서 서빙되므로 상대 경로 필수
export default defineConfig({
  base: './',
  plugins: [react()],
})