from rest_framework import serializers
from .models import CalendarEvent

class CalendarEventSerializer(serializers.ModelSerializer):
    event_type_display = serializers.CharField(source='get_event_type_display', read_only=True)
    class Meta:
        model = CalendarEvent
        fields = '__all__' 
        read_only_fields = ['id', 'user', 'created_at', 'updated_at', 'sent_reminder', 'external_event_id', 'synced_at_time']