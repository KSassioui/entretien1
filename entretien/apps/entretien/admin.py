# apps/entretien/admin.py
from django.contrib import admin
from django.utils.html import format_html
from .models import Entretien, ReponseEntretien

class ReponseEntretienInline(admin.TabularInline):
    model = ReponseEntretien
    extra = 0
    readonly_fields = ('created_at', 'mime_type', 'duration_seconds')
    fields = ('question', 'video', 'mime_type', 'duration_seconds', 'created_at')

@admin.register(Entretien)
class EntretienAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_candidat', 'get_offre', 'date_creation', 'est_valide', 'get_lien')
    list_filter = ('est_valide', 'date_creation')
    search_fields = ('candidat__user__email', 'offre__title')
    readonly_fields = ('lien_unique', 'date_creation')
    inlines = [ReponseEntretienInline]

    def get_candidat(self, obj):
        return obj.candidat.user.email
    get_candidat.short_description = 'Candidat'

    def get_offre(self, obj):
        return obj.offre.title
    get_offre.short_description = 'Offre'

    def get_lien(self, obj):
        url = f"http://localhost:3000/interview/{obj.lien_unique}"
        return format_html('<a href="{}" target="_blank">🔗 Ouvrir</a>', url)
    get_lien.short_description = "Lien d'entretien"

    fieldsets = (
        ('Informations', {
            'fields': (
                'candidat', 'offre',
                ('date_creation', 'date_expiration'),
                'est_valide'
            )
        }),
        ('Détails techniques', {
            'fields': ('lien_unique',),
            'classes': ('collapse',)
        }),
    )

@admin.register(ReponseEntretien)
class ReponseEntretienAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_candidat', 'short_question', 'created_at', 'voir_video')
    list_filter = ('created_at', 'entretien__est_valide')
    search_fields = ('entretien__candidat__user__email', 'question')
    readonly_fields = ('created_at', 'mime_type', 'duration_seconds')

    def get_candidat(self, obj):
        return obj.entretien.candidat.user.email
    get_candidat.short_description = 'Candidat'

    def short_question(self, obj):
        return obj.question[:50] + '...' if len(obj.question) > 50 else obj.question
    short_question.short_description = 'Question'

    def voir_video(self, obj):
        if obj.video:
            return format_html('<a href="{}" target="_blank">📹 Voir la vidéo</a>', obj.video.url)
        return "Pas de vidéo"
    voir_video.short_description = "Vidéo"

    fieldsets = (('Réponse', {
        'fields': ('entretien', 'question', 'video', 'mime_type', 'duration_seconds', 'created_at')
    }),)
