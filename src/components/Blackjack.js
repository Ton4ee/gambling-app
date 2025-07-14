import { getBalance, setBalance, subscribeBalance } from '../store.js';

export function loadBlackjack(container, updateBalanceDisplay) {
  container.innerHTML = `
    <div class="container my-4" style="max-width: 650px;">
      <div class="card shadow-sm">
        <div class="card-header text-center bg-primary text-white fw-bold fs-3">
          🃏 Blackjack
        </div>
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <div><strong>Balance:</strong> <span id="balance" class="fw-monospace"></span></div>
          </div>

          <form id="betForm" class="mb-3 d-flex gap-3">
            <input type="number" id="bet" class="form-control text-center" placeholder="Bet amount" min="1" required />
            <button type="submit" id="dealBtn" class="btn btn-primary flex-shrink-0">Deal</button>
          </form>

          <div id="actions" class="mb-3 d-flex gap-2 flex-wrap">
            <button id="hitBtn" class="btn btn-success" disabled>Hit</button>
            <button id="standBtn" class="btn btn-warning" disabled>Stand</button>
            <button id="splitBtn" class="btn btn-info" disabled>Split</button>
            <button id="doubleBtn" class="btn btn-danger" disabled>Double Down</button>
          </div>

          <div class="row mt-4">
            <div class="col-6 text-center">
              <h5>Your Hand</h5>
              <div id="playerCards" class="d-flex justify-content-center gap-2 flex-wrap mt-2"></div>
              <div id="playerScore" class="mt-2 fw-semibold">Score: 0</div>
            </div>
            <div class="col-6 text-center">
              <h5>Dealer</h5>
              <div id="dealerCards" class="d-flex justify-content-center gap-2 flex-wrap mt-2"></div>
              <div id="dealerScore" class="mt-2 fw-semibold">Score: 0</div>
            </div>
          </div>

          <div id="result" class="text-center fs-5 fw-semibold mt-4" style="min-height: 2rem;"></div>
        </div>
      </div>
    </div>
  `;

  const balanceEl = document.getElementById("balance");
  const betForm = document.getElementById("betForm");
  const dealBtn = document.getElementById("dealBtn");
  const hitBtn = document.getElementById("hitBtn");
  const standBtn = document.getElementById("standBtn");
  const splitBtn = document.getElementById("splitBtn");
  const doubleBtn = document.getElementById("doubleBtn");

  let deckId = "";
  let playerHand = [];
  let dealerHand = [];
  let bet = 0;
  let canSplit = false;
  let hasSplit = false;
  let splitHand = [];
  let splitBet = 0;
  let currentHand = "main"; // "main" or "split"
  let gameOver = false;

  subscribeBalance(updateBalance);
  updateBalance();

  function updateBalance(newBalance) {
    balanceEl.textContent = `$${newBalance !== undefined ? newBalance : getBalance()}`;
    if (updateBalanceDisplay) updateBalanceDisplay(newBalance);
  }

  function getCardValue(value) {
    if (["KING", "QUEEN", "JACK"].includes(value)) return 10;
    if (value === "ACE") return 11;
    return parseInt(value);
  }

  function getHandValue(hand) {
    let total = 0,
      aces = 0;
    hand.forEach((card) => {
      const val = getCardValue(card.value);
      total += val;
      if (card.value === "ACE") aces++;
    });
    while (total > 21 && aces) {
      total -= 10;
      aces--;
    }
    return total;
  }

  function renderCards(hand, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    hand.forEach((card) => {
      const img = document.createElement("img");
      img.src = card.image;
      img.className = "img-fluid rounded shadow-sm";
      img.style.width = "60px";
      container.appendChild(img);
    });
  }

  function updateScores() {
    const mainHand = currentHand === "main" ? playerHand : splitHand;
    const mainScore = getHandValue(mainHand);
    const otherScore = currentHand === "main" && hasSplit ? getHandValue(splitHand) : 0;

    document.getElementById("playerScore").textContent = `Score: ${mainScore}`;
    document.getElementById("dealerScore").textContent = `Score: ${getHandValue(dealerHand)}`;
  }

  async function drawCards(count) {
    const res = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${count}`);
    const data = await res.json();
    return data.cards;
  }

  async function newDeck() {
    const res = await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1");
    const data = await res.json();
    deckId = data.deck_id;
  }

  function enableButtons(enable) {
    hitBtn.disabled = !enable;
    standBtn.disabled = !enable;
    doubleBtn.disabled = !enable;
    splitBtn.disabled = !enable || !canSplit;
  }

  function resetGame() {
    playerHand = [];
    dealerHand = [];
    splitHand = [];
    bet = 0;
    splitBet = 0;
    hasSplit = false;
    canSplit = false;
    currentHand = "main";
    gameOver = false;
    document.getElementById("result").textContent = "";
    renderCards([], "playerCards");
    renderCards([], "dealerCards");
    updateScores();
    enableButtons(false);
    dealBtn.disabled = false;
  }

  function checkCanSplit() {
    if (playerHand.length === 2 && playerHand[0].value === playerHand[1].value) {
      canSplit = true;
    } else {
      canSplit = false;
    }
  }

  function switchHand() {
    currentHand = currentHand === "main" ? "split" : "main";
    updateScores();
    enableButtons(true);
    if (currentHand === "split") {
      hitBtn.disabled = false;
      standBtn.disabled = false;
      doubleBtn.disabled = false;
      splitBtn.disabled = true;
    }
  }

  function endRound(message) {
    document.getElementById("result").textContent = message;
    enableButtons(false);
    dealBtn.disabled = false;
    gameOver = true;
    updateBalance();
  }

  betForm.onsubmit = async (e) => {
    e.preventDefault();

    resetGame();

    bet = parseInt(document.getElementById("bet").value);
    const balance = getBalance();

    if (!bet || bet > balance || bet <= 0) {
      alert("Invalid bet");
      return;
    }

    setBalance(balance - bet);
    updateBalance();
    document.getElementById("result").textContent = "";

    await newDeck();

    // Deal initial cards
    playerHand = await drawCards(2);
    dealerHand = await drawCards(2);

    renderCards(playerHand, "playerCards");
    renderCards([dealerHand[0]], "dealerCards"); // show only one dealer card

    updateScores();

    checkCanSplit();

    enableButtons(true);
    dealBtn.disabled = true;

    // If blackjack on deal
    if (getHandValue(playerHand) === 21) {
      endRound("🎉 Blackjack! You win 1.5x your bet!");
      setBalance(getBalance() + bet * 2.5); // return bet + 1.5x winnings
    }
  };

  hitBtn.onclick = async () => {
    if (gameOver) return;

    if (currentHand === "main") {
      const newCard = await drawCards(1);
      playerHand.push(...newCard);
      renderCards(playerHand, "playerCards");
      updateScores();

      if (getHandValue(playerHand) > 21) {
        if (hasSplit) {
          switchHand();
        } else {
          endRound("💥 You busted! Dealer wins.");
        }
      }
    } else if (currentHand === "split") {
      const newCard = await drawCards(1);
      splitHand.push(...newCard);
      renderCards(splitHand, "playerCards");
      updateScores();

      if (getHandValue(splitHand) > 21) {
        endRound("💥 You busted! Dealer wins.");
      }
    }
  };

  standBtn.onclick = async () => {
    if (gameOver) return;

    if (hasSplit && currentHand === "main") {
      switchHand();
      return;
    }

    // Reveal dealer's hand
    renderCards(dealerHand, "dealerCards");

    // Dealer hits until 17+
    while (getHandValue(dealerHand) < 17) {
      const newCard = await drawCards(1);
      dealerHand.push(...newCard);
      renderCards(dealerHand, "dealerCards");
    }

    // Evaluate results
    const playerScore = getHandValue(playerHand);
    const dealerScore = getHandValue(dealerHand);

    let message = "";

    if (hasSplit) {
      // Evaluate both hands
      const splitScore = getHandValue(splitHand);

      // Result for main hand
      if (playerScore > 21) {
        message += "Main hand busted! Dealer wins.<br/>";
      } else if (dealerScore > 21 || playerScore > dealerScore) {
        setBalance(getBalance() + bet * 2);
        message += "Main hand wins! 🎉<br/>";
      } else if (playerScore === dealerScore) {
        setBalance(getBalance() + bet);
        message += "Main hand ties. 🤝<br/>";
      } else {
        message += "Main hand loses. 💀<br/>";
      }

      // Result for split hand
      if (splitScore > 21) {
        message += "Split hand busted! Dealer wins.<br/>";
      } else if (dealerScore > 21 || splitScore > dealerScore) {
        setBalance(getBalance() + splitBet * 2);
        message += "Split hand wins! 🎉<br/>";
      } else if (splitScore === dealerScore) {
        setBalance(getBalance() + splitBet);
        message += "Split hand ties. 🤝<br/>";
      } else {
        message += "Split hand loses. 💀<br/>";
      }
    } else {
      // Single hand result
      if (playerScore > 21) {
        message = "You busted! Dealer wins.";
      } else if (dealerScore > 21 || playerScore > dealerScore) {
        setBalance(getBalance() + bet * 2);
        message = "🎉 You win!";
      } else if (playerScore === dealerScore) {
        setBalance(getBalance() + bet);
        message = "🤝 It's a tie!";
      } else {
        message = "💀 Dealer wins.";
      }
    }

    endRound(message);
  };

  splitBtn.onclick = async () => {
    if (!canSplit || hasSplit) return;

    const balance = getBalance();

    if (bet > balance) {
      alert("Not enough balance to split.");
      return;
    }

    splitHand = [playerHand.pop()];
    renderCards(playerHand, "playerCards");
    renderCards(splitHand, "playerCards");

    splitBet = bet;
    setBalance(balance - splitBet);
    hasSplit = true;
    currentHand = "main";

    updateScores();
    enableButtons(true);
    splitBtn.disabled = true;
    doubleBtn.disabled = false;
  };

  doubleBtn.onclick = async () => {
    const balance = getBalance();

    if (currentHand === "main") {
      if (balance < bet) {
        alert("Not enough balance to double down.");
        return;
      }
      setBalance(balance - bet);
      bet *= 2;

      const newCard = await drawCards(1);
      playerHand.push(...newCard);
      renderCards(playerHand, "playerCards");
      updateScores();

      if (getHandValue(playerHand) > 21) {
        endRound("💥 You busted! Dealer wins.");
      } else {
        standBtn.onclick();
      }
    } else if (currentHand === "split") {
      if (balance < splitBet) {
        alert("Not enough balance to double down.");
        return;
      }
      setBalance(balance - splitBet);
      splitBet *= 2;

      const newCard = await drawCards(1);
      splitHand.push(...newCard);
      renderCards(splitHand, "playerCards");
      updateScores();

      if (getHandValue(splitHand) > 21) {
        endRound("💥 You busted! Dealer wins.");
      } else {
        standBtn.onclick();
      }
    }
    doubleBtn.disabled = true;
  };
}
