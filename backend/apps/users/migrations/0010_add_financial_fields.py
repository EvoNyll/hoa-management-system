# Generated manually

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0009_user_backup_codes_user_totp_secret'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='billing_address',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='user',
            name='billing_address_different',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='user',
            name='preferred_payment_method',
            field=models.CharField(blank=True, choices=[('payment_wallet', 'Payment Wallet'), ('qr_code', 'InstaPay QR Code')], default='payment_wallet', max_length=20),
        ),
        migrations.AddField(
            model_name='user',
            name='wallet_account_name',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name='user',
            name='wallet_account_number',
            field=models.CharField(blank=True, max_length=20),
        ),
        migrations.AddField(
            model_name='user',
            name='wallet_provider',
            field=models.CharField(blank=True, choices=[('gcash', 'GCash'), ('maya', 'Maya')], default='gcash', max_length=10),
        ),
    ]