/**
 * to bg
 * @param {*} request 
 * @returns 
 */
async function sendMessageToBackground(request){
  /**
   *  request :
   *  task: ""
   *  content:{
   *  ...
   *  }
   */
  try{
    chrome.runtime.sendMessage({message: request},  response => {
      return true;
    });
  }catch(e){
    console.error(e)
    return false;
  }
}

//from bg
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  switch (message.message.task) {
    case "returnAnswer":
        setAnswer(message.message.content);
      break;
    default:
      break;
  }
});

function checkForElement() {
  const element = document.querySelector(".question-title__Title-sc-1aryxsk-1");
  if (element) {
    console.log("Элемент с классом question-title__Title-sc-1aryxsk-1 найден.");
    checkQuestion(element.textContent)
  } else {
    console.log("Элемент с классом question-title__Title-sc-1aryxsk-1 не найден.");
  }
}

setInterval(checkForElement, 1000);

let prevQuestion = "";
let curentQuestion = "";

async function checkQuestion(question) {
  curentQuestion = question;
  if(prevQuestion === curentQuestion){
    return
  }
  prevQuestion = question

  console.log("Вопрос гпт - " + question);

  const buttons = await getButtons();
  const answersText = await getButtonsText(buttons);

  console.log("варианты ответа: " + answersText)

  await sendMessageToBackground(requst = {
    task: "askGPT",
    content: {
      question: `${question}`,
      answerArray: answersText
    }
  })
}

async function getButtons(){
  const container = document.querySelector(".quiz-choices__Container-sc-1pqrjlc-0");

  if (container) {
    const buttons = container.querySelectorAll("button");

    return buttons
  } else {
    //
  }
}

async function getButtonsText(buttons){
  let answerArray = []
    buttons.forEach(function (button) {
      const buttonText = button.querySelector(".choice__ChoiceText-sc-cdnosb-5 .break-long-words__WordBreak-sc-1lrtogi-0").textContent;
      //console.log("Текст кнопки:", buttonText);
      answerArray.push(buttonText)
    });
    return answerArray
}

async function setAnswer(content){
  const buttons = await getButtons();
  buttons[content.answer - 1].click();
}

function createPopup() {
  var topBar = document.createElement("div");
  topBar.className = "TopBarGPT"
  topBar.style.backgroundColor = "#e8d5d8";
  topBar.style.zIndex = "2313"
  topBar.style.color = "#230e0e";
  topBar.style.position = "fixed";
  topBar.style.top = "10%";
  topBar.style.left = "0";
  topBar.style.width = "auto";
  topBar.style.left = "50%";
  topBar.style.transform = "translateX(-50%)"; 
  topBar.style.padding = "10px";
  topBar.style.display = "flex"; 
  topBar.style.alignItems = "center"; 
  topBar.style.textAlign = "center";
  topBar.style.borderRadius = "20px";

  var logo = document.createElement("img");
  logo.src = "https://media.discordapp.net/attachments/1090536840211214386/1171276756435599481/mylogo.png?ex=655c177c&is=6549a27c&hm=2692fe8672daf8953dcd01e7001dae86ff65334f86703c47cc2dbd0d7999d988&="; // Укажите путь к изображению вашего логотипа
  logo.style.height = "20px"; 
  logo.style.marginRight = "10px";
  
  var text = document.createElement("span");
  text.innerText = "Chatgpt Mode";
  text.style.fontWeight = "bold";

  topBar.appendChild(logo);
  topBar.appendChild(text);
  
  document.body.appendChild(topBar);

  const elements = document.querySelectorAll(".TopBarGPT");

  elements.forEach((element) => {
    element.addEventListener("click", function () {
      window.open("https://youtu.be/x1UsJ2Znjk0?si=I02znPl_54itUznw&t=15", "_blank");
    });
  });
}
createPopup();

