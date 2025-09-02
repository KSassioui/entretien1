# from rest_framework import serializers
# from .models import JobOffer,InterviewForm

# class JobOfferSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = JobOffer
#         fields = ['id', 'title', 'description', 'location', 'created_at']

    

# # NOUVEAU : Pour envoyer les questions en JSON
# class InterviewFormSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = InterviewForm
#         fields = ['id', 'job_offer', 'level', 'questions', 'created_at']





from rest_framework import serializers
from .models import JobOffer, InterviewForm

class JobOfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobOffer
        fields = ['id', 'title', 'description', 'location', 'created_at']

class InterviewFormSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterviewForm
        fields = ['id', 'job_offer', 'questions_facile', 'questions_moyen', 'questions_difficile', 'created_at']

    def validate(self, data):
        for field in ['questions_facile', 'questions_moyen', 'questions_difficile']:
            if len(data.get(field, [])) != 5:
                raise serializers.ValidationError(f"Vous devez fournir exactement 5 questions pour {field}.")
        return data
