# ParkPing
**Multipurpose QR Codes · Privacy First**

ParkPing lets you generate a secure QR code for anything you own — your car, bike, bag, laptop, or anything else. Stick it on, and anyone who finds or needs to reach you can send a message or make a call to you instantly, without ever seeing your phone number.

## Why ParkPing?

- **Not just for vehicles** — use it on anything you want to keep recoverable
- **100% Anonymous** — your phone number is never shared with anyone
- **Instant Alerts** — get notified the moment someone scans your code
- **30-second setup** — enter your number, download your QR, stick it on
- **No app needed** — anyone can scan with a regular phone camera or google lens

## Use Cases

| Item | How it helps |
|------|-------------|
| Vehicle | Someone needs to reach you about your parked car |
| Bicycle | Help a stranger return your bike if found |
| Bag / Luggage | Lost luggage that finds its way back |
| Laptop | Let an honest finder contact you if it goes missing |
| Parcels | Delivery and return routing made instant |

## Key Features

### Privacy-First Communication
Every message is relayed through ParkPing anonymously. The person scanning never sees your contact details — they send a message and you decide if you respond.

### Multipurpose QR Templates
Choose from multiple sticker templates, drag and resize the QR to fit, and download a print-ready Sticker in seconds.

### Instant Notifications
Get alerted the moment someone scans your code and sends a message.

### Dark / Light Mode
Clean UI that adapts to your system preference.

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd parkping
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_FRONTEND_URL` | Your frontend URL (e.g. `http://localhost:3000`) |
| `SUPABASE_ANON_KEY` | Your Supabase anon key |
| `SUPABASE_URL` | Your Supabase db URL |
| `TWILIO_ACCOUNT_SID` | Your Twilio Account SID |
| `TWILIO_AUTH_TOKEN` | Your Twilio Account Auth Token |
| `TWILIO_NUMBER` | Your Twilio Account Purchased Number |

## Tech Stack

- **Next.js** — React framework
- **Tailwind CSS** — Styling
- **Syne** — Display font (via `next/font/google`)
- **jsPDF + svg2pdf.js** — PDF generation
- **qrcode.react** — QR code rendering

---

© ParkPing. QR Codes for Everything.
