from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin 
from .models import User

# Register your models here.
@admin.register(User)
class UserAdmin(BaseUserAdmin): 
    list_display = ('email', 'username', 'university', 'graduation_year', 'is_staff')
    search_fields = ('email', 'username', 'university')
    ordering = ('email',)
    fieldsets = BaseUserAdmin.fieldsets + (
    (
        'Carvia Profile',
        {
            'fields': (
                'university',
                'university_course',
                'graduation_year',
                'email_reminders_toggle_enabled',
            )
        }
    ),
)