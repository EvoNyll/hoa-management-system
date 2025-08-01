# File: backend/apps/users/migrations/0002_profile_extensions.py
# Location: backend/apps/users/migrations/0002_profile_extensions.py

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        # Add new fields to User model
        migrations.AddField(
            model_name='user',
            name='profile_photo',
            field=models.ImageField(blank=True, null=True, upload_to='profile_photos/'),
        ),
        migrations.AddField(
            model_name='user',
            name='preferred_contact_method',
            field=models.CharField(choices=[('email', 'Email'), ('phone', 'Phone'), ('sms', 'SMS'), ('app', 'App Notifications')], default='email', max_length=10),
        ),
        migrations.AddField(
            model_name='user',
            name='best_contact_time',
            field=models.CharField(choices=[('morning', 'Morning (6AM-12PM)'), ('afternoon', 'Afternoon (12PM-6PM)'), ('evening', 'Evening (6PM-10PM)'), ('anytime', 'Anytime')], default='anytime', max_length=15),
        ),
        migrations.AddField(
            model_name='user',
            name='language_preference',
            field=models.CharField(default='en', max_length=10),
        ),
        migrations.AddField(
            model_name='user',
            name='timezone_setting',
            field=models.CharField(default='UTC', max_length=50),
        ),
        migrations.AddField(
            model_name='user',
            name='property_type',
            field=models.CharField(blank=True, choices=[('apartment', 'Apartment'), ('townhouse', 'Townhouse'), ('single_family', 'Single Family Home'), ('condo', 'Condominium')], max_length=20),
        ),
        migrations.AddField(
            model_name='user',
            name='parking_spaces',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='user',
            name='mailbox_number',
            field=models.CharField(blank=True, max_length=10),
        ),
        migrations.AddField(
            model_name='user',
            name='emergency_relationship',
            field=models.CharField(blank=True, max_length=50),
        ),
        migrations.AddField(
            model_name='user',
            name='secondary_emergency_contact',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name='user',
            name='secondary_emergency_phone',
            field=models.CharField(blank=True, max_length=20),
        ),
        migrations.AddField(
            model_name='user',
            name='secondary_emergency_relationship',
            field=models.CharField(blank=True, max_length=50),
        ),
        migrations.AddField(
            model_name='user',
            name='medical_conditions',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='user',
            name='special_needs',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='user',
            name='veterinarian_contact',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name='user',
            name='insurance_company',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name='user',
            name='insurance_policy_number',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AddField(
            model_name='user',
            name='directory_show_name',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='user',
            name='directory_show_unit',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='user',
            name='directory_show_phone',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='user',
            name='directory_show_email',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='user',
            name='directory_show_household',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='user',
            name='profile_visibility',
            field=models.CharField(choices=[('all', 'All Residents'), ('members', 'Members Only'), ('admin', 'Admin Only')], default='members', max_length=20),
        ),
        migrations.AddField(
            model_name='user',
            name='two_factor_enabled',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='user',
            name='security_question',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name='user',
            name='security_answer_hash',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name='user',
            name='auto_pay_enabled',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='user',
            name='preferred_payment_method',
            field=models.CharField(choices=[('credit_card', 'Credit Card'), ('bank_account', 'Bank Account'), ('check', 'Check')], default='credit_card', max_length=20),
        ),
        migrations.AddField(
            model_name='user',
            name='billing_address_different',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='user',
            name='billing_address',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='user',
            name='theme_preference',
            field=models.CharField(choices=[('light', 'Light'), ('dark', 'Dark'), ('auto', 'Auto')], default='light', max_length=10),
        ),
        migrations.AddField(
            model_name='user',
            name='email_notifications',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='user',
            name='sms_notifications',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='user',
            name='push_notifications',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='user',
            name='last_profile_update',
            field=models.DateTimeField(auto_now=True),
        ),
        
        # Create HouseholdMember model
        migrations.CreateModel(
            name='HouseholdMember',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('full_name', models.CharField(max_length=255)),
                ('relationship', models.CharField(choices=[('spouse', 'Spouse'), ('child', 'Child'), ('parent', 'Parent'), ('sibling', 'Sibling'), ('relative', 'Other Relative'), ('roommate', 'Roommate'), ('tenant', 'Tenant'), ('other', 'Other')], max_length=20)),
                ('date_of_birth', models.DateField(blank=True, null=True)),
                ('phone', models.CharField(blank=True, max_length=20)),
                ('email', models.EmailField(blank=True)),
                ('emergency_contact', models.BooleanField(default=False)),
                ('has_key_access', models.BooleanField(default=False)),
                ('is_minor', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='household_members', to='users.user')),
            ],
            options={
                'verbose_name': 'Household Member',
                'verbose_name_plural': 'Household Members',
            },
        ),
        
        # Create Pet model
        migrations.CreateModel(
            name='Pet',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
                ('pet_type', models.CharField(choices=[('dog', 'Dog'), ('cat', 'Cat'), ('bird', 'Bird'), ('fish', 'Fish'), ('reptile', 'Reptile'), ('small_mammal', 'Small Mammal'), ('other', 'Other')], max_length=20)),
                ('breed', models.CharField(blank=True, max_length=100)),
                ('color', models.CharField(blank=True, max_length=50)),
                ('weight', models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True)),
                ('date_of_birth', models.DateField(blank=True, null=True)),
                ('microchip_number', models.CharField(blank=True, max_length=50)),
                ('vaccination_current', models.BooleanField(default=False)),
                ('vaccination_expiry', models.DateField(blank=True, null=True)),
                ('special_needs', models.TextField(blank=True)),
                ('photo', models.ImageField(blank=True, null=True, upload_to='pet_photos/')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='pets', to='users.user')),
            ],
            options={
                'verbose_name': 'Pet',
                'verbose_name_plural': 'Pets',
            },
        ),
        
        # Create Vehicle model
        migrations.CreateModel(
            name='Vehicle',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('license_plate', models.CharField(max_length=20)),
                ('make', models.CharField(max_length=50)),
                ('model', models.CharField(max_length=50)),
                ('year', models.PositiveIntegerField()),
                ('color', models.CharField(max_length=30)),
                ('vehicle_type', models.CharField(choices=[('car', 'Car'), ('truck', 'Truck'), ('suv', 'SUV'), ('van', 'Van'), ('motorcycle', 'Motorcycle'), ('rv', 'RV'), ('trailer', 'Trailer'), ('other', 'Other')], default='car', max_length=20)),
                ('is_primary', models.BooleanField(default=False)),
                ('parking_permit_number', models.CharField(blank=True, max_length=50)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='vehicles', to='users.user')),
            ],
            options={
                'verbose_name': 'Vehicle',
                'verbose_name_plural': 'Vehicles',
            },
        ),
        
        # Create ProfileChangeLog model
        migrations.CreateModel(
            name='ProfileChangeLog',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('change_type', models.CharField(choices=[('create', 'Created'), ('update', 'Updated'), ('delete', 'Deleted'), ('login', 'Login'), ('password_change', 'Password Change'), ('email_verification', 'Email Verification'), ('phone_verification', 'Phone Verification')], max_length=20)),
                ('field_name', models.CharField(blank=True, max_length=100)),
                ('old_value', models.TextField(blank=True)),
                ('new_value', models.TextField(blank=True)),
                ('ip_address', models.GenericIPAddressField(blank=True, null=True)),
                ('user_agent', models.TextField(blank=True)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='change_logs', to='users.user')),
            ],
            options={
                'verbose_name': 'Profile Change Log',
                'verbose_name_plural': 'Profile Change Logs',
                'ordering': ['-timestamp'],
            },
        ),
        
        # Add unique constraints
        migrations.AddConstraint(
            model_name='householdmember',
            constraint=models.UniqueConstraint(fields=['user', 'full_name'], name='unique_household_member_per_user'),
        ),
        migrations.AddConstraint(
            model_name='vehicle',
            constraint=models.UniqueConstraint(fields=['license_plate', 'user'], name='unique_vehicle_per_user'),
        ),
    ]