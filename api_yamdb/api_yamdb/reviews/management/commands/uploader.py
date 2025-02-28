import csv
import sqlite3
from django.conf import settings
from django.core.management.base import BaseCommand

from reviews.models import (Category, Comment, Genre, GenreTitle, Review,
                            Title, User)


class Command(BaseCommand):
    FILES_DATA = {
        'category.csv': 'reviews_category',
        'comments.csv': 'reviews_comment',
        'genre_title.csv': 'reviews_genretitle',
        'genre.csv': 'reviews_genre',
        'review.csv': 'reviews_review',
        'titles.csv': 'reviews_title',
        'users.csv': 'reviews_user'
    }

    help = 'Удаление/запись данных из csv в базу данных.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete-existing',
            action='store_true',
            dest='delete_existing',
            default=False,
            help='Удаление/запись данных из csv в базу данных.',
        )

    def handle(self, *args, **options):
        if options["delete_existing"]:
            User.objects.all().delete()
            Category.objects.all().delete()
            Genre.objects.all().delete()
            Title.objects.all().delete()
            GenreTitle.objects.all().delete()
            Review.objects.all().delete()
            Comment.objects.all().delete()
            self.stdout.write(self.style.SUCCESS('БД очищена.'))
        else:
            for file_csv, table_db in self.FILES_DATA.items():
                con = sqlite3.connect('db.sqlite3')
                cur = con.cursor()
                with open(settings.DATA_DIR / file_csv,
                          'r', encoding='utf-8') as file:
                    reader = list(csv.reader(file))
                    header = tuple(reader[0])
                    for j in range(1, len(reader)):
                        for i in range(len(reader[j])):
                            if reader[j][i].isdigit():
                                reader[j][i] = int(reader[j][i])
                        try:
                            cur.execute(
                                f'INSERT INTO {table_db}{header}'
                                f' VALUES {tuple(reader[j])};')
                        except Exception as err:
                            print(
                                f'Строка {tuple(reader[j])} из файла'
                                f' {file_csv} не была загружена'
                                f' в БД. Ошибка: {err}')
                con.commit()
                con.close()
                print(
                    f'Загрузка данных из файла {file_csv}'
                    f' в таблицу {table_db} завеншена.'
                    ' Данные об ошибках см. выше.')
            print('Загрузка всех данных в базу завершена.')
