
# apps/entretien/urls.py
from django.urls import path
from .views import get_interview_by_uuid, upload_reponse_entretien

urlpatterns = [
    path("entretiens/<uuid:uuid>/", get_interview_by_uuid, name="get-interview-by-uuid"),
    path("entretiens/<uuid:uuid>/reponse/", upload_reponse_entretien, name="upload-reponse"),
]