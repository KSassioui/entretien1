# from django.shortcuts import render

# from rest_framework import generics, permissions
# from .models import Candidat
# from .serializers import CandidatSerializer

# class CandidatDetailView(generics.RetrieveUpdateAPIView):
#     queryset = Candidat.objects.all()
#     serializer_class = CandidatSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def get_object(self):
#         # Retourne le profil du candidat connecté
#         return Candidat.objects.get(user=self.request.user)






# //ver aya
# from rest_framework import generics
# from .models import Candidat
# from .serializers import CandidatSerializer
# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.permissions import IsAuthenticated
# from rest_framework.response import Response
# from .models import Application
# from apps.hr.models import JobOffer


# # Liste + Création
# class CandidatListCreateView(generics.ListCreateAPIView):
#     queryset = Candidat.objects.all()
#     serializer_class = CandidatSerializer
#     permission_classes = [IsAuthenticated]

#     def perform_create(self, serializer):
#         serializer.save(user=self.request.user)


# # Récupérer, mettre à jour, supprimer
# class CandidatDetailView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = Candidat.objects.all()
#     serializer_class = CandidatSerializer
#     permission_classes = [IsAuthenticated]






# @api_view(["GET"])
# @permission_classes([IsAuthenticated])
# def candidats_by_offer(request, offer_id):
#     applications = Application.objects.filter(job_offer_id=offer_id)
#     data = [
#         {
#             "id": app.id,
#             "email": app.candidat.user.email,
#             "interviewStatus": "Enregistré" if app.has_video else "Non Enregistré",
#             "requestStatus": "Lien envoyé" if app.has_video else "Pas de demande",
#         }
#         for app in applications
#     ]
#     return Response(data)


# @api_view(["GET"])
# @permission_classes([IsAuthenticated])
# def applied_offers(request):
#     """Return a list of job offers the authenticated candidate has applied to."""
#     try:
#         candidat = Candidat.objects.get(user=request.user)
#     except Candidat.DoesNotExist:
#         return Response([])

#     applications = Application.objects.filter(candidat=candidat).select_related("job_offer")
#     offers = [
#         {
#             "id": app.job_offer.id,
#             "title": app.job_offer.title,
#             "description": app.job_offer.description,
#             "location": app.job_offer.location,
#         }
#         for app in applications
#     ]
#     return Response(offers)


# @api_view(["POST"])
# @permission_classes([IsAuthenticated])
# def apply_offer(request):
#     """Create an Application linking the authenticated candidate and the job offer.

#     Expects JSON: { "offer_id": <id> }
#     """
#     offer_id = request.data.get("offer_id") or request.data.get("offerId")
#     if not offer_id:
#         return Response({"detail": "offer_id is required"}, status=400)

#     try:
#         job_offer = JobOffer.objects.get(id=offer_id)
#     except JobOffer.DoesNotExist:
#         return Response({"detail": "Offer not found"}, status=404)

#     candidat, _ = Candidat.objects.get_or_create(user=request.user)

#     # Prevent duplicate applications
#     if Application.objects.filter(candidat=candidat, job_offer=job_offer).exists():
#         return Response({"detail": "You have already applied to this offer."}, status=400)

#     application = Application.objects.create(candidat=candidat, job_offer=job_offer)
#     return Response({"detail": "Applied", "application_id": application.id}, status=201)


from rest_framework import generics
from .models import Candidat, Application
from .serializers import CandidatSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from apps.hr.models import JobOffer


# Liste + Création
class CandidatListCreateView(generics.ListCreateAPIView):
    queryset = Candidat.objects.all()
    serializer_class = CandidatSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# Récupérer, mettre à jour, supprimer
class CandidatDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Candidat.objects.all()
    serializer_class = CandidatSerializer
    permission_classes = [IsAuthenticated]


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def candidats_by_offer(request, offer_id):
    applications = Application.objects.filter(job_offer_id=offer_id)
    data = [
        {
            "id": app.id,
            "email": app.candidat.user.email,
            "interviewStatus": "Enregistré" if app.has_video else "Non Enregistré",
            "requestStatus": "Lien envoyé" if app.has_video else "Pas de demande",
        }
        for app in applications
    ]
    return Response(data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def applied_offers(request):
    """Return a list of job offers the authenticated candidate has applied to."""
    try:
        candidat = Candidat.objects.get(user=request.user)
    except Candidat.DoesNotExist:
        return Response([])

    applications = Application.objects.filter(candidat=candidat).select_related("job_offer")
    offers = [
        {
            "id": app.job_offer.id,
            "title": app.job_offer.title,
            "description": app.job_offer.description,
            "location": app.job_offer.location,
        }
        for app in applications
    ]
    return Response(offers)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def apply_offer(request):
    """Create an Application linking the authenticated candidate and the job offer.

    Expects JSON: { "offer_id": <id> }
    """
    offer_id = request.data.get("offer_id") or request.data.get("offerId")
    if not offer_id:
        return Response({"detail": "offer_id is required"}, status=400)

    try:
        job_offer = JobOffer.objects.get(id=offer_id)
    except JobOffer.DoesNotExist:
        return Response({"detail": "Offer not found"}, status=404)

    candidat, _ = Candidat.objects.get_or_create(user=request.user)

    # Prevent duplicate applications
    if Application.objects.filter(candidat=candidat, job_offer=job_offer).exists():
        return Response({"detail": "You have already applied to this offer."}, status=400)

    application = Application.objects.create(candidat=candidat, job_offer=job_offer)
    return Response({"detail": "Applied", "application_id": application.id}, status=201)
