# PWA (Progressive Web App) Setup

Your Vue 3 application is now configured as a Progressive Web App!

## What's Included

### 1. Service Worker
- Automatically caches assets for offline use
- Configured in `vue.config.js` with Workbox
- Registers in production mode via `src/registerServiceWorker.js`

### 2. Web App Manifest
- Located at `public/manifest.json`
- Defines app name, theme colors, and icons
- Enables "Add to Home Screen" functionality

### 3. PWA Icons
- Generated from your favicon in multiple sizes (72px to 512px)
- Located in `public/img/icons/`
- **Tip:** Replace these with custom, high-quality icons for better branding

### 4. Caching Strategy
The service worker caches:
- Google Fonts (1 year)
- Images (30 days)
- App assets (automatically)

## Testing Your PWA

### Development
```bash
npm run serve
```
Note: Service worker only runs in production builds during dev.

### Production Build
```bash
npm run build
```

### Test Locally
```bash
# After building
npx serve -s dist
```

### PWA Checklist
1. Open Chrome DevTools
2. Go to "Application" tab
3. Check:
   - ✅ Manifest loads correctly
   - ✅ Service Worker registers
   - ✅ Icons appear
   - ✅ App can be installed

## Browser Support

- ✅ Chrome/Edge (full support)
- ✅ Firefox (full support)
- ✅ Safari (partial support - no service worker in older versions)
- ✅ Mobile browsers (iOS 11.3+, Android 5+)

## Customization

### Update App Name/Colors
Edit `public/manifest.json` and `vue.config.js` (pwa section)

### Change Caching Strategy
Modify `workboxOptions` in `vue.config.js`

### Replace Icons
Use a tool like [PWA Asset Generator](https://github.com/elegantapp/pwa-asset-generator) or manually create icons:
```bash
# Example with your own logo
npx pwa-asset-generator logo.png public/img/icons --manifest public/manifest.json
```

## Deployment Notes

- Service workers require HTTPS (works on localhost without HTTPS)
- Make sure your server serves the correct MIME types
- Consider adding a `robots.txt` and `sitemap.xml`

## Learn More

- [Vue CLI PWA Plugin](https://cli.vuejs.org/core-plugins/pwa.html)
- [Workbox Documentation](https://developers.google.com/web/tools/workbox)
- [PWA Best Practices](https://web.dev/pwa/)
