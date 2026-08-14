import psutil
from rest_framework.response import Response
from rest_framework.views import APIView


class MetricsView(APIView):
    """Return real data from the local computer as JSON."""

    def get(self, request):
        return Response({
            "cpu_percent": psutil.cpu_percent(interval=1),
        })

# Create your views here.
