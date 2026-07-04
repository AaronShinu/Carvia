from django.db import models
import uuid
from django.conf import settings

# Create your models here.
class DocumentCategory(models.TextChoices):
    CV = 'cv', 'Resume / CV'
    COVER_LETTER = 'cover_letter', 'Cover Letter'
    TRANSCRIPT = 'transcript', 'Transcript'
    OTHER = 'other', 'Other'

def document_upload_pathway(instance, filename):
    return f'documents/{instance.user.id}/{uuid.uuid4()}/{filename}'

class Document(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='documents')
    document_type = models.CharField(max_length=20, choices=DocumentCategory.choices, default=DocumentCategory.CV)
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to=document_upload_pathway)
    file_size = models.PositiveIntegerField(blank=True, null=True)
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f"{self.title} ({self.get_document_type_display()})"
    
class FeedbackStatus(models.TextChoices):
    PENDING = 'pending', 'Pending'
    PROCESSING = 'processing', 'Processing'
    COMPLETED = 'completed', 'Completed'
    FAILED = 'failed', 'Failed'

class FeedbackCV(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='feedbacks')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='cv_feedbacks')
    feedback_status = models.CharField(max_length=20, choices=FeedbackStatus.choices, default=FeedbackStatus.PENDING)
    feedback_score = models.PositiveSmallIntegerField(blank=True, null=True)
    feedback_summary = models.TextField(blank=True)
    cv_strengths = models.JSONField(blank=True, default=list)
    cv_improvements = models.JSONField(blank=True, default=list)
    keyword_suggestions = models.JSONField(blank=True, default=list)
    error_message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Feedback for {self.document.title} with status {self.get_feedback_status_display()}"