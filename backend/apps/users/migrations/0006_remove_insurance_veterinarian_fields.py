from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_profile_extensions'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='insurance_company',
        ),
        migrations.RemoveField(
            model_name='user',
            name='insurance_policy_number',
        ),
        migrations.RemoveField(
            model_name='user',
            name='veterinarian_contact',
        ),
    ]