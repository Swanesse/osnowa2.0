# Generated by Django 2.0.7 on 2018-10-03 11:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('osnowa_app', '0004_auto_20180930_1247'),
    ]

    operations = [
        migrations.AddField(
            model_name='point',
            name='image',
            field=models.ImageField(blank=True, upload_to='assets'),
        ),
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