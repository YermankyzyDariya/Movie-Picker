from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from django.db.models import Avg

from .models import Movie, Recommendation
from .serializers import MovieSerializer, RecommendationSerializer



@api_view(['POST'])
def login_view(request):
    user = authenticate(
        username=request.data.get('username'),
        password=request.data.get('password')
    )
    if user:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key})
    return Response({'error': 'Invalid credentials'}, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    try:
        request.user.auth_token.delete()
    except:
        return Response({'error': 'Token not found'}, status=400)

    return Response({'message': 'Logged out'})



@api_view(['GET'])
def search_movies(request):
    query = request.GET.get('q')
    genre = request.GET.get('genre')

    movies = Movie.objects.all()

    if query:
        movies = movies.filter(title__icontains=query)

    if genre:
        movies = movies.filter(genres__name__icontains=genre)

    serializer = MovieSerializer(movies, many=True, context={'request': request})
    return Response(serializer.data)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recommended_by_favorite_genre(request):
    profile = getattr(request.user, 'profile', None)

    if not profile or not profile.favorite_genre:
        return Response({'error': 'Favorite genre not set'}, status=400)

    movies = Movie.objects.filter(
        genres__name__icontains=profile.favorite_genre
    ).distinct()

    serializer = MovieSerializer(movies, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def netflix_recommendations(request):
    user = request.user

    profile = getattr(user, 'profile', None)
    favorite_genre = profile.favorite_genre if profile else None

    watched_movies = user.reviews.values_list('movie_id', flat=True)

    movies = Movie.objects.exclude(id__in=watched_movies).annotate(
        avg_rating=Avg('reviews__rating')
    )

    recommendations = []

    for movie in movies:
        score = 0

        if favorite_genre and movie.genres.filter(name__icontains=favorite_genre).exists():
            score += 3

        if movie.avg_rating:
            if movie.avg_rating >= 4:
                score += 2
            elif movie.avg_rating >= 3:
                score += 1

        recommendations.append((movie, score))

    recommendations.sort(key=lambda x: x[1], reverse=True)

    top_movies = [movie for movie, score in recommendations[:10]]

    serializer = MovieSerializer(top_movies, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def similar_movies(request):
    ids = request.data.get('movie_ids', [])
    search = request.data.get('search', None)

    movies = Movie.objects.filter(id__in=ids)

    base_genres = set()
    base_years = []

    for m in movies:
        base_genres.update(m.genres.values_list('id', flat=True))
        base_years.append(m.year)

    similar = Movie.objects.exclude(id__in=ids)

    results = []

    for movie in similar:
        score = 0

        movie_genres = set(movie.genres.values_list('id', flat=True))
        score += len(base_genres & movie_genres) * 3

        if base_years:
            avg_year = sum(base_years) / len(base_years)
            if abs(movie.year - avg_year) <= 2:
                score += 2

        results.append((movie, score))

    results.sort(key=lambda x: x[1], reverse=True)

    top_movies = [m for m, s in results]


    if search:
        top_movies = [
            m for m in top_movies
            if search.lower() in m.title.lower()
        ]

    serializer = MovieSerializer(top_movies[:10], many=True, context={'request': request})
    return Response(serializer.data)


class MovieListCreate(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        movies = Movie.objects.all()
        serializer = MovieSerializer(movies, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        many = isinstance(request.data, list)

        serializer = MovieSerializer(
            data=request.data,
            many=many,
            context={'request': request}
        )

        if serializer.is_valid():
            if many:
                movies = []
                for item in serializer.validated_data:
                    genres = item.pop('genres', [])
                    movie = Movie.objects.create(created_by=request.user, **item)
                    movie.genres.set(genres)
                    movies.append(movie)

                return Response(MovieSerializer(movies, many=True).data)

            else:
                serializer.save(created_by=request.user)
                return Response(serializer.data)

        return Response(serializer.errors, status=400)


class MovieDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        return get_object_or_404(Movie, pk=pk)

    def get(self, request, pk):
        movie = self.get_object(pk)
        serializer = MovieSerializer(movie, context={'request': request})
        return Response(serializer.data)

    def put(self, request, pk):
        movie = self.get_object(pk)

        if not movie.created_by or movie.created_by != request.user:
            return Response({'error': 'Not allowed'}, status=403)

        serializer = MovieSerializer(movie, data=request.data, context={'request': request})

        if serializer.is_valid():
            serializer.save(created_by=movie.created_by)
            return Response(serializer.data)

        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        movie = self.get_object(pk)

        if movie.created_by != request.user:
            return Response({'error': 'Not allowed'}, status=403)

        movie.delete()
        return Response({'deleted': True})



class RecommendationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        recs = Recommendation.objects.filter(user=request.user)
        serializer = RecommendationSerializer(recs, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = RecommendationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data)

        return Response(serializer.errors, status=400)