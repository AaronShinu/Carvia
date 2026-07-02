from django.contrib import admin
from .models import Application, InterviewStage, Tag
# Register your models here.

class InterviewStageInline(admin.TabularInline):
    model = InterviewStage
    extra = 0

@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('job_title', 'company_name', 'user', 'work_type', 'job_status', 'application_deadline')
    list_filter = ('work_type', 'job_status')
    search_fields = ('job_title', 'company_name', 'user__email')
    inlines = [InterviewStageInline]

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'colour')

@admin.register(InterviewStage)
class InterviewStageAdmin(admin.ModelAdmin):
    list_display = ('application', 'stage_phase', 'scheduled_date', 'completed', 'passed')
    list_filter = ('stage_phase', 'completed')