import logging
import sys
from logging.config import dictConfig


def setup_logging(debug: bool = False):
    log_level = "DEBUG" if debug else "INFO"

    dictConfig(
        {
            "version": 1,
            "disable_existing_loggers": False,
            "formatters": {
                "standard": {
                    "format": "%(asctime)s | %(levelname)s | %(name)s | %(message)s",
                },
            },
            "handlers": {
                "console": {
                    "class": "logging.StreamHandler",
                    "stream": sys.stdout,
                    "formatter": "standard",
                },
            },
            "root": {
                "handlers": ["console"],
                "level": log_level,
            },
        }
    )
