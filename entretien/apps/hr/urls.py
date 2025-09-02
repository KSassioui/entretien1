# from django.urls import path
# from .views import JobOfferListCreateView, create_interview_form, update_interview_form, get_interview_forms 

# urlpatterns = [
#     path('offers/', JobOfferListCreateView.as_view(), name='offer-list-create'),
#      # Gestion des formulaires d'entretien
#     path('offers/<int:offer_id>/interview-form/create/', create_interview_form, name='create-interview-form'),
#     path('offers/<int:offer_id>/interview-form/<str:level>/update/', update_interview_form, name='update-interview-form'),
#     path('offers/<int:offer_id>/interview-forms/', get_interview_forms, name='get-interview-forms'),
# ]



from django.urls import path
from .views import JobOfferListCreateView, InterviewFormListCreateView, InterviewFormDetailView

urlpatterns = [
    path('offers/', JobOfferListCreateView.as_view(), name='offer-list-create'),
    path('offers/<int:offer_id>/interview-forms/', InterviewFormListCreateView.as_view(), name='interview-list-create'),
    path('interview-forms/<int:pk>/', InterviewFormDetailView.as_view(), name='interview-detail'),
]
