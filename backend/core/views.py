from rest_framework import generics
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserLoginSerializer, UserRegisterSerializer, UserInfoSerializer
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from django.contrib.auth import login


User = get_user_model()


class UserRegisterView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = UserRegisterSerializer



class UserAPIView(APIView):
    permission_classes = [AllowAny]
    serializer_class = UserLoginSerializer

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.user
            if user is not None:
                login(request, user)
                

            refresh = RefreshToken.for_user(user)
            
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'username': user.username,
                'role': user.role
            })
        
class UserInfoView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserInfoSerializer
    def get_queryset(self):
        user = self.request.user
        return User.objects.filter(username=user.username)
        
    
