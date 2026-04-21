from django.urls import path
from .views import (
    login_view,
    logout_view,
    MovieListCreate,
    MovieDetail,
    search_movies,
    RecommendationView,
    recommended_by_favorite_genre,
    netflix_recommendations,
    similar_movies,
)

urlpatterns = [

    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),


    path('movies/', MovieListCreate.as_view(), name='movie-list-create'),
    path('movies/<int:pk>/', MovieDetail.as_view(), name='movie-detail'),


    path('movies/search/', search_movies, name='movie-search'),

  
    path('recommendations/', RecommendationView.as_view(), name='recommendations'),
    path('movies/recommended/', recommended_by_favorite_genre, name='recommended-by-genre'),
    path('movies/netflix/', netflix_recommendations, name='netflix-recommendations'),
    path('similar/', similar_movies),
]