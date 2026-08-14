import platform
import socket
import time
from pathlib import Path

import psutil
from rest_framework.response import Response
from rest_framework.views import APIView


class MetricsView(APIView):
    """Return real data from the local computer as JSON."""

    def get(self, request):
        memory = psutil.virtual_memory()
        network = psutil.net_io_counters()
        main_disk = psutil.disk_usage(Path.home().anchor or '/')

        return Response({
            "cpu": {
                "percent": psutil.cpu_percent(interval=1),
                "physical_cores": psutil.cpu_count(logical=False),
                "logical_cores": psutil.cpu_count(logical=True),
            },
            "memory": {
                "total_gb": round(memory.total / (1024 ** 3), 2),
                "used_gb": round(memory.used / (1024 ** 3), 2),
                "available_gb": round(memory.available / (1024 ** 3), 2),
                "percent": memory.percent,
            },
            "disk": {
                "total_gb": round(main_disk.total / (1024 ** 3), 2),
                "used_gb": round(main_disk.used / (1024 ** 3), 2),
                "free_gb": round(main_disk.free / (1024 ** 3), 2),
                "percent": main_disk.percent,
            },
            "network": {
                "sent_mb": round(network.bytes_sent / (1024 ** 2), 2),
                "received_mb": round(network.bytes_recv / (1024 ** 2), 2),
            },
            "uptime_seconds": round(time.time() - psutil.boot_time()),
            "system": {
                "computer_name": socket.gethostname(),
                "operating_system": platform.platform(),
            },
        })

# Create your views here.
