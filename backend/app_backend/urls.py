from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    path('register/', UserRegistrationAPIView.as_view(), name='register-view'),
    path('login/', UserLoginAPIView.as_view(), name='login-view'),
    path('logout/', UserLogoutAPIView.as_view(), name='logout-view'),
    path('token/refresh', TokenRefreshView.as_view(), name='token-refresh'),
    path('user/', UserInfoAPIView.as_view(), name='user-info')
]

