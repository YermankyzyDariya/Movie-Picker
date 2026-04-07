from django.db import models
from django.contrib.auth.models import User


class Genre(models.Model):
    name = models.CharField(max_length=50) 


class Movie(models.Model):
    title = models.CharField(max_length=200)
    release_date = models.DateField()
    genres = models.ManyToManyField(Genre)   
    added_by = models.ForeignKey(User, on_delete=models.CASCADE)


