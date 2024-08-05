# import os

# this_dir = os.path.dirname(__file__)

# for file in os.listdir(this_dir):
#     if file.endswith('.py') and not file.startswith('__'):
#         module = file[:-3]
#         __import__()

from .site_request import router as site
from .get_request import router as get
from .post_request import router as post
from .delete_request import router as delete
from .patch_request import router as patch