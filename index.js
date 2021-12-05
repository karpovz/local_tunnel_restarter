const localtunnel = require('localtunnel');
const TelegramBot = require('node-telegram-bot-api')

const token = '<YOUR TOKEN>'
const chatId = "YOU CHAT ID";

const bot = new TelegramBot(token, { polling: true })

let tunnels_list = {};

async function create_tunnel(port) {
    const tunnel = await localtunnel({ port: Number(port) });

    tunnels_list[port] = tunnel.url

    bot.sendMessage(chatId, "Создан новый тунель на порту " + port + ".\n Доступен по адресу: " + tunnel.url )

    tunnel.on('close', () => {
        delete tunnels_list[port]
        bot.sendMessage(chatId, "Туннель на порту " + port + "закрыт.")
    });
      
}

bot.onText(/\/start/, (msg) => {
	bot.sendMessage(msg.chat.id, "Hello world")
})

bot.onText(/\/create (.+)/, (match) => {
    const port = match.text.split(' ')[1]

    if (parseInt(port)) {
        if (!tunnels_list.hasOwnProperty(port)) {
            create_tunnel(port)
        } else {
            bot.sendMessage(chatId, "Такой туннель уже существует.")
        }
    } else {
        bot.sendMessage(chatId, "Некорректный ввод.")
    }
})

bot.onText(/\/list/, () => {
    let list_tunnel_string = ''

    if (tunnels_list !== {}) {
        Object.keys(tunnels_list).forEach(tunnel => {
            list_tunnel_string += tunnel + ":" + tunnels_list[tunnel] + '\n'
        })
    } else {
        list_tunnel_string = "Список пуст."
    }
	bot.sendMessage(chatId, list_tunnel_string)
})


