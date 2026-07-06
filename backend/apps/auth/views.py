from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
from django.core.exceptions import ValidationError
from .serializers import RegisterSerializer, LoginSerializer, ResendVerificationSerializer
from .utils import email_verification_token, send_verification_email
from apps.users.models import User

class RegisterView(generics.CreateAPIView):
    """
    Inscription d'un nouvel utilisateur (Acheteur, Vendeur, etc.).
    Le rôle par défaut est 'client'.
    Envoie un email de vérification.
    """
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Envoyer l'email de vérification
        send_verification_email(user)
        
        refresh = RefreshToken.for_user(user)
        
        roles = [ur.role.name for ur in user.user_roles.select_related('role')]

        return Response({
            "user": {
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "phone": user.phone,
                "roles": roles,
                "is_verified": user.is_verified
            },
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "message": "Inscription réussie ! Vérifiez votre email pour activer votre compte."
        }, status=status.HTTP_201_CREATED)

class LoginView(generics.GenericAPIView):
    """
    Connexion d'un utilisateur existant avec email et mot de passe.
    Retourne des tokens JWT.
    """
    serializer_class = LoginSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        
        if not user.is_verified:
            return Response({
                "error": "Veuillez vérifier votre email avant de vous connecter."
            }, status=status.HTTP_403_FORBIDDEN)
        
        refresh = RefreshToken.for_user(user)
        
        roles = [ur.role.name for ur in user.user_roles.select_related('role')]
        
        return Response({
            "user": {
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "phone": user.phone,
                "roles": roles,
                "is_verified": user.is_verified
            },
            "access": str(refresh.access_token),
            "refresh": str(refresh)
        })

class VerifyEmailView(APIView):
    """
    Vérifie l'email de l'utilisateur via le token envoyé par email.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        uidb64 = request.query_params.get('uid')
        token = request.query_params.get('token')
        
        if not uidb64 or not token:
            return Response({
                "error": "UID et token requis."
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({
                "error": "Lien invalide ou expiré."
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if email_verification_token.check_token(user, token):
            user.is_verified = True
            user.save()
            return Response({
                "message": "Email vérifié avec succès ! Votre compte est activé."
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                "error": "Lien invalide ou expiré."
            }, status=status.HTTP_400_BAD_REQUEST)

class ResendVerificationEmailView(generics.GenericAPIView):
    """
    Renvoie l'email de vérification à l'utilisateur.
    """
    serializer_class = ResendVerificationSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # On ne révèle pas si l'email existe ou non pour des raisons de sécurité
            return Response({
                "message": "Si cet email est associé à un compte, un email de vérification a été envoyé."
            }, status=status.HTTP_200_OK)
        
        if user.is_verified:
            return Response({
                "message": "Votre email a déjà été vérifié."
            }, status=status.HTTP_400_BAD_REQUEST)
        
        send_verification_email(user)
        return Response({
            "message": "Si cet email est associé à un compte, un email de vérification a été envoyé."
        }, status=status.HTTP_200_OK)
