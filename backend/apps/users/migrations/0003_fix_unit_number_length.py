# backend/apps/users/migrations/0003_fix_unit_number_length.py

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_profile_extensions'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='unit_number',
            field=models.CharField(max_length=50, blank=True),
        ),
    ]