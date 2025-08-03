from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_fix_unit_number_length'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='property_type',
            field=models.CharField(
                blank=True,
                choices=[
                    ('townhouse', 'Townhouse'),
                    ('single_attached', 'Single Attached')
                ],
                max_length=20
            ),
        ),
    ]