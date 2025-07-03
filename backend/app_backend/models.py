from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    USERNAME_FIELD = 'email' 
    REQUIRED_FIELDS = ["username"]

    def __str__(self) -> str:
        return self.email
    
    level = models.PositiveIntegerField(default=0)  

    @property
    def display_level(self):
        return self.level // 100

    @property
    def current_xp(self):
        return self.level % 100


class Lesson(models.Model):
    DIFFICUTY_CHOICES = [
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard')
    ]

    title = models.CharField(max_length=255)
    text = models.TextField()
    year = models.PositiveSmallIntegerField(choices=[(i, f"Year {i}") for i in range(1,9)])
    difficulty = models.CharField(max_length=10, choices=DIFFICUTY_CHOICES)

    def __str__(self):
        return self.title
    

class GameScoreLesson(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    score = models.IntegerField()


class LessonFinished(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)