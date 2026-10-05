# Personal Finance Tracker

A web app built with React that helps you keep track of your money — where it comes from and where it goes.

---

## What You Can Do

- Add income and expenses
- See all your past transactions in one list
- Set a budget for different spending categories
- View charts that show how you spend your money
- Switch between dark and light mode

---

## How to Run the App

You need **Node.js** installed first. Get it from [nodejs.org](https://nodejs.org).

Then open a terminal in this folder and run:

```bash
npm install
```

This downloads everything the app needs.

```bash
npm run dev
```

This starts the app. Open your browser and go to **http://localhost:5173**.

---

## Pages in the App

| Page | What It Does |
|------|-------------|
| Dashboard | Shows a summary of your finances |
| Transactions | Lists all your income and expenses |
| Add Transaction | A form to add a new entry |
| Budget | Set limits for how much you want to spend |
| Analytics | Shows charts of your spending |

---

## Folder Structure (Simple Explanation)

```
src/
├── pages/       # The main screens of the app
├── components/  # Smaller parts used across pages (like the Navbar)
├── context/     # Stores data that all pages can access
├── hooks/       # Reusable pieces of logic
├── services/    # Handles talking to an external server
└── utils/       # Small helper functions
```

---

## Libraries Used

| Library | Why It's Used |
|---------|--------------|
| React Router | To move between pages |
| Recharts | To draw the charts |
| Axios | To fetch data from an API |
| React Hook Form + Yup | To handle and check form inputs |
| React Toastify | To show small pop-up messages |
| UUID | To give each transaction a unique ID |
| date-fns | To format dates nicely |

---

## Where to Start Reading the Code

Start here if you want to understand how the app works:

1. `src/main.jsx` — where the app starts
2. `src/App.jsx` — sets up the pages and layout
3. `src/context/FinanceContext.jsx` — where all the data lives
4. `src/pages/` — the individual pages

---

## Author

**Harsh Srivastava**
Class of 2029
