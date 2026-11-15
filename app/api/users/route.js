import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Путь к файлу users.json в папке data в корне проекта
const filePath = path.join(process.cwd(), 'data', 'users.json');

// GET-запрос: сервер отдает актуальный список пользователей из файла
export async function GET() {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return NextResponse.json(JSON.parse(data));
    } catch (error) {
        // Если файла еще нет, возвращаем дефолтного админа
        const defaultUser = [{
            id: "usr_001",
            name: "Главный Администратор",
            email: "admin@smarthome.local",
            password: "admin",
            role: "admin",
            device: "iPhone 15 Pro"
        }];
        return NextResponse.json(defaultUser);
    }
}

// POST-запрос: сервер перезаписывает файл новыми данными (при добавлении/удалении/редактировании)
export async function POST(request) {
    try {
        const body = await request.json();

        // Записываем обновленный массив пользователей в файл с отступами в 2 пробела для читаемости
        await fs.writeFile(filePath, JSON.stringify(body, null, 2), 'utf8');

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Ошибка записи в users.json:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}