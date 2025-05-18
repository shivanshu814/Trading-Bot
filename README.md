# Crypto Price Alert Telegram Bot 🤖

A Telegram bot that monitors cryptocurrency prices and sends alerts when they reach your specified profit or loss targets.

## Features ✨

- Monitor multiple cryptocurrencies simultaneously
- Set custom profit and loss targets
- Real-time price alerts
- Supports popular cryptocurrencies:
  - Bitcoin (BTC)
  - Ethereum (ETH)
  - Solana (SOL)
  - Dogecoin (DOGE)
  - Shiba Inu (SHIB)
  - Ripple (XRP)
  - Terra Luna (LUNA)
  - Popcat (POPCAT)
  - Bonk (BONK)

## Commands 📝

- `/subscribe <token>` - Subscribe to a cryptocurrency

  - Example: `/subscribe btc`
  - Default profit target: 7%
  - Default loss target: 3%

- `/setprofit <token> <percentage>` - Set custom profit target

  - Example: `/setprofit btc 10`

- `/setloss <token> <percentage>` - Set custom loss target
  - Example: `/setloss btc 5`

## Setup 🚀

1. Clone the repository:

```bash
git clone https://github.com/yourusername/telegram-bot.git
cd telegram-bot
```

2. Install dependencies:

```bash
npm install
```

3. Create a Telegram bot:

   - Message [@BotFather](https://t.me/botfather) on Telegram
   - Use `/newbot` command to create a new bot
   - Copy the API token provided

4. Configure the bot:

   - Open `bot.js`
   - Replace the token value with your bot token

5. Run the bot:

```bash
node bot.js
```

## GitHub Actions Setup ⚙️

The bot is configured to run automatically using GitHub Actions. The workflow:

- Runs every minute
- Monitors cryptocurrency prices
- Sends alerts when targets are reached

## Technologies Used 🛠

- Node.js
- node-telegram-bot-api
- axios
- CoinGecko API

## Contributing 🤝

Feel free to submit issues and enhancement requests!

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.

## Support 💬

If you have any questions or need help, feel free to open an issue!
