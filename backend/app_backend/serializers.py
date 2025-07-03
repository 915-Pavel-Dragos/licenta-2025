from rest_framework import serializers
from .models import CustomUser, Lesson, GameScoreLesson, LessonFinished
from django.contrib.auth import authenticate


class CustomUserSerializer(serializers.ModelSerializer):
    display_level = serializers.SerializerMethodField()
    current_xp = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ("id", "username", "email", "level", "display_level", "current_xp")

    def get_display_level(self, obj):
        return obj.level // 100

    def get_current_xp(self, obj):
        return obj.level % 100


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
        if len(attrs.get("password1", "")) < 8:
            raise serializers.ValidationError("Passwords must be longer than 8 characters")
        return attrs

    def create(self, validated_data):
        password = validated_data.pop("password1")
        validated_data.pop("password2")
        return CustomUser.objects.create_user(password=password, **validated_data)


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


class GameScoreLessonSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = GameScoreLesson
        fields = ['id', 'user', 'lesson', 'score']


class LessonFinishedSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonFinished
        fields = ['id', 'user', 'lesson']


class UserXPUpdateSerializer(serializers.Serializer):
    xp_earned = serializers.IntegerField(min_value=1)

    def update(self, instance, validated_data):
        instance.level += validated_data['xp_earned']
        instance.save()
        return instance

    def to_representation(self, instance):
        return {
            "level": instance.level,
            "display_level": instance.level // 100,
            "current_xp": instance.level % 100
        }
