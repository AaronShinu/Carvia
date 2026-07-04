from django.contrib import admin
from .models import Document, FeedbackCV

# Register your models here.
@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('title', 'document_type', 'user', 'is_primary', 'updated_at')
    list_filter = ('document_type', 'is_primary', 'updated_at')
    search_fields = ('title', 'user__email')

@admin.register(FeedbackCV)
class FeedbackCVAdmin(admin.ModelAdmin):
    list_display = ('document', 'user', 'feedback_status', 'feedback_score', 'created_at')
    list_filter = ('feedback_status', 'created_at')