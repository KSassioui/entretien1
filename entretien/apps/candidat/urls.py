


# from django.urls import path
# from .views import CandidatListCreateView, CandidatDetailView
# from .views import candidats_by_offer
# from .views import applied_offers, apply_offer

# urlpatterns = [
#     path("candidats/", CandidatListCreateView.as_view(), name="candidat-list-create"),
#     path("candidats/<int:pk>/", CandidatDetailView.as_view(), name="candidat-detail"),
#     path("offers/<int:offer_id>/candidats/", candidats_by_offer, name="candidats-by-offer"),
#     path("applied/", applied_offers, name="applied-offers"),
#     path("apply/", apply_offer, name="apply-offer"),
# ]



# apps/candidat/urls.py
from django.urls import path
from .views import (
    CandidatListCreateView,
    CandidatDetailView,
    candidats_by_offer,
    applied_offers,
    apply_offer,
    send_interview_link  # ✅ Nouvelle vue
)

urlpatterns = [
    path("candidats/", CandidatListCreateView.as_view(), name="candidat-list-create"),
    path("candidats/<int:pk>/", CandidatDetailView.as_view(), name="candidat-detail"),
    path("offers/<int:offer_id>/candidats/", candidats_by_offer, name="candidats-by-offer"),
    path("applied/", applied_offers, name="applied-offers"),
    path("apply/", apply_offer, name="apply-offer"),
    path("send-interview-link/", send_interview_link, name="send-interview-link"),  # ✅ Route ajoutée
]