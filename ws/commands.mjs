export default {
    help: {
        admin: false,
        desc: 'Вывод списка команд',
        args: {
            commandName: {
                required: false,
                desc: 'Название команды'
            }
        }
    }, name: {
        admin: false,
        desc: 'Смена имени пользователя',
        args: {
            text: {
                required: true,
                desc: 'Новое имя'
            }
        }
    }, color: {
        admin: false,
        desc: 'Смена цвета пользователя',
        args: {
            hex: {
                required: true,
                desc: 'HEX-код нового цвета, напр. #ff00ff'
            }
        }
    }, online: {
        admin: false,
        desc: 'Перечень пользователей, которые сейчас в сети'
    }, chat: {
        admin: false,
        desc: 'Смена волны чата',
        args: {
            frequency: {
                required: true,
                desc: 'Волна чата, целочисленное значение в диапазоне 1-255'
            }
        }
    }
}