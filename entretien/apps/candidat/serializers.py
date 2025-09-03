# from rest_framework import serializers
# from .models import Candidat

# class CandidatSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Candidat
#         fields = ['id', 'user', 'phone', 'cv', 'linkedin']
#         read_only_fields = ['id', 'user']




#                //ver aya
# from rest_framework import serializers
# from .models import Candidat

# class CandidatSerializer(serializers.ModelSerializer):
#     email = serializers.EmailField(source="user.email", read_only=True)

#     class Meta:
#         model = Candidat
#         fields = ["id", "email", "job_offer", "has_video", "created_at"]



from rest_framework import serializers
from .models import Candidat


class CandidatSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = Candidat
        fields = ["id", "email", "job_offer", "has_video", "created_at"]
