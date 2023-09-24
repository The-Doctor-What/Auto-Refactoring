import fs from "fs";
import 'dotenv/config.js'

async function teleport(extensions: string[], path: string, file: any) {
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

        await teleport(['.jpg', '.png', '.jpeg', '.gif', '.svg'], 'images', file)
        await teleport(['.mp4', '.avi', '.mov'], 'videos', file)
        await teleport(['.mp3', '.wav', '.ogg'], 'audios', file)
        await teleport(['.doc', '.docx', '.txt', '.pdf', '.xls', '.xlsx', '.ppt', '.pptx', '.odt'], 'documents', file)
        await teleport(['.zip', '.rar', '.7z', '.tar'], 'archives', file)
        await teleport(['.exe', '.msi', '.app'], 'programs', file)
        await teleport(['.torrent', '.ac3'], 'torrents', file)

    }

    console.log(`Logs » Завершение работы...`)
}

main().then()