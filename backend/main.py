from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psutil
import platform
import time


app = FastAPI()


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# NETWORK SPEED TRACKING
# =========================================================

previous_network = psutil.net_io_counters()
previous_time = time.time()


# =========================================================
# HOME
# =========================================================

@app.get("/")
def home():
    return {
        "message": "PC Performance Monitor API is running"
    }


# =========================================================
# CPU
# =========================================================

@app.get("/api/cpu")
def get_cpu():

    frequency = psutil.cpu_freq()

    return {
        "usage": psutil.cpu_percent(interval=1),
        "cores": psutil.cpu_count(logical=False),
        "threads": psutil.cpu_count(logical=True),
        "frequency": (
            round(frequency.current, 2)
            if frequency
            else 0
        ),
    }


# =========================================================
# MEMORY
# =========================================================

@app.get("/api/memory")
def get_memory():

    memory = psutil.virtual_memory()

    return {
        "total": memory.total,
        "used": memory.used,
        "available": memory.available,
        "percent": memory.percent,
    }


# =========================================================
# DISK
# =========================================================

@app.get("/api/disk")
def get_disk():

    disk = psutil.disk_usage("/")

    return {
        "total": disk.total,
        "used": disk.used,
        "free": disk.free,
        "percent": disk.percent,
    }


# =========================================================
# NETWORK
# =========================================================

@app.get("/api/network")
def get_network():

    network = psutil.net_io_counters()

    return {
        "bytes_sent": network.bytes_sent,
        "bytes_received": network.bytes_recv,
    }


# =========================================================
# SYSTEM
# =========================================================

@app.get("/api/system")
def get_system():

    return {
        "os": platform.system(),
        "os_version": platform.version(),
        "machine": platform.machine(),
        "processor": platform.processor(),
        "hostname": platform.node(),
        "python_version": platform.python_version(),
    }


# =========================================================
# MONITOR
# =========================================================

@app.get("/api/monitor")
def get_monitor():

    memory = psutil.virtual_memory()
    disk = psutil.disk_usage("/")
    network = psutil.net_io_counters()
    frequency = psutil.cpu_freq()

    return {
        "cpu": {
            "usage": psutil.cpu_percent(interval=1),
            "cores": psutil.cpu_count(logical=False),
            "threads": psutil.cpu_count(logical=True),
            "frequency": (
                round(frequency.current, 2)
                if frequency
                else 0
            ),
        },

        "memory": {
            "total": memory.total,
            "used": memory.used,
            "available": memory.available,
            "percent": memory.percent,
        },

        "disk": {
            "total": disk.total,
            "used": disk.used,
            "free": disk.free,
            "percent": disk.percent,
        },

        "network": {
            "bytes_sent": network.bytes_sent,
            "bytes_received": network.bytes_recv,
        },
    }


# =========================================================
# MAIN DASHBOARD METRICS
# =========================================================

@app.get("/api/metrics/")
def get_metrics():

    global previous_network
    global previous_time

    memory = psutil.virtual_memory()
    disk = psutil.disk_usage("/")
    network = psutil.net_io_counters()

    current_time = time.time()

    time_difference = current_time - previous_time

    if time_difference <= 0:
        time_difference = 1


    # =====================================================
    # NETWORK SPEED
    # =====================================================

    download_speed = (
        network.bytes_recv
        - previous_network.bytes_recv
    ) / time_difference

    upload_speed = (
        network.bytes_sent
        - previous_network.bytes_sent
    ) / time_difference


    previous_network = network
    previous_time = current_time


    # =====================================================
    # CPU
    # =====================================================

    cpu_frequency = psutil.cpu_freq()


    # =====================================================
    # UPTIME
    # =====================================================

    uptime_seconds = int(
        time.time() - psutil.boot_time()
    )


    # =====================================================
    # RETURN DASHBOARD DATA
    # =====================================================

    return {

        "cpu": {
            "percent": psutil.cpu_percent(
                interval=0.5
            ),

            "logical_cores": psutil.cpu_count(
                logical=True
            ),

            "physical_cores": psutil.cpu_count(
                logical=False
            ),

            "frequency": (
                round(cpu_frequency.current, 2)
                if cpu_frequency
                else 0
            ),
        },


        "memory": {
            "percent": memory.percent,

            "used_gb": round(
                memory.used / (1024 ** 3),
                2
            ),

            "total_gb": round(
                memory.total / (1024 ** 3),
                2
            ),
        },


        "disk": {
            "percent": disk.percent,

            "free_gb": round(
                disk.free / (1024 ** 3),
                2
            ),
        },


        "network": {
            "download_speed": round(
                download_speed / (1024 ** 2),
                2
            ),

            "upload_speed": round(
                upload_speed / (1024 ** 2),
                2
            ),
        },


        "system": {
            "computer_name": platform.node(),

            "operating_system": platform.system(),
        },


        "uptime_seconds": uptime_seconds,
    }


# =========================================================
# PROCESSES
# =========================================================

@app.get("/api/processes/")
def get_processes():

    processes = []


    for process in psutil.process_iter(
        [
            "pid",
            "name",
            "memory_percent",
            "status",
        ]
    ):

        try:

            # Get CPU usage
            cpu_percent = process.cpu_percent(
                interval=None
            )

            # Get memory information
            memory_info = process.memory_info()

            memory_mb = (
                memory_info.rss
                / (1024 ** 2)
            )


            processes.append({

                "pid": process.info["pid"],

                "name": (
                    process.info["name"]
                    or "Unknown"
                ),

                "cpu_percent": round(
                    cpu_percent,
                    1
                ),

                "memory_percent": round(
                    process.info["memory_percent"]
                    or 0,
                    1
                ),

                "memory_mb": round(
                    memory_mb,
                    2
                ),

                "status": (
                    process.info["status"]
                    or "unknown"
                ),

            })


        except (
            psutil.NoSuchProcess,
            psutil.AccessDenied,
            psutil.ZombieProcess,
        ):
            continue


    # Sort by CPU usage
    processes.sort(
        key=lambda process:
        process["cpu_percent"],
        reverse=True
    )


    return {

        "processes": processes[:20],

        "process_count": len(processes),

    }


@app.get("/api/cpu/details")
def get_cpu_details():
    frequency = psutil.cpu_freq()

    return {
        "usage": psutil.cpu_percent(interval=0.5),
        "frequency": round(frequency.current, 2) if frequency else 0,
        "cores": psutil.cpu_count(logical=False),
        "threads": psutil.cpu_count(logical=True),
        "per_core": psutil.cpu_percent(
            interval=0.5,
            percpu=True
        ),
    }