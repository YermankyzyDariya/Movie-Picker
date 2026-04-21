from django.contrib import admin
from .models import Movie, Review, Watchlist, Profile, Recommendation, Genre

@admin.register(Genre)
class GenreAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')

@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'year', 'created_by', 'created_at')
    search_fields = ('title', 'genres__name')
    list_filter = ('year', 'genres', 'created_at')
    readonly_fields = ('created_at',)
    fields = ('title', 'description', 'genres', 'year', 'image', 'created_by', 'created_at')


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('id', 'movie', 'user', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('movie__title', 'user__username')


@admin.register(Watchlist)
class WatchlistAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'movie', 'added_at')
    search_fields = ('user__username', 'movie__title')


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'favorite_genre', 'created_at')
    search_fields = ('user__username', 'favorite_genre')
    readonly_fields = ('created_at',)


@admin.register(Recommendation)
class RecommendationAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'movie', 'created_at')
    search_fields = ('user__username', 'movie__title')
  