export const state = {
  username: localStorage.getItem("username") || "Guest",
  balance: Number(localStorage.getItem("balance")) || 10000,
  isLoggedIn: localStorage.getItem("isLoggedIn") === "true" || false,
  leaderboard: JSON.parse(localStorage.getItem("leaderboard")) || [],
};

export function saveState() {
  localStorage.setItem("username", state.username);
  localStorage.setItem("balance", state.balance);
  localStorage.setItem("isLoggedIn", state.isLoggedIn);
  localStorage.setItem("leaderboard", JSON.stringify(state.leaderboard));
}

export function updateLeaderboard(name, balance) {
  if (!name) return;
  const index = state.leaderboard.findIndex((entry) => entry.name === name);
  if (index !== -1) {
    if (balance > state.leaderboard[index].balance) {
      state.leaderboard[index].balance = balance;
    }
  } else {
    state.leaderboard.push({ name, balance });
  }
  state.leaderboard.sort((a, b) => b.balance - a.balance);
  if (state.leaderboard.length > 5) state.leaderboard.length = 5;
  saveState();
}

export function getLeaderboard() {
  return state.leaderboard;
}
