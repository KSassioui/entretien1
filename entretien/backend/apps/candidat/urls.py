from django.urls import path
from .views import CandidatDetailView

urlpatterns = [
    path('me/', CandidatDetailView.as_view(), name='candidat-detail'),
]