import fs from "fs";
import 'dotenv/config.js'

async function teleport(extensions: string[], path: string, file: any) {
    try {
        const folder = process.env.FOLDER;
        for (const extension of extensions) {
            if (file.endsWith(extension)) {
                if (!fs.existsSync(`${folder}/${path}`)) fs.mkdirSync(`${folder}/${path}`);
                fs.renameSync(`${folder}/${file}`, `${folder}/${path}/${file}`);
                console.log(`Logs » Файл "${file}" перемещен в папку ${path}`);
            }
        }
    } catch (error) {
        console.error(`Logs » Ошибка при перемещении файла "${file}": ${error.message}`);
    }
}

async function main() {
    try {
        console.log(`Logs » Запуск проекта...`);

        const path = process.env.FOLDER;
        if (!path) return console.log(`Logs » Путь не указан`);
        console.log(`Logs » Путь: ${path}`);

        const files = fs.readdirSync(path);
        if (!files) return console.log(`Logs » Файлы не найдены`);

        const extensionsToCategories = {
            images: ['.jpg', '.png', '.jpeg', '.gif', '.svg'],
            videos: ['.mp4', '.avi', '.mov'],
            audios: ['.mp3', '.wav', '.ogg'],
            documents: ['.doc', '.docx', '.txt', '.pdf', '.xls', '.xlsx', '.ppt', '.pptx', '.odt'],
            archives: ['.zip', '.rar', '.7z', '.tar'],
            programs: ['.exe', '.msi', '.app'],
            torrents: ['.torrent', '.ac3'],
        };

        const promises = files.map(async (file) => {
            for (const [category, extensions] of Object.entries(extensionsToCategories)) {
                await teleport(extensions, category, file);
            }
        });

        await Promise.all(promises);

        console.log(`Logs » Завершение работы...`);
    } catch (error) {
        console.error(`Logs » Критическая ошибка: ${error.message}`);
    }
}

main().then();