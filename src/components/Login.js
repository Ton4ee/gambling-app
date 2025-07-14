import { state, saveState } from '../state.js';

export function loadLogin(container, onLoginSuccess) {
  container.innerHTML = `
    <div class="container py-5">
      <h1 class="mb-4 text-center">🎲 Welcome to the Gambling App</h1>
      <div class="card mx-auto shadow" style="max-width: 400px;">
        <div class="card-body">
          <h5 class="card-title mb-3">Enter your name and deposit to start</h5>
          <form id="loginForm" novalidate>
            <div class="mb-3">
              <label for="username" class="form-label">Username</label>
              <input type="text" class="form-control" id="username" placeholder="Your name" required />
              <div class="invalid-feedback">Please enter your username.</div>
            </div>
            <div class="mb-3">
              <label for="deposit" class="form-label">Deposit Amount ($)</label>
              <input type="number" class="form-control" id="deposit" placeholder="Amount to deposit" min="1" required />
              <div class="invalid-feedback">Please enter a valid deposit amount (min $1).</div>
            </div>
            <button type="submit" class="btn btn-primary w-100">Start Playing</button>
          </form>
        </div>
      </div>
    </div>
  `;

  const form = document.getElementById('loginForm');
  const usernameInput = document.getElementById('username');
  const depositInput = document.getElementById('deposit');

  form.onsubmit = (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const deposit = parseInt(depositInput.value);

    let valid = true;

    if (!username) {
      usernameInput.classList.add('is-invalid');
      valid = false;
    } else {
      usernameInput.classList.remove('is-invalid');
    }

    if (!deposit || deposit < 1) {
      depositInput.classList.add('is-invalid');
      valid = false;
    } else {
      depositInput.classList.remove('is-invalid');
    }

    if (!valid) return;

    state.username = username;
    state.balance = deposit;
    state.isLoggedIn = true;

    saveState();

    onLoginSuccess();
  };
}
