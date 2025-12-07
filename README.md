# Donation Platform

A minimalistic, single-page donation platform with an embeddable widget for accepting donations via crypto, PayPal, and Ko-fi.

## Features

- 🎨 **Single-page design** - Clean, elegant donation interface
- 🌓 **Auto dark/light mode** - Syncs with system preferences
- 💰 **Multiple payment methods**:
  - Cryptocurrency (BTC, ETH, USDT)
  - PayPal
  - Ko-fi
- 🔌 **Embeddable widget** - Add to any website with a single script tag
- 📱 **Fully responsive** - Works on all devices
- 🎯 **Shadow DOM** - Widget styles won't conflict with host site
- 🔄 **Theme auto-detection** - Widget matches host website theme

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Configuration

1. Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

2. Update the values in `.env.local` with your actual donation links and wallet addresses:

```env
NEXT_PUBLIC_PAYPAL_URL=https://paypal.me/yourusername
NEXT_PUBLIC_KOFI_URL=https://ko-fi.com/yourusername
NEXT_PUBLIC_BTC_WALLET=your_btc_wallet_address
NEXT_PUBLIC_ETH_WALLET=your_eth_wallet_address
NEXT_PUBLIC_USDT_WALLET=your_usdt_wallet_address
```

3. Also update the wallet addresses in `public/widget.js` (CONFIG object at the top).

### Build & Deploy

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Deploying to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

## Embedding the Widget

Once deployed, add the widget to any website:

```html
<!-- Add this script tag anywhere in your HTML -->
<script src="https://YOUR_DOMAIN.vercel.app/widget.js"></script>
```

### Widget API

The widget exposes a global `DonationWidget` object with these methods:

```javascript
// Open the donation modal programmatically
DonationWidget.open();

// Close the modal
DonationWidget.close();

// Set theme manually (otherwise auto-detects)
DonationWidget.setTheme("light"); // or 'dark'

// Clean up and remove widget
DonationWidget.destroy();
```

### Theme Detection

The widget automatically detects the host website's theme using:

1. CSS classes (`dark` class on `html` or `body`)
2. System preference (`prefers-color-scheme`)
3. Live theme switching via `MutationObserver`

## Project Structure

```
donations/
├── app/
│   ├── api/
│   │   └── widget/
│   │       └── route.ts          # API endpoint for widget
│   ├── globals.css               # Global styles & animations
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main donation page
├── components/
│   └── DonationCard.tsx          # Shared donation component
├── lib/
│   └── widget-utils.ts           # Widget utilities
├── public/
│   └── widget.js                 # Embeddable widget script
└── .env.example                  # Environment variables template
```

## Customization

### Donation Amounts

Edit preset amounts in `components/DonationCard.tsx`:

```tsx
const PRESET_AMOUNTS = [5, 10, 25, 50, 100];
```

### Styling

The project uses Tailwind CSS. Customize:

- **Colors**: Update Tailwind classes in components
- **Animations**: Modify `globals.css`
- **Widget styles**: Edit the `getStyles()` method in `public/widget.js`

### Payment Methods

To add/remove payment methods, edit:

- `components/DonationCard.tsx` (main site)
- `public/widget.js` (widget version)

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Shadow DOM support required for widget
- JavaScript required

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Deployment**: Vercel-ready

## Learn More

To learn more about Next.js:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## License

MIT

## Support

If you find this useful, consider supporting the project! 💝

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
