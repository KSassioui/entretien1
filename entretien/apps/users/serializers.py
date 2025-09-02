# from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer, UserSerializer as BaseUserSerializer
# from .models import User

# class UserCreateSerializer(BaseUserCreateSerializer):
#     class Meta(BaseUserCreateSerializer.Meta):
#         model = User
#         fields = ('id', 'email', 'password')  # Pas de rôle ici

# class UserSerializer(BaseUserSerializer):
#     class Meta(BaseUserSerializer.Meta):
#         model = User
#         fields = ('id', 'email', 'role')


from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer, UserSerializer as BaseUserSerializer
from .models import User

class UserCreateSerializer(BaseUserCreateSerializer):
    class Meta(BaseUserCreateSerializer.Meta):
        model = User
        fields = ('id', 'email', 'password')

class UserSerializer(BaseUserSerializer):
    class Meta(BaseUserSerializer.Meta):
        model = User
        fields = ('id', 'email', 'role', 'groups')

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Retourner juste les noms des groupes
        data['groups'] = list(instance.groups.values_list('name', flat=True))
        return data
