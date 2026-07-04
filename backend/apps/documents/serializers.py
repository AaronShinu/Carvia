from rest_framework import serializers
from .models import FeedbackCV, Document

class DocumentSerializer(serializers.ModelSerializer):
    document_type_display = serializers.CharField(source='get_document_type_display', read_only=True)

    class Meta:
        model = Document
        fields = [ 'id', 'document_type', 'document_type_display', 'title', 'file', 'file_size', 'is_primary', 'created_at', 'updated_at']
        read_only_fields = ['id', 'file_size', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        uploaded_file = validated_data.get('file')
        if uploaded_file:
            validated_data['file_size'] = uploaded_file.size 
        return super().create(validated_data)

class FeedbackCVSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeedbackCV
        fields = ['id', 'document', 'feedback_status', 'feedback_score', 'feedback_summary', 'cv_strengths', 'cv_improvements', 'keyword_suggestions', 'error_message', 'created_at', 'updated_at']
        read_only_fields = fields
        