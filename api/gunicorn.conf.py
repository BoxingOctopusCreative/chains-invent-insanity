import multiprocessing
import os

# So `app:app` resolves when Gunicorn is not started from the `api/` directory.
chdir = os.path.dirname(os.path.abspath(__file__))

bind            = "0.0.0.0:8000"
reload          = True
#worker_tmp_dir  = '/dev/shm'
workers         = multiprocessing.cpu_count() * 2 + 1
threads         = 4
worker_class    = 'gthread'
accesslog       = './log/gunicorn.access.log'
errorlog        = './log/gunicorn.error.log'
log_level       = 'info'
