# Color Arena

A live multiplayer color-draw game. Players join a room, pick one of six
colors, place a **virtual peso** bet, and a dealer runs the round through a
countdown → betting → draw → settlement cycle synced in real time over
Firebase Realtime Database.

> **This uses virtual currency only.** No real money, payment cards, or
> real-money payout ever passes through this app.

---

## 1. What's included

- React 18 + Vite + Tailwind CSS + Framer Motion frontend
- Firebase Realtime Database as the multiplayer backend (rooms, players,
  dealer, live game phase, round history, transactions)
- Full round state machine: `WAITING → COUNTDOWN → BETTING → LOCKED →
  DRAWING → RESULT → SETTLEMENT → (repeat)`
- Room create/join with shareable 6-character room codes
- Dealer control panel (start round, open/close betting, draw, pay out,
  reset) — the dealer can never manually pick the winning color; it is
  always chosen by `drawRandomColor()` in `src/utils/colors.js`
- Player betting UI with quick-amount buttons and custom amount entry
- Winner/loser/settlement dashboards, confetti on a win
- Admin panel at `/admin` (list rooms, rename dealer, view players /
  transactions / round history, force-reset or delete a room)

---

## 2. Set up your Firebase project

This app needs **your own** Firebase project — there's no shared backend.

1. Go to the [Firebase console](https://console.firebase.google.com/) and
   create a new project.
2. In the project, add a **Web App** and copy the config values it gives
   you.
3. In the left sidebar, open **Build → Realtime Database** and click
   **Create Database** (start in test mode for local development).
4. Once created, open the **Rules** tab and paste in the starter rules
   below (tighten these before going to production):

```json
{
  "rules": {
    "rooms": {
      "$roomCode": {
        ".read": true,
        ".write": true
      }
    }
  }
}
```

5. Copy `.env.example` to `.env` and fill in the values from step 2:

```bash
cp .env.example .env
```

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_DATABASE_URL=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

The `VITE_FIREBASE_DATABASE_URL` is important — it's the Realtime Database
URL (looks like `https://your-project-default-rtdb.firebaseio.com`), not
the Firestore URL.

---

## 3. Run it locally

```bash
npm install
npm run dev
```

Open the printed local URL (default `http://localhost:5173`). Open it in
a second tab/browser to simulate a second player.

- **Host a room**: choose "HOST A ROOM" on the login screen. You become
  the dealer and get a room code to share.
- **Join a room**: choose "JOIN ROOM" and enter the code the dealer shared.
- The dealer's control panel has one button that always matches the
  current phase (Start Round → Close Betting → Draw Winner → Process
  Payment → Reset Round). Phases also auto-advance when their timer hits
  zero, so the game keeps moving even if the dealer doesn't click every
  button.

---

## 4. Project structure

```
src/
  components/     UI building blocks (ColorButton, BetPanel, DealerPanel,
                   PlayerList, PaymentPanel, WinnerSettlement, LossTracker,
                   CountdownTimer, Confetti)
  pages/          LoginPage, GamePage, AdminPanel
  services/       roomService, gameService, dealerService, paymentService,
                   adminService — all Firebase read/write logic lives here
  firebase/       config.js — Firebase app + Realtime Database init
  hooks/          useRoom, useGameState, useCountdown
  utils/          colors.js (color list + random draw), payout.js
                   (winner/loser math), format.js (peso formatting, room
                   code + id generation)
```

### Firebase data shape

```
rooms/
  <roomCode>/
    dealer/          { dealerId, name, avatar, status }
    game/             { phase, timerEndsAt, timerDuration, winningColor,
                         roundId, roundNumber }
    players/
      <playerId>/     { name, avatar, selectedColor, betAmount, balance,
                         wins, losses, online }
    rounds/
      <roundId>/      { winningColor, timestamp, totalPool, totalPayout,
                         totalLosses, houseProfit }
    transactions/
      <txId>/         { playerId, type, amount, roundId, timestamp }
```

---

## 5. Deploy to Vercel

1. Push this project to a GitHub repo.
2. In Vercel, click **Add New → Project** and import the repo. Vercel
   auto-detects the Vite framework preset — no build settings to change.
3. Under **Environment Variables**, add every `VITE_FIREBASE_*` key from
   your `.env` file.
4. Deploy. `vercel.json` in this project already adds the SPA rewrite
   rule needed so client-side routes like `/room/ABCD01` work on refresh.

Alternatively, from the CLI:

```bash
npm i -g vercel
vercel
```

---

## 6. Notes on the payout model

- Winners are paid **6× their bet** (defined as `PAYOUT_MULTIPLIER` in
  `src/utils/payout.js`) — adjust this constant to change the house edge.
  Every player starts with a virtual balance of ₱1,000
  (`src/services/roomService.js`).
- Settlement math lives in one place (`src/utils/payout.js`) and is kept
  separate from the payment/display components, matching the "don't mix
  payment logic with game logic" requirement.
