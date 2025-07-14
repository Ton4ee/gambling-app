import { getBalance, setBalance, subscribeBalance } from '../store.js';

export function loadCoinFlip(container, onBalanceChange) {
  container.innerHTML = `
    <div class="container my-4" style="max-width: 480px;">
      <div class="card shadow-sm">
        <div class="card-header text-center bg-warning text-dark fw-bold fs-3">
          🪙 Coin Flip
        </div>
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <div><strong>Balance:</strong> <span id="balance" class="fw-monospace"></span></div>
          </div>

          <form id="betForm" class="mb-3">
            <div class="mb-3 d-flex justify-content-center gap-4">
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="choice" id="headsRadio" value="heads" checked>
                <label class="form-check-label" for="headsRadio">Heads</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="choice" id="tailsRadio" value="tails">
                <label class="form-check-label" for="tailsRadio">Tails</label>
              </div>
            </div>
            <input type="number" id="bet" class="form-control mb-3 text-center" placeholder="Bet amount" min="1" />
            <button type="submit" id="flipBtn" class="btn btn-warning w-100 fw-semibold">
              Flip Coin
            </button>
          </form>

          <div class="d-flex justify-content-center mb-3" style="perspective: 600px;">
            <div id="coin" class="rounded-circle position-relative" style="
              width: 160px; height: 160px; 
              transform-style: preserve-3d; 
              transition: transform 1s ease-out;
              cursor: pointer;
            ">
              <img id="coin-front" src="/images/heads.png" alt="Heads" class="rounded-circle backface-hidden w-100 h-100" />
              <img id="coin-back" src="/images/tails.png" alt="Tails" class="rounded-circle backface-hidden position-absolute top-0 start-0 w-100 h-100 rotate-y-180" />
            </div>
          </div>

          <div id="result" class="text-center fs-5 fw-semibold mb-3" style="min-height: 2rem;"></div>

          <h5 class="border-bottom pb-2 mb-2">Bet History</h5>
          <ul id="history" class="list-group overflow-auto" style="max-height: 180px;"></ul>
        </div>
      </div>
    </div>
  `;

  const balanceEl = document.getElementById("balance");
  const betInput = document.getElementById("bet");
  const coin = document.getElementById("coin");
  const resultEl = document.getElementById("result");
  const historyEl = document.getElementById("history");
  const betForm = document.getElementById("betForm");

  subscribeBalance(updateBalance);
  updateBalance();

  function updateBalance(newBalance) {
    balanceEl.textContent = `$${newBalance !== undefined ? newBalance : getBalance()}`;
    if (onBalanceChange) onBalanceChange();
  }

  const addHistory = (betAmount, choice, outcome, won) => {
    const li = document.createElement("li");
    li.className = `list-group-item d-flex justify-content-between align-items-center ${
      won ? "list-group-item-success" : "list-group-item-danger"
    }`;
    li.innerHTML = `
      <div>
        Bet <strong>$${betAmount}</strong> on <strong>${choice.toUpperCase()}</strong>
      </div>
      <div>
        Result: <strong>${outcome.toUpperCase()}</strong> — 
        <span>${won ? "WIN 🎉" : "LOSE 💀"}</span>
      </div>
    `;
    historyEl.prepend(li);
    if (historyEl.childNodes.length > 10) {
      historyEl.removeChild(historyEl.lastChild);
    }
  };

  let flipping = false;

  betForm.onsubmit = (e) => {
    e.preventDefault();
    if (flipping) return;

    const bet = parseInt(betInput.value);
    const balance = getBalance();

    if (!bet || bet > balance || bet <= 0) {
      betInput.classList.add("is-invalid");
      return;
    } else {
      betInput.classList.remove("is-invalid");
    }

    const choice = document.querySelector('input[name="choice"]:checked').value;

    flipping = true;
    setBalance(balance - bet);
    resultEl.textContent = "";

    let rotation = 0;
    const spinDuration = 2500;
    const intervalTime = 20;
    const totalSteps = spinDuration / intervalTime;
    let steps = 0;

    const isHeads = Math.random() < 0.5;

    const spinInterval = setInterval(() => {
      rotation += 20;
      coin.style.transform = `rotateY(${rotation}deg)`;
      steps++;

      if (steps >= totalSteps) {
        clearInterval(spinInterval);
        coin.style.transform = `rotateY(${isHeads ? 0 : 180}deg)`;

        const outcome = isHeads ? "heads" : "tails";
        const won = choice === outcome;

        resultEl.textContent = won
          ? `🎉 ${outcome.toUpperCase()}! You win $${bet * 2}`
          : `💀 ${outcome.toUpperCase()}! You lose.`;
        if (won) setBalance(getBalance() + bet * 2);
        updateBalance();

        addHistory(bet, choice, outcome, won);
        flipping = false;
      }
    }, intervalTime);
  };
}
