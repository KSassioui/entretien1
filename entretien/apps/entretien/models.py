# # apps/entretien/models.py
# import uuid
# from django.db import models
# from django.utils import timezone
# from apps.candidat.models import Candidat
# from apps.hr.models import JobOffer

# class Entretien(models.Model):
#     """
#     Lien unique envoyé au candidat pour répondre à l'entretien.
#     """
#     candidat = models.ForeignKey(Candidat, on_delete=models.CASCADE, related_name="entretiens")
#     offre = models.ForeignKey(JobOffer, on_delete=models.CASCADE, related_name="entretiens")
#     lien_unique = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
#     date_creation = models.DateTimeField(auto_now_add=True)
#     date_expiration = models.DateTimeField(null=True, blank=True)
#     est_valide = models.BooleanField(default=True)

#     def est_expire(self):
#         if self.date_expiration:
#             return timezone.now() > self.date_expiration
#         return False

#     def __str__(self):
#         return f"Entretien {self.id} - {self.candidat.user.email} ({self.offre.title})"

# class ReponseEntretien(models.Model):
#     """
#     Stocke chaque réponse vidéo d'une question (enregistrée côté navigateur).
#     On ne permet PAS d'upload manuel: seul l'endpoint reçoit le flux encodé par MediaRecorder.
#     """
#     entretien = models.ForeignKey(Entretien, on_delete=models.CASCADE, related_name="reponses")
#     question = models.TextField()
#     video = models.FileField(upload_to="entretiens/videos/")  # fichier reçu via MediaRecorder
#     mime_type = models.CharField(max_length=50, default="video/webm", blank=True)
#     duration_seconds = models.PositiveIntegerField(default=0)  # optionnel si tu veux stocker la durée
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"Réponse à {self.entretien} - {self.question[:30]}..."



# apps/entretien/models.py

import uuid
from django.db import models
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator
from apps.candidat.models import Candidat
from apps.hr.models import JobOffer

class Entretien(models.Model):
    """
    Lien unique envoyé au candidat pour répondre à l'entretien.
    """
    candidat = models.ForeignKey(Candidat, on_delete=models.CASCADE, related_name="entretiens")
    offre = models.ForeignKey(JobOffer, on_delete=models.CASCADE, related_name="entretiens")
    lien_unique = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    date_creation = models.DateTimeField(auto_now_add=True)
    date_expiration = models.DateTimeField(null=True, blank=True)
    est_valide = models.BooleanField(default=True)

    def est_expire(self):
        if self.date_expiration:
            return timezone.now() > self.date_expiration
        return False

    def __str__(self):
        return f"Entretien {self.id} - {self.candidat.user.email} ({self.offre.title})"


class ReponseEntretien(models.Model):
    """
    Stocke chaque réponse vidéo d'une question (enregistrée côté navigateur).
    """
    entretien = models.ForeignKey(Entretien, on_delete=models.CASCADE, related_name="reponses")
    question = models.TextField()
    video = models.FileField(upload_to="entretiens/videos/")
    mime_type = models.CharField(max_length=50, default="video/webm", blank=True)
    duration_seconds = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Réponse à {self.entretien} - {self.question[:30]}..."


class Evaluation(models.Model):
    """
    Note et commentaire du recruteur sur une réponse vidéo.
    """
    reponse = models.OneToOneField(ReponseEntretien, on_delete=models.CASCADE)
    note = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(20)]
    )
    commentaire = models.TextField(blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Note: {self.note}/20 - {self.reponse.question[:30]}"
