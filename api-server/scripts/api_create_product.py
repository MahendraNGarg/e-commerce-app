import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'showcase_api.settings')
import django
django.setup()
from rest_framework.test import APIClient
from catalog.models import Category

c = Category.objects.create(name='tmp', description='d')
client = APIClient()
payload = {
    'title': 'New Product',
    'description': 'd',
    'category': c.id,
    'price': 12.34,
    'priority': 2,
    'is_featured': False,
    'image_url': '',
}
resp = client.post('/api/products/', payload, format='json')
print('status', resp.status_code)
print('data', resp.data)
