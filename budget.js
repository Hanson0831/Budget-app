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

const VALIDATION_MESSAGES = {
  titleRequired: "Please enter a title.",
  titleTooLong: (max) => `Title must be ${max} characters or fewer.`,
  invalidAmount: "Please enter an amount greater than 0.",
};

const balanceEl = document.querySelector(CONFIG.selectors.balanceValue);
const incomeTotalEl = document.querySelector(CONFIG.selectors.incomeTotal);
const outcomeTotalEl = document.querySelector(CONFIG.selectors.outcomeTotal);
const incomeEl = document.querySelector(CONFIG.selectors.incomeSection);
const expenseEl = document.querySelector(CONFIG.selectors.expenseSection);
const allEl = document.querySelector(CONFIG.selectors.allSection);
const incomeList = document.querySelector(`${CONFIG.selectors.incomeSection} ${CONFIG.selectors.list}`);
const expenseList = document.querySelector(`${CONFIG.selectors.expenseSection} ${CONFIG.selectors.list}`);
const allList = document.querySelector(`${CONFIG.selectors.allSection} ${CONFIG.selectors.list}`);

const expenseBtn = document.querySelector(CONFIG.selectors.expenseTab);
const incomeBtn = document.querySelector(CONFIG.selectors.incomeTab);
const allBtn = document.querySelector(CONFIG.selectors.allTab);

const addExpense = document.querySelector(CONFIG.selectors.addExpense);
const expenseTitle = document.getElementById(CONFIG.selectors.expenseTitleInput);
const expenseAmount = document.getElementById(CONFIG.selectors.expenseAmountInput);
const addIncome = document.querySelector(CONFIG.selectors.addIncome);
const incomeTitle = document.getElementById(CONFIG.selectors.incomeTitleInput);
const incomeAmount = document.getElementById(CONFIG.selectors.incomeAmountInput);

let ENTRY_LIST = loadEntries();
let balance = 0;
let income = 0;
let outcome = 0;

setActiveTab("all");
updateUI();

expenseBtn.addEventListener("click", () => setActiveTab("expense"));
incomeBtn.addEventListener("click", () => setActiveTab("income"));
allBtn.addEventListener("click", () => setActiveTab("all"));
[expenseBtn, incomeBtn, allBtn].forEach((button) => {
  button.addEventListener("keydown", handleTabKeyNavigation);
});

addExpense.addEventListener("click", function () {
  addEntry(CONFIG.entryTypes.expense, expenseTitle, expenseAmount);
});

addIncome.addEventListener("click", function () {
  addEntry(CONFIG.entryTypes.income, incomeTitle, incomeAmount);
});

expenseAmount.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addEntry(CONFIG.entryTypes.expense, expenseTitle, expenseAmount);
  }
});

incomeAmount.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addEntry(CONFIG.entryTypes.income, incomeTitle, incomeAmount);
  }
});

incomeList.addEventListener("click", deleteOrEdit);
expenseList.addEventListener("click", deleteOrEdit);
allList.addEventListener("click", deleteOrEdit);

function setActiveTab(tab) {
  const tabMap = {
    expense: { panel: expenseEl, button: expenseBtn },
    income: { panel: incomeEl, button: incomeBtn },
    all: { panel: allEl, button: allBtn },
  };

  Object.values(tabMap).forEach(({ panel, button }) => {
    hide(panel);
    inactive(button);
    panel.setAttribute("aria-hidden", "true");
    button.setAttribute("aria-selected", "false");
  });

  show(tabMap[tab].panel);
  active(tabMap[tab].button);
  tabMap[tab].panel.setAttribute("aria-hidden", "false");
  tabMap[tab].button.setAttribute("aria-selected", "true");
}

function handleTabKeyNavigation(event) {
  const tabs = [expenseBtn, incomeBtn, allBtn];
  const currentIndex = tabs.indexOf(event.currentTarget);
  if (currentIndex === -1) return;

  if (event.key === "ArrowRight") {
    event.preventDefault();
    tabs[(currentIndex + 1) % tabs.length].focus();
  } else if (event.key === "ArrowLeft") {
    event.preventDefault();
    tabs[(currentIndex - 1 + tabs.length) % tabs.length].focus();
  }
}

function addEntry(type, titleInput, amountInput) {
  const validation = BudgetCore.validateEntry(titleInput.value, amountInput.value, {
    config: CONFIG,
    messages: VALIDATION_MESSAGES,
  });

  if (!validation.isValid) {
    showError(titleInput, validation.message);
    return;
  }

  clearError(titleInput);

  ENTRY_LIST.push({
    id: BudgetCore.defaultGenerateEntryId(),
    type,
    title: validation.entry.title,
    amount: validation.entry.amount,
  });

  updateUI();
  clearInput([titleInput, amountInput]);
}

function deleteOrEdit(event) {
  const targetBtn = event.target.closest("[data-action]");
  if (!targetBtn) return;

  const action = targetBtn.dataset.action;
  const entry = targetBtn.closest("[data-entry-id]");

  if (!entry || !action) return;

  if (action === CONFIG.actions.edit) {
    editEntry(entry.dataset.entryId);
  } else if (action === CONFIG.actions.delete) {
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

  if (entry.type === CONFIG.entryTypes.income) {
    incomeTitle.value = entry.title;
    incomeAmount.value = entry.amount;
    clearError(incomeTitle);
    setActiveTab("income");
  } else if (entry.type === CONFIG.entryTypes.expense) {
    expenseTitle.value = entry.title;
    expenseAmount.value = entry.amount;
    clearError(expenseTitle);
    setActiveTab("expense");
  }

  deleteEntry(entryId);
}

function updateUI() {
  income = BudgetCore.calculateTotal(CONFIG.entryTypes.income, ENTRY_LIST);
  outcome = BudgetCore.calculateTotal(CONFIG.entryTypes.expense, ENTRY_LIST);
  balance = Math.abs(BudgetCore.calculateBalance(income, outcome));

  const sign = income >= outcome ? CONFIG.currencySymbol : `-${CONFIG.currencySymbol}`;

  balanceEl.innerHTML = `<small>${sign}</small>${balance}`;
  outcomeTotalEl.innerHTML = `<small>${CONFIG.currencySymbol}</small>${outcome}`;
  incomeTotalEl.innerHTML = `<small>${CONFIG.currencySymbol}</small>${income}`;

  clearElement([expenseList, incomeList, allList]);

  ENTRY_LIST.forEach((entry) => {
    if (entry.type === CONFIG.entryTypes.expense) {
      showEntry(expenseList, entry);
    } else if (entry.type === CONFIG.entryTypes.income) {
      showEntry(incomeList, entry);
    }
    showEntry(allList, entry);
  });

  if (typeof window.updateChart === "function") {
    window.updateChart(income, outcome);
  }

  saveEntries(ENTRY_LIST);
}

function showEntry(list, entry) {
  const listItem = document.createElement("li");
  listItem.className = entry.type;
  listItem.dataset.entryId = entry.id;

  const entryText = document.createElement("div");
  entryText.className = "entry";
  entryText.textContent = `${entry.title} : ${CONFIG.currencySymbol}${entry.amount}`;

  const editButton = document.createElement("button");
  editButton.type = "button";
  editButton.dataset.action = CONFIG.actions.edit;
  editButton.setAttribute("aria-label", "Edit entry");

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.dataset.action = CONFIG.actions.delete;
  deleteButton.setAttribute("aria-label", "Delete entry");

  listItem.appendChild(entryText);
  listItem.appendChild(editButton);
  listItem.appendChild(deleteButton);
  list.prepend(listItem);
}

function loadEntries() {
  return BudgetCore.loadEntries({
    storage: localStorage,
    storageKey: CONFIG.storageKey,
    config: CONFIG,
    createId: BudgetCore.defaultGenerateEntryId,
    messages: VALIDATION_MESSAGES,
    onError: (error) => {
      console.warn("Budget App could not load saved entries.", error);
    },
  });
}

function saveEntries(entries) {
  BudgetCore.saveEntries({
    entries,
    storage: localStorage,
    storageKey: CONFIG.storageKey,
    onError: (error) => {
      console.warn("Budget App could not save entries to localStorage.", error);
    },
  });
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

function clearInput(inputs) {
  inputs.forEach((input) => {
    input.value = "";
  });
}

function show(element) {
  element.classList.remove("hide");
}

function hide(element) {
  element.classList.add("hide");
}

function active(element) {
  element.classList.add("focus");
}

function inactive(element) {
  element.classList.remove("focus");
}
