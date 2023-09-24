import fs from "fs"
import 'dotenv/config.js'
import * as readline from "readline";

async function teleport(extensions: any, path: any, folder: any, file: any) {
    try {
        for (const extension of extensions) {
            if (file.endsWith(extension)) {
                const folderPath = `${path}/${folder}`
                if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, {recursive: true})
                fs.renameSync(`${path}/${file}`, `${folderPath}/${file}`)
                console.log(`Logs » Файл "${file}" перемещен в папку ${folder}`)
            }
        }
    } catch (error) {
        console.error(`Logs » Ошибка при перемещении файла "${file}": ${error.message}`)
    }
}

async function main() {
    try {
        console.log(`Logs » Запуск проекта...`);

        const configFileName = "config.json";
        const configFilePath = `./${configFileName}`;
        if (!fs.existsSync(configFilePath)) return console.log(`Logs » Файл конфигурации не найден`);

        const extensionsToCategories = JSON.parse(fs.readFileSync(configFilePath, "utf8"));
        if (!extensionsToCategories) return console.log(`Logs » Не удалось прочитать файл конфигурации`);

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        console.log(`Logs » Введите путь к папке, в которой необходимо переместить файлы`);
        console.log(`Logs » Пример: C:\\Users\\Mary\\Desktop\\folder`);

        rl.question("\n> ", async (path: any) => {
            rl.close();

            if (!path) return console.log(`Logs » Путь не указан`);
            if (!fs.existsSync(path)) return console.log(`Logs » Папка не найдена`);
            console.log(`Logs » Путь: ${path}`);

            const files = fs.readdirSync(path);
            if (!files || files.length === 0) return console.log(`Logs » Файлы не найдены`);

            for (const file of files) {
                for (const [category, extensions] of Object.entries(extensionsToCategories)) {
                    await teleport(extensions, path, category, file);
                }
            }

            console.log(`Logs » Завершение работы...`);
        });
    } catch (error) {
        console.error(`Logs » Критическая ошибка: ${error.message}`);
    }
}

main().then();