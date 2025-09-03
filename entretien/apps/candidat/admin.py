# from django.contrib import admin

# # Register your models here.
# from django.contrib import admin
# from .models import Candidat

# admin.site.register(Candidat)



from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Candidat
from .models import Application

admin.site.register(Candidat)
admin.site.register(Application)