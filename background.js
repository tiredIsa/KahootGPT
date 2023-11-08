//from page
chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
    switch (request.message.task) {
    case "askGPT":
        askGPT(request.message.content);
        break;
    default:
        break;
    }
});

/**
 * to page
 * @param {*} request 
 * @returns 
 */
async function sendMessage(request){
    /**
     *  request :
     *  task: ""
     *  content:{
     *  ...
     *  }
     */
    try{
        chrome.tabs.query({ url: "https://kahoot.it/gameblock" }, function(tabs) {
            if (tabs.length > 0) {
                const tabId = tabs[0].id;
                chrome.tabs.sendMessage(tabId, { message: request});
            }
        });
    }catch(e){
      console.error(e)
    }
}

/**
 * 
 */
async function askGPT(qustionObject){
    let prompt = `Вопрос: ${qustionObject.question}\n\nВарианты ответа:\n`

    for (let index = 0; index < qustionObject.answerArray.length; index++) {
        prompt += `${index + 1} - ${qustionObject.answerArray[index]}\n`
    }

    console.log(prompt)

    const data = JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: 'system',
                content: 'Ты игрок в kahoot. Тебе будет даваться вопрос и варианты ответов. Ответы даешь в формате "Ответ - *номер ответа*".'
            },
            {
                role: 'user',
                content: prompt
            }
        ]
    });
        
    const url = 'https://neuroapi.host/v1/chat/completions';
    const headers = {
        'Content-Type': 'application/json'
    };
    
    fetch(url, {
        method: 'POST',
        headers: headers,
        body: data
    })
    .then(response => response.json())
    .then(data => {
        let answer = data.choices[0].message.content
        console.log(answer)
        const match = answer.match(/\d+/);

        if (match) {
        const answer = match[0];
        let request = {
            task: "returnAnswer",
            content: {
                answer: answer
            }
        }

        sendMessage(request)

        } else {
            return false;
        }
    })
    .catch(error => {
        console.error(error)
    });
}

