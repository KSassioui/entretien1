# from django.shortcuts import render

# # Create your views here.





# from rest_framework import generics, permissions
# from .models import JobOffer
# from .serializers import JobOfferSerializer

# class JobOfferListCreateView(generics.ListCreateAPIView):
#     serializer_class = JobOfferSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def get_queryset(self):
#         return JobOffer.objects.filter(hr=self.request.user)

#     def perform_create(self, serializer):
#         serializer.save(hr=self.request.user)











# # hr/views.py
# from rest_framework import generics, permissions, status
# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.response import Response
# from django.shortcuts import get_object_or_404
# from .models import JobOffer, InterviewForm
# from .serializers import JobOfferSerializer, InterviewFormSerializer

# # --- Vue existante ---
# class JobOfferListCreateView(generics.ListCreateAPIView):
#     serializer_class = JobOfferSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def get_queryset(self):
#         return JobOffer.objects.filter(hr=self.request.user)

#     def perform_create(self, serializer):
#         serializer.save(hr=self.request.user)

# # --- Nouvelles vues pour les formulaires d'entretien ---

# @api_view(['POST'])
# @permission_classes([permissions.IsAuthenticated])
# def create_interview_form(request, offer_id):
#     """
#     Créer un formulaire d'entretien (facile/moyen/difficile) pour une offre
#     """
#     offer = get_object_or_404(JobOffer, id=offer_id, hr=request.user)
#     level = request.data.get('level')
#     questions = request.data.get('questions', [])

#     if level not in ['facile', 'moyen', 'difficile']:
#         return Response(
#             {'error': 'Niveau invalide. Utilisez: facile, moyen, difficile.'},
#             status=status.HTTP_400_BAD_REQUEST
#         )

#     if len(questions) != 5:
#         return Response(
#             {'error': 'Vous devez fournir exactement 5 questions.'},
#             status=status.HTTP_400_BAD_REQUEST
#         )

#     # Vérifie si déjà existant
#     if InterviewForm.objects.filter(job_offer=offer, level=level).exists():
#         return Response(
#             {'error': f'Un formulaire "{level}" existe déjà pour cette offre.'},
#             status=status.HTTP_400_BAD_REQUEST
#         )

#     # Création
#     form = InterviewForm.objects.create(
#         job_offer=offer,
#         level=level,
#         questions=questions
#     )
#     serializer = InterviewFormSerializer(form)
#     return Response(serializer.data, status=status.HTTP_201_CREATED)


# @api_view(['PUT'])
# @permission_classes([permissions.IsAuthenticated])
# def update_interview_form(request, offer_id, level):
#     """
#     Mettre à jour un formulaire existant
#     """
#     try:
#         form = InterviewForm.objects.get(job_offer_id=offer_id, level=level, job_offer__hr=request.user)
#         questions = request.data.get('questions', [])
#         if len(questions) != 5:
#             return Response(
#                 {'error': 'Vous devez fournir exactement 5 questions.'},
#                 status=status.HTTP_400_BAD_REQUEST
#             )
#         form.questions = questions
#         form.save()
#         serializer = InterviewFormSerializer(form)
#         return Response(serializer.data)
#     except InterviewForm.DoesNotExist:
#         return Response(
#             {'error': 'Formulaire non trouvé ou vous n’avez pas les droits.'},
#             status=status.HTTP_404_NOT_FOUND
#         )


# @api_view(['GET'])
# @permission_classes([permissions.IsAuthenticated])
# def get_interview_forms(request, offer_id):
#     """
#     Récupérer tous les formulaires d'une offre
#     """
#     forms = InterviewForm.objects.filter(job_offer_id=offer_id, job_offer__hr=request.user)
#     serializer = InterviewFormSerializer(forms, many=True)
#     return Response(serializer.data)




    











# # hr/views.py
# from rest_framework import generics, permissions, status
# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.response import Response
# from django.shortcuts import get_object_or_404
# from .models import JobOffer, InterviewForm
# from .serializers import JobOfferSerializer, InterviewFormSerializer

# class JobOfferListCreateView(generics.ListCreateAPIView):
#     serializer_class = JobOfferSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def get_queryset(self):
#         return JobOffer.objects.filter(hr=self.request.user)

#     def perform_create(self, serializer):
#         serializer.save(hr=self.request.user)

# @api_view(['POST'])
# @permission_classes([permissions.IsAuthenticated])
# def create_interview_form(request, offer_id):
#     try:
#         offer = get_object_or_404(JobOffer, id=offer_id, hr=request.user)
#         level = request.data.get('level')
#         questions = request.data.get('questions', [])

#         if level not in ['facile', 'moyen', 'difficile']:
#             return Response(
#                 {'error': 'Niveau invalide. Utilisez: facile, moyen, difficile.'},
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         if len(questions) != 5:
#             return Response(
#                 {'error': 'Vous devez fournir exactement 5 questions.'},
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         if InterviewForm.objects.filter(job_offer=offer, level=level).exists():
#             return Response(
#                 {'error': f'Un formulaire "{level}" existe déjà pour cette offre.'},
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         form = InterviewForm.objects.create(
#             job_offer=offer,
#             level=level,
#             questions=questions
#         )
#         serializer = InterviewFormSerializer(form)
#         return Response(serializer.data, status=status.HTTP_201_CREATED)

#     except Exception as e:
#         return Response(
#             {'error': 'Erreur serveur interne.'},
#             status=status.HTTP_500_INTERNAL_SERVER_ERROR
#         )

# @api_view(['PUT'])
# @permission_classes([permissions.IsAuthenticated])
# def update_interview_form(request, offer_id, level):
#     try:
#         form = InterviewForm.objects.get(job_offer_id=offer_id, level=level, job_offer__hr=request.user)
#         questions = request.data.get('questions', [])
#         if len(questions) != 5:
#             return Response(
#                 {'error': 'Vous devez fournir exactement 5 questions.'},
#                 status=status.HTTP_400_BAD_REQUEST
#             )
#         form.questions = questions
#         form.save()
#         serializer = InterviewFormSerializer(form)
#         return Response(serializer.data)
#     except InterviewForm.DoesNotExist:
#         return Response(
#             {'error': 'Formulaire non trouvé ou vous n’avez pas les droits.'},
#             status=status.HTTP_404_NOT_FOUND
#         )

# @api_view(['GET'])
# @permission_classes([permissions.IsAuthenticated])
# def get_interview_forms(request, offer_id):
#     forms = InterviewForm.objects.filter(job_offer_id=offer_id, job_offer__hr=request.user)
#     serializer = InterviewFormSerializer(forms, many=True)
#     return Response(serializer.data)




from rest_framework import generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import JobOffer, InterviewForm
from .serializers import JobOfferSerializer, InterviewFormSerializer

class JobOfferListCreateView(generics.ListCreateAPIView):
    serializer_class = JobOfferSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        # Si l'utilisateur est RH, il ne voit que ses offres
        if hasattr(user, 'Recruteur'):  # ou autre attribut qui identifie un RH
            return JobOffer.objects.filter(hr=user)
        # Sinon (candidat ou autre), il voit toutes les offres
        return JobOffer.objects.all()

    def perform_create(self, serializer):
        serializer.save(hr=self.request.user)

class InterviewFormListCreateView(generics.ListCreateAPIView):
    serializer_class = InterviewFormSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        offer_id = self.kwargs.get('offer_id')
        return InterviewForm.objects.filter(job_offer_id=offer_id, job_offer__hr=self.request.user)

    def perform_create(self, serializer):
        offer_id = self.kwargs.get('offer_id')
        offer = get_object_or_404(JobOffer, id=offer_id, hr=self.request.user)
        serializer.save(job_offer=offer)

class InterviewFormDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = InterviewFormSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = InterviewForm.objects.all()
