
// ============================================
// LIFEOS APPLICATION
// Tasks + Reminders Management
// ============================================


// ============================================
// 1. LOAD SAVED DATA
// ============================================

// Browser se pehle save kiye gaye tasks load karein
let tasks = JSON.parse(
  localStorage.getItem("lifeos_tasks") || "[]"
);

// Browser se saved reminders load karein
let reminders = JSON.parse(
  localStorage.getItem("lifeos_reminders") || "[]"
);


// ============================================
// 2. SAVE DATA FUNCTIONS
// ============================================

// Tasks ko browser mein permanently save karein
function saveTasks() {
  localStorage.setItem(
    "lifeos_tasks",
    JSON.stringify(tasks)
  );
}

// Reminders ko browser mein save karein
function saveReminders() {
  localStorage.setItem(
    "lifeos_reminders",
    JSON.stringify(reminders)
  );
}


// ============================================
// 3. UPDATE DASHBOARD COUNTERS
// ============================================

function updateDashboard() {

  // Total tasks counter update karein
  const taskCounter = document.querySelector(
    ".stat-card:nth-child(1) h2"
  );

  if (taskCounter) {
    taskCounter.textContent = tasks.length;
  }

  // Reminders counter update karein
  const reminderCounter = document.querySelector(
    ".stat-card:nth-child(2) h2"
  );

  if (reminderCounter) {
    reminderCounter.textContent = reminders.length;
  }
}


// ============================================
// 4. TASK MANAGEMENT
// ============================================

// Dashboard par tamam tasks display karein
function renderTasks() {

  const taskPanel = document.querySelector(
    ".bottom-grid .panel:first-child"
  );

  if (!taskPanel) return;

  // Purana content clear karein
  taskPanel.innerHTML = `
    <h3>Today's Tasks</h3>

    <!-- New task add karne ka form -->
    <form id="taskForm" class="task-form">

      <input
        type="text"
        id="taskInput"
        placeholder="Write a new task..."
        maxlength="100"
        required
      >

      <button type="submit">+ Add</button>

    </form>

    <!-- Tasks yahan show honge -->
    <div id="taskList"></div>
  `;

  const taskList = document.getElementById("taskList");

  // Agar koi task nahi hai to message show karein
  if (tasks.length === 0) {
    taskList.innerHTML = `
      <p class="empty">
        No tasks yet. Your fresh start begins here.
      </p>
    `;
  }

  // Har task ka separate item banayein
  tasks.forEach((task) => {

    const item = document.createElement("div");
    item.className = "task-item";

    // Task checkbox aur title
    const label = document.createElement("label");
    label.className = "task-label";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    const title = document.createElement("span");
    title.textContent = task.title;

    // Completed task ko line-through karein
    if (task.completed) {
      title.style.textDecoration = "line-through";
      title.style.opacity = "0.5";
    }

    // Checkbox change hone par task save karein
    checkbox.addEventListener("change", () => {

      task.completed = checkbox.checked;

      saveTasks();
      renderTasks();

    });

    label.append(checkbox, title);

    // Delete button create karein
    const deleteButton = document.createElement("button");

    deleteButton.textContent = "✕";
    deleteButton.className = "delete-task";
    deleteButton.type = "button";
    deleteButton.setAttribute("aria-label", "Delete task");

    // Task delete karne ka function
    deleteButton.addEventListener("click", () => {

      tasks = tasks.filter(
        (t) => t.id !== task.id
      );

      saveTasks();
      renderTasks();

    });

    item.append(label, deleteButton);
    taskList.appendChild(item);

  });

  // New task form submit handler
  document.getElementById("taskForm").addEventListener(
    "submit",
    (event) => {

      event.preventDefault();

      const input = document.getElementById("taskInput");
      const title = input.value.trim();

      if (!title) return;

      // Naya task create karein
      tasks.push({
        id: Date.now(),
        title: title,
        completed: false
      });

      saveTasks();
      renderTasks();

    }
  );

  updateDashboard();
}


// ============================================
// 5. REMINDER MANAGEMENT
// ============================================

// Dashboard par reminders display karein
function renderReminders() {

  const list = document.getElementById("reminderList");

  if (!list) return;

  list.innerHTML = "";

  // Empty reminders message
  if (reminders.length === 0) {
    list.innerHTML = `
      <p class="empty">No reminders yet.</p>
    `;
  }

  // Har reminder display karein
  reminders.forEach((reminder) => {

    const item = document.createElement("div");
    item.className = "task-item";

    const info = document.createElement("div");

    // Reminder title
    const title = document.createElement("strong");
    title.textContent = reminder.title;

    // Reminder date aur time
    const date = document.createElement("p");
    date.className = "empty";

    date.textContent = new Date(
      reminder.time
    ).toLocaleString();

    info.append(title, date);

    // Reminder delete button
    const deleteButton = document.createElement("button");

    deleteButton.textContent = "✕";
    deleteButton.className = "delete-task";
    deleteButton.type = "button";

    deleteButton.addEventListener("click", () => {

      reminders = reminders.filter(
        (r) => r.id !== reminder.id
      );

      saveReminders();
      renderReminders();

    });

    item.append(info, deleteButton);
    list.appendChild(item);

  });

  updateDashboard();
}


// ============================================
// 6. ADD NEW REMINDER
// ============================================

function setupReminderForm() {

  const form = document.getElementById("reminderForm");

  if (!form) return;

  form.addEventListener("submit", (event) => {

    event.preventDefault();

    const title = document.getElementById(
      "reminderInput"
    ).value.trim();

    const time = document.getElementById(
      "reminderTime"
    ).value;

    if (!title || !time) return;

    // Past date select karne se rokein
    if (new Date(time).getTime() <= Date.now()) {

      alert("Please select a future date and time.");

      return;
    }

    // Naya reminder create karein
    reminders.push({
      id: Date.now(),
      title: title,
      time: new Date(time).getTime(),
      notified: false
    });

    saveReminders();
    renderReminders();

    // Form clear karein
    form.reset();

  });

}


// ============================================
// 7. CHECK REMINDERS
// ============================================

// Har 15 seconds baad due reminders check karein
function checkReminders() {

  const now = Date.now();

  reminders.forEach((reminder) => {

    // Agar reminder ka time aa gaya hai
    // aur pehle notification nahi di gayi
    if (
      !reminder.notified &&
      reminder.time <= now
    ) {

      alert(
        "LifeOS Reminder: " + reminder.title
      );

      reminder.notified = true;

      saveReminders();

    }

  });

}


// ============================================
// 8. QUICK ACTION BUTTONS
// ============================================

// Quick Actions ke buttons ko functional banayein
function setupQuickActions() {

  document.addEventListener("click", (event) => {

    const button = event.target.closest(".action-btn");

    if (!button) return;

    // Add Task button
    if (button.textContent.includes("Add New Task")) {

      const input = document.getElementById("taskInput");

      if (input) {
        input.focus();
        input.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }

    }

    // Add Reminder button
    if (button.textContent.includes("Add Reminder")) {

      const input = document.getElementById("reminderInput");

      if (input) {
        input.focus();
        input.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }

    }

  });

}


// ============================================
// 9. START LIFEOS APPLICATION
// ============================================

// HTML load hone ke baad application start karein
document.addEventListener("DOMContentLoaded", () => {

  // Tasks display karein
  renderTasks();

  // Reminders display karein
  renderReminders();

  // Reminder form activate karein
  setupReminderForm();

  // Quick action buttons activate karein
  setupQuickActions();

  // Reminder checker har 15 seconds chalega
  setInterval(checkReminders, 15000);

});

// ============================================
// LIFEOS - NOTES MANAGEMENT SYSTEM
// ============================================

// Browser se saved notes load karein
let notes = JSON.parse(
  localStorage.getItem("lifeos_notes") || "[]"
);

// Track karein ke user kis note ko edit kar raha hai
let editingNoteId = null;


// ============================================
// 1. SAVE NOTES
// ============================================

function saveNotes() {

  // Notes ko browser storage mein save karein
  localStorage.setItem(
    "lifeos_notes",
    JSON.stringify(notes)
  );

}


// ============================================
// 2. DISPLAY NOTES
// ============================================

function renderNotes() {

  // Notes display karne wala container
  const notesList = document.getElementById("notesList");

  if (!notesList) return;

  // Purane notes clear karein
  notesList.innerHTML = "";

  // Agar koi note saved nahi hai
  if (notes.length === 0) {

    const emptyMessage = document.createElement("p");

    emptyMessage.className = "empty";
    emptyMessage.textContent = "No notes yet. Write your first idea!";

    notesList.appendChild(emptyMessage);

  }

  // Har saved note ka card banayein
  notes.forEach((note) => {

    const card = document.createElement("div");
    card.className = "note-card";

    // Note ka title
    const title = document.createElement("h4");
    title.textContent = note.title;

    // Note ki details
    const content = document.createElement("p");
    content.className = "note-content";
    content.textContent = note.content;

    // Note save hone ki date
    const date = document.createElement("small");
    date.className = "note-date";
    date.textContent = new Date(
      note.createdAt
    ).toLocaleString();

    // Note ke buttons
    const actions = document.createElement("div");
    actions.className = "note-actions";

    // Edit button
    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.textContent = "✎ Edit";
    editButton.className = "edit-note";

    editButton.addEventListener("click", () => {

      // Selected note ka data form mein load karein
      document.getElementById("noteTitle").value = note.title;
      document.getElementById("noteContent").value = note.content;

      // Current note ki ID remember karein
      editingNoteId = note.id;

      // Save button ka text change karein
      document.getElementById("noteSubmit").textContent =
        "Update Note";

      // Cancel edit button show karein
      document.getElementById("cancelNoteEdit").hidden = false;

      // Form tak scroll karein
      document.getElementById("noteForm").scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

    });

    // Delete button
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "✕ Delete";
    deleteButton.className = "delete-note";

    deleteButton.addEventListener("click", () => {

      // Delete se pehle confirmation lein
      const confirmed = confirm(
        "Are you sure you want to delete this note?"
      );

      if (!confirmed) return;

      // Selected note remove karein
      notes = notes.filter(
        (item) => item.id !== note.id
      );

      saveNotes();
      renderNotes();

    });

    // Buttons ko card mein add karein
    actions.append(editButton, deleteButton);

    // Card ke tamam elements add karein
    card.append(title, content, date, actions);

    notesList.appendChild(card);

  });

}


// ============================================
// 3. ADD OR UPDATE NOTE
// ============================================

function setupNotesForm() {

  const form = document.getElementById("noteForm");

  if (!form) return;

  form.addEventListener("submit", (event) => {

    // Browser ko page reload karne se rokein
    event.preventDefault();

    // Form se title aur content hasil karein
    const title = document.getElementById("noteTitle")
      .value.trim();

    const content = document.getElementById("noteContent")
      .value.trim();

    // Empty note save na hone dein
    if (!title || !content) return;

    if (editingNoteId !== null) {

      // Existing note update karein
      notes = notes.map((note) => {

        if (note.id === editingNoteId) {

          return {
            ...note,
            title: title,
            content: content
          };

        }

        return note;

      });

    } else {

      // Naya note create karein
      notes.unshift({
        id: Date.now(),
        title: title,
        content: content,
        createdAt: Date.now()
      });

    }

    // Updated notes save karein
    saveNotes();

    // Notes list dobara display karein
    renderNotes();

    // Form ko reset karein
    resetNoteForm();

  });

}


// ============================================
// 4. RESET NOTE FORM
// ============================================

function resetNoteForm() {

  // Form ki values clear karein
  document.getElementById("noteForm").reset();

  // Editing mode band karein
  editingNoteId = null;

  // Button ka original text restore karein
  document.getElementById("noteSubmit").textContent =
    "+ Save Note";

  // Cancel button hide karein
  document.getElementById("cancelNoteEdit").hidden = true;

}


// ============================================
// 5. CANCEL NOTE EDITING
// ============================================

function setupCancelNoteEdit() {

  const cancelButton = document.getElementById(
    "cancelNoteEdit"
  );

  if (!cancelButton) return;

  cancelButton.addEventListener("click", () => {

    // Editing cancel karke form reset karein
    resetNoteForm();

  });

}


// ============================================
// 6. START NOTES SYSTEM
// ============================================

// HTML load hone ke baad Notes system activate karein
document.addEventListener("DOMContentLoaded", () => {

  // Saved notes display karein
  renderNotes();

  // Note form activate karein
  setupNotesForm();

  // Cancel edit button activate karein
  setupCancelNoteEdit();

});

// ============================================
// QUICK ACTION - OPEN NOTES FORM
// ============================================

document.addEventListener("click", (event) => {

  // Check karein ke Add Note button click hua hai
  const button = event.target.closest(".action-btn");

  if (!button) return;

  if (button.textContent.includes("Add Note")) {

    // Notes form ko screen par le aayein
    const noteForm = document.getElementById("noteForm");

    if (noteForm) {

      noteForm.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

      // Title input par cursor rakhein
      document.getElementById("noteTitle").focus();

    }

  }

});


// ============================================
// LIFEOS - MONEY TRACKER
// Income, Expenses and Udhaar Management
// ============================================

// Browser se saved money records load karein
let moneyRecords = JSON.parse(
  localStorage.getItem("lifeos_money") || "[]"
);

// Browser se saved udhaar records load karein
let loanRecords = JSON.parse(
  localStorage.getItem("lifeos_loans") || "[]"
);


// ============================================
// 1. SAVE MONEY DATA
// ============================================

function saveMoneyData() {

  // Income aur expenses save karein
  localStorage.setItem(
    "lifeos_money",
    JSON.stringify(moneyRecords)
  );

  // Udhaar records save karein
  localStorage.setItem(
    "lifeos_loans",
    JSON.stringify(loanRecords)
  );

}


// ============================================
// 2. CREATE MONEY TRACKER PANEL
// ============================================

function createMoneyPanel() {

  // Dashboard ke main panels ka container
  const dashboard = document.querySelector(".bottom-grid");

  if (!dashboard) return;

  // Duplicate panel banne se rokein
  if (document.getElementById("moneyPanel")) return;

  // Money Tracker ka complete interface
  const panel = document.createElement("div");

  panel.className = "panel money-panel";
  panel.id = "moneyPanel";

  panel.innerHTML = `
    <h3>💰 Money Tracker</h3>

    <!-- Income aur expenses summary -->
    <div class="money-summary">

      <div class="money-summary-card">
        <small>Total Income</small>
        <strong id="totalIncome">Rs. 0</strong>
      </div>

      <div class="money-summary-card">
        <small>Total Expenses</small>
        <strong id="totalExpenses">Rs. 0</strong>
      </div>

    </div>

    <!-- New transaction form -->
    <h4>Add Transaction</h4>

    <form id="moneyForm" class="money-form">

      <!-- Transaction type select karein -->
      <select id="moneyType" required>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <!-- Amount enter karein -->
      <input
        type="number"
        id="moneyAmount"
        placeholder="Amount in Rs."
        min="0.01"
        step="0.01"
        required
      >

      <!-- Transaction description -->
      <input
        type="text"
        id="moneyDescription"
        placeholder="Description..."
        maxlength="100"
        required
      >

      <button type="submit">+ Save Transaction</button>

    </form>

    <!-- Transaction history -->
    <h4 class="money-heading">Transaction History</h4>
    <div id="moneyList"></div>

    <!-- Udhaar management -->
    <div class="loan-section">

      <h3>🤝 Udhaar Manager</h3>

      <!-- Udhaar add karne ka form -->
      <form id="loanForm" class="money-form">

        <!-- Receive ya pay select karein -->
        <select id="loanType" required>
          <option value="receive">I will receive</option>
          <option value="pay">I have to pay</option>
        </select>

        <!-- Person ka naam -->
        <input
          type="text"
          id="loanPerson"
          placeholder="Person's name..."
          maxlength="80"
          required
        >

        <!-- Udhaar amount -->
        <input
          type="number"
          id="loanAmount"
          placeholder="Amount in Rs."
          min="0.01"
          step="0.01"
          required
        >

        <button type="submit">+ Add Udhaar</button>

      </form>

      <!-- Udhaar summary -->
      <div class="loan-summary">
        <p>To Receive: <strong id="receiveTotal">Rs. 0</strong></p>
        <p>To Pay: <strong id="payTotal">Rs. 0</strong></p>
      </div>

      <!-- Udhaar records -->
      <div id="loanList"></div>

    </div>
  `;

  // Dashboard mein Money Tracker panel add karein
  dashboard.appendChild(panel);

}


// ============================================
// 3. FORMAT AMOUNT
// ============================================

function formatMoney(amount) {

  // Pakistani Rupees mein amount display karein
  return "Rs. " + Number(amount).toLocaleString(
    "en-PK",
    {
      maximumFractionDigits: 2
    }
  );

}


// ============================================
// 4. RENDER TRANSACTION HISTORY
// ============================================

function renderMoney() {

  const list = document.getElementById("moneyList");

  if (!list) return;

  list.innerHTML = "";

  // Income aur expense calculate karein
  const income = moneyRecords
    .filter((record) => record.type === "income")
    .reduce((total, record) => total + record.amount, 0);

  const expenses = moneyRecords
    .filter((record) => record.type === "expense")
    .reduce((total, record) => total + record.amount, 0);

  // Summary update karein
  document.getElementById("totalIncome").textContent =
    formatMoney(income);

  document.getElementById("totalExpenses").textContent =
    formatMoney(expenses);

  // Dashboard balance update karein
  const balanceCard = document.querySelector(
    ".stat-card:nth-child(3) h2"
  );

  if (balanceCard) {
    balanceCard.textContent = formatMoney(income - expenses);
  }

  // Empty history message
  if (moneyRecords.length === 0) {

    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "No transactions yet.";

    list.appendChild(empty);

  }

  // Har transaction ka card banayein
  moneyRecords.forEach((record) => {

    const item = document.createElement("div");
    item.className = "money-item";

    const info = document.createElement("div");

    const description = document.createElement("strong");
    description.textContent = record.description;

    const date = document.createElement("small");
    date.textContent = new Date(
      record.createdAt
    ).toLocaleDateString();

    info.append(description, date);

    const amount = document.createElement("strong");

    // Income aur expense ke hisaab se amount show karein
    amount.textContent =
      (record.type === "income" ? "+ " : "- ") +
      formatMoney(record.amount);

    amount.className =
      record.type === "income"
        ? "income-text"
        : "expense-text";

    // Delete transaction button
    const deleteButton = document.createElement("button");

    deleteButton.type = "button";
    deleteButton.textContent = "✕";
    deleteButton.className = "delete-task";

    deleteButton.addEventListener("click", () => {

      if (!confirm("Delete this transaction?")) return;

      moneyRecords = moneyRecords.filter(
        (r) => r.id !== record.id
      );

      saveMoneyData();
      renderMoney();

    });

    item.append(info, amount, deleteButton);
    list.appendChild(item);

  });

}


// ============================================
// 5. ADD INCOME OR EXPENSE
// ============================================

function setupMoneyForm() {

  const form = document.getElementById("moneyForm");

  if (!form) return;

  form.addEventListener("submit", (event) => {

    event.preventDefault();

    const type = document.getElementById("moneyType").value;

    const amount = Number(
      document.getElementById("moneyAmount").value
    );

    const description = document.getElementById(
      "moneyDescription"
    ).value.trim();

    // Invalid amount check karein
    if (!Number.isFinite(amount) || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    if (!description) return;

    // Naya transaction save karein
    moneyRecords.unshift({
      id: Date.now(),
      type: type,
      amount: amount,
      description: description,
      createdAt: Date.now()
    });

    saveMoneyData();
    renderMoney();

    // Form clear karein
    form.reset();

  });

}


// ============================================
// 6. RENDER UDHAR RECORDS
// ============================================

function renderLoans() {

  const list = document.getElementById("loanList");

  if (!list) return;

  list.innerHTML = "";

  // Receive aur pay amounts calculate karein
  const receive = loanRecords
    .filter((loan) => loan.type === "receive")
    .reduce((total, loan) => total + loan.amount, 0);

  const pay = loanRecords
    .filter((loan) => loan.type === "pay")
    .reduce((total, loan) => total + loan.amount, 0);

  // Summary display karein
  document.getElementById("receiveTotal").textContent =
    formatMoney(receive);

  document.getElementById("payTotal").textContent =
    formatMoney(pay);

  // Empty message
  if (loanRecords.length === 0) {

    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "No udhaar records yet.";

    list.appendChild(empty);

  }

  // Har udhaar record display karein
  loanRecords.forEach((loan) => {

    const item = document.createElement("div");
    item.className = "money-item";

    const info = document.createElement("div");

    const person = document.createElement("strong");
    person.textContent = loan.person;

    const type = document.createElement("small");

    type.textContent =
      loan.type === "receive"
        ? "You will receive"
        : "You have to pay";

    info.append(person, type);

    const amount = document.createElement("strong");
    amount.textContent = formatMoney(loan.amount);

    // Udhaar delete button
    const deleteButton = document.createElement("button");

    deleteButton.type = "button";
    deleteButton.textContent = "✕";
    deleteButton.className = "delete-task";

    deleteButton.addEventListener("click", () => {

      if (!confirm("Delete this udhaar record?")) return;

      loanRecords = loanRecords.filter(
        (r) => r.id !== loan.id
      );

      saveMoneyData();
      renderLoans();

    });

    item.append(info, amount, deleteButton);
    list.appendChild(item);

  });

}


// ============================================
// 7. ADD UDHAR RECORD
// ============================================

function setupLoanForm() {

  const form = document.getElementById("loanForm");

  if (!form) return;

  form.addEventListener("submit", (event) => {

    event.preventDefault();

    const type = document.getElementById("loanType").value;

    const person = document.getElementById(
      "loanPerson"
    ).value.trim();

    const amount = Number(
      document.getElementById("loanAmount").value
    );

    // Amount validate karein
    if (!Number.isFinite(amount) || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    if (!person) return;

    // Udhaar record create karein
    loanRecords.unshift({
      id: Date.now(),
      type: type,
      person: person,
      amount: amount,
      createdAt: Date.now()
    });

    saveMoneyData();
    renderLoans();

    // Form reset karein
    form.reset();

  });

}


// ============================================
// 8. START MONEY TRACKER
// ============================================

document.addEventListener("DOMContentLoaded", () => {

  // Money Tracker ka panel create karein
  createMoneyPanel();

  // Transaction form activate karein
  setupMoneyForm();

  // Udhaar form activate karein
  setupLoanForm();

  // Saved transactions aur udhaar show karein
  renderMoney();
  renderLoans();

});


// ============================================
// LIFEOS - SIDEBAR NAVIGATION
// Sidebar buttons ko unke sections se connect karein
// ============================================

document.addEventListener("DOMContentLoaded", () => {

  // Sidebar navigation hasil karein
  const sidebarNav = document.getElementById("sidebarNav");

  if (!sidebarNav) return;

  // Sidebar ke kisi link par click hone par
  sidebarNav.addEventListener("click", (event) => {

    // Click kiye gaye navigation link ko identify karein
    const link = event.target.closest("a[data-target]");

    if (!link) return;

    // Default link action aur page jump rokein
    event.preventDefault();

    // Link ka target section hasil karein
    const targetId = link.dataset.target;

    const targetSection = document.getElementById(targetId);

    // Agar section abhi available nahi hai
    if (!targetSection) {

      if (targetId === "documentsPanel") {
        alert("Documents Manager abhi add nahi hua. Yeh feature jald add hoga!");
      } else {
        alert("Yeh section abhi available nahi hai.");
      }

      return;
    }

    // Sabhi sidebar links se active class remove karein
    sidebarNav.querySelectorAll("a").forEach((item) => {
      item.classList.remove("active");
    });

    // Click kiye gaye link ko active banayein
    link.classList.add("active");

    // Selected section tak smoothly scroll karein
    targetSection.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  });

});

// ============================================
// LIFEOS - DOCUMENTS MANAGER
// Documents aur expiry dates manage karein
// ============================================

// Browser se saved documents load karein
let lifeDocuments = JSON.parse(
  localStorage.getItem("lifeos_documents") || "[]"
);


// ============================================
// 1. SAVE DOCUMENTS
// ============================================

function saveDocuments() {

  // Documents ko browser storage mein save karein
  localStorage.setItem(
    "lifeos_documents",
    JSON.stringify(lifeDocuments)
  );

}


// ============================================
// 2. CREATE DOCUMENTS PANEL
// ============================================

function createDocumentsPanel() {

  // Dashboard ke panels ka container hasil karein
  const container = document.querySelector(".bottom-grid");

  if (!container) return;

  // Duplicate panel banne se rokein
  if (document.getElementById("documentsPanel")) return;

  // Documents panel create karein
  const panel = document.createElement("div");

  panel.className = "panel documents-panel";
  panel.id = "documentsPanel";

  // Documents Manager ka HTML interface
  panel.innerHTML = `
    <h3>📁 Documents Manager</h3>

    <p class="empty">
      Track your important documents and expiry dates.
    </p>

    <!-- New document add karne ka form -->
    <form id="documentForm" class="document-form">

      <input
        type="text"
        id="documentName"
        placeholder="Document name (e.g. Passport)"
        maxlength="100"
        required
      >

      <select id="documentCategory" required>
        <option value="Personal">Personal</option>
        <option value="Identity">Identity</option>
        <option value="Education">Education</option>
        <option value="Vehicle">Vehicle</option>
        <option value="Insurance">Insurance</option>
        <option value="Other">Other</option>
      </select>

      <label for="documentExpiry">Expiry date</label>

      <input
        type="date"
        id="documentExpiry"
        required
      >

      <input
        type="text"
        id="documentNotes"
        placeholder="Optional note..."
        maxlength="200"
      >

      <button type="submit">+ Save Document</button>

    </form>

    <!-- Saved documents yahan show honge -->
    <h4 class="documents-heading">My Documents</h4>

    <div id="documentsList"></div>
  `;

  // Dashboard ke end par panel add karein
  container.appendChild(panel);

}


// ============================================
// 3. CALCULATE DAYS UNTIL EXPIRY
// ============================================

function getDocumentDaysLeft(expiryDate) {

  // Date string ko local date mein convert karein
  const parts = expiryDate.split("-");

  const expiry = new Date(
    Number(parts[0]),
    Number(parts[1]) - 1,
    Number(parts[2])
  );

  // Aaj ki date ka midnight time hasil karein
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  // Expiry date ka midnight time set karein
  expiry.setHours(0, 0, 0, 0);

  // Dono dates ke darmiyan days calculate karein
  return Math.round(
    (expiry.getTime() - today.getTime()) /
    (1000 * 60 * 60 * 24)
  );

}


// ============================================
// 4. FORMAT DOCUMENT DATE
// ============================================

function formatDocumentDate(dateString) {

  // Date ko local format mein display karein
  const parts = dateString.split("-");

  const date = new Date(
    Number(parts[0]),
    Number(parts[1]) - 1,
    Number(parts[2])
  );

  return date.toLocaleDateString();

}


// ============================================
// 5. UPDATE DOCUMENT COUNTER
// ============================================

function updateDocumentCounter() {

  // Dashboard ke fourth stat card ka counter hasil karein
  const counter = document.querySelector(
    ".stat-card:nth-child(4) h2"
  );

  // Total saved documents display karein
  if (counter) {
    counter.textContent = lifeDocuments.length;
  }

}


// ============================================
// 6. DISPLAY DOCUMENTS
// ============================================

function renderDocuments() {

  const list = document.getElementById("documentsList");

  if (!list) return;

  // Purani list clear karein
  list.innerHTML = "";

  // Documents ko nearest expiry ke mutabiq sort karein
  lifeDocuments.sort((a, b) => {
    return a.expiry.localeCompare(b.expiry);
  });

  // Agar koi document save nahi hai
  if (lifeDocuments.length === 0) {

    const empty = document.createElement("p");

    empty.className = "empty";
    empty.textContent = "No documents added yet.";

    list.appendChild(empty);

  }

  // Har document ka card create karein
  lifeDocuments.forEach((doc) => {

    const daysLeft = getDocumentDaysLeft(doc.expiry);

    const card = document.createElement("div");

    card.className = "document-item";

    // Document information
    const info = document.createElement("div");

    const name = document.createElement("strong");
    name.textContent = doc.name;

    const category = document.createElement("small");
    category.textContent = "Category: " + doc.category;

    const expiry = document.createElement("small");
    expiry.textContent =
      "Expiry: " + formatDocumentDate(doc.expiry);

    // Expiry status message
    const status = document.createElement("p");
    status.className = "document-status";

    if (daysLeft < 0) {

      status.textContent =
        "Expired " + Math.abs(daysLeft) + " day(s) ago";

      status.classList.add("expired");

    } else if (daysLeft === 0) {

      status.textContent = "Expires today!";

      status.classList.add("expired");

    } else if (daysLeft <= 30) {

      status.textContent =
        daysLeft + " day(s) remaining - Expiring soon";

      status.classList.add("expiring");

    } else {

      status.textContent =
        daysLeft + " day(s) remaining";

      status.classList.add("valid");

    }

    info.append(name, category, expiry, status);

    // Optional notes display karein
    if (doc.notes) {

      const notes = document.createElement("small");

      notes.textContent = "Note: " + doc.notes;

      info.appendChild(notes);

    }

    // Delete document button
    const deleteButton = document.createElement("button");

    deleteButton.type = "button";
    deleteButton.textContent = "✕ Delete";
    deleteButton.className = "delete-note";

    deleteButton.addEventListener("click", () => {

      // Delete karne se pehle confirmation lein
      if (!confirm("Delete this document record?")) return;

      // Selected document remove karein
      lifeDocuments = lifeDocuments.filter(
        (item) => item.id !== doc.id
      );

      // Updated data save aur display karein
      saveDocuments();
      renderDocuments();

    });

    card.append(info, deleteButton);

    list.appendChild(card);

  });

  // Dashboard document counter update karein
  updateDocumentCounter();

}


// ============================================
// 7. ADD NEW DOCUMENT
// ============================================

function setupDocumentForm() {

  const form = document.getElementById("documentForm");

  if (!form) return;

  form.addEventListener("submit", (event) => {

    // Page reload hone se rokein
    event.preventDefault();

    // Form ki values hasil karein
    const name = document.getElementById(
      "documentName"
    ).value.trim();

    const category = document.getElementById(
      "documentCategory"
    ).value;

    const expiry = document.getElementById(
      "documentExpiry"
    ).value;

    const notes = document.getElementById(
      "documentNotes"
    ).value.trim();

    // Required fields validate karein
    if (!name || !expiry) return;

    // Naya document record create karein
    lifeDocuments.push({
      id: Date.now() + Math.random(),
      name: name,
      category: category,
      expiry: expiry,
      notes: notes
    });

    // Data save karein
    saveDocuments();

    // Documents list refresh karein
    renderDocuments();

    // Form clear karein
    form.reset();

  });

}


// ============================================
// 8. START DOCUMENTS MANAGER
// ============================================

document.addEventListener("DOMContentLoaded", () => {

  // Documents panel create karein
  createDocumentsPanel();

  // Form activate karein
  setupDocumentForm();

  // Saved documents display karein
  renderDocuments();

});

/* ==========================================
   LIFEOS - CALENDAR & DAILY PLANNER
   Monthly calendar, daily events and reminders
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    // Calendar ke data aur current selection
    let lifeOSCalendarEvents = JSON.parse(
        localStorage.getItem("lifeOSCalendarEvents") || "[]"
    );

    let lifeOSCalendarToday = new Date();
    let lifeOSCalendarMonth = new Date(
        lifeOSCalendarToday.getFullYear(),
        lifeOSCalendarToday.getMonth(),
        1
    );

    let lifeOSCalendarSelectedDate = getCalendarDateKey(lifeOSCalendarToday);

    // Date ko YYYY-MM-DD format mein convert karna
    function getCalendarDateKey(date) {
        let year = date.getFullYear();
        let month = String(date.getMonth() + 1).padStart(2, "0");
        let day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    // Calendar panel create karna
    let calendarPanel = document.createElement("section");
    calendarPanel.id = "calendarPanel";
    calendarPanel.className = "panel calendar-panel";

    calendarPanel.innerHTML = `
        <div class="panel-header">
            <div>
                <h2>Calendar & Daily Planner</h2>
                <p>Apne din aur important events plan karo</p>
            </div>
        </div>

        <div class="calendar-layout">

            <div class="calendar-box">
                <div class="calendar-month-header">
                    <button type="button" id="calendarPrevMonth">‹</button>
                    <h3 id="calendarMonthTitle"></h3>
                    <button type="button" id="calendarNextMonth">›</button>
                </div>

                <div class="calendar-weekdays">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                </div>

                <div class="calendar-days" id="calendarDays"></div>
            </div>

            <div class="calendar-form-box">
                <h3>Add New Event</h3>

                <form id="calendarEventForm">
                   <label for="journalDate">Journal Date</label>
                    <input
                        type="text"
                        id="calendarEventTitle"
                        placeholder="Example: Meeting with client"
                        required
                    >

                    <label for="calendarEventDate">Date</label>
<input
    type="date"
    id="calendarEventDate"
    required
>

                  <label for="calendarEventTime">Time</label>
<input
    type="time"
    id="calendarEventTime"
>

                    <label for="calendarEventDetails">Details (Optional)</label>
<textarea
    id="calendarEventDetails"
    placeholder="Event ki details..."
    rows="3"
></textarea>

                    <button type="submit" class="primary-btn">
                        Save Event
                    </button>
                </form>
            </div>

        </div>

        <div class="calendar-event-sections">
            <div class="calendar-event-box">
                <h3 id="calendarSelectedTitle">Selected Day</h3>
                <div id="calendarSelectedEvents"></div>
            </div>

            <div class="calendar-event-box">
                <h3>Upcoming Events</h3>
                <div id="calendarUpcomingEvents"></div>
            </div>
        </div>
    `;

    // Calendar ko dashboard ke bottom area mein add karna
    let calendarContainer = document.querySelector(".bottom-grid");

    if (calendarContainer) {
        calendarContainer.appendChild(calendarPanel);
    } else {
        document.querySelector("main")?.appendChild(calendarPanel);
    }

    // Sidebar mein Calendar ka link add karna
    let sidebarNav = document.getElementById("sidebarNav");

    if (sidebarNav && !sidebarNav.querySelector('[data-target="calendarPanel"]')) {
        let calendarLink = document.createElement("a");
        calendarLink.href = "#calendarPanel";
        calendarLink.dataset.target = "calendarPanel";
        calendarLink.textContent = "Calendar";
        sidebarNav.appendChild(calendarLink);
    }

    // Calendar ka month aur days render karna
    function renderLifeOSCalendar() {
        let year = lifeOSCalendarMonth.getFullYear();
        let month = lifeOSCalendarMonth.getMonth();

        let monthTitle = document.getElementById("calendarMonthTitle");
        let daysContainer = document.getElementById("calendarDays");

        monthTitle.textContent = lifeOSCalendarMonth.toLocaleDateString(
            "en-US",
            { month: "long", year: "numeric" }
        );

        daysContainer.innerHTML = "";

        // Month ka pehla din aur total days
        let firstDay = new Date(year, month, 1).getDay();
        let mondayFirstOffset = (firstDay + 6) % 7;
        let totalDays = new Date(year, month + 1, 0).getDate();

        // Pichle month ke khaali calendar boxes
        for (let i = 0; i < mondayFirstOffset; i++) {
            let emptyDay = document.createElement("div");
            emptyDay.className = "calendar-day empty";
            daysContainer.appendChild(emptyDay);
        }

        // Current month ke days
        for (let day = 1; day <= totalDays; day++) {
            let date = new Date(year, month, day);
            let dateKey = getCalendarDateKey(date);

            let dayButton = document.createElement("button");
            dayButton.type = "button";
            dayButton.className = "calendar-day";
            dayButton.textContent = day;
            dayButton.dataset.date = dateKey;

            // Aaj ki date highlight karna
            if (dateKey === getCalendarDateKey(lifeOSCalendarToday)) {
                dayButton.classList.add("today");
            }

            // Selected date highlight karna
            if (dateKey === lifeOSCalendarSelectedDate) {
                dayButton.classList.add("selected");
            }

            // Event wale din par dot show karna
            let hasEvent = lifeOSCalendarEvents.some(
                event => event.date === dateKey
            );

            if (hasEvent) {
                dayButton.classList.add("has-event");
            }

            daysContainer.appendChild(dayButton);
        }

        renderLifeOSSelectedEvents();
        renderLifeOSUpcomingEvents();
    }

    // Selected date ke events show karna
    function renderLifeOSSelectedEvents() {
        let container = document.getElementById("calendarSelectedEvents");
        let title = document.getElementById("calendarSelectedTitle");

        let selectedDate = new Date(
            lifeOSCalendarSelectedDate + "T00:00:00"
        );

        title.textContent = selectedDate.toLocaleDateString(
            "en-US",
            { weekday: "long", day: "numeric", month: "long", year: "numeric" }
        );

        let events = lifeOSCalendarEvents
            .filter(event => event.date === lifeOSCalendarSelectedDate)
            .sort((a, b) => (a.time || "").localeCompare(b.time || ""));

        container.innerHTML = "";

        if (events.length === 0) {
            container.innerHTML = '<p class="calendar-empty-message">Is din koi event nahi hai.</p>';
            return;
        }

        events.forEach(event => {
            let eventCard = document.createElement("div");
            eventCard.className = "calendar-event-card";

            let eventInfo = document.createElement("div");

            let eventName = document.createElement("strong");
            eventName.textContent = event.title;

            let eventTime = document.createElement("span");
            eventTime.textContent = event.time || "Time not set";

            let eventDetails = document.createElement("p");
            eventDetails.textContent = event.details || "";

            eventInfo.appendChild(eventName);
            eventInfo.appendChild(eventTime);
            eventInfo.appendChild(eventDetails);

            let deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.textContent = "Delete";
            deleteButton.className = "calendar-delete-btn";
            deleteButton.dataset.eventId = event.id;

            eventCard.appendChild(eventInfo);
            eventCard.appendChild(deleteButton);
            container.appendChild(eventCard);
        });
    }

    // Aaj se aage ke events show karna
    function renderLifeOSUpcomingEvents() {
        let container = document.getElementById("calendarUpcomingEvents");
        let todayKey = getCalendarDateKey(lifeOSCalendarToday);

        let upcoming = lifeOSCalendarEvents
            .filter(event => event.date >= todayKey)
            .sort((a, b) => {
                let dateA = `${a.date}T${a.time || "23:59"}`;
                let dateB = `${b.date}T${b.time || "23:59"}`;
                return dateA.localeCompare(dateB);
            })
            .slice(0, 8);

        container.innerHTML = "";

        if (upcoming.length === 0) {
            container.innerHTML = '<p class="calendar-empty-message">Abhi koi upcoming event nahi hai.</p>';
            return;
        }

        upcoming.forEach(event => {
            let item = document.createElement("div");
            item.className = "calendar-upcoming-item";

            let name = document.createElement("strong");
            name.textContent = event.title;

            let dateText = document.createElement("span");
            let eventDate = new Date(event.date + "T00:00:00");

            dateText.textContent =
                eventDate.toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                }) + (event.time ? " • " + event.time : "");

            item.appendChild(name);
            item.appendChild(dateText);
            container.appendChild(item);
        });
    }

    // Previous month button
    document.getElementById("calendarPrevMonth").addEventListener("click", function () {
        lifeOSCalendarMonth.setMonth(lifeOSCalendarMonth.getMonth() - 1);
        renderLifeOSCalendar();
    });

    // Next month button
    document.getElementById("calendarNextMonth").addEventListener("click", function () {
        lifeOSCalendarMonth.setMonth(lifeOSCalendarMonth.getMonth() + 1);
        renderLifeOSCalendar();
    });

    // Calendar ke kisi din par click karna
    document.getElementById("calendarDays").addEventListener("click", function (event) {
        let dayButton = event.target.closest("[data-date]");

        if (!dayButton) return;

        lifeOSCalendarSelectedDate = dayButton.dataset.date;
        document.getElementById("calendarEventDate").value =
            lifeOSCalendarSelectedDate;

        renderLifeOSCalendar();
    });

    // New event save karna
    document.getElementById("calendarEventForm").addEventListener("submit", function (event) {
        event.preventDefault();

        let title = document.getElementById("calendarEventTitle").value.trim();
        let date = document.getElementById("calendarEventDate").value;
        let time = document.getElementById("calendarEventTime").value;
        let details = document.getElementById("calendarEventDetails").value.trim();

        if (!title || !date) {
            alert("Event title aur date zaroor enter karo.");
            return;
        }

        let newEvent = {
            id: Date.now().toString(),
            title: title,
            date: date,
            time: time,
            details: details
        };

        lifeOSCalendarEvents.push(newEvent);

        // Events browser mein save karna
        localStorage.setItem(
            "lifeOSCalendarEvents",
            JSON.stringify(lifeOSCalendarEvents)
        );

        // Naye event ki date select karna
        lifeOSCalendarSelectedDate = date;
        lifeOSCalendarMonth = new Date(date + "T00:00:00");
        lifeOSCalendarMonth.setDate(1);

        this.reset();
        document.getElementById("calendarEventDate").value = date;

        renderLifeOSCalendar();
        alert("Event successfully save ho gaya!");
    });

    // Event delete karna
    document.getElementById("calendarSelectedEvents").addEventListener("click", function (event) {
        let deleteButton = event.target.closest("[data-event-id]");

        if (!deleteButton) return;

        let eventId = deleteButton.dataset.eventId;

        lifeOSCalendarEvents = lifeOSCalendarEvents.filter(
            item => item.id !== eventId
        );

        localStorage.setItem(
            "lifeOSCalendarEvents",
            JSON.stringify(lifeOSCalendarEvents)
        );

        renderLifeOSCalendar();
    });

    // Form mein default selected date set karna
    document.getElementById("calendarEventDate").value =
        lifeOSCalendarSelectedDate;

    // Calendar pehli dafa render karna
    renderLifeOSCalendar();

});

// ==========================================
// LIFEOS - HABIT TRACKER
// Daily habits, completion history and streaks
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    // Habits ko browser storage se load karna
    let lifeOSHabits = JSON.parse(
        localStorage.getItem("lifeOSHabits") || "[]"
    );

    // Local date ko YYYY-MM-DD format mein banana
    function getHabitDateKey(date) {
        let year = date.getFullYear();
        let month = String(date.getMonth() + 1).padStart(2, "0");
        let day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    // Aaj ki date
    function getHabitToday() {
        return getHabitDateKey(new Date());
    }

    // Habits ko LocalStorage mein save karna
    function saveLifeOSHabits() {
        localStorage.setItem(
            "lifeOSHabits",
            JSON.stringify(lifeOSHabits)
        );
    }

    // Habit ka current streak calculate karna
    function calculateHabitStreak(habit) {
        let completedDates = new Set(habit.completedDates || []);
        let checkDate = new Date();

        // Agar aaj complete nahi kiya to kal se streak check karna
        if (!completedDates.has(getHabitDateKey(checkDate))) {
            checkDate.setDate(checkDate.getDate() - 1);
        }

        let streak = 0;

        // Lagataar completed days count karna
        while (completedDates.has(getHabitDateKey(checkDate))) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        }

        return streak;
    }

    // Habit Tracker ka panel banana
    let habitPanel = document.createElement("section");
    habitPanel.id = "habitsPanel";
    habitPanel.className = "panel habits-panel";

    habitPanel.innerHTML = `
        <div class="panel-header">
            <div>
                <h2>Habit Tracker</h2>
                <p>Choti daily habits se bari progress banao</p>
            </div>
        </div>

        <form id="habitForm" class="habit-form">
            <input
                type="text"
                id="habitName"
                placeholder="New habit, e.g. Reading"
                maxlength="60"
                required
            >

            <button type="submit" class="primary-btn">
                + Add Habit
            </button>
        </form>

        <div class="habit-summary">
            <div class="habit-summary-card">
                <span>Total Habits</span>
                <strong id="habitTotalCount">0</strong>
            </div>

            <div class="habit-summary-card">
                <span>Completed Today</span>
                <strong id="habitCompletedCount">0</strong>
            </div>

            <div class="habit-summary-card">
                <span>Today's Progress</span>
                <strong id="habitProgressPercent">0%</strong>
            </div>
        </div>

        <div class="habit-list-heading">
            <h3>My Daily Habits</h3>
            <span id="habitTodayDate"></span>
        </div>

        <div id="habitList" class="habit-list"></div>
    `;

    // Panel ko existing bottom grid mein add karna
    let habitContainer = document.querySelector(".bottom-grid");

    if (habitContainer) {
        habitContainer.appendChild(habitPanel);
    } else {
        document.querySelector("main")?.appendChild(habitPanel);
    }

    // Sidebar mein Habit Tracker ka link add karna
    let habitSidebar = document.getElementById("sidebarNav");

    if (
        habitSidebar &&
        !habitSidebar.querySelector('[data-target="habitsPanel"]')
    ) {
        let habitLink = document.createElement("a");
        habitLink.href = "#habitsPanel";
        habitLink.dataset.target = "habitsPanel";
        habitLink.textContent = "Habit Tracker";
        habitSidebar.appendChild(habitLink);
    }

    // Habits aur summary ko screen par render karna
    function renderLifeOSHabits() {
        let habitList = document.getElementById("habitList");
        let today = getHabitToday();

        let completedCount = lifeOSHabits.filter(habit =>
            (habit.completedDates || []).includes(today)
        ).length;

        let totalCount = lifeOSHabits.length;

        // Summary numbers update karna
        document.getElementById("habitTotalCount").textContent = totalCount;
        document.getElementById("habitCompletedCount").textContent = completedCount;

        let percentage = totalCount === 0
            ? 0
            : Math.round((completedCount / totalCount) * 100);

        document.getElementById("habitProgressPercent").textContent =
            percentage + "%";

        document.getElementById("habitTodayDate").textContent =
            new Date().toLocaleDateString("en-US", {
                weekday: "long",
                day: "numeric",
                month: "short"
            });

        habitList.innerHTML = "";

        // Agar abhi koi habit add nahi hui
        if (lifeOSHabits.length === 0) {
            habitList.innerHTML =
                '<p class="habit-empty-message">Abhi koi habit nahi hai. Upar apni pehli habit add karo!</p>';
            return;
        }

        // Har habit ka card banana
        lifeOSHabits.forEach(habit => {
            let isCompleted = (habit.completedDates || []).includes(today);
            let streak = calculateHabitStreak(habit);
            let totalCompleted = (habit.completedDates || []).length;

            let card = document.createElement("div");
            card.className = "habit-card";

            if (isCompleted) {
                card.classList.add("habit-is-completed");
            }

            let info = document.createElement("div");
            info.className = "habit-info";

            let name = document.createElement("strong");
            name.textContent = habit.name;

            let stats = document.createElement("span");
            stats.textContent =
                `🔥 ${streak} day streak  •  ✓ ${totalCompleted} completed days`;

            info.appendChild(name);
            info.appendChild(stats);

            let actions = document.createElement("div");
            actions.className = "habit-actions";

            // Complete / Undo button
            let completeButton = document.createElement("button");
            completeButton.type = "button";
            completeButton.className = "habit-complete-btn";
            completeButton.dataset.habitId = habit.id;
            completeButton.textContent = isCompleted ? "✓ Done" : "Mark Done";

            // Delete button
            let deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.className = "habit-delete-btn";
            deleteButton.dataset.deleteHabitId = habit.id;
            deleteButton.textContent = "Delete";

            actions.appendChild(completeButton);
            actions.appendChild(deleteButton);

            card.appendChild(info);
            card.appendChild(actions);

            habitList.appendChild(card);
        });
    }

    // Nayi habit add karna
    document.getElementById("habitForm").addEventListener("submit", function (event) {
        event.preventDefault();

        let nameInput = document.getElementById("habitName");
        let habitName = nameInput.value.trim();

        if (!habitName) {
            alert("Habit ka naam enter karo.");
            return;
        }

        // Nayi habit ka record
        let newHabit = {
            id: Date.now().toString(),
            name: habitName,
            completedDates: []
        };

        lifeOSHabits.push(newHabit);
        saveLifeOSHabits();

        nameInput.value = "";
        renderLifeOSHabits();
    });

    // Habit complete ya undo karna
    document.getElementById("habitList").addEventListener("click", function (event) {
        let completeButton = event.target.closest("[data-habit-id]");
        let deleteButton = event.target.closest("[data-delete-habit-id]");

        // Complete / Undo action
        if (completeButton) {
            let habit = lifeOSHabits.find(
                item => item.id === completeButton.dataset.habitId
            );

            if (!habit) return;

            if (!habit.completedDates) {
                habit.completedDates = [];
            }

            let today = getHabitToday();
            let alreadyCompleted = habit.completedDates.includes(today);

            if (alreadyCompleted) {
                // Aaj ki completion undo karna
                habit.completedDates = habit.completedDates.filter(
                    date => date !== today
                );
            } else {
                // Aaj ki completion save karna
                habit.completedDates.push(today);
            }

            saveLifeOSHabits();
            renderLifeOSHabits();
            return;
        }

        // Delete action
        if (deleteButton) {
            let habitId = deleteButton.dataset.deleteHabitId;

            lifeOSHabits = lifeOSHabits.filter(
                item => item.id !== habitId
            );

            saveLifeOSHabits();
            renderLifeOSHabits();
        }
    });

    // Page open hone par habits render karna
    renderLifeOSHabits();

});

// ==========================================
// LIFEOS - FOCUS TIMER
// Pomodoro, breaks and custom focus sessions
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    // Timer settings aur current state
    let focusMode = "focus";
    let focusRemainingSeconds = 25 * 60;
    let focusInterval = null;
    let focusEndTime = null;
    let focusIsRunning = false;
    let focusCompletedSessions = Number(
        localStorage.getItem("lifeOSFocusSessions") || 0
    );

    // Har mode ka duration seconds mein
    const focusDurations = {
        focus: 25 * 60,
        short: 5 * 60,
        long: 15 * 60
    };

    // Timer panel create karna
    let focusPanel = document.createElement("section");
    focusPanel.id = "focusPanel";
    focusPanel.className = "panel focus-panel";

    focusPanel.innerHTML = `
        <div class="panel-header">
            <div>
                <h2>Focus Timer</h2>
                <p>Distractions kam karo, focus barhao</p>
            </div>
        </div>

        <div class="focus-timer-card">
            <div class="focus-mode-buttons">
                <button type="button" data-focus-mode="focus" class="active">
                    Focus
                </button>
                <button type="button" data-focus-mode="short">
                    Short Break
                </button>
                <button type="button" data-focus-mode="long">
                    Long Break
                </button>
            </div>

            <div class="focus-clock" id="focusClock">25:00</div>
            <p class="focus-status" id="focusStatus">Ready to focus?</p>

            <div class="focus-controls">
                <button type="button" id="focusStartBtn" class="focus-start-btn">
                    Start
                </button>
                <button type="button" id="focusPauseBtn" class="focus-pause-btn">
                    Pause
                </button>
                <button type="button" id="focusResetBtn" class="focus-reset-btn">
                    Reset
                </button>
            </div>

            <div class="focus-custom-time">
                <label for="focusCustomMinutes">Custom duration (minutes)</label>
                <div>
                    <input
                        type="number"
                        id="focusCustomMinutes"
                        min="1"
                        max="180"
                        placeholder="Example: 40"
                    >
                    <button type="button" id="focusCustomBtn">
                        Set Timer
                    </button>
                </div>
            </div>
        </div>

        <div class="focus-session-summary">
            <span>Completed Focus Sessions</span>
            <strong id="focusSessionCount">0</strong>
        </div>
    `;

    // Panel ko dashboard ke bottom area mein add karna
    let focusContainer = document.querySelector(".bottom-grid");

    if (focusContainer) {
        focusContainer.appendChild(focusPanel);
    } else {
        document.querySelector("main")?.appendChild(focusPanel);
    }

    // Sidebar mein Focus Timer ka link add karna
    let focusSidebar = document.getElementById("sidebarNav");

    if (
        focusSidebar &&
        !focusSidebar.querySelector('[data-target="focusPanel"]')
    ) {
        let focusLink = document.createElement("a");
        focusLink.href = "#focusPanel";
        focusLink.dataset.target = "focusPanel";
        focusLink.textContent = "Focus Timer";
        focusSidebar.appendChild(focusLink);
    }

    // Seconds ko MM:SS format mein convert karna
    function formatFocusTime(seconds) {
        let minutes = Math.floor(seconds / 60);
        let remaining = seconds % 60;

        return (
            String(minutes).padStart(2, "0") +
            ":" +
            String(remaining).padStart(2, "0")
        );
    }

    // Timer display update karna
    function updateFocusDisplay() {
        document.getElementById("focusClock").textContent =
            formatFocusTime(focusRemainingSeconds);

        document.getElementById("focusSessionCount").textContent =
            focusCompletedSessions;
    }

    // Timer ko stop karna
    function stopFocusInterval() {
        if (focusInterval !== null) {
            clearInterval(focusInterval);
            focusInterval = null;
        }

        focusIsRunning = false;
        focusEndTime = null;
    }

    // Timer reset karna
    function resetFocusTimer() {
        stopFocusInterval();
        focusRemainingSeconds = focusDurations[focusMode];

        document.getElementById("focusStatus").textContent =
            focusMode === "focus" ? "Ready to focus?" : "Break time!";

        document.getElementById("focusStartBtn").textContent = "Start";
        updateFocusDisplay();
    }

    // Timer complete hone par action
    function completeFocusTimer() {
        stopFocusInterval();
        focusRemainingSeconds = 0;

        if (focusMode === "focus") {
            focusCompletedSessions++;

            // Completed sessions save karna
            localStorage.setItem(
                "lifeOSFocusSessions",
                String(focusCompletedSessions)
            );

            document.getElementById("focusStatus").textContent =
                "Focus session complete! Great work.";

            alert("Focus session complete! Ab break le lo.");
        } else {
            document.getElementById("focusStatus").textContent =
                "Break complete! Ready for another session?";

            alert("Break complete! Wapas focus karne ka waqt hai.");
        }

        document.getElementById("focusStartBtn").textContent = "Start";
        updateFocusDisplay();
    }

    // Timer ka har second update karna
    function tickFocusTimer() {
        if (!focusIsRunning || focusEndTime === null) return;

        // Actual end time se remaining time calculate karna
        focusRemainingSeconds = Math.max(
            0,
            Math.ceil((focusEndTime - Date.now()) / 1000)
        );

        updateFocusDisplay();

        if (focusRemainingSeconds <= 0) {
            completeFocusTimer();
        }
    }

    // Timer start karna
    function startFocusTimer() {
        if (focusIsRunning) return;

        if (focusRemainingSeconds <= 0) {
            resetFocusTimer();
        }

        focusIsRunning = true;
        focusEndTime = Date.now() + focusRemainingSeconds * 1000;

        document.getElementById("focusStatus").textContent =
            focusMode === "focus" ? "Stay focused..." : "Enjoy your break!";

        document.getElementById("focusStartBtn").textContent = "Running";

        focusInterval = setInterval(tickFocusTimer, 250);
        tickFocusTimer();
    }

    // Pause button
    document.getElementById("focusPauseBtn").addEventListener("click", function () {
        if (!focusIsRunning) return;

        tickFocusTimer();

        if (focusIsRunning) {
            stopFocusInterval();

            document.getElementById("focusStatus").textContent = "Timer paused.";
            document.getElementById("focusStartBtn").textContent = "Resume";
            updateFocusDisplay();
        }
    });

    // Start button
    document.getElementById("focusStartBtn").addEventListener("click", function () {
        startFocusTimer();
    });

    // Reset button
    document.getElementById("focusResetBtn").addEventListener("click", function () {
        resetFocusTimer();
    });

    // Focus ya break mode select karna
    document.querySelectorAll("[data-focus-mode]").forEach(button => {
        button.addEventListener("click", function () {
            stopFocusInterval();

            focusMode = this.dataset.focusMode;
            focusRemainingSeconds = focusDurations[focusMode];

            // Selected mode ko highlight karna
            document.querySelectorAll("[data-focus-mode]").forEach(item => {
                item.classList.remove("active");
            });

            this.classList.add("active");

            document.getElementById("focusStatus").textContent =
                focusMode === "focus" ? "Ready to focus?" : "Break time!";

            document.getElementById("focusStartBtn").textContent = "Start";

            // Custom input clear karna
            document.getElementById("focusCustomMinutes").value = "";

            updateFocusDisplay();
        });
    });

    // Custom duration set karna
    document.getElementById("focusCustomBtn").addEventListener("click", function () {
        let input = document.getElementById("focusCustomMinutes");
        let minutes = Number(input.value);

        if (!Number.isInteger(minutes) || minutes < 1 || minutes > 180) {
            alert("1 se 180 minutes ke darmiyan duration enter karo.");
            return;
        }

        stopFocusInterval();

        // Custom duration ko focus mode banana
        focusMode = "focus";
        focusDurations.focus = minutes * 60;
        focusRemainingSeconds = minutes * 60;

        document.querySelectorAll("[data-focus-mode]").forEach(item => {
            item.classList.remove("active");
        });

        document.querySelector('[data-focus-mode="focus"]').classList.add("active");

        document.getElementById("focusStatus").textContent =
            "Custom focus timer ready.";

        document.getElementById("focusStartBtn").textContent = "Start";

        updateFocusDisplay();
    });

    // Page load par timer display karna
    updateFocusDisplay();

});

// ==========================================
// LIFEOS - DAILY JOURNAL & MOOD TRACKER
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    // Purani journal entries load karna
    let journalEntries = JSON.parse(
        localStorage.getItem("lifeOSJournal") || "[]"
    );

    // Aaj ki date ka local format
    function getJournalDate() {
        let now = new Date();
        let year = now.getFullYear();
        let month = String(now.getMonth() + 1).padStart(2, "0");
        let day = String(now.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    // Journal entries save karna
    function saveJournalEntries() {
        localStorage.setItem(
            "lifeOSJournal",
            JSON.stringify(journalEntries)
        );
    }

    // Journal panel banana
    let journalPanel = document.createElement("section");
    journalPanel.id = "journalPanel";
    journalPanel.className = "panel journal-panel";

    journalPanel.innerHTML = `
        <div class="panel-header">
            <div>
                <h2>Daily Journal</h2>
                <p>Apne thoughts aur daily experiences likho</p>
            </div>
        </div>

        <form id="journalForm" class="journal-form">
            <label for="journalDate">Date</label>
            <input type="date" id="journalDate" required>

            <label for="journalMood">How are you feeling?</label>
            <select id="journalMood" required>
                <option value="😊 Happy">😊 Happy</option>
                <option value="😌 Calm">😌 Calm</option>
                <option value="😐 Normal">😐 Normal</option>
                <option value="😔 Sad">😔 Sad</option>
                <option value="😤 Stressed">😤 Stressed</option>
                <option value="🔥 Motivated">🔥 Motivated</option>
            </select>

            <label for="journalTitle">Entry Title</label>
            <input
                type="text"
                id="journalTitle"
                placeholder="Aaj ka din..."
                maxlength="100"
                required
            >

            <label for="journalContent">Your Journal</label>
            <textarea
                id="journalContent"
                rows="6"
                placeholder="Aaj kya hua? Tumhare thoughts kya hain?"
                required
            ></textarea>

            <div class="journal-form-buttons">
                <button type="submit" id="journalSaveBtn">
                    Save Entry
                </button>

                <button type="button" id="journalCancelBtn" hidden>
                    Cancel Edit
                </button>
            </div>
        </form>

        <div class="journal-history">
            <div class="journal-history-heading">
                <h3>My Journal Entries</h3>
                <span id="journalEntryCount">0 entries</span>
            </div>

            <div id="journalEntriesList"></div>
        </div>
    `;

    // Panel ko dashboard ke bottom area mein add karna
    let journalContainer = document.querySelector(".bottom-grid");

    if (journalContainer) {
        journalContainer.appendChild(journalPanel);
    } else {
        document.querySelector("main")?.appendChild(journalPanel);
    }

    // Sidebar mein Journal link add karna
    let journalSidebar = document.getElementById("sidebarNav");

    if (
        journalSidebar &&
        !journalSidebar.querySelector('[data-target="journalPanel"]')
    ) {
        let journalLink = document.createElement("a");
        journalLink.href = "#journalPanel";
        journalLink.dataset.target = "journalPanel";
        journalLink.textContent = "Daily Journal";
        journalSidebar.appendChild(journalLink);
    }

    // Editing entry ki ID
    let editingJournalId = null;

    // Journal form clear karna
    function resetJournalForm() {
        document.getElementById("journalForm").reset();
        document.getElementById("journalDate").value = getJournalDate();

        editingJournalId = null;

        document.getElementById("journalSaveBtn").textContent = "Save Entry";
        document.getElementById("journalCancelBtn").hidden = true;
    }

    // Journal entries screen par show karna
    function renderJournalEntries() {
        let list = document.getElementById("journalEntriesList");
        let count = document.getElementById("journalEntryCount");

        count.textContent =
            `${journalEntries.length} ${journalEntries.length === 1 ? "entry" : "entries"}`;

        list.innerHTML = "";

        // Entries ko latest date ke hisaab se sort karna
        let sortedEntries = [...journalEntries].sort((a, b) => {
            return b.date.localeCompare(a.date);
        });

        if (sortedEntries.length === 0) {
            list.innerHTML =
                '<p class="journal-empty">Abhi koi journal entry nahi hai. Apni pehli entry likho!</p>';
            return;
        }

        sortedEntries.forEach(entry => {
            let card = document.createElement("article");
            card.className = "journal-entry-card";

            let heading = document.createElement("div");
            heading.className = "journal-entry-heading";

            let title = document.createElement("strong");
            title.textContent = entry.title;

            let mood = document.createElement("span");
            mood.textContent = entry.mood;

            heading.appendChild(title);
            heading.appendChild(mood);

            let date = document.createElement("small");
            date.textContent = new Date(
                entry.date + "T00:00:00"
            ).toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric"
            });

            let content = document.createElement("p");
            content.className = "journal-entry-content";
            content.textContent = entry.content;

            let actions = document.createElement("div");
            actions.className = "journal-entry-actions";

            let editButton = document.createElement("button");
            editButton.type = "button";
            editButton.textContent = "Edit";
            editButton.dataset.editJournal = entry.id;

            let deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.textContent = "Delete";
            deleteButton.dataset.deleteJournal = entry.id;

            actions.appendChild(editButton);
            actions.appendChild(deleteButton);

            card.appendChild(heading);
            card.appendChild(date);
            card.appendChild(content);
            card.appendChild(actions);

            list.appendChild(card);
        });
    }

    // Journal form submit karna
    document.getElementById("journalForm").addEventListener("submit", function (event) {
        event.preventDefault();

        let date = document.getElementById("journalDate").value;
        let mood = document.getElementById("journalMood").value;
        let title = document.getElementById("journalTitle").value.trim();
        let content = document.getElementById("journalContent").value.trim();

        if (!date || !title || !content) {
            alert("Date, title aur journal likhna zaroori hai.");
            return;
        }

        if (editingJournalId) {
            // Existing entry update karna
            let existingEntry = journalEntries.find(
                entry => entry.id === editingJournalId
            );

            if (existingEntry) {
                existingEntry.date = date;
                existingEntry.mood = mood;
                existingEntry.title = title;
                existingEntry.content = content;
            }
        } else {
            // Nayi entry create karna
            journalEntries.push({
                id: Date.now().toString(),
                date: date,
                mood: mood,
                title: title,
                content: content
            });
        }

        saveJournalEntries();
        resetJournalForm();
        renderJournalEntries();

        alert("Journal entry save ho gayi!");
    });

    // Edit aur Delete buttons handle karna
    document.getElementById("journalEntriesList").addEventListener("click", function (event) {

        let editButton = event.target.closest("[data-edit-journal]");
        let deleteButton = event.target.closest("[data-delete-journal]");

        // Entry edit karna
        if (editButton) {
            let entry = journalEntries.find(
                item => item.id === editButton.dataset.editJournal
            );

            if (!entry) return;

            editingJournalId = entry.id;

            document.getElementById("journalDate").value = entry.date;
            document.getElementById("journalMood").value = entry.mood;
            document.getElementById("journalTitle").value = entry.title;
            document.getElementById("journalContent").value = entry.content;

            document.getElementById("journalSaveBtn").textContent = "Update Entry";
            document.getElementById("journalCancelBtn").hidden = false;

            document.getElementById("journalForm").scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }

        // Entry delete karna
        if (deleteButton) {
            let entryId = deleteButton.dataset.deleteJournal;

            if (!confirm("Kya tum yeh journal entry delete karna chahte ho?")) {
                return;
            }

            journalEntries = journalEntries.filter(
                item => item.id !== entryId
            );

            saveJournalEntries();
            renderJournalEntries();

            if (editingJournalId === entryId) {
                resetJournalForm();
            }
        }
    });

    // Edit cancel karna
    document.getElementById("journalCancelBtn").addEventListener("click", function () {
        resetJournalForm();
    });

    // Default date set karna aur entries render karna
    resetJournalForm();
    renderJournalEntries();

});

// ==========================================
// LIFEOS - GOALS & PROGRESS TRACKER
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    // Saved goals load karna
    let lifeOSGoals = JSON.parse(
        localStorage.getItem("lifeOSGoals") || "[]"
    );

    let editingGoalId = null;

    // Goals ko browser storage mein save karna
    function saveLifeOSGoals() {
        localStorage.setItem(
            "lifeOSGoals",
            JSON.stringify(lifeOSGoals)
        );
    }

    // Goals panel create karna
    let goalsPanel = document.createElement("section");
    goalsPanel.id = "goalsPanel";
    goalsPanel.className = "panel goals-panel";

    goalsPanel.innerHTML = `
        <div class="panel-header">
            <div>
                <h2>Goals & Progress</h2>
                <p>Apne dreams ko achievable goals mein badlo</p>
            </div>
        </div>

        <form id="goalForm" class="goal-form">

            <label for="goalTitle">Goal Name</label>
            <input
                type="text"
                id="goalTitle"
                placeholder="Example: Learn Web Development"
                maxlength="100"
                required
            >

            <label for="goalCategory">Category</label>
            <select id="goalCategory">
                <option value="Personal">Personal</option>
                <option value="Career">Career</option>
                <option value="Education">Education</option>
                <option value="Health">Health</option>
                <option value="Finance">Finance</option>
                <option value="Other">Other</option>
            </select>

            <label for="goalDeadline">Deadline</label>
            <input type="date" id="goalDeadline">

            <label for="goalDescription">Description (Optional)</label>
            <textarea
                id="goalDescription"
                rows="3"
                placeholder="Goal ke bare mein details..."
            ></textarea>

            <button type="submit" id="goalSaveBtn">
                + Add Goal
            </button>

            <button type="button" id="goalCancelBtn" hidden>
                Cancel Edit
            </button>
        </form>

        <div class="goal-summary">
            <div class="goal-summary-card">
                <span>Total Goals</span>
                <strong id="goalTotalCount">0</strong>
            </div>

            <div class="goal-summary-card">
                <span>In Progress</span>
                <strong id="goalActiveCount">0</strong>
            </div>

            <div class="goal-summary-card">
                <span>Completed</span>
                <strong id="goalCompletedCount">0</strong>
            </div>
        </div>

        <div class="goal-list-heading">
            <h3>My Goals</h3>
        </div>

        <div id="goalList"></div>
    `;

    // Panel dashboard mein add karna
    let goalsContainer = document.querySelector(".bottom-grid");

    if (goalsContainer) {
        goalsContainer.appendChild(goalsPanel);
    } else {
        document.querySelector("main")?.appendChild(goalsPanel);
    }

    // Sidebar mein Goals link add karna
    let goalsSidebar = document.getElementById("sidebarNav");

    if (
        goalsSidebar &&
        !goalsSidebar.querySelector('[data-target="goalsPanel"]')
    ) {
        let link = document.createElement("a");
        link.href = "#goalsPanel";
        link.dataset.target = "goalsPanel";
        link.textContent = "Goals Tracker";
        goalsSidebar.appendChild(link);
    }

    // Form ko reset karna
    function resetGoalForm() {
        document.getElementById("goalForm").reset();

        editingGoalId = null;

        document.getElementById("goalSaveBtn").textContent = "+ Add Goal";
        document.getElementById("goalCancelBtn").hidden = true;
    }

    // Goals ko screen par render karna
    function renderLifeOSGoals() {

        let list = document.getElementById("goalList");

        let completed = lifeOSGoals.filter(
            goal => goal.completed
        ).length;

        let active = lifeOSGoals.length - completed;

        document.getElementById("goalTotalCount").textContent =
            lifeOSGoals.length;

        document.getElementById("goalActiveCount").textContent =
            active;

        document.getElementById("goalCompletedCount").textContent =
            completed;

        list.innerHTML = "";

        if (lifeOSGoals.length === 0) {
            list.innerHTML =
                '<p class="goal-empty">Abhi koi goal nahi hai. Apna pehla goal add karo!</p>';
            return;
        }

        lifeOSGoals.forEach(goal => {

            let card = document.createElement("div");
            card.className = "goal-card";

            if (goal.completed) {
                card.classList.add("goal-is-completed");
            }

            let header = document.createElement("div");
            header.className = "goal-card-header";

            let info = document.createElement("div");

            let title = document.createElement("strong");
            title.textContent = goal.title;

            let category = document.createElement("span");
            category.textContent = goal.category;

            info.appendChild(title);
            info.appendChild(category);

            let status = document.createElement("span");
            status.className = "goal-status";
            status.textContent = goal.completed ? "Completed" : "In Progress";

            header.appendChild(info);
            header.appendChild(status);

            let description = document.createElement("p");
            description.className = "goal-description";
            description.textContent = goal.description || "";

            let deadline = document.createElement("p");
            deadline.className = "goal-deadline";

            if (goal.deadline) {
                deadline.textContent = "Deadline: " +
                    new Date(goal.deadline + "T00:00:00").toLocaleDateString(
                        "en-US",
                        { day: "numeric", month: "short", year: "numeric" }
                    );
            } else {
                deadline.textContent = "No deadline set";
            }

            // Progress bar
            let progressHeader = document.createElement("div");
            progressHeader.className = "goal-progress-header";

            let progressLabel = document.createElement("span");
            progressLabel.textContent = "Progress";

            let progressValue = document.createElement("strong");
            progressValue.textContent = goal.progress + "%";

            progressHeader.appendChild(progressLabel);
            progressHeader.appendChild(progressValue);

            let progressTrack = document.createElement("div");
            progressTrack.className = "goal-progress-track";

            let progressFill = document.createElement("div");
            progressFill.className = "goal-progress-fill";
            progressFill.style.width = goal.progress + "%";

            progressTrack.appendChild(progressFill);

            // Progress slider
            let progressInput = document.createElement("input");
            progressInput.type = "range";
            progressInput.min = "0";
            progressInput.max = "100";
            progressInput.step = "5";
            progressInput.value = goal.progress;
            progressInput.className = "goal-progress-slider";
            progressInput.dataset.progressGoal = goal.id;
            progressInput.disabled = goal.completed;

            // Buttons
            let actions = document.createElement("div");
            actions.className = "goal-actions";

            let editButton = document.createElement("button");
            editButton.type = "button";
            editButton.textContent = "Edit";
            editButton.dataset.editGoal = goal.id;

            let completeButton = document.createElement("button");
            completeButton.type = "button";
            completeButton.textContent = goal.completed
                ? "Reopen"
                : "Mark Complete";
            completeButton.dataset.completeGoal = goal.id;

            let deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.textContent = "Delete";
            deleteButton.dataset.deleteGoal = goal.id;

            actions.appendChild(editButton);
            actions.appendChild(completeButton);
            actions.appendChild(deleteButton);

            card.appendChild(header);
            card.appendChild(description);
            card.appendChild(deadline);
            card.appendChild(progressHeader);
            card.appendChild(progressTrack);
            card.appendChild(progressInput);
            card.appendChild(actions);

            list.appendChild(card);
        });
    }

    // Naya goal add ya existing goal update karna
    document.getElementById("goalForm").addEventListener("submit", function (event) {
        event.preventDefault();

        let title = document.getElementById("goalTitle").value.trim();
        let category = document.getElementById("goalCategory").value;
        let deadline = document.getElementById("goalDeadline").value;
        let description = document.getElementById("goalDescription").value.trim();

        if (!title) {
            alert("Goal ka naam enter karo.");
            return;
        }

        if (editingGoalId) {

            let goal = lifeOSGoals.find(
                item => item.id === editingGoalId
            );

            if (goal) {
                goal.title = title;
                goal.category = category;
                goal.deadline = deadline;
                goal.description = description;
            }

        } else {

            lifeOSGoals.push({
                id: Date.now().toString(),
                title: title,
                category: category,
                deadline: deadline,
                description: description,
                progress: 0,
                completed: false
            });
        }

        saveLifeOSGoals();
        resetGoalForm();
        renderLifeOSGoals();
    });

    // Progress slider update karna
    document.getElementById("goalList").addEventListener("input", function (event) {

        let slider = event.target.closest("[data-progress-goal]");

        if (!slider) return;

        let goal = lifeOSGoals.find(
            item => item.id === slider.dataset.progressGoal
        );

        if (!goal || goal.completed) return;

        goal.progress = Number(slider.value);

        // 100% progress par goal complete karna
        if (goal.progress === 100) {
            goal.completed = true;
        }

        saveLifeOSGoals();
        renderLifeOSGoals();
    });

    // Edit, complete aur delete actions
    document.getElementById("goalList").addEventListener("click", function (event) {

        let editButton = event.target.closest("[data-edit-goal]");
        let completeButton = event.target.closest("[data-complete-goal]");
        let deleteButton = event.target.closest("[data-delete-goal]");

        // Goal edit karna
        if (editButton) {

            let goal = lifeOSGoals.find(
                item => item.id === editButton.dataset.editGoal
            );

            if (!goal) return;

            editingGoalId = goal.id;

            document.getElementById("goalTitle").value = goal.title;
            document.getElementById("goalCategory").value = goal.category;
            document.getElementById("goalDeadline").value = goal.deadline || "";
            document.getElementById("goalDescription").value = goal.description || "";

            document.getElementById("goalSaveBtn").textContent = "Update Goal";
            document.getElementById("goalCancelBtn").hidden = false;

            document.getElementById("goalForm").scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }

        // Goal complete ya reopen karna
        if (completeButton) {

            let goal = lifeOSGoals.find(
                item => item.id === completeButton.dataset.completeGoal
            );

            if (!goal) return;

            goal.completed = !goal.completed;

            // Complete karne par progress 100 karna
            if (goal.completed) {
                goal.progress = 100;
            } else if (goal.progress === 100) {
                goal.progress = 95;
            }

            saveLifeOSGoals();
            renderLifeOSGoals();
        }

        // Goal delete karna
        if (deleteButton) {

            let goalId = deleteButton.dataset.deleteGoal;

            if (!confirm("Kya tum yeh goal delete karna chahte ho?")) {
                return;
            }

            lifeOSGoals = lifeOSGoals.filter(
                item => item.id !== goalId
            );

            if (editingGoalId === goalId) {
                resetGoalForm();
            }

            saveLifeOSGoals();
            renderLifeOSGoals();
        }
    });

    // Edit cancel karna
    document.getElementById("goalCancelBtn").addEventListener("click", function () {
        resetGoalForm();
    });

    // Initial render
    renderLifeOSGoals();

});

// ==========================================
// LIFEOS - ANALYTICS DASHBOARD
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    // Analytics panel create karna
    const analyticsPanel = document.createElement("section");
    analyticsPanel.id = "analyticsPanel";
    analyticsPanel.className = "panel analytics-panel";

    analyticsPanel.innerHTML = `
        <div class="panel-header">
            <div>
                <h2>Analytics Dashboard</h2>
                <p>Apni productivity aur progress ka overview dekho</p>
            </div>
            <button type="button" id="refreshAnalytics">Refresh</button>
        </div>

        <div class="analytics-grid">
            <div class="analytics-card">
                <span>Total Goals</span>
                <strong id="analyticsGoals">0</strong>
            </div>
            <div class="analytics-card">
                <span>Goals Completed</span>
                <strong id="analyticsGoalsDone">0</strong>
            </div>
            <div class="analytics-card">
                <span>Tasks Completed</span>
                <strong id="analyticsTasksDone">—</strong>
            </div>
            <div class="analytics-card">
                <span>Tasks Pending</span>
                <strong id="analyticsTasksPending">—</strong>
            </div>
        </div>

        <div class="analytics-section">
            <h3>Goals Progress</h3>
            <div class="analytics-bar-track">
                <div id="analyticsGoalBar" class="analytics-bar-fill"></div>
            </div>
            <p id="analyticsGoalText">0% goals completed</p>
        </div>

        <div class="analytics-section">
            <h3>Money Overview</h3>
            <div class="analytics-money-grid">
                <div>
                    <span>Total Income</span>
                    <strong id="analyticsIncome">Not detected</strong>
                </div>
                <div>
                    <span>Total Expenses</span>
                    <strong id="analyticsExpenses">Not detected</strong>
                </div>
                <div>
                    <span>Balance</span>
                    <strong id="analyticsBalance">Not detected</strong>
                </div>
            </div>
            <p class="analytics-hint">
                Money figures tab show hongi jab app ke saved transaction records pehchane ja saken.
            </p>
        </div>

        <div class="analytics-section">
            <h3>Productivity Summary</h3>
            <p id="analyticsSummary">
                Refresh karke apni latest progress dekho.
            </p>
        </div>
    `;

    // Panel ko app ke layout mein add karna
    const analyticsContainer = document.querySelector(".bottom-grid");

    if (analyticsContainer) {
        analyticsContainer.appendChild(analyticsPanel);
    } else {
        document.querySelector("main")?.appendChild(analyticsPanel);
    }

    // Sidebar mein Analytics ka link add karna
    const sidebar = document.getElementById("sidebarNav");

    if (
        sidebar &&
        !sidebar.querySelector('[data-target="analyticsPanel"]')
    ) {
        const link = document.createElement("a");
        link.href = "#analyticsPanel";
        link.dataset.target = "analyticsPanel";
        link.textContent = "Analytics";
        sidebar.appendChild(link);
    }

    // LocalStorage se array data read karne ka helper
    function getSavedArrays() {
        const savedArrays = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);

            try {
                const value = JSON.parse(localStorage.getItem(key));

                if (Array.isArray(value)) {
                    savedArrays.push({ key, records: value });
                }
            } catch (error) {
                // Jo value JSON nahi hai usay ignore karna
            }
        }

        return savedArrays;
    }

    // Amount ko number mein convert karna
    function getAmount(value) {
        if (typeof value === "number") return value;

        if (typeof value === "string") {
            const cleaned = value.replace(/[^0-9.-]/g, "");
            return Number(cleaned) || 0;
        }

        return 0;
    }

    // Analytics values update karna
    function updateAnalytics() {

        const savedArrays = getSavedArrays();

        // Goals ka data
        const goals = JSON.parse(
            localStorage.getItem("lifeOSGoals") || "[]"
        );

        const totalGoals = goals.length;
        const completedGoals = goals.filter(
            goal => goal.completed === true
        ).length;

        const goalPercentage = totalGoals
            ? Math.round((completedGoals / totalGoals) * 100)
            : 0;

        document.getElementById("analyticsGoals").textContent =
            totalGoals;

        document.getElementById("analyticsGoalsDone").textContent =
            completedGoals;

        document.getElementById("analyticsGoalBar").style.width =
            goalPercentage + "%";

        document.getElementById("analyticsGoalText").textContent =
            goalPercentage + "% goals completed";

        // Tasks ke records dhoondhna
        const taskData = savedArrays.find(item =>
            /task|todo/i.test(item.key) &&
            item.records.some(record =>
                record && typeof record === "object" &&
                (
                    "completed" in record ||
                    "done" in record ||
                    "isCompleted" in record ||
                    "status" in record
                )
            )
        );

        let completedTasks = null;
        let pendingTasks = null;

        if (taskData) {
            const records = taskData.records;

            completedTasks = records.filter(task =>
                task.completed === true ||
                task.done === true ||
                task.isCompleted === true ||
                String(task.status || "").toLowerCase() === "completed"
            ).length;

            pendingTasks = records.length - completedTasks;
        }

        document.getElementById("analyticsTasksDone").textContent =
            completedTasks === null ? "Not detected" : completedTasks;

        document.getElementById("analyticsTasksPending").textContent =
            pendingTasks === null ? "Not detected" : pendingTasks;

        // Money transactions dhoondhna
        const moneyData = savedArrays.filter(item =>
            /money|transaction|expense|income/i.test(item.key)
        );

        let totalIncome = 0;
        let totalExpenses = 0;
        let moneyRecordsFound = false;

        moneyData.forEach(item => {
            item.records.forEach(record => {

                if (!record || typeof record !== "object") return;

                const amountValue =
                    record.amount ??
                    record.value ??
                    record.price;

                if (amountValue === undefined) return;

                const amount = getAmount(amountValue);

                const type = String(
                    record.type ||
                    record.category ||
                    record.kind ||
                    ""
                ).toLowerCase();

                if (/income|earning|received|in/.test(type)) {
                    totalIncome += amount;
                    moneyRecordsFound = true;
                } else if (/expense|spent|payment|out/.test(type)) {
                    totalExpenses += amount;
                    moneyRecordsFound = true;
                }
            });
        });

        const incomeElement =
            document.getElementById("analyticsIncome");

        const expenseElement =
            document.getElementById("analyticsExpenses");

        const balanceElement =
            document.getElementById("analyticsBalance");

        if (moneyRecordsFound) {
            incomeElement.textContent =
                "Rs. " + totalIncome.toLocaleString("en-PK");

            expenseElement.textContent =
                "Rs. " + totalExpenses.toLocaleString("en-PK");

            balanceElement.textContent =
                "Rs. " + (totalIncome - totalExpenses).toLocaleString("en-PK");
        } else {
            incomeElement.textContent = "Not detected";
            expenseElement.textContent = "Not detected";
            balanceElement.textContent = "Not detected";
        }

        // Productivity summary
        let summary = totalGoals > 0
            ? completedGoals + " out of " + totalGoals + " goals completed."
            : "Abhi koi goal add nahi kiya gaya.";

        if (completedTasks !== null) {
            summary += " " + completedTasks +
                " tasks complete aur " + pendingTasks + " pending hain.";
        } else {
            summary += " Tasks ka saved data automatically identify nahi ho saka.";
        }

        document.getElementById("analyticsSummary").textContent =
            summary;
    }

    // Refresh button
    document.getElementById("refreshAnalytics").addEventListener(
        "click",
        updateAnalytics
    );

    // Page load par analytics update karna
    updateAnalytics();

});
// ===== LIFEOS SETTINGS PANEL =====
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".bottom-grid");

  if (!grid || document.getElementById("settingsPanel")) return;

  const panel = document.createElement("section");
  panel.id = "settingsPanel";
  panel.className = "panel";
  panel.style.gridColumn = "1 / -1";

  const heading = document.createElement("h2");
  heading.textContent = "⚙️ Settings & Backup";

  const info = document.createElement("p");
  info.textContent = "Apne LifeOS data ka backup banayein ya restore karein.";

  const backupButton = document.createElement("button");
  backupButton.textContent = "⬇ Download Backup";

  const restoreButton = document.createElement("button");
  restoreButton.textContent = "⬆ Restore Backup";

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".json,application/json";
  fileInput.hidden = true;

  const status = document.createElement("p");

  panel.append(heading, info, backupButton, restoreButton, fileInput, status);
  grid.appendChild(panel);

  // Backup button ka action
  backupButton.addEventListener("click", () => {
    const data = {};

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      data[key] = localStorage.getItem(key);
    }

    const blob = new Blob(
      [JSON.stringify(data, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "LifeOS-Backup.json";
    link.click();

    URL.revokeObjectURL(url);
    status.textContent = "Backup download ho gaya!";
  });

  // Restore button file picker kholega
  restoreButton.addEventListener("click", () => {
    fileInput.click();
  });

  // Backup file restore karein
  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);

        if (
          !data ||
          typeof data !== "object" ||
          Array.isArray(data)
        ) {
          throw new Error("Invalid backup");
        }

        if (!confirm("Restore karne se current saved data replace ho jayega. Continue?")) {
          fileInput.value = "";
          return;
        }

        localStorage.clear();

        Object.entries(data).forEach(([key, value]) => {
          if (typeof value === "string") {
            localStorage.setItem(key, value);
          }
        });

        alert("Backup restore ho gaya! App reload hogi.");
        location.reload();
      } catch (error) {
        alert("Backup file valid nahi hai.");
      }
    };

    reader.readAsText(file);
  });
});


// ===== LIFEOS DARK / LIGHT THEME =====
document.addEventListener("DOMContentLoaded", () => {
  const panel = document.getElementById("settingsPanel");
  if (!panel || document.getElementById("themeToggle")) return;

  const heading = document.createElement("h3");
  heading.textContent = "🎨 Appearance";

  const description = document.createElement("p");
  description.textContent = "Apni pasand ka theme select karein.";

  const button = document.createElement("button");
  button.id = "themeToggle";

  const savedTheme = localStorage.getItem("lifeosTheme") || "dark";

  function applyTheme(theme) {
    document.body.classList.toggle("light-theme", theme === "light");
    button.textContent = theme === "light"
      ? "🌙 Switch to Dark Mode"
      : "☀️ Switch to Light Mode";

    localStorage.setItem("lifeosTheme", theme);
  }

  button.addEventListener("click", () => {
    const isLight = document.body.classList.contains("light-theme");
    applyTheme(isLight ? "dark" : "light");
  });

  panel.append(heading, description, button);
  applyTheme(savedTheme);
});


// ===== LIFEOS CLEAR ALL DATA =====
document.addEventListener("DOMContentLoaded", () => {
  const panel = document.getElementById("settingsPanel");

  if (!panel || document.getElementById("clearLifeOSData")) return;

  const heading = document.createElement("h3");
  heading.textContent = "🗑️ Data Management";

  const description = document.createElement("p");
  description.textContent =
    "LifeOS ka tamam saved data permanently clear karein.";

  const button = document.createElement("button");
  button.id = "clearLifeOSData";
  button.textContent = "Clear All Data";
  button.style.background = "#c0394b";

  button.addEventListener("click", () => {
    const confirmFirst = confirm(
      "Kya aap waqai LifeOS ka tamam data delete karna chahte hain?"
    );

    if (!confirmFirst) return;

    const confirmSecond = confirm(
      "Aakhri warning: Ye action undo nahi ho sakta. Kya aap sure hain?"
    );

    if (!confirmSecond) return;

    localStorage.clear();

    alert("LifeOS ka saved data clear ho gaya. App reload hogi.");
    location.reload();
  });

  panel.append(heading, description, button);
});

// ===== LIFEOS PROFILE & PERSONALIZATION =====
document.addEventListener("DOMContentLoaded", () => {
  const panel = document.getElementById("settingsPanel");

  if (!panel || document.getElementById("profileSettings")) return;

  const profile = document.createElement("div");
  profile.id = "profileSettings";

  profile.innerHTML = `
    <h3>👤 My Profile</h3>
    <p>Apni personal details set karein.</p>

    <label for="lifeosName">Your Name</label>
    <input id="lifeosName" type="text"
      placeholder="Apna naam likhein" maxlength="40">

    <label for="lifeosAvatar">Choose Avatar</label>
    <select id="lifeosAvatar">
      <option value="👤">👤 Default</option>
      <option value="😊">😊 Smile</option>
      <option value="😎">😎 Cool</option>
      <option value="🚀">🚀 Explorer</option>
      <option value="👑">👑 King / Queen</option>
      <option value="🌟">🌟 Star</option>
    </select>

    <button type="button" id="saveLifeOSProfile">
      Save Profile
    </button>

    <p id="profileMessage"></p>
  `;

  panel.appendChild(profile);

  const nameInput = document.getElementById("lifeosName");
  const avatarInput = document.getElementById("lifeosAvatar");
  const saveButton = document.getElementById("saveLifeOSProfile");
  const message = document.getElementById("profileMessage");

  function showProfile() {
    const name = localStorage.getItem("lifeosUserName") || "";
    const avatar = localStorage.getItem("lifeosAvatar") || "👤";

    nameInput.value = name;
    avatarInput.value = avatar;

    const profileIcon = document.querySelector(".profile");
    if (profileIcon) profileIcon.textContent = avatar;

    const welcomeHeading = document.querySelector(".welcome h2");

    if (welcomeHeading) {
      welcomeHeading.textContent = name
        ? `Welcome, ${name}! ✨`
        : "Make today count. ✨";
    }
  }

  saveButton.addEventListener("click", () => {
    const name = nameInput.value.trim();

    if (!name) {
      message.textContent = "Please apna naam likhein.";
      return;
    }

    localStorage.setItem("lifeosUserName", name);
    localStorage.setItem("lifeosAvatar", avatarInput.value);

    showProfile();
    message.textContent = "Profile successfully save ho gayi! 💜";
  });

  showProfile();
});

// ===== LIFEOS PIN SECURITY =====
document.addEventListener("DOMContentLoaded", () => {
  const panel = document.getElementById("settingsPanel");

  if (!panel || document.getElementById("pinSecurity")) return;

  // PIN ko SHA-256 hash mein convert karein
  async function hashPIN(pin) {
    const data = new TextEncoder().encode(pin);
    const hash = await crypto.subtle.digest("SHA-256", data);

    return Array.from(new Uint8Array(hash))
      .map(byte => byte.toString(16).padStart(2, "0"))
      .join("");
  }

  // Settings mein PIN controls
  const section = document.createElement("div");
  section.id = "pinSecurity";
  section.innerHTML = `
    <h3>🔐 App Security</h3>
    <p>LifeOS ko PIN se lock karein.</p>

    <input id="newLifeOSPin" type="password"
      placeholder="4 se 8 digit PIN"
      inputmode="numeric" maxlength="8">

    <button type="button" id="enableLifeOSPin">
      Enable PIN Lock
    </button>

    <button type="button" id="disableLifeOSPin">
      Disable PIN Lock
    </button>

    <p id="pinMessage"></p>
  `;

  panel.appendChild(section);

  const pinInput = document.getElementById("newLifeOSPin");
  const message = document.getElementById("pinMessage");

  // PIN enable karein
  document.getElementById("enableLifeOSPin")
    .addEventListener("click", async () => {
      const pin = pinInput.value.trim();

      if (!/^\d{4,8}$/.test(pin)) {
        message.textContent = "PIN 4 se 8 digits ka hona chahiye.";
        return;
      }

      try {
        const hashedPIN = await hashPIN(pin);

        localStorage.setItem("lifeosPIN", hashedPIN);
        pinInput.value = "";

        message.textContent = "PIN Lock successfully enabled! 💜";

        location.reload();
      } catch (error) {
        message.textContent =
          "Security feature ke liye app localhost ya HTTPS par kholein.";
      }
    });

  // PIN disable karein
  document.getElementById("disableLifeOSPin")
    .addEventListener("click", () => {
      if (!localStorage.getItem("lifeosPIN")) {
        message.textContent = "PIN Lock pehle se disabled hai.";
        return;
      }

      const answer = prompt("PIN enter karein:");

      if (answer === null) return;

      hashPIN(answer).then(hash => {
        if (hash === localStorage.getItem("lifeosPIN")) {
          localStorage.removeItem("lifeosPIN");
          message.textContent = "PIN Lock disabled ho gaya.";
        } else {
          message.textContent = "Wrong PIN!";
        }
      });
    });

  // App open hone par PIN screen
  const savedPIN = localStorage.getItem("lifeosPIN");

  if (!savedPIN) return;

  const lock = document.createElement("div");
  lock.id = "lifeosLockScreen";

  lock.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 999999;
    background: #100d1d;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 25px;
    text-align: center;
  `;

  lock.innerHTML = `
    <h1>🔐 LifeOS Locked</h1>
    <p>Apna PIN enter karein.</p>

    <input id="unlockLifeOSPin"
      type="password"
      inputmode="numeric"
      maxlength="8"
      placeholder="Enter PIN"
      style="padding:14px; border-radius:8px;
      font-size:20px; text-align:center;">

    <button id="unlockLifeOSButton"
      style="margin-top:15px; padding:12px 25px;
      border:0; border-radius:8px;
      background:#8055c7; color:white;">
      Unlock LifeOS
    </button>

    <p id="unlockMessage"></p>
  `;

  document.body.appendChild(lock);

  async function unlockApp() {
    const enteredPIN =
      document.getElementById("unlockLifeOSPin").value;

    const enteredHash = await hashPIN(enteredPIN);

    if (enteredHash === localStorage.getItem("lifeosPIN")) {
      lock.remove();
    } else {
      document.getElementById("unlockMessage").textContent =
        "Wrong PIN! Dobara try karein.";

      document.getElementById("unlockLifeOSPin").value = "";
    }
  }

  document.getElementById("unlockLifeOSButton")
    .addEventListener("click", unlockApp);

  document.getElementById("unlockLifeOSPin")
    .addEventListener("keydown", event => {
      if (event.key === "Enter") unlockApp();
    });
});

// ===== REGISTER LIFEOS SERVICE WORKER =====
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js")
      .then(() => {
        console.log("LifeOS offline support enabled!");
      })
      .catch(error => {
        console.error("Service Worker Error:", error);
      });
  });
}
