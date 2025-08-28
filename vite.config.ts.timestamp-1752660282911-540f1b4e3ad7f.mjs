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
        target: "http://api.dotis.ir",
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxhbWFyc2luXFxcXHByb2plY3RcXFxcYW1hcnNpbi11aVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcYW1hcnNpblxcXFxwcm9qZWN0XFxcXGFtYXJzaW4tdWlcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L2FtYXJzaW4vcHJvamVjdC9hbWFyc2luLXVpL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCBzdmdyIGZyb20gJ3ZpdGUtcGx1Z2luLXN2Z3InXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnXG5pbXBvcnQgZHRzIGZyb20gJ3ZpdGUtcGx1Z2luLWR0cydcblxuLy8gaHR0cHM6Ly92aXRlLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgc3ZncigpLFxuICAgIHJlYWN0KCksXG4gICAgZHRzKHtcbiAgICAgIGJlZm9yZVdyaXRlRmlsZTogKGZpbGVQYXRoLCBjb250ZW50KSA9PiAoe1xuICAgICAgICBmaWxlUGF0aDogZmlsZVBhdGgucmVwbGFjZSgncGF0aC90by9maWxlLmQudHMnLCAnaW5kZXguZC50cycpLFxuICAgICAgICBjb250ZW50LFxuICAgICAgfSksXG4gICAgfSksXG4gIF0sXG4gIHNlcnZlcjoge1xuICAgIHByb3h5OiB7XG4gICAgICAnL2FwaSc6IHtcbiAgICAgICAgdGFyZ2V0OiAnaHR0cDovL2FwaS5kb3Rpcy5pcicsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgc2VjdXJlOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQGVtb3Rpb24vcmVhY3QnOiAnQGVtb3Rpb24vcmVhY3QnLFxuICAgICAgJ0BlbW90aW9uL3N0eWxlZCc6ICdAZW1vdGlvbi9zdHlsZWQnLFxuICAgIH0sXG4gIH0sXG59KSJdLAogICJtYXBwaW5ncyI6ICI7QUFBaVIsU0FBUyxvQkFBb0I7QUFDOVMsT0FBTyxVQUFVO0FBQ2pCLE9BQU8sV0FBVztBQUNsQixPQUFPLFNBQVM7QUFHaEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsS0FBSztBQUFBLElBQ0wsTUFBTTtBQUFBLElBQ04sSUFBSTtBQUFBLE1BQ0YsaUJBQWlCLENBQUMsVUFBVSxhQUFhO0FBQUEsUUFDdkMsVUFBVSxTQUFTLFFBQVEscUJBQXFCLFlBQVk7QUFBQSxRQUM1RDtBQUFBLE1BQ0Y7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsUUFDTixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxRQUFRO0FBQUEsTUFDVjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxrQkFBa0I7QUFBQSxNQUNsQixtQkFBbUI7QUFBQSxJQUNyQjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
