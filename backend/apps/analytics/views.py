from django.shortcuts import render
from django.db.models import Count
from django.db.models.functions import TruncWeek
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from apps.applications.models import Application

# Create your views here.
class DashboardSummaryPage(APIView): 
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        applications = Application.objects.filter(user=request.user)

        total = applications.count()
        status_breakdown = dict(applications.values_list('job_status').annotate(count=Count('id')))
        applications_per_week = list(
            applications.exclude(applied_date__isnull=True)
            .annotate(week=TruncWeek('applied_date'))
            .values('week')
            .annotate(count=Count('id'))
            .order_by('week')
        )

        total_interviews = applications.filter(job_status='interview').count()
        total_offers = applications.filter(job_status='offer').count()
        total_rejections = applications.filter(job_status='rejected').count()
        response_rate = round((total_interviews + total_offers + total_rejections) / total * 100, 1) if total else 0
        offer_rate = round(total_offers / total * 100, 1) if total else 0
        
        return Response({
            'total_applications': total,
            'status_breakdown': status_breakdown,
            'applications_per_week': applications_per_week,
            'total_interviews': total_interviews,
            'total_offers': total_offers,
            'total_rejections': total_rejections,
            'response_rate': response_rate,
            'offer_rate': offer_rate,
        })