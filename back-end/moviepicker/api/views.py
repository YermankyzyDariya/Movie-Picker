from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404

from .models import Movie
from .serializers import MovieSerializer


# FBV


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
def logout_view(request):
    if request.user.is_authenticated:
        request.user.auth_token.delete()
        return Response({'message': 'Logged out'})
    return Response({'error': 'User not authenticated'}, status=401)



# CBV


class MovieListCreate(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        movies = Movie.objects.all()
        serializer = MovieSerializer(
            movies,
            many=True,
            context={'request': request}  
        )
        return Response(serializer.data)

    def post(self, request):
        serializer = MovieSerializer(
            data=request.data,
            context={'request': request}  
        )
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
        serializer = MovieSerializer(
            movie,
            context={'request': request}  
        )
        return Response(serializer.data)

    def put(self, request, pk):
        movie = self.get_object(pk)
        serializer = MovieSerializer(
            movie,
            data=request.data,
            context={'request': request}  
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        movie = self.get_object(pk)
        movie.delete()
        return Response({'deleted': True})