from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model() 

"""
- Serializers are used to convert complex data types into native Python datatypes to be easily rendered into JSON, XML or other content types.
- RegiserSerializer is used to register a new user and validate the data.
- UserProfileSerializer is used to retrieve and update user profile information.
- CarviaTokenObtainPairSerializer is used to customize the token payload to include additional user information.
"""

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'first_name', 'last_name', 'password', 'confirm_password', 'university', 'university_course', 'graduation_year', 
        ]
        read_only_fields = ['id']
    
    def validate(self, attrs):
        if attrs['password'] != attrs.pop('confirm_password'):
            raise serializers.ValidationError({"confirm_password": "Password fields do not match."})
        return attrs
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
    
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'first_name', 'last_name', 'university', 'university_course', 'graduation_year', 'email_reminders_toggle_enabled'
        ]
        read_only_fields = ['id', 'email']

class CarviaTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['username'] = user.username
        return token
    