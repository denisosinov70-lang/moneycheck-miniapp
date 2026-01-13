/miniapp
 ├─ index.html
 ├─ style.css
 └─ script.js
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Твой уровень мышления</title>
  <link rel="stylesheet" href="style.css">
  <script src="https://telegram.org/js/telegram-web-app.js"></script>
</head>
<body>

<div id="app">

  <section id="start">
    <h1>Твой уровень мышления и действий</h1>
    <p>15 вопросов. Честно. Без правильных ответов.<br>Результат покажет, где ты сейчас.</p>
    <button onclick="startTest()">Начать тест</button>
  </section>

  <section id="quiz" class="hidden">
    <h2 id="question"></h2>
    <div id="answers"></div>
    <p id="progress"></p>
  </section>

  <section id="result" class="hidden">
    <h2 id="level"></h2>
    <p id="shortResult"></p>
    <button onclick="pay()">Разблокировать полный разбор ⭐ 79</button>
  </section>

  <section id="fullResult" class="hidden">
    <h2 id="fullTitle"></h2>
    <p id="fullText"></p>
  </section>

</div>

<script src="script.js"></script>
</body>
</html>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #0e0e0e;
  color: #fff;
  text-align: center;
}

section {
  padding: 30px;
}

button {
  margin: 10px;
  padding: 14px 22px;
  font-size: 16px;
  border: none;
  background: #ffcc00;
  cursor: pointer;
}

button:hover {
  opacity: 0.9;
}

.hidden {
  display: none;
}

#answers button {
  display: block;
  width: 100%;
  max-width: 400px;
  margin: 10px auto;
}
const tg = window.Telegram.WebApp;
tg.expand();

let currentQuestion = 0;
let score = 0;
let finalLevel = "";

const questions = [
  { q:"Когда понимаешь, что застрял в жизни, ты…", a:[
    {t:"Жду, что всё само поменяется",p:0},
    {t:"Думаю, но откладываю",p:1},
    {t:"Начинаю что-то менять",p:3}
  ]},
  { q:"Деньги для тебя — это…", a:[
    {t:"Постоянный стресс",p:0},
    {t:"Комфорт и безопасность",p:2},
    {t:"Инструмент свободы",p:3}
  ]},
  { q:"Если появляется сложная задача:", a:[
    {t:"Хочу, чтобы решил кто-то другой",p:0},
    {t:"Ищу готовый ответ",p:1},
    {t:"Разбираюсь сам",p:3}
  ]},
  { q:"Как ты относишься к дисциплине?", a:[
    {t:"Ненавижу рамки",p:0},
    {t:"Понимаю, но срываюсь",p:2},
    {t:"Без неё нет роста",p:3}
  ]},
  { q:"Ты чаще думаешь о…", a:[
    {t:"Прошлых ошибках",p:0},
    {t:"Настоящем",p:1},
    {t:"Будущих возможностях",p:3}
  ]},
  { q:"Когда не получается:", a:[
    {t:"Бросаю",p:0},
    {t:"Злюсь, но пробую",p:2},
    {t:"Анализирую и усиливаю",p:3}
  ]},
  { q:"Отношение к риску:", a:[
    {t:"Избегаю",p:0},
    {t:"Иногда иду на риск",p:2},
    {t:"Без риска нет роста",p:3}
  ]},
  { q:"Твоё окружение:", a:[
    {t:"Тянет назад",p:0},
    {t:"Нейтральное",p:1},
    {t:"Развивается и растёт",p:3}
  ]},
  { q:"Если появляется шанс заработать:", a:[
    {t:"Это не для меня",p:0},
    {t:"Сомневаюсь",p:1},
    {t:"Пробую и учусь",p:3}
  ]},
  { q:"Ты больше:", a:[
    {t:"Мечтаешь",p:0},
    {t:"Планируешь",p:2},
    {t:"Делаешь",p:3}
  ]},
  { q:"Когда тебя критикуют:", a:[
    {t:"Закрываюсь",p:0},
    {t:"Фильтрую",p:2},
    {t:"Использую для роста",p:3}
  ]},
  { q:"Отношение ко времени:", a:[
    {t:"Его всегда не хватает",p:0},
    {t:"Иногда контролирую",p:1},
    {t:"Я управляю временем",p:3}
  ]},
  { q:"Ответственность — это…", a:[
    {t:"Чужая проблема",p:0},
    {t:"Иногда моя",p:2},
    {t:"Моя зона контроля",p:3}
  ]},
  { q:"Когда видишь успешных:", a:[
    {t:"Раздражает",p:0},
    {t:"Интересно",p:1},
    {t:"Анализирую и учусь",p:3}
  ]},
  { q:"Развитие для тебя:", a:[
    {t:"Модное слово",p:0},
    {t:"Полезно",p:2},
    {t:"Обязательная часть жизни",p:3}
  ]}
];

function startTest(){
  document.getElementById("start").classList.add("hidden");
  document.getElementById("quiz").classList.remove("hidden");
  showQuestion();
}

function showQuestion(){
  const q = questions[currentQuestion];
  document.getElementById("question").innerText = q.q;
  document.getElementById("progress").innerText = `Вопрос ${currentQuestion+1} из 15`;

  const answers = document.getElementById("answers");
  answers.innerHTML = "";

  q.a.forEach(ans=>{
    const btn = document.createElement("button");
    btn.innerText = ans.t;
    btn.onclick = ()=>answer(ans.p);
    answers.appendChild(btn);
  });
}

function answer(points){
  score += points;
  currentQuestion++;
  if(currentQuestion < questions.length){
    showQuestion();
  } else {
    showResult();
  }
}

function showResult(){
  document.getElementById("quiz").classList.add("hidden");
  document.getElementById("result").classList.remove("hidden");

  let title, text;

  if(score < 20){
    finalLevel = "Новичок";
    title = "Ты на старте";
    text = "Ты живёшь больше реакциями, чем решениями. Сейчас главный рост — взять ответственность и начать действовать.";
  } else if(score < 35){
    finalLevel = "Средний";
    title = "Ты на перепутье";
    text = "Ты многое понимаешь, но часто тормозишь себя. Дисциплина — твой ключ к следующему уровню.";
  } else {
    finalLevel = "Продвинутый";
    title = "Ты выше среднего";
    text = "Ты думаешь и действуешь осознанно. Твоя задача — масштаб и влияние.";
  }

  document.getElementById("level").innerText = title;
  document.getElementById("shortResult").innerText = text;
}

function pay(){
  tg.openInvoice({
    title: "Полный разбор личности",
    description: "Детальный анализ и рекомендации",
    payload: "full_access",
    currency: "XTR",
    prices: [{label:"Доступ",amount:79}]
  });
}

tg.onEvent("invoiceClosed", (data)=>{
  if(data.status === "paid"){
    showFullResult();
  }
});

function showFullResult(){
  document.getElementById("result").classList.add("hidden");
  document.getElementById("fullResult").classList.remove("hidden");

  let text = "";

  if(finalLevel === "Новичок"){
    text = "Ты только входишь в осознанную жизнь. Начни с дисциплины, ответственности и действий без идеальных условий.";
  } else if(finalLevel === "Средний"){
    text = "Ты понимаешь правила игры, но пора перестать откладывать. Системность и доведение до конца выведут тебя выше.";
  } else {
    text = "Ты уже действуешь на уровне выше большинства. Следующий шаг — создавать и влиять на других.";
  }

  document.getElementById("fullTitle").innerText = `Полный разбор — ${finalLevel}`;
  document.getElementById("fullText").innerText = text;
}
