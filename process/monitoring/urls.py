from django.urls import path

from .views import MetricsView, ProcessesView


urlpatterns = [
    path('metrics/', MetricsView.as_view(), name='metrics'),
    path('processes/', ProcessesView.as_view(), name='processes'),
]