import fs from "fs"
import 'dotenv/config.js'
import * as readline from "readline";
import ansi from 'ansi'


const cursor = ansi(process.stdout)

function log(type: string, message: string) {
    const colors = {
        error: "#E32636",
        info: "#003153",
        write: "#FEE75C",
    }

    cursor.bg.hex(colors[type]).write(` ${type.toUpperCase()} `).reset().write(` ${message}\n`)
}

async function teleport(extensions: any, path: any, folder: any, file: any) {
    try {
        for (const extension of extensions) {
            if (file.endsWith(extension)) {
                const folderPath = `${path}/${folder}`
                if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, {recursive: true})
                fs.renameSync(`${path}/${file}`, `${folderPath}/${file}`)
                log("info", `Файл "${file}" перемещен в папку ${folder}`)
            }
        }
    } catch (error) {
        log("error", `Ошибка при перемещении файла "${file}": ${error.message}`)
    }
}

async function main() {
    try {
        log("info", `Запуск...`);
        const configFileName = "config.json";
        const configFilePath = `./${configFileName}`;
        if (!fs.existsSync(configFilePath)) return log("error", `Файл конфигурации не найден`);

        const extensionsToCategories = JSON.parse(fs.readFileSync(configFilePath, "utf8"));
        if (!extensionsToCategories) return log("error", `Не удалось прочитать файл конфигурации`);

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        log("info", `Введите путь к папке, в которой необходимо переместить файлы`);
        log("info", `Пример: C:\\Users\\Mary\\Desktop\\folder`);

        rl.question("\n> ", async (path: any) => {
            rl.close();

            if (!path) return log("error", `Путь не указан`);
            if (!fs.existsSync(path)) return log("error", `Папка не найдена`);

            const files = fs.readdirSync(path);
            if (!files || files.length === 0) return log("error", `Файлы не найдены`);

            for (const file of files) {
                for (const [category, extensions] of Object.entries(extensionsToCategories)) {
                    await teleport(extensions, path, category, file);
                }
            }

            log("info", `Завершение работы...`);
        });
    } catch (error) {
        log("error", `Критическая ошибка: ${error.message}`);
    }
}

main().then();