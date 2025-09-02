from rest_framework import serializers
from .models import Candidat

class CandidatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidat
        fields = ['id', 'user', 'phone', 'cv', 'linkedin']
        read_only_fields = ['id', 'user']