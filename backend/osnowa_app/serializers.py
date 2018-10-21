from rest_framework.serializers import ModelSerializer
from .models import Point, Image


class PointSerializer(ModelSerializer):
    class Meta:
        model = Point
        fields = '__all__'

class ImageSerializer(ModelSerializer):
    class Meta:
        model = Image
        fields = ('image',)
