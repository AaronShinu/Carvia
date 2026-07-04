from django.contrib import admin
from .models import CalendarEvent

# Register your models here.
@admin.register(CalendarEvent)
class CalendarEventAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'start_time', 'event_type', 'sent_reminder')
    list_filter = ('event_type', 'sent_reminder')
    search_fields = ('title', 'user__email')