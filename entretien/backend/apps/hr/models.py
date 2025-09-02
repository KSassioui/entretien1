
from django.db import models
from django.conf import settings

class JobOffer(models.Model):
    hr = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="job_offers"
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    location = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
    

    
# # NOUVEAU : Ce modèle va stocker les questions d'entretien
# class InterviewForm(models.Model):
#     LEVEL_CHOICES = [
#         ('facile', 'Facile'),
#         ('moyen', 'Moyen'),
#         ('difficile', 'Difficile'),
#     ]

#     # Lien vers l'offre
#     job_offer = models.ForeignKey(
#         JobOffer,
#         on_delete=models.CASCADE,
#         related_name='interview_forms'  # Permet de faire : mon_offre.interview_forms.all()
#     )

#     # Niveau : facile, moyen ou difficile
#     level = models.CharField(max_length=10, choices=LEVEL_CHOICES)

#     # Les 5 questions (stockées sous forme de liste)
#     questions = models.JSONField(default=list)  # Ex: ["Q1", "Q2", ...]

#     # Date de création
#     created_at = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         # Pour éviter d'avoir deux fois "facile" pour la même offre
#         unique_together = ('job_offer', 'level')

#     def __str__(self):
#         return f"{self.level} - {self.job_offer.title}"

# Formulaire d'entretien avec les 3 niveaux dans un seul formulaire
class InterviewForm(models.Model):
    job_offer = models.ForeignKey(
        'JobOffer',
        on_delete=models.CASCADE,
        related_name='interview_forms'
    )
    questions_facile = models.JSONField(default=list)     # 5 questions faciles
    questions_moyen = models.JSONField(default=list)      # 5 questions moyennes
    questions_difficile = models.JSONField(default=list)  # 5 questions difficiles
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Formulaire d'entretien - {self.job_offer.title}"