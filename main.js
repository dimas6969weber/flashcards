let deck = JSON.parse(localStorage.getItem("flashcards-deck") || "[]");
let curId = 1;
let currentIndex = 0;
let showFront = true;

function saveDeck() {
    localStorage.setItem("flashcards-deck", JSON.stringify(deck));
}

setInterval(saveDeck, 5000);


function addCard() {
    const frontInput = document.getElementById("frontInput");
    const backInput = document.getElementById("backInput");

    const front = frontInput.value.trim();
    const back = backInput.value.trim();

    if (!front || !back) {
      alert("Заполните оба поля");
      return;
    }

    const newCard = {
      id: cuRid++,
      front: front,
      back: back,
      learned: false
    };

    deck.push(newCard);

    frontInput.value = "";
    backInput.value = "";

    renderTable();
    renderStudyCard();
}


function deleteCard(id) {
    deck = deck.filter(card => card.id !== id);

    if (currentIndex >= getStudyDeck().length) {
      currentIndex = Math.max(0, getStudyDeck().length - 1);
    }

    renderTable();
    renderStudyCard();
}


function editCard(id) {
    const card = deck.find(card => card.id === id);

    document.getElementById("frontInput").value = card.front;
    document.getElementById("backInput").value = card.back;

    deleteCard(id);
}


function toggleLearned(id) {
    const card = deck.find(card => card.id === id);

    card.learned = !card.learned;

    renderTable();
    renderStudyCard();
}


function renderTable() {
    const table = document.getElementById("cardsTable");

    table.innerHTML = "";

    deck.forEach(card => {
      table.innerHTML += `
        <tr>
          <td>${card.front}</td>
          <td>${card.back}</td>

          <td>
            <label>
              <input
                type="checkbox"
                ${card.learned ? "checked" : ""}
                onchange="toggleLearned(${card.id})"
              >
              Выучена
            </label>
          </td>

          <td>
            <button
              class="small-btn"
              onclick="editCard(${card.id})"
            >
              Редактировать
            </button>

            <button
              class="small-btn"
              onclick="deleteCard(${card.id})"
            >
              Удалить
            </button>
          </td>
        </tr>
      `;
    });
}


function getStudyDeck() {
    const mode = document.getElementById("modeSelect").value;

    if (mode === "unlearned") {
      return deck.filter(card => !card.learned);
    }

    return deck;
}


function renderStudyCard() {
    const studyDeck = getStudyDeck();
    const studyCard = document.getElementById("studyCard");
    const positionText = document.getElementById("positionText");

    if (studyDeck.length === 0) {
      studyCard.textContent = "Нет карточек";
      positionText.textContent = "";
      return;
    }

    if (currentIndex >= studyDeck.length) {
      currentIndex = 0;
    }

    const card = studyDeck[currentIndex];

    if (showFront) {
      studyCard.textContent = card.front;
    } else {
      studyCard.textContent = card.back;
    }
}


function flipCard() {
    if (getStudyDeck().length === 0) return;

    showFront = !showFront;
    renderStudyCard();
}


function nextCard() {
    const studyDeck = getStudyDeck();

    if (currentIndex < studyDeck.length - 1) {
      currentIndex++;
      showFront = true;
      renderStudyCard();
    }
}


function prevCard() {
    if (currentIndex > 0) {
      currentIndex--;
      showFront = true;
      renderStudyCard();
    }
}


function shuffleCards() {
    deck.sort(() => Math.random() - 0.5);

    currentIndex = 0;
    showFront = true;

    renderTable();
    renderStudyCard();
}


renderTable();
renderStudyCard();