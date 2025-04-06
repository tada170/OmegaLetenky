import logging

def setup_logger():
    logging.basicConfig(filename='server.log', level=logging.WARN)

    logger = logging.getLogger(__name__)
    return logger
