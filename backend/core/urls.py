from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.UserRegisterView.as_view()),
    path('login/', views.UserAPIView.as_view()),
    path('user/', views.UserInfoView.as_view()),
]