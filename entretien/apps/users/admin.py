


# from django.contrib import admin
# from django.contrib.auth.admin import UserAdmin
# from .models import User

# @admin.register(User)
# class CustomUserAdmin(UserAdmin):
#     model = User
#     list_display = ('email', 'role', 'is_staff', 'is_active')
#     ordering = ('email',)
#     search_fields = ('email',)
    
#     fieldsets = (
#         (None, {'fields': ('email', 'password')}),
#         ('Permissions', {'fields': ('is_staff', 'is_active', 'is_superuser', 'groups', 'user_permissions')}),
#         ('Important dates', {'fields': ('last_login', 'date_joined')}),
#         ('Extra Fields', {'fields': ('role',)}),
#     )
    
#     add_fieldsets = (
#         (None, {
#             'classes': ('wide',),
#             'fields': ('email', 'password1', 'password2', 'is_staff', 'is_active', 'role')}
#         ),
#     )



# //ver aya
# from django.contrib import admin
# from django.contrib.auth.admin import UserAdmin
# from .models import User

# @admin.register(User)
# class CustomUserAdmin(UserAdmin):
#     model = User
#     list_display = ('email', 'role', 'is_staff', 'is_active')
#     ordering = ('email',)
#     search_fields = ('email',)
    
#     fieldsets = (
#         (None, {'fields': ('email', 'password')}),
#         ('Permissions', {'fields': ('is_staff', 'is_active', 'is_superuser', 'groups', 'user_permissions')}),
#         ('Important dates', {'fields': ('last_login', 'date_joined')}),
#         ('Extra Fields', {'fields': ('role',)}),
#     )
    
#     add_fieldsets = (
#         (None, {
#             'classes': ('wide',),
#             'fields': ('email', 'password1', 'password2', 'is_staff', 'is_active', 'role')}
#         ),
#     )


from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ('email', 'role', 'is_staff', 'is_active')
    ordering = ('email',)
    search_fields = ('email',)

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Permissions', {'fields': ('is_staff', 'is_active', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
        ('Extra Fields', {'fields': ('role',)}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'is_staff', 'is_active', 'role'),
        }),
    )
