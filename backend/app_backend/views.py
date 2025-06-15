from django.shortcuts import render
from rest_framework.generics import GenericAPIView, RetrieveAPIView, ListAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import *
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status
from .models import Lesson, GameScore
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

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


class LessonLeaderboardView(APIView):
    def get(self, request, lesson_id):
        lesson = get_object_or_404(Lesson, id=lesson_id)
        
        scores = GameScore.objects.filter(lesson=lesson).order_by('-score', 'played_at')
        
        best_scores = {}
        for score in scores:
            if score.user_id not in best_scores or score.score > best_scores[score.user_id].score:
                best_scores[score.user_id] = score
        
        leaderboard_data = [
            {"username": entry.user.username, "score": entry.score}
            for entry in best_scores.values()
        ]

        leaderboard_data.sort(key=lambda x: x["score"], reverse=True)

        serializer = LeaderboardEntrySerializer(leaderboard_data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class SubmitScoreView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = GameScoreSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Score submitted successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)