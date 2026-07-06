from rest_framework import serializers
from django.contrib.auth import authenticate
from apps.users.models import User, Role, UserRole

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    role_name = serializers.CharField(write_only=True, required=False, default='buyer')

    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name', 'phone', 'password', 'role_name')

    def create(self, validated_data):
        role_name = validated_data.pop('role_name', 'buyer')
        
        # Le modèle AbstractUser de Django exige un 'username' par défaut.
        # On peut utiliser l'email comme username pour éviter les erreurs.
        username = validated_data['email']

        user = User.objects.create_user(
            username=username,
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            phone=validated_data.get('phone', '')
        )
        
        # Attribution du rôle
        role, _ = Role.objects.get_or_create(name=role_name)
        UserRole.objects.create(user=user, role=role)
        
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if email and password:
            user = authenticate(request=self.context.get('request'), email=email, password=password)
            if not user:
                raise serializers.ValidationError("Identifiants incorrects.", code='authorization')
        else:
            raise serializers.ValidationError("Email et mot de passe requis.", code='authorization')

        if not user.is_active:
            raise serializers.ValidationError("Ce compte est désactivé.", code='authorization')
            
        return user
