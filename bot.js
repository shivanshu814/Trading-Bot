const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const token = "8105384872:AAFkzkmFzX5RXGGyq6m_sjs6Ug0vp--Ct8s";
const bot = new TelegramBot(token, { polling: true });

const watchlist = {
  popcat: "popcat",
  bonk: "bonk",
  btc: "bitcoin",
  eth: "ethereum",
  sol: "solana",
  doge: "dogecoin",
  shib: "shiba-inu",
  xrp: "ripple",
  luna: "terra-luna",
};

let userSubscriptions = {};

bot.onText(/\/subscribe (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const tokenName = match[1].toLowerCase();

  if (watchlist[tokenName]) {
    if (!userSubscriptions[chatId]) userSubscriptions[chatId] = {};
    if (!userSubscriptions[chatId][tokenName]) {
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/simple/price?ids=${watchlist[tokenName]}&vs_currencies=usd`
        );
        const price = response.data[watchlist[tokenName]].usd;

        userSubscriptions[chatId][tokenName] = {
          profit: 7,
          loss: 3,
          buyPrice: price,
          alertedProfit: false,
          alertedLoss: false,
        };

        bot.sendMessage(
          chatId,
          `Subscribed to ${tokenName.toUpperCase()} at $${price}.\nDefault profit target: 7%, loss target: 3%. Use /setprofit and /setloss to customize.`
        );
      } catch (err) {
        bot.sendMessage(chatId, "Price fetch error. Try again later.");
      }
    } else {
      bot.sendMessage(
        chatId,
        `Already subscribed to ${tokenName.toUpperCase()}`
      );
    }
  } else {
    bot.sendMessage(chatId, `Token ${tokenName} not supported.`);
  }
});

bot.onText(/\/setprofit (.+) (\d+(\.\d+)?)/, (msg, match) => {
  const chatId = msg.chat.id;
  const tokenName = match[1].toLowerCase();
  const profitPercent = parseFloat(match[2]);

  if (userSubscriptions[chatId] && userSubscriptions[chatId][tokenName]) {
    userSubscriptions[chatId][tokenName].profit = profitPercent;
    userSubscriptions[chatId][tokenName].alertedProfit = false;
    bot.sendMessage(
      chatId,
      `Profit alert for ${tokenName.toUpperCase()} set to ${profitPercent}%`
    );
  } else {
    bot.sendMessage(
      chatId,
      `You need to subscribe first to ${tokenName.toUpperCase()}`
    );
  }
});

bot.onText(/\/setloss (.+) (\d+(\.\d+)?)/, (msg, match) => {
  const chatId = msg.chat.id;
  const tokenName = match[1].toLowerCase();
  const lossPercent = parseFloat(match[2]);

  if (userSubscriptions[chatId] && userSubscriptions[chatId][tokenName]) {
    userSubscriptions[chatId][tokenName].loss = lossPercent;
    userSubscriptions[chatId][tokenName].alertedLoss = false;
    bot.sendMessage(
      chatId,
      `Loss alert for ${tokenName.toUpperCase()} set to ${lossPercent}%`
    );
  } else {
    bot.sendMessage(
      chatId,
      `You need to subscribe first to ${tokenName.toUpperCase()}`
    );
  }
});

setInterval(async () => {
  for (const chatId in userSubscriptions) {
    for (const tokenName in userSubscriptions[chatId]) {
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/simple/price?ids=${watchlist[tokenName]}&vs_currencies=usd`
        );
        const currentPrice = response.data[watchlist[tokenName]].usd;

        const sub = userSubscriptions[chatId][tokenName];
        const buyPrice = sub.buyPrice;
        const profitTarget = sub.profit;
        const lossTarget = sub.loss;

        const changePercent = ((currentPrice - buyPrice) / buyPrice) * 100;

        if (changePercent >= profitTarget && !sub.alertedProfit) {
          bot.sendMessage(
            chatId,
            `🚀 Profit Alert! ${tokenName.toUpperCase()} price increased by ${changePercent.toFixed(
              2
            )}% to $${currentPrice}. Consider selling now!`
          );
          sub.alertedProfit = true;
          sub.alertedLoss = false;
        } else if (changePercent <= -lossTarget && !sub.alertedLoss) {
          bot.sendMessage(
            chatId,
            `⚠️ Loss Alert! ${tokenName.toUpperCase()} price dropped by ${Math.abs(
              changePercent
            ).toFixed(2)}% to $${currentPrice}. Consider cutting losses!`
          );
          sub.alertedLoss = true;
          sub.alertedProfit = false;
        } else if (
          changePercent < profitTarget &&
          changePercent > -lossTarget
        ) {
          sub.alertedProfit = false;
          sub.alertedLoss = false;
        }
      } catch (err) {
        console.error("Error fetching price:", err);
      }
    }
  }
}, 60000);
