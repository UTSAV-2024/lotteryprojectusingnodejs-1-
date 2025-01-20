/*
Steps-
1.Deposit some money
2.Dtermine no. of lines to bet on
3.Collect a bet amount
4.Spin the slot machine
5.Check if the user won
6.Give the user their winnings
7.Play again
*/
const prompt = require("prompt-sync")();
const ROWS = 3;
const COLS = 3;
const Symbols_count = { A: 2, B: 4, C: 6, D: 8 };
const Symbol_Value = { A: 5, B: 4, C: 3, D: 2 };
const deposit = () => {
  while (true) {
    const amount = parseFloat(prompt("Enter the amount you want to deposit: ")); //By default prompt returns a string so we need to convert it to float
    if (isNaN(amount) || amount <= 0)
      console.log("Please enter a valid amount");
    else return amount;
  }
};

//Similarly
const lines = () => {
  while (true) {
    const line = parseInt(
      prompt("Enter the number of lines you want to bet on: ")
    );
    if (isNaN(line) || line <= 0 || line > 3)
      console.log("Please enter a valid number of lines");
    else return line;
  }
};

//The bet amount will be based on their balance and the number of lines they want to bet on
const getbet = (balance, lines) => {
  while (true) {
    const amount = parseFloat(prompt("Enter the bet amount per line: "));
    if (isNaN(amount) || amount <= 0 || amount > balance / lines)
      console.log("Please enter a valid amount");
    else return amount;
  }
};

//An array in javasccript is a reference type so we can manipulate the array without changing its reference
const spin = () => {
  const symbols = [];
  for (const [symbol, count] of Object.entries(Symbols_count)) {
    for (let i = 0; i < count; i++) {
      symbols.push(symbol);
    }
  }
  const reels = [];
  for (let i = 0; i < COLS; i++) {
    reels.push([]);
    const reelsymbols = [...symbols]; //Now after every spin the symbols will be removed but we can't remove the symbols from the original array so we will create a copy of the array
    for (let j = 0; j < ROWS; j++) {
      const randomIndex = Math.floor(Math.random() * reelsymbols.length); //We don't use +1 because the length of the array is 1 more than the index and so we are choosing random number from 0 to length-1
      const selectedsymbol = reelsymbols[randomIndex];
      reels[i].push(selectedsymbol);
      reelsymbols.splice(randomIndex, 1); //1 denotes that we are removing 1 element from the array from the random index generated
    }
  }
  return reels;
};
const transpose = (reels) => {
  const rows = [];
  for (let i = 0; i < ROWS; i++) {
    rows.push([]);
    for (let j = 0; j < COLS; j++) {
      rows[i].push(reels[j][i]);
    }
  }
  return rows;
};

const printRows = (rows) => {
  for (const row of rows) {
    rowstring = "";
    for (let i = 0; i < row.length; i++) {
      rowstring += row[i];
      if (i != row.length - 1) {
        rowstring += " | ";
      }
    }
    console.log(rowstring);
  }
};
const getWinnings = (rows, bets, lines) => {
  let winnings = 0;
  for (let row = 0; row < lines; row++) {
    const symbols = rows[row];
    let allsame = true;
    for (let i = 1; i < symbols.length; i++) {
      if (symbols[i] != symbols[0]) {
        allsame = false;
        break;
      }
    }
    if (allsame) {
      winnings += bets * Symbol_Value[symbols[0]];
    }
  }
  return winnings;
};

const game = () => {
  let balance = deposit();
  while (true) {
    console.log(`You have balance of ${balance}`);
    const linesbet = lines();
    const bet = getbet(balance, linesbet);
    balance -= bet * linesbet;
    const spinresult = spin();
    const rows = transpose(spinresult);
    printRows(rows);
    const winnings = getWinnings(rows, bet, linesbet);
    balance += winnings;
    if (winnings > 0) {
      console.log(`Congratulations you won ${winnings}`);
    } else {
      console.log("Sorry you lost");
    }
    if (balance <= 0) {
      console.log("You are out of balance");
      break;
    }
    const playagain = prompt("Do you want to play again? ");
    if (playagain.toLowerCase() != "yes") {
      break;
    }
  }
};
game();