import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE','showcase_api.settings')
import django
django.setup()
from catalog.serializers import ProductSerializer
from catalog.models import Category
c = Category.objects.create(name='tmp', description='d')
payload = {
    'title': 'New Product',
    'description': 'd',
    'category': c.id,
    'price': 12.34,
    'priority': 2,
    'is_featured': False,
    'image_url': '',
}
ser = ProductSerializer(data=payload)
print('is_valid:', ser.is_valid())
print('errors:', ser.errors)
