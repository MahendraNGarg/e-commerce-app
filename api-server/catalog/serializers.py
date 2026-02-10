from rest_framework import serializers
from .models import Category, Product


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'created_at']
        read_only_fields = ['id', 'created_at']


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(
        source='category.name', read_only=True
    )
    
    class Meta:
        model = Product
        fields = [
            'id', 'title', 'description', 'category', 'category_name',
            'price', 'priority', 'is_featured', 'image_url', 'quantity',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_price(self, value):
        # Ensure price is non-negative
        if value is None:
            raise serializers.ValidationError('Price is required.')
        if value < 0:
            raise serializers.ValidationError('Price must be >= 0.')
        return value

    def validate_quantity(self, value):
        # Quantity must be non-negative integer
        if value is None:
            return 0
        if value < 0:
            raise serializers.ValidationError('Quantity must be >= 0.')
        return value

    def validate_priority(self, value):
        """
        Accept numeric or string priority values. Map common labels to their
        numeric choice equivalents so clients can send 'high' / 'High' etc.
        """
        # If it's already an integer, ensure it's one of the valid choices
        if value is None:
            return 2
        # Allow numeric strings
        if isinstance(value, str):
            s = value.strip()
            # numeric string
            if s.isdigit():
                return int(s)
            s_low = s.lower()
            if 'low' in s_low:
                return 1
            if 'medium' in s_low:
                return 2
            if 'high' in s_low:
                return 3
            if 'critical' in s_low:
                return 4
            raise serializers.ValidationError('Invalid priority value.')

        try:
            return int(value)
        except (TypeError, ValueError):
            raise serializers.ValidationError(
                'Priority must be a number or known label.'
            )

    def update(self, instance, validated_data):
        """Apply validated_data and save; if a ValueError occurs because the
        underlying DB stored a non-numeric priority string (SQLite is
        permissive), coerce that string to the numeric choice and retry.
        """
        # Apply incoming changes to the instance
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        try:
            instance.save()
            return instance
        except ValueError as exc:
            # Handle the specific Django ValueError raised when an integer
            # field is given a non-numeric string (e.g. 'high'). Try to
            # coerce the instance.priority to an integer choice and retry.
            msg = str(exc)
            if "Field 'priority' expected a number" in msg:
                try:
                    if isinstance(instance.priority, str):
                        instance.priority = self.validate_priority(
                            instance.priority
                        )
                except serializers.ValidationError:
                    instance.priority = Product.priority.field.default

                # Retry save after coercion
                instance.save()
                return instance
            # Re-raise if it's an unexpected ValueError
            raise


class ProductListSerializer(serializers.ModelSerializer):
    """Simplified serializer for list views"""
    category_name = serializers.CharField(
        source='category.name', read_only=True
    )
    
    class Meta:
        model = Product
        fields = (
            'id', 'title', 'category', 'category_name',
            'price', 'priority', 'is_featured', 'image_url', 'quantity',
        )


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        source='product', queryset=Product.objects.all(), write_only=True,
    )

    class Meta:
        # placeholder - will be replaced dynamically at runtime
        model = Product
        # note: overridden where needed by views
        fields = ['id', 'product', 'product_id', 'quantity', 'created_at']


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total = serializers.SerializerMethodField()

    class Meta:
        # placeholder model; views will set the real Cart model
        model = Product
        fields = ['id', 'items', 'total', 'created_at', 'updated_at']

    def get_total(self, obj):
        # compute total from current product prices
        total = 0
        for item in getattr(obj, 'items').all():
            price = float(item.product.price)
            total += price * item.quantity
        return f"{total:.2f}"

