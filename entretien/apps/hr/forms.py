# hr/forms.py
# from django import forms
# from .models import InterviewForm

# class InterviewFormForm(forms.ModelForm):
#     class Meta:
#         model = InterviewForm
#         fields = ['level', 'questions']
#         widgets = {
#             'questions': forms.Textarea(attrs={
#                 'rows': 6,
#                 'placeholder': '["Question 1", "Question 2", "Question 3", "Question 4", "Question 5"]'
#             })
#         }

#     def clean_questions(self):
#         questions = self.cleaned_data['questions']
#         if not isinstance(questions, list):
#             raise forms.ValidationError("Les questions doivent être une liste JSON valide.")
#         if len(questions) != 5:
#             raise forms.ValidationError("Vous devez fournir exactement 5 questions.")
#         return questions























# # hr/forms.py
# from django import forms
# from .models import JobOffer, InterviewForm

# class MultiLevelInterviewForm(forms.Form):
#     job_offer = forms.ModelChoiceField(
#         queryset=JobOffer.objects.all(),
#         label="Offre d'emploi"
#     )

#     facile_questions = forms.JSONField(
#         widget=forms.Textarea(attrs={
#             'rows': 4,
#             'placeholder': '["Question 1", "Question 2", "Question 3", "Question 4", "Question 5"]'
#         }),
#         required=False,
#         label="Questions Faciles"
#     )

#     moyen_questions = forms.JSONField(
#         widget=forms.Textarea(attrs={
#             'rows': 4,
#             'placeholder': '["Question 1", "Question 2", "Question 3", "Question 4", "Question 5"]'
#         }),
#         required=False,
#         label="Questions Moyennes"
#     )

#     difficile_questions = forms.JSONField(
#         widget=forms.Textarea(attrs={
#             'rows': 4,
#             'placeholder': '["Question 1", "Question 2", "Question 3", "Question 4", "Question 5"]'
#         }),
#         required=False,
#         label="Questions Difficielles"
#     )

#     def clean(self):
#         cleaned_data = super().clean()
#         job_offer = cleaned_data.get('job_offer')

#         # Vérifier que les questions sont des listes de 5 éléments
#         for field in ['facile_questions', 'moyen_questions', 'difficile_questions']:
#             if data := cleaned_data.get(field):
#                 if not isinstance(data, list):
#                     self.add_error(field, "Les questions doivent être une liste JSON.")
#                 elif len(data) != 5:
#                     self.add_error(field, "Vous devez fournir exactement 5 questions.")

#         return cleaned_data


from django import forms
from .models import JobOffer

class MultiLevelInterviewForm(forms.Form):
    job_offer = forms.ModelChoiceField(
        queryset=JobOffer.objects.all(),
        label="Offre d'emploi"
    )

    facile_questions = forms.JSONField(
        widget=forms.Textarea(attrs={'rows': 4, 'placeholder': '["Q1", "Q2", "Q3", "Q4", "Q5"]'}),
        required=True,
        label="Questions Faciles"
    )

    moyen_questions = forms.JSONField(
        widget=forms.Textarea(attrs={'rows': 4, 'placeholder': '["Q1", "Q2", "Q3", "Q4", "Q5"]'}),
        required=True,
        label="Questions Moyennes"
    )

    difficile_questions = forms.JSONField(
        widget=forms.Textarea(attrs={'rows': 4, 'placeholder': '["Q1", "Q2", "Q3", "Q4", "Q5"]'}),
        required=True,
        label="Questions Difficiles"
    )

    def clean(self):
        cleaned_data = super().clean()
        for field in ['facile_questions', 'moyen_questions', 'difficile_questions']:
            data = cleaned_data.get(field)
            if not isinstance(data, list):
                self.add_error(field, "Les questions doivent être une liste JSON.")
            elif len(data) != 5:
                self.add_error(field, "Vous devez fournir exactement 5 questions.")
        return cleaned_data
