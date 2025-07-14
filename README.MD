
# 🎲 Gambling Web App

A sleek, animated web-based gambling app built with **Vanilla JavaScript**, **TailwindCSS**, and **Bootstrap 5**. Play classic casino games like **Coin Flip**, **Slots**, and **Blackjack** with real card images, persistent balance storage, and a live leaderboard.

---

## 🕹️ Features

- 🎰 **Slot Machine** with animated reels and emoji symbols  
- 🪙 **Coin Flip** with 3D flip animation  
- 🃏 **Blackjack** using the Deck of Cards API (split, hit, stand, double down)  
- 💾 **Persistent balance and user info** via `localStorage`  
- 🏆 **Leaderboard** storing top 5 players by balance  
- 🧠 Smart balance validation and UI feedback  
- 🎨 Clean, responsive UI using Bootstrap and TailwindCSS

---

## 📦 Technologies Used

- HTML, CSS, JS (no frameworks)
- [TailwindCSS](https://tailwindcss.com/)
- [Bootstrap 5](https://getbootstrap.com/)
- [Deck of Cards API](https://deckofcardsapi.com/) (for Blackjack)
- `localStorage` for persistent state

---

📁 Project Structure

gambling-app/
├── index.html
├── style.css
├── /src
│   ├── main.js
│   ├── state.js
│   ├── store.js
│   └── components/
│       ├── GameSelector.js
│       ├── Login.js
│       ├── CoinFlip.js
│       ├── Slots.js
│       └── Blackjack.js
└── /images
    ├── heads.png
    └── tails.png

