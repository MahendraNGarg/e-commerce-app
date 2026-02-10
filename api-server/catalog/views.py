# catalog/views.py
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404

from .models import Product, Category, Cart, CartItem
from .serializers import (
    ProductSerializer,
    CategorySerializer,
    CartSerializer,
    CartItemSerializer,
)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = ['category', 'priority', 'is_featured']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'price', 'priority']
    ordering = ['-created_at']

    @action(detail=False, methods=['get'])
    def featured(self, request):
        featured_products = self.get_queryset().filter(is_featured=True)
        serializer = self.get_serializer(featured_products, many=True)
        return Response(serializer.data)


class CartViewSet(viewsets.ModelViewSet):
    queryset = Cart.objects.all()
    # dynamic serializer assignment below

    def get_serializer_class(self):
        # simple dynamic wiring using defined serializers
        # ensure serializers reference the actual Cart/CartItem models
        CartItemSerializer.Meta.model = CartItem
        CartSerializer.Meta.model = Cart
        return CartSerializer

    def retrieve(self, request, *args, **kwargs):
        cart = self.get_object()
        serializer = CartSerializer(cart)
        # compute total on serializer get_total
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def add_item(self, request, pk=None):
        cart = self.get_object()
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))
        if quantity < 1:
            return Response(
                {'detail': 'Quantity must be >= 1'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        product = get_object_or_404(Product, pk=product_id)
        # stock enforcement
        if quantity > product.quantity:
            return Response(
                {'detail': 'Requested quantity exceeds stock.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        item, created = CartItem.objects.get_or_create(
            cart=cart, product=product, defaults={'quantity': quantity}
        )
        if not created:
            new_qty = item.quantity + quantity
            if new_qty > product.quantity:
                return Response(
                    {'detail': 'Requested quantity exceeds stock.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            item.quantity = new_qty
            item.save()

        serializer = CartSerializer(cart)
        return Response(serializer.data)

    @action(detail=True, methods=['patch'])
    def update_item(self, request, pk=None):
        cart = self.get_object()
        item_id = request.data.get('item_id')
        quantity = request.data.get('quantity')
        item = get_object_or_404(CartItem, pk=item_id, cart=cart)
        quantity = int(quantity)
        if quantity < 1:
            return Response(
                {'detail': 'Quantity must be >= 1'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if quantity > item.product.quantity:
            return Response(
                {'detail': 'Requested quantity exceeds stock.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        item.quantity = quantity
        item.save()
        return Response(CartSerializer(cart).data)

    @action(detail=True, methods=['delete'])
    def remove_item(self, request, pk=None):
        cart = self.get_object()
        item_id = request.data.get('item_id')
        item = get_object_or_404(CartItem, pk=item_id, cart=cart)
        item.delete()
        return Response(CartSerializer(cart).data)

