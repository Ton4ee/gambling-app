import { state, saveState } from './state.js';

const balanceSubscribers = [];
const playerSubscribers = [];

export function getBalance() {
  return state.balance;
}

export function setBalance(newBalance) {
  state.balance = newBalance;
  saveState();
  balanceSubscribers.forEach((fn) => fn(state.balance));
}

export function subscribeBalance(fn) {
  balanceSubscribers.push(fn);
}

export function getPlayerName() {
  return state.username;
}

export function setPlayerName(name) {
  state.username = name;
  saveState();
  playerSubscribers.forEach((fn) => fn(state.username));
}

export function subscribePlayerName(fn) {
  playerSubscribers.push(fn);
}
