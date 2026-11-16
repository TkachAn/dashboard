import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const usersFilePath = path.join(dataDir, 'users.json');
const counterFilePath = path.join(dataDir, 'counter.json');

// GET: отдаем список пользователей
export async function GET() {
    try {
        const data = await fs.readFile(usersFilePath, 'utf8');
        return NextResponse.json(JSON.parse(data));
    } catch (error) {
        const defaultUser = [{
            id: "usr_001",
            name: "Главный Администратор",
            email: "admin@smarthome.local",
            password: "admin",
            role: "admin",
            device: "iPhone 15 Pro"
        }];

        // Автосоздание папки и файлов, если их нет
        await fs.mkdir(dataDir, { recursive: true });
        await fs.writeFile(usersFilePath, JSON.stringify(defaultUser, null, 2), 'utf8');
        await fs.writeFile(counterFilePath, JSON.stringify({ lastId: 1 }, null, 2), 'utf8');

        return NextResponse.json(defaultUser);
    }
}

// POST: добавляем пользователя с автоматическим чтением и обновлением счетчика из counter.json
export async function POST(request) {
    try {
        const newUserWithoutId = await request.json();

        // 1. Читаем текущий счетчик из counter.json
        let counterData = { lastId: 1 };
        try {
            const counterFile = await fs.readFile(counterFilePath, 'utf8');
            counterData = JSON.parse(counterFile);
        } catch (e) {
            // Если файла счетчика нет, создаем с дефолтным значением
            counterData = { lastId: 1 };
        }

        // 2. Увеличиваем ID на 1
        const nextNum = counterData.lastId + 1;
        const newId = `usr_${String(nextNum).padStart(3, '0')}`;

        // Добавляем сгенерированный ID к новому пользователю
        const newUser = {
            id: newId,
            ...newUserWithoutId
        };

        // 3. Читаем текущий список пользователей
        let users = [];
        try {
            const usersFile = await fs.readFile(usersFilePath, 'utf8');
            users = JSON.parse(usersFile);
        } catch (e) {
            users = [];
        }

        // Добавляем нового пользователя в массив
        users.push(newUser);

        // 4. Записываем обновленный список пользователей обратно в users.json
        await fs.mkdir(dataDir, { recursive: true });
        await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), 'utf8');

        // 5. Сохраняем новый актуальный счетчик в counter.json
        await fs.writeFile(counterFilePath, JSON.stringify({ lastId: nextNum }, null, 2), 'utf8');

        return NextResponse.json({ success: true, newUser });
    } catch (error) {
        console.error("Ошибка при добавлении пользователя:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}