from django.shortcuts import render

from rest_framework import generics, permissions
from .models import Candidat
from .serializers import CandidatSerializer

class CandidatDetailView(generics.RetrieveUpdateAPIView):
    queryset = Candidat.objects.all()
    serializer_class = CandidatSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # Retourne le profil du candidat connecté
        return Candidat.objects.get(user=self.request.user)