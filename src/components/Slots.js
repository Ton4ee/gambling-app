import { getBalance, setBalance, subscribeBalance } from '../store.js';

export function loadSlots(container, onBalanceChange) {
  container.innerHTML = `
    <div class="container my-4" style="max-width: 480px;">
      <div class="card shadow-sm">
        <div class="card-header text-center bg-danger text-white fw-bold fs-3">
          🎰 Slot Machine
        </div>
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <div><strong>Balance:</strong> <span id="balance" class="fw-monospace"></span></div>
          </div>

          <form id="betForm" class="mb-3 d-flex gap-3">
            <input
              type="number"
              id="bet"
              class="form-control text-center"
              placeholder="Bet amount"
              min="1"
              required
            />
            <button type="submit" id="spinBtn" class="btn btn-danger flex-shrink-0 fw-semibold">
              Spin
            </button>
          </form>

          <div class="d-flex justify-content-center gap-4 mt-4">
            <div
              id="reel1"
              class="bg-dark text-white rounded d-flex align-items-center justify-content-center"
              style="width: 80px; height: 80px; font-size: 3rem; user-select: none;"
            >
              🍒
            </div>
            <div
              id="reel2"
              class="bg-dark text-white rounded d-flex align-items-center justify-content-center"
              style="width: 80px; height: 80px; font-size: 3rem; user-select: none;"
            >
              🍋
            </div>
            <div
              id="reel3"
              class="bg-dark text-white rounded d-flex align-items-center justify-content-center"
              style="width: 80px; height: 80px; font-size: 3rem; user-select: none;"
            >
              🍊
            </div>
          </div>

          <div id="result" class="text-center fs-5 fw-semibold mt-4 min-height-3rem"></div>

          <h5 class="border-bottom pb-2 mt-4 mb-2">Spin History</h5>
          <ul id="history" class="list-group overflow-auto" style="max-height: 180px;"></ul>
        </div>
      </div>
    </div>
  `;

  const balanceEl = document.getElementById("balance");
  const betInput = document.getElementById("bet");
  const reel1 = document.getElementById("reel1");
  const reel2 = document.getElementById("reel2");
  const reel3 = document.getElementById("reel3");
  const resultEl = document.getElementById("result");
  const historyEl = document.getElementById("history");
  const betForm = document.getElementById("betForm");

  subscribeBalance(updateBalance);
  updateBalance();

  function updateBalance(newBalance) {
    balanceEl.textContent = `$${newBalance !== undefined ? newBalance : getBalance()}`;
    if (onBalanceChange) onBalanceChange();
  }

  const symbols = ["🍒", "🍋", "🍊", "🍉", "⭐", "🍇"];

  const addHistory = (bet, outcome, won) => {
    const li = document.createElement("li");
    li.className = `list-group-item d-flex justify-content-between align-items-center ${
      won ? "list-group-item-success" : "list-group-item-danger"
    }`;
    li.innerHTML = `
      <div>Bet <strong>$${bet}</strong></div>
      <div>
        Result: <strong>${outcome}</strong> — <span>${won ? "WIN 🎉" : "LOSE 💀"}</span>
      </div>
    `;
    historyEl.prepend(li);
    if (historyEl.childNodes.length > 10) {
      historyEl.removeChild(historyEl.lastChild);
    }
  };

  let spinning = false;

  betForm.onsubmit = (e) => {
    e.preventDefault();
    if (spinning) return;

    const bet = parseInt(betInput.value);
    const balance = getBalance();

    if (!bet || bet > balance || bet <= 0) {
      betInput.classList.add("is-invalid");
      return;
    } else {
      betInput.classList.remove("is-invalid");
    }

    spinning = true;
    setBalance(balance - bet);
    updateBalance();
    resultEl.textContent = "";

    // Animate reels for 2 seconds
    let spins = 0;
    const maxSpins = 20;

    const interval = setInterval(() => {
      reel1.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      reel2.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      reel3.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      spins++;
      if (spins >= maxSpins) {
        clearInterval(interval);

        // Determine win if all three reels match
        const win = reel1.textContent === reel2.textContent && reel2.textContent === reel3.textContent;

        if (win) {
          const winAmount = bet * 5;
          setBalance(getBalance() + winAmount);
          updateBalance();
          resultEl.textContent = `🎉 Jackpot! You won $${winAmount}`;
        } else {
          resultEl.textContent = `💀 No luck this time!`;
        }
        addHistory(bet, `${reel1.textContent} ${reel2.textContent} ${reel3.textContent}`, win);
        spinning = false;
      }
    }, 100);
  };
}
