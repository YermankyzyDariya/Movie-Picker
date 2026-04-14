from django.contrib import admin
from .models import Movie, Review, Watchlist, Profile

@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = ('title', 'year', 'created_by', 'created_at')
    search_fields = ('title', 'genre')
    fields = ('title', 'description', 'genre', 'year', 'image', 'created_by')

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('movie', 'user', 'rating', 'created_at')

@admin.register(Watchlist)
class WatchlistAdmin(admin.ModelAdmin):
    list_display = ('user', 'movie', 'added_at')

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'favorite_genre')