from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Movie, Review, Recommendation, Genre

User = get_user_model()


from .models import Movie, Genre

class MovieSerializer(serializers.ModelSerializer):
    genres = serializers.PrimaryKeyRelatedField(
    many=True,
    queryset=Genre.objects.all()
)

    class Meta:
        model = Movie
        fields = '__all__'
    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None
    def create(self, validated_data):
        genres = validated_data.pop('genres', [])
        movie = Movie.objects.create(**validated_data)
        movie.genres.set(genres)
        return movie

class SimpleMovieSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    title = serializers.CharField(max_length=200)
    genre = serializers.CharField(required=False, allow_blank=True)
    year = serializers.IntegerField(required=False)

    def create(self, validated_data):
        return Movie.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.genre = validated_data.get('genre', instance.genre)
        instance.year = validated_data.get('year', instance.year)
        instance.save()
        return instance


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'
        read_only_fields = ['user']  


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class RecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recommendation
        fields = '__all__'
        read_only_fields = ['user']  