# Generated by Django 2.0.7 on 2018-10-03 12:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('osnowa_app', '0005_auto_20181003_1331'),
    ]

    operations = [
        migrations.AlterField(
            model_name='point',
            name='image',
            field=models.ImageField(blank=True, upload_to='media'),
        ),
    ]
