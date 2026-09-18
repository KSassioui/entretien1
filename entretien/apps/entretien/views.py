# # apps/entretien/views.py
# from rest_framework import viewsets, status, permissions
# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.response import Response
# from django.utils import timezone
# from .models import Entretien, ReponseEntretien
# from .serializers import EntretienSerializer

# class EntretienViewSet(viewsets.ModelViewSet):
#     queryset = Entretien.objects.all()
#     serializer_class = EntretienSerializer

#     def create(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         entretien = serializer.save()
#         # expiration 24h
#         entretien.date_expiration = timezone.now() + timezone.timedelta(hours=24)
#         entretien.save()
#         return Response(self.get_serializer(entretien).data, status=status.HTTP_201_CREATED)

# @api_view(['GET'])
# @permission_classes([permissions.AllowAny])
# def get_interview_by_uuid(request, uuid):
#     """
#     Frontend charge les questions via ce lien unique (pas d'auth requise).
#     Retourne: candidate_name, job_title, questions[], expires_at.
#     Les questions proviennent du premier InterviewForm de l'offre (comme ton code).
#     """
#     try:
#         entretien = Entretien.objects.select_related('offre', 'candidat__user').get(lien_unique=uuid)

#         if entretien.est_expire() or not entretien.est_valide:
#             return Response({"error": "Lien expiré ou invalide"}, status=404)

#         interview_form = entretien.offre.interview_forms.first()
#         if not interview_form:
#             return Response({"error": "Aucun formulaire trouvé"}, status=404)

#         # Fusionne toutes les questions (facile/moyen/difficile) avec des durées
#         questions_data = []
#         for q_list in [
#             getattr(interview_form, 'questions_facile', []) or [],
#             getattr(interview_form, 'questions_moyen', []) or [],
#             getattr(interview_form, 'questions_difficile', []) or [],
#         ]:
#             for q in q_list:
#                 questions_data.append({
#                     "text": q,
#                     "preparation_time": 30,          # 30s de préparation
#                     "recording_duration": 120        # 2 minutes d'enregistrement
#                 })

#         return Response({
#             "candidate_name": f"{(entretien.candidat.user.first_name or '').strip()} {(entretien.candidat.user.last_name or '').strip()}".strip(),
#             "job_title": entretien.offre.title,
#             "questions": questions_data,
#             "expires_at": entretien.date_expiration
#         }, status=200)

#     except Entretien.DoesNotExist:
#         return Response({"error": "Entretien introuvable"}, status=404)

# @api_view(['POST'])
# @permission_classes([permissions.AllowAny])
# def upload_reponse_entretien(request, uuid):
#     """
#     Reçoit la vidéo encodée par MediaRecorder (ex: video/webm). AUCUN upload manuel permis côté UI.
#     Champs attendus:
#       - video: fichier binaire (Blob)
#       - question: texte de la question affichée
#       - duration_seconds (optionnel)
#       - mime_type (optionnel)
#     """
#     try:
#         entretien = Entretien.objects.get(lien_unique=uuid)
#         if entretien.est_expire() or not entretien.est_valide:
#             return Response({"error": "Lien invalide"}, status=404)

#         video = request.FILES.get('video')
#         question_text = request.POST.get('question', '').strip()
#         duration = int(request.POST.get('duration_seconds', 0))
#         mime_type = request.POST.get('mime_type', 'video/webm')

#         if not video or not question_text:
#             return Response({"error": "Données manquantes"}, status=400)

#         reponse = ReponseEntretien.objects.create(
#             entretien=entretien,
#             question=question_text,
#             video=video,
#             duration_seconds=duration,
#             mime_type=mime_type
#         )
#         return Response({"success": True, "id": reponse.id}, status=201)

#     except Entretien.DoesNotExist:
#         return Response({"error": "Entretien introuvable"}, status=404)


















# version correcte 
# apps/entretien/views.py

from rest_framework import viewsets, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from django.shortcuts import get_object_or_404
from .models import Entretien, ReponseEntretien, Evaluation
from .serializers import EntretienSerializer

class EntretienViewSet(viewsets.ModelViewSet):
    queryset = Entretien.objects.all()
    serializer_class = EntretienSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        entretien = serializer.save()
        entretien.date_expiration = timezone.now() + timezone.timedelta(hours=24)
        entretien.save()
        return Response(self.get_serializer(entretien).data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def get_interview_by_uuid(request, uuid):
    try:
        entretien = Entretien.objects.select_related('offre', 'candidat__user').get(lien_unique=uuid)
        if entretien.est_expire() or not entretien.est_valide:
            return Response({"error": "Lien expiré ou invalide"}, status=404)

        interview_form = entretien.offre.interview_forms.first()
        if not interview_form:
            return Response({"error": "Aucun formulaire trouvé"}, status=404)

        questions_data = []
        for q_list in [
            getattr(interview_form, 'questions_facile', []) or [],
            getattr(interview_form, 'questions_moyen', []) or [],
            getattr(interview_form, 'questions_difficile', []) or [],
        ]:
            for q in q_list:
                questions_data.append({
                    "text": q,
                    "preparation_time": 30,
                    "recording_duration": 120
                })

        return Response({
            "candidate_name": f"{(entretien.candidat.user.first_name or '').strip()} {(entretien.candidat.user.last_name or '').strip()}".strip(),
            "job_title": entretien.offre.title,
            "questions": questions_data,
            "expires_at": entretien.date_expiration
        }, status=200)

    except Entretien.DoesNotExist:
        return Response({"error": "Entretien introuvable"}, status=404)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def upload_reponse_entretien(request, uuid):
    try:
        entretien = Entretien.objects.get(lien_unique=uuid)
        if entretien.est_expire() or not entretien.est_valide:
            return Response({"error": "Lien invalide"}, status=404)

        video = request.FILES.get('video')
        question_text = request.POST.get('question', '').strip()
        duration = int(request.POST.get('duration_seconds', 0))
        mime_type = request.POST.get('mime_type', 'video/webm')

        if not video or not question_text:
            return Response({"error": "Données manquantes"}, status=400)

        reponse = ReponseEntretien.objects.create(
            entretien=entretien,
            question=question_text,
            video=video,
            duration_seconds=duration,
            mime_type=mime_type
        )
        return Response({"success": True, "id": reponse.id}, status=201)

    except Entretien.DoesNotExist:
        return Response({"error": "Entretien introuvable"}, status=404)


# ✅ Nouvelles vues pour l'évaluation
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_candidate_responses(request, uuid):
    try:
        entretien = Entretien.objects.get(lien_unique=uuid)
        if entretien.est_expire() or not entretien.est_valide:
            return Response({"error": "Lien invalide"}, status=404)

        reponses = ReponseEntretien.objects.filter(entretien=entretien)
        evaluations = Evaluation.objects.filter(reponse__in=reponses)
        eval_map = {e.reponse_id: e for e in evaluations}

        data = []
        for r in reponses:
            evaluation = eval_map.get(r.id)
            data.append({
                'id': r.id,
                'video_url': request.build_absolute_uri(r.video.url),
                'question': r.question,
                'note': evaluation.note if evaluation else None,
                'commentaire': evaluation.commentaire if evaluation else "",
            })

        return Response(data)
    except Entretien.DoesNotExist:
        return Response({"error": "Entretien introuvable"}, status=404)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_evaluation(request):
    reponse_id = request.data.get('reponse_id')
    note = request.data.get('note')
    commentaire = request.data.get('commentaire')

    reponse = get_object_or_404(ReponseEntretien, id=reponse_id)

    Evaluation.objects.update_or_create(
        reponse=reponse,
        defaults={'note': note, 'commentaire': commentaire}
    )

    return Response({'success': True})




# from rest_framework import viewsets, status, permissions
# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.permissions import IsAuthenticated
# from rest_framework.response import Response
# from django.utils import timezone
# from django.shortcuts import get_object_or_404
# from .models import Entretien, ReponseEntretien, Evaluation
# from .serializers import EntretienSerializer
# from apps.candidat.models import Application  # ✅ Import critique pour Application

# class EntretienViewSet(viewsets.ModelViewSet):
#     queryset = Entretien.objects.all()
#     serializer_class = EntretienSerializer

#     def create(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         entretien = serializer.save()
#         entretien.date_expiration = timezone.now() + timezone.timedelta(hours=24)
#         entretien.save()
#         return Response(self.get_serializer(entretien).data, status=status.HTTP_201_CREATED)


# @api_view(['GET'])
# @permission_classes([permissions.AllowAny])
# def get_interview_by_uuid(request, uuid):
#     try:
#         entretien = Entretien.objects.select_related('offre', 'candidat__user').get(lien_unique=uuid)
#         if entretien.est_expire() or not entretien.est_valide:
#             return Response({"error": "Lien expiré ou invalide"}, status=404)

#         interview_form = entretien.offre.interview_forms.first()
#         if not interview_form:
#             return Response({"error": "Aucun formulaire trouvé"}, status=404)

#         questions_data = []
#         for q_list in [
#             getattr(interview_form, 'questions_facile', []) or [],
#             getattr(interview_form, 'questions_moyen', []) or [],
#             getattr(interview_form, 'questions_difficile', []) or [],
#         ]:
#             for q in q_list:
#                 questions_data.append({
#                     "text": q,
#                     "preparation_time": 30,
#                     "recording_duration": 120
#                 })

#         return Response({
#             "candidate_name": f"{(entretien.candidat.user.first_name or '').strip()} {(entretien.candidat.user.last_name or '').strip()}".strip(),
#             "job_title": entretien.offre.title,
#             "questions": questions_data,
#             "expires_at": entretien.date_expiration
#         }, status=200)

#     except Entretien.DoesNotExist:
#         return Response({"error": "Entretien introuvable"}, status=404)


# # ✅✅✅ FONCTION CORRIGÉE — upload_reponse_entretien
# @api_view(['POST'])
# @permission_classes([permissions.AllowAny])
# def upload_reponse_entretien(request, uuid):
#     try:
#         # 1. Récupérer l'entretien
#         entretien = Entretien.objects.get(lien_unique=uuid)
#         if entretien.est_expire() or not entretien.est_valide:
#             return Response({"error": "Lien invalide"}, status=404)

#         # 2. Récupérer les données du formulaire
#         video = request.FILES.get('video')
#         question_text = request.POST.get('question', '').strip()
#         duration = int(request.POST.get('duration_seconds', 0))
#         mime_type = request.POST.get('mime_type', 'video/webm')

#         # 3. Valider les données
#         if not video or not question_text:
#             return Response({"error": "Données manquantes"}, status=400)

#         # 4. Créer la réponse vidéo
#         reponse = ReponseEntretien.objects.create(
#             entretien=entretien,
#             question=question_text,
#             video=video,
#             duration_seconds=duration,
#             mime_type=mime_type
#         )

#         # ✅✅✅ 5. MISE À JOUR CRUCIALE : Marquer l'application comme ayant une vidéo
#         try:
#             application = Application.objects.get(
#                 candidat=entretien.candidat,
#                 job_offer=entretien.offre
#             )
#             if not application.has_video:
#                 application.has_video = True
#                 application.save()
#                 print(f"[INFO] ✅ Application {application.id} mise à jour → has_video = True")
#             else:
#                 print(f"[INFO] Application {application.id} déjà marquée comme ayant une vidéo.")
#         except Application.DoesNotExist:
#             print(f"[ERREUR] ❌ Aucune candidature trouvée pour candidat {entretien.candidat.id} et offre {entretien.offre.id}")

#         # 6. Répondre au frontend
#         return Response({"success": True, "id": reponse.id}, status=201)

#     except Entretien.DoesNotExist:
#         return Response({"error": "Entretien introuvable"}, status=404)
#     except Exception as e:
#         print(f"[ERREUR] Exception in upload_reponse_entretien: {str(e)}")
#         return Response({"error": "Erreur serveur"}, status=500)


# # ✅ Nouvelles vues pour l'évaluation
# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def get_candidate_responses(request, uuid):
#     try:
#         entretien = Entretien.objects.get(lien_unique=uuid)
#         if entretien.est_expire() or not entretien.est_valide:
#             return Response({"error": "Lien invalide"}, status=404)

#         reponses = ReponseEntretien.objects.filter(entretien=entretien)
#         evaluations = Evaluation.objects.filter(reponse__in=reponses)
#         eval_map = {e.reponse_id: e for e in evaluations}

#         data = []
#         for r in reponses:
#             evaluation = eval_map.get(r.id)
#             data.append({
#                 'id': r.id,
#                 'video_url': request.build_absolute_uri(r.video.url),
#                 'question': r.question,
#                 'note': evaluation.note if evaluation else None,
#                 'commentaire': evaluation.commentaire if evaluation else "",
#             })

#         return Response(data)
#     except Entretien.DoesNotExist:
#         return Response({"error": "Entretien introuvable"}, status=404)


# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def save_evaluation(request):
#     reponse_id = request.data.get('reponse_id')
#     note = request.data.get('note')
#     commentaire = request.data.get('commentaire')

#     reponse = get_object_or_404(ReponseEntretien, id=reponse_id)

#     Evaluation.objects.update_or_create(
#         reponse=reponse,
#         defaults={'note': note, 'commentaire': commentaire}
#     )

#     return Response({'success': True})