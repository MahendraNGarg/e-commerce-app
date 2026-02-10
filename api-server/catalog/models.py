# catalog/models.py
from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    

class Product(models.Model):
    PRIORITY_CHOICES = [
        (1, 'Low'),
        (2, 'Medium'),
        (3, 'High'),
        (4, 'Critical'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    priority = models.PositiveSmallIntegerField(
        choices=PRIORITY_CHOICES, default=2
    )
    is_featured = models.BooleanField(default=False)
    image_url = models.URLField(blank=True)
    # Available stock quantity for the product (for cart stock checks).
    quantity = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        """
        Accept human-friendly string labels for `priority` (e.g. 'high') and
        coerce them to the numeric choice before saving. This makes saves
        tolerant of fixtures or external input that use string labels.
        """
        if isinstance(self.priority, str):
            key = self.priority.strip().lower()
            mapping = {
                'low': 1,
                'medium': 2,
                'high': 3,
                'critical': 4,
            }
            if key.isdigit():
                try:
                    self.priority = int(key)
                except ValueError:
                    self.priority = mapping.get(key, self.priority)
            else:
                self.priority = mapping.get(key, self.priority)

        super().save(*args, **kwargs)
    

class Cart(models.Model):
    """Simple cart model. Can be extended to link to a user."""
    # Optional extension point for linking carts to users.
    # user = models.ForeignKey(
    #     settings.AUTH_USER_MODEL,
    #     null=True,
    #     blank=True,
    #     on_delete=models.SET_NULL,
    # )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Cart {self.pk}"


class CartItem(models.Model):
    cart = models.ForeignKey(
        Cart, related_name='items', on_delete=models.CASCADE
    )
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = (('cart', 'product'),)

    def __str__(self):
        return f"{self.quantity} x {self.product.title} (cart {self.cart_id})"
    