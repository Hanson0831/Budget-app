// Centralizing constants keeps configuration easy to change and avoids repeated strings.
const CONFIG = {
  storageKey: "entry_list",
  currencySymbol: "$",
  entryTypes: {
    income: "income",
    expense: "expense",
  },
  actions: {
    edit: "edit",
    delete: "delete",
  },
  validation: {
    maxTitleLength: 50,
  },
  selectors: {
    balanceValue: ".balance .value",
    incomeTotal: ".income-total",
    outcomeTotal: ".outcome-total",
    incomeSection: "#income",
    expenseSection: "#expense",
    allSection: "#all",
    list: ".list",
    expenseTab: ".first-tab",
    incomeTab: ".second-tab",
    allTab: ".third-tab",
    addExpense: ".add-expense",
    addIncome: ".add-income",
    expenseTitleInput: "expense-title-input",
    expenseAmountInput: "expense-amount-input",
    incomeTitleInput: "income-title-input",
    incomeAmountInput: "income-amount-input",
  },
};

// SELECT ELEMENTS
const balanceEl = document.querySelector(CONFIG.selectors.balanceValue);
const incomeTotalEl = document.querySelector(CONFIG.selectors.incomeTotal);
const outcomeTotalEl = document.querySelector(CONFIG.selectors.outcomeTotal);
const incomeEl = document.querySelector(CONFIG.selectors.incomeSection);
const expenseEl = document.querySelector(CONFIG.selectors.expenseSection);
const allEl = document.querySelector(CONFIG.selectors.allSection);
const incomeList = document.querySelector(`${CONFIG.selectors.incomeSection} ${CONFIG.selectors.list}`);
const expenseList = document.querySelector(`${CONFIG.selectors.expenseSection} ${CONFIG.selectors.list}`);
const allList = document.querySelector(`${CONFIG.selectors.allSection} ${CONFIG.selectors.list}`);

// SELECT BUTTONS
const expenseBtn = document.querySelector(CONFIG.selectors.expenseTab);
const incomeBtn = document.querySelector(CONFIG.selectors.incomeTab);
const allBtn = document.querySelector(CONFIG.selectors.allTab);

// INPUT BUTTONS
const addExpense = document.querySelector(CONFIG.selectors.addExpense);
const expenseTitle = document.getElementById(CONFIG.selectors.expenseTitleInput);
const expenseAmount = document.getElementById(CONFIG.selectors.expenseAmountInput);

const addIncome = document.querySelector(CONFIG.selectors.addIncome);
const incomeTitle = document.getElementById(CONFIG.selectors.incomeTitleInput);
const incomeAmount = document.getElementById(CONFIG.selectors.incomeAmountInput);

// VARIABLES
let ENTRY_LIST = loadEntries();
let balance = 0,
  income = 0,
  outcome = 0;

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
  addEntry(CONFIG.entryTypes.expense, expenseTitle, expenseAmount);
});

addIncome.addEventListener("click", function () {
  addEntry(CONFIG.entryTypes.income, incomeTitle, incomeAmount);
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

  // Stable IDs decouple stored data from the DOM order, which makes editing/deleting safer.
  ENTRY_LIST.push({
    id: generateEntryId(),
    type,
    title: validation.entry.title,
    amount: validation.entry.amount,
  });

  updateUI();
  clearInput([titleInput, amountInput]);
}

function validateEntry(title, amount) {
  const trimmedTitle = title.trim();
  const parsedAmount = Number(amount);

  if (!trimmedTitle) {
    return { isValid: false, message: "Please enter a title." };
  }

  if (trimmedTitle.length > CONFIG.validation.maxTitleLength) {
    return {
      isValid: false,
      message: `Title must be ${CONFIG.validation.maxTitleLength} characters or fewer.`,
    };
  }

  if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
    return { isValid: false, message: "Please enter an amount greater than 0." };
  }

  return {
    isValid: true,
    entry: {
      title: trimmedTitle,
      amount: parsedAmount,
    },
  };
}

function generateEntryId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function deleteOrEdit(event) {
  const targetBtn = event.target;
  const action = targetBtn.dataset.action;
  const entry = targetBtn.closest("[data-entry-id]");

  if (!entry || !action) return;

  if (action == CONFIG.actions.edit) {
    editEntry(entry.dataset.entryId);
  } else if (action == CONFIG.actions.delete) {
    deleteEntry(entry.dataset.entryId);
  }
}

function deleteEntry(entryId) {
  ENTRY_LIST = ENTRY_LIST.filter((entry) => entry.id !== entryId);
  updateUI();
}

function editEntry(entryId) {
  const entry = ENTRY_LIST.find((item) => item.id === entryId);

  if (!entry) return;

  if (entry.type == CONFIG.entryTypes.income) {
    incomeTitle.value = entry.title;
    incomeAmount.value = entry.amount;
    clearError(incomeTitle);
  } else if (entry.type == CONFIG.entryTypes.expense) {
    expenseTitle.value = entry.title;
    expenseAmount.value = entry.amount;
    clearError(expenseTitle);
  }

  deleteEntry(entryId);
}

function updateUI() {
  income = calculateTotal(CONFIG.entryTypes.income, ENTRY_LIST);
  outcome = calculateTotal(CONFIG.entryTypes.expense, ENTRY_LIST);
  balance = Math.abs(calculateBalance(income, outcome));

  let sign = income >= outcome ? CONFIG.currencySymbol : `-${CONFIG.currencySymbol}`;

  // These summary values are app-generated, not user input.
  balanceEl.innerHTML = `<small>${sign}</small>${balance}`;
  outcomeTotalEl.innerHTML = `<small>${CONFIG.currencySymbol}</small>${outcome}`;
  incomeTotalEl.innerHTML = `<small>${CONFIG.currencySymbol}</small>${income}`;

  clearElement([expenseList, incomeList, allList]);

  ENTRY_LIST.forEach((entry) => {
    if (entry.type == CONFIG.entryTypes.expense) {
      showEntry(expenseList, entry);
    } else if (entry.type == CONFIG.entryTypes.income) {
      showEntry(incomeList, entry);
    }
    showEntry(allList, entry);
  });
  updateChart(income, outcome);
  saveEntries(ENTRY_LIST);
}

function showEntry(list, entry) {
  const listItem = document.createElement("li");
  listItem.className = entry.type;
  listItem.dataset.entryId = entry.id;

  const entryText = document.createElement("div");
  entryText.className = "entry";
  // textContent prevents user input from being interpreted as executable HTML.
  entryText.textContent = `${entry.title} : ${CONFIG.currencySymbol}${entry.amount}`;

  const editButton = document.createElement("div");
  editButton.dataset.action = CONFIG.actions.edit;

  const deleteButton = document.createElement("div");
  deleteButton.dataset.action = CONFIG.actions.delete;

  listItem.appendChild(entryText);
  listItem.appendChild(editButton);
  listItem.appendChild(deleteButton);
  list.prepend(listItem);
}

function loadEntries() {
  try {
    // localStorage is the persistence layer for this static app, so corrupted data needs recovery.
    const storedEntries = localStorage.getItem(CONFIG.storageKey);

    if (!storedEntries) return [];

    const parsedEntries = JSON.parse(storedEntries);

    if (!Array.isArray(parsedEntries)) {
      throw new Error("Stored entries are not an array.");
    }

    return parsedEntries.map(normalizeStoredEntry).filter(Boolean);
  } catch (error) {
    console.warn("Budget App could not load saved entries. Starting with an empty list.", error);
    try {
      localStorage.removeItem(CONFIG.storageKey);
    } catch (removeError) {
      console.warn("Budget App could not remove invalid localStorage data.", removeError);
    }
    return [];
  }
}

function normalizeStoredEntry(entry) {
  if (!entry || typeof entry !== "object") return null;
  if (!Object.values(CONFIG.entryTypes).includes(entry.type)) return null;

  const validation = validateEntry(String(entry.title || ""), entry.amount);
  if (!validation.isValid) return null;

  return {
    // Older localStorage data did not have IDs, so it is migrated during loading.
    id: typeof entry.id === "string" && entry.id ? entry.id : generateEntryId(),
    type: entry.type,
    title: validation.entry.title,
    amount: validation.entry.amount,
  };
}

function saveEntries(entries) {
  try {
    localStorage.setItem(CONFIG.storageKey, JSON.stringify(entries));
  } catch (error) {
    console.warn("Budget App could not save entries to localStorage.", error);
  }
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

function clearElement(elements) {
  elements.forEach((element) => {
    element.textContent = "";
  });
}

function calculateTotal(type, list) {
  return list.reduce((sum, entry) => {
    if (entry.type == type) {
      return sum + entry.amount;
    }

    return sum;
  }, 0);
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