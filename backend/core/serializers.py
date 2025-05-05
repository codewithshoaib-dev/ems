from rest_framework import serializers
from django.contrib.auth import authenticate

from django.contrib.auth import get_user_model

User = get_user_model()

class UserRegisterSerializer(serializers.ModelSerializer):
      password = serializers.CharField(write_only=True)
      class Meta:
            model = User
            fields = [
                  'username',
                  'email',
                  'password',
                  'role',

            ]
      def create(self, validated_data):
            user = User.objects.create_user(
                  username=validated_data['username'],
                  email= validated_data['email'],
                  password= validated_data['password']
            )
            user.role = validated_data.get('role', 'EMPLOYEE')
            user.save()
            return user
      

class UserLoginSerializer(serializers.Serializer):
      username = serializers.CharField()
      password = serializers.CharField()


      def validate(self, data):
            user = authenticate(username= data['username'], password=data['password'])
            if not user:
                  raise serializers.ValidationError('Invalid Credentials!')
            self.user = user
            return data

class UserInfoSerializer(serializers.ModelSerializer):
      class Meta:
            model = User
            fields = [
                  'id',
                  'username',
                  'email',
                  'role',
            ]
      


            
