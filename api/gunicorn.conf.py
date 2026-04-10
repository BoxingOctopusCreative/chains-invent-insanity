import multiprocessing
import os

# So `app:app` resolves when Gunicorn is not started from the `api/` directory.
chdir = os.path.dirname(os.path.abspath(__file__))


def _env_truthy(name: str) -> bool:
    return os.environ.get(name, "").strip().lower() in ("1", "true", "yes", "on")


# GUNICORN_LOG_TO_FILES=1 → access/error logs under ./log/ (relative to chdir).
# Unset or false → accesslog to stdout, errorlog to stderr (typical for containers).
if _env_truthy("GUNICORN_LOG_TO_FILES"):
    _log_dir = os.path.join(chdir, "log")
    os.makedirs(_log_dir, exist_ok=True)
    accesslog = os.path.join(_log_dir, "gunicorn.access.log")
    errorlog = os.path.join(_log_dir, "gunicorn.error.log")
else:
    accesslog = "-"
    errorlog = "-"

bind = "0.0.0.0:8000"
reload = True
# worker_tmp_dir  = '/dev/shm'
workers = multiprocessing.cpu_count() * 2 + 1
threads = 4
worker_class = "gthread"
log_level = "info"
