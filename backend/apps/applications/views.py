from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

from .models import Application, InterviewStage, Tag
from .serializers import ApplicationListSerializer, ApplicationDetailSerializer, InterviewStageSerializer, TagSerializer


# Create your views here.
class ApplicationViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['job_status', 'work_type']
    search_fields = ['company_name', 'job_title']
    ordering_fields = ['applied_date', 'application_deadline', 'updated_at']

    def get_queryset(self):
        return Application.objects.filter(user=self.request.user).prefetch_related('tags', 'interview_stages')
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ApplicationListSerializer
        return ApplicationDetailSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class InterviewStageViewSet(viewsets.ModelViewSet):
    serializer_class = InterviewStageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return InterviewStage.objects.filter(application__user=self.request.user)
    
class TagViewSet(viewsets.ModelViewSet):
    serializer_class = TagSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Tag.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)