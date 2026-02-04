// vite.config.ts
import { defineConfig } from "file:///D:/amarsin/project/amarsin-ui/node_modules/vite/dist/node/index.js";
import svgr from "file:///D:/amarsin/project/amarsin-ui/node_modules/vite-plugin-svgr/dist/index.js";
import react from "file:///D:/amarsin/project/amarsin-ui/node_modules/@vitejs/plugin-react/dist/index.mjs";
import dts from "file:///D:/amarsin/project/amarsin-ui/node_modules/vite-plugin-dts/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [
    svgr(),
    react(),
    dts({
      beforeWriteFile: (filePath, content) => ({
        filePath: filePath.replace("path/to/file.d.ts", "index.d.ts"),
        content
      })
    })
  ],
  server: {
    proxy: {
      "/api": {
        target: process.env.VITE_API_BASE_URL || "http://localhost:8080",
        changeOrigin: true,
        secure: false
      }
    }
  },
  resolve: {
    alias: {
      "@emotion/react": "@emotion/react",
      "@emotion/styled": "@emotion/styled"
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxhbWFyc2luXFxcXHByb2plY3RcXFxcYW1hcnNpbi11aVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcYW1hcnNpblxcXFxwcm9qZWN0XFxcXGFtYXJzaW4tdWlcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L2FtYXJzaW4vcHJvamVjdC9hbWFyc2luLXVpL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCBzdmdyIGZyb20gJ3ZpdGUtcGx1Z2luLXN2Z3InXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnXG5pbXBvcnQgZHRzIGZyb20gJ3ZpdGUtcGx1Z2luLWR0cydcblxuLy8gaHR0cHM6Ly92aXRlLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgc3ZncigpLFxuICAgIHJlYWN0KCksXG4gICAgZHRzKHtcbiAgICAgIGJlZm9yZVdyaXRlRmlsZTogKGZpbGVQYXRoLCBjb250ZW50KSA9PiAoe1xuICAgICAgICBmaWxlUGF0aDogZmlsZVBhdGgucmVwbGFjZSgncGF0aC90by9maWxlLmQudHMnLCAnaW5kZXguZC50cycpLFxuICAgICAgICBjb250ZW50LFxuICAgICAgfSksXG4gICAgfSksXG4gIF0sXG4gIHNlcnZlcjoge1xuICAgIHByb3h5OiB7XG4gICAgICAnL2FwaSc6IHtcbiAgICAgICAgdGFyZ2V0OiBwcm9jZXNzLmVudi5WSVRFX0FQSV9CQVNFX1VSTCB8fCAnaHR0cDovL2xvY2FsaG9zdDo4MDgwJyxcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICBzZWN1cmU6IGZhbHNlLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAZW1vdGlvbi9yZWFjdCc6ICdAZW1vdGlvbi9yZWFjdCcsXG4gICAgICAnQGVtb3Rpb24vc3R5bGVkJzogJ0BlbW90aW9uL3N0eWxlZCcsXG4gICAgfSxcbiAgfSxcbn0pIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFpUixTQUFTLG9CQUFvQjtBQUM5UyxPQUFPLFVBQVU7QUFDakIsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sU0FBUztBQUdoQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxLQUFLO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTixJQUFJO0FBQUEsTUFDRixpQkFBaUIsQ0FBQyxVQUFVLGFBQWE7QUFBQSxRQUN2QyxVQUFVLFNBQVMsUUFBUSxxQkFBcUIsWUFBWTtBQUFBLFFBQzVEO0FBQUEsTUFDRjtBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNMLFFBQVE7QUFBQSxRQUNOLFFBQVEsUUFBUSxJQUFJLHFCQUFxQjtBQUFBLFFBQ3pDLGNBQWM7QUFBQSxRQUNkLFFBQVE7QUFBQSxNQUNWO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLGtCQUFrQjtBQUFBLE1BQ2xCLG1CQUFtQjtBQUFBLElBQ3JCO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
