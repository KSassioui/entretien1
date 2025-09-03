# from django.db import models

# # Create your models here.

# from django.db import models
# from django.contrib.auth import get_user_model

# User = get_user_model()

# class Candidat(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='candidat_profile')
#     # Ajoute ici les champs spécifiques au candidat
#     phone = models.CharField(max_length=20, blank=True)
#     cv = models.FileField(upload_to='cvs/', blank=True, null=True)
#     linkedin = models.URLField(blank=True)

#     def __str__(self):
#         return f"Candidat: {self.user.get_full_name() or self.user.username}"


from django.db import models
from django.contrib.auth import get_user_model
from apps.hr.models import JobOffer

User = get_user_model()

class Candidat(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="Candidate"
    )
    applied_offers = models.ManyToManyField(
        JobOffer,
        through="Application",  # lien avec une candidature
        related_name="Candidate"
    )

    def _str_(self):
        return self.user.email


class Application(models.Model):
    candidat = models.ForeignKey(Candidat, on_delete=models.CASCADE, related_name="Candidate")
    job_offer = models.ForeignKey(JobOffer, on_delete=models.CASCADE, related_name="applications")
    created_at = models.DateTimeField(auto_now_add=True)
    has_video = models.BooleanField(default=False)  # ✅ important pour ton cas (si le candidat a soumis sa vidéo)

    def _str_(self):
        return f"{self.candidat.user.email} -> {self.job_offer.title}"