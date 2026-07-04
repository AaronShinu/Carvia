from rest_framework.routers import DefaultRouter
from .views import FeedbackCVViewSet, DocumentViewSet

app_name = 'documents'

router = DefaultRouter()
router.register('', DocumentViewSet, basename='document')
router.register('feedback-cv', FeedbackCVViewSet, basename='feedback-cv')

urlpatterns = router.urls