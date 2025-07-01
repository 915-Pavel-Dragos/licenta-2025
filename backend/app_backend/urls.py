from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenRefreshView



urlpatterns = [
    path('register/', UserRegistrationAPIView.as_view(), name='register-view'),
    path('login/', UserLoginAPIView.as_view(), name='login-view'),
    path('logout/', UserLogoutAPIView.as_view(), name='logout-view'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('user/', UserInfoAPIView.as_view(), name='user-info'),
    path('lessons/', LessonListView.as_view(), name='lesson-list'),
    path('lessons/year/<int:year>', LessonByYearView.as_view(), name='lesson-by-year'),
    path('gamescore/', GameScoreLessonCreateUpdateAPIView.as_view(), name='register_game_score'),
    path('gamescore/<int:lesson_id>/', GameScoresForLessonAPIView.as_view(), name='lesson_game_scores'),
    path('lesson-finished/', MarkLessonFinishedAPIView.as_view(), name='mark_lesson_finished'),
    path('lesson-finished/<int:user_id>/', LessonsFinishedByUserAPIView.as_view(), name='user_finished_lessons'),
]

