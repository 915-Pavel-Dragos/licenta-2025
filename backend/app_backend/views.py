from django.shortcuts import render
from rest_framework.generics import GenericAPIView, RetrieveAPIView, ListAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import *
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status
from .models import Lesson, GameScoreLesson, LessonFinished
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework import generics


class UserRegistrationAPIView(GenericAPIView):
    permission_classes = (AllowAny, )
    serializer_class = UserRegistrationSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token = RefreshToken.for_user(user)
        data = serializer.data
        data["tokens"] = {"refresh":str(token),
                          "access": str(token.access_token)}
        
        return Response(data, status=status.HTTP_201_CREATED)
    

class UserLoginAPIView(GenericAPIView):
    permission_classes = (AllowAny, )
    serializer_class = UserLoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        serializer = CustomUserSerializer(user)
        token = RefreshToken.for_user(user)
        data = serializer.data
        data["tokens"] = {"refresh": str(token), 
                          "access": str(token.access_token)}

        return Response(data, status=status.HTTP_200_OK)
    

class UserLogoutAPIView(GenericAPIView):
    permission_classes = (IsAuthenticated, )
    
    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
class UserInfoAPIView(RetrieveAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = CustomUserSerializer

    def get_object(self):
        return self.request.user
    
class LessonListView(ListAPIView):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer

class LessonByYearView(ListAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = LessonSerializer

    def get_queryset(self):
        year = self.kwargs['year']
        return Lesson.objects.filter(year=year)
    

class GameScoreLessonCreateUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        lesson_id = request.data.get("lesson")
        score = request.data.get("score")

        if not lesson_id or score is None:
            return Response({"error": "lesson and score are required"}, status=status.HTTP_400_BAD_REQUEST)

        game_score, created = GameScoreLesson.objects.update_or_create(
            user=user,
            lesson_id=lesson_id,
            defaults={'score': score}
        )
        serializer = GameScoreLessonSerializer(game_score)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class GameScoresForLessonAPIView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = GameScoreLessonSerializer

    def get_queryset(self):
        lesson_id = self.kwargs['lesson_id']
        return GameScoreLesson.objects.filter(lesson_id=lesson_id)
    

class MarkLessonFinishedAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        lesson_id = request.data.get("lesson")

        if not lesson_id:
            return Response({"error": "lesson is required"}, status=status.HTTP_400_BAD_REQUEST)

        obj, created = LessonFinished.objects.get_or_create(
            user=user,
            lesson_id=lesson_id
        )
        if not created:
            return Response({"message": "Already marked as finished."}, status=status.HTTP_200_OK)

        serializer = LessonFinishedSerializer(obj)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    

class LessonsFinishedByUserAPIView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = LessonFinishedSerializer

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return LessonFinished.objects.filter(user_id=user_id)
