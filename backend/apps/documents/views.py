from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Document, FeedbackCV, FeedbackStatus
from .serializers import DocumentSerializer, FeedbackCVSerializer
from .tasks import generate_cv_feedback

# Create your views here.
class DocumentViewSet(viewsets.ModelViewSet):
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['document_type', 'is_primary']

    def get_queryset(self):
        return Document.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'], url_path='request-cv-feedback')
    def request_cv_feedback(self, request, pk=None):
        document = self.get_object()
        feedback_cv = FeedbackCV.objects.create(document=document, feedback_status=FeedbackStatus.PENDING, user=self.request.user)
        generate_cv_feedback.delay(str(feedback_cv.id))
        serializer = FeedbackCVSerializer(feedback_cv)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
class FeedbackCVViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = FeedbackCVSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return FeedbackCV.objects.filter(document__user=self.request.user)