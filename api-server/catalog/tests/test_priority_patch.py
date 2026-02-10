from django.test import TestCase
from rest_framework.test import APIClient
from catalog.models import Category, Product


class PriorityPatchTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.cat = Category.objects.create(name='Toys')
        # Create product and intentionally write a string into the
        # priority column to simulate legacy/corrupt DB state.
        p = Product.objects.create(
            title='Widget',
            description='A widget',
            category=self.cat,
            price='9.99',
            priority=2,
            is_featured=True,
            quantity=5,
        )
        # Force a string into the DB using raw SQL (SQLite permissive)
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute(
                "UPDATE catalog_product SET priority = 'high' WHERE id = %s",
                [p.id],
            )
        self.product_id = p.id

    def test_patch_unfeature_with_string_priority(self):
        url = f'/api/products/{self.product_id}/'
        resp = self.client.patch(url, {'is_featured': False}, format='json')
        self.assertNotEqual(resp.status_code, 500)
        self.assertIn(resp.status_code, (200, 204))
        # Reload and ensure priority is now numeric (int)
        p = Product.objects.get(pk=self.product_id)
        self.assertIsInstance(p.priority, int)
