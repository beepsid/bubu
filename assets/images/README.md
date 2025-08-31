# Images Directory

Place your gallery images in this directory for the photo gallery feature.

## Recommended Structure:
```
assets/images/
├── gallery/
│   ├── photo1.jpg
│   ├── photo2.jpg
│   ├── photo3.jpg
│   └── ...
├── backgrounds/
│   ├── splash-bg.jpg
│   └── home-bg.jpg
└── icons/
    ├── heart.png
    └── custom-icons.png
```

## Image Guidelines:
- **Format**: JPG, PNG, or WebP
- **Size**: Optimize for mobile (max 1080px width recommended)
- **Quality**: Balance between quality and file size
- **Naming**: Use descriptive names (no spaces, use hyphens)

## Gallery Images:
Replace the placeholder URLs in `GalleryScreen.js` with local image paths:

```javascript
// Instead of:
uri: 'https://picsum.photos/400/600?random=1'

// Use:
uri: require('../assets/images/gallery/our-first-date.jpg')
```

## App Icons:
- `icon.png` - 1024x1024px app icon
- `adaptive-icon.png` - 1024x1024px adaptive icon (Android)
- `splash.png` - Splash screen image
- `favicon.png` - 32x32px favicon for web

Create these with her name or your couple photo for a personal touch! 💕