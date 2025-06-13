from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import CustomUser, Lesson
from django import forms


class CustomUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = CustomUser
        fields = ('email', )


class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model = CustomUser
        fields = ('email', )        


class LessonForm(forms.ModelForm):
    class Meta:
        model = Lesson
        fields = '__all__'