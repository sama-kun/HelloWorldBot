const TelegramApi = require('node-telegram-bot-api')
const {game_opts,again_game_opts} = require('./options')

const token = '5160280407:AAFqhdVz0rYK3Le3VWL64pe5TASRJCJgFA4'

const bot = new TelegramApi(token,{polling:true})

const chats = {}

const startGame = async (chatId) =>{
    const random = Math.floor(Math.random()*10)
    chats[chatId] = random
    await bot.sendMessage(chatId, 'Отгадовай',game_opts)
}



const start = ()=>{
    bot.setMyCommands([
        {command: '/start', description:'Начальное привествие'},
        {command: '/info', description:'Информация о пользвателе'},
        {command: '/game', description: 'Игра \'Угадай цифр\''}
    ])

    bot.on('message', async msg=>{
        console.log(msg)
        const text = msg.text
        const chatId = msg.chat.id

        if(text === '/start'){
            await bot.sendSticker(chatId , 'https://tgram.ru/wiki/stickers/img/hackerwomanParadisecurity/png/1.png')
            return  bot.sendMessage(chatId, 'Добро пожаловать на мой ТелеграмБот!!!\nЗдесь ты можешь найти уроки быстро и удобно. Удачи бро!!!')
        }
        if(text === '/info'){
            return bot.sendMessage(chatId, `Твое имя ${msg.from.first_name}`)
        }
        if(text === '/game'){
            return startGame(chatId)
        }
    })
    bot.on('callback_query', async msg => {
        const chatId = msg.message.chat.id
        const data = msg.data
        if(data === '/again')
            startGame(chatId)
        if(data === chats[chatId])
            await bot.sendMessage(chatId, `Угадал цифра ${data}`,again_game_opts)
        else return bot.sendMessage(chatId,`не угадал цифра ${chats[chatId]}`,again_game_opts)
        console.log(msg)
    })
}
start()
