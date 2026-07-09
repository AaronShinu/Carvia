from rest_framework.routers import DefaultRouter
from .views import FeedbackCVViewSet, DocumentViewSet

app_name = 'documents'

router = DefaultRouter()
router.register('feedback-cv', FeedbackCVViewSet, basename='feedback-cv')
router.register('', DocumentViewSet, basename='document')

urlpatterns = router.urls