"""Collect real, locally available PC performance data with psutil."""

import argparse
import json
import platform
import socket
import time

import psutil


def bytes_to_gb(value):
    """Convert bytes to gigabytes and keep the output easy to read."""
    return round(value / (1024 ** 3), 2)


def get_temperatures():
    """Return temperatures when the computer exposes them, otherwise None."""
    try:
        sensor_groups = psutil.sensors_temperatures()
    except (AttributeError, OSError):
        return None

    if not sensor_groups:
        return None

    readings = []
    for group_name, entries in sensor_groups.items():
        for entry in entries:
            if entry.current is not None:
                readings.append({
                    "sensor": group_name,
                    "label": entry.label or "Unnamed sensor",
                    "celsius": entry.current,
                })
    return readings or None


def get_top_processes(limit=5):
    """Get a small list of active processes without changing any process."""
    for process in psutil.process_iter():
        try:
            process.cpu_percent(None)
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            continue

    time.sleep(0.2)
    processes = []
    for process in psutil.process_iter(["pid", "name", "status", "memory_percent"]):
        try:
            info = process.info
            processes.append({
                "name": info["name"] or "Unknown",
                "pid": info["pid"],
                "cpu_percent": process.cpu_percent(None),
                "memory_percent": round(info["memory_percent"] or 0, 2),
                "status": info["status"],
            })
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            continue

    return sorted(processes, key=lambda item: item["cpu_percent"], reverse=True)[:limit]


def collect_metrics():
    """Collect only data the local PC makes available. Never invent a value."""
    # The first call starts psutil's per-core CPU measurement window.
    psutil.cpu_percent(interval=None, percpu=True)
    memory = psutil.virtual_memory()
    network = psutil.net_io_counters()
    disk_io = psutil.disk_io_counters()
    cpu_frequency = psutil.cpu_freq()
    partitions = []

    for partition in psutil.disk_partitions():
        try:
            usage = psutil.disk_usage(partition.mountpoint)
            partitions.append({
                "device": partition.device,
                "mountpoint": partition.mountpoint,
                "filesystem": partition.fstype,
                "total_gb": bytes_to_gb(usage.total),
                "used_gb": bytes_to_gb(usage.used),
                "free_gb": bytes_to_gb(usage.free),
                "percent": usage.percent,
            })
        except OSError:
            continue

    return {
        "collected_at": time.strftime("%Y-%m-%dT%H:%M:%S%z"),
        "cpu": {
            "overall_percent": psutil.cpu_percent(interval=1),
            "per_core_percent": psutil.cpu_percent(interval=None, percpu=True),
            "physical_cores": psutil.cpu_count(logical=False),
            "logical_cores": psutil.cpu_count(logical=True),
            "frequency_mhz": cpu_frequency.current if cpu_frequency else None,
        },
        "memory": {
            "total_gb": bytes_to_gb(memory.total),
            "used_gb": bytes_to_gb(memory.used),
            "available_gb": bytes_to_gb(memory.available),
            "percent": memory.percent,
        },
        "storage": {
            "partitions": partitions,
            "read_mb": round(disk_io.read_bytes / (1024 ** 2), 2) if disk_io else None,
            "write_mb": round(disk_io.write_bytes / (1024 ** 2), 2) if disk_io else None,
        },
        "network": {
            "sent_mb": round(network.bytes_sent / (1024 ** 2), 2),
            "received_mb": round(network.bytes_recv / (1024 ** 2), 2),
        },
        "uptime_seconds": round(time.time() - psutil.boot_time()),
        "temperatures": get_temperatures(),
        "gpu": None,
        "top_processes": get_top_processes(),
        "system": {
            "computer_name": socket.gethostname(),
            "operating_system": platform.platform(),
            "python_version": platform.python_version(),
        },
    }


def main():
    parser = argparse.ArgumentParser(description="Read local PC performance metrics.")
    parser.add_argument("--json", action="store_true", help="Print compact JSON output.")
    args = parser.parse_args()

    metrics = collect_metrics()
    indent = None if args.json else 2
    print(json.dumps(metrics, indent=indent))


if __name__ == "__main__":
    main()
