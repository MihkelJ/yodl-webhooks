# 🪝 YODL Webhooks

> "Yo dawg, I heard you like webhooks!" - Xzibit, probably

Your friendly neighborhood webhook service that's ready to push notifications and process transactions faster than you can say "asynchronous communication"! Built with TypeScript because we like our types strict and our code even stricter. 🚀

## ✨ What's Cool About This?

- 📱 Web Push Notifications (because emails are so 2010)
- 💸 Transaction Processing (money moves, and so do we)
- 🔐 Authentication Middleware (keeping the bad guys out)
- 🛣️ RESTful API Endpoints (so clean you could eat off them)
- 🗄️ Prisma Database Integration (because raw SQL gives us headaches)

## 🎯 Before You Dive In

Make sure you've got these cool cats installed:

- 💚 Node.js (v20 or higher) - The newer the better!
- 📦 npm or yarn (we don't judge)
- 🐘 PostgreSQL database (because elephants never forget)

## 🔧 Configure Your ENS Text Record

To receive transaction webhooks, you'll need to configure your ENS text record with the `me.yodl` key. The value should be a JSON object containing:

- `tokenSymbols`: Array of token symbols you want to receive payments for
- `webhooks`: Array of webhook URLs where notifications will be sent

Example configuration:

```json
{
  "tokenSymbols": ["USDT", "USDC"],
  "webhooks": [
    "https://yodl-webhooks.vercel.app/tx",
    "http://example.com/webhook2"
  ]
}
```

You can already use the endpoint `https://yodl-webhooks.vercel.app/tx` as it is deployed and ready to handle your transaction webhooks.

If you have a `yodl.eth` subname, you can set this up at [Just a Name](https://app.justaname.id/). Otherwise, configure it in your ENS dashboard or using your preferred ENS management tool.

## 🚀 Let's Get This Party Started!

1. Clone this bad boy:

```bash
git clone https://github.com/MihkelJ/yodl-webhooks.git
cd yodl-webhooks  # Welcome to the club!
```

2. Get those dependencies sorted:

```bash
npm install    # The classic way
# or if you're feeling fancy
yarn install   # The hipster way
```

3. Environment variables (because secrets should stay secret):

```bash
cp .env.example .env  # Copy that template like it's hot
```

Customize your `.env` file with:

- 🔌 Database connection URL (where the magic happens)
- 🔔 Web Push credentials (ding ding!)
- 🔑 Authentication settings (super secret stuff)
- ⚙️ Other cool configs

4. Database time:

```bash
npx prisma migrate dev  # Watch the tables turn
```

5. Fire it up:

```bash
npm run dev   # The moment of truth
# or
yarn dev     # Same same but different
```

## 🛣️ API Endpoints (Where the Magic Happens)

- `/health` - Making sure we're still alive and kicking
- `/subscribe` - Join the notification party 🎉
- `/tx` - Where money moves and grooves 💃

## 🛠️ Built With Love (and These Cool Tools)

- TypeScript (because JavaScript needed some discipline)
- Express.js (the trusty steed)
- Prisma ORM (making databases fun again)
- Zod (keeping our data in check)
- Web Push (push it real good!)

## 📜 License

MIT (because sharing is caring) ❤️

---

Made with ☕ and questionable commit messages
