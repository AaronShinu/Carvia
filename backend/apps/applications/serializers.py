from rest_framework import serializers
from .models import Application, InterviewStage, Tag

class TagSerializer(serializers.ModelSerializer): 
    class Meta:
        model = Tag
        fields = ['id', 'name', 'colour']
        read_only_fields = ['id']

class InterviewStageSerializer(serializers.ModelSerializer):
    stage_phase_display = serializers.CharField(source='get_stage_phase_display', read_only=True)

    class Meta:
        model = InterviewStage
        fields = ['id', 'application', 'stage_phase', 'stage_phase_display', 'scheduled_date', 'completed', 'passed', 'link_or_location', 'interviewer', 'job_notes', 'order', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class ApplicationListSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)
    job_status_display = serializers.CharField(source='get_job_status_display', read_only=True)

    class Meta:
        model = Application
        fields = ['id', 'user', 'company_name', 'job_title', 'job_status', 'job_status_display', 'job_url', 'job_location', 'work_type', 'tags', 'applied_date', 'created_at', 'updated_at']

class ApplicationDetailSerializer(serializers.ModelSerializer):
    interview_stages = InterviewStageSerializer(many=True, read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    tag_ids = serializers.PrimaryKeyRelatedField(queryset=Tag.objects.all(), many=True, write_only=True, required=False, source='tags')
    job_status_display = serializers.CharField(source='get_job_status_display', read_only=True)

    class Meta:
        model = Application
        fields = ['id', 'user', 'company_name', 'job_title', 'job_status', 'job_status_display', 'min_salary', 'max_salary', 'job_url', 'job_location', 'work_type', 'tags', 'tag_ids', 'applied_date', 'application_deadline', 'interview_stages', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']