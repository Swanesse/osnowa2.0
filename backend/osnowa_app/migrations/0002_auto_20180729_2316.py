# Generated by Django 2.0.7 on 2018-07-29 21:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('osnowa_app', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='point',
            name='found',
            field=models.BooleanField(default=False),
        ),
    ]