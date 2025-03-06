# YamDB

## Описание

Сервис YaMDb — база отзывов о фильмах, книгах и музыке.

## Функционал

**Произведения, к которым пишут отзывы**: получить список всех объектов, создать произведение для отзывов, информация об объекте, обновить информацию об объекте, удалить произведение.

**Категории произведений**: получить список всех категорий, создать категорию, удалить категорию.

**Категории жанров**: получить список всех жанров, создать жанр, удалить жанр.

**Отзывы**: получить список всех отзывов, создать новый отзыв, получить отзыв по id, частично обновить отзыв по id, удалить отзыв по id.

**Комментарии к отзывам**: получить список всех комментариев к отзыву по id, создать новый комментарий для отзыва, получить комментарий для отзыва по id, частично обновить комментарий к отзыву по id, удалить комментарий к отзыву по id.

**Пользователи**: получить список всех пользователей, создание пользователя, получить пользователя по username, изменить данные пользователя по username, удалить пользователя по username, получить данные своей учетной записи, изменить данные своей учетной записи.

**JWT-токен**: отправить confirmation_code на переданный email, получение JWT-токена в обмен на email и confirmation_code.

## Запуск проекта локально в контейнерах

Создать корневую папку с проектом (предлагается "yamdb") и перейти в неё

```
mkdir yamdb
cd yamdb
```

Клонировать репозиторий:

```
git clone https://github.com/VictorTsyganov/yamdb.git
```

Перейти в папку api_yamdb

```
cd api_yamdb/api_yamdb/api_yamdb/
```

Создать файл переменных окружения из примера

```
cp .env.example .env
```

Изменить переменные окружения (если необходимо)
```
(на примере редактора Nano)
nano .env
```

Перейти в папку react-vite-yamdb
```
cd ../../../react-vite-yamdb/
```

Создать файл переменных окружения из примера

```
cp .env.example .env
```

Изменить переменные окружения (если необходимо)
```
(на примере редактора Nano)
nano .env
```

Перейти в папку infra
```
cd ../infra/
```

Запустить Docker (убедитесь, что docker daemon запущен в системе!)

```
docker-compose up --build
```

## Работа с сайтом

По умолчанию проект доступен на localhost:80

```
http://localhost:80/
```
**Документация для YaMDb**:

http://localhost:80/redoc/ 

## Запуск backend без docker контейнеров

1. Перейти в папку с проектом:

   ```python
   cd api_yamdb/
   ```

2. Установить виртуальное окружение для проекта:

   ```python
   py -3.9 -m venv venv
   ```

3. Активировать виртуальное окружение для проекта:

   ```python
   # для OS Lunix и MacOS
   source venv/bin/activate
   # для OS Windows
   source venv/Scripts/activate
   ```

4. Установить зависимости:

   ```python
   python -m pip install --upgrade pip
   pip install -r requirements.txt
   ```

5. Выполнить миграции на уровне проекта:

   ```python
   cd api_yamdb/
   python manage.py makemigrations
   python manage.py migrate
   ```

6. Заполнить базу данных и запустить проект:

   ```python
   python manage.py uploader
   python manage.py runserver
   ```

## Ресурсы

```python
# Документаия проекта
http://127.0.0.1:8000/redoc/
```

## Запуск frontend без docker контейнеров

1. Перейти в папку с проектом:

   ```
   cd react-vite-yamdb/
   ```

2. Установить зависимости:

   ```
   npm i
   ```

3. Запустить проект:

   ```
   npm run dev
   ```