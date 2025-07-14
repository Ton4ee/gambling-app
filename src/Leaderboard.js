// src/components/Leaderboard.js
import { getLeaderboard } from '../state.js';

export function loadLeaderboard(container) {
  const leaderboard = getLeaderboard();

  container.innerHTML = `
    <div class="mt-4">
      <h3 class="text-center">🏆 Leaderboard</h3>
      <ul class="list-group mt-2">
        ${leaderboard.map((p, i) => `
          <li class="list-group-item d-flex justify-content-between">
            <span>#${i + 1} ${p.username}</span>
            <span>$${p.balance}</span>
          </li>
        `).join('')}
      </ul>
    </div>
  `;
}
