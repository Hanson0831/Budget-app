// SELECT ELEMENTS
const balanceEl = document.querySelector(".balance .value");
const incomeTotalEl = document.querySelector(".income-total");
const outcomeTotalEl = document.querySelector(".outcome-total");
const incomeEl = document.querySelector("#income");
const expenseEl = document.querySelector("#expense");
const allEl = document.querySelector("#all");
const incomeList = document.querySelector("#income .list");
const expenseList = document.querySelector("#expense .list");
const allList = document.querySelector("#all .list");

// SELECT BUTTONS
const expenseBtn = document.querySelector(".first-tab");
const incomeBtn = document.querySelector(".second-tab");
const allBtn = document.querySelector(".third-tab");

// INPUT BUTTONS
const addExpense = document.querySelector(".add-expense");
const expenseTitle = document.getElementById("expense-title-input");
const expenseAmount = document.getElementById("expense-amount-input");

const addIncome = document.querySelector(".add-income");
const incomeTitle = document.getElementById("income-title-input");
const incomeAmount = document.getElementById("income-amount-input");

// VARIABLES
let ENTRY_LIST;
let balance = 0,
  income = 0,
  outcome = 0;

const DELETE = "delete",
  EDIT = "edit",
  MAX_TITLE_LENGTH = 50;

// LOOK IF THERE IS DATA IN LOCAL STORAGE
ENTRY_LIST = JSON.parse(localStorage.getItem("entry_list")) || [];
updateUI();

// EVENT LISTENERS
expenseBtn.addEventListener("click", function () {
  show(expenseEl);
  hide([incomeEl, allEl]);
  active(expenseBtn);
  inactive([incomeBtn, allBtn]);
});

incomeBtn.addEventListener("click", function () {
  show(incomeEl);
  hide([expenseEl, allEl]);
  active(incomeBtn);
  inactive([expenseBtn, allBtn]);
});

allBtn.addEventListener("click", function () {
  show(allEl);
  hide([incomeEl, expenseEl]);
  active(allBtn);
  inactive([incomeBtn, expenseBtn]);
});

addExpense.addEventListener("click", function () {
  addEntry("expense", expenseTitle, expenseAmount);
});

addIncome.addEventListener("click", function () {
  addEntry("income", incomeTitle, incomeAmount);
});

incomeList.addEventListener("click", deleteOrEdit);
expenseList.addEventListener("click", deleteOrEdit);
allList.addEventListener("click", deleteOrEdit);

// HELPER FUNCTIONS
function addEntry(type, titleInput, amountInput) {
  const validation = validateEntry(titleInput.value, amountInput.value);

  if (!validation.isValid) {
    showError(titleInput, validation.message);
    return;
  }

  clearError(titleInput);

  const entry = {
    type: type,
    title: validation.title,
    amount: validation.amount,
  };

  ENTRY_LIST.push(entry);

  updateUI();
  clearInput([titleInput, amountInput]);
}

function validateEntry(title, amount) {
  // Validation prevents empty or invalid values from entering the app state.
  const trimmedTitle = title.trim();
  const parsedAmount = Number(amount);

  if (!trimmedTitle) {
    return {
      isValid: false,
      message: "Please enter a title.",
    };
  }

  if (trimmedTitle.length > MAX_TITLE_LENGTH) {
    return {
      isValid: false,
      message: `Title must be ${MAX_TITLE_LENGTH} characters or fewer.`,
    };
  }

  if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
    return {
      isValid: false,
      message: "Please enter an amount greater than 0.",
    };
  }

  return {
    isValid: true,
    title: trimmedTitle,
    amount: parsedAmount,
  };
}

function showError(input, message) {
  let errorEl = input.parentNode.querySelector(".input-error");

  if (!errorEl) {
    errorEl = document.createElement("div");
    errorEl.className = "input-error";
    input.parentNode.appendChild(errorEl);
  }

  errorEl.textContent = message;
}

function clearError(input) {
  const errorEl = input.parentNode.querySelector(".input-error");

  if (errorEl) {
    errorEl.remove();
  }
}

function deleteOrEdit(event) {
  const targetBtn = event.target;
  const entry = targetBtn.parentNode;

  if (targetBtn.id == EDIT) {
    editEntry(entry);
  } else if (targetBtn.id == DELETE) {
    deleteEntry(entry);
  }
}

function deleteEntry(entry) {
  ENTRY_LIST.splice(entry.id, 1);
  updateUI();
}

function editEntry(entry) {
  const ENTRY = ENTRY_LIST[entry.id];

  if (ENTRY.type == "income") {
    incomeTitle.value = ENTRY.title;
    incomeAmount.value = ENTRY.amount;
    clearError(incomeTitle);
  } else if (ENTRY.type == "expense") {
    expenseTitle.value = ENTRY.title;
    expenseAmount.value = ENTRY.amount;
    clearError(expenseTitle);
  }

  deleteEntry(entry);
}

function updateUI() {
  income = calculateTotal("income", ENTRY_LIST);
  outcome = calculateTotal("expense", ENTRY_LIST);
  balance = Math.abs(calculateBalance(income, outcome));

  let sign = income >= outcome ? "$" : "-$";

  // UPDATE UI
  balanceEl.innerHTML = `<small>${sign}</small>${balance}`;
  outcomeTotalEl.innerHTML = `<small>$</small>${outcome}`;
  incomeTotalEl.innerHTML = `<small>$</small>${income}`;

  clearElement([expenseList, incomeList, allList]);

  ENTRY_LIST.forEach((entry, index) => {
    if (entry.type == "expense") {
      showEntry(expenseList, entry.type, entry.title, entry.amount, index);
    } else if (entry.type == "income") {
      showEntry(incomeList, entry.type, entry.title, entry.amount, index);
    }

    showEntry(allList, entry.type, entry.title, entry.amount, index);
  });

  updateChart(income, outcome);
  localStorage.setItem("entry_list", JSON.stringify(ENTRY_LIST));
}

function showEntry(list, type, title, amount, id) {
  const entry = `<li id="${id}" class="${type}">
                  <div class="entry">${title} : $${amount}</div>
                  <div id="edit"></div>
                  <div id="delete"></div>
                </li>`;

  const position = "afterbegin";
  list.insertAdjacentHTML(position, entry);
}

function clearElement(elements) {
  elements.forEach((element) => {
    element.innerHTML = "";
  });
}

function calculateTotal(type, list) {
  let sum = 0;

  list.forEach((entry) => {
    if (entry.type == type) {
      sum += entry.amount;
    }
  });

  return sum;
}

function calculateBalance(income, outcome) {
  return income - outcome;
}

function clearInput(inputs) {
  inputs.forEach((input) => {
    input.value = "";
  });
}

function show(element) {
  element.classList.remove("hide");
}

function hide(elements) {
  elements.forEach((element) => {
    element.classList.add("hide");
  });
}

function active(element) {
  element.classList.add("focus");
}

function inactive(elements) {
  elements.forEach((element) => {
    element.classList.remove("focus");
  });
}
