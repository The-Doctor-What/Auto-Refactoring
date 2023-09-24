import fs from "fs";
import 'dotenv/config.js';

async function teleport(extensions: string[], path: string, folder: string, file: string) {
    try {
        for (const extension of extensions) {
            if (file.endsWith(extension)) {
                const folderPath = `${path}/${folder}`;
                if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });
                fs.renameSync(`${path}/${file}`, `${folderPath}/${file}`);
                console.log(`Logs » Файл "${file}" перемещен в папку ${folder}`);
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
        if (!fs.existsSync(path)) return console.log(`Logs » Папка не найдена`);
        console.log(`Logs » Путь: ${path}`);

        const files = fs.readdirSync(path);
        if (!files || files.length === 0) return console.log(`Logs » Файлы не найдены`);

        const extensionsToCategories = {
            images: ['.jpg', '.png', '.jpeg', '.gif', '.svg'],
            videos: ['.mp4', '.avi', '.mov'],
            audios: ['.mp3', '.wav', '.ogg'],
            documents: ['.doc', '.docx', '.txt', '.pdf', '.xls', '.xlsx', '.ppt', '.pptx', '.odt'],
            archives: ['.zip', '.rar', '.7z', '.tar'],
            programs: ['.exe', '.msi', '.msix', '.msixbundle'],
            torrents: ['.torrent', '.ac3'],
            fonts: ['.ttf', '.otf', '.woff', '.woff2'],
            databases: ['.sql', '.db'],
            logs: ['.log', '.logs'],
            scripts: ['.js', '.ts', '.jsx', '.tsx', '.json', '.py', '.php', '.html', '.css', '.scss', '.sass', '.less'],
            samp: ['.asi', '.cs', '.lua', '.sf'],
        };

        for (const file of files) {
            for (const [category, extensions] of Object.entries(extensionsToCategories)) {
                await teleport(extensions, path, category, file);
            }
        }

        console.log(`Logs » Завершение работы...`);
    } catch (error) {
        console.error(`Logs » Критическая ошибка: ${error.message}`);
    }
}

main().then();