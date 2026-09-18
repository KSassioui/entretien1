# # entretien/apps.py
# from django.apps import AppConfig

# class EntretienConfig(AppConfig):
#     default_auto_field = 'django.db.models.BigAutoField'
#     name = 'apps.entretien'



# apps/entretien/apps.py

from django.apps import AppConfig

class EntretienConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.entretien'

    def ready(self):
        import apps.entretien.signals  # noqa (si tu utilises des signaux)