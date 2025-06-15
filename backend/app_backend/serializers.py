from rest_framework import serializers
from .models import CustomUser, Lesson, GameScore
from django.contrib.auth import authenticate


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ("id", "username", "email")

class UserRegistrationSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ("id", "username", "email", "password1", "password2")
        extra_kwargs = {"password": {"write_only": True}}

    def validate(self, attrs):
        if attrs['password1'] != attrs['password2']:
            raise serializers.ValidationError("Passwords do not match!")
        
        password = attrs.get("password1", "")

        if len(password) < 8:
            raise serializers.ValidationError("Passwords must be longer than 8 characters")
        
        return attrs
    
    def create(self, validated_data):
        password = validated_data.pop("password1")
        validated_data.pop("password2")

        return CustomUser.objects.create_user(password=password,  **validated_data)
    

class UserLoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(**data) 

        if user and user.is_active:
            return user
        raise serializers.ValidationError("incorrect credentials!")
    

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = '__all__'


class LeaderboardEntrySerializer(serializers.Serializer):
    username = serializers.CharField()
    score = serializers.IntegerField()


class GameScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameScore
        fields = ['lesson', 'score']

    def create(self, validated_data):
        user = self.context['request'].user
        return GameScore.objects.create(user=user, **validated_data)
