const Add_Btn = document.querySelector(".add-note");
const note_list = document.querySelector(".notes-list");
let noteIdCounter;
let savedMaxId =
  JSON.parse(localStorage.getItem("note-app")) ||
  [].reduce((maxId, item) => {
    return Math.max(maxId, item.id);
  }, 0);

(function loadSavedNotes() {
  let savedNotesArray = JSON.parse(localStorage.getItem("note-app")) || [];
  savedNotesArray.sort((a, b) => {
    return a.updatedAt > b.updatedAt;
  });
  // console.log(savedNotesArray);
  let maxid = 0;
  savedNotesArray.forEach((item) => {
    if (item.id > maxid) maxid = item.id;
    const newNote = createNote(item.id);
    note_list.appendChild(newNote);
  });
  savedMaxId = parseInt(maxid);
  noteIdCounter = parseInt(maxid) + 1;
})();

Add_Btn.addEventListener("click", () => {
  const newNote = createNote(noteIdCounter);
  note_list.appendChild(newNote);
  noteIdCounter++;
});

function createNote(noteIdCounter) {
  const newNote = document.createElement("div");
  newNote.id = noteIdCounter;
  newNote.className = "note";
  newNote.draggable = true;
  newNote.addEventListener("dragstart", (event) => {
    event.dataTransfer.setData("text/plain", event.target.id);
  });

  const noteheading = createInput(
    "note-heading",
    "Edit note heading",
    newNote.id
  );
  const notebody = createTextarea(
    "note-body",
    "Edit note content",
    2,
    35,
    "soft",
    newNote.id
  );
  const notetime = createParagraph("note-time", newNote.id);
  const btnDiv = createDiv("btn-list");
  const deletebtn = createImageButton(
    "delete-btn",
    "./assets/delete.png",
    "delete-" + newNote.id
  );
  const colors = createDiv("color-swatch");
  const green = createDiv("green");
  const red = createDiv("red");
  const blue = createDiv("blue");
  const yellow = createDiv("yellow");

  const donebtn = createImageButton(
    "done-btn",
    "./assets/check.png",
    "done-" + newNote.id
  );

  green.addEventListener("click", () => {
    changeColor("green", newNote.id);
  });
  red.addEventListener("click", () => {
    changeColor("red", newNote.id);
  });
  blue.addEventListener("click", () => {
    changeColor("blue", newNote.id);
  });
  yellow.addEventListener("click", () => {
    changeColor("yellow", newNote.id);
  });
  deletebtn.addEventListener("click", () => {
    removeChildren(newNote.id);
  });

  donebtn.addEventListener("click", () => {
    saveNote(newNote.id);
  });

  appendChildren(newNote, noteheading, notebody, notetime, btnDiv);
  appendChildren(btnDiv, donebtn, colors, deletebtn);
  appendChildren(colors, green, red, blue, yellow);
  if (newNote.id <= savedMaxId) {
    let existing = JSON.parse(localStorage.getItem("note-app")).filter(
      (item) => item.id == newNote.id
    )[0];
    if (existing.color) {
      newNote.className = "note div-" + existing.color;
      const selectedColor = newNote.querySelector("." + existing.color);
      selectedColor.className = existing.color + " selected";
    }
  }

  return newNote;
}

function createInput(className, placeholder, id) {
  const input = document.createElement("input");
  input.setAttribute("placeholder", placeholder);
  input.setAttribute("id", "heading-" + id);
  if (id <= savedMaxId) {
    let existing = JSON.parse(localStorage.getItem("note-app")).filter(
      (item) => item.id == id
    )[0];
    input.value = existing.heading;
    input.className = className + " div-" + existing.color;
  } else {
    input.className = className;
  }
  return input;
}

function createTextarea(className, placeholder, rows, cols, wrap, id) {
  const textarea = document.createElement("textarea");
  textarea.setAttribute("placeholder", placeholder);
  textarea.setAttribute("rows", rows);
  textarea.setAttribute("cols", cols);
  textarea.setAttribute("wrap", wrap);
  textarea.setAttribute("id", "body-" + id);
  if (id <= savedMaxId) {
    let existing = JSON.parse(localStorage.getItem("note-app")).filter(
      (item) => item.id == id
    )[0];
    textarea.value = existing.body;
    textarea.className = className + " div-" + existing.color;
  } else {
    textarea.className = className;
  }
  return textarea;
}

function createParagraph(className, id) {
  const paragraph = document.createElement("p");
  paragraph.className = className;
  paragraph.setAttribute("id", "updatedAt-" + id);
  if (id <= savedMaxId) {
    paragraph.textContent = JSON.parse(localStorage.getItem("note-app")).filter(
      (item) => item.id == id
    )[0].updatedAt;
  } else {
    paragraph.value = new Date().toLocaleString(undefined, {
      dateStyle: "full",
      timeStyle: "short",
    });
  }
  return paragraph;
}

function createDiv(className) {
  const division = document.createElement("div");
  division.className = className;
  return division;
}

function createImageButton(className, src, id) {
  const img = document.createElement("img");
  img.className = className;
  img.setAttribute("src", src);
  img.setAttribute("id", id);
  return img;
}

function appendChildren(parent, ...children) {
  children.forEach((child) => {
    parent.appendChild(child);
  });
}

function removeChildren(id) {
  const noteItem = document.getElementById(id);
  let notes = JSON.parse(localStorage.getItem("note-app")) || [];
  let newNotes = notes.filter((note) => note.id != id);
  localStorage.setItem("note-app", JSON.stringify(newNotes));
  noteItem.remove();
}

function changeColor(color, id) {
  const noteItem = document.getElementById(id);
  const heading = noteItem.querySelector(".note-heading");
  const body = noteItem.querySelector(".note-body");
  const colorClasses = ["green", "red", "blue", "yellow"];
  colorClasses.forEach((classname) => {
    const colorElement = noteItem.querySelector("." + classname);
    colorElement.classList.remove("selected");
  });
  const selectedColor = noteItem.querySelector("." + color);
  noteItem.className = "note div-" + color;
  heading.className = "note-heading div-" + color;
  body.className = "note-body div-" + color;
  selectedColor.className = color + " selected";
}

function saveNote(id) {
  let notes = JSON.parse(localStorage.getItem("note-app")) || [];
  const noteItem = document.getElementById(id);
  let allClasses = noteItem.querySelector(".selected");
  let color;
  if (allClasses) {
    allClasses = allClasses.className.split(" ");
    let colorClasses = allClasses.filter(function (className) {
      return className !== "selected";
    });
    color = colorClasses.length > 0 ? colorClasses[0] : null;
  } else {
    color = null;
  }

  let existingIndex = notes.findIndex((item) => item.id === id);
  if (existingIndex !== -1) {
    let existingNote = notes[existingIndex];
    existingNote.heading = document.getElementById("heading-" + id).value;
    existingNote.body = document.getElementById("body-" + id).value;
    existingNote.updatedAt = new Date().toLocaleString(undefined, {
      dateStyle: "full",
      timeStyle: "short",
    });
    existingNote.color = color;
    notes[existingIndex] = existingNote;
  } else {
    let newNote = {
      id: id,
      heading: document.getElementById("heading-" + id).value,
      body: document.getElementById("body-" + id).value,
      updatedAt: new Date().toLocaleString(undefined, {
        dateStyle: "full",
        timeStyle: "short",
      }),
      color: color,
    };
    notes.push(newNote);
  }
  localStorage.setItem("note-app", JSON.stringify(notes));
}
const droppableArea = document.querySelector("#droppableArea");

droppableArea.addEventListener("dragover", (event) => {
  event.preventDefault();
});

droppableArea.addEventListener("drop", (event) => {
  event.preventDefault();
  const data = event.dataTransfer.getData("text/plain");
  const draggedElement = document.getElementById(data);
  const rect=droppableArea.getBoundingClientRect();
  const offsetX = event.clientX - rect.left;
  const offsetY = event.clientY - rect.top;
  const dropX = offsetX - draggedElement.offsetWidth / 2;
  const dropY = offsetY - draggedElement.offsetHeight / 2;
  draggedElement.style.position = "absolute";
  draggedElement.style.left = dropX + "px";
  draggedElement.style.top = dropY + "px";
  droppableArea.appendChild(draggedElement);
});


