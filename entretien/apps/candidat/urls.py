# from django.urls import path
# from .views import CandidatDetailView

# urlpatterns = [
#     path('me/', CandidatDetailView.as_view(), name='candidat-detail'),
# ]



from django.urls import path
from .views import CandidatListCreateView, CandidatDetailView
from .views import candidats_by_offer
from .views import applied_offers, apply_offer

urlpatterns = [
    path("candidats/", CandidatListCreateView.as_view(), name="candidat-list-create"),
    path("candidats/<int:pk>/", CandidatDetailView.as_view(), name="candidat-detail"),
    path("offers/<int:offer_id>/candidats/", candidats_by_offer, name="candidats-by-offer"),
    path("applied/", applied_offers, name="applied-offers"),
    path("apply/", apply_offer, name="apply-offer"),
]