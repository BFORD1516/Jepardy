document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "https://rithm-jeopardy.herokuapp.com/api";
  const NUM_CATEGORIES = 6;
  const NUM_QUESTIONS_PER_CATEGORY = 5;
  const DOLLAR_AMOUNTS = [400, 800, 1200, 1600, 2000];

  const categoriesRow = document.getElementById("categories-row");
  const questionsBody = document.getElementById("questions-body");
  const restartButton = document.getElementById("restart-button");

  let categories = [];

  restartButton.addEventListener("click", loadGame);

  async function loadGame() {
    categoriesRow.innerHTML = "";
    questionsBody.innerHTML = "";

    categories = await getCategories(NUM_CATEGORIES);
    categories.forEach(async (category, index) => {
      const categoryCell = document.createElement("th");
      categoryCell.textContent = category.title;
      categoriesRow.appendChild(categoryCell);

      const categoryData = await getCategoryData(category.id);
      const questions = categoryData.clues.slice(0, NUM_QUESTIONS_PER_CATEGORY);

      questions.forEach((question, qIndex) => {
        if (index === 0) {
          const row = document.createElement("tr");
          questionsBody.appendChild(row);
        }

        const questionCell = document.createElement("td");
        questionCell.textContent = `$${DOLLAR_AMOUNTS[qIndex]}`;
        questionCell.dataset.question = question.question;
        questionCell.dataset.answer = question.answer;
        questionCell.dataset.amount = DOLLAR_AMOUNTS[qIndex];
        questionCell.addEventListener("click", handleQuestionClick);
        questionsBody.children[qIndex].appendChild(questionCell);
      });
    });
  }

  function handleQuestionClick(event) {
    const cell = event.target;
    if (cell.textContent.startsWith("$")) {
      cell.textContent = cell.dataset.question;
    } else if (cell.textContent === cell.dataset.question) {
      cell.textContent = cell.dataset.answer;
    }
  }

  async function getCategories(count) {
    const res = await axios.get(`${API_URL}/categories?count=${count}`);
    return res.data;
  }

  async function getCategoryData(id) {
    const res = await axios.get(`${API_URL}/category?id=${id}`);
    return res.data;
  }

  loadGame();
});
