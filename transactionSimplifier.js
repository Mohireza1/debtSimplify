'use strict';

class App {
  // Main database with users data
  #users = {
    Mohi: {
      Shakuri: [20, 50, -60],
      Fazel: [-20, -30],
      Maha: [90],
    },

    Shakuri: {
      Mohi: [-20, -50, 60],
      Fazel: [-30, -30, 30],
      Maha: [-70, 10, -80],
    },

    Fazel: {
      Mohi: [20, 30],
      Shakouri: [30, 30, -30],
      Maha: [10, -180],
    },

    Maha: {
      Mohi: [-90],
      Shakouri: [70, -10, 80],
      Fazel: [-10, 180],
    },
  };

  #scores = new Map();
  #positives = [];
  #negatives = [];

  constructor() {
    this.#calculateScore();
    this.#splitDebts();
    this.#simplify();
  }

  //   API
  showStatus(name = 'all') {
    if (name === 'all') {
      Object.entries(this.#users).forEach(([username, tracks], i) => {
        console.log(username + ':');
        Object.entries(tracks).forEach(([acct, nums]) => {
          const sum = nums.reduce((total, num) => total + num, 0);
          console.log(
            sum > 0
              ? `${acct} owes $${Math.abs(sum)} to ${username}`
              : `${username} owes $${Math.abs(sum)} to ${acct}`
          );
        });
        if (i !== Object.entries(this.#users).length - 1) {
          console.log('='.repeat(15));
        }
      });
    } else {
      Object.entries(this.#users[name]).forEach(([acct, nums]) => {
        const sum = nums.reduce((total, num) => total + num, 0);
        console.log(
          sum > 0
            ? `${acct} owes $${Math.abs(sum)} to ${name}`
            : `${name} owes $${Math.abs(sum)} to ${acct}`
        );
      });
    }
  }
  //   Private methods

  //   Calculate the 'total total' sum of everyone's debts
  #calculateScore() {
    Object.entries(this.#users).forEach(([key, val]) => {
      let sum3 = 0;
      Object.entries(val).forEach(([debter, debt]) => {
        sum3 += debt.reduce((total, num) => total + num, 0);
      });
      this.#scores.set(key, sum3);
    });
  }

  //   Split the users between positive debts and negative debts
  #splitDebts() {
    this.#scores.forEach((score, name) =>
      score > 0
        ? this.#positives.push([name, score])
        : this.#negatives.push([name, score])
    );
  }

  // Simplifies thetaransactions by balancing out the positives with the negatives
  #simplify() {
    const strings = [];
    const newPos = this.#positives.slice();
    const newNeg = this.#negatives.slice();
    // newNeg[0][1] = -50;

    for (let i = 0; i < newPos.length; i++) {
      // Priority 1: The optimal negative we are looking for is an equal to our current positive
      const equal = newNeg.find(neg => -neg[1] === newPos[i][1]);
      if (equal) {
        strings.push(
          `${newPos[i][0]} pays $${newPos[i][1]} to ${
            newNeg[newNeg.indexOf(equal)][0]
          }`
        );
        newPos.splice(newPos[i], 1);
        newNeg.splice(newNeg[newNeg.indexOf(equal)], 1);
        continue;
      }

      // Priority 2: The less wanted negative is one smaller than the current pos
      const smaller = newNeg.find(neg => -neg[1] < newPos[i][1]);
      if (smaller) {
        strings.push(
          `${newPos[i][0]} pays $${-smaller[1]} to ${
            newNeg[newNeg.indexOf(smaller)][0]
          }`
        );
        newPos[i][1] += smaller[1];
        newNeg.splice(newNeg[newNeg.indexOf(smaller)], 1);
        i--;
        continue;
      }

      // Priority 3: The least wanted negative is one with greater value than the current positive which removes the positive by balancing it out
      const greater = newNeg.find(neg => -neg[1] > newPos[i][1]);
      if (greater) {
        strings.push(
          `${newPos[i][0]} pays $${newPos[i][1]} to ${
            newNeg[newNeg.indexOf(greater)][0]
          }`
        );
        newNeg[newNeg.indexOf(greater)][1] += newPos[i][1];
        newPos.splice(i, 1);
        i--;
        continue;
      }
    }
    console.log(strings);
  }
}

const app = new App();
// app.showStatus();
