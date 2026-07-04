from django.db import models
import uuid
from django.conf import settings

# Create your models here.
class Event(models.TextChoices):
    DEADLINE = 'DEADLINE', 'Deadline'
    INTERVIEW = 'INTERVIEW', 'Interview'
    ASSESSMENT = 'ASSESSMENT', 'Assessment'
    REMINDER = 'REMINDER', 'Reminder'
    OTHER = 'OTHER', 'Other'

class CalendarEvent(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    event_type = models.CharField(max_length=20, choices=Event.choices, default=Event.OTHER)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField(null=True, blank=True)
    all_day = models.BooleanField(default=False)

    application = models.ForeignKey('applications.Application', on_delete=models.CASCADE, null=True, blank=True, related_name='calendar_events')
    interview_stage = models.ForeignKey('applications.InterviewStage', on_delete=models.CASCADE, null=True, blank=True, related_name='calendar_events')
    location = models.TextField(blank=True)
    notes = models.TextField(blank=True)
    enabled_reminder = models.BooleanField(default=False)
    minutes_before_reminder = models.PositiveIntegerField(default=60)
    sent_reminder = models.BooleanField(default=False)

    external_event_id = models.CharField(max_length=255, null=True, blank=True)
    synced_at_time = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['start_time']
        indexes = [models.Index(fields=['user', 'start_time']),]

    def __str__(self):
        return f"{self.title} ({self.event_type}) - {self.start_time}"