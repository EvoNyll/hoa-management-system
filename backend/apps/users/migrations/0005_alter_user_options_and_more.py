from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_update_property_type_choices'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='user',
            options={'verbose_name': 'User', 'verbose_name_plural': 'Users'},
        ),
        migrations.RemoveConstraint(
            model_name='householdmember',
            name='unique_household_member_per_user',
        ),
        migrations.RemoveConstraint(
            model_name='vehicle',
            name='unique_vehicle_per_user',
        ),
        migrations.RemoveField(
            model_name='user',
            name='auto_pay_enabled',
        ),
        migrations.RemoveField(
            model_name='user',
            name='billing_address',
        ),
        migrations.RemoveField(
            model_name='user',
            name='billing_address_different',
        ),
        migrations.RemoveField(
            model_name='user',
            name='notification_preferences',
        ),
        migrations.RemoveField(
            model_name='user',
            name='preferred_payment_method',
        ),
        migrations.RemoveField(
            model_name='user',
            name='security_answer_hash',
        ),
        migrations.RemoveField(
            model_name='user',
            name='theme_preference',
        ),
        migrations.AddField(
            model_name='user',
            name='account_locked_until',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='event_reminders',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='user',
            name='failed_login_attempts',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='user',
            name='last_password_change',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
        migrations.AddField(
            model_name='user',
            name='maintenance_alerts',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='user',
            name='newsletter_subscription',
            field=models.BooleanField(default=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='is_directory_visible',
            field=models.BooleanField(default=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='profile_visibility',
            field=models.CharField(choices=[('public', 'Public'), ('residents_only', 'Residents Only'), ('private', 'Private')], default='residents_only', max_length=20),
        ),
        migrations.AlterUniqueTogether(
            name='householdmember',
            unique_together={('user', 'full_name')},
        ),
        migrations.AlterUniqueTogether(
            name='vehicle',
            unique_together={('license_plate', 'user')},
        ),
    ]
