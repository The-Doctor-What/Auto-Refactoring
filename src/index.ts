import moment from "moment";
import fs from "fs";
import 'dotenv/config.js'

moment.locale("ru");

async function teleport(extensions, path, file) {
    const folder = process.env.FOLDER
    for (const extension of extensions) {
        if (file.endsWith(extension)) {
            if (!fs.existsSync(`${folder}/${path}`)) fs.mkdirSync(`${folder}/${path}`)
            fs.renameSync(`${folder}/${file}`, `${folder}/${path}/${file}`)
            console.log(`Logs » Файл "${file}" перемещен в папку ${path}`)
        }
    }
}

async function main() {
    console.log(`Logs » Запуск проекта...`)

    const path = process.env.FOLDER
    if (!path) return console.log(`Logs » Путь не указан`)
    console.log(`Logs » Путь: ${path}`)

    const fs = require('fs')
    const files = fs.readdirSync(path)
    if (!files) return console.log(`Logs » Файлы не найдены`)

    for (const file of files) {

        await teleport(['.jpg', '.png', '.jpeg', '.gif', '.svg'], 'images', file).then()
        await teleport(['.mp4'], 'videos', file).then()
        await teleport(['.mp3'], 'audios', file).then()
        await teleport(['.doc', '.docx', '.txt', '.pdf', '.xls', '.xlsx', '.ppt', '.pptx'], 'documents', file).then()
        await teleport(['.zip', '.rar', '.7z'], 'archives', file).then()
        await teleport(['.exe', '.msi'], 'programs', file).then()
        await teleport(['.torrent'], 'torrents', file).then()

    }

    console.log(`Logs » Завершение работы...`)
}

main().then()