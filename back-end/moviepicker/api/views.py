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


# FBV

@api_view(['GET'])
def search_movies(request):
    query = request.GET.get('q')
    genre = request.GET.get('genre')

    movies = Movie.objects.all()

    if query:
        movies = movies.filter(title__icontains=query)

    if genre:
        movies = movies.filter(genre__icontains=genre)

    serializer = MovieSerializer(movies, many=True, context={'request': request})
    return Response(serializer.data)


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


# CBV

class MovieListCreate(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        movies = Movie.objects.all()
        serializer = MovieSerializer(movies, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        serializer = MovieSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
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

      
        if movie.created_by != request.user:
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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recommended_by_favorite_genre(request):
    profile = getattr(request.user, 'profile', None)

    if not profile or not profile.favorite_genre:
        return Response({'error': 'Favorite genre not set'}, status=400)

    movies = Movie.objects.filter(genre__icontains=profile.favorite_genre)

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


        if favorite_genre and favorite_genre.lower() in movie.genre.lower():
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