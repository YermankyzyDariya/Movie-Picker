from django.urls import path
from .views import login_view, logout_view, MovieListCreate, MovieDetail

urlpatterns = [
    path('login/', login_view),
    path('logout/', logout_view),

    path('movies/', MovieListCreate.as_view()),
    path('movies/<int:pk>/', MovieDetail.as_view()),
]