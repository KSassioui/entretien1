# # apps/entretien/serializers.py
# from rest_framework import serializers
# from .models import Entretien, ReponseEntretien

# class EntretienSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Entretien
#         fields = "__all__"
#         read_only_fields = ["lien_unique", "date_creation", "date_expiration"]

# class EntretienDetailSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Entretien
#         fields = ["lien_unique", "offre", "candidat", "date_expiration"]

# class ReponseEntretienSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = ReponseEntretien
#         fields = "__all__"
#         read_only_fields = ["created_at"]



# apps/entretien/serializers.py

from rest_framework import serializers
from .models import Entretien, ReponseEntretien, Evaluation

class EntretienSerializer(serializers.ModelSerializer):
    class Meta:
        model = Entretien
        fields = "__all__"
        read_only_fields = ["lien_unique", "date_creation", "date_expiration"]

class ReponseEntretienSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReponseEntretien
        fields = "__all__"

class EvaluationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evaluation
        fields = "__all__"