from django.contrib import admin
from .models import CustomUser, Lesson, GameScoreLesson, LessonFinished
from .forms import CustomUserChangeForm, CustomUserCreationForm
from django.contrib.auth.admin import UserAdmin


@admin.register(CustomUser)
class CustomAdminUser(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser

    list_display = ('email', 'username', 'level', 'display_level', 'is_staff', 'is_active')
    
    readonly_fields = ('display_level', 'current_xp')

    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('level', 'display_level', 'current_xp')}),
    )

@admin.register(Lesson)
class LessonAdmoin(admin.ModelAdmin):
    list_display = ('title', 'year', 'difficulty')
    search_fields = ('title', )
    list_filter = ('year', 'difficulty')


@admin.register(GameScoreLesson)
class GameScoreLessonAdmin(admin.ModelAdmin):
    list_display = ('user', 'lesson', 'score')


@admin.register(LessonFinished)
class LessonFinishedAdmin(admin.ModelAdmin):
    list_display = ('user_id', 'lesson_id')