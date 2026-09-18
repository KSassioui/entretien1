# apps/entretien/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import ReponseEntretien
from apps.candidat.models import Application

@receiver(post_save, sender=ReponseEntretien)
def update_application_has_video(sender, instance, created, **kwargs):
    if created:
        # Trouver l'application liée à cet entretien
        application = instance.entretien.candidat.application_set.filter(
            job_offer=instance.entretien.offre
        ).first()
        if application and not application.has_video:
            application.has_video = True
            application.save()