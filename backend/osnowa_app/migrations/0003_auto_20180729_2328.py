# Generated by Django 2.0.7 on 2018-07-29 21:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('osnowa_app', '0002_auto_20180729_2316'),
    ]

    operations = [
        migrations.AlterField(
            model_name='point',
            name='hAmsterdam',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='point',
            name='hKronsztadt',
            field=models.FloatField(blank=True, null=True),
        ),
    ]
