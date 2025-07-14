import './style.css';
import { loadGameSelector } from './components/GameSelector.js';
import { state, saveState } from './state.js';

const app = document.querySelector('#app');
const header = document.getElementById('header');
const playerNameEl = document.getElementById('playerName');
const headerBalanceEl = document.getElementById('headerBalance');
const logoutBtn = document.getElementById('logoutBtn');

function updateHeader() {
  playerNameEl.textContent = state.username;
  headerBalanceEl.textContent = state.balance;
  header.style.display = state.isLoggedIn ? 'flex' : 'none';
  logoutBtn.style.display = state.isLoggedIn ? 'inline-block' : 'none';
}

logoutBtn.onclick = () => {
  state.isLoggedIn = false;
  state.username = "Guest";
  state.balance = 0;
  saveState();
  updateHeader();
  loadGameSelector(app);
};

updateHeader();
loadGameSelector(app);
