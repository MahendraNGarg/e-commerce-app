from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('catalog', '0002_add_cart_and_quantity'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='priority',
            field=models.PositiveSmallIntegerField(
                choices=[
                    (1, 'Low'),
                    (2, 'Medium'),
                    (3, 'High'),
                    (4, 'Critical'),
                ],
                default=2,
            ),
        ),
    ]
