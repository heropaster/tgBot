const tgApi = require('node-telegram-bot-api')

const token = '********';

const bot = new tgApi(token, {polling:true})

let taxiText = 'taxi';
let insuranceText = 'insurance';
let workText = 'work';
//NEEDED WORDS
const insurance = [
    'страховка', 'страховку', 'страховки', 'страховкой', 'страховок', 'страховкой', 'страховками', 'стравках',
    'страховке', 'страховкой'
];
const work = [
    'работ', 'работу', 'работы', 'работой', 'работами', 'работе'
];
const taxi = [
    'такси',
]

//Оболочка
const start = () => {
    //Команды
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        const user = msg.chat.username;
        const userId = msg.from.id;
        const reply = {
            reply_markup: JSON.stringify(
                {
                    force_reply:true
                }
            )
        }
        console.log(msg);
        if (!text) {
            return
        }
        bot.setMyCommands([
            {command:'/changetaxitext', description:'Изменить текст такси-триггера'},
            {command:'/changeworktext', description:'Изменить текст работа-триггера'},
            {command:'/changeinsurancetext', description:'Изменить текст страховка-триггера'},
            {command:'/addtaxi', description:'Добавить новый триггер(такси)'},
            {command:'/addwork', description:'Добавить новый триггер(работа)'},
            {command:'/addinsurance', description:'Добавить новый триггер(страховка)'}
        ])

        if (taxi.some((element) => text.toLowerCase().includes(element)) && !msg.reply_to_message) {
            return bot.sendMessage(chatId, taxiText, {parse_mode:"HTML"})
        };
        const findUrl = () => {
            let offset = msg.entities[0].offset;
            let length = msg.entities[0].length;
            let link = msg.entities[0].url;
            
            let word = text.slice(offset, offset + length);

            let resultWord = text.split(word).join(`<a href='${link}'>` + word + `</a>`)
            return resultWord
        }
        const findEntities = () => {
            const links = [];
            const bolds = [];
            const italics = [];
            const underlines = [];
            const strikethroughs = [];
            const codes = [];
            const spoilers = [];

            // let resultWord = ''
            let currentText = text;
            //add entities
            for (let item of msg.entities) {
                if (item.type === 'text_link') {
                    links.push(item);
                }else if (item.type === 'bold') {
                    bolds.push(item);
                }else if (item.type === 'italic') {
                    italics.push(item);
                }else if (item.type === 'underline') {
                    underlines.push(item);
                }else if (item.type === 'strikethrough') {
                    strikethroughs.push(item);
                }else if (item.type === 'code') {
                    codes.push(item);
                }else if (item.type === 'spoiler') {
                    spoilers.push(item);
                }
            }

            for (let item of links) {
                let offset = item.offset;
                let length = item.length;
                let link = item.url;
                
                let word = text.slice(offset, offset + length);

                currentText = currentText.replace(word, `<a href="${link}">` + word + `</a>`);
                // bot.sendMessage(chatId, currentText, {parse_mode: "HTML"});
            };
            for (let item of bolds) {
                let offset = item.offset;
                let length = item.length;
                
                let word = text.slice(offset, offset + length);

                currentText = currentText.replace(word, `<strong>` + word + `</strong>`);
                // bot.sendMessage(chatId, currentText, {parse_mode: "HTML"});
            };
            for (let item of italics) {
                let offset = item.offset;
                let length = item.length;
                
                let word = text.slice(offset, offset + length);

                currentText = currentText.replace(word, `<i>` + word + `</i>`);
                // bot.sendMessage(chatId, currentText, {parse_mode: "HTML"});
            };
            for (let item of underlines) {
                let offset = item.offset;
                let length = item.length;
                
                let word = text.slice(offset, offset + length);

                currentText = currentText.replace(word, `<u>` + word + `</u>`);
            };
            for (let item of strikethroughs) {
                let offset = item.offset;
                let length = item.length;
                
                let word = text.slice(offset, offset + length);

                currentText = currentText.replace(word, `<s>` + word + `</s>`);
            };
            for (let item of codes) {
                let offset = item.offset;
                let length = item.length;
                
                let word = text.slice(offset, offset + length);

                currentText = currentText.replace(word, `<code>` + word + `</code>`);
            };
            for (let item of spoilers) {
                let offset = item.offset;
                let length = item.length;
                
                let word = text.slice(offset, offset + length);

                currentText = currentText.replace(word, `<tg-spoiler>` + word + `</tg-spoiler>`);
                // bot.sendMessage(chatId, currentText, {parse_mode: "HTML"});
            };
            return currentText
        }
            if (text.toLowerCase() === '/changetaxitext') {
                return bot.sendMessage(chatId, 'Введите новый текст(такси)', reply)
            }
                if(msg.reply_to_message !== undefined && msg.reply_to_message.text === 'Введите новый текст(такси)') {
                    taxiText = text;
                    if (msg.entities) {
                        taxiText = findEntities();

                        return bot.sendMessage(chatId, 'Текст изменен')
                    }
                    else  return bot.sendMessage(chatId, 'Текст изменен')
                    
                }
        
        if (insurance.some((element) => text.toLowerCase().includes(element)) && !msg.reply_to_message) {
            return bot.sendMessage(chatId, insuranceText, {parse_mode:"HTML"})
        };
            if (text.toLowerCase() === '/changeinsurancetext') {
                return bot.sendMessage(chatId, 'Введите новый текст(страховка)', reply)
            }
                if(msg.reply_to_message !== undefined && msg.reply_to_message.text === 'Введите новый текст(страховка)') {
                    insuranceText = text;
                    if (msg.entities) {
                        insuranceText = findUrl();
                        return bot.sendMessage(chatId, 'Текст изменен')
                    }
                    else return bot.sendMessage(chatId, 'Текст изменен');
                    
                }
        
        if (work.some((element) => text.toLowerCase().includes(element)) && !text.toLowerCase().includes('работал') && !text.toLowerCase().includes('работаю') && !text.toLowerCase().includes('работая') && !text.includes('работат') && !text.includes('работае') && !msg.reply_to_message) {
            return bot.sendMessage(chatId, workText, {parse_mode:"HTML"})
        };
            if (text.toLowerCase() === '/changeworktext') {
                return bot.sendMessage(chatId, 'Введите новый текст(работа)', reply)
            }
                if(msg.reply_to_message !== undefined && msg.reply_to_message.text === 'Введите новый текст(работа)') {
                    workText = text;
                    if (msg.entities) {
                        workText = findUrl();
                        return bot.sendMessage(chatId, 'Текст изменен')
                    }
                    else return bot.sendMessage(chatId, 'Текст изменен');
                }
        //taxiWords
        if (text.toLowerCase() === '/addtaxi') {
            return bot.sendMessage(chatId, 'Введите слово, которое хотите добавить(такси)', reply)
        }
            if(msg.reply_to_message !== undefined && msg.reply_to_message.text === 'Введите слово, которое хотите добавить(такси)') {
                bot.sendMessage(chatId, 'Текст изменен');
                taxi.push(text);
            }
        //workWords    
        if (text.toLowerCase() === '/addwork') {
            return bot.sendMessage(chatId, 'Введите слово, которое хотите добавить(работа)', reply)
        }
            if(msg.reply_to_message !== undefined && msg.reply_to_message.text === 'Введите слово, которое хотите добавить(работа)') {
                bot.sendMessage(chatId, 'Текст изменен');
                work.push(text);
            }
        //insuranceWords
        if (text.toLowerCase() === '/addinsurance') {
            return bot.sendMessage(chatId, 'Введите слово, которое хотите добавить(страховка)', reply)
        }
            if(msg.reply_to_message !== undefined && msg.reply_to_message.text === 'Введите слово, которое хотите добавить(страховка)') {
                bot.sendMessage(chatId, 'Текст изменен');
                insurance.push(text);
            }
            
    })
    
}
start()
