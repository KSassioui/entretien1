# from django.contrib import admin

# # Register your models here.


# from django.contrib import admin
# from .models import JobOffer, InterviewForm

# @admin.register(JobOffer)
# class JobOfferAdmin(admin.ModelAdmin):
#     list_display = ('title', 'hr', 'location', 'created_at')
#     search_fields = ('title', 'location', 'hr__email')  # recherche par titre, lieu ou email du HR
#     list_filter = ('created_at',)



# # 🔽 Ajoute ceci pour voir les formulaires d'entretien dans /admin
# @admin.register(InterviewForm)
# class InterviewFormAdmin(admin.ModelAdmin):
#     list_display = ('job_offer', 'level', 'created_at')
#     list_filter = ('level', 'job_offer', 'created_at')
#     search_fields = ('job_offer__title', 'level')
#     readonly_fields = ('questions', 'created_at')  # Pour éviter les modifications accidentelles

#     # Optionnel : afficher les questions en format lisible
#     def questions_display(self, obj):
#         return "\n".join(obj.questions)
#     questions_display.short_description = "Questions"











# # hr/admin.py
# from django.contrib import admin
# from django import forms
# from .models import JobOffer, InterviewForm

# @admin.register(JobOffer)
# class JobOfferAdmin(admin.ModelAdmin):
#     list_display = ('title', 'hr', 'location', 'created_at')
#     search_fields = ('title', 'location', 'hr__email')
#     list_filter = ('created_at',)

# class InterviewFormAdminForm(forms.ModelForm):
#     class Meta:
#         model = InterviewForm
#         fields = '__all__'
#         widgets = {
#             'questions': forms.Textarea(attrs={
#                 'rows': 6,
#                 'placeholder': '["Question 1", "Question 2", "Question 3", "Question 4", "Question 5"]',
#                 'style': 'font-family: monospace;',
#                 'class': 'vLargeTextField'
#             })
#         }

# @admin.register(InterviewForm)
# class InterviewFormAdmin(admin.ModelAdmin):
#     form = InterviewFormAdminForm
#     list_display = ('job_offer', 'level', 'get_questions_preview', 'created_at')
#     list_filter = ('level', 'job_offer', 'created_at')
#     search_fields = ('job_offer__title', 'level')

#     def get_questions_preview(self, obj):
#         return ", ".join(obj.questions[:3]) + "..." if len(obj.questions) > 3 else ", ".join(obj.questions)
#     get_questions_preview.short_description = "Aperçu questions"





























# # hr/admin.py
# from django.contrib import admin
# from django import forms
# from .models import JobOffer, InterviewForm
# from .forms import MultiLevelInterviewForm

# @admin.register(JobOffer)
# class JobOfferAdmin(admin.ModelAdmin):
#     list_display = ('title', 'hr', 'location', 'created_at')
#     search_fields = ('title', 'location', 'hr__email')
#     list_filter = ('created_at',)

# @admin.register(InterviewForm)
# class InterviewFormAdmin(admin.ModelAdmin):
#     list_display = ('job_offer', 'level', 'created_at')
#     list_filter = ('level', 'job_offer', 'created_at')
#     search_fields = ('job_offer__title', 'level')

#     def get_questions_preview(self, obj):
#         return ", ".join(obj.questions[:3]) + "..." if len(obj.questions) > 3 else ", ".join(obj.questions)
#     get_questions_preview.short_description = "Aperçu questions"

# # ✅ Nouveau ModelAdmin pour ajouter les 3 niveaux en même temps
# class MultiLevelInterviewFormAdmin(admin.ModelAdmin):
#     model = InterviewForm
#     form = MultiLevelInterviewForm
#     list_display = ('job_offer', 'level', 'created_at')
#     list_filter = ('Level', 'job_offer', 'created_at')

#     def add_view(self, request, form_url='', extra_context=None):
#         # Rediriger vers le formulaire personnalisé
#         return super().add_view(request, form_url, extra_context)

#     def save_model(self, request, obj, form, change):
#         # Sauvegarder chaque niveau séparément
#         job_offer = form.cleaned_data['job_offer']

#         levels = [
#             ('facile', form.cleaned_data['facile_questions']),
#             ('moyen', form.cleaned_data['moyen_questions']),
#             ('difficile', form.cleaned_data['difficile_questions'])
#         ]

#         for level, questions in levels:
#             if questions:  # Si il y a des questions
#                 try:
#                     form_obj = InterviewForm.objects.get(job_offer=job_offer, level=level)
#                     form_obj.questions = questions
#                     form_obj.save()
#                 except InterviewForm.DoesNotExist:
#                     InterviewForm.objects.create(
#                         job_offer=job_offer,
#                         level=level,
#                         questions=questions
#                     )
#         # Ne pas sauvegarder l'objet original


from django.contrib import admin
from .models import JobOffer, InterviewForm
from .forms import MultiLevelInterviewForm

@admin.register(JobOffer)
class JobOfferAdmin(admin.ModelAdmin):
    list_display = ('title', 'hr', 'location', 'created_at')
    search_fields = ('title', 'location', 'hr__email')
    list_filter = ('created_at',)

@admin.register(InterviewForm)
class InterviewFormAdmin(admin.ModelAdmin):
    list_display = ('job_offer', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('job_offer__title',)
