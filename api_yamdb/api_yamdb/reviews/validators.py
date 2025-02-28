from django.core.exceptions import ValidationError
from django.utils import timezone


def validate_username(value):
    if value.lower() == 'me':
        raise ValidationError(
            ('Имя пользователя не может быть me'),
            params={'value': value},
        )


def validate_year(value):
    if value > timezone.now().year:
        raise ValidationError(
            ('Год %(value)s больше текущего!'),
        )
    if value < 1000:
        raise ValidationError(
            ('Год % (value)s меньше того периода,'
             ' в котором появились первые летописи на Руси!'),
        )
