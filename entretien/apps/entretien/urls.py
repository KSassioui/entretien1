
# # apps/entretien/urls.py
# from django.urls import path
# from .views import get_interview_by_uuid, upload_reponse_entretien

# urlpatterns = [
#     path("entretiens/<uuid:uuid>/", get_interview_by_uuid, name="get-interview-by-uuid"),
#     path("entretiens/<uuid:uuid>/reponse/", upload_reponse_entretien, name="upload-reponse"),
# ]



# apps/entretien/urls.py

from django.urls import path
from .views import (
    get_interview_by_uuid,
    upload_reponse_entretien,
    get_candidate_responses,
    save_evaluation
)

urlpatterns = [
    path("entretiens/<uuid:uuid>/", get_interview_by_uuid, name="get-interview-by-uuid"),
    path("entretiens/<uuid:uuid>/reponse/", upload_reponse_entretien, name="upload-reponse"),
    path("entretiens/<uuid:uuid>/responses/", get_candidate_responses, name="get-responses"),
    path("entretiens/save-evaluation/", save_evaluation, name="save-evaluation"),
]