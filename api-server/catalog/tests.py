from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Category, Product
from .models import Cart


class CatalogApiTests(APITestCase):
    def setUp(self):
        self.category1 = Category.objects.create(name="Cat 1", description="d1")
        self.category2 = Category.objects.create(name="Cat 2", description="d2")

        self.product1 = Product.objects.create(
            title="Prod 1",
            description="desc",
            category=self.category1,
            price=10.50,
            priority=1,
            is_featured=False,
            image_url="",
        )
        self.product2 = Product.objects.create(
            title="Featured Prod",
            description="desc",
            category=self.category2,
            price=99.99,
            priority=3,
            is_featured=True,
            image_url="https://example.com/img.png",
        )

    def test_categories_list_is_paginated(self):
        url = reverse("category-list")
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn("results", resp.data)
        self.assertGreaterEqual(len(resp.data["results"]), 2)

    def test_products_list_is_paginated(self):
        url = reverse("product-list")
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn("results", resp.data)
        self.assertGreaterEqual(len(resp.data["results"]), 2)

    def test_product_crud_create_update_delete(self):
        list_url = reverse("product-list")

        create_payload = {
            "title": "New Product",
            "description": "d",
            "category": self.category1.id,
            "price": 12.34,
            "priority": 2,
            "is_featured": False,
            "image_url": "",
        }
        created = self.client.post(list_url, create_payload, format="json")
        if created.status_code != status.HTTP_201_CREATED:
            print('CREATE RESPONSE CODE:', created.status_code)
            print('CREATE RESPONSE DATA:', created.data)
        self.assertEqual(created.status_code, status.HTTP_201_CREATED)
        product_id = created.data["id"]

        detail_url = reverse("product-detail", kwargs={"pk": product_id})
        update_payload = {
            **create_payload,
            "title": "Updated Title",
            "is_featured": True,
        }
        updated = self.client.put(detail_url, update_payload, format="json")
        self.assertEqual(updated.status_code, status.HTTP_200_OK)
        self.assertEqual(updated.data["title"], "Updated Title")
        self.assertEqual(updated.data["is_featured"], True)

        deleted = self.client.delete(detail_url)
        self.assertEqual(deleted.status_code, status.HTTP_204_NO_CONTENT)

    def test_products_filter_by_category(self):
        url = reverse("product-list")
        resp = self.client.get(url, {"category": self.category2.id})
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        ids = [p["id"] for p in resp.data.get("results", [])]
        self.assertIn(self.product2.id, ids)
        self.assertNotIn(self.product1.id, ids)

    def test_products_filter_by_is_featured(self):
        url = reverse("product-list")
        resp = self.client.get(url, {"is_featured": True})
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        ids = [p["id"] for p in resp.data.get("results", [])]
        self.assertIn(self.product2.id, ids)
        self.assertNotIn(self.product1.id, ids)

    def test_featured_endpoint_returns_featured_only(self):
        url = reverse("product-featured")
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

        # The endpoint may be non-paginated list or paginated; accept both
        data = resp.data
        if isinstance(data, dict) and "results" in data:
            items = data["results"]
        else:
            items = data

        ids = [p["id"] for p in items]
        self.assertIn(self.product2.id, ids)
        self.assertNotIn(self.product1.id, ids)

    def test_cart_add_update_and_price_recalculation(self):
        # create an empty cart
        cart = Cart.objects.create()

        # attempt to add more than available stock
        self.product1.quantity = 2
        self.product1.save()

        url = reverse('cart-add-item', kwargs={'pk': cart.pk})
        resp = self.client.post(
            url,
            {'product_id': self.product1.id, 'quantity': 5},
            format='json',
        )
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

        # add valid quantity
        resp = self.client.post(
            url,
            {'product_id': self.product1.id, 'quantity': 2},
            format='json',
        )
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        data = resp.data
        # cart should contain item
        self.assertIn('items', data)
        self.assertEqual(len(data['items']), 1)

        # update product price and ensure cart total reflects change
        detail = reverse('product-detail', kwargs={'pk': self.product1.id})
        update_resp = self.client.patch(
            detail, {'price': 20.00}, format='json'
        )
        self.assertEqual(update_resp.status_code, status.HTTP_200_OK)

    # fetch cart and ensure total uses current product price
        cart_detail = reverse('cart-detail', kwargs={'pk': cart.pk})
        cart_resp = self.client.get(cart_detail)
        self.assertEqual(cart_resp.status_code, status.HTTP_200_OK)
        total = cart_resp.data.get('total')
        # total should be 2 * 20.00 = 40.00
        self.assertIsNotNone(total)
        self.assertAlmostEqual(float(total), 40.00, places=2)

    def test_product_create_invalid_price_and_quantity(self):
        list_url = reverse("product-list")
        payload = {
            "title": "Bad Product",
            "description": "d",
            "category": self.category1.id,
            "price": -5.00,
            "priority": 2,
            "is_featured": False,
            "image_url": "",
            "quantity": -3,
        }
        created = self.client.post(list_url, payload, format="json")
        # Expect bad request due to negative price/quantity
        self.assertEqual(created.status_code, status.HTTP_400_BAD_REQUEST)
        # Ensure error messages include price or quantity validation
        data = created.data
        self.assertTrue('price' in data or 'quantity' in data)
