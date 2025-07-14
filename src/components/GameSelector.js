import { loadCoinFlip } from './CoinFlip.js';
import { loadSlots } from './Slots.js';
import { loadBlackjack } from './Blackjack.js';
import { loadLogin } from './Login.js';
import { state, saveState } from '../state.js';

export function loadGameSelector(container) {
  if (!state.isLoggedIn) {
    container.innerHTML = '';
    loadLogin(container, () => {
      saveState();
      loadGameSelector(container);
      const header = document.getElementById('header');
      header.style.display = 'flex';
    });
    return;
  }

  container.innerHTML = `
    <div class="container py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1>🎲 Gambling App</h1>
        <div>
          <span class="me-3">Player: <strong>${state.username}</strong></span>
          <span>Balance: <strong id="balanceDisplay">$${state.balance}</strong></span>
        </div>
      </div>

      <div class="btn-group mb-4" role="group" aria-label="Game selector">
        <button id="btn-coinflip" type="button" class="btn btn-warning">Coin Flip</button>
        <button id="btn-slots" type="button" class="btn btn-danger">Slots</button>
        <button id="btn-blackjack" type="button" class="btn btn-success">Blackjack</button>
      </div>

      <div id="game-container" class="border rounded p-4 min-vh-50 bg-light"></div>
    </div>
  `;

  const balanceDisplay = document.getElementById('balanceDisplay');
  const gameContainer = document.getElementById('game-container');
  const btnCoinFlip = document.getElementById('btn-coinflip');
  const btnSlots = document.getElementById('btn-slots');
  const btnBlackjack = document.getElementById('btn-blackjack');

  function updateBalanceDisplay() {
    balanceDisplay.textContent = `$${state.balance}`;
    // Also update header balance
    document.getElementById('headerBalance').textContent = state.balance;
  }

  updateBalanceDisplay();

  btnCoinFlip.onclick = () => loadCoinFlip(gameContainer, updateBalanceDisplay);
  btnSlots.onclick = () => loadSlots(gameContainer, updateBalanceDisplay);
  btnBlackjack.onclick = () => loadBlackjack(gameContainer, updateBalanceDisplay);

  // Load default game
  loadCoinFlip(gameContainer, updateBalanceDisplay);
}
