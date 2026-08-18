import platform
import socket
import time
from pathlib import Path

import psutil
from rest_framework.response import Response
from rest_framework.views import APIView


# Store the previous network reading
_previous_network = {
    "time": None,
    "sent": None,
    "received": None,
}


class MetricsView(APIView):
    """Return real-time data from the local computer as JSON."""

    def get(self, request):
        global _previous_network

        memory = psutil.virtual_memory()
        network = psutil.net_io_counters()
        main_disk = psutil.disk_usage(Path.home().anchor or '/')

        # Current time and network values
        current_time = time.time()
        current_sent = network.bytes_sent
        current_received = network.bytes_recv

        # Default speed values
        upload_speed = 0
        download_speed = 0

        # Calculate speed if we have a previous reading
        if (
            _previous_network["time"] is not None
            and _previous_network["sent"] is not None
            and _previous_network["received"] is not None
        ):
            elapsed = current_time - _previous_network["time"]

            if elapsed > 0:
                upload_speed = (
                    current_sent - _previous_network["sent"]
                ) / elapsed / (1024 ** 2)

                download_speed = (
                    current_received - _previous_network["received"]
                ) / elapsed / (1024 ** 2)

        # Save current reading for the next request
        _previous_network = {
            "time": current_time,
            "sent": current_sent,
            "received": current_received,
        }

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
                "sent_mb": round(
                    current_sent / (1024 ** 2), 2
                ),
                "received_mb": round(
                    current_received / (1024 ** 2), 2
                ),
                "upload_speed": round(upload_speed, 2),
                "download_speed": round(download_speed, 2),
            },

            "uptime_seconds": round(
                time.time() - psutil.boot_time()
            ),

            "system": {
                "computer_name": socket.gethostname(),
                "operating_system": platform.platform(),
            },
        })


# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
import psutil


class ProcessesView(APIView):

    def get(self, request):
        process_list = []
        process_count = 0

        for process in psutil.process_iter(
            ["pid", "name", "memory_percent"]
        ):
            try:
                process_count += 1

                # Get CPU usage
                cpu_percent = process.cpu_percent(interval=0.1)

                info = process.info

                # Get actual memory usage
                memory_bytes = process.memory_info().rss
                memory_mb = round(
                    memory_bytes / (1024 * 1024),
                    2
                )

                process_list.append({
                    "pid": info["pid"],
                    "name": info["name"] or "Unknown",
                    "cpu_percent": round(cpu_percent, 2),
                    "memory_percent": round(
                        info["memory_percent"] or 0,
                        2
                    ),
                    "memory_mb": memory_mb,
                    "status": process.status(),
                })

            except (
                psutil.NoSuchProcess,
                psutil.AccessDenied,
                psutil.ZombieProcess
            ):
                continue

        # Sort by CPU usage
        process_list.sort(
            key=lambda process: process["cpu_percent"],
            reverse=True
        )

        return Response({
            "processes": process_list[:20],
            "process_count": process_count,
        })