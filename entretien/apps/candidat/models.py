from django.db import models

# Create your models here.

from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Candidat(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='candidat_profile')
    # Ajoute ici les champs spécifiques au candidat
    phone = models.CharField(max_length=20, blank=True)
    cv = models.FileField(upload_to='cvs/', blank=True, null=True)
    linkedin = models.URLField(blank=True)

    def __str__(self):
        return f"Candidat: {self.user.get_full_name() or self.user.username}"