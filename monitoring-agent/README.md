# Monitoring agent (Stage 5)

This small Python script reads performance information from the computer where it runs. It uses `psutil`; it does not send data anywhere and it does not terminate or modify any process.

## Install and run

Open the `pc-performance-monitor` folder in VS Code. Then open its terminal and run:

```powershell
cd monitoring-agent
py -m pip install -r requirements.txt
py monitor.py
```

For compact JSON output:

```powershell
py monitor.py --json
```

## If `py` cannot run

Reinstall Python from [python.org](https://www.python.org/downloads/windows/) and enable **Add Python to PATH** during setup. Then close and reopen VS Code before retrying the commands above.

## Expected unavailable values

`temperatures` may be `null` because many PCs do not expose sensor data to Windows. `gpu` is intentionally `null` until we add hardware-specific support in a future stage. The script never fabricates either value.
